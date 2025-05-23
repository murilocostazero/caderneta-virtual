import React, { useState } from 'react';
import teacherimg from '../../assets/images/image-teacher.jpg';
import checkok from '../../assets/images/check-ok.png';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa'; // Biblioteca de ícones react-icons
import { MdPersonAdd } from "react-icons/md";
import './Login.css';
import StatusBar from '../../components/StatusBar/StatusBar';
import axiosInstance from '../../utils/axiosInstance';
import { validateEmail } from '../../utils/helper';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const showStatusBar = (status) => setStatusMessage({ message: status.message, type: status.type });

  const handleLogin = async () => {
    if (!email || !password) {
      showStatusBar({ message: 'Preencha todos os campos', type: 'error' })
    } else if (!validateEmail(email)) {
      showStatusBar({ message: 'Insira um email válido', type: 'error' })
    } else {
      setLoading(true);
      try {
        const response = await axiosInstance.post('/login', {
          email: email,
          password: password
        }, {
          timeout: 20000
        });

        if (response.data && response.data.accessToken) {
          localStorage.setItem('token', response.data.accessToken);
          navigate('/', { replace: true });
        } else {
          showStatusBar({ message: 'Login incorreto', type: 'error' });
        }

      } catch (error) {
        console.log(error)
        if (error.code === 'ERR_NETWORK') {
          showStatusBar({ message: 'Verifique sua conexão com a internet', type: 'error' });
        }
        else if (error.response.data.message) {
          showStatusBar({ message: error.response.data.message, type: 'error' });
        } else {
          showStatusBar({ message: 'Um erro inesperado aconteceu. Tente novamente.', type: 'error' });
        }
      }
      setLoading(false);
    }
  }

  const handleSingup = async () => {
    if (!name || !email || !password || !userType) {
      showStatusBar({ message: 'Preencha todos os campos', type: 'error' })
    } else if (!validateEmail(email)) {
      showStatusBar({ message: 'Insira um email válido', type: 'error' })
    } else {
      setLoading(true);
      try {
        const response = await axiosInstance.post('/create-account', {
          name: name,
          email: email,
          password: password,
          userType: userType
        }, {
          timeout: 20000
        });

        if (response.status >= 400 && response.status <= 500) {
          showStatusBar({ message: response.message, type: 'error' });
        } else {
          showStatusBar({ message: 'Sucesso ao cadastrar usuário. Fazendo login...', type: 'success' });
          handleLogin();
        }

      } catch (error) {
        console.log(error)
        if (error.code === 'ERR_NETWORK') {
          showStatusBar({ message: 'Verifique sua conexão com a internet', type: 'error' });
        }
        else if (error.response.data.message) {
          showStatusBar({ message: error.response.data.message, type: 'error' });
        } else {
          showStatusBar({ message: 'Um erro inesperado aconteceu. Tente novamente.', type: 'error' });
        }
      }
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="login-section">
        <div className='title-section'>
          <img src={checkok} alt='Logo' className='logo-icon' />
          <label className='title'>Caderneta Virtual</label>
        </div>

        <form className="login-form" onSubmit={isLogin ? handleLogin : handleSingup}>
          <p className='title'>Olá. Seja bem-vindo!</p>
          <p className='subtitle'>Por favor, insira suas credenciais</p>

          {
            !isLogin ?
              <div className="input-group">
                <MdPersonAdd className="login-icon" />
                <input
                  type="name"
                  placeholder="Digite seu nome e sobrenome"
                  value={name}
                  onChange={(e) => setName(e.target.value)} />
              </div> :
              <div />
          }

          <div className="input-group">
            <FaEnvelope className="login-icon" />
            <input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="input-group">
            <FaLock className="login-icon" />
            <input
              type={!showPassword ? "password" : "text"}
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)} />

            {
              showPassword ?
                <FaEyeSlash onClick={() => setShowPassword(!showPassword)} className="login-icon password-icon" /> :
                <FaEye onClick={() => setShowPassword(!showPassword)} className="login-icon password-icon" />
            }

          </div>

          {
            !isLogin ?
              <div className="input-group">
                <FaUser className="login-icon" />
                <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                  <option value="">Selecione sua função</option>
                  <option value="teacher">Professor</option>
                  <option value="manager">Gestor</option>
                </select>
              </div>
              :
              <div />
          }

          {
            loading ?
              <LoadingSpinner /> :
              <button type="submit" onClick={isLogin ? handleLogin : handleSingup}>
                {
                  isLogin ?
                    'Entrar' :
                    'Cadastrar'
                }
              </button>
          }
        </form>

        {/* <div className='singup-msg-container'>
            {
              isLogin ?
                <label className='singup-msg'>Não é cadastrado? <span className='singup-link' onClick={() => setIsLogin(!isLogin)}>Criar conta</span></label> :
                <label className='singup-msg'>Já tem conta? <span className='singup-link' onClick={() => setIsLogin(!isLogin)}>Fazer login</span></label>
            }
          </div> */}

        <span className='forget-password' onClick={() => navigate('/forget-password')}>Esqueceu sua senha?</span>

        <footer className='footer'>
          Junte-se a nós e experimente mais praticidade! Aqui você terá mais tempo para o que realmente importa.
        </footer>
      </div>
      <div className="image-section">
        <img src={teacherimg} alt="Imagem de fundo" className='image-background' />
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

export default Login;