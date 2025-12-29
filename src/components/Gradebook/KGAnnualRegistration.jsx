import React, { useEffect, useState, useMemo } from 'react';
import './Gradebook.css';
import { MdClose } from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance';
import { experienceFieldToPT } from '../../utils/helper';

const KGAnnualRegistration = ({ handleCloseAnnualRegistration, gradebook, learningRecords }) => {
    const [experienceFields, setExperienceFields] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        getExperienceFields();
    }, []);

    const handleError = (message) => {
        setError(message);
        setTimeout(() => setError(''), 2000);
    };

    const getExperienceFields = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(
                `/experience-field/school/${gradebook.school._id}`,
                { timeout: 20000 }
            );

            if (response.status === 200) {
                setExperienceFields(response.data);
            } else {
                handleError('Erro ao buscar campos');
            }
        } catch (error) {
            console.log(error);
            if (error.code === 'ERR_NETWORK') {
                handleError('Verifique sua conexão com a internet');
            } else {
                handleError('Um erro inesperado aconteceu. Tente novamente.');
            }
        }
        setLoading(false);
    };

    // 🔹 Lista de bimestres a partir do primeiro aluno
    const terms = useMemo(() => {
        if (!learningRecords || learningRecords.length === 0) return [];
        return learningRecords[0].terms.map(t => t.term);
    }, [learningRecords]);

    // 🔹 Busca a avaliação pelo bimestre + campo
    const getEvaluation = (record, termName, fieldName) => {
        const term = record.terms.find(t => t.term === termName);
        if (!term) return null;

        const field = term.fields.find(f => f.fieldName === fieldName);
        return field ? field.evaluationCriteria : null;
    };

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
                    <table className="registro-geral">
                        <thead>
                            {/* 🔹 Linha 1 – Aluno + Bimestres */}
                            <tr>
                                <th rowSpan={2}>Aluno</th>

                                {terms.map(term => (
                                    <th
                                        key={term}
                                        colSpan={experienceFields.length || 1}
                                        className="text-center"
                                    >
                                        {term}
                                    </th>
                                ))}

                                <th rowSpan={2}>Total de Faltas</th>
                            </tr>

                            {/* 🔹 Linha 2 – Campos de Experiência */}
                            <tr>
                                {terms.map(term =>
                                    experienceFields.length < 1
                                        ? <th key={`${term}-empty`}>—</th>
                                        : experienceFields.map(field => (
                                            <th key={`${term}-${field._id}`}>
                                                {field.name}
                                            </th>
                                        ))
                                )}
                            </tr>
                        </thead>

                        <tbody>
                            {learningRecords.map((record, index) => (
                                <tr
                                    key={record.student._id}
                                    className={index % 2 === 0 ? 'linha-par' : 'linha-impar'}
                                >
                                    <td>{record.student.name}</td>

                                    {terms.map(term =>
                                        experienceFields.map(field => (
                                            <td
                                                key={`${record.student._id}-${term}-${field._id}`}
                                                className="text-center"
                                            >
                                                {experienceFieldToPT(
                                                    getEvaluation(record, term, field.name)
                                                )}
                                            </td>
                                        ))
                                    )}

                                    <td className="text-center">
                                        {record.totalAbsences}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {error && <p className='error-container'>{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default KGAnnualRegistration;