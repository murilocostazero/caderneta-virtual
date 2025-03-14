import React, { useState, useEffect } from 'react';
import InputMask from "react-input-mask";
import './Student.css';
import { MdClose } from 'react-icons/md';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { dateToString, getCurrentDate, stringToDate } from '../../utils/helper';
import { FaRegTrashAlt } from 'react-icons/fa';

const StudentModal = ({ onCloseModal, onSaveStudent, onEditStudent, selectedStudent, loading, onDeleteStudent }) => {
    const [name, setName] = useState(selectedStudent ? selectedStudent.name : '');
    const [cpf, setCpf] = useState(selectedStudent ? selectedStudent.cpf : '');
    const [birthDate, setBirthDate] = useState(selectedStudent ? dateToString(selectedStudent.birthDate) : '');
    const [contact, setContact] = useState(selectedStudent ? selectedStudent.contact : '');
    const [address, setAddress] = useState(selectedStudent ? selectedStudent.address : '');
    const [guardianName, setGuardianName] = useState(selectedStudent ? selectedStudent.guardian.name : '');
    const [guardianContact, setGuardianContact] = useState(selectedStudent ? selectedStudent.guardian.contact : '');
    const [guardianRelationship, setGuardianRelationship] = useState(selectedStudent ? selectedStudent.guardian.relationship : 'father-mother');
    const [guardianAddress, setGuardianAddress] = useState(selectedStudent ? selectedStudent.guardian.address : '');
    const [error, setError] = useState('');
    const [studentSituation, setStudentSituation] = useState('active');
    const [situationSince, setSituationSince] = useState(getCurrentDate());
    const [confirmRemoveStudent, setConfirmRemoveStudent] = useState(false);

    useEffect(() => {
        handleGetNewSituationSince();

        if (selectedStudent) {
            if (selectedStudent.studentSituation) {
                setStudentSituation(selectedStudent.studentSituation.situation);
                if (selectedStudent.studentSituation.since) {
                    setSituationSince(dateToString(selectedStudent.studentSituation.since))
                }
            }
        }
    }, []);

    const handleError = (message) => {
        setError(message);
        setTimeout(() => {
            setError('');
        }, 2000);
    }

    const handleSave = () => {
        if (!name || !cpf || !birthDate || !contact || !address || !guardianName || !guardianContact || !guardianRelationship || !guardianAddress) {
            handleError('Preencha todos os campos');
        } else if (!selectedStudent) {
            onSaveStudent({
                name,
                cpf,
                birthDate,
                contact,
                address,
                guardian: {
                    name: guardianName,
                    contact: guardianContact,
                    relationship: guardianRelationship,
                    address: guardianAddress
                },
                studentSituation: {
                    situation: 'active'
                }
            });
        } else {
            onEditStudent({
                _id: selectedStudent._id,
                name,
                cpf,
                birthDate,
                contact,
                address,
                guardian: {
                    name: guardianName,
                    contact: guardianContact,
                    relationship: guardianRelationship,
                    address: guardianAddress
                },
                studentSituation: {
                    situation: studentSituation,
                    since: stringToDate(situationSince)
                }
            });
        }
    }

    const handleGetNewSituationSince = () => {
        let today = getCurrentDate();
        setSituationSince(today);
    }

    const onRemoveStudent = () => {
        setConfirmRemoveStudent(!confirmRemoveStudent)
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className='modal-close-button-container'>
                    <MdClose className='modal-close-button' onClick={() => onCloseModal()} />
                </div>
                <h3>{selectedStudent ? 'Alterar estudante' : 'Salvar novo estudante'}</h3>

                <div className='student-form'>
                    <label>Nome</label>
                    <input
                        type="text"
                        placeholder="Ex.: Carlos Eduardo Feitosa"
                        value={name}
                        onChange={(e) => setName(e.target.value)} />

                    <label>CPF</label>
                    <InputMask
                        placeholder='999.999.999-99'
                        className='input-mask'
                        mask="999.999.999-99"
                        onChange={(e) => setCpf(e.target.value)}
                        value={cpf} />

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
                        onChange={(e) => setContact(e.target.value)}
                        value={contact} />

                    <label>Endereço</label>
                    <input
                        type="text"
                        placeholder="Rua Thiago Paraense, 54, Centro, Colinas-Ma"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)} />

                    <label>Nome do responsável</label>
                    <input
                        type="text"
                        placeholder="Ex.: Francisco Pereira Feitosa"
                        value={guardianName}
                        onChange={(e) => setGuardianName(e.target.value)} />

                    <label>Telefone do responsável</label>
                    <InputMask
                        placeholder='(99)98484-1213'
                        className='input-mask'
                        mask="(99)99999-9999"
                        onChange={(e) => setGuardianContact(e.target.value)}
                        value={guardianContact} />

                    <label>Grau de parentesco</label>
                    <select value={guardianRelationship} onChange={(e) => setGuardianRelationship(e.target.value)}>
                        <option value='father-mother'>Pai - Mãe</option>
                        <option value='stepfather-stepmother'>Padrasto - Madrasta</option>
                        <option value='grandfather-grandmother'>Avô - Avó</option>
                        <option value='uncle-aunt'>Tio - Tia</option>
                        <option value='brother-sister'>Irmão - Irmã</option>
                        <option value='other'>Outro</option>
                    </select>

                    <label>Endereço do responsável</label>
                    <input
                        type="text"
                        placeholder="Ex.: Rua Dona Maria Consola, 52, Guanabara, Colinas-MA"
                        value={guardianAddress}
                        onChange={(e) => setGuardianAddress(e.target.value)} />

                    {
                        !selectedStudent ?
                            <div /> :
                            <div className=''>
                                <label>Situação do aluno</label>
                                <select value={studentSituation} onChange={(e) => {
                                    setStudentSituation(e.target.value);
                                    e.target.value !== 'active' && handleGetNewSituationSince();
                                }}>
                                    <option value='active'>Ativo</option>
                                    <option value='transferred'>Transferido</option>
                                    <option value='escaped'>Evadiu</option>
                                </select>

                                {
                                    studentSituation !== 'active' ?
                                        <div>
                                            <label>Desde</label>
                                            <input
                                                type="text"
                                                value={situationSince}
                                                onChange={(e) => setSituationSince(e.target.value)}
                                                placeholder='Ex.: 00/00/0000' />
                                        </div> :
                                        <div />
                                }

                                {
                                    !confirmRemoveStudent ?
                                        <button className='remove-button' onClick={() => onRemoveStudent()}>
                                            <FaRegTrashAlt />
                                            <label>Excluir aluno</label>
                                        </button>
                                        :
                                        <div>
                                            <label>Cuidado! Essa ação não poderá ser desfeita.</label>
                                            <div className='delete-student-buttons'>
                                                <button onClick={() => onRemoveStudent()}>CANCELAR</button>
                                                <button onClick={() => onDeleteStudent(selectedStudent)}>Prosseguir</button>
                                            </div>
                                        </div>
                                }
                            </div>
                    }

                    {
                        error ?
                            <p className='error-message'>{error}</p> :
                            loading ?
                                <LoadingSpinner /> :
                                <button className='student-button' onClick={() => handleSave()}>Salvar</button>
                    }
                </div>
            </div>
        </div>
    )
}

export default StudentModal