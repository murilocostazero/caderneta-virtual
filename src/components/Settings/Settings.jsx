import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import InputMask from "react-input-mask";
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { dateToString, stringToDate } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import StatusBar from '../StatusBar/StatusBar';
import './Settings.css';

const Settings = ({ globalSchool, userInfo }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cpf, setCpf] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [areaOfExpertise, setAreaOfExpertise] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [userType, setUserType] = useState('');
    const [lastSelectedSchool, setLastSelectedSchool] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [statusMessage, setStatusMessage] = useState(null);

    useEffect(() => {
        getCollaber();
    }, []);

    const showStatusBar = (status) => {
        setStatusMessage({ message: status.message, type: status.type });
        setTimeout(() => {
            setStatusMessage(null);
        }, 2000);
    };

    const handleSave = () => {
        if (!name || !email || !password || !cpf || !phone || !address || !areaOfExpertise || !birthDate || !userType) {
            handleError('Preencha todos os campos');
        } else {
            onEditCollaber(
                {
                    _id: userInfo._id, name, email, password, cpf, phone, address, areaOfExpertise, birthDate, userType
                }
            );
        }
    }

    const setCollaber = (collaber) => {
        console.log(collaber)
        setName(collaber.name);
        setEmail(collaber.email);
        setPassword(collaber.password);
        setCpf(collaber.cpf);
        setPhone(collaber.phone);
        setAddress(collaber.address);
        setAreaOfExpertise(collaber.areaOfExpertise);
        setBirthDate(collaber.birthDate);
        setUserType(collaber.userType);
    }

    const getCollaber = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/get-user/${userInfo._id}`, {
                timeout: 10000
            });

            if (response.status === 401) {
                showStatusBar({ message: 'Usuário não encontrado.', type: 'error' });
            } else {
                setCollaber(response.data.user);
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
                password: collaber.password,
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
                showStatusBar({ message: 'Dados alterados com sucesso.', type: 'success' });
                getCollaber();
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

    const handleError = (errorMessage) => {
        setError(errorMessage);
        setTimeout(() => { setError('') }, 2000);
    }

    return (
        <div className="settings-container">
            {
                loading ?
                    <LoadingSpinner /> :
                    <div>
                        <h3>Seus dados</h3>
                        <div className='student-form'>
                            <label>Nome</label>
                            <input
                                type="text"
                                placeholder="Ex.: Carlos Eduardo Feitosa"
                                value={name}
                                onChange={(e) => setName(e.target.value)} />

                            <label>Email</label>
                            <input
                                type="text"
                                placeholder="Ex.: carlos-feitosa@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} />

                            <label>CPF</label>
                            <InputMask
                                placeholder='999.999.999-99'
                                className='input-mask'
                                mask="999.999.999-99"
                                onChange={(e) => setCpf(e.target.value)}
                                value={cpf} />

                            <label>Senha</label>
                            <input
                                type="password"
                                placeholder="Defina sua nova senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} />

                            <label>Nascimento</label>
                            <InputMask
                                placeholder='12/08/2010'
                                className='input-mask'
                                mask="99/99/9999"
                                onChange={(e) => setBirthDate(e.target.value)}
                                value={birthDate} />

                            <label>Telefone</label>
                            <InputMask
                                placeholder='(99)98484-1213'
                                className='input-mask'
                                mask="(99)99999-9999"
                                onChange={(e) => setPhone(e.target.value)}
                                value={phone} />

                            <label>Endereço</label>
                            <input
                                type="text"
                                placeholder="Rua Thiago Paraense, 54, Centro, Colinas-Ma"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)} />

                            {/* <label>Tipo de usuário</label>
                            <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                                <option value='manager'>Gestor(a)</option>
                                <option value='teacher'>Professor(a)</option>
                            </select> */}

                            <label>Área de conhecimento</label>
                            <input
                                type="text"
                                placeholder="Ex.: Letras, pedagogia, educação física..."
                                value={areaOfExpertise}
                                onChange={(e) => setAreaOfExpertise(e.target.value)} />

                            {
                                error ?
                                    <p className='error-message'>{error}</p> :
                                    loading ?
                                        <LoadingSpinner /> :
                                        <button onClick={() => handleSave()}>
                                            Salvar
                                        </button>
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
            }
        </div>
    )
}

export default Settings