document.addEventListener("DOMContentLoaded", async () => {
    const chatbotIcon = document.getElementById("chatbot-icon");
    const chatbotContainer = document.getElementById("chatbot-container");
    const closeChatbot = document.getElementById("close-chatbot");
    const chatbotBody = document.getElementById("chatbot-body");
    const userInput = document.getElementById("user-input");
    const sendMessage = document.getElementById("send-message");

    let questionAnswerDB = []; // Database untuk pertanyaan dan jawaban

    // Fetch database CSV
    async function fetchDatabase() {
        try {
            // Memuat file CSV
            const response = await fetch("./Database Tanya Jawab Chatbot.csv");
            if (!response.ok) {
                console.error("Gagal memuat database:", response.statusText);
                return;
            }
            const csvText = await response.text();
            
            // Debugging: Log isi CSV
            console.log("Isi CSV:", csvText);
    
            // Parsing CSV ke array objek
            questionAnswerDB = parseCSV(csvText);
    
            // Debugging: Log hasil parsing
            console.log("Database setelah parsing:", questionAnswerDB);
        } catch (error) {
            console.error("Error saat memuat database:", error);
        }
    }    

    // Parse CSV to array of objects
    function parseCSV(csv) {
        const lines = csv.split("\n");
        const result = [];
        for (const line of lines.slice(1)) { // Skip header
            const [question, answer] = line.split(",");
            if (question && answer) {
                result.push({
                    question: question.trim().toLowerCase(), // Simpan pertanyaan dalam huruf kecil
                    answer: answer.trim() // Simpan jawaban
                });
            }
        }
        return result;
    }

    // Initialize database
    await fetchDatabase();

    // Toggle Chatbot visibility
    chatbotIcon.addEventListener("click", () => {
        chatbotContainer.style.display = "flex";
        chatbotIcon.style.display = "none";
    });

    closeChatbot.addEventListener("click", () => {
        chatbotContainer.style.display = "none";
        chatbotIcon.style.display = "block";
    });

    // Handle sending messages
    sendMessage.addEventListener("click", () => {
        const userMessage = userInput.value.trim();
        if (userMessage) {
            addMessage(userMessage, "user-message");
            getChatbotResponse(userMessage);
            userInput.value = "";
        }
    });

    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            sendMessage.click();
        }
    });

    function addMessage(text, className) {
        const message = document.createElement("div");
        message.className = `chatbot-message ${className}`;
        message.textContent = text;
        chatbotBody.appendChild(message);
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }

    function getChatbotResponse(userMessage) {
        const lowerCaseMessage = userMessage.toLowerCase();
        let response = "Maaf, saya tidak memahami pertanyaan Anda. Silakan coba lagi.";

        // Match user message with database
        for (const entry of questionAnswerDB) {
            if (lowerCaseMessage.includes(entry.question)) {
                response = entry.answer;
                break;
            }
        }

        setTimeout(() => {
            addMessage(response, "bot-message");
        }, 1000);
    }
});