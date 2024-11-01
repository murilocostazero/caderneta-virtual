import React from 'react';
import { FaUser } from "react-icons/fa";
import './NavBar.css';
import { useNavigate } from 'react-router-dom';


const NavBar = ({ userInfo }) => {
    const navigate = useNavigate();

    const onLogout = () => {
        localStorage.clear();
        navigate('/login');
      }

    return (
        <div className="navbar">
            <div className="navbar-content">
                <div className='right-container'>
                    <div className='user-container'>
                        <span className="username">{!userInfo ? 'Carregando' : userInfo.email}</span>
                        <p onClick={()=> onLogout()}>Sair</p>
                    </div>
                    <div className='icon-container'>
                        <FaUser className='icon' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavBar;
