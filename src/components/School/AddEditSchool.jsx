import React, { useState } from 'react';
import InputMask from "react-input-mask";
import { validateEmail } from '../../utils/helper';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import './AddEditSchool.css';

const AddSchoolModal = ({ isModalOpen, onClose, onSubmit, isAdding }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [inepCode, setInepCode] = useState('');
    const [address, setAddress] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [isErrorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')

    const showError = (message) => {
        setErrorMessage(message);
        setErrorVisible(true);

        setTimeout(() => {
            setErrorMessage('');
            setErrorVisible(false);
        }, 3000); // 3 segundos
    }

    const handleSubmit = () => {
        if (!name ||
            !email ||
            !phone ||
            !inepCode ||
            !address ||
            !cnpj) {
            showError('Todos os campos são obrigatórios');
        } else if (!validateEmail(email)) {
            showError('Insira um email válido');
        } else {
            onSubmit({
                name: name,
                email: email,
                phone: phone,
                inepCode: inepCode,
                address: address,
                cnpj: cnpj
            });
        }
    };

    if (!isModalOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Adicionar nova escola</h2>
                <div>
                    <label>
                        Nome
                        <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </label>
                    <label>
                        Email
                        <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </label>
                    <label>
                        Telefone
                        <InputMask className='input-mask' mask="(99)99999-9999" onChange={(e) => setPhone(e.target.value)} value={phone} />
                    </label>
                    <label>
                        Código do INEP
                        <input type="text" name="inepCode" value={inepCode} onChange={(e) => setInepCode(e.target.value)} />
                    </label>
                    <label>
                        Endereço
                        <input type="text" name="address" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </label>
                    <label>
                        CNPJ
                        <InputMask className='input-mask' mask="999.999.999/999-99" onChange={(e) => setCnpj(e.target.value)} value={cnpj} />
                    </label>
                </div>
                <div className="modal-buttons">
                    {
                        isErrorVisible ?
                            <p className='error-message'>{errorMessage}</p> :
                            isAdding ?
                            <LoadingSpinner /> :
                            <>
                                <button onClick={onClose} className="cancel-button">Cancelar</button>
                                <button onClick={handleSubmit} className="add-button">Adicionar</button>
                            </>
                    }
                </div>
            </div>
        </div>
    );
};

export default AddSchoolModal;