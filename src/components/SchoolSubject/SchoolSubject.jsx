import React, { useState, useEffect } from 'react';
import SchoolSubjectModal from './SchoolSubjectModal';
import StatusBar from '../StatusBar/StatusBar';
import './SchoolSubject.css';
import axiosInstance from '../../utils/axiosInstance';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { MdAdd } from "react-icons/md";
import TeachersToSelect from '../TeachersToSelect/TeachersToSelect';

const SchoolSubject = ({ globalSchool }) => {
    const [subjects, setSubjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSubject, setCurrentSubject] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [subjectToRemove, setSubjectToRemove] = useState(null);
    const [statusMessage, setStatusMessage] = useState(null);
    const [myTeachers, setMyTeachers] = useState([]);
    const [showTeachersToSelect, setShowTeachersToSelect] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);

    useEffect(() => {
        getSubjects();
    }, []);

    const showStatusBar = (status) => {
        setStatusMessage({ message: status.message, type: status.type });
        setTimeout(() => {
            setStatusMessage(null);
        }, 2000);
    };

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
                timeout: 20000
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
                timeout: 20000
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

    const getSchoolTeachers = async (subject) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/school/teachers/${globalSchool._id}`, {
                timeout: 20000
            });
            // console.log(response.data.teachers)
            setSelectedSubject(subject);
            setMyTeachers(response.data.teachers);
            setShowTeachersToSelect(true);
        } catch (error) {
            console.error('Erro ao buscar professores:', error);
        }
        setLoading(false);
    }

    const addTeacher = async (teacher) => {
        setLoading(true);
        try {
            const response = await axiosInstance.put(`/subject/${selectedSubject._id}/add-teacher/${teacher._id}`, {
                timeout: 20000
            });

            if (response.status >= 400 && response.status <= 500) {
                showStatusBar({ message: response.data.message, type: 'error' });
            } else {
                getSubjects();
            }
        } catch (error) {
            console.error('Erro ao buscar professores:', error);
            showStatusBar({ message: 'Erro ao buscar professores', type: 'error' });
        }
        setLoading(false);
        handleCancelModal();
    }

    const removeTeacher = async (subjectId, teacherId) => {
        setLoading(true);
        try {
            const response = await axiosInstance.put(`/subject/${subjectId}/remove-teacher/${teacherId}`, {
                timeout: 20000
            });

            if (response.status >= 400 && response.status <= 500) {
                showStatusBar({ message: response.data.message, type: 'error' });
            } else {
                getSubjects();
            }
        } catch (error) {
            console.error('Erro ao buscar professores:', error);
            showStatusBar({ message: 'Erro ao buscar professores', type: 'error' });
        }
        setLoading(false);
        handleCancelModal();
    }

    const handleCancelModal = () => {
        setSelectedSubject(null);
        setShowTeachersToSelect(false);
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
                                    <div className='subject-item-container'>
                                        <div className='row-container'>
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
                                        </div>
                                        {/* <div className='add-teacher-container'>
                                            <button className='ok-button' onClick={() => getSchoolTeachers(subject)}>Adicionar professor</button>

                                            <div className='subject-teachers'>
                                                {
                                                    subject.teachers.length < 1 ?
                                                        <p>Nenhum professor adicionado nessa disciplina</p> :
                                                        subject.teachers.map((teacher) =>
                                                            <div className='remove-teacher-container' key={teacher._id}>
                                                                <p>{teacher.name}</p>
                                                                <button onClick={() => removeTeacher(subject._id, teacher._id)}>
                                                                    <MdClose className='remove-icon' />
                                                                </button>
                                                            </div>
                                                        )
                                                }
                                            </div>
                                        </div> */}
                                    </div>
                                </li>
                            ))}
            </ul>
            <button className="add-button" onClick={() => {
                setEditMode(false);
                openModal();
            }}>
                <MdAdd />
            </button>

            {/* Modal para selecionar um professor */}

            {
                showTeachersToSelect &&
                myTeachers &&
                <TeachersToSelect
                    myTeachers={myTeachers}
                    loading={loading}
                    addTeacher={(teacher) => addTeacher(teacher)}
                    handleCancel={() => handleCancelModal()} />
            }

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
