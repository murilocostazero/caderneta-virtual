import React, { useState } from 'react';
import InputMask from "react-input-mask";
import { validateEmail } from '../../utils/helper';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { MdOutlineClose } from "react-icons/md";
import './AddEditSchool.css';

const AddSchoolModal = ({ isModalOpen, onClose, onSubmit, onEdit, onRemove, isAdding, selectedSchool }) => {
    const [name, setName] = useState(selectedSchool ? selectedSchool.name : '');
    const [email, setEmail] = useState(selectedSchool ? selectedSchool.email : '');
    const [phone, setPhone] = useState(selectedSchool ? selectedSchool.phone : '');
    const [inepCode, setInepCode] = useState(selectedSchool ? selectedSchool.inepCode : '');
    const [address, setAddress] = useState(selectedSchool ? selectedSchool.address : '');
    const [cnpj, setCnpj] = useState(selectedSchool ? selectedSchool.cnpj : '');
    const [isErrorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);

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
        } else if (!selectedSchool) {
            onSubmit({
                name: name,
                email: email,
                phone: phone,
                inepCode: inepCode,
                address: address,
                cnpj: cnpj
            });
        } else {
            onEdit({
                _id: selectedSchool._id,
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
                <div className='close-container'>
                    <MdOutlineClose className='close-icon' onClick={() => onClose()} />

                </div>
                <h2>{selectedSchool ? 'Editar dados da escola' : 'Adicionar nova escola'}</h2>
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
                                showConfirmation ?
                                    <div className='trash-container'>
                                        <p>Será impossível desfazer a exclusão da escola. Deseja prosseguir?</p>
                                        <div className='trash-buttons-container'>
                                            <button className='cancel-trash-button' onClick={() => setShowConfirmation(false)}>
                                                Cancelar
                                            </button>
                                            <button className='trash-button' onClick={() => onRemove(selectedSchool._id)}>
                                                PROSSEGUIR
                                            </button>
                                        </div>
                                    </div> :
                                    <>
                                        <button onClick={() => setShowConfirmation(true)} className="cancel-button">Excluir escola</button>
                                        <button onClick={handleSubmit} className="add-button">
                                            {
                                                selectedSchool ?
                                                    'Salvar alterações' :
                                                    'Adicionar'
                                            }
                                        </button>
                                    </>
                    }
                </div>
            </div>
        </div>
    );
};

export default AddSchoolModal;