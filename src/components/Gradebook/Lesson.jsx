import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md'
import InputMask from 'react-input-mask';
import { dateToString, getCurrentDate } from '../../utils/helper';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import './Gradebook.css';

const Lesson = ({ term, handleCloseLesson, onAddLesson, editingLesson, loading, selectedLesson, onEditLesson }) => {
    let maxLengthTextArea = 100;

    const [topic, setTopic] = useState('');
    const [date, setDate] = useState('');
    const [error, setError] = useState('');
    // const [maxLengthTextArea, setMaxLengthTextArea] = useState(120);
    const [textAreaCounter, setTextAreaCounter] = useState(maxLengthTextArea);
    const [lessonWorkload, setLessonWorkLoad] = useState(1);

    useEffect(() => {
        if (!editingLesson) {
            setDate(getCurrentDate());
            setTextAreaCounter(maxLengthTextArea); // Resetando o contador quando não está editando
        } else if (selectedLesson) {
            setTopic(selectedLesson.topic);
            setDate(dateToString(selectedLesson.date));
            setLessonWorkLoad(!selectedLesson.lessonWorkload ? 1 : selectedLesson.lessonWorkload);
            // Corrigindo o cálculo do contador
            setTextAreaCounter(maxLengthTextArea - selectedLesson.topic.length);
        }
    }, [editingLesson, selectedLesson]);

    const handleError = (message) => {
        setError(message);
        setTimeout(() => {
            setError('');
        }, 2000);
    }

    const handleAddLesson = () => {
        if (!topic || !date || !lessonWorkload) {
            handleError('Preencha todos os campos');
        } else if (!editingLesson) {
            onAddLesson({ topic, date, lessonWorkload });
            clearFields();
        } else {
            onEditLesson({ id: selectedLesson._id, topic, date, lessonWorkload });
            clearFields();
        }
    }

    const clearFields = () => {
        setTopic('');
    }

    const handleTextArea = (text) => {
        if (text.length <= maxLengthTextArea) {
            setTopic(text);
            setTextAreaCounter(maxLengthTextArea - text.length);
        }
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
                    <h3>{!editingLesson ? 'Nova aula' : 'Editar aula'}</h3>
                    <label>
                        <div className='row-container'>
                            Assunto da aula
                            <label>{textAreaCounter}</label>
                        </div>
                        <textarea
                            placeholder='Digite aqui o assunto da aula de hoje'
                            type="text"
                            name="name"
                            value={topic}
                            maxLength={maxLengthTextArea}
                            onChange={(e) => handleTextArea(e.target.value)} />
                    </label>

                    <label>Data da aula</label>
                    <InputMask
                        placeholder='13/01/2025'
                        className='input-mask'
                        mask="99/99/9999"
                        onChange={(e) => setDate(e.target.value)}
                        value={date} />

                    {/* <label>Carga horária</label>
                    <select disabled={true} name="lesson-workload" value={lessonWorkload} onChange={(e) => setLessonWorkLoad(e.target.value)}>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                    </select> */}

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