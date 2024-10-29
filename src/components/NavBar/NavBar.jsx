import React from 'react';
import { FaUser } from "react-icons/fa";
import './NavBar.css';

const NavBar = ({ username }) => {
    return (
        <div className="navbar">
            <div className="navbar-content">
                <div className='right-container'>
                    <div className='icon-container'>
                        <FaUser className='icon' />
                    </div>
                    <div className='user-container'>
                        <span className="username">Fulano da Silva</span>
                        <p>Sair</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavBar;
