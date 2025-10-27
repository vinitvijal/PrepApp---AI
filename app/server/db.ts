'use server'

import { Application, PrismaClient } from '@prisma/client';  
import { createClient } from '@/utils/supabase/server';
import { analyzeResume } from './ai';

const prisma = new PrismaClient();


/**
 * Retrieve the currently authenticated user from Supabase.
 *
 * This function creates a Supabase client via `createClient()` and calls
 * `supabase.auth.getUser()` to obtain the current authentication user data.
 * If a session exists, the user object is returned; otherwise, `null` is returned.
 *
 * @returns {Promise<import('@supabase/supabase-js').User | null>} A promise that resolves
 *          to the authenticated user object, or `null` if there is no active session.
 * @throws Propagates any errors thrown by `createClient()` or `supabase.auth.getUser()`.
 */
export async function getCurrentUser() {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    return data.user
} 





/**
 * Analyze a resume from a given URL for a specified target role and persist the analysis for the current user.
 *
 * This function:
 * - Resolves the current authenticated user via getCurrentUser().
 * - Validates inputs (resumeUrl, targetRole, fileName) and returns early (with console logging) if validation fails.
 * - Calls analyzeResume(resumeUrl, targetRole) and, if the analysis is successful, creates a new resume record in the database via prisma.resume.create().
 * - Logs progress and errors to the console.
 *
 * @param resumeUrl - URL pointing to the resume file to analyze (e.g., a publicly accessible PDF URL).
 * @param targetRole - The job title or target role to evaluate the resume against (e.g., "Frontend Engineer").
 * @param fileName - Original file name of the resume; the stored title is derived by removing the file extension.
 *
 * @returns A Promise that resolves to one of:
 * - { success: true, data: object } when analysis and storage succeed. The data object contains analysis results such as atsScore, strengths, weaknesses, and suggestions.
 * - { success: false, error: string } when an unexpected error occurs during analysis or storage.
 * - undefined when validation fails (no authenticated user or missing parameters) or when analyzeResume returns a falsy result or a result indicating failure (result.ok === false). In these cases diagnostic messages are logged and no database record is created.
 *
 * @remarks
 * - Side effects: writes to the database (prisma.resume.create) and emits console logs.
 * - External dependencies: getCurrentUser(), analyzeResume(), and a configured Prisma client (prisma).
 * - The function catches and logs unexpected errors and returns a failure object in the catch block.
 */
export async function AnalyzeAndStoreResume(resumeUrl: string, targetRole: string, fileName: string) {
    const user = await getCurrentUser();

    if (!user) {
        console.log("No user logged in");
        return;
    }
    if (!resumeUrl || !targetRole || !fileName) {
        console.log("Missing parameters");
        return;
    }

    try {
        return analyzeResume(resumeUrl, targetRole).then(async (result) => {
            if (!result) {
                console.log("Failed to analyze resume");
                return;
            }

            if (!result.ok) {
                console.log("Resume analysis error:", result.error);
                return;
            }
            
            await prisma.resume.create({
                data: {
                    userId: user.id,
                    title: fileName.replace(/\.[^/.]+$/, ""),
                    targetRole: targetRole,
                    fileUrl: resumeUrl,
                    atsScore: result.data.atsScore,
                    strengths: result.data.strengths,
                    weaknesses: result.data.weaknesses,
                    suggestions: result.data.suggestions,
                },
            });
            console.log("Resume analysis stored successfully");
            return {
                success: true,
                data: result.data,
            }
            
        });
    } catch (error) {
        console.error("Error analyzing resume:", error);
        return {
            success: false,
            error: "Failed to analyze resume.",
        }
    }

}






/**
 * Retrieve resumes for the currently authenticated user.
 *
 * This asynchronous function:
 * - Calls getCurrentUser() to determine the current user.
 * - If no user is logged in, logs "No user logged in" to the console and resolves to an empty array.
 * - If a user is present, queries the database (via prisma.resume.findMany) for resumes with
 *   userId equal to the current user's id, ordered by createdDate in descending order (newest first).
 *
 * @async
 * @returns {Promise<any[]>} A promise that resolves to an array of resume records for the current user.
 * If no user is logged in, the promise resolves to an empty array. The promise may reject if the
 * underlying database/client call fails.
 *
 * @throws {Error} May reject with an error from the database/client if the query fails.
 *
 * @remarks
 * - Relies on getCurrentUser() and a prisma client instance being available in the surrounding module.
 * - Has the side effect of writing a console message when no user is authenticated.
 */
export async function getUserResumes() {
    const user = await getCurrentUser();
    if (!user) {
        console.log("No user logged in");
        return [];
    }
    return prisma.resume.findMany({
        where: { userId: user.id },
        orderBy: { createdDate: 'desc' },
    });
}





/**
 * Adds an application record to the database for the currently authenticated user.
 *
 * @remarks
 * - Obtains the current user via getCurrentUser(). If no user is logged in, the function logs a message and returns early.
 * - Persists the provided Application data to the database using prisma.application.create(), augmenting the data with the current user's id (userId).
 * - Any errors encountered while creating the record are caught and logged; the function does not rethrow.
 * - Side effects: performs a database write and writes informational/error messages to the console.
 *
 * @param data - The Application object containing the fields to store. The object will be spread and userId will be set to the current user's id.
 *
 * @returns A Promise that resolves to void. The promise resolves after the create operation completes or immediately when no user is found.
 */
export async function addApplication(data: Application) {
    const user = await getCurrentUser();
    if (!user) {
        console.log("No user logged in");
        return;
    }

    try {
        await prisma.application.create({
            data: {
                ...data,
                userId: user.id,
            },
        });
        console.log("Application added successfully");
        return { success: true };
    } catch (error) {
        console.error("Error adding application:", error);
        return { success: false };
    }
}






/**
 * Update an existing Application record that belongs to the currently authenticated user.
 *
 * This function resolves the current user via `getCurrentUser()`. If no user is authenticated,
 * it logs a message and returns `undefined`. If a user is present, it attempts to update the
 * application identified by `id` and scoped to the user's id using Prisma. Success and error
 * outcomes are logged to the console.
 *
 * @param id - The unique identifier of the application to update.
 * @param data - The Application object containing updated fields to persist.
 *
 * @returns A Promise that resolves to:
 * - `{ success: true }` when the update completes successfully,
 * - `{ success: false }` when an error occurs during the update,
 * - `undefined` when no user is logged in.
 *
 * @remarks
 * - Relies on `getCurrentUser()` to determine the authenticated user and on a configured
 *   Prisma client (`prisma`) to perform the update.
 * - Any errors thrown by Prisma are caught, logged, and result in `{ success: false }`.
 */
export async function updateApplication(id: string, data: Application) {
    const user = await getCurrentUser();
    if (!user) {
        console.log("No user logged in");
        return;
    }

    try {
        await prisma.application.update({
            where: { id, userId: user.id },
            data,
        });
        console.log("Application updated successfully");
        return { success: true };
    } catch (error) {
        console.error("Error updating application:", error);
        return { success: false };
    }
}



// get applications for the current user
export async function getUserApplications() {
    const user = await getCurrentUser();
    if (!user) {
        console.log("No user logged in");
        return [];
    }
    return prisma.application.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
    });
}
