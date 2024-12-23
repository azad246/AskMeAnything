import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const POST = async (request:Request) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_URL);

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                maxOutputTokens: 400,
                temperature: 0.5,
            },
        });

        const { question } = await request.json();
        const prompt=question+".Answer under 400 words."
        const result = await model.generateContent(question);

        return NextResponse.json({ answer: result.response.candidates[0].content.parts[0].text});
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};
