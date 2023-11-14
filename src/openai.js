// Importing OpenAI library
import OpenAI from 'openai';

// Creating an instance of OpenAI with the API key from environment variables
const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
});

// Function for sending a message to OpenAI and receiving a completion
export async function sendingToOpenAi(message) {
    console.log("working...");

    // Sending a request to OpenAI's chat completion API
    const res = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{
            role: "user",
            content: message
        }],
        temperature: 0.9,
    });

    // Returning the generated text from OpenAI's response
    return res.data.choices[0].text;
}
