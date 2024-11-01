import React, { useState, useEffect } from 'react';
import './School.css';
import { MdOutlineAdd } from "react-icons/md";
import AddEditSchool from './AddEditSchool';
import axiosInstance from '../../utils/axiosInstance';
import StatusBar from '../StatusBar/StatusBar';

const School = ({ userInfo }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);
    const [schoolToEdit, setSchoolToEdit] = useState(null);
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getSchools();
    }, []);

    const handleOpenModal = () => {
        setModalOpen(!isModalOpen);
    }

    const showStatusBar = (status) => setStatusMessage({ message: status.message, type: status.type });

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

    const getSchools = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/school/schools/${userInfo._id}`, {
                timeout: 10000
            });

            if (response.status !== 200) {
                showStatusBar({ message: 'Erro ao buscar escolas', type: 'error' });
            } else {
                console.log('GET SCHOOLs',response.data)
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

    const onSelectSchool = (school) => {

    }

    const onCloseModal = () => {
        setSchoolToEdit(null);
        setModalOpen(false);
    }

    return (
        <div className='school-container'>
            {
                isModalOpen ?
                    <AddEditSchool
                        isModalOpen={isModalOpen}
                        onClose={() => onCloseModal()}
                        onSubmit={(school) => onAddSchool(school)}
                        isAdding={loading}
                    /> :
                    <div />
            }

            <div className="school-list">
                {schools.map((school) => (
                    <div
                        key={school._id}
                        className="school-card"
                        onClick={() => onSelectSchool(school)}
                    >
                        <h3>{school.name}</h3>
                        <p>Email: {school.email}</p>
                        <p>Telefone: {school.phone}</p>
                    </div>
                ))}
            </div>

            <button className="circular-button" onClick={handleOpenModal}>
                <MdOutlineAdd className='icon' />
            </button>

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