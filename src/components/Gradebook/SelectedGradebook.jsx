import React, { useState, useEffect } from 'react';
import { MdAdd, MdArrowBack, MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';
import gbpt from '../../assets/images/subjects/gb-pt.png';
import gbmt from '../../assets/images/subjects/gb-mt.png';
import gbht from '../../assets/images/subjects/gb-ht.png';
import gbgf from '../../assets/images/subjects/gb-gf.jpg';
import gbcn from '../../assets/images/subjects/gb-cn.jpg';
import gbeg from '../../assets/images/subjects/gb-eg.jpg';
import gbet from '../../assets/images/subjects/gb-et.png';
import gbef from '../../assets/images/subjects/gb-ef.jpg';
import gbefc from '../../assets/images/subjects/gb-efc.jpg';
import './Gradebook.css';
import { dateToString, normalizeString, stringToDate } from '../../utils/helper';
import StatusBar from '../StatusBar/StatusBar';
import axiosInstance from '../../utils/axiosInstance';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import TermModal from './TermModal';
import Lesson from './Lesson';
import Attendance from './Attendance';

const SelectedGradebook = ({ gradebook, handleSelectGradebook }) => {
  const [subjectImg, setSubjectImg] = useState(null);
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

  const showStatusBar = (status) => setStatusMessage({ message: status.message, type: status.type });

  useEffect(() => {
    selectSubjectImage();
  }, []);

  const selectSubjectImage = () => {
    switch (normalizeString(gradebook.subject.name)) {
      case 'portugues':
        setSubjectImg(gbpt);
        break;
      case 'matematica':
        setSubjectImg(gbmt);
        break;
      case 'ciencias':
        setSubjectImg(gbcn);
        break;
      case 'historia':
        setSubjectImg(gbht);
        break;
      case 'geografia':
        setSubjectImg(gbgf);
        break;
      case 'ingles':
        setSubjectImg(gbeg);
        break;
      case 'educacao fisica':
        setSubjectImg(gbef);
        break;
      case 'educacao financeira':
        setSubjectImg(gbefc);
        break;
      case 'educacao para o transito':
        setSubjectImg(gbet);
        break;
    }
  }

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
    setTermModal(isOpen);
  }

  const onSaveTerm = async (term) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/gradebook/${gradebook._id}/term`, {
        name: term.name,
        startDate: stringToDate(term.startDate),
        endDate: stringToDate(term.endDate)
      }, {
        timeout: 10000
      });

      if (response.status === 201) {
        handleSelectGradebook(response.data.gradebook); //AAAQUI
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

  //---------- LESSON

  const handleOpenLesson = (term) => {
    setSelectedTerm(term);
    setShowLesson(true);
  }

  const handleEditLesson = (term, lesson) => {
    setSelectedLesson(lesson);
    setEditingLesson(true);

    handleOpenLesson(term);
  }

  const handleCloseLesson = () => {
    setShowLesson(false);
  }

  const onAddLesson = async (lesson) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/gradebook/${gradebook._id}/term/${selectedTerm._id}/lesson`, {
        topic: lesson.topic,
        date: stringToDate(lesson.date)
      }, {
        timeout: 10000
      });

      if (response.status >= 400 && response.status <= 500) {
        showStatusBar({ message: response.data.message, type: 'error' });
      } else {
        handleSelectGradebook(response.data.gradebook);
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
      const response = await axiosInstance.put(`/gradebook/${gradebook._id}/term/${selectedTerm._id}/lesson/${lesson.id}`, {
        topic: lesson.topic,
        date: stringToDate(lesson.date)
      }, {
        timeout: 10000
      });

      if (response.status >= 400 && response.status <= 500) {
        showStatusBar({ message: response.data.message, type: 'error' });
      } else {
        handleSelectGradebook(response.data.gradebook);
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

  return (
    <div className='gradebook-container'>
      <div className='subject-header'>
        <div className='subject-image-container'>
          <img src={subjectImg} alt="Imagem da matéria" />

          <div class="subject-name">
            <div className='back-button-container'>
              <MdArrowBack
                onClick={() => handleSelectGradebook(null)}
                fontSize={20}
                color='#FFF'
                cursor='pointer' />
            </div>

            <div className='subject-info-container'>
              <h2>{gradebook.subject.name}</h2>
              <h3>{gradebook.academicYear}</h3>
              <h3>{gradebook.classroom.grade}º ano {gradebook.classroom.name} - {gradebook.classroom.shift}</h3>
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
                <h4>{term.name}</h4>
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
                !term.lessons || term.lessons.length < 1 ?
                  <p>Nenhuma aula registrada nesse bimestre</p> :

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
                        />
                      }

                    </div>
                  )
              }
            </div>
          )
        }

        {
          termModal ?
            <TermModal
              handleTermModal={(isOpen) => handleTermModal(isOpen)}
              onSaveTerm={(term) => onSaveTerm(term)} /> :
            <div />
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

export default SelectedGradebook