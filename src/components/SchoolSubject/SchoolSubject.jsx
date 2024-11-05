import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SchoolSubjectModal from './SchoolSubjectModal';
import StatusBar from '../StatusBar/StatusBar';
import './SchoolSubject.css';
import axiosInstance from '../../utils/axiosInstance';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const SchoolSubject = ({ globalSchool }) => {
    const [subjects, setSubjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSubject, setCurrentSubject] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [subjectToRemove, setSubjectToRemove] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(true);

    useEffect(() => {
        getSubjects();
    }, []);

    const showStatusBar = (status) => setStatusMessage({ message: status.message, type: status.type });

    // Filtra as disciplinas conforme o termo de pesquisa
    const filteredSubjects = subjects.filter(subject =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Abre o modal para adicionar ou editar uma disciplina
    const openModal = (subject = null) => {
        setCurrentSubject(subject);
        setIsModalOpen(true);
    };

    // Fecha o modal
    const closeModal = () => {
        setCurrentSubject(null);
        setIsModalOpen(false);
    };

    // Exclui uma disciplina
    const deleteSubject = async (id) => {
        setLoading(true);
        try {
            const response = await axiosInstance.delete(`/subject/${id}`, {
                timeout: 10000
            });

            if (response.status >= 400 && response.status <= 500) {
                showStatusBar({ message: 'Erro ao remover disciplina', type: 'error' });
            } else if (response.status === 200) {
                showStatusBar({ message: 'Disciplina removida', type: 'success' });
                setSubjectToRemove(null);
                getSubjects();
            }
        } catch (error) {
            console.log(error)
            if (error.code === 'ERR_NETWORK') {
                showStatusBar({ message: 'Verifique sua conexão com a internet', type: 'error' });
            } else {
                showStatusBar({ message: 'Um erro inesperado aconteceu. Tente novamente.', type: 'error' });
            }
        }
        setLoading(false);
    }

    const getSubjects = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/subject/school/${globalSchool._id}`, {
                timeout: 10000
            });

            if (response.status !== 200) {
                showStatusBar({ message: 'Erro ao buscar disciplinas', type: 'error' });
            } else {
                setSubjects(response.data);
            }
        } catch (error) {
            console.log(error)
            if (error.code === 'ERR_NETWORK') {
                showStatusBar({ message: 'Verifique sua conexão com a internet', type: 'error' });
            } else {
                showStatusBar({ message: 'Um erro inesperado aconteceu. Tente novamente.', type: 'error' });
            }
        }
        setLoading(false);
    }

    const onAddSubject = async (subject) => {
        console.log(subject)
        setLoading(true);
        try {
            const response = await axiosInstance.post(`/subject`, {
                name: subject.name,
                workload: subject.workload,
                schoolId: globalSchool._id
            }, {
                timeout: 10000
            });

            if (response.status === 500) {
                showStatusBar({ message: 'Erro ao adicionar disciplina', type: 'error' });
            } else {
                closeModal();
                getSubjects();
            }
        } catch (error) {
            console.log(error)
            if (error.code === 'ERR_NETWORK') {
                showStatusBar({ message: 'Verifique sua conexão com a internet', type: 'error' });
            } else {
                showStatusBar({ message: 'Um erro inesperado aconteceu. Tente novamente.', type: 'error' });
            }
        }
        setLoading(false);
    }

    const onEditSubject = async (subject) => {
        setLoading(true);
        try {
            const response = await axiosInstance.put(`/subject/${subject._id}`, {
                name: subject.name,
                workload: subject.workload
            }, {
                timeout: 10000
            });

            console.log(response)

            if (response.status >= 400 && response.status <= 500) {
                showStatusBar({ message: 'Erro ao alterar disciplina', type: 'error' });
            } else if (response.status === 200) {
                closeModal();
                getSubjects();
            }
        } catch (error) {
            console.log(error)
            if (error.code === 'ERR_NETWORK') {
                showStatusBar({ message: 'Verifique sua conexão com a internet', type: 'error' });
            } else {
                showStatusBar({ message: 'Um erro inesperado aconteceu. Tente novamente.', type: 'error' });
            }
        }
        setLoading(false);
    }

    return (
        <div className="school-subject-container">
            <input
                type="text"
                className="search-bar"
                placeholder="Pesquisar disciplina..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul className="subject-list">
                {
                    loading ?
                        <LoadingSpinner /> :
                        subjectToRemove ?
                            <div className='confirm-container'>
                                <div className='confirm-remove-teacher'>
                                    <p>Cuidado! Essa ação é irreversível. Deseja prosseguir?</p>
                                    <button className='ok-button' onClick={() => deleteSubject(subjectToRemove._id)}>Quero prosseguir</button>
                                    <button className='cancel-button' onClick={() => setSubjectToRemove(null)}>CANCELAR</button>
                                </div>
                            </div> :
                            filteredSubjects.map(subject => (
                                <li key={subject._id} className="subject-item">
                                    <div className="subject-info">
                                        <h4>{subject.name}</h4>
                                        <p>Carga Horária: {subject.workload} horas</p>
                                    </div>
                                    <div className="subject-actions">
                                        <button onClick={() => {
                                            setEditMode(true);
                                            openModal(subject);
                                        }}>Editar</button>
                                        <button onClick={() => setSubjectToRemove(subject)}>Excluir</button>
                                    </div>
                                </li>
                            ))}
            </ul>
            <button className="add-button" onClick={() => {
                setEditMode(false);
                openModal();
            }}>
                +
            </button>

            {/* Modal para adicionar/editar disciplina */}
            {isModalOpen && (
                <SchoolSubjectModal
                    closeModal={closeModal}
                    currentSubject={currentSubject}
                    editMode={editMode}
                    onAddSubject={(subject) => onAddSubject(subject)}
                    onEditSubject={(subject) => onEditSubject(subject)}
                />
            )}

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

export default SchoolSubject;
