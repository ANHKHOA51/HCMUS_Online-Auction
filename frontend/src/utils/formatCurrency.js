export const formatPriceVN = (value, { locale = 'vi-VN', currency = 'VND' } = {}) => {
    if (value == null || Number.isNaN(Number(value))) return '---';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        maximumFractionDigits: 0
    }).format(Number(value));
};
