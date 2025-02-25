import React, { useState, useEffect } from 'react';
import { MdCheck, MdClose } from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance';
import './Gradebook.css';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { studentSituationToPt } from '../../utils/helper';

const Attendance = ({
    handleCloseAttendance,
    term,
    lesson,
    gradebook,
    isEditingAttendance,
    handleSelectGradebook,
    classroomType
}) => {
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState(null);
    const [attendance, setAttendance] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isEditingAttendance) {
            getStudents();
        } else {
            getAttendance();
        }
    }, []);

    const handleError = (message) => {
        setError(message);
        setTimeout(() => {
            setError('');
        }, 2000);
    }

    const getStudents = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/student/classrooms/${gradebook.classroom._id}`, {
                timeout: 10000
            });

            if (response.status === 200) {
                setStudents(response.data);
                setAttendance(initializeAttendance(response.data));
            } else if (response.status >= 400 && response.status <= 500) {
                handleError(response.data.message);
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

    const getAttendance = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/${classroomType === 'kindergarten' ? 'kindergarten' : 'gradebook'}/${gradebook._id}/term/${term._id}/lesson/${lesson._id}/attendance`, {
                timeout: 10000
            });

            if (response.status === 200) {
                setAttendance(initializeLessonAttendance(response.data.lesson));
            } else if (response.status >= 400 && response.status <= 500) {
                handleError(response.data.message);
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

    const initializeAttendance = (students) => {
        return students.map(student => ({
            _id: student._id,
            studentId: student._id,
            name: student.name,
            cpf: student.cpf,
            birthDate: student.birthDate,
            contact: student.contact,
            address: student.address,
            guardian: {
                name: student.guardian.name,
                contact: student.guardian.contact,
                address: student.guardian.address
            },
            studentSituation: student.studentSituation,
            classroom: student.classroom,
            present: true
        }));
    }

    const initializeLessonAttendance = (lessonAttendance) => {
        console.log(lessonAttendance)
        return lessonAttendance.attendance.map(lessonAtt => ({
            _id: lessonAtt.studentId._id,
            studentId: lessonAtt.studentId._id,
            name: lessonAtt.studentId.name,
            present: lessonAtt.present,
            studentSituation: lessonAtt.studentId.studentSituation
        }));
    }

    // Função para alternar o valor de present
    const changePresence = (studentId) => {
        setAttendance(prevAttendance =>
            prevAttendance.map(student =>
                student._id === studentId
                    ? { ...student, present: !student.present } // Atualiza o present
                    : student // Mantém os outros alunos inalterados
            )
        );
    };

    const onSaveAttendance = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.post(`/${classroomType === 'kindergarten' ? 'kindergarten' : 'gradebook'}/${gradebook._id}/term/${term._id}/lesson/${lesson._id}/attendance`, {
                attendance: attendance
            }, {
                timeout: 10000
            });
            if (response.status >= 400 && response.status <= 500) {
                handleError(response.data.message);
            } else {
                handleSelectGradebook(response.data.gradebook);
            }
        } catch (error) {
            console.error('Erro ao adicionar chamada', error);
            handleError('Erro ao adicionar chamada');
        }
        setLoading(false);
    }

    const onUpdateAttendance = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.put(`/${classroomType === 'kindergarten' ? 'kindergarten' : 'gradebook'}/${gradebook._id}/term/${term._id}/lesson/${lesson._id}/attendance`, {
                attendance: attendance
            }, {
                timeout: 10000
            });
            if (response.status >= 400 && response.status <= 500) {
                handleError(response.data.message);
            } else {
                handleSelectGradebook(response.data.gradebook);
            }
        } catch (error) {
            console.error('Erro ao alterar chamada', error);
            handleError('Erro ao alterar chamada');
        }
        setLoading(false);
    }

    return (
        <div className='modal-overlay'>
            <div className='modal'>
                <div className='align-right'>
                    <button className="close-button" onClick={() => handleCloseAttendance()}>
                        <MdClose className='close-icon' />
                    </button>
                </div>

                <div className='attendance-form'>
                    <h2>Lista de chamada</h2>
                    <p>Por padrão os alunos vem com presença, o(a) sr(a) pode aplicar apenas as faltas.</p>

                    {
                        !attendance || attendance.length < 1 ?
                            <p>Nenhum aluno nessa turma</p> :
                            attendance.map((student, index) => (

                                student.studentSituation?.situation === 'transferred' || student.studentSituation?.situation === 'escaped' ?
                                    <label className='text-center' key={student._id}>{student.name} - Situação: {studentSituationToPt(student.studentSituation.situation)}</label> :

                                    <div key={student._id} className={`row-container attendance-student ${index % 2 === 0 ? "even" : "odd"}`}>
                                        <div className='student-attendance-container'>
                                            {
                                                student.present ?
                                                    <MdCheck className='attendance-icon' color='#18A205' fontSize={20} /> :
                                                    <MdClose className='attendance-icon' color='#e41313' fontSize={20} />
                                            }
                                            <span>{student.name}</span>
                                        </div>

                                        {
                                            student.present ?
                                                <button className='absent-button' onClick={() => changePresence(student._id)}>Aplicar falta</button> :
                                                <button className='presence-button' onClick={() => changePresence(student._id)}>Colocar presença</button>
                                        }
                                    </div>
                            )
                            )
                    }
                </div>
                <div className='bottom-attendance-container'>
                    {
                        error ?
                            <p className='error-message'>{error}</p> :
                            loading ?
                                <LoadingSpinner /> :
                                isEditingAttendance ?
                                    <button className='primary-button' onClick={() => onUpdateAttendance()}>Salvar alterações</button> :
                                    <button className='primary-button' onClick={() => onSaveAttendance()}>Salvar chamada</button>
                    }
                </div>
            </div>
        </div>
    )
}

export default Attendance