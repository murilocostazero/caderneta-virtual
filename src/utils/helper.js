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