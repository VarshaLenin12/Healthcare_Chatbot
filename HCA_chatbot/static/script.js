document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById("chat-box");
    const chatForm = document.getElementById("chat-form");
    const userInput = document.getElementById("user-input");
    const darkModeToggle = document.getElementById("dark-mode-toggle");

    // Dark mode toggle
    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        darkModeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
    });

    // Chat functionality
    chatForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const query = userInput.value.trim();
        if (!query) return;

        // Display user message
        addMessage(query, "user");

        // Clear input
        userInput.value = "";

        // Add typing indicator
        const typingIndicator = addMessage("typing", "bot", true);

        // Get bot response
        const response = await getBotResponse(query);

        // Replace typing indicator with bot response
        typingIndicator.querySelector(".text").textContent = response;
        typingIndicator.classList.remove("typing");
        const dots = typingIndicator.querySelector(".dots");
        if (dots) dots.remove();
    });

    function addMessage(text, sender, isTyping = false) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add(`${sender}-message`);

        const textDiv = document.createElement("div");
        textDiv.classList.add("text");

        if (isTyping) {
            textDiv.classList.add("typing");
            const dots = document.createElement("div");
            dots.classList.add("dots");
            dots.innerHTML = "<span></span><span></span><span></span>";
            textDiv.appendChild(dots);
        } else {
            textDiv.textContent = text;
        }

        messageDiv.appendChild(textDiv);
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;

        return messageDiv;
    }

    async function getBotResponse(query) {
        const response = await fetch("/get_response", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({ query: query })
        });
        const data = await response.json();
        return data.response;
    }
});
