document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const errorMsg = document.getElementById("errorMsg");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        errorMsg.textContent = ""; // сброс ошибки

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                // Переход на страницу согласно redirectUrl, который вернул сервер
                window.location.href = data.redirectUrl;
            } else {
                const error = await response.json();
                errorMsg.textContent = error.message || "Ошибка логина";
            }
        } catch (err) {
            errorMsg.textContent = "Ошибка соединения с сервером";
            console.error(err);
        }
    });
});