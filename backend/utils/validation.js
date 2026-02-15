// Validation utility functions

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validatePhone = (phone) => {
    // Basic phone validation (10-15 digits)
    const re = /^\d{10,15}$/;
    return re.test(phone.replace(/[\s\-\(\)]/g, ''));
};

const validatePassword = (password) => {
    // At least 6 characters
    return password && password.length >= 6;
};

const validatePrice = (price) => {
    return !isNaN(price) && price >= 0;
};

const validateQuantity = (quantity) => {
    return Number.isInteger(quantity) && quantity >= 0;
};

module.exports = {
    validateEmail,
    validatePhone,
    validatePassword,
    validatePrice,
    validateQuantity
};
