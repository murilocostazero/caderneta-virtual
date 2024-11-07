import React, { useState, useEffect } from 'react';
import './TeachersToSelect.css';

const TeachersToSelect = ({ myTeachers, loading, handleCancel, addTeacher }) => {
  return (
    <div className='modal-overlay'>
      <div className='modal'>
        <p className='select-teacher-title'>Clique para selecionar o(a) professor(a)</p>
        {
          myTeachers.map((teacher) => (
            <div className='select-teacher-item' key={teacher._id} onClick={() => addTeacher(teacher)}>
              <p>{teacher.name}</p>
            </div>
          ))
        }

        <button
          className='select-teacher-cancel-button'
          onClick={() => handleCancel()}>Cancelar</button>
      </div>
    </div>
  )
}

export default TeachersToSelect