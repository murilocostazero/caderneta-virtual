import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import StatusBar from '../StatusBar/StatusBar';
import { MdClose, MdPersonRemoveAlt1 } from "react-icons/md";
import './Teacher.css';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const Teacher = ({ globalSchool }) => {
    const [loading, setLoading] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [myTeachers, setMyTeachers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [hoveredTeacher, setHoveredTeacher] = useState(null);
    const [statusMessage, setStatusMessage] = useState(null);
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    const showStatusBar = (status) => setStatusMessage({ message: status.message, type: status.type });

    useEffect(() => {
        getTeachers();
        getSchoolTeachers();
    }, []);

    const getTeachers = async () => {
        try {
            const response = await axiosInstance.get('/get-teachers', {
                timeout: 10000
            });
            setTeachers(response.data);
        } catch (error) {
            console.error('Erro ao buscar professores:', error);
        }
    };

    const getSchoolTeachers = async () => {
        try {
            const response = await axiosInstance.get(`/school/teachers/${globalSchool._id}`, {
                timeout: 10000
            });
            // console.log(response.data.teachers)
            setMyTeachers(response.data.teachers);
        } catch (error) {
            console.error('Erro ao buscar professores:', error);
        }
    };

    const filteredTeachers = teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const clearSearch = () => {
        setSearchQuery('');
    };

    const handleMouseEnter = (teacher) => {
        setHoveredTeacher(teacher);
    };

    const handleMouseLeave = () => {
        setHoveredTeacher(null);
    };

    const handleAddTeacher = async (teacher) => {
        setLoading(true);
        try {
            const response = await axiosInstance.put(`/school/add-teacher/${globalSchool._id}`, {
                teacherId: teacher._id
            }, {
                timeout: 10000
            });

            if (response.status !== 200) {
                showStatusBar({ message: 'Erro ao adicionar professor(a)', type: 'error' });
            } else {
                getSchoolTeachers();
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

    const handleRemoveTeacher = async (teacher) => {
        setSelectedTeacher(teacher);
    }

    const onRemoveTeacher = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.put(`/remove-teacher/${globalSchool._id}/${selectedTeacher._id}`, {
                timeout: 10000
            });
            if (response.status === 404) {
                showStatusBar({ message: response.data.message, type: 'error' });
            } else {
                setSelectedTeacher(null);
                getSchoolTeachers();
            }
        } catch (error) {
            console.error('Erro ao buscar professores:', error);
            showStatusBar({ message: 'Erro ao remover professor(a)', type: 'error' });
        }
        setLoading(false);
    }

    return (
        <div className="teacher-container">
            {/* Barra de Pesquisa */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Buscar professores..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Lista de Professores Disponíveis */}
            <div className="teacher-list">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    filteredTeachers.map((teacher) => (
                        <div
                            key={teacher._id}
                            className='teacher-card-container'
                            onMouseEnter={() => handleMouseEnter(teacher)}
                            onMouseLeave={handleMouseLeave}>
                            <div
                                className="teacher-card">
                                <h3>{teacher.name}</h3>
                                <p>Email: {teacher.email}</p>
                                <p>Telefone: {!teacher.phone ? 'Desconhecido' : teacher.phone}</p>
                            </div>

                            {
                                hoveredTeacher === teacher &&
                                <button
                                    className="access-button"
                                    onClick={() => handleAddTeacher(teacher)}
                                >
                                    {
                                        loading ?
                                            <LoadingSpinner /> :
                                            `Fornecer acesso à(o) ${globalSchool.name}`
                                    }
                                </button>
                            }
                        </div>
                    ))
                )}
            </div>

            {/* Lista de Meus Professores */}
            <div className="my-teachers-container">
                <h2>Professores: {globalSchool.name}</h2>
                {
                    selectedTeacher ?
                        <div className='confirm-container'>
                            {
                                loading ?
                                    <LoadingSpinner /> :
                                    <div className='confirm-remove-teacher'>
                                        <p>Cuidado! Essa ação remove o(a) professor(a) {selectedTeacher.name} da sua lista de colaboradores e não será possível desfazer.</p>
                                        <button className='ok-button' onClick={() => onRemoveTeacher()}>Quero prosseguir</button>
                                        <button className='cancel-button' onClick={() => setSelectedTeacher(null)}>CANCELAR</button>
                                    </div>
                            }
                        </div>
                        :
                        myTeachers.length > 0 ? (
                            myTeachers.map((teacher) => (
                                <div key={teacher._id} className="my-teacher-card">

                                    <div className='teacher-to-edit'>
                                        <h3>{teacher.name}</h3>
                                        <p>Email: {teacher.email}</p>
                                        <p>Telefone: {teacher.phone}</p>
                                    </div>

                                    <MdPersonRemoveAlt1 className='my-teacher-icon' onClick={() => handleRemoveTeacher(teacher)} />
                                </div>
                            ))
                        ) : (
                            <p>Nenhum professor adicionado.</p>
                        )
                }
            </div>
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

export default Teacher;