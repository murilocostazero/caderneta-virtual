import React from 'react';
import './Gradebook.css';
import { MdClose } from 'react-icons/md';

const AnnualRegistration = ({ handleCloseAnnualRegistration, learningRecords }) => {
    return (
        <div className='modal-overlay'>
            <div className='student-grades-modal'>
                <div className='align-right'>
                    <button className="close-button" onClick={() => handleCloseAnnualRegistration()}>
                        <MdClose className='close-icon' />
                    </button>
                </div>
                <h3>Registro Geral</h3>

                <div className="registration-container">
                    <table className="registro-geral">
                        <thead>
                            <tr>
                                <th>Aluno</th>
                                {/* <th>CPF</th> */}
                                <th>1º Bimestre</th>
                                <th>2º Bimestre</th>
                                <th>3º Bimestre</th>
                                <th>4º Bimestre</th>
                                <th>Média Anual</th>
                                <th>Total de Faltas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {learningRecords.map((record, index) => (
                                <tr key={record.student._id} className={index % 2 === 0 ? "linha-par" : "linha-impar"}>
                                    <td>{record.student.name}</td>
                                    {/* <td>{record.student.cpf}</td> */}
                                    {record.bimonthlyAverages.map((term, termIndex) => (
                                        <td key={termIndex} className="text-center">
                                            {term.average.toFixed(2)}
                                        </td>
                                    ))}
                                    {Array(4 - record.bimonthlyAverages.length).fill(null).map((_, i) => (
                                        <td key={`empty-${i}`} className="text-center">-</td>
                                    ))}
                                    <td className="text-center">{parseFloat(record.annualAverage).toFixed(2)}</td>
                                    <td className="text-center">{record.totalAbsences}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    )
}

export default AnnualRegistration