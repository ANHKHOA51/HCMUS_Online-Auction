export const formatDateVN = (time) => {
    const date = new Date(time);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`
}

export const displayDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('vi-VN');
}

export const getImageSrc = (imgName, prodId) => {
    if (!imgName) return '/default-product.png';
    if (imgName.startsWith('http')) return imgName;
    return `http://localhost:3000/static/images/products/${prodId}/${imgName}`;
};