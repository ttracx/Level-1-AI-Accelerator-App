const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

dotenv.config();

const API_KEY = process.env.API_KEY || "b2100366920247a78d0fd45dddda345c";
const ENDPOINT = "https://aoai-hackathon-eastus.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2023-03-15-preview";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

function markdownToHtml(text) {
    return text
        .replace(/### (.*$)/gim, "<h3>$1</h3>")
        .replace(/## (.*$)/gim, "<h2>$1</h2>")
        .replace(/# (.*$)/gim, "<h1>$1</h1>")
        .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
        .replace(/\*(.*)\*/gim, "<em>$1</em>")
        .replace(/^- (.*$)/gim, "<li>$1</li>")
        .replace(/\n/gim, "<br>");
}

app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body;

        const response = await axios.post(
            ENDPOINT,
            {
                messages: [
                    {
                        role: "system",
                        content: "You are an AI assistant for the Level 1 AI Accelerator Generation App. Your purpose is to help users create, modify, and deploy AI-powered Copilots. Provide information and guidance on AI Accelerator topics, best practices, and answer user queries related to Copilot development and deployment."
                    },
                    { role: "user", content: message }
                ]
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "api-key": API_KEY
                }
            }
        );

        if (response.data && response.data.choices[0] && response.data.choices[0].message) {
            const botResponse = markdownToHtml(response.data.choices[0].message.content);
            res.json({ message: botResponse });
        } else {
            throw new Error("Invalid response format from OpenAI API.");
        }
    } catch (error) {
        console.error("Error:", error.message || error);
        res.status(500).json({
            error: "An error occurred while processing your request."
        });
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});