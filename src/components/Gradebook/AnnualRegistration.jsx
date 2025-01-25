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

                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 px-4 py-2">Aluno</th>
                                <th className="border border-gray-300 px-4 py-2">CPF</th>
                                <th className="border border-gray-300 px-4 py-2">1º Bimestre</th>
                                <th className="border border-gray-300 px-4 py-2">2º Bimestre</th>
                                <th className="border border-gray-300 px-4 py-2">3º Bimestre</th>
                                <th className="border border-gray-300 px-4 py-2">4º Bimestre</th>
                                <th className="border border-gray-300 px-4 py-2">Média Anual</th>
                                <th className="border border-gray-300 px-4 py-2">Total de Faltas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {learningRecords.map((record, index) => (
                                <tr
                                    key={record.student._id}
                                    className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                                >
                                    <td className="border border-gray-300 px-4 py-2">
                                        {record.student.name}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {record.student.cpf}
                                    </td>
                                    {record.bimonthlyAverages.map((term, termIndex) => (
                                        <td
                                            key={termIndex}
                                            className="border border-gray-300 px-4 py-2 text-center"
                                        >
                                            {term.average.toFixed(2)}
                                        </td>
                                    ))}
                                    {/* Caso algum bimestre esteja faltando */}
                                    {Array(4 - record.bimonthlyAverages.length)
                                        .fill(null)
                                        .map((_, i) => (
                                            <td
                                                key={`empty-${i}`}
                                                className="border border-gray-300 px-4 py-2 text-center"
                                            >
                                                -
                                            </td>
                                        ))}
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {parseFloat(record.annualAverage).toFixed(2)}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {record.totalAbsences}
                                    </td>
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