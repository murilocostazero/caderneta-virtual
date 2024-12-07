import React, { useEffect, useState } from 'react';
import './Gradebook.css';
import { MdClose } from 'react-icons/md';
import { dateToString } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';

const StudentGrades = ({ handleClose, term, gradebook }) => {
  const [loading, setLoading] = useState(false);
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
      const response = await axiosInstance.get(`/gradebook/${gradebook._id}/term/${term._id}/evaluations`, {
        timeout: 10000
      });

      if (response.status === 200) {
        setEvaluations(response.data);
        console.log('---EV', response.data)
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
                <h4>Carregando notas</h4> :
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
                            <td>{evaluation.student}</td>
                            <td>{evaluation.monthlyExam}</td>
                            <td>{evaluation.bimonthlyExam}</td>
                            <td>{evaluation.qualitativeAssessment}</td>
                            <td>{evaluation.bimonthlyGrade}</td>
                            <td>{evaluation.bimonthlyRecovery}</td>
                            <td>{evaluation.bimonthlyAverage}</td>
                            <td>{evaluation.totalAbsences}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
            }
          </div>
        </div>

        {
          error && <p className='error-container'>{error}</p>
        }
      </div>
    </div>
  )
}

export default StudentGrades