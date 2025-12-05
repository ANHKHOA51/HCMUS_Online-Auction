export const formatPriceVN = (value, { locale = 'vi-VN', currency = 'VND' } = {}) => {
    if (value === '' || value == null || Number.isNaN(Number(value))) return value;
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        maximumFractionDigits: 0
    }).format(Number(value));
};

export const formatPrice = (value, { locale = 'vi-VN', currency = 'VND' } = {}) => {
    if (value === '' || value == null || Number.isNaN(Number(value))) return value;
    
    return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        maximumFractionDigits: 0
    }).format(Number(value));
};

export const parsePriceVN = (value) => {
    if (value === '' || value == null) return value;
    return Number(value.replace(/[^0-9-]/g, ''));
}