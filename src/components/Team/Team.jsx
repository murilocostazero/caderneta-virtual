import React, { useState, useEffect } from 'react';
import StatusBar from '../StatusBar/StatusBar';
import { MdOutlineAdd } from "react-icons/md";
import AddOrEditCollab from './AddOrEditCollab';
import axiosInstance from '../../utils/axiosInstance';
import { stringToDate } from '../../utils/helper';
import './Team.css';

const Team = ({ globalSchool }) => {
    const [statusMessage, setStatusMessage] = useState(null);
    const [isAddOrEditCollabVisible, setIsAddOrEditCollabVisible] = useState(false);
    const [selectedCollaber, setSelectedCollaber] = useState(null);
    const [loading, setLoading] = useState(false);
    const [team, setTeam] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        getTeam();
    }, []);

    const showStatusBar = (status) => {
        setStatusMessage({ message: status.message, type: status.type });
        setTimeout(() => {
            setStatusMessage(null);
        }, 2000);
    };

    const handleOpenAddOrEditCollab = (collaber) => {
        if (!collaber) {
            setIsAddOrEditCollabVisible(true);
        } else {
            setSelectedCollaber(collaber);
            setIsAddOrEditCollabVisible(true);
        }
    }

    const handleCancelAddOrEdit = () => {
        setSelectedCollaber(null);
        setIsAddOrEditCollabVisible(false);
    }

    const onAddCollaber = async (collaber) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post(`/`, {
                name: collaber.name,
                email: collaber.email,
                password: collaber.cpf,
                cpf: collaber.cpf,
                phone: collaber.phone,
                address: collaber.address,
                areaOfExpertise: collaber.areaOfExpertise,
                birthDate: stringToDate(collaber.birthDate),
                userType: collaber.userType,
                lastSelectedSchool: globalSchool._id
            }, {
                timeout: 10000
            });

            if (response.status === 201) {
                handleCancelAddOrEdit();
                showStatusBar({ message: 'Agora o colaborador faz parte do time.', type: 'success' });
                getTeam();
            } else {
                showStatusBar({ message: 'Erro ao salvar novo(a) colaborador(a)', type: 'error' });
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

    const onEditCollaber = async (collaber) => {
        setLoading(true);
        try {
            const response = await axiosInstance.put(`/${collaber._id}`, {
                name: collaber.name,
                email: collaber.email,
                cpf: collaber.cpf,
                phone: collaber.phone,
                address: collaber.address,
                areaOfExpertise: collaber.areaOfExpertise,
                birthDate: stringToDate(collaber.birthDate),
                userType: collaber.userType,
                lastSelectedSchool: globalSchool._id
            }, {
                timeout: 10000
            });

            if (response.status === 200) {
                handleCancelAddOrEdit();
                showStatusBar({ message: 'Dados alterados com sucesso.', type: 'success' });
                getTeam();
            } else {
                showStatusBar({ message: 'Erro ao salvar novo(a) colaborador(a)', type: 'error' });
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

    const getTeam = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/get-team/${globalSchool._id}`, {
                timeout: 10000
            });

            if (response.status === 200) {
                setTeam(response.data);
            } else {
                showStatusBar({ message: 'Erro ao buscar colaboradores', type: 'error' });
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

    const filteredTeam = team.filter(collaber =>
        collaber.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='team-container'>

            <h3>Colaboradores</h3>

            <button className="circular-button" onClick={() => handleOpenAddOrEditCollab()}>
                <MdOutlineAdd className='icon' />
            </button>

            <div className='team-list'>
                {
                    filteredTeam.map((collaber) =>
                        <div key={collaber._id} className='list-item' onClick={() => handleOpenAddOrEditCollab(collaber)}>
                            {collaber.name}
                        </div>
                    )
                }
            </div>

            {
                isAddOrEditCollabVisible &&
                <AddOrEditCollab
                    onClose={() => handleCancelAddOrEdit()}
                    onAddCollaber={(collaber) => onAddCollaber(collaber)}
                    onEditCollaber={(collaber) => onEditCollaber(collaber)}
                    selectedCollaber={selectedCollaber} />
            }

            {statusMessage &&
                <StatusBar
                    message={statusMessage.message}
                    type={statusMessage.type}
                    onClose={() => setStatusMessage(null)}
                />
            }
        </div>
    )
}

export default Team