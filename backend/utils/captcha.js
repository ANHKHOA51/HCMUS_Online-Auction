const captcha_url = process.env.CAPTCHA_API;
const captcha_secret_key = process.env.CAPTCHA_SECRET_KEY

export async function checkCaptcha(captcha) {
    const params = new URLSearchParams();
    params.append("secret", captcha_secret_key);
    params.append("response", captcha);

    try {
        const res = await fetch(captcha_url, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params.toString(),
        });

        const json = await res.json();
        return json.success ? undefined : json["error-codes"];
    } catch (err) {
        console.error("captcha error:", err);
        return ["captcha_error"];
    }
}


