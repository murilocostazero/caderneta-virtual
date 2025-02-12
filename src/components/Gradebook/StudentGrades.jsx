import React, { useEffect, useState } from 'react';
import './Gradebook.css';
import { MdClose } from 'react-icons/md';
import { dateToString } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const StudentGrades = ({ handleClose, term, gradebook, classroomType }) => {
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [error, setError] = useState('');
  const [evaluations, setEvaluations] = useState([]);

  useEffect(() => {
    getEvaluation();
  }, []);

  const handleError = (message) => {
    setError(message);
    setTimeout(() => {
      setError('');
    }, 2000);
  }

  const getEvaluation = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/${classroomType === 'kindergarten' ? 'kindergarten' : 'gradebook'}/${gradebook._id}/term/${term._id}/evaluations`, {
        timeout: 10000
      });

      if (response.status === 200) {
        setEvaluations(response.data);
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

  const handleInputChange = (index, field, value) => {
    const updatedEvaluations = evaluations.map((evaluation, i) => {
      if (i === index) {
        // Atualizar o campo editado
        const updatedEvaluation = { ...evaluation, [field]: value };

        // Calcular bimonthlyGrade (média das três avaliações)
        const monthlyExam = parseFloat(updatedEvaluation.monthlyExam) || 0;
        const bimonthlyExam = parseFloat(updatedEvaluation.bimonthlyExam) || 0;
        const qualitativeAssessment = parseFloat(updatedEvaluation.qualitativeAssessment) || 0;
        const bimonthlyGrade = (monthlyExam + bimonthlyExam + qualitativeAssessment) / 3;

        let bimonthlyRecovery = parseFloat(updatedEvaluation.bimonthlyRecovery) || 0;
        let bimonthlyAverage;

        if (bimonthlyGrade < 7) {
          // Se bimonthlyGrade for menor que 7, calcula a média com bimonthlyRecovery
          bimonthlyAverage = (bimonthlyGrade + bimonthlyRecovery) / 2;
        } else {
          // Se bimonthlyGrade for maior ou igual a 7, o aluno não faz recuperação
          bimonthlyRecovery = 0; // Define recuperação como 0
          bimonthlyAverage = bimonthlyGrade; // Média igual à bimonthlyGrade
        }

        // Retornar o objeto atualizado com as médias recalculadas
        return {
          ...updatedEvaluation,
          bimonthlyGrade: parseFloat(bimonthlyGrade.toFixed(2)), // Arredondar para 2 casas decimais
          bimonthlyRecovery: parseFloat(bimonthlyRecovery.toFixed(2)), // Define recuperação ajustada
          bimonthlyAverage: parseFloat(bimonthlyAverage.toFixed(2)), // Arredondar para 2 casas decimais
        };
      }
      return evaluation;
    });

    setEvaluations(updatedEvaluations);
  }

  const isValidNumber = (value) => {
    // Verifica se o valor é numérico ou está vazio
    return !isNaN(value) && value !== '';
  }

  const onSave = () => {
    // Verifica se todas as avaliações têm valores válidos
    const allValid = evaluations.every((evaluation) => {
      return (
        isValidNumber(evaluation.monthlyExam) &&
        isValidNumber(evaluation.bimonthlyExam) &&
        isValidNumber(evaluation.qualitativeAssessment) &&
        isValidNumber(evaluation.bimonthlyGrade) &&
        isValidNumber(evaluation.bimonthlyRecovery) &&
        isValidNumber(evaluation.bimonthlyAverage) &&
        isValidNumber(evaluation.totalAbsences)
      );
    });

    if (!allValid) {
      handleError('Os campos das notas devem ser preenchidos com números');
    } else {
      handleSave();
    }
  }

  // Função para salvar alterações (simula o envio para o backend)
  const handleSave = async () => {
    setLoadingSave(true);
    try {
      const response = await axiosInstance.put(`/gradebook/${gradebook._id}/term/${term._id}/evaluations`, {
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
                          <th>Avaliação Mensal</th>
                          <th>Avaliação Bimestral</th>
                          <th>Avaliação Qualitativa</th>
                          <th>Nota Bimestral</th>
                          <th>Recuperação Bimestral</th>
                          <th>Média Bimestral</th>
                          <th>Total de faltas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {evaluations.map((evaluation, index) => (
                          <tr key={index}>
                            <td>{evaluation.student.name}</td>
                            <td>
                              <input
                                type="number"
                                value={evaluation.monthlyExam}
                                onChange={(e) =>
                                  handleInputChange(index, "monthlyExam", e.target.value)
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={evaluation.bimonthlyExam}
                                onChange={(e) =>
                                  handleInputChange(index, "bimonthlyExam", e.target.value)
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={evaluation.qualitativeAssessment}
                                onChange={(e) =>
                                  handleInputChange(index, "qualitativeAssessment", e.target.value)
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={evaluation.bimonthlyGrade}
                                onChange={(e) =>
                                  handleInputChange(index, "bimonthlyGrade", e.target.value)
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={evaluation.bimonthlyRecovery}
                                onChange={(e) =>
                                  handleInputChange(index, "bimonthlyRecovery", e.target.value)
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={evaluation.bimonthlyAverage}
                                onChange={(e) =>
                                  handleInputChange(index, "bimonthlyAverage", e.target.value)
                                }
                              />
                            </td>
                            <td>
                              <input
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
                      onClick={() => onSave()}
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

export default StudentGrades