import React, { useEffect, useState } from 'react';
import './Gradebook.css';
import { MdClose } from 'react-icons/md';
import { dateToString } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const KindergartenGrades = ({ handleClose, term, gradebook, classroomType }) => {
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [error, setError] = useState('');
  const [evaluations, setEvaluations] = useState([]);
  const [experienceFields, setExperienceFields] = useState([]);

  useEffect(() => {
    getExperienceFields();
    getEvaluation();
  }, []);

  const handleError = (message) => {
    setError(message);
    setTimeout(() => {
      setError('');
    }, 2000);
  }

  const getExperienceFields = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/experience-field/school/${gradebook.school._id}`, {
        timeout: 10000
      });

      if (response.status === 200) {
        setExperienceFields(response.data);
      } else {
        handleError('Erro ao buscar campos');
      }
    } catch (error) {
      console.log(error)
      if (error.code === 'ERR_NETWORK') {
        handleError('Verifique sua conexão com a internet');
      } else {
        handleError('Um erro inesperado aconteceu. Tente novamente.');
      }
    }
    setLoading(false);
  }

  const getEvaluation = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/kindergarten/${gradebook._id}/term/${term._id}/evaluations`, {
        timeout: 20000
      });
      console.log(response.data)
      if (response.status === 200) {
        setEvaluations(response.data.evaluations);
      } else {
        handleError('Erro ao buscar notas');
      }
    } catch (error) {
      console.log(error)
      if (error.code === 'ERR_NETWORK') {
        handleError('Verifique sua conexão com a internet');
      } else {
        handleError('Um erro inesperado aconteceu. Tente novamente.');
      }
    }
    setLoading(false);
  }

  const handleInputChange = (studentIndex, fieldIndex, value) => {
    const updatedEvaluations = evaluations.map((evaluation, i) => {
      if (i === studentIndex) {
        // Criar uma cópia da avaliação do aluno
        const updatedEvaluation = { ...evaluation };

        // Criar uma cópia dos critérios de avaliação
        const updatedFieldEvaluations = [...updatedEvaluation.evaluations];

        // Atualizar o critério de avaliação específico
        updatedFieldEvaluations[fieldIndex] = {
          ...updatedFieldEvaluations[fieldIndex],
          evaluationCriteria: value
        };

        // Retornar o objeto atualizado
        return {
          ...updatedEvaluation,
          evaluations: updatedFieldEvaluations
        };
      }
      return evaluation;
    });

    setEvaluations(updatedEvaluations);
  }

  // Função para salvar alterações (simula o envio para o backend)
  const handleSave = async () => {
    setLoadingSave(true);
    try {
      const response = await axiosInstance.put(`/kindergarten/${gradebook._id}/term/${term._id}/evaluations`, {
        evaluations: evaluations
      }, {
        timeout: 10000
      });

      if (response.status === 200) {
        // setEvaluations(response.data);
        getEvaluation();
      } else {
        handleError('Erro ao salvar notas');
      }
    } catch (error) {
      console.log(error)
      if (error.code === 'ERR_NETWORK') {
        handleError('Verifique sua conexão com a internet');
      } else {
        handleError('Um erro inesperado aconteceu. Tente novamente.');
      }
    }
    setLoadingSave(false);
  }

  return (
    <div className='modal-overlay'>
      <div className='student-grades-modal'>

        <div className='term-form'>
          <div className='align-right'>
            <button className="close-button" onClick={() => handleClose()}>
              <MdClose className='close-icon' />
            </button>
          </div>


          <div className='student-grades-container'>
            <h3>Instrumento de avaliação do professor</h3>

            <div className='row-container'>
              <label>Período: {term.name}</label>
              <label>De {dateToString(term.startDate)} a {dateToString(term.endDate)}</label>
            </div>

            {
              loading ?
                <LoadingSpinner /> :
                !evaluations ?
                  <p>Erro ao carregar notas dos alunos</p> :

                  <div className='evaluations-list'>
                    <table border="1" style={{ borderCollapse: 'collapse', width: '100%' }}>
                      <thead>
                        <tr>
                          <th>Nome do Aluno</th>
                          {
                            !experienceFields ?
                              <th>Carregando campos...</th> :
                              experienceFields.map((experience) => (
                                <th key={experience._id}>{experience.name}</th>
                              ))
                          }
                          <th>Total de faltas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          !evaluations ?
                            <tr>Carregando...</tr> :
                            evaluations.map((evaluation, index) => (
                              <tr key={index}>
                                <td>{evaluation.student.name}</td>

                                {
                                  evaluation.evaluations.map((experience, fieldIndex) =>
                                    <td key={fieldIndex}>
                                      <select
                                        value={experience.evaluationCriteria}
                                        onChange={(e) => handleInputChange(index, fieldIndex, e.target.value)}>
                                        <option value='not-yet'>Ainda não desenvolvido</option>
                                        <option value='under-development'>Em desenvolvimento</option>
                                        <option value='developed'>Desenvolvido</option>
                                      </select>
                                    </td>
                                  )
                                }

                                <td>
                                  <input
                                    className='absence-field'
                                    type="number"
                                    value={evaluation.totalAbsences}
                                    onChange={(e) =>
                                      handleInputChange(index, "totalAbsences", e.target.value)
                                    }
                                    disabled={true}
                                  />
                                </td>
                              </tr>
                            ))}
                      </tbody>
                    </table>

                  </div>
            }
            <div className='evaluations-button'>
              {
                error ?
                  <p className='error-message'>{error}</p> :
                  loadingSave ?
                    <LoadingSpinner /> :
                    <button
                      onClick={() => handleSave()}
                      className='primary-button'>
                      Salvar alterações
                    </button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default KindergartenGrades