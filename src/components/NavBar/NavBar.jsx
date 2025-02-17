import React, { useState } from 'react';
import { FaUser } from "react-icons/fa";
import './NavBar.css';
import { useNavigate } from 'react-router-dom';
import teacherOk from '../../assets/images/teacher-ok.png';


const NavBar = ({ userInfo }) => {
    const navigate = useNavigate();

    const [openMenu, setOpenMenu] = useState(false);

    const onLogout = () => {
        localStorage.clear();
        navigate('/login');
    }

    return (
        <div className="navbar">
            <div className="navbar-content">
                <div className="logo-container">
                    <img src={teacherOk} alt='Figurinha professor' className='teacher-sticker' />
                    <div className="logo-name">
                        Caderneta Virtual
                    </div>
                </div>
                <div className='right-container'>
                    {
                        openMenu && (
                            <div className='user-container'>
                                <span className="username">{userInfo}</span>
                                <p onClick={() => onLogout()}>Sair</p>
                            </div>
                        )
                    }
                    <div className='icon-container' onClick={() => setOpenMenu(!openMenu)}>
                        <FaUser className='icon' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavBar;
