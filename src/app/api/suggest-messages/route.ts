import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

// Providing API Key for gemin Integration 
const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

// Providing runtime 
export const runtime = 'edge';

export async function POST(request: Request) {
    try {
        // Specifying a model to be used and sending a prompt to model 

        const { text } = await generateText({
            model: google('gemini-1.5-pro-latest'),
            prompt: "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be seprated by '||'. These questions are for an anonymous social messaging platform,like qooh.me, and should be suitable for a diverse audience. For example your output should be stuctured like this: 'What's a hobby that you've recently started? || If you could have dinner with any historical figure, who would it be? || What's a simple thing that makes you happy?'Ensure the questions are intriguing and foster curiosity. Also make sure there is no repition in questions.",
        });

        return new Response(JSON.stringify({ text }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: any) {

        console.error('Unexpected error occurred', error);
        return new Response(JSON.stringify({ message: error.message || 'An error occurred' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
            
        });
    }
}
