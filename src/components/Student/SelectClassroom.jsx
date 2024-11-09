import React from 'react';
import './Student.css';
import { MdClose } from 'react-icons/md';

const SelectClassroom = ({ onCloseModal, classrooms, onSelectClassroom }) => {
    return (
        <div className="modal-overlay">
            <div className="modal">

                <div className='modal-close-button-container'>
                    <MdClose className='modal-close-button' onClick={() => onCloseModal()} />
                </div>
                <h3>Selecione uma turma</h3>

                {
                    classrooms.map((classroom) => (
                        <div className='classroom-list-item' key={classroom._id} onClick={() => onSelectClassroom(classroom)}>
                            <p>{classroom.grade}º ano {classroom.name} - {classroom.shift}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default SelectClassroom