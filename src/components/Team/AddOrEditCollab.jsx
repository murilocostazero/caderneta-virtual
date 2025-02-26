import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';
import InputMask from "react-input-mask";
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { dateToString } from '../../utils/helper';

const AddOrEditCollab = ({ onClose, selectedCollaber, onAddCollaber, onEditCollaber }) => {
    const [name, setName] = useState(selectedCollaber ? selectedCollaber.name : '');
    const [email, setEmail] = useState(selectedCollaber ? selectedCollaber.email : '');
    const [password, setPassword] = useState(selectedCollaber ? selectedCollaber.password : '');
    const [cpf, setCpf] = useState(selectedCollaber ? selectedCollaber.cpf : '');
    const [phone, setPhone] = useState(selectedCollaber ? selectedCollaber.phone : '');
    const [address, setAddress] = useState(selectedCollaber ? selectedCollaber.address : '');
    const [areaOfExpertise, setAreaOfExpertise] = useState(selectedCollaber ? selectedCollaber.areaOfExpertise : '');
    const [birthDate, setBirthDate] = useState(selectedCollaber ? dateToString(selectedCollaber.birthDate) : '');
    const [userType, setUserType] = useState(selectedCollaber ? selectedCollaber.userType : 'teacher');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSave = () => {
        if(!name || !email || !cpf || !phone || !address || !areaOfExpertise || !birthDate || !userType){
            handleError('Preencha todos os campos');
        } else if(!selectedCollaber) {
            onAddCollaber(
                {
                    name, email, password, cpf, phone, address, areaOfExpertise, birthDate, userType
                }
            );
        } else {
            onEditCollaber(
                {
                    _id: selectedCollaber._id , name, email, password, cpf, phone, address, areaOfExpertise, birthDate, userType
                }
            );
        }
    }

    const handleError = (errorMessage) => {
        setError(errorMessage);
        setTimeout(() => { setError('') }, 2000);
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className='modal-close-button-container'>
                    <MdClose className='modal-close-button' onClick={() => onClose()} />
                </div>

                <div>
                    {
                        !selectedCollaber ?
                            <h3>Novo colaborador</h3> :
                            <h3>Editar colaborador</h3>
                    }


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
                            disabled={true}
                            type="password"
                            placeholder="A SENHA INICIAL SERÁ O CPF"
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

                        <label>Tipo de usuário</label>
                        <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                            <option value='manager'>Gestor(a)</option>
                            <option value='teacher'>Professor(a)</option>
                        </select>

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
                                        {
                                            selectedCollaber ?
                                            'Salvar Alterações' :
                                            'Salvar'
                                        }
                                    </button>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddOrEditCollab