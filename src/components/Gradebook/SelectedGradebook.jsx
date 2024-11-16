import React, { useState, useEffect } from 'react';
import { MdArrowBack } from 'react-icons/md';
import gbpt from '../../assets/images/subjects/gb-pt.png';
import gbmt from '../../assets/images/subjects/gb-mt.png';
import gbht from '../../assets/images/subjects/gb-ht.png';
import gbgf from '../../assets/images/subjects/gb-gf.jpg';
import gbcn from '../../assets/images/subjects/gb-cn.jpg';
import gbeg from '../../assets/images/subjects/gb-eg.jpg';
import gbet from '../../assets/images/subjects/gb-et.png';
import gbef from '../../assets/images/subjects/gb-ef.jpg';
import gbefc from '../../assets/images/subjects/gb-efc.jpg';
import './Gradebook.css';
import { normalizeString } from '../../utils/helper';

const SelectedGradebook = ({ gradebook, handleSelectGradebook }) => {
  const [subjectImg, setSubjectImg] = useState(null);

  useEffect(() => {
    selectSubjectImage();
  }, []);

  const selectSubjectImage = () => {
    switch (normalizeString(gradebook.subject.name)) {
      case 'portugues':
        setSubjectImg(gbpt);
        break;
      case 'matematica':
        setSubjectImg(gbmt);
        break;
      case 'ciencias':
        setSubjectImg(gbcn);
        break;
      case 'historia':
        setSubjectImg(gbht);
        break;
      case 'geografia':
        setSubjectImg(gbgf);
        break;
      case 'ingles':
        setSubjectImg(gbeg);
        break;
      case 'educacao fisica':
        setSubjectImg(gbef);
        break;
      case 'educacao financeira':
        setSubjectImg(gbefc);
        break;
      case 'educacao para o transito':
        setSubjectImg(gbet);
        break;
    }
  }

  return (
    <div className='gradebook-container'>
      <div className='subject-header'>
        <div className='subject-image-container'>
          <img src={subjectImg} alt="Imagem da matéria" />

          <div class="subject-name">
            <div className='back-button-container'>
              <MdArrowBack
                onClick={() => handleSelectGradebook(null)}
                fontSize={20}
                color='#FFF'
                cursor='pointer' />
            </div>

            <div className='subject-info-container'>
              <h2>{gradebook.subject.name}</h2>
              <h3>{gradebook.classroom.grade}º ano {gradebook.classroom.name} - {gradebook.classroom.shift}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className='gradebook-section'>
        <h3>Professor: {gradebook.teacher.name}</h3>
      </div>

      <div className='gradebook-section'>
        <h3>Critérios</h3>
      </div>

      <div className='gradebook-section'>
        <h3>1º bimestre</h3>
      </div>

      <div className='gradebook-section'>
        <h3>2º bimestre</h3>
      </div>

      <div className='gradebook-section'>
        <h3>3º bimestre</h3>
      </div>

      <div className='gradebook-section'>
        <h3>4º bimestre</h3>
      </div>
    </div>
  )
}

export default SelectedGradebook