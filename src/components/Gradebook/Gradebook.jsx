import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
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

  const getGradebooks = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/gradebook/school/${globalSchool._id}`, {
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

  const getKindergartenGB = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/kindergarten/school/${globalSchool._id}`, {
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

  const filteredGradebooks = gradebooks.filter(gradebook =>
    gradebook.teacher.name.toString().includes(searchQuery)
  );

  const handleSelectGradebook = (gradebook) => {
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

  return (
    <div>
      {
        selectedGradebook && gradebookType === 'elementary' ?
          <SelectedGradebook
            handleSelectGradebook={(gradebook) => handleSelectGradebook(gradebook)}
            gradebook={selectedGradebook} /> :
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
                        <div className='gb-filter-container'>
                          <input
                            placeholder='Filtrar por professor(a)'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)} />
                          <MdClose className='clear-icon' onClick={() => setSearchQuery('')} />
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
                      gradebooks.length < 1 ?
                        <h3>Nenhuma caderneta cadastrada até o momento</h3> :
                        filteredGradebooks.map((gradebook) => (
                          <div key={gradebook._id} className="gradebook-list-item" onClick={() => handleSelectGradebook(gradebook)}>
                            <p>
                              {classroomTypeToPT(gradebook.classroom.classroomType)} {gradebook.classroom.grade} {gradebook.classroom.name} - {gradebook.classroom.shift}
                            </p>
                            <p>{!gradebook.subject ? 'Todas as matérias' : gradebook.subject.name}</p>
                            <p>{gradebook.teacher.name}</p>
                          </div>
                        ))
                    }
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