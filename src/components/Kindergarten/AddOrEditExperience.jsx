import React, { useState } from 'react'
import { MdAdd, MdClose } from 'react-icons/md';
import '../Gradebook/Gradebook.css';
import './Kindergarten.css';

const AddOrEditExperience = ({ handleClose, handleOnSave, selectedCriteria }) => {
    const [name, setName] = useState(selectedCriteria ? selectedCriteria.name : '');
    const [description, setDescription] = useState(selectedCriteria ? selectedCriteria.description : '');
    const [bnccCode, setBnccCode] = useState('');
    const [codeDescription, setCodeDescription] = useState('');
    const [bnccCodes, setBnccCodes] = useState(selectedCriteria ? selectedCriteria.bnccCodes : []);
    const [evaluationCriteria, setEvaluationCriteria] = useState('');
    const [criteriaDescription, setCriteriaDescription] = useState('');
    const [criterias, setCriterias] = useState(selectedCriteria ? selectedCriteria.evaluationCriteria : [
        {
            code: 'not-yet',
            label: 'Ainda não desenvolvido',
            description: 'A criança ainda não demonstra a habilidade ou comportamento esperado. Necessita de mais oportunidades e mediação para avançar nesse aspecto.'
        },
        {
            code: 'under-development',
            label: 'Em desenvolvimento',
            description: 'A criança já apresenta indícios da habilidade ou comportamento esperado, mas ainda precisa de apoio e mais vivências para consolidá-lo.'
        },
        {
            code: 'developed',
            label: 'Desenvolvido',
            description: 'A criança demonstra a habilidade ou comportamento de forma consistente e autônoma no seu cotidiano.'
        }
    ]);
    const [showAddBnccCode, setShowAddBnccCode] = useState(false);
    const [showAddExperience, setShowAddExperience] = useState(false);
    const [error, setError] = useState('');

    const handleError = (message) => {
        setError(message);
        setTimeout(() => {
            setError('');
        }, 2000);
    }

    const clearFields = () => {
        setName('');
        setDescription('');
        setBnccCode('');
        setCodeDescription('');
        setEvaluationCriteria('');
        setCriteriaDescription('');
    }

    // Função para remover um item do array pelo código
    function handleRemoveCode(code) {
        let localCodes = bnccCodes;
        const index = localCodes.findIndex(item => item.code === code);
        if (index !== -1) {
            localCodes.splice(index, 1);
        }
        setBnccCodes(localCodes);
    }

    const onAddBnccCode = () => {
        if (!bnccCode || !codeDescription) {
            handleError('Preencha todos os campos');
        } else {
            handleAddCode({ code: bnccCode, description: codeDescription });
        }
    }

    // Função para adicionar um novo objeto ao array
    function handleAddCode(code) {
        setBnccCodes(prevCodes => [...(prevCodes || []), code]);
        handleCloseBnccCode();
    }

    const handleCloseBnccCode = () => {
        setShowAddBnccCode(false);
        setBnccCode('');
        setCodeDescription('');
    }

    const handleCloseExperience = () => {
        setShowAddExperience(false);
        setEvaluationCriteria('');
        setCriteriaDescription('');
    }

    function handleRemoveCriteria(code) {
        let localCodes = criterias;
        const index = localCodes.findIndex(item => item.label === code);
        if (index !== -1) {
            localCodes.splice(index, 1);
        }
        setCriterias(localCodes);
    }

    const onAddCriteria = () => {
        if (!evaluationCriteria || !criteriaDescription) {
            handleError('Preencha todos os campos');
        } else {
            handleAddCriteria({ label: evaluationCriteria, description: criteriaDescription });
        }
    }

    function handleAddCriteria(code) {
        setCriterias(prevCodes => [...(prevCodes || []), code]);
        handleCloseExperience();
    }

    const onSaveExperience = () => {
        if (!name || !description || bnccCodes.length < 1 || criterias.length < 1) {
            handleError('Preencha todos os campos');
        } else {
            handleOnSave({
                name: name,
                description: description,
                bnccCodes: bnccCodes,
                evaluationCriteria: criterias
            });
            clearFields();
            handleClose();
        }
    }

    return (
        <div className='modal-overlay'>
            <div className='modal'>
                <div className='align-right'>
                    <button className="close-button" onClick={() => {
                        clearFields();
                        handleClose();
                    }}>
                        <MdClose className='close-icon' />
                    </button>
                </div>

                <h3>Novo Campo de experiência</h3>
                <div className='gradebook-form'>
                    <label>Nome do campo</label>
                    <input
                        type="text"
                        name="name"
                        placeholder='Ex.: Escuta, fala, pensamento e imaginação'
                        value={name}
                        onChange={(e) => setName(e.target.value)} />

                    <label>Descrição</label>
                    <input
                        type="text"
                        name="description"
                        placeholder='Ex.: Descrição opcional do campo'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} />

                    <div className='add-new-container'>
                        <div className='bncc-row-container'>
                            <label>Códigos BNCC</label>
                            {
                                !showAddBnccCode ?
                                    <MdAdd color='#0166ff' size={24} onClick={() => setShowAddBnccCode(true)} /> :
                                    <MdClose color='#e41313' size={24} onClick={() => handleCloseBnccCode()} />
                            }
                        </div>
                        {
                            showAddBnccCode ?
                                <div className='column-container'>
                                    <input
                                        type="text"
                                        name="bnccCode"
                                        placeholder='Ex.: EI02EF02'
                                        value={bnccCode}
                                        onChange={(e) => setBnccCode(e.target.value)} />
                                    <input
                                        type="text"
                                        name="codeDescription"
                                        placeholder='Descrição do código'
                                        value={codeDescription}
                                        onChange={(e) => setCodeDescription(e.target.value)} />
                                    <button className='primary-button' onClick={() => onAddBnccCode()}>Adicionar</button>
                                </div> :
                                bnccCodes.length > 0 ?
                                    bnccCodes.map((code) => (
                                        <div className='row-list-item' key={code.code}>
                                            <div className='list-item'>
                                                <label>{code.code}</label>
                                                <label>{code.description}</label>
                                            </div>
                                            <span onClick={() => handleRemoveCode(code.code)}>REMOVER</span>
                                        </div>
                                    ))
                                    :
                                    <p className='info-label'>Clique no + para adicionar os códigos deste critério</p>
                        }

                    </div>

                    <div className='add-new-container'>
                        <label>Critérios de avaliação</label>
                        {
                            criterias.map((criteria) => (
                                <div className='row-list-item'>
                                    <div className='list-item'>
                                        <label>{criteria.label}</label>
                                        <label>{criteria.description}</label>
                                    </div>
                                </div>
                            ))}
                    </div>

                </div>
                <div className='save-experience-container'>
                    {
                        error ?
                            <p className='error-message'>{error}</p> :
                            <button className='primary-button' onClick={() => onSaveExperience()}>Salvar Experiência</button>
                    }
                </div>
            </div>
        </div >

    )
}

export default AddOrEditExperience