export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function stringToDate(dateString) {
    const [day, month, year] = dateString.split('/');
    return new Date(year, month - 1, day);
}

export function dateToString(date) {
    const validDate = date instanceof Date ? date : new Date(date);

    const day = String(validDate.getDate()).padStart(2, '0');
    const month = String(validDate.getMonth() + 1).padStart(2, '0'); // getMonth() é zero-indexado
    const year = validDate.getFullYear();
    return `${day}/${month}/${year}`;
}

export function normalizeString(input) {
    return input
        .toLowerCase() // Transforma em letras minúsculas
        .normalize("NFD") // Decompõe caracteres com acentos
        .replace(/[\u0300-\u036f]/g, ""); // Remove marcas de acentos
}

export function getCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0'); // Adiciona o zero à esquerda, se necessário
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Os meses são indexados a partir de 0
    const year = today.getFullYear();

    return `${day}/${month}/${year}`;
}

export function classroomTypeToPT(classroomType) {
    switch (classroomType) {
        case 'kindergarten':
            return 'Maternal';
        case 'elementary':
            return 'Ensino Fundamental';
        case 'high':
            return 'Ensino Médio';
    }
}

export function getFirstAndSecondName(fullName) {
    const nameParts = fullName.trim().split(/\s+/); // Divide por espaços múltiplos e remove espaços extras
    const firstName = nameParts[0] || ""; // Primeiro nome
    const secondName = nameParts[1] || ""; // Segundo nome (se existir)

    return `${firstName} ${secondName}`;
}

export function experienceFieldToPT(ef) {
    switch (ef) {
        case 'developed':
            return 'Desenvolvido';
        case 'under-development':
            return 'Em desenvolvimento';
        default:
            return 'Ainda não desenvolvido';
    }
}