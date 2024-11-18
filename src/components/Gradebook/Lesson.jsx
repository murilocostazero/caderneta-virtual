import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md'
import InputMask from 'react-input-mask';
import { dateToString, getCurrentDate } from '../../utils/helper';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const Lesson = ({ term, handleCloseLesson, onAddLesson, editingLesson, loading, selectedLesson, onEditLesson }) => {

    const [topic, setTopic] = useState(selectedLesson.topic ? selectedLesson.topic : '');
    const [date, setDate] = useState(selectedLesson.date ? dateToString(selectedLesson.date) : '');
    const [error, setError] = useState('');

    useEffect(() => {
        if (editingLesson === false) {
            setDate(getCurrentDate());
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
        } else {
            onEditLesson({ id: selectedLesson._id, topic, date });
        }
    }

    return (
        <div className='modal-overlay'>
            <div className='modal'>
                <div className='align-right'>
                    <button className="close-button" onClick={() => handleCloseLesson(false)}>
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