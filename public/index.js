const fs = require("node:fs");
const OpenAI = require("openai");
const apiKey = process.env.TOKEN;
const openai = new OpenAI({ apiKey });
const express = require("express");
const multer = require("multer");
const path = require("node:path");

async function voiceToText(path) {
    const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(path),
        model: "whisper-1",
        language: "en",
    });

    return transcription;
}

const app = express();
const port = 4000;

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, "uploads/");
    },
    filename: (_, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("myFile"), async (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }
    const transcription = await voiceToText(req.file.path);
    res.json(transcription);
});

app.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});
