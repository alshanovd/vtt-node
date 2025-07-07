const fs = require('node:fs');
const OpenAI = require('openai');

const apiKey = process.env.TOKEN;
const openai = new OpenAI({ apiKey });

async function main() {
    const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream("hello.mp4"),
        model: "whisper-1",
        language: "en", // this is optional but helps the model
    });

    console.log(transcription);
}
main();