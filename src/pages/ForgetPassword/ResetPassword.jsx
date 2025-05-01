// src/pages/ForgetPassword/ResetPasswordForm.jsx
import React, { useState, useEffect } from 'react';
import './ResetPasswordForm.css'; // importa o CSS
import { useNavigate, useLocation } from 'react-router-dom';
import StatusBar from '../../components/StatusBar/StatusBar';
import axiosInstance from '../../utils/axiosInstance';
import weak from '../../assets/images/weak.png';
import strong from '../../assets/images/strong.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ResetPasswordForm = () => {
    const [newPassword, setNewPassword] = useState('');
    const [status, setStatus] = useState('');
    const [statusMessage, setStatusMessage] = useState(null);
    const [validPassword, setValidPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('weak');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const showStatusBar = (status) => setStatusMessage({ message: status.message, type: status.type });

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (!token) {
            navigate('/login'); // Redireciona se não houver token
        }
    }, [location, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Redefinindo...');
        try {
            const response = await axiosInstance.post('/reset-password', {
                token,
                newPassword
            }, {
                timeout: 20000
            });

            if (response.status === 200) {
                showStatusBar({ type: 'success', message: response.data.message });
                navigate('/', { replace: true });
            }

        } catch (err) {
            showStatusBar({ type: 'error', message: err });
        }
    };

    const validatePassword = (password) => {
        setNewPassword(password);

        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
        if (regex.test(password)) {
            setPasswordStrength('strong');
            setValidPassword(true);
        } else {
            setPasswordStrength('weak');
            setValidPassword(false);
        }
    }

    return (
        <div className="reset-container">
            <h2 className="reset-title">Redefinir senha</h2>
            <form onSubmit={handleSubmit} className="reset-form">
                <label className="reset-label">Nova senha</label>
                <div className='password-input-container'>
                    <input
                        type={!showPassword ? "password" : "text"}
                        className="reset-input"
                        value={newPassword}
                        onChange={(e) => validatePassword(e.target.value)}
                        required
                    />

                    {
                        showPassword ?
                            <FaEyeSlash onClick={() => setShowPassword(!showPassword)} className="login-icon password-icon" /> :
                            <FaEye onClick={() => setShowPassword(!showPassword)} className="login-icon password-icon" />
                    }
                </div>

                <div className='password-strength-div'>
                    <div className='strength-container'>
                        <div className='strength-circle'>
                            <img
                                src={passwordStrength === 'weak' ? weak : strong}
                                alt='Força da senha'
                                className='password-strength' />
                        </div>
                        {
                            passwordStrength === 'weak' ?
                                <span className='weak'>Fraca</span>
                                :
                                <span className='strong'>Forte</span>
                        }
                    </div>
                </div>
                <span className='password-tip'>Misture letras, números e caracteres especiais para ter uma senha forte</span>
                <button
                    type="submit"
                    disabled={!validPassword}
                    className={validPassword ? "reset-button" : "reset-button-disabled"}>
                    Redefinir senha
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

export default ResetPasswordForm;