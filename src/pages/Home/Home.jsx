import React, { useEffect, useState } from 'react';
import './Home.css'
import { FaSchool, FaUserTie, FaBook, FaChalkboardTeacher, FaUserGraduate, FaClipboard } from 'react-icons/fa';
import NavBar from '../../components/NavBar/NavBar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import School from '../../components/School/School';
import Teacher from '../../components/Teacher/Teacher';

const Home = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [selectedPage, setSelectedPage] = useState('school');

  const navigate = useNavigate();

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/get-user');
      if (response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  }

  return (
    <div>
      <NavBar userInfo={userInfo} />
      <div className="home-container">
        <nav className="sidebar">
          <div
            className="nav-item"
            onClick={() => setSelectedPage('school')}>
            <FaSchool className="icon" />
            <label>Escola</label>
          </div>
          <div
            className="nav-item"
            onClick={() => setSelectedPage('teacher')}>
            <FaUserTie className="icon" />
            <label>Professor</label>
          </div>
          <div
            className="nav-item"
            onClick={() => setSelectedPage('subject')}>
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
          <div
            className="nav-item"
            onClick={() => setSelectedPage('gradebook')}>
            <FaClipboard className="icon" />
            <label>Cadernetas</label>
          </div>
        </nav>
        <main className="content">
          {
            !userInfo ?
              <div /> :
              selectedPage === 'school' ?
                <School userInfo={userInfo} /> :
                <Teacher />
          }
        </main>
      </div>
    </div>
  )
}

export default Home