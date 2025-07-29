import React, { useState, useEffect } from 'react';
import { MdAdd, MdArrowBack, MdEdit, MdKeyboardArrowDown, MdKeyboardArrowUp, MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';
import gbpt from '../../assets/images/subjects/gb-pt.png';
import gbmt from '../../assets/images/subjects/gb-mt.png';
import gbht from '../../assets/images/subjects/gb-ht.png';
import gbgf from '../../assets/images/subjects/gb-gf.jpg';
import gbcn from '../../assets/images/subjects/gb-cn.jpg';
import gbeg from '../../assets/images/subjects/gb-eg.jpg';
import gbet from '../../assets/images/subjects/gb-et.png';
import gbef from '../../assets/images/subjects/gb-ef.jpg';
import gbefc from '../../assets/images/subjects/gb-efc.jpg';
import kindergarten from '../../assets/images/subjects/kindergarten.jpg'
import otherImg from '../../assets/images/subjects/other.jpg'
import generatePDF from '../../assets/images/pdf.png';
import './Gradebook.css';
import { classroomTypeToPT, dateToString, normalizeString, stringToDate } from '../../utils/helper';
import StatusBar from '../StatusBar/StatusBar';
import axiosInstance from '../../utils/axiosInstance';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import TermModal from './TermModal';
import Lesson from './Lesson';
import Attendance from './Attendance';
import StudentGrades from './StudentGrades';
import AnnualRegistration from './AnnualRegistration';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import TermToPDF from './TermToPDF';

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
  const [isStudentGradesVisible, setIsStudentGradesVisible] = useState(false);
  const [isAnnualRegistrationVisible, setIsAnnualRegistrationVisible] = useState(false);
  const [learningRecords, setLearningRecords] = useState([]);
  const [expandedTerms, setExpandedTerms] = useState({});
  const [confirmDeleteGB, setConfirmDeleteGB] = useState(false);
  const [loadingRemoveLesson, setLoadingRemoveLesson] = useState(false);
  const [subject, setSubject] = useState(null);

  const showStatusBar = (status) => {
    setStatusMessage({ message: status.message, type: status.type });
    setTimeout(() => {
      setStatusMessage(null);
    }, 2000);
  };

  useEffect(() => {
    selectSubjectImage();
    getSubject();
  }, []);

  const toggleLessons = (termId) => {
    setExpandedTerms((prev) => ({
      ...prev,
      [termId]: !prev[termId], // Alterna o estado do bimestre clicado
    }));
  };

  const selectSubjectImage = () => {
    switch (normalizeString(gradebook.subject.name)) {
      case 'portugues':
        setSubjectImg(gbpt);
        break;
      case 'lingua portuguesa':
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
      case 'todas as disciplinas':
        setSubjectImg(kindergarten);
        break;
      default:
        setSubjectImg(otherImg);
        break;
    }
  }

  const getSubject = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/subject/${gradebook.subject._id}`, {
        timeout: 20000
      });

      if (response.status === 200) {
        setSubject(response.data);
      } else {
        showStatusBar({ message: 'Erro ao buscar disciplina', type: 'error' });
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

  const handleSaveSkill = async () => {
    if (!skill) {
      showStatusBar({ message: 'Critério não pode ser vazio', type: 'error' });
    } else {
      setLoading(true);
      try {
        const response = await axiosInstance.put(`/gradebook/${gradebook._id}`, {
          skill: skill
        }, {
          timeout: 20000
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
      const response = await axiosInstance.post(`/gradebook/${gradebook._id}/term`, {
        name: term.name,
        startDate: stringToDate(term.startDate),
        endDate: stringToDate(term.endDate)
      }, {
        timeout: 20000
      });

      if (response.status === 201) {
        handleSelectGradebook(response.data.gradebook);
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
      const response = await axiosInstance.put(`/gradebook/${gradebook._id}/term/${term._id}`, {
        name: term.name,
        startDate: stringToDate(term.startDate),
        endDate: stringToDate(term.endDate)
      }, {
        timeout: 20000
      });

      if (response.status === 200) {
        handleSelectGradebook(response.data.gradebook);
        showStatusBar({ message: response.data.message, type: 'success' });
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

  const onDeleteTerm = async (term) => {
    setLoading(true);
    try {
      const response = await axiosInstance.delete(`/gradebook/${gradebook._id}/term/${term._id}`, {
        timeout: 20000
      });

      if (response.status === 200) {
        handleSelectGradebook(response.data.gradebook);
        showStatusBar({ message: 'Bimestre removida', type: 'success' });
      } else {
        showStatusBar({ message: 'Erro ao deletar bimestre', type: 'error' });
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
    setSelectedTerm(null);
    setShowLesson(false);
  }

  const onAddLesson = async (lesson) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/gradebook/${gradebook._id}/term/${selectedTerm._id}/lesson`, {
        topic: lesson.topic,
        date: stringToDate(lesson.date),
        workload: lesson.lessonWorkload
      }, {
        timeout: 20000
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
        date: stringToDate(lesson.date),
        workload: lesson.lessonWorkload
      }, {
        timeout: 20000
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

  const onDeleteLesson = async (term, lesson) => {
    setLoadingRemoveLesson(true);
    try {
      const response = await axiosInstance.delete(`/gradebook/${gradebook._id}/term/${term._id}/lesson/${lesson._id}`, {
        timeout: 20000
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
    setLoadingRemoveLesson(false);

    handleCloseLesson();
  }

  //---------- ATTENDENCE
  const handleOpenAttendance = (term, lesson, isEditing) => {
    setSelectedTerm(term);
    setIsEditingAttendance(isEditing);
    setSelectedLesson(lesson);
    setShowAttendance(true);
  }

  const handleCloseAttendance = () => {
    setIsEditingAttendance(false);
    setSelectedTerm(null);
    setSelectedLesson(null);
    setShowAttendance(false);
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
        timeout: 20000
      });

      if (response.status === 200) {
        //RECEBE O REGISTRO GERAL DO BACKEND
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

  const handleDeleteGB = (confirm) => {
    setConfirmDeleteGB(confirm);
  }

  const onDeleteGB = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.delete(`/gradebook/${gradebook._id}`, {
        timeout: 20000
      });

      if (response.status === 200) {
        handleSelectGradebook(null);
        showStatusBar({ message: 'Caderneta removida', type: 'success' });
      } else {
        showStatusBar({ message: 'Erro ao deletar caderneta', type: 'error' });
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

  const handleCreatePDF = async (term) => {
    // console.log(term)
    const blob = await pdf(<TermToPDF gradebook={gradebook} term={term} />).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "caderneta_escolar.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className='gradebook-container'>
      <div className='subject-header'>
        <div className='subject-image-container'>
          <img src={subjectImg} alt="Imagem da matéria" className='subject-background' />

          <div className='subject-name'>
            <div className='back-button-container'>
              <MdArrowBack
                onClick={() => handleSelectGradebook(null)}
                fontSize={20}
                color='#FFF'
                cursor='pointer'
              />
            </div>

            <div className='subject-info-container'>
              <h2>{gradebook.subject.name}</h2>
              <h3>{gradebook.academicYear}</h3>
              <h3>
                {classroomTypeToPT(gradebook.classroom.classroomType)} {gradebook.classroom.grade} {gradebook.classroom.name} - {gradebook.classroom.shift}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className='gradebook-section'>
        <h3>Professor: {gradebook.teacher.name}</h3>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className='gradebook-section'>
          <div className='row-container'>
            <h3>Critérios</h3>
            {!showSkill ? (
              <MdArrowDropDown className='drop-icon' onClick={() => setShowSkill(true)} />
            ) : (
              <MdArrowDropUp className='drop-icon' onClick={() => setShowSkill(false)} />
            )}
          </div>

          {showSkill ? (
            <div className='skill-container'>
              <textarea value={skill} onChange={(e) => setSkill(e.target.value)} />
              <button className='primary-button' onClick={() => handleSaveSkill()}>
                Salvar
              </button>
            </div>
          ) : (
            <div />
          )}
        </div>
      )}

      <div className='gradebook-section'>
        <div className='row-container'>
          <h3>Bimestres</h3>
          <button onClick={() => handleTermModal(true)} className='primary-button'>
            NOVO BIMESTRE
          </button>
        </div>

        {isStudentGradesVisible && (
          <StudentGrades
            handleClose={() => setIsStudentGradesVisible(false)}
            gradebook={gradebook}
            term={selectedTerm}
          />
        )}

        {showAttendance ? (
          <Attendance
            gradebook={gradebook}
            term={selectedTerm}
            lesson={selectedLesson}
            handleSelectGradebook={(gradebook) => {
              handleSelectGradebook(gradebook);
              setShowAttendance(false);
            }}
            handleCloseAttendance={() => handleCloseAttendance()}
            isEditingAttendance={isEditingAttendance}
            classroomType={gradebook.classroom.classroomType}
          />
        ) : (
          gradebook.terms.map((term) => {
            const totalWorkload = term.lessons?.reduce((sum, lesson) => sum + (lesson.workload || 0), 0);

            return loadingRemoveLesson ? (
              <LoadingSpinner key={term._id} />
            ) : (
              <div key={term._id} className='lesson-container'>
                <div className='row-container lesson-container-header'>
                  <div className='row-container'>
                    <div className='dropdown-button' onClick={() => toggleLessons(term._id)}>
                      {expandedTerms[term._id] ? <MdKeyboardArrowUp size={24} /> : <MdKeyboardArrowDown size={24} />}
                    </div>

                    <div className='highlight-container'>
                      <h4>{term.name}</h4>
                      <MdEdit onClick={() => handleEditTerm(term)} className='edit-term-button' />
                    </div>

                    <div className='highlight-container margin-left'>
                      <h4>
                        Aulas: {totalWorkload}/{!subject ? 'Carregando...' : subject.workload}
                      </h4>
                    </div>

                    <div className='highlight-container margin-left'>
                      <img src={generatePDF} alt="pdf-image" onClick={() => handleCreatePDF(term)} />
                    </div>
                  </div>
                  <button className='add-lesson-button' onClick={() => handleOpenLesson(term)}>
                    <MdAdd />
                  </button>
                </div>

                {showLesson ? (
                  <Lesson
                    term={term}
                    handleCloseLesson={() => handleCloseLesson()}
                    onAddLesson={(lesson) => onAddLesson(lesson)}
                    onEditLesson={(lesson) => onEditLesson(lesson)}
                    selectedLesson={selectedLesson}
                    editingLesson={editingLesson}
                    loading={loading}
                  />
                ) : (
                  <div />
                )}

                {expandedTerms[term._id] && (
                  <>
                    {!term.lessons || term.lessons.length < 1 ? (
                      <p>Nenhuma aula registrada nesse bimestre</p>
                    ) : (
                      term.lessons.map((lesson, index) => (
                        <div
                          key={lesson._id}
                          className={`single-lesson-container ${index % 2 === 0 ? 'even' : 'odd'}`}
                        >
                          <div className='row-container'>
                            <div className='circular-container'>ch: {lesson.workload}</div>
                            <div>
                              {dateToString(lesson.date)}
                              <p className='lesson-topic'>Assunto: {lesson.topic}</p>
                            </div>
                          </div>
                          <div className='lesson-actions'>
                            <button onClick={() => onDeleteLesson(term, lesson)}>Deletar aula</button>
                            <button onClick={() => handleEditLesson(term, lesson)}>Editar aula</button>

                            {lesson.attendance?.length > 0 ? (
                              <button onClick={() => handleOpenAttendance(term, lesson, true)}>
                                Editar chamada
                              </button>
                            ) : (
                              <button onClick={() => handleOpenAttendance(term, lesson, false)}>
                                Nova chamada
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                    {term.lessons.length > 0 && (
                      <div className='term-bottom-button'>
                        <button
                          className='primary-button'
                          onClick={() => handleOpenStudentGrades(term)}
                        >
                          INSTRUMENTO DE AVALIAÇÃO DO PROFESSOR
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })
        )}

        {termModal ? (
          <TermModal
            handleTermModal={(isOpen) => handleTermModal(isOpen)}
            onSaveTerm={(term) => onSaveTerm(term)}
            onEditTerm={(term) => onEditTerm(term)}
            selectedTerm={selectedTerm}
            onDeleteTerm={(term) => onDeleteTerm(term)}
            loading={loading}
          />
        ) : (
          <div />
        )}
      </div>

      {/* <div className='gradebook-section'>
        <div className='row-container'>
          <h3>Registro Geral da avaliação da aprendizagem</h3>
          <button className='primary-button' onClick={() => handleOpenAnnualRegistration()}>
            GERAR
          </button>
        </div>

        {isAnnualRegistrationVisible && learningRecords && (
          <AnnualRegistration
            handleCloseAnnualRegistration={() => setIsAnnualRegistrationVisible(false)}
            learningRecords={learningRecords}
          />
        )}
      </div>

      <div className='gradebook-section danger-zone'>
        <div className='row-container'>
          <h3>Zona de perigo</h3>
          <button onClick={() => handleDeleteGB(true)}>Deletar caderneta</button>
        </div>

        {confirmDeleteGB ? (
          <div className='confirm-delete-container'>
            Essa ação não poderá ser desfeita. Deseja continuar com a exclusão?
            <div className='row-container confirm-buttons'>
              <button onClick={() => handleDeleteGB(false)}>CANCELAR</button>
              <button onClick={() => onDeleteGB()}>PROSSEGUIR</button>
            </div>
          </div>
        ) : (
          <div />
        )}
      </div> */}

      {statusMessage && (
        <StatusBar
          message={statusMessage.message}
          type={statusMessage.type}
          onClose={() => setStatusMessage(null)}
        />
      )}
    </div>
  );
}

export default SelectedGradebook