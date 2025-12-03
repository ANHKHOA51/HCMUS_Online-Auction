export async function registerReq(formData) {
    try {
        const response = await fetch("http://localhost:3000/auths/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        return {
            ok: response.ok,
            body: await response.json()
        }

    } catch (error) {
        console.error("Lỗi kết nối:", error);
    }
}

export async function loginReq(formData) {
    try {
        const response = await fetch("http://localhost:3000/auths/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData),
            credentials: "include"
        });

        const data = await response.json();

        return {
            ok: response.ok,
            data: data,
            message: data.message
        }

    } catch (error) {
        console.error("Lỗi kết nối:", error);
        return {
            ok: false,
            message: "Lỗi kết nối đến server"
        }
    }
}

export async function refreshReq() {
    try {
        const response = await fetch("http://localhost:3000/auths/refresh", {
            method: "POST",
            credentials: "include"
        });

        const data = await response.json()
        return {
            ok: response.ok,
            data: data,
            message: data.message
        }

    } catch (error) {
        console.error("Lỗi kết nối:", error);
        return {
            ok: false,
            message: "Lỗi kết nối đến server"
        }
    }
}

export async function logoutReq() {
    try {
        const response = await fetch("http://localhost:3000/auths/logout", {
            method: "POST",
            credentials: "include"
        });

        const data = await response.json()
        return {
            ok: response.ok,
            data: data,
            message: data.message
        }

    } catch (error) {
        console.error("Lỗi kết nối:", error);
        return {
            ok: false,
            message: "Lỗi kết nối đến server"
        }
    }
}