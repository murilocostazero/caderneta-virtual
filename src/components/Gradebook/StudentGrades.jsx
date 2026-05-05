import React, { useEffect, useState, useRef } from 'react';
import './Gradebook.css';
import { MdClose } from 'react-icons/md';
import { dateToString } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const StudentGrades = ({ handleClose, term, gradebook, classroomType }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [evaluations, setEvaluations] = useState([]);
  const [savingStudents, setSavingStudents] = useState({});
  const [saveErrors, setSaveErrors] = useState({});
  const [successStudents, setSuccessStudents] = useState({});

  // Referências para os timeouts de feedback visual
  const feedbackTimeouts = useRef({});

  // Referências para os timeouts de debounce
  const saveTimeouts = useRef({});

  useEffect(() => {
    getEvaluation();
  }, []);

  const handleError = (message) => {
    setError(message);
    setTimeout(() => {
      setError('');
    }, 3000);
  }

  const showSuccessFeedback = (studentId) => {
    setSuccessStudents(prev => ({ ...prev, [studentId]: true }));
    setSaveErrors(prev => ({ ...prev, [studentId]: null }));

    // Limpa timeout anterior
    if (feedbackTimeouts.current[studentId]) {
      clearTimeout(feedbackTimeouts.current[studentId]);
    }

    // Remove o destaque verde após 2 segundos
    feedbackTimeouts.current[studentId] = setTimeout(() => {
      setSuccessStudents(prev => ({ ...prev, [studentId]: false }));
    }, 2000);
  };

  const showErrorFeedback = (studentId, message) => {
    setSaveErrors(prev => ({ ...prev, [studentId]: message }));
    setSuccessStudents(prev => ({ ...prev, [studentId]: false }));

    // Limpa timeout anterior
    if (feedbackTimeouts.current[studentId]) {
      clearTimeout(feedbackTimeouts.current[studentId]);
    }

    // Remove o destaque vermelho após 3 segundos
    feedbackTimeouts.current[studentId] = setTimeout(() => {
      setSaveErrors(prev => ({ ...prev, [studentId]: null }));
    }, 3000);
  };

  const getEvaluation = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/gradebook/${gradebook._id}/term/${term._id}/evaluations`, {
        timeout: 20000
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

  // Função para salvar um aluno individualmente
  const handleSaveStudentGrade = async (studentId, studentIndex, updatedData) => {
    // Mostrar loading apenas para este aluno
    setSavingStudents(prev => ({ ...prev, [studentId]: true }));

    try {
      const response = await axiosInstance.put(
        `/gradebook/${gradebook._id}/term/${term._id}/student/${studentId}`,
        updatedData,
        { timeout: 30000 }
      );

      if (response.status === 200) {
        // Sucesso - atualiza o estado com os dados retornados do backend
        if (response.data.studentEvaluation) {
          setEvaluations(prev => {
            const updated = [...prev];
            updated[studentIndex] = {
              ...updated[studentIndex],
              monthlyExam: response.data.studentEvaluation.monthlyExam,
              bimonthlyExam: response.data.studentEvaluation.bimonthlyExam,
              qualitativeAssessment: response.data.studentEvaluation.qualitativeAssessment,
              bimonthlyGrade: response.data.studentEvaluation.bimonthlyGrade,
              bimonthlyRecovery: response.data.studentEvaluation.bimonthlyRecovery,
              bimonthlyAverage: response.data.studentEvaluation.bimonthlyAverage,
              totalAbsences: response.data.studentEvaluation.totalAbsences
            };
            return updated;
          });
        }

        // Mostra feedback visual na linha (verde)
        showSuccessFeedback(studentId);
        return true;
      }
    } catch (error) {
      console.error(`Erro ao salvar aluno ${studentId}:`, error);

      // Guardar erro para exibir na interface
      let errorMessage = 'Erro ao salvar';
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Conexão lenta';
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Sem conexão';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      // Mostra feedback visual na linha (vermelho)
      showErrorFeedback(studentId, errorMessage);

      // Tentar novamente uma vez após 3 segundos
      setTimeout(async () => {
        try {
          const retryResponse = await axiosInstance.put(
            `/gradebook/${gradebook._id}/term/${term._id}/student/${studentId}`,
            updatedData,
            { timeout: 30000 }
          );
          if (retryResponse.status === 200) {
            // Sucesso na segunda tentativa
            if (retryResponse.data.studentEvaluation) {
              setEvaluations(prev => {
                const updated = [...prev];
                updated[studentIndex] = {
                  ...updated[studentIndex],
                  monthlyExam: retryResponse.data.studentEvaluation.monthlyExam,
                  bimonthlyExam: retryResponse.data.studentEvaluation.bimonthlyExam,
                  qualitativeAssessment: retryResponse.data.studentEvaluation.qualitativeAssessment,
                  bimonthlyGrade: retryResponse.data.studentEvaluation.bimonthlyGrade,
                  bimonthlyRecovery: retryResponse.data.studentEvaluation.bimonthlyRecovery,
                  bimonthlyAverage: retryResponse.data.studentEvaluation.bimonthlyAverage,
                  totalAbsences: retryResponse.data.studentEvaluation.totalAbsences
                };
                return updated;
              });
            }
            showSuccessFeedback(studentId);
          }
        } catch (retryError) {
          console.error('Segunda tentativa também falhou:', retryError);
        }
      }, 3000);

      return false;
    } finally {
      setSavingStudents(prev => ({ ...prev, [studentId]: false }));
    }
  };

  // Função para calcular os valores derivados
  const calculateDerivedValues = (evaluation) => {
    const monthlyExam = parseFloat(evaluation.monthlyExam) || 0;
    const bimonthlyExam = parseFloat(evaluation.bimonthlyExam) || 0;
    const qualitativeAssessment = parseFloat(evaluation.qualitativeAssessment) || 0;
    const bimonthlyGrade = (monthlyExam + bimonthlyExam + qualitativeAssessment) / 3;

    let bimonthlyRecovery = parseFloat(evaluation.bimonthlyRecovery) || 0;
    let bimonthlyAverage;

    if (bimonthlyGrade < 7) {
      bimonthlyAverage = (bimonthlyGrade + bimonthlyRecovery) / 2;
    } else {
      bimonthlyRecovery = 0;
      bimonthlyAverage = bimonthlyGrade;
    }

    return {
      bimonthlyGrade: parseFloat(bimonthlyGrade.toFixed(2)),
      bimonthlyRecovery: parseFloat(bimonthlyRecovery.toFixed(2)),
      bimonthlyAverage: parseFloat(bimonthlyAverage.toFixed(2))
    };
  };

  const handleInputChange = (index, field, value) => {
    // Primeiro, atualiza o estado local otimistamente
    const updatedEvaluations = evaluations.map((evaluation, i) => {
      if (i === index) {
        const updatedEvaluation = { ...evaluation, [field]: value === '' ? 0 : parseFloat(value) || 0 };

        // Recalcula os valores derivados
        const derived = calculateDerivedValues(updatedEvaluation);

        return {
          ...updatedEvaluation,
          ...derived
        };
      }
      return evaluation;
    });

    setEvaluations(updatedEvaluations);

    // Prepara os dados para salvar
    const studentData = updatedEvaluations[index];
    const dataToSave = {
      monthlyExam: studentData.monthlyExam || 0,
      bimonthlyExam: studentData.bimonthlyExam || 0,
      qualitativeAssessment: studentData.qualitativeAssessment || 0,
      bimonthlyGrade: studentData.bimonthlyGrade || 0,
      bimonthlyRecovery: studentData.bimonthlyRecovery || 0,
      bimonthlyAverage: studentData.bimonthlyAverage || 0,
      totalAbsences: studentData.totalAbsences || 0
    };

    // Debounce: limpa o timeout anterior para este aluno
    if (saveTimeouts.current[studentData.student._id]) {
      clearTimeout(saveTimeouts.current[studentData.student._id]);
    }

    // Seta um novo timeout para salvar após 1.5 segundos sem digitação
    saveTimeouts.current[studentData.student._id] = setTimeout(() => {
      handleSaveStudentGrade(studentData.student._id, index, dataToSave);
    }, 1500);
  };

  // Função para determinar a classe da linha baseada no estado
  const getRowClassName = (studentId) => {
    if (successStudents[studentId]) return 'row-success';
    if (saveErrors[studentId]) return 'row-error';
    if (savingStudents[studentId]) return 'row-saving';
    return '';
  };

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

            {loading ? (
              <LoadingSpinner />
            ) : !evaluations || evaluations.length === 0 ? (
              <p>Nenhum aluno encontrado</p>
            ) : (
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
                      <tr
                        key={evaluation.student._id}
                        className={getRowClassName(evaluation.student._id)}
                      >
                        <td>{evaluation.student.name}</td>
                        <td>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            value={evaluation.monthlyExam || ''}
                            onChange={(e) =>
                              handleInputChange(index, "monthlyExam", e.target.value)
                            }
                            disabled={savingStudents[evaluation.student._id]}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            value={evaluation.bimonthlyExam || ''}
                            onChange={(e) =>
                              handleInputChange(index, "bimonthlyExam", e.target.value)
                            }
                            disabled={savingStudents[evaluation.student._id]}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            value={evaluation.qualitativeAssessment || ''}
                            onChange={(e) =>
                              handleInputChange(index, "qualitativeAssessment", e.target.value)
                            }
                            disabled={savingStudents[evaluation.student._id]}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            value={evaluation.bimonthlyGrade || ''}
                            disabled={true}
                            className="readonly-input"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            value={evaluation.bimonthlyRecovery || ''}
                            onChange={(e) =>
                              handleInputChange(index, "bimonthlyRecovery", e.target.value)
                            }
                            disabled={savingStudents[evaluation.student._id] || (evaluation.bimonthlyGrade >= 7)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            value={evaluation.bimonthlyAverage || ''}
                            disabled={true}
                            className="readonly-input"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={evaluation.totalAbsences || 0}
                            disabled={true}
                            className="readonly-input"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className='evaluations-button'>
              {error && (
                <p className={error.includes('sucesso') ? 'success-message' : 'error-message'}>
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .readonly-input {
          background-color: #f5f5f5;
          text-align: center;
        }
        
        /* Linha em estado de salvamento (amarelo claro) */
        .row-saving {
          background-color: #fff3cd !important;
          transition: background-color 0.3s ease;
        }
        
        /* Linha em caso de sucesso (verde claro) */
        .row-success {
          background-color: #d4edda !important;
          transition: background-color 0.3s ease;
        }
        
        /* Linha em caso de erro (vermelho claro) */
        .row-error {
          background-color: #f8d7da !important;
          transition: background-color 0.3s ease;
        }
        
        /* Garantir que os inputs dentro das linhas coloridas fiquem legíveis */
        .row-success input, 
        .row-error input, 
        .row-saving input {
          background-color: inherit;
        }
        
        .success-message {
          color: #155724;
          background-color: #d4edda;
          padding: 10px;
          border-radius: 4px;
        }
        
        .error-message {
          color: #721c24;
          background-color: #f8d7da;
          padding: 10px;
          border-radius: 4px;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}

export default StudentGrades;