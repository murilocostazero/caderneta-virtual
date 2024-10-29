import React, { useState } from 'react';
import teacherimg from '../../assets/images/image-teacher.jpg';
import checkok from '../../assets/images/check-ok.png';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa'; // Biblioteca de ícones react-icons
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="container">
      <div className="login-section">
        <div className='title-section'>
          <img src={checkok} alt='Logo' className='logo-icon' />
          <label className='title'>Caderneta Virtual</label>
        </div>

        <form className="login-form">
          <p className='title'>Olá, professor(a)</p>
          <p className='subtitle'>Por favor, insira suas credenciais</p>
          <div className="input-group">
            <FaEnvelope className="icon" />
            <input type="email" placeholder="Digite seu email" />
          </div>
          <div className="input-group">
            <FaLock className="icon" />
            <input type="password" placeholder="Digite sua senha" />
          </div>

          {
            !isLogin ?
              <div className="input-group">
                <FaUser className="icon" />
                <select>
                  <option value="">Selecione sua função</option>
                  <option value="teacher">Professor</option>
                  <option value="manager">Gestor</option>
                </select>
              </div>
              :
              <div />
          }
          <button type="submit">
            {
              isLogin ?
              'Entrar' :
              'Cadastrar'
            }
          </button>

          <div className='singup-msg-container'>
            {
              isLogin ?
                <label className='singup-msg'>Não é cadastrado? <span className='singup-link' onClick={() => setIsLogin(!isLogin)}>Criar conta</span></label> :
                <label className='singup-msg'>Já tem conta? <span className='singup-link'  onClick={() => setIsLogin(!isLogin)}>Fazer login</span></label>
            }
          </div>
        </form>

        <footer className='footer'>
          Junte-se a nós e experimente mais praticidade! Aqui você terá mais tempo para o que realmente importa.
        </footer>
      </div>
      <div className="image-section">
        <img src={teacherimg} alt="Imagem de fundo" className='image-background' />
      </div>
    </div>
  )
}

export default Login