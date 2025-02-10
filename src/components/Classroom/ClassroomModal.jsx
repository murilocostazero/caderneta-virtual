import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';
import './Classroom.css';

const ClassroomModal = ({ onClose, handleSaveClassroom, currentClassroom, handleEditClassroom }) => {

    const [classroomType, setClassroomType] = useState(currentClassroom ? currentClassroom.classroomType : 'kindergarten');
    const [grade, setGrade] = useState(currentClassroom ? currentClassroom.grade : '');
    const [name, setName] = useState(currentClassroom ? currentClassroom.name : '');
    const [shift, setShift] = useState(currentClassroom ? currentClassroom.shift : 'Matutino');
    const [error, setError] = useState('');

    const handleError = (error) => {
        setError(error);

        setTimeout(() => {
            setError('');
        }, 2000);
    }

    const onAdd = () => {
        if (!classroomType || !grade || !shift) {
            handleError('Preencha todos os campos.');
        } else if (!currentClassroom) {
            handleSaveClassroom({ classroomType: classroomType, grade: grade, name: name, shift: shift });
        } else {
            handleEditClassroom({ classroomType: classroomType, grade: grade, name: name, shift: shift });
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className='align-right'>
                    <button className="close-button" onClick={onClose}>
                        <MdClose className='close-icon' />
                    </button>
                </div>
                <div className='classroom-form'>
                    <div className='classroom-select-container'>
                        <label>Tipo de turma</label>
                        <select
                            id="classroomType"
                            name="classroomType"
                            value={classroomType}
                            onChange={(e) => setClassroomType(e.target.value)}>
                            <option value="kindergarten">Maternal</option>
                            <option value="elementary">Ensino Fundamental</option>
                            <option value="high">Ensino Médio</option>
                        </select>
                    </div>

                    <label>Ano/Série</label>
                    <input
                        type="text"
                        name="grade"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        placeholder="Ex.: 8º, 7º..."
                    />

                    <label>Nome da turma</label>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex.: Turma A, Turma B..."
                    />

                    <div className='classroom-select-container'>
                        <label>Turno</label>
                        <select
                            id="shift"
                            name="shift"
                            value={shift}
                            onChange={(e) => setShift(e.target.value)}>
                            <option value="Matutino">Matutino</option>
                            <option value="Vespertino">Vespertino</option>
                        </select>
                    </div>
                    {
                        error ?
                            <p className='error-message'>{error}</p> :
                            <button
                                type="submit"
                                className='classroom-ok-button'
                                onClick={() => onAdd()}>
                                Salvar
                            </button>
                    }
                </div>
            </div>
        </div>
    );
};

export default ClassroomModal;
