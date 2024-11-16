import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import InputMask from "react-input-mask";
import './Gradebook.css';

const TermModal = ({ handleTermModal, onSaveTerm }) => {
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState('');

    const handleError = (message) => {
        setError(message);
        setTimeout(() => {
            setError('');
        }, 2000);
    }

    const handleSaveTerm = () => {
        if (!name || !startDate || !endDate) {
            handleError('Preencha todos os campos')
        } else {
            onSaveTerm({ name, startDate, endDate });
        }
    }

    return (
        <div className='modal-overlay'>
            <div className='modal'>
                <div className='term-form'>
                    <div className='align-right'>
                        <button className="close-button" onClick={() => handleTermModal(false)}>
                            <MdClose className='close-icon' />
                        </button>
                    </div>

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
                            <button className='primary-button' onClick={() => handleSaveTerm()}>Adicionar bimestre</button>
                    }
                </div>

            </div>
        </div>
    )
}

export default TermModal