import React, { useState, useEffect } from 'react';
import ClassroomModal from './ClassroomModal'; // Supondo que você tenha um componente Modal
import axiosInstance from '../../utils/axiosInstance';
import { MdEdit, MdDelete } from "react-icons/md";
import './Classroom.css';
import StatusBar from '../StatusBar/StatusBar';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const Classroom = ({ globalSchool }) => {
    const [classrooms, setClassrooms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentClassroom, setCurrentClassroom] = useState(null); // Armazena a turma a ser editada ou criada
    const [statusMessage, setStatusMessage] = useState(null);

    // Função para buscar todas as turmas da API
    useEffect(() => {
        getClassrooms();
    }, []);

    const showStatusBar = (status) => setStatusMessage({ message: status.message, type: status.type });

    const getClassrooms = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/classroom/${globalSchool._id}/classes`, {
                timeout: 10000
            });

            if (response.status !== 200) {
                showStatusBar({ message: 'Erro ao buscar escolas', type: 'error' });
            } else {
                setClassrooms(response.data);
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

    // Função para abrir a modal (se tiver uma turma, é para edição; caso contrário, é uma nova turma)
    const handleOpenModal = (classroom = null) => {
        setCurrentClassroom(classroom);
        setIsModalOpen(true);
    };

    // Função para fechar a modal
    const handleCloseModal = () => {
        setCurrentClassroom(null);
        setIsModalOpen(false);
    };

    // Função para buscar o termo de pesquisa
    const filteredClassrooms = classrooms.filter(classroom =>
        classroom.grade.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Função para salvar a turma (adicionar ou atualizar)
    const handleSaveClassroom = async (classroomData) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post(`/classroom`, {
                grade: classroomData.grade,
                name: classroomData.name,
                shift: classroomData.shift,
                school: globalSchool._id
            }, {
                timeout: 10000
            });

            if (response.status === 201) {
                handleCloseModal();
                getClassrooms();
            } else {
                showStatusBar({ message: 'Erro ao salvar nova turma', type: 'error' });
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
    };

    const handleEditClassroom = async (classroomData) => {
        setLoading(true);
        try {
            const response = await axiosInstance.put(`/classroom/${currentClassroom._id}`, {
                grade: classroomData.grade,
                name: classroomData.name,
                shift: classroomData.shift
            }, {
                timeout: 10000
            });

            if (response.status === 200) {
                handleCloseModal();
                setCurrentClassroom(null);
                getClassrooms();
            } else {
                showStatusBar({ message: 'Erro ao salvar nova turma', type: 'error' });
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
    };

    // Função para excluir uma turma
    const handleDeleteClassroom = async (classroom) => {
        if (classroom.totalStudents > 0) {
            showStatusBar({ message: 'Para excluir uma turma, ela deve estar sem alunos.', type: 'error' });
        } else {
            setLoading(true);
            try {
                const response = await axiosInstance.delete(`/classroom/${classroom._id}`, {
                    timeout: 10000
                });

                if (response.status === 200) {
                    showStatusBar({ message: 'Turma excluída com sucesso', type: 'success' });
                    getClassrooms();
                } else {
                    showStatusBar({ message: 'Erro ao salvar nova turma', type: 'error' });
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
    };

    return (
        <div className="classroom-container">
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Pesquisar turmas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="classroom-list">
                {
                    loading ?
                        <LoadingSpinner /> :
                        filteredClassrooms.length < 1 ?
                            <h3>Nenhuma turma adicionada</h3> :
                            filteredClassrooms.map(classroom => (
                                <div key={classroom._id} className="classroom-item">
                                    <div className="classroom-info">
                                        <h4>{classroom.grade}º ano {classroom.name}</h4>
                                        <p>{classroom.shift}</p>
                                        <p>Alunos: {classroom.totalStudents}</p>
                                    </div>
                                    <div className="classroom-actions">
                                        <button
                                            onClick={() => handleOpenModal(classroom)}>
                                            Editar
                                            {/* <MdEdit className='classroom-actions-edit' /> */}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClassroom(classroom)}>
                                            Remover
                                            {/* <MdDelete className='classroom-actions-delete' /> */}
                                        </button>
                                    </div>
                                </div>
                            ))
                }
            </div>

            <button className="add-button" onClick={() => handleOpenModal()}>
                +
            </button>

            {isModalOpen && (
                <ClassroomModal 
                    onClose={handleCloseModal} 
                    handleSaveClassroom={(classroomData) => handleSaveClassroom(classroomData)}
                    currentClassroom={currentClassroom}
                    handleEditClassroom={(classroomData) => handleEditClassroom(classroomData)} />
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

export default Classroom;