import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md'
import InputMask from 'react-input-mask';
import { dateToString, getCurrentDate } from '../../utils/helper';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import './Gradebook.css';

const Lesson = ({ term, handleCloseLesson, onAddLesson, editingLesson, loading, selectedLesson, onEditLesson }) => {

    const [topic, setTopic] = useState('');
    const [date, setDate] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (editingLesson === false) {
            setDate(getCurrentDate());
        } else {
            setTopic(selectedLesson.topic);
            setDate(dateToString(selectedLesson.date));
        }
    }, []);

    const handleError = (message) => {
        setError(message);
        setTimeout(() => {
            setError('');
        }, 2000);
    }

    const handleAddLesson = () => {
        if (!topic || !date) {
            handleError('Preencha todos os campos');
        } else if (!editingLesson) {
            onAddLesson({ topic, date });
            clearFields();
        } else {
            onEditLesson({ id: selectedLesson._id, topic, date });
            clearFields();
        }
    }

    const clearFields = () => {
        setTopic('');
    }

    return (
        <div className='modal-overlay'>
            <div className='modal'>
                <div className='align-right'>
                    <button className="close-button" onClick={() => {
                        clearFields();
                        handleCloseLesson(false);
                    }}>
                        <MdClose className='close-icon' />
                    </button>
                </div>

                <div className='term-form'>
                    <h3>Nova aula</h3>
                    <label>
                        Assunto da aula
                        <input
                            placeholder='Digite aqui o assunto da aula de hoje'
                            type="text"
                            name="name"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)} />
                    </label>

                    {/* <label>Tipo de aula</label>
                    <select
                        id="lessonType"
                        name="lessonType"
                        value={lessonType}
                        onChange={(e) => setLessonType(e.target.value)}>
                        <option value="regular">Normal</option>
                        <option value="evaluative">Avaliativa</option>
                    </select> */}

                    <label>Data da aula</label>
                    <InputMask
                        placeholder='13/01/2025'
                        className='input-mask'
                        mask="99/99/9999"
                        onChange={(e) => setDate(e.target.value)}
                        value={date} />

                    {
                        error ?
                            <p className='error-message'>{error}</p> :
                            loading ?
                                <LoadingSpinner /> :
                                <button
                                    onClick={() => handleAddLesson()}
                                    className='primary-button'>
                                    {
                                        editingLesson ?
                                            'Salvar alterações' :
                                            'Adicionar aula'
                                    }
                                </button>
                    }
                </div>
            </div>
        </div>
    )
}

export default Lesson