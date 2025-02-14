import React, { useState, useEffect } from 'react';
import { MdAdd, MdArrowBack, MdEdit, MdKeyboardArrowDown, MdKeyboardArrowUp, MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';
import kindergartenImg from '../../assets/images/subjects/kindergarten.jpg'
import './Gradebook.css';
import { classroomTypeToPT, dateToString, normalizeString, stringToDate } from '../../utils/helper';
import StatusBar from '../StatusBar/StatusBar';
import axiosInstance from '../../utils/axiosInstance';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import TermModal from './TermModal';
import Lesson from './Lesson';
import Attendance from './Attendance';
import KindergartenGrades from './KindergartenGrades';
import AnnualRegistration from './AnnualRegistration';

const SelectedKindergarten = ({ gradebook, handleSelectGradebook }) => {
  const [skill, setSkill] = useState(gradebook.skill ? gradebook.skill : '');
  const [statusMessage, setStatusMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [termModal, setTermModal] = useState(false);
  const [showSkill, setShowSkill] = useState(false);
  const [showLesson, setShowLesson] = useState(false);
  const [editingLesson, setEditingLesson] = useState(false); //Editando a aula?
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showAttendance, setShowAttendance] = useState(false);
  const [isEditingAttendance, setIsEditingAttendance] = useState(false);
  const [isStudentGradesVisible, setIsStudentGradesVisible] = useState(false);
  const [isAnnualRegistrationVisible, setIsAnnualRegistrationVisible] = useState(false);
  const [learningRecords, setLearningRecords] = useState([]);
  const [expandedTerms, setExpandedTerms] = useState({});

  const showStatusBar = (status) => {
    setStatusMessage({ message: status.message, type: status.type });
    setTimeout(() => {
      setStatusMessage(null);
    }, 2000);
  };

  const toggleLessons = (termId) => {
    setExpandedTerms((prev) => ({
      ...prev,
      [termId]: !prev[termId], // Alterna o estado do bimestre clicado
    }));
  };

  const handleSaveSkill = async () => {
    if (!skill) {
      showStatusBar({ message: 'Critério não pode ser vazio', type: 'error' });
    } else {
      setLoading(true);
      try {
        const response = await axiosInstance.put(`/gradebook/${gradebook._id}`, {
          skill: skill
        }, {
          timeout: 10000
        });
        if (response.status >= 400 && response.status <= 500) {
          showStatusBar({ message: response.data.message, type: 'error' });
        } else {
          handleSelectGradebook(gradebook);
        }
      } catch (error) {
        console.error('Erro ao alterar critério', error);
        showStatusBar({ message: 'Erro ao alterar critério', type: 'error' });
      }
      setLoading(false);
    }
  }

  //---------- TERM

  const handleTermModal = (isOpen) => {
    setSelectedTerm(null);
    setTermModal(isOpen);
  }

  const onSaveTerm = async (term) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/kindergarten/${gradebook._id}/term`, {
        name: term.name,
        startDate: stringToDate(term.startDate),
        endDate: stringToDate(term.endDate)
      }, {
        timeout: 10000
      });

      if (response.status === 201) {
        handleSelectGradebook(response.data.kindergarten);
      } else {
        showStatusBar({ message: 'Erro ao adicionar novo bimestre', type: 'error' });
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

    handleTermModal(false);
  }

  const handleEditTerm = (termToEdit) => {
    setSelectedTerm(termToEdit);
    setTermModal(true);
  }

  const onEditTerm = async (term) => {
    setLoading(true);
    try {
      const response = await axiosInstance.put(`/kindergarten/${gradebook._id}/term/${term._id}`, {
        name: term.name,
        startDate: stringToDate(term.startDate),
        endDate: stringToDate(term.endDate)
      }, {
        timeout: 10000
      });

      if (response.status === 200) {
        handleSelectGradebook(response.data.kindergarten);
        showStatusBar({ message: response.data.message, type: 'success' });
      } else {
        showStatusBar({ message: 'Erro ao alterar bimestre', type: 'error' });
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

    handleTermModal(false);
  }

  //---------- LESSON

  const handleOpenLesson = (term) => {
    setEditingLesson(false);
    setSelectedTerm(term);
    setShowLesson(true);
  }

  const handleEditLesson = (term, lesson) => {
    setSelectedLesson(lesson);
    setEditingLesson(true);
    setSelectedTerm(term);

    setShowLesson(true);
  }

  const handleCloseLesson = () => {
    setShowLesson(false);
  }

  const onAddLesson = async (lesson) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/kindergarten/${gradebook._id}/term/${selectedTerm._id}/lesson`, {
        topic: lesson.topic,
        date: stringToDate(lesson.date)
      }, {
        timeout: 10000
      });

      if (response.status >= 400 && response.status <= 500) {
        showStatusBar({ message: response.data.message, type: 'error' });
      } else {
        handleSelectGradebook(response.data.kindergarten);
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

    handleCloseLesson();
  }

  const onEditLesson = async (lesson) => {
    setLoading(true);
    try {
      const response = await axiosInstance.put(`/kindergarten/${gradebook._id}/term/${selectedTerm._id}/lesson/${lesson.id}`, {
        topic: lesson.topic,
        date: stringToDate(lesson.date)
      }, {
        timeout: 10000
      });

      if (response.status >= 400 && response.status <= 500) {
        showStatusBar({ message: response.data.message, type: 'error' });
      } else {
        handleSelectGradebook(response.data.kindergarten);
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

    handleCloseLesson();
  }

  //---------- ATTENDENCE
  const handleOpenAttendance = (lesson, isEditing) => {
    setIsEditingAttendance(isEditing);
    setSelectedLesson(lesson);
    setShowAttendance(true);
  }

  //---------- STUDENT GRADES
  const handleOpenStudentGrades = (termToGrades) => {
    setSelectedTerm(termToGrades);
    setIsStudentGradesVisible(true);
  }

  //---------- ANNUAL REGISTRATION
  const handleOpenAnnualRegistration = async () => {

    setLoading(true);
    try {
      const response = await axiosInstance.get(`/gradebook/${gradebook._id}/learning-record`, {
        timeout: 10000
      });

      if (response.status === 200) {
        //RECEBE O REGISTRO GERAL DO BACKEND
        console.log('-------F', response.data)
        setLearningRecords(response.data);
      } else {
        showStatusBar({ message: 'Erro ao gerar o registro geral', type: 'error' });
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

    setIsAnnualRegistrationVisible(true);
  }

  return (
    <div className='gradebook-container'>
      <div className='subject-header'>
        <div className='subject-image-container'>
          <img src={kindergartenImg} alt="Imagem da matéria" className='subject-background' />

          <div class="subject-name">
            <div className='back-button-container'>
              <MdArrowBack
                onClick={() => handleSelectGradebook(null)}
                fontSize={20}
                color='#FFF'
                cursor='pointer' />
            </div>

            <div className='subject-info-container'>
              <h2>Todas as matérias</h2>
              <h3>{gradebook.academicYear}</h3>
              <h3>{classroomTypeToPT(gradebook.classroom.classroomType)} {gradebook.classroom.grade} {gradebook.classroom.name} - {gradebook.classroom.shift}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className='gradebook-section'>
        <h3>Professor: {gradebook.teacher.name}</h3>
      </div>

      {
        loading ?
          <LoadingSpinner /> :
          <div className='gradebook-section'>
            <div className='row-container'>
              <h3>Critérios</h3>
              {
                !showSkill ?
                  <MdArrowDropDown className='drop-icon' onClick={() => setShowSkill(true)} /> :
                  <MdArrowDropUp className='drop-icon' onClick={() => setShowSkill(false)} />
              }
            </div>

            {
              showSkill ?
                <div className='skill-container'>
                  <textarea
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)} />

                  <button className='primary-button' onClick={() => handleSaveSkill()}>
                    Salvar
                  </button>
                </div> :
                <div />
            }
          </div>
      }

      <div className='gradebook-section'>
        <div className='row-container'>
          <h3>Bimestres</h3>
          <button
            onClick={() => handleTermModal(true)}
            className='primary-button'>
            NOVO BIMESTRE
          </button>
        </div>

        {
          gradebook.terms.map((term) =>
            <div key={term._id} className='lesson-container'>
              <div className='row-container'>
                <div className='row-container'>
                  <div className='dropdown-button' onClick={() => toggleLessons(term._id)}>
                    {expandedTerms[term._id] ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                  </div>
                  <h4>{term.name}</h4>
                  <MdEdit onClick={() => handleEditTerm(term)} className='edit-term-button' />
                </div>
                <button className='add-lesson-button' onClick={() => handleOpenLesson(term)}>
                  <MdAdd />
                </button>
              </div>

              {
                showLesson ?
                  <Lesson
                    term={term}
                    handleCloseLesson={() => handleCloseLesson()}
                    onAddLesson={(lesson) => onAddLesson(lesson)}
                    onEditLesson={(lesson) => onEditLesson(lesson)}
                    selectedLesson={selectedLesson}
                    editingLesson={editingLesson}
                    loading={loading} /> :
                  <div />
              }

              {
                expandedTerms[term._id] &&
                <>
                  {
                    (!term.lessons || term.lessons.length < 1) ? (
                      <p>Nenhuma aula registrada nesse bimestre</p>
                    ) : (
                      term.lessons.map((lesson, index) =>
                        <div key={lesson._id} className={`single-lesson-container  ${index % 2 === 0 ? "even" : "odd"}`}>
                          <p>{dateToString(lesson.date)} - Assunto: {lesson.topic}</p>
                          <div className='lesson-actions'>
                            <button onClick={() => handleEditLesson(term, lesson)}>Editar aula</button>

                            {
                              lesson.attendance.length > 0 ?
                                <button onClick={() => handleOpenAttendance(lesson, true)}>Editar chamada</button> :
                                <button onClick={() => handleOpenAttendance(lesson, false)}>Nova chamada</button>
                            }

                          </div>

                          {
                            showAttendance &&
                            <Attendance
                              gradebook={gradebook}
                              term={term}
                              lesson={selectedLesson}
                              handleSelectGradebook={(gradebook) => {
                                handleSelectGradebook(gradebook);
                                setShowAttendance(false);
                              }}
                              handleCloseAttendance={() => setShowAttendance(false)}
                              isEditingAttendance={isEditingAttendance}
                              classroomType={gradebook.classroom.classroomType}
                            />
                          }

                          {
                            isStudentGradesVisible
                            &&
                            <KindergartenGrades
                              handleClose={() => setIsStudentGradesVisible(false)}
                              gradebook={gradebook}
                              term={selectedTerm}
                              classroomType={gradebook.classroom.classroomType} />
                          }


                        </div>
                      )
                    )
                  }
                  {
                    term.lessons.length > 0 &&
                    <div className='term-bottom-button'>
                      <button className='primary-button' onClick={() => handleOpenStudentGrades(term)}>INSTRUMENTO DE AVALIAÇÃO DO PROFESSOR</button>
                    </div>
                  }
                </>
              }
            </div>
          )
        }

        {
          termModal ?
            <TermModal
              handleTermModal={(isOpen) => handleTermModal(isOpen)}
              onSaveTerm={(term) => onSaveTerm(term)}
              onEditTerm={(term) => onEditTerm(term)}
              selectedTerm={selectedTerm} /> :
            <div />
        }
      </div>

      <div className='gradebook-section'>
        <div className='row-container'>
          <h3>Registro Geral da avaliação da aprendizagem</h3>
          <button className='primary-button' onClick={() => handleOpenAnnualRegistration()}>
            GERAR
          </button>
        </div>

        {
          isAnnualRegistrationVisible && learningRecords &&
          <AnnualRegistration
            handleCloseAnnualRegistration={() => setIsAnnualRegistrationVisible(false)}
            learningRecords={learningRecords}
          />
        }


      </div>

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

export default SelectedKindergarten