import React, { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance';


const ChangeClassroom = ({ onCloseModal, selectedClassroom, studentToChange, classrooms, changeClassroom }) => {
    const [selectedOption, setSelectedClassroom] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
    }, []);

    const handleError = (message) => {
        setError(message);
        setTimeout(() => {
            setError('');
        }, 2000);
    }

    const handleChangeStudentClassroom = async () => {
        if (!selectedOption) {
            handleError('Nenhuma turma selecionada');
        } else {
            setLoading(true);
            try {
                const response = await axiosInstance.patch(`/student/${studentToChange._id}/change-classroom`, {
                    newClassroomId: selectedOption
                }, {
                    timeout: 10000
                });

                if (response.status === 200) {
                    changeClassroom(response.data.newClassroom);
                } else {
                    handleError('Erro ao mudar o aluno de turma');
                }
            } catch (error) {
                console.log(error)
                if (error.code === 'ERR_NETWORK') {
                    handleError('Verifique sua conexão com a internet');
                } else {
                    handleError('Um erro inesperado aconteceu. Tente novamente.');
                }
            }
            setLoading(false);
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className='modal-close-button-container'>
                    <MdClose className='modal-close-button' onClick={() => onCloseModal()} />
                </div>

                <div className='change-classroom-container'>
                    <h3>Para qual sala {studentToChange.name} vai mudar?</h3>

                    <select id="select" value={selectedOption} onChange={(e) => setSelectedClassroom(e.target.value)}>
                        <option value="">Escolha</option>
                        {classrooms.map((classroom) => (
                            <option key={classroom._id} value={classroom._id}>
                                {classroom.grade}º ano {classroom.name} - {classroom.shift}
                            </option>
                        ))}
                    </select>

                    {
                        error ?
                            <p className='error-message'>{error}</p> :
                            <button
                                onClick={() => handleChangeStudentClassroom()}
                                className='primary-button'>
                                Salvar alterações
                            </button>
                    }
                </div>
            </div>
        </div>
    )
}

export default ChangeClassroom