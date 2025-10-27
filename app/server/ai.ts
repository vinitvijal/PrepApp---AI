
'use server'

import { WebPDFLoader } from '@langchain/community/document_loaders/web/pdf'
import { ChatOpenAI } from '@langchain/openai'
import z from 'zod'


// Initialize the ChatOpenAI model with 0 temperature for deterministic outputs and gpt-4o-mini model
const model = new ChatOpenAI({
    model: 'gpt-4o-mini',
    temperature: 0,
})


// Define the schema for the resume analysis output
const resumeSchema = z.object({
    atsScore: z.number().min(0).max(100),
    strengths: z.array(z.string()).default([]),
    weaknesses: z.array(z.string()).default([]),
    suggestions: z.array(z.string()).default([]),
})




/**
 * Analyze a PDF resume against a target role using an LLM-backed ATS-style evaluator.
 *
 * This function:
 * - Fetches a PDF from the provided resumeUrl.
 * - Parses the PDF into text using WebPDFLoader.
 * - Truncates the combined resume text to a maximum of 24,000 characters before sending to the model.
 * - Calls a ChatOpenAI model (gpt-4o-mini, temperature 0) using a structured output schema (zod) to obtain a
 *   deterministic, JSON-only evaluation.
 * - Validates the model output against the zod-driven `resumeSchema` and returns structured results plus metadata.
 *
 * Key behaviors and constraints:
 * - Input:
 *   - resumeUrl: URL string pointing to a PDF resume. The function will fetch the PDF using `fetch`.
 *   - targetRole: A short description of the target role / job title used to evaluate relevance and keywords.
 * - Text truncation:
 *   - The loader concatenates all pages and the function truncates to MAX_CHARS = 24,000 characters. The returned
 *     meta.truncated flag indicates whether truncation occurred.
 * - Output schema (validated with zod):
 *   - data.atsScore: number (0-100) — an integer estimate of fit/relevance for ATS and technical recruiting.
 *   - data.strengths: string[] — concise bullet-style phrases describing resume strengths.
 *   - data.weaknesses: string[] — concise bullet-style phrases describing weaknesses or gaps.
 *   - data.suggestions: string[] — actionable, prioritized recommendations (impact, metrics, missing sections).
 * - Return value:
 *   - On success:
 *     {
 *       ok: true,
 *       data: { atsScore, strengths, weaknesses, suggestions },
 *       meta: { charsAnalyzed: number, pages: number, truncated: boolean }
 *     }
 *   - On failure:
 *     { ok: false, error: string }  (the function catches exceptions and returns this shape instead of throwing)
 *
 * Important implementation notes:
 * - The model is invoked with structured output enforcement (zod) and is instructed to "Return JSON only."
 * - The function deliberately uses a low temperature (0) for deterministic outputs and prevents hallucination via
 *   explicit prompt instructions; however, the model output is still validated with the zod schema.
 * - If the fetched PDF response is not ok, the function will treat it as an error and return the failure shape.
 *
 * Example:
 * const result = await analyzeResume('https://example.com/resume.pdf', 'Senior Backend Engineer');
 * if (result.ok) {
 *   console.log(result.data.atsScore, result.data.suggestions);
 * } else {
 *   console.error(result.error);
 * }
 *
 * @param resumeUrl - A publicly accessible URL to a PDF resume. Must be provided.
 * @param targetRole - The target role / job title to evaluate the resume against. Must be provided.
 * @returns A promise resolving to a success shape with validated evaluation data and meta information, or a failure shape with an error string.
 */


export async function analyzeResume(resumeUrl: string, targetRole: string) {
    try {

        // Basic validation
        if (!resumeUrl) throw new Error('Missing resumeUrl')
        if (!targetRole) throw new Error('Missing targetRole')
        console.log(resumeUrl)

        // Fetch and parse the PDF resume
        const pdfResp = await fetch(resumeUrl)
        if (!pdfResp.ok) throw new Error(`Failed to fetch PDF: ${pdfResp.status}`)
        const pdfBlob = await pdfResp.blob()
        const loader = new WebPDFLoader(pdfBlob, {
            parsedItemSeparator: '\n\n',
        })


        // Load and combine all pages text
        const docs = await loader.load()
        const fullText = docs.map(d => d.pageContent).join('\n\n')

        // Limit text length
        const MAX_CHARS = 24000
        const truncated = fullText.slice(0, MAX_CHARS)


        // Prepare the prompt with system instructions and user input
        const systemInstruction = `You are an expert ATS (Applicant Tracking System) and technical recruiting assistant.
        Given a candidate resume text and a target role, produce a structured evaluation.
        Guidelines:
        - ATS score is an estimate (integer 0-100) factoring relevance, clarity, keywords, structure.
        - Strengths & weaknesses: concise bullet-style phrases (no leading numbering, no periods unless needed).
        - Suggestions: actionable improvements focusing on impact, metrics, missing sections, clarity.
        - Do NOT hallucinate experience not present; base judgments only on provided text.
        - If information is sparse, lower the score and focus suggestions on elaboration.
        `

        // Construct the user prompt
        const userPrompt = `TARGET ROLE: ${targetRole}\n\nRESUME TEXT (truncated if long):\n"""\n${truncated}\n"""\n\nReturn JSON only.`

        // Invoke the model with the prepared prompts
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





const questionSchema = z.object({
    question: z.string().describe("The question text in Markdown format"),
    options: z.array(z.string()).length(4).describe("Array of 4 multiple choice options"),
    correct_answer: z.number().min(0).describe("Index of the correct answer option (0-3)"),
    explanation: z.string().describe("Explanation for the correct answer"),
})