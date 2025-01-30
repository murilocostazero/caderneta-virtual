import React from 'react';
import { MdCheckCircle } from "react-icons/md";
import './NoSelectedSchool.css';

const NoSelectedSchool = () => {
  return (
    <div className='no-school-warning'>
      <p>Você precisa selecionar uma escola para que os dados sejam carregados.</p>
      <p className='no-school-subtitle'>Clique no botão de check <button
        className="check-button">
        <MdCheckCircle size={24} />
      </button> na escola desejada na aba <span style={{ fontWeight: 'bold', marginLeft: 4 }}>Escola</span></p>

    </div>
  )
}

export default NoSelectedSchool