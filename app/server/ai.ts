'use server'

import { WebPDFLoader } from '@langchain/community/document_loaders/web/pdf'
import { ChatOpenAI } from '@langchain/openai'
import z from 'zod'


const model = new ChatOpenAI({
    model: 'gpt-4o-mini',
    temperature: 0,
})


const resumeSchema = z.object({
    atsScore: z.number().min(0).max(100),
    strengths: z.array(z.string()).default([]),
    weaknesses: z.array(z.string()).default([]),
    suggestions: z.array(z.string()).default([]),
})




export async function analyzeResume(resumeUrl: string, targetRole: string) {
    try {
        if (!resumeUrl) throw new Error('Missing resumeUrl')
        if (!targetRole) throw new Error('Missing targetRole')
        
        console.log(resumeUrl)
        
        const pdfResp = await fetch(resumeUrl)

        if (!pdfResp.ok) throw new Error(`Failed to fetch PDF: ${pdfResp.status}`)

        const pdfBlob = await pdfResp.blob()

        const loader = new WebPDFLoader(pdfBlob, {
            parsedItemSeparator: '\n\n',
        })
        
        const docs = await loader.load()
        const fullText = docs.map(d => d.pageContent).join('\n\n')

        // Limit text length
        const MAX_CHARS = 24000
        const truncated = fullText.slice(0, MAX_CHARS)

        const systemInstruction = `You are an expert ATS (Applicant Tracking System) and technical recruiting assistant.
        Given a candidate resume text and a target role, produce a structured evaluation.
        Guidelines:
        - ATS score is an estimate (integer 0-100) factoring relevance, clarity, keywords, structure.
        - Strengths & weaknesses: concise bullet-style phrases (no leading numbering, no periods unless needed).
        - Suggestions: actionable improvements focusing on impact, metrics, missing sections, clarity.
        - Do NOT hallucinate experience not present; base judgments only on provided text.
        - If information is sparse, lower the score and focus suggestions on elaboration.
        `

        const userPrompt = `TARGET ROLE: ${targetRole}\n\nRESUME TEXT (truncated if long):\n"""\n${truncated}\n"""\n\nReturn JSON only.`

        const structuredModel = model.withStructuredOutput(resumeSchema)
        const response = await structuredModel.invoke([
            { role: 'system', content: systemInstruction },
            { role: 'user', content: userPrompt },
        ])

        // Validation to be safe
        const validated = resumeSchema.parse(response)

        return {
            ok: true as const,
            data: validated,
            meta: {
                charsAnalyzed: truncated.length,
                pages: docs.length,
                truncated: fullText.length > truncated.length,
            },
        }
    } catch {
        console.error('analyzeResume error - ', resumeUrl)
        return {
            ok: false as const,
            error: 'AI Error',
        }
    }
}


