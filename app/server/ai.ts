'use server'

import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { ChatOpenAI } from "@langchain/openai";
import z from "zod";


const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0
});


const resume = z.object({
    atsScore: z.number().min(0).max(100),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    suggestions: z.array(z.string())
});


export async function analyzeResume(resumeUrl: string, targetRole: string) {
    const prompt = ``    


}