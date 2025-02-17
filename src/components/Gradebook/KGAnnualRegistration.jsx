import React, { useEffect, useState } from 'react';
import './Gradebook.css';
import { MdClose } from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance';
import { experienceFieldToPT } from '../../utils/helper';

const KGAnnualRegistration = ({ handleCloseAnnualRegistration, learningRecords, gradebook }) => {
    const [experienceFields, setExperienceFields] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        console.log('-------XXX', learningRecords)
        getExperienceFields();
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
                                <th>CPF</th>
                                {
                                    !experienceFields || experienceFields.length < 1 ?
                                        <th>Nenhum campo de experiência</th> :
                                        experienceFields.map((experience) =>
                                            <th key={experience._id}>
                                                {experience.name}
                                            </th>
                                        )
                                }
                                <th>Total de Faltas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {learningRecords.map((record, index) => (
                                <tr key={record.student._id} className={index % 2 === 0 ? "linha-par" : "linha-impar"}>
                                    <td>{record.student.name}</td>
                                    <td>{record.student.cpf}</td>
                                    {
                                        experienceFields.map((experience) => (
                                            <td key={experience._id}>
                                                {experienceFieldToPT(record.evaluations[experience.name])}
                                            </td>
                                        ))
                                    }
                                    <td className="text-center">{record.totalAbsences}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {
                        error ?
                            <p className='error-container'>{error}</p> :
                            <div />
                    }

                </div>
            </div>
        </div>
    )
}

export default KGAnnualRegistration;