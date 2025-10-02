import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import StatusBar from '../StatusBar/StatusBar';
import './Kindergarten.css';
import AddOrEditExperience from './AddOrEditExperience';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { MdEdit } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';

const Kindergarten = ({ globalSchool }) => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);
    const [addOrEditExperienceVisible, setAddOrEditExperienceVisible] = useState(false);
    const [selectedCriteria, setSelectedCriteria] = useState(null);

    useEffect(() => {
        getExperienceFields();
    }, []);

    const showStatusBar = (status) => {
        setStatusMessage({ message: status.message, type: status.type });
        setTimeout(() => {
            setStatusMessage(null);
        }, 2000);
    };

    const getExperienceFields = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/experience-field/school/${globalSchool._id}`, {
                timeout: 20000
            });

            if (response.status === 200) {
                setExperiences(response.data);
            } else {
                showStatusBar({ type: 'error', message: 'Erro ao buscar campos' });
            }
        } catch (error) {
            console.log(error)
            if (error.code === 'ERR_NETWORK') {
                showStatusBar({ type: 'error', message: 'Verifique sua conexão com a internet' });
            } else {
                showStatusBar({ type: 'error', message: 'Um erro inesperado aconteceu. Tente novamente.' });
            }
        }
        setLoading(false);
    }

    const handleOpenModal = () => {
        setAddOrEditExperienceVisible(true);
    }

    const onSaveExperience = async (experience) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post(`/experience-field/`, {
                name: experience.name,
                description: experience.description,
                bnccCodes: experience.bnccCodes,
                evaluationCriteria: experience.evaluationCriteria,
                school: globalSchool._id
            }, {
                timeout: 20000
            });

            if (response.status === 201) {
                getExperienceFields();
            } else {
                showStatusBar({ type: 'error', message: 'Erro ao adicionar campos' });
            }
        } catch (error) {
            console.log(error)
            if (error.code === 'ERR_NETWORK') {
                showStatusBar({ type: 'error', message: 'Verifique sua conexão com a internet' });
            } else {
                showStatusBar({ type: 'error', message: 'Um erro inesperado aconteceu. Tente novamente.' });
            }
        }
        setLoading(false);
    }

    const handleRemoveCriteria = async (experienceId) => {
        setLoading(true);
        try {
            const response = await axiosInstance.delete(`/experience-field/${experienceId}`, {
                timeout: 20000
            });

            if (response.status === 200) {
                getExperienceFields();
            } else {
                showStatusBar({ type: 'error', message: 'Erro ao remover campos' });
            }
        } catch (error) {
            console.log(error)
            if (error.code === 'ERR_NETWORK') {
                showStatusBar({ type: 'error', message: 'Verifique sua conexão com a internet' });
            } else {
                showStatusBar({ type: 'error', message: 'Um erro inesperado aconteceu. Tente novamente.' });
            }
        }
        setLoading(false);
    }

    const handleEditCriteria = (criteria) => {
        setSelectedCriteria(criteria);
        handleOpenModal();
    }

    return (
        <div className='kindergarten-container'>
            <h2>Campos de experiências</h2>
            <p>A BNCC divide a Educação Infantil em cinco campos de experiência, ao invés de disciplinas tradicionais. Os professores devem avaliar o desenvolvimento das crianças dentro desses campos:</p>

            {
                addOrEditExperienceVisible ?
                    <AddOrEditExperience
                        handleClose={() => {setAddOrEditExperienceVisible(false); setSelectedCriteria(null)}}
                        handleOnSave={(experience) => onSaveExperience(experience)}
                        selectedCriteria={selectedCriteria} /> :
                    <div />
            }

            {
                !experiences || experiences.length < 1 ?
                    <p>Clique em NOVO CAMPO para adicionar um novo Campo de Experiência</p> :
                    experiences.map((experience) => (
                        <div className='kg-list-item' key={experience._id}>
                            <div>
                                <label><label className='bold-label'>Campo: </label>{experience.name}</label>
                                <label><label className='bold-label'>Descrição: </label>{experience.description}</label>
                                <label className='bold-label'>Códigos BNCC:</label> {
                                    experience.bnccCodes.map((code) => (
                                        <div className='subitem-list' key={code._id}>
                                            <label><label className='bold-label'>Código: </label>{code.code}</label>
                                            <label><label className='bold-label'>Descrição: </label>{code.description}</label>
                                        </div>
                                    ))
                                }
                                <label className='bold-label'>Critérios de avaliação:</label> {
                                    experience.evaluationCriteria.map((criteria) => (
                                        <div className='subitem-list' key={criteria._id}>
                                            <label><label className='bold-label'>Código: </label>{criteria.label}</label>
                                            <label><label className='bold-label'>Descrição: </label>{criteria.description}</label>
                                        </div>
                                    ))
                                }
                            </div>
                            <div>
                                <MdEdit className='kg-list-icon' onClick={() => handleEditCriteria(experience)} />
                                <FaTrash className='kg-list-icon' onClick={() => handleRemoveCriteria(experience._id)} />
                            </div>
                        </div>
                    ))
            }

            {
                loading ?
                    <LoadingSpinner /> :
                    <button className='primary-button kg-primary-button' onClick={() => handleOpenModal()}>
                        NOVO CAMPO
                    </button>
            }

            {statusMessage && (
                <StatusBar
                    message={statusMessage.message}
                    type={statusMessage.type}
                    onClose={() => setStatusMessage(null)}
                />
            )}
        </div>
    )
}

export default Kindergarten