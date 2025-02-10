import React, { useEffect, useState } from 'react';
import './Home.css'
import { FaSchool, FaUserTie, FaBook, FaChalkboardTeacher, FaUserGraduate, FaClipboard, FaWrench } from 'react-icons/fa';
import NavBar from '../../components/NavBar/NavBar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import School from '../../components/School/School';
import Teacher from '../../components/Teacher/Teacher';
import SchoolSubject from '../../components/SchoolSubject/SchoolSubject';
import StatusBar from '../../components/StatusBar/StatusBar';
import NoSelectedSchool from '../../components/NoSelectedSchool/NoSelectedSchool';
import Classroom from '../../components/Classroom/Classroom';
import Student from '../../components/Student/Student';
import Gradebook from '../../components/Gradebook/Gradebook';
import Team from '../../components/Team/Team';
import Settings from '../../components/Settings/Settings';
import { getFirstAndSecondName } from '../../utils/helper';

const Home = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [selectedPage, setSelectedPage] = useState('school');
  const [globalSchool, setGlobalSchool] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const navigate = useNavigate();
  const showStatusBar = (status) => setStatusMessage({ message: status.message, type: status.type });

  useEffect(() => {
    getUserInfo();
  }, [userInfo]);

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/get-user');
      if (response.data.user) {
        setUserInfo(response.data.user);
        if (response.data.user.lastSelectedSchool) getLastSelectedSchool(response.data.user.lastSelectedSchool);
      }
    } catch (error) {
      if (error.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  }

  const getLastSelectedSchool = async (schoolId) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/school/${schoolId}`, {
        timeout: 10000
      });

      if (response.status !== 200) {
        showStatusBar({ message: 'Erro ao buscar escola', type: 'error' });
      } else {
        setGlobalSchool(response.data);
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

  return (
    <div>
      {
        userInfo ?
          <NavBar userInfo={getFirstAndSecondName(userInfo.name)} /> :
          <div />
      }
      <div className="home-container">
        <nav className="sidebar">
          <div
            className="nav-item"
            onClick={() => setSelectedPage('school')}>
            <FaSchool className="icon" />
            <label>Escola</label>
          </div>
          {
            userInfo && userInfo.userType === 'manager' &&
            <>
              <div
                className="nav-item"
                onClick={() => setSelectedPage('teacher')}>
                <FaUserTie className="icon" />
                <label>Colaboradores</label>
              </div>
              <div
                className="nav-item"
                onClick={() => setSelectedPage('schoolSubject')}>
                <FaBook className="icon" />
                <label>Disciplinas</label>
              </div>
              <div
                className="nav-item"
                onClick={() => setSelectedPage('classes')}>
                <FaChalkboardTeacher className="icon" />
                <label>Turmas</label>
              </div>
              <div
                className="nav-item"
                onClick={() => setSelectedPage('students')}>
                <FaUserGraduate className="icon" />
                <label>Alunos</label>
              </div>
            </>
          }
          <div
            className="nav-item"
            onClick={() => setSelectedPage('gradebook')}>
            <FaClipboard className="icon" />
            <label>Cadernetas</label>
          </div>

          <div
            className="nav-item"
            onClick={() => setSelectedPage('settings')}>
            <FaWrench className="icon" />
            <label>Ajustes</label>
          </div>

        </nav>
        <main className="content">
          {
            !userInfo ?
              <div /> :
              selectedPage === 'school' ?
                <School userInfo={userInfo} setGlobalSchool={(school) => setGlobalSchool(school)} /> :
                selectedPage === 'teacher' && userInfo.lastSelectedSchool ?
                  // <Teacher globalSchool={globalSchool} /> :
                  <Team globalSchool={globalSchool} /> :
                  selectedPage === 'schoolSubject' && userInfo.lastSelectedSchool ?
                    <SchoolSubject globalSchool={globalSchool} /> :
                    selectedPage === 'classes' && userInfo.lastSelectedSchool ?
                      <Classroom globalSchool={globalSchool} /> :
                      selectedPage === 'students' && userInfo.lastSelectedSchool ?
                        <Student globalSchool={globalSchool} /> :
                        selectedPage === 'gradebook' && userInfo.lastSelectedSchool ?
                          <Gradebook globalSchool={globalSchool} userInfo={userInfo} /> :
                          selectedPage === 'settings' && userInfo.lastSelectedSchool ?
                            <Settings globalSchool={globalSchool} userInfo={userInfo} /> :
                            <NoSelectedSchool />
          }
        </main>
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

export default Home