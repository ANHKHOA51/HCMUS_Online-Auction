export async function registerReq(formData) {
    try {
        const response = await fetch("http://localhost:3000/register", {
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
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        return {
            ok: response.ok,
            body: response.message
        }

    } catch (error) {
        console.error("Lỗi kết nối:", error);
    }
}