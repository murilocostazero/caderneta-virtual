import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import './Gradebook.css';
import axiosInstance from '../../utils/axiosInstance';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { classroomTypeToPT } from '../../utils/helper';

const GradebookModal = ({ onCloseModal, globalSchool, onSaveGradebook, loadingSave }) => {

    const [academicYear, setAcademicYear] = useState('');
    const [classroom, setClassroom] = useState(null);
    const [classrooms, setClassrooms] = useState([]);
    //Teacher aqui é um colaborador. Pode ser professor ou gestor
    const [teacher, setTeacher] = useState(null);
    const [team, setTeam] = useState([]);
    const [subject, setSubject] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setAcademicYear(new Date().getFullYear());
        getClassrooms();
        getTeam();
        getSubjects();
    }, []);

    const getClassrooms = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/classroom/${globalSchool._id}/classes`, {
                timeout: 10000
            });

            if (response.status !== 200) {
                setError('Erro ao buscar escolas');
            } else {
                setClassrooms(response.data);
            }
        } catch (error) {
            console.log(error)
            if (error.code === 'ERR_NETWORK') {
                setError('Verifique sua conexão com a internet');
            } else {
                setError('Um erro inesperado aconteceu. Tente novamente.');
            }
        }
        setLoading(false);
    }

    const getTeam = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/get-team/${globalSchool._id}`, {
                timeout: 10000
            });
            // console.log(response.data.team)
            setTeam(response.data);
        } catch (error) {
            console.error('Erro ao buscar professores:', error);
        }
        setLoading(false);
    };

    const getSubjects = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/subject/school/${globalSchool._id}`, {
                timeout: 10000
            });

            if (response.status !== 200) {
                setError('Erro ao buscar disciplinas');
            } else {
                setSubjects(response.data);
            }
        } catch (error) {
            console.log(error)
            if (error.code === 'ERR_NETWORK') {
                setError('Verifique sua conexão com a internet');
            } else {
                setError('Um erro inesperado aconteceu. Tente novamente.');
            }
        }
        setLoading(false);
    }

    const handleError = (message) => {
        setError(message);
        setTimeout(() => {
            setError('');
        }, 2000);
    }

    const handleSaveGradebook = () => {

        if (!academicYear || !classroom || !teacher || !subject) {
            handleError('Preencha todos os campos');
        } else {
            onSaveGradebook({
                academicYear,
                classroom,
                teacher,
                subject
            });
        }
    }

    return (
        <div className='modal-overlay'>
            <div className='modal'>
                <div className='modal-close-button-container'>
                    <MdClose className='modal-close-button' onClick={() => onCloseModal()} />
                </div>
                <h3>Nova caderneta</h3>
                <div className='gradebook-form'>
                    <label>Ano letivo</label>
                    <input type="text" name="name" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} />

                    <label>Turma</label>
                    <select
                        id="classroomSelect"
                        value={classroom}
                        onChange={(e) => setClassroom(e.target.value)}>
                        <option value="">Selecione a turma</option>
                        {
                            classrooms.map(classroom => (
                                <option key={classroom._id} value={classroom._id}>
                                    {classroomTypeToPT(classroom.classroomType)} - {classroom.grade} {classroom.name} - {classroom.shift}
                                </option>
                            ))
                        }
                    </select>

                    <label>Professor</label>
                    <select
                        id="teacherSelect"
                        value={teacher}
                        onChange={(e) => setTeacher(e.target.value)}>
                        <option value="">Selecione o professor</option>
                        {
                            team.map(teacher => (
                                <option key={teacher._id} value={teacher._id}>
                                    {teacher.name}
                                </option>
                            ))
                        }
                    </select>

                    <label>Matéria/Disciplina</label>
                    <select
                        id="subjectSelect"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}>
                        <option value="">Selecione uma disciplina</option>
                        {
                            subjects.map(subject => (
                                <option key={subject._id} value={subject._id}>
                                    {subject.name}
                                </option>
                            ))
                        }
                    </select>

                    <div className='error-container'>
                        {
                            error ?
                                <p className='error-message'>{error}</p> :
                                loadingSave ?
                                <LoadingSpinner /> :
                                <button className='gradebook-save-button' onClick={() => handleSaveGradebook()}>Salvar</button>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GradebookModal