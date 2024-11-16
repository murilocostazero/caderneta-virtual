import React, { useState, useEffect } from 'react';
import { MdAdd, MdClose } from 'react-icons/md';
import './Gradebook.css';
import GradebookModal from './GradebookModal';
import axiosInstance from '../../utils/axiosInstance';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import StatusBar from '../StatusBar/StatusBar';
import SelectedGradebook from './SelectedGradebook';

const Gradebook = ({ globalSchool }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gradebooks, setGradebooks] = useState([]);
  const [statusMessage, setStatusMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGradebook, setSelectedGradebook] = useState(null);

  useEffect(() => {
    getGradebooks();
  }, [selectedGradebook]);

  const showStatusBar = (status) => setStatusMessage({ message: status.message, type: status.type });

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
        timeout: 10000
      });

      if (response.status === 201) {
        onCloseModal();
        getGradebooks();
      } else {
        showStatusBar({ message: 'Erro ao buscar escolas', type: 'error' });
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

  const getGradebooks = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/gradebook/school/${globalSchool._id}`, {
        timeout: 10000
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
    gradebook.classroom.grade.toString().includes(searchQuery) ||
    gradebook.classroom.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gradebook.classroom.shift.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectGradebook = (gradebook) => {
    setSelectedGradebook(gradebook);
  }

  return (
    selectedGradebook ?
    <SelectedGradebook 
      handleSelectGradebook={(gradebook) => handleSelectGradebook(gradebook)} 
      gradebook={selectedGradebook} /> : 
    <div className='gradebook-container'>
      {
        loading ?
          <LoadingSpinner /> :
          <div className="gradebooks-container">
            <div className='gradebook-search-container'>
              <h2>Cadernetas</h2>
              <div>
                <input
                  placeholder='Filtrar cadernetas por turma'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} />
                <MdClose className='clear-icon' />
              </div>
            </div>
            <div className="gradebook-header">
              <p>Turma</p>
              <p>Matéria</p>
              <p>Professor</p>
            </div>
            {filteredGradebooks.map((gradebook) => (
              <div key={gradebook._id} className="gradebook-list-item" onClick={() => handleSelectGradebook(gradebook)}>
                <p>{gradebook.classroom.grade}º ano {gradebook.classroom.name} - {gradebook.classroom.shift}</p>
                <p>{gradebook.subject.name}</p>
                <p>{gradebook.teacher.name}</p>
              </div>
            ))}
          </div>
      }

      {
        isModalOpen ?
          <GradebookModal
            loadingSave={loading}
            onCloseModal={() => onCloseModal()}
            globalSchool={globalSchool}
            onSaveGradebook={(gradebook) => onSaveGradebook(gradebook)} /> :
          <div />
      }
      <button className='add-button' onClick={() => setIsModalOpen(true)}>
        <MdAdd />
      </button>

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

export default Gradebook