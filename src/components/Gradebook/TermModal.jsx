import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import { FaRegTrashAlt } from "react-icons/fa";
import InputMask from "react-input-mask";
import './Gradebook.css';
import { dateToString } from '../../utils/helper';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const TermModal = ({ handleTermModal, onSaveTerm, onEditTerm, selectedTerm, onDeleteTerm, loading }) => {
    const [name, setName] = useState(selectedTerm ? selectedTerm.name : '');
    const [startDate, setStartDate] = useState(selectedTerm ? dateToString(selectedTerm.startDate) : '');
    const [endDate, setEndDate] = useState(selectedTerm ? dateToString(selectedTerm.endDate) : '');
    const [error, setError] = useState('');
    const [confirmRemoveTerm, setConfirmRemoveTerm] = useState(false);

    const handleError = (message) => {
        setError(message);
        setTimeout(() => {
            setError('');
        }, 2000);
    }

    const handleSaveTerm = () => {
        if (!name || !startDate || !endDate) {
            handleError('Preencha todos os campos')
        } else if (!selectedTerm) {
            onSaveTerm({ name, startDate, endDate });
        } else {
            onEditTerm({ _id: selectedTerm._id, name, startDate, endDate });
        }
    }

    const onRemoveTerm = () => {
        setConfirmRemoveTerm(!confirmRemoveTerm);
    }

    return (
        <div className='modal-overlay'>
            <div className='modal'>
                <div className='term-form'>
                    {
                        !confirmRemoveTerm ?
                            <div className='row-container'>
                                <button className='remove-button' onClick={() => onRemoveTerm()}>
                                    <div className='row-container'>
                                        <FaRegTrashAlt />
                                        <label>Remover bimestre</label>
                                    </div>
                                </button>
                                <button className="close-button" onClick={() => handleTermModal(false)}>
                                    <MdClose className='close-icon' />
                                </button>
                            </div> :
                            <div>
                                <label>Cuidado! Essa ação não poderá ser desfeita.</label>
                                <div className='row-container confirm-buttons'>
                                    <button className='primary-button' onClick={() => onRemoveTerm()}>CANCELAR</button>
                                    <button className='remove-button' onClick={() => onDeleteTerm(selectedTerm)}>Prosseguir</button>
                                </div>
                            </div>
                    }

                    <label>
                        Bimestre
                        <input
                            placeholder='1º bimestre'
                            type="text"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)} />
                    </label>

                    <label>Data de início</label>
                    <InputMask
                        placeholder='13/01/2025'
                        className='input-mask'
                        mask="99/99/9999"
                        onChange={(e) => setStartDate(e.target.value)}
                        value={startDate} />

                    <label>Data de término</label>
                    <InputMask
                        placeholder='28/02/2025'
                        className='input-mask'
                        mask="99/99/9999"
                        onChange={(e) => setEndDate(e.target.value)}
                        value={endDate} />

                    {
                        error ?
                            <p className='error-message'>{error}</p> :
                            loading ?
                                <LoadingSpinner /> :
                                <button className='primary-button' onClick={() => handleSaveTerm()}>
                                    {
                                        !selectedTerm ?
                                            'Adicionar bimestre' :
                                            'Editar bimestre'
                                    }
                                </button>
                    }
                </div>

            </div>
        </div>
    )
}

export default TermModal