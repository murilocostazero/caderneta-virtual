import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const AnnualRegistration = ({ handleCloseAnnualRegistration, learningRecords, gradebookId, reloadRecords, loading }) => {

    // Normalizar records ao iniciar
    const normalize = (records) =>
        records.map(r => ({
            ...r,
            finalRecovery: r.finalRecovery ?? "",
            finalAverage: r.finalAverage ?? r.annualAverage
        }));

    const [records, setRecords] = useState(normalize(learningRecords));

    // Atualiza o estado local enquanto digita (não chama API)
    const handleLocalChange = (studentId, value) => {
        const updated = records.map(r =>
            r.student._id === studentId
                ? { ...r, finalRecovery: value }
                : r
        );
        setRecords(updated);
    };

    // Salva no back quando o input perder o foco
    const handleSaveFinalRecovery = async (studentId, value) => {
        console.log('CHAMOU')
        if (value === "" || value === null) return; // se for vazio, não salva

        try {
            const response = await axiosInstance.put(`/gradebook/${gradebookId}/final-recovery/${studentId}`,
                { finalRecovery: Number(value) }, {
                timeout: 20000
            });

            const updated = records.map(r =>
                r.student._id === studentId
                    ? {
                        ...r,
                        finalRecovery: response.data.finalRecovery,
                        finalAverage: response.data.finalAverage
                    }
                    : r
            );

            setRecords(updated);

        } catch (error) {
            console.error("Erro ao salvar recuperação final:", error);
        }
    }

    const handleKeyDown = (e, studentId, value) => {
        if (e.key === "Enter") {
            e.preventDefault(); // impede submit padrão
            handleSaveFinalRecovery(studentId, value);
            e.target.blur(); // opcional: remove o foco
        }
    }

    return (
        <div className='modal-overlay'>
            <div className='student-grades-modal'>
                <div className='align-right'>
                    <button className="close-button" onClick={handleCloseAnnualRegistration}>
                        <MdClose className='close-icon' />
                    </button>
                </div>

                <h3>Registro Geral</h3>

                <div className="registration-container">
                    {
                        loading ?
                            <LoadingSpinner /> :
                            <table className="registro-geral">
                                <thead>
                                    <tr>
                                        <th>Aluno</th>
                                        <th>1º Bimestre</th>
                                        <th>2º Bimestre</th>
                                        <th>3º Bimestre</th>
                                        <th>4º Bimestre</th>
                                        <th>Média Anual</th>
                                        <th>Rec. Final</th>
                                        <th>Média Final</th>
                                        <th>Total de Faltas</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {records.map((record, index) => (
                                        <tr key={record.student._id} className={index % 2 === 0 ? "linha-par" : "linha-impar"}>
                                            <td>{record.student.name}</td>

                                            {record.bimonthlyAverages.map((term, i) => (
                                                <td key={i} className="text-center">
                                                    {term.average.toFixed(2)}
                                                </td>
                                            ))}

                                            {Array(4 - record.bimonthlyAverages.length).map((_, i) => (
                                                <td key={`empty-${i}`} className="text-center">-</td>
                                            ))}

                                            <td className="text-center">{record.annualAverage.toFixed(2)}</td>

                                            <td className="text-center">
                                                <input
                                                    disabled={record.annualAverage.toFixed(2) < 7 ? false : true}
                                                    type="number"
                                                    min="0"
                                                    max="10"
                                                    step="0.1"
                                                    value={record.finalRecovery}
                                                    onChange={e =>
                                                        handleLocalChange(record.student._id, e.target.value)
                                                    }
                                                    onBlur={e =>
                                                        handleSaveFinalRecovery(record.student._id, e.target.value)
                                                    }
                                                    onKeyDown={(e) =>
                                                        handleKeyDown(e, record.student._id, record.finalRecovery)
                                                    }
                                                    className="input-recuperacao"
                                                />
                                            </td>

                                            <td className="text-center">
                                                {Number(record.finalAverage).toFixed(2)}
                                            </td>

                                            <td className="text-center">{record.totalAbsences}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                    }
                </div>
            </div>
        </div>
    );
};

export default AnnualRegistration;