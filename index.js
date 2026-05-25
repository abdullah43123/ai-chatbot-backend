const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const Groq = require("groq-sdk");

app.use(cors());
app.use(express.json());

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: message,
                },
            ],
            model: "llama-3.3-70b-versatile",
        });

        res.json({
            success: true,
            reply: chatCompletion.choices[0].message.content,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
        console.log(`Server running on port ${port}`)
    });
}