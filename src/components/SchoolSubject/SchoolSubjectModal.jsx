import React, { useState, useEffect } from 'react';
import './SchoolSubject.css';

const SchoolSubjectModal = ({ closeModal, currentSubject, onAddSubject, onEditSubject, editMode }) => {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [workloads, setWorkloads] = useState({
        elementary: '',
        highSchool: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (currentSubject) {
            setId(currentSubject._id);
            setName(currentSubject.name);
            // Se já existir workloads no currentSubject, usa eles
            if (currentSubject.workloads) {
                setWorkloads({
                    elementary: currentSubject.workloads.elementary || '',
                    highSchool: currentSubject.workloads.highSchool || ''
                });
            } else {
                // Para compatibilidade com dados antigos que ainda usam workload único
                setWorkloads({
                    elementary: currentSubject.workload || '',
                    highSchool: currentSubject.workload || ''
                });
            }
        }
    }, [currentSubject]);

    const handleNumberChange = (level, value) => {
        const numericValue = value === '' ? '' : parseInt(value, 10);
        setWorkloads(prev => ({
            ...prev,
            [level]: numericValue
        }));
    };

    const handleErrorMessage = (message) => {
        setError(message);
        setTimeout(() => {
            setError('');
        }, 2000);
    }

    const saveSubject = async () => {
        if (!name || !workloads.elementary || !workloads.highSchool) {
            handleErrorMessage('Preencha todos os campos');
            return;
        }

        if (!Number.isInteger(workloads.elementary) || !Number.isInteger(workloads.highSchool)) {
            handleErrorMessage('Cargas horárias devem conter apenas números inteiros');
            return;
        }

        if (workloads.elementary < 0 || workloads.highSchool < 0) {
            handleErrorMessage('Cargas horárias não podem ser negativas');
            return;
        }

        onAddSubject({
            name: name,
            workloads: {
                elementary: workloads.elementary,
                highSchool: workloads.highSchool
            }
        });
    }

    const handleEditSubject = () => {
        if (!name || !workloads.elementary || !workloads.highSchool) {
            handleErrorMessage('Preencha todos os campos');
            return;
        }

        if (!Number.isInteger(workloads.elementary) || !Number.isInteger(workloads.highSchool)) {
            handleErrorMessage('Cargas horárias devem conter apenas números inteiros');
            return;
        }

        if (workloads.elementary < 0 || workloads.highSchool < 0) {
            handleErrorMessage('Cargas horárias não podem ser negativas');
            return;
        }

        onEditSubject({
            _id: id,
            name: name,
            workloads: {
                elementary: workloads.elementary,
                highSchool: workloads.highSchool
            }
        });
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

                <div className='workloads-container'>
                    <div className='load-hour-input'>
                        <label>Carga horária-FUND</label>
                        <input
                            type="number"
                            placeholder="CH"
                            value={workloads.elementary}
                            onChange={(e) => handleNumberChange('elementary', e.target.value)}
                            min="0"
                        />
                        <span>horas</span>
                    </div>

                    <div className='load-hour-input'>
                        <label>Carga horária-EM</label>
                        <input
                            type="number"
                            placeholder="CH"
                            value={workloads.highSchool}
                            onChange={(e) => handleNumberChange('highSchool', e.target.value)}
                            min="0"
                        />
                        <span>horas</span>
                    </div>
                </div>

                <div className="subject-actions">
                    {
                        error ?
                            <p className='error-message'>{error}</p> :
                            <>
                                <button className='cancel-button' onClick={closeModal}>Cancelar</button>
                                <button className='save-button' onClick={() => editMode ? handleEditSubject() : saveSubject()}>
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