export const fetchClient = async (url, options = {}) => {
    // 1. Mặc định headers và credentials
    const defaultOptions = {
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // CỰC KỲ QUAN TRỌNG: Để gửi/nhận cookie
    };

    // 2. Merge options
    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, finalOptions);

        // 3. Fetch không tự throw error khi status là 400/500, ta phải tự làm
        if (!response.ok) {
            // Cố gắng đọc message lỗi từ server trả về
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData || `HTTP error! status: ${response.status}`);
        }

        // 4. Trả về data json
        return await response.json();
    } catch (error) {
        throw error; // Ném lỗi ra để component xử lý
    }
};