// src/pages/ForgetPassword/ForgetPassword.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './ResetPasswordForm.css'; // usa o mesmo CSS do Reset
import axiosInstance from '../../utils/axiosInstance';
import StatusBar from '../../components/StatusBar/StatusBar';

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');
    const [statusMessage, setStatusMessage] = useState(null);

    const showStatusBar = (status) => setStatusMessage({ message: status.message, type: status.type });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Enviando e-mail...');

        try {
            const response = await axiosInstance.post('/forgot-password', {
                email: email
            }, {
                timeout: 20000
            });

            if (response.status === 200) {
                showStatusBar({ type: 'success', message: response.data.message });
                setStatus('Email enviado. Verifique sua caixa de entrada.');
            } else {
                showStatusBar({ message: 'Verifique sua conexão e tente novamente.', type: 'error' });
            }

        } catch (err) {
            showStatusBar({ message: '' + err, type: 'error' });
        }
    };

    return (
        <div className="reset-container">
            <h2 className="reset-title">Recuperar senha</h2>
            <form onSubmit={handleSubmit} className="reset-form">
                <label className="reset-label">Digite seu e-mail. Você receberá um link para a recuperação da sua senha.</label>
                <input
                    type="email"
                    className="reset-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" className="reset-button">
                    Enviar link de recuperação
                </button>
                {status && <p className="reset-status">{status}</p>}
            </form>

            {statusMessage && (
                <StatusBar
                    message={statusMessage.message}
                    type={statusMessage.type}
                    onClose={() => setStatusMessage(null)}
                />
            )}
        </div>
    );
};

export default ForgetPassword;