
'use server'

import { WebPDFLoader } from '@langchain/community/document_loaders/web/pdf'
import { ChatOpenAI } from '@langchain/openai'
import { Difficulty, PrismaClient, Subject } from '@prisma/client'
import z from 'zod'
import { getCurrentUser } from './db'
const prisma = new PrismaClient();


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





/**
 * Schema for validating generated mock test questions.
 * 
 * This schema defines the structure of a mock test, which consists of an array of questions.
 * Each question includes the following properties:
 * 
 * - `question` (string): The question text in Markdown format.
 * - `options` (string[]): An array of 4 multiple choice options.
 * - `correct_answer` (number): The index of the correct answer option (0-3).
 * - `explanation` (string): An explanation for the correct answer.
 * 
 * The schema ensures that:
 * - The `options` array always contains exactly 4 strings.
 * - The `correct_answer` is a number with a minimum value of 0.
 */
const questionSchema = z.object({
    questions: z.array(z.object({
        question: z.string().describe("The question text in Markdown format"),
        options: z.array(z.string()).length(4).describe("Array of 4 multiple choice options"),
        correct_answer: z.number().min(0).describe("Index of the correct answer option (0-3)"),
        explanation: z.string().describe("Explanation for the correct answer"),
    })).describe("Array of questions"),
}).describe("Schema for generated mock test questions")

/**
 * Generates a set of mock test questions based on the specified subject, difficulty, and total number of questions.
 * The function uses an AI model to create questions that are relevant for placement preparation,
 * ensuring they are challenging and aligned with the given parameters.
 *
 * @param subject - The subject for which the mock test questions are to be generated.
 * @param difficulty - The difficulty level of the questions (e.g., easy, medium, hard).
 * @param totalQuestions - The total number of questions to generate.
 * @returns A promise that resolves to an object containing the generated question set if successful,
 *          or an error message if the generation fails.
 *
 * The returned object has the following structure:
 * - `ok`: A boolean indicating whether the operation was successful.
 * - `questionset`: The validated set of questions (present only if `ok` is true).
 * - `error`: An error message (present only if `ok` is false).
 *
 * @throws Will log an error to the console if the AI model invocation or validation fails.
 */
export async function generateQuestions(subject: Subject, difficulty: Difficulty, totalQuestions: number) {
    try {


        const systemPrompt = `You are an expert test creator specializing in generating mock tests for placement preparation. You create questions that are relevant, challenging, and aligned with the specified subject and difficulty level.`;
        const userPrompt = `Generate a ${difficulty} difficulty mock test for ${subject} with ${totalQuestions} questions. Each question should have 4 multiple choice options with explanations. Make questions relevant for placement preparation.`;

        const structuredModel = model.withStructuredOutput(questionSchema)
        const response = await structuredModel.invoke([
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
        ])

        // Validation to be safe
        const validated = questionSchema.parse(response)

        return {
            ok: true as const,
            questionset: validated,
        }

    }
    catch (error) {
        console.error('generateQuestions error:', error)
        return {
            ok: false as const,
            error: 'AI Error',
        }
    }
}

/**
 * Generates a mock test with AI-generated questions and saves it to the database.
 *
 * @param {Subject} subject - The subject for which the mock test is to be generated.
 * @param {Difficulty} difficulty - The difficulty level of the mock test.
 * @param {number} totalQuestions - The total number of questions in the mock test.
 * @param {number} durationMinutes - The duration of the mock test in minutes.
 * @returns {Promise<{
 *   ok: true,
 *   test: Test,
 *   questions: QuestionSet
 * } | {
 *   ok: false,
 *   error: string
 * }>} - An object indicating the success or failure of the operation. If successful, it includes the created test and the generated questions.
 *
 * @throws {Error} If there is an issue with database operations or question generation.
 */
export async function generateMocktest(subject: Subject, difficulty: Difficulty, totalQuestions: number, durationMinutes: number) {
    const user = await getCurrentUser();
    if (!user) {
        return {
            ok: false as const,
            error: 'No user logged in',
        }
    }

    const questionResult = await generateQuestions(subject, difficulty, totalQuestions)
    if (!questionResult.ok) {
        return {
            ok: false as const,
            error: 'Failed to generate questions',
        }
    }
    console.log(user)

    const newTest = await prisma.test.create({
        data: {
            title: `${subject} - ${difficulty} Test`,
            subject: subject,
            difficulty: difficulty,
            durationMinutes: durationMinutes,
            totalQuestions: totalQuestions,
            status: 'draft',
            isAIGenerated: true,
            userId: user.id
        }
    })

    await prisma.question.createMany({
        data: questionResult.questionset.questions.map(q => ({
            questionText: q.question,
            options: q.options,
            correctAnswer: q.correct_answer,
            explanation: q.explanation,
            testId: newTest.id,
        }))
    })

    return {
        ok: true as const,
        test: newTest,
        questions: questionResult.questionset,
    }

}