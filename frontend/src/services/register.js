export default async function registerReq(formData) {
    try {
        const response = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        console.log(response.ok)
        return {
            ok: response.ok,
            body: await response.json()
        }

    } catch (error) {
        console.error("Lỗi kết nối:", error);
    }
}