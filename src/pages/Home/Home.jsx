import React, { useEffect, useState } from 'react';
import './Home.css'
import { FaSchool, FaUserTie, FaBook, FaChalkboardTeacher, FaUserGraduate, FaClipboard } from 'react-icons/fa';
import NavBar from '../../components/NavBar/NavBar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

const Home = () => {
  const [userInfo, setUserInfo] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    getUserInfo();
  },[]);

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/get-user');
      if (response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  }

  return (
    <div>
      <NavBar />
      <div className="home-container">
        <nav className="sidebar">
          <div className="nav-item">
            <FaSchool className="icon" />
            <label>Escola</label>
          </div>
          <div className="nav-item">
            <FaUserTie className="icon" />
            <label>Professor</label>
          </div>
          <div className="nav-item">
            <FaBook className="icon" />
            <label>Disciplinas</label>
          </div>
          <div className="nav-item">
            <FaChalkboardTeacher className="icon" />
            <label>Turmas</label>
          </div>
          <div className="nav-item">
            <FaUserGraduate className="icon" />
            <label>Alunos</label>
          </div>
          <div className="nav-item">
            <FaClipboard className="icon" />
            <label>Cadernetas</label>
          </div>
        </nav>
        <main className="content">
          <h1>Bem-vindo à Home!</h1>
          <p>Conteúdo principal vai aqui.</p>
        </main>
      </div>
    </div>
  )
}

export default Home