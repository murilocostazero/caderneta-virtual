import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import './SchoolSubject.css';

const SchoolSubjectModal = ({ closeModal, currentSubject, onAddSubject, onEditSubject, editMode }) => {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [workload, setWorkload] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (currentSubject) {
            setId(currentSubject._id);
            setName(currentSubject.name);
            setWorkload(currentSubject.workload);
        }
    }, [currentSubject]);

    const handleNumberChange = (e) => {
        const inputValue = e;
        const numericValue = inputValue === '' ? '' : parseInt(inputValue, 10); // Converte para número ou mantém vazio
        setWorkload(numericValue);
    };

    const handleErrorMessage = (message) => {
        setError(message);
        setTimeout(() => {
            setError('');
        }, 2000);
    }

    const saveSubject = async () => {
        if (!name || !workload) {
            handleErrorMessage('Preencha todos os campos');
        } else if (!Number.isInteger(workload)) {
            handleErrorMessage('Carga horária deve conter apenas numeros inteiros');
        } else {
            onAddSubject({ name: name, workload: workload })
        }
    }

    return (
        <div className="school-subject-modal">
            <div className="modal-content">
                <h2>{currentSubject ? 'Editar Disciplina' : 'Adicionar Disciplina'}</h2>
                <input
                    type="text"
                    placeholder="Nome da disciplina"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <div className='load-hour-input'>
                    <input
                        type="number"
                        placeholder="Carga horária"
                        value={workload}
                        onChange={(e) => handleNumberChange(e.target.value)}
                    />
                    horas
                </div>
                <div className="subject-actions">
                    {
                        error ?
                            <p className='error-message'>{error}</p> :
                            <>
                                <button className='cancel-button' onClick={closeModal}>Cancelar</button>
                                <button className='save-button' onClick={() => editMode ? onEditSubject({_id: id, name: name, workload: workload}) : saveSubject()}>
                                    {
                                        editMode ?
                                        'Salvar alterações' :
                                        'Salvar'
                                    }
                                </button>
                            </>
                    }
                </div>
            </div>
        </div>
    );
};

export default SchoolSubjectModal;
