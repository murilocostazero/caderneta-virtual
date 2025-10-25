import React, { useState, useEffect, useRef } from 'react';
import { MdAdd, MdClose } from 'react-icons/md';
import { FaChalkboardTeacher, FaBook } from "react-icons/fa";
import { FaPeopleLine } from "react-icons/fa6";
import './Gradebook.css';
import GradebookModal from './GradebookModal';
import axiosInstance from '../../utils/axiosInstance';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import StatusBar from '../StatusBar/StatusBar';
import SelectedGradebook from './SelectedGradebook';
import { classroomTypeToPT } from '../../utils/helper';
import SelectedKindergarten from './SelectedKindergarten';

const Gradebook = ({ globalSchool, userInfo }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gradebooks, setGradebooks] = useState([]);
  const [statusMessage, setStatusMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGradebook, setSelectedGradebook] = useState(null);
  const [gradebookType, setGradebookType] = useState('elementary');
  const [experienceFields, setExperienceFields] = useState([]);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [filterSelect, setFilterSelect] = useState('teacher');

  const lastGradebookRef = useRef(null);
  const topRef = useRef(null);

  useEffect(() => {
    // Zera a lista e o skip ao trocar de tipo
    setGradebooks([]);
    setSkip(0);

    if (userInfo.userType === 'manager') {
      if (gradebookType === 'elementary') {
        getGradebooks();
      } else {
        getKindergartenGB();
        getExperienceFields();
      }
    } else {
      if (gradebookType === 'elementary') {
        getTeacherGradebooks();
      } else {
        getTeacherKindergarten();
        getExperienceFields();
      }
    }

    const checkScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, [selectedGradebook, gradebookType]);

  const showStatusBar = (status) => {
    setStatusMessage({ message: status.message, type: status.type });
    setTimeout(() => {
      setStatusMessage(null);
    }, 2000);
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
  }

  const onSaveGradebook = async (gradebook) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/gradebook`, {
        academicYear: gradebook.academicYear,
        school: globalSchool._id,
        classroom: gradebook.classroom,
        teacher: gradebook.teacher,
        subject: gradebook.subject
      }, {
        timeout: 20000
      });

      if (response.status === 201) {
        onCloseModal();
        getGradebooks();
      } else {
        showStatusBar({ message: 'Erro ao buscar escolas', type: 'error' });
      }
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        showStatusBar({ message: 'Verifique sua conexão com a internet', type: 'error' });
      } else {
        showStatusBar({ message: 'Um erro inesperado aconteceu. Tente novamente.', type: 'error' });
      }
    }
    setLoading(false);
  }

  const getAllGradebooks = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/gradebook/school-allgb/${globalSchool._id}`,
        { timeout: 20000 }
      );

      if (response.status === 200) {
        // Como não há mais paginação, simplesmente define a lista completa
        setGradebooks(response.data.data);

        // Atualiza total (caso venha do backend)
        if (response.data.total !== undefined) {
          setTotal(response.data.total);
        }
      } else {
        showStatusBar({ message: 'Erro ao buscar cadernetas', type: 'error' });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const getGradebooks = async (currentSkip = 0) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/gradebook/school/${globalSchool._id}?skip=${currentSkip}&limit=10`,
        { timeout: 20000 }
      );

      if (response.status === 200) {
        // Se for a primeira página (skip 0), substitui a lista
        // Se for "Load More", concatena os novos items
        setGradebooks(prevGradebooks =>
          currentSkip === 0 ? response.data.data : [...prevGradebooks, ...response.data.data]
        );

        // Atualiza total (caso venha do backend)
        if (response.data.total !== undefined) {
          setTotal(response.data.total);
        }
      } else {
        showStatusBar({ message: 'Erro ao buscar cadernetas', type: 'error' });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const getTeacherGradebooks = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/gradebook/teacher/${userInfo._id}`, {
        timeout: 20000
      });

      if (response.status === 200) {
        setGradebooks(response.data);
      } else {
        showStatusBar({ message: 'Erro ao buscar cadernetas', type: 'error' });
      }
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        showStatusBar({ message: 'Verifique sua conexão com a internet', type: 'error' });
      } else {
        showStatusBar({ message: 'Um erro inesperado aconteceu. Tente novamente.', type: 'error' });
      }
    }
    setLoading(false);
  }

  //-----------Kindergarten
  const getKindergartenGB = async (currentSkip = 0) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/kindergarten/school/${globalSchool._id}?skip=${currentSkip}&limit=10`,
        { timeout: 20000 }
      );

      if (response.status === 200) {
        // Se for a primeira página (skip 0), substitui a lista
        // Se for "Load More", concatena os novos items
        setGradebooks(prevGradebooks =>
          currentSkip === 0 ? response.data.data : [...prevGradebooks, ...response.data.data]
        );

        // Atualiza total (caso venha do backend)
        if (response.data.total !== undefined) {
          setTotal(response.data.total);
        }
      } else {
        showStatusBar({ message: 'Erro ao buscar cadernetas', type: 'error' });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onSaveKindergarten = async (gradebook) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/kindergarten`, {
        academicYear: gradebook.academicYear,
        school: globalSchool._id,
        classroom: gradebook.classroom,
        teacher: gradebook.teacher
      }, {
        timeout: 20000
      });

      if (response.status === 201) {
        onCloseModal();
        getKindergartenGB();
      } else {
        showStatusBar({ message: 'Erro ao buscar escolas', type: 'error' });
      }
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        showStatusBar({ message: 'Verifique sua conexão com a internet', type: 'error' });
      } else {
        showStatusBar({ message: 'Um erro inesperado aconteceu. Tente novamente.', type: 'error' });
      }
    }
    setLoading(false);
  }

  const getTeacherKindergarten = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/kindergarten/teacher/${userInfo._id}`, {
        timeout: 20000
      });

      if (response.status === 200) {
        setGradebooks(response.data);
      } else {
        showStatusBar({ message: 'Erro ao buscar cadernetas', type: 'error' });
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

  const filteredGradebooks = filterSelect === 'teacher' ? gradebooks.filter(gradebook =>
    gradebook.teacher.name.toString().includes(searchQuery)
  ) : filterSelect === 'subject' ? gradebooks.filter(gradebook =>
    gradebook.subject.name.toString().includes(searchQuery)
  ) : gradebooks.filter(gradebook =>
    gradebook.classroom.grade.toString().includes(searchQuery)
  );

  const handleSelectGradebook = (gradebook) => {
    if (!gradebook) setSearchQuery('');
    setSelectedGradebook(gradebook);
  }

  const getExperienceFields = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/experience-field/school/${globalSchool._id}`, {
        timeout: 20000
      });

      if (response.status === 200) {
        setExperienceFields(response.data);
      } else {
        showStatusBar({ type: 'error', message: 'Erro ao buscar campos' });
      }
    } catch (error) {
      console.log(error)
      if (error.code === 'ERR_NETWORK') {
        showStatusBar({ type: 'error', message: 'Verifique sua conexão com a internet' });
      } else {
        showStatusBar({ type: 'error', message: 'Um erro inesperado aconteceu. Tente novamente.' });
      }
    }
    setLoading(false);
  }

  const handleLoadMore = async () => {
    if (gradebooks.length >= total) return;

    const newSkip = gradebooks.length;
    setSkip(newSkip);

    if (gradebookType === 'elementary') {
      await getGradebooks(newSkip);
    } else {
      await getKindergartenGB(newSkip);
    }

    // Pequeno timeout para garantir que o DOM já atualizou
    setTimeout(() => {
      lastGradebookRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  const scrollToTop = () => {
    // Tenta várias abordagens diferentes
    if (topRef.current) {
      topRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }

    // Fallback para scroll da página
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Fallback adicional para o body/html
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div ref={topRef}>
      {
        selectedGradebook && gradebookType === 'elementary' ?
          <SelectedGradebook
            handleSelectGradebook={(gradebook) => handleSelectGradebook(gradebook)}
            gradebook={selectedGradebook}
            userInfo={userInfo} /> :
          selectedGradebook && gradebookType === 'kindergarten' ?
            <SelectedKindergarten
              handleSelectGradebook={(gradebook) => handleSelectGradebook(gradebook)}
              gradebook={selectedGradebook}
            />
            :
            <div className='gradebook-container'>
              {
                loading ?
                  <LoadingSpinner /> :
                  <div className="gradebooks-container">
                    <div className='gradebook-search-container'>
                      <div>
                        <h2>Cadernetas</h2>
                        <select
                          className='gradebook-select'
                          id="gradebookSelect"
                          value={gradebookType}
                          onChange={(e) => setGradebookType(e.target.value)}>
                          <option value="elementary">Fundamental e Médio</option>
                          <option value="kindergarten">Educação infantil</option>
                        </select>

                      </div>
                      {
                        userInfo && userInfo.userType === 'manager' &&
                        <div>
                          <div className='row-container'>
                            <h4>Filtrar por:</h4>
                            <select
                              onChange={(e) => {
                                setSearchQuery('');
                                setFilterSelect(e.target.value);
                              }}
                              value={filterSelect}>
                              <option value="teacher">Professor(a)</option>
                              <option value="subject">Matéria</option>
                              <option value="classroom">Turma</option>
                            </select>
                          </div>
                          <div className='gb-filter-container'>
                            <input
                              placeholder={`Filtrar por ${filterSelect === 'teacher' ? 'professor(a)' : filterSelect === 'subject' ? 'matéria' : 'turma'}`}
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)} />
                            <MdClose className='clear-icon' onClick={() => setSearchQuery('')} />
                          </div>
                        </div>
                      }
                    </div>
                    <div className="gradebook-header">
                      <p>Turma</p>
                      <p>Matéria</p>
                      <p>Professor</p>
                      {/* <p>Gerar PDF</p> */}
                    </div>
                    {
                      gradebooks.length < 1 ? (
                        <h3>Nenhuma caderneta cadastrada até o momento</h3>
                      ) : (
                        filteredGradebooks.map((gradebook, index) => {
                          const isLast = index === filteredGradebooks.length - 1;
                          return (
                            <div
                              key={gradebook._id}
                              ref={isLast ? lastGradebookRef : null}
                              className="gradebook-list-item"
                              onClick={() => handleSelectGradebook(gradebook)}
                            >
                              <p>
                                {classroomTypeToPT(gradebook.classroom.classroomType)} {gradebook.classroom.grade} {gradebook.classroom.name} - {gradebook.classroom.shift}
                              </p>
                              <p>{!gradebook.subject ? 'Todas as matérias' : gradebook.subject.name}</p>
                              <p>{gradebook.teacher.name}</p>
                            </div>
                          );
                        })
                      )
                    }

                    {gradebooks.length > 0 && (
                      <div className="load-more-wrapper">
                        <p className="load-more-text">
                          Mostrando {gradebooks.length} de {total}
                        </p>
                        {gradebooks.length < total && (
                          <div className='row-container'>
                            <button
                              className="load-more-btn"
                              onClick={handleLoadMore}
                              disabled={loading}
                            >
                              {loading ? 'Carregando...' : 'CARREGAR +10'}
                            </button>
                            <button disabled={loading} onClick={() => getAllGradebooks()} className='load-more-btn'>CARREGAR TODAS</button>
                          </div>
                        )}
                        <button className="scroll-top-btn" onClick={scrollToTop}>
                          ^ IR PARA O TOPO ^
                        </button>
                      </div>
                    )}



                  </div>
              }

              {
                isModalOpen ?
                  <GradebookModal
                    loadingSave={loading}
                    onCloseModal={() => onCloseModal()}
                    globalSchool={globalSchool}
                    onSaveGradebook={(gradebook) => onSaveGradebook(gradebook)}
                    onSaveKindergarten={(gradebook) => onSaveKindergarten(gradebook)}
                    gradebookType={gradebookType} /> :
                  <div />
              }

              {
                userInfo.userType === 'manager' ?
                  <button className='add-button' onClick={() => setIsModalOpen(true)}>
                    <MdAdd />
                  </button> :
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
      }
    </div>
  )
}

export default Gradebook