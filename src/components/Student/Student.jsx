import React, { useState, useEffect } from 'react';
import './Student.css';
import StudentModal from './StudentModal';
import { MdOutlineAdd } from 'react-icons/md';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { FiRefreshCcw } from "react-icons/fi";
import StatusBar from '../StatusBar/StatusBar';
import axiosInstance from '../../utils/axiosInstance';
import { stringToDate } from '../../utils/helper';
import SelectClassroom from './SelectClassroom';
import ChangeClassroom from './ChangeClassroom';

const Student = ({ globalSchool }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSelectedClassroomVisible, setIsSelectedClassroomVisible] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingClasses, setLoadingClasses] = useState(false);
    const [classrooms, setClassrooms] = useState([]);
    const [selectedClassroom, setSelectedClassroom] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isChangeClassroomVisible, setIsChangeClassroomVisible] = useState(false);
    const [studentToChange, setStudentToChange] = useState(null);

    const showStatusBar = (status) => {
        setStatusMessage({ message: status.message, type: status.type });
        setTimeout(() => {
            setStatusMessage(null);
        }, 2000);
    };

    useEffect(() => {
        getClassrooms();
    }, [selectedClassroom]);

    const handleOpenModal = () => {
        setIsModalVisible(true);
    }

    const handleEditStudent = (student) => {
        setSelectedStudent(student);
        setIsModalVisible(true);
    }

    const onCloseModal = () => {
        setSelectedStudent(null);
        setIsModalVisible(false);
    }

    const getClassrooms = async () => {
        setLoadingClasses(true);
        try {
            const response = await axiosInstance.get(`/classroom/${globalSchool._id}/classes`, {
                timeout: 10000
            });

            if (response.status !== 200) {
                showStatusBar({ message: 'Erro ao buscar escolas', type: 'error' });
            } else {
                setClassrooms(response.data);
            }
        } catch (error) {
            console.log(error)
            if (error.code === 'ERR_NETWORK') {
                showStatusBar({ message: 'Verifique sua conexão com a internet', type: 'error' });
            } else {
                showStatusBar({ message: 'Um erro inesperado aconteceu. Tente novamente.', type: 'error' });
            }
        }
        setLoadingClasses(false);
    }

    const getStudents = async (classroom) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/student/classrooms/${classroom._id}`, {
                timeout: 10000
            });

            if (response.status === 200) {
                setStudents(response.data);
            } else if (response.status >= 400 && response.status <= 500) {
                showStatusBar({ message: response.data.message, type: 'error' });
            }
        } catch (error) {
            console.log(error)
            if (error.code === 'ERR_NETWORK') {
                showStatusBar({ message: 'Verifique sua conexão com a internet', type: 'error' });
            } else {
                showStatusBar({ message: 'Um erro inesperado aconteceu. Tente novamente.', type: 'error' });
            }
        }
        setLoading(false);
    }

    const onSaveStudent = async (student) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post(`/student`, {
                name: student.name,
                cpf: student.cpf,
                birthDate: stringToDate(student.birthDate),
                contact: student.contact,
                address: student.address,
                guardian: student.guardian,
                classroom: selectedClassroom
            }, {
                timeout: 10000
            });

            if (response.status === 201) {
                onCloseModal();
                getStudents(selectedClassroom);
            } else {
                showStatusBar({ message: 'Erro ao salvar novo(a) aluno(a)', type: 'error' });
            }
        } catch (error) {
            console.log(error)
            if (error.code === 'ERR_NETWORK') {
                showStatusBar({ message: 'Verifique sua conexão com a internet', type: 'error' });
            } else {
                showStatusBar({ message: 'Um erro inesperado aconteceu. Tente novamente.', type: 'error' });
            }
        }
        setLoading(false);
    }

    const onEditStudent = async (student) => {
        setLoading(true);
        try {
            const response = await axiosInstance.put(`/student/${student._id}`, {
                name: student.name,
                cpf: student.cpf,
                birthDate: stringToDate(student.birthDate),
                contact: student.contact,
                address: student.address,
                guardian: student.guardian
            }, {
                timeout: 10000
            });

            if (response.status === 200) {
                onCloseModal();
                getStudents(selectedClassroom);
            } else {
                showStatusBar({ message: 'Erro ao salvar aluno(a)', type: 'error' });
            }
        } catch (error) {
            console.log(error)
            if (error.code === 'ERR_NETWORK') {
                showStatusBar({ message: 'Verifique sua conexão com a internet', type: 'error' });
            } else {
                showStatusBar({ message: 'Um erro inesperado aconteceu. Tente novamente.', type: 'error' });
            }
        }
        setLoading(false);
    }

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenSelectClassroom = () => {
        setIsSelectedClassroomVisible(true);
    }

    const onSelectClassroom = (classroom) => {
        setSelectedClassroom(classroom);
        setIsSelectedClassroomVisible(false);
        getStudents(classroom);
    }

    const openWhatsApp = (phoneNumber) => {
        const formattedNumber = phoneNumber.replace(/\D/g, ''); // Remove caracteres não numéricos
        const whatsappUrl = `https://wa.me/55${formattedNumber}`;
        window.open(whatsappUrl, '_blank');
    }

    const handleChangeClassroom = (student) => {
        setStudentToChange(student);
        setIsChangeClassroomVisible(true);
    }

    return (
        <div className='student-container'>
            <div className='student-select-classes'>
                <label>Selecione a turma: </label>
                {
                    loadingClasses ?
                        <label>Carregando turmas...</label> :
                        <button onClick={() => handleOpenSelectClassroom()}>
                            <div className='select-classroom-button'>
                                <span>
                                    {
                                        selectedClassroom ?
                                            `${selectedClassroom.grade}º ano ${selectedClassroom.name} - ${selectedClassroom.shift}` :
                                            'Clique para selecionar'
                                    }
                                </span>
                                <FiRefreshCcw />
                            </div>
                        </button>
                }

                {
                    isSelectedClassroomVisible ?
                        <SelectClassroom
                            onCloseModal={() => setIsSelectedClassroomVisible(false)}
                            classrooms={classrooms}
                            onSelectClassroom={(classroom) => onSelectClassroom(classroom)} /> :
                        <div />
                }
            </div>

            <div className='students-list'>
                <h3>Alunos:</h3>
                {
                    filteredStudents.length < 1 ?
                        <p>Nenhum aluno cadastrado nessa turma</p> :
                        filteredStudents.map((student) => (
                            <div key={student._id} className='students-list-item'>
                                <div className='student-info-container' onClick={() => handleEditStudent(student)}>
                                    <p>{student.name}</p>
                                    <p>Responsável: <span className='guardian-contact' onClick={() => openWhatsApp(student.guardian.contact)}>{student.guardian.contact}</span></p>
                                </div>
                                <div>
                                    <button className='primary-button' onClick={() => handleChangeClassroom(student)}>Mudar de turma</button>
                                </div>
                            </div>
                        ))
                }
            </div>

            {
                isChangeClassroomVisible &&
                <ChangeClassroom
                    onCloseModal={() => setIsChangeClassroomVisible(false)}
                    selectedClassroom={selectedClassroom}
                    studentToChange={studentToChange}
                    classrooms={classrooms}
                    changeClassroom={(classroom) => {
                        setSelectedClassroom(classroom);
                        getStudents(classroom);
                        showStatusBar({ message: 'Mudança de turma realizada', type: 'success' });
                        setIsChangeClassroomVisible(false);
                    }}
                />
            }

            <button
                className="circular-button"
                onClick={() =>
                    selectedClassroom ?
                        handleOpenModal() :
                        showStatusBar({
                            message: 'Selecione uma turma primeiro',
                            type: 'error'
                        })}>
                <MdOutlineAdd className='icon' />
            </button>
            {
                isModalVisible ?
                    <StudentModal
                        loading={loading}
                        selectedStudent={selectedStudent}
                        onCloseModal={() => onCloseModal()}
                        onSaveStudent={(student) => onSaveStudent(student)}
                        onEditStudent={(student) => onEditStudent(student)} /> :
                    <div />
            }

            {statusMessage && (
                <StatusBar
                    message={statusMessage.message}
                    type={statusMessage.type}
                    onClose={() => setStatusMessage(null)}
                />
            )}
        </div>
    )
}

export default Student