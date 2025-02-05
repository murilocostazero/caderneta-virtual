import React, { useState, useEffect } from 'react';
import './School.css';
import { MdOutlineAdd, MdCheckCircle, MdEdit, MdClose } from "react-icons/md";
import AddEditSchool from './AddEditSchool';
import axiosInstance from '../../utils/axiosInstance';
import StatusBar from '../StatusBar/StatusBar';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const School = ({ userInfo, setGlobalSchool }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [hoveredSchool, setHoveredSchool] = useState(null);

    useEffect(() => {
        if (userInfo.userType === 'manager') {
            getSchools();
        } else {
            getSchool();
        }
    }, []);

    const handleOpenModal = () => {
        setModalOpen(!isModalOpen);
    }

    const showStatusBar = (status) => {
        setStatusMessage({ message: status.message, type: status.type });
        setTimeout(() => {
            setStatusMessage(null);
        }, 2000);
    };

    const onAddSchool = async (school) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post('/school', {
                name: school.name,
                email: school.email,
                phone: school.phone,
                inepCode: school.inepCode,
                address: school.address,
                cnpj: school.cnpj,
                userId: userInfo._id
            }, {
                timeout: 10000
            });

            if (response.status >= 400 && response.status <= 501) {
                showStatusBar({ message: response.data.message, type: 'error' });
            } else {
                onCloseModal();
                showStatusBar({ message: 'Escola adicionada', type: 'success' });
                getSchools();
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

    const onEditSchool = async (school) => {
        setLoading(true);
        try {
            const response = await axiosInstance.put(`/school/${school._id}`, {
                name: school.name,
                email: school.email,
                phone: school.phone,
                inepCode: school.inepCode,
                address: school.address,
                cnpj: school.cnpj,
                userId: userInfo._id
            }, {
                timeout: 10000
            });

            if (response.status >= 400 && response.status <= 501) {
                showStatusBar({ message: response.data.message, type: 'error' });
            } else {
                onCloseModal();
                showStatusBar({ message: 'Alterações feitas', type: 'success' });
                getSchools();
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

    const getSchools = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/school/schools/${userInfo._id}`, {
                timeout: 10000
            });

            if (response.status !== 200) {
                showStatusBar({ message: 'Erro ao buscar escolas', type: 'error' });
            } else {
                setSchools(response.data);
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

    const getSchool = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/school/${userInfo.lastSelectedSchool}`, {
                timeout: 10000
            });

            if (response.status !== 200) {
                showStatusBar({ message: 'Erro ao buscar escolas', type: 'error' });
            } else {
                setSchools([response.data]);
                setSelectedSchool(response.data);
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

    const onSelectSchool = async (school) => {
        await setSelectedSchool(school);
        setModalOpen(true);
    }

    const onRemoveSchool = async (schoolId) => {
        setLoading(true);
        try {
            const response = await axiosInstance.delete(`/school/${schoolId}`, {
                timeout: 10000
            });

            if (response.status >= 400 && response.status <= 501) {
                showStatusBar({ message: response.data.message, type: 'error' });
            } else {
                onCloseModal();
                showStatusBar({ message: 'Alterações feitas', type: 'success' });
                getSchools();
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

    const onCloseModal = () => {
        setSelectedSchool(null);
        setModalOpen(false);
    }

    const handleSelectSchool = async (school) => {
        //Diferende do onSelectSchool, que seleciona a escola e abre a modal para editá-la. 
        //o handleSelectSchool serve pra mandarmos pro banco qual será a escola a carregar os dados
        //de turmas, alunos e etc.

        setLoading(true);
        try {
            const response = await axiosInstance.put(`/update-last-school/${userInfo._id}`, {
                schoolId: school._id
            }, {
                timeout: 10000
            });

            if (response.status >= 400 && response.status <= 501) {
                showStatusBar({ message: response.data.message, type: 'error' });
            } else {
                setGlobalSchool(school);
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

    const filteredSchools = schools.filter(school =>
        school.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='school-container'>
            {
                isModalOpen ?
                    <AddEditSchool
                        isModalOpen={isModalOpen}
                        onClose={() => onCloseModal()}
                        onSubmit={(school) => onAddSchool(school)}
                        onEdit={(school) => onEditSchool(school)}
                        onRemove={(schoolId) => onRemoveSchool(schoolId)}
                        isAdding={loading}
                        selectedSchool={selectedSchool}
                    /> :
                    <div />
            }

            {/* Barra de Pesquisa com Botão de Limpeza */}
            { /*
                filteredSchools.length > 0 && userInfo.userType === 'manager' ?
                    <div className="search-bar-container">
                        <input
                            type="text"
                            className="search-bar"
                            placeholder="Buscar escola..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button className="clear-search" onClick={() => setSearchQuery('')}>
                                <MdClose size={20} />
                            </button>
                        )}
                    </div> :
                    <div /> */
            }

            <div className="school-list">
                {
                    loading ?
                        <LoadingSpinner /> :
                        filteredSchools.length < 1 ?
                            <p className='no-school-message'>
                                {userInfo.userType === 'manager' ? 'Clique no botão + para cadastrar sua escola.' : 'Você ainda não tem acesso à sua escola. Entre em contato com o seu gestor escolar.'}
                            </p> :
                            filteredSchools.map((school) => (
                                <div
                                    key={school._id}
                                    className="school-card"
                                    onMouseEnter={() => setHoveredSchool(school._id)}
                                    onMouseLeave={() => setHoveredSchool(null)}
                                    style={{ backgroundColor: !userInfo.lastSelectedSchool || userInfo.lastSelectedSchool !== school._id ? '#FFF' : 'rgba(0, 123, 255, 0.17)' }}
                                >
                                    <div className='school-data'>
                                        <h3>{school.name}</h3>
                                        <p>Email: {school.email}</p>
                                        <p>Telefone: {school.phone}</p>
                                    </div>

                                    {
                                        hoveredSchool === school._id && userInfo.userType === 'manager' &&
                                        <div className='school-buttons'>
                                            <button
                                                className="check-button"
                                                onClick={() => handleSelectSchool(school)}
                                            >
                                                <MdCheckCircle size={24} />
                                            </button>
                                            <button
                                                className="edit-button"
                                                onClick={() => onSelectSchool(school)}
                                            >
                                                <MdEdit size={24} />
                                            </button>
                                        </div>
                                    }
                                </div>
                            ))}
            </div>

            {
                userInfo.userType !== 'teacher' ?
                    <button className="circular-button" onClick={handleOpenModal}>
                        <MdOutlineAdd className='icon' />
                    </button> :
                    <div />
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

export default School