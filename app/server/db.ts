'use server'

import { Application, PrismaClient, TestStatus } from '@prisma/client';  
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



/**
 * Retrieves the list of applications associated with the currently logged-in user.
 * 
 * This function fetches the current user and, if a user is logged in, queries the database
 * for all applications linked to the user's ID. The results are ordered by their creation
 * date in descending order.
 * 
 * @async
 * @function
 * @returns {Promise<object[]>} A promise that resolves to an array of application objects.
 * If no user is logged in, an empty array is returned.
 */
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


/**
 * Retrieves a list of mock tests for a specific user, ordered by creation date in descending order.
 *
 * @param userId - The unique identifier of the user whose mock tests are to be retrieved.
 * @returns A promise that resolves to an array of mock tests associated with the specified user.
 */
export async function getMockTests(userId: string) {
    return prisma.test.findMany({
        where: { userId: userId },
        orderBy: { createdAt: 'desc' },
    });
}


/**
 * Retrieves a list of questions associated with a specific test ID.
 *
 * @param testId - The unique identifier of the test whose questions are to be fetched.
 * @returns A promise that resolves to an array of questions matching the given test ID.
 */
export async function getQuestionsByTestId(testId: string) {
    return prisma.question.findMany({
        where: { testId: testId },
    });
}

/**
 * Updates the details of a test in the database.
 *
 * @param testId - The unique identifier of the test to be updated.
 * @param status - The current status of the test (e.g., completed, in-progress).
 * @param score - The score achieved in the test.
 * @param correctAnswers - The number of correct answers in the test.
 * @param wrongAnswers - The number of wrong answers in the test.
 * @param weakAreas - An array of topics or areas where the user needs improvement.
 * @param timeTakenMinutes - The total time taken to complete the test, in minutes.
 * @returns A promise that resolves to the updated test record.
 */
export async function updateTest(testId: string, status: TestStatus, score: number, correctAnswers: number, wrongAnswers: number, weakAreas: string[], timeTakenMinutes: number) {
    return prisma.test.update({
        where: { id: testId },
        data: {
            status,
            score,
            correctAnswers,
            wrongAnswers,
            weakAreas,
            timeTakenMinutes
        }
    });
}





/**
 * Retrieves the currently logged-in user's details from the database.
 *
 * This function first checks if there is a user currently logged in. If no user
 * is logged in, it logs a message to the console and returns `null`. If a user
 * is logged in, it fetches the user's details from the database using their unique ID.
 *
 * @returns A promise that resolves to the user's details if found, or `null` if no user is logged in.
 *
 * @throws Will propagate any errors encountered during the database query.
 */
export async function getUser() {
    const user = await getCurrentUser();
    if (!user) {
        console.log("No user logged in");
        return null;
    }
    const userId = user.id;
    return prisma.user.findUnique({
        where: { uid: userId },
    });
}




/**
 * Retrieves dashboard statistics for the currently logged-in user.
 * 
 * This function fetches various statistics related to the user's tests, resumes, 
 * applications, and follow-ups from the database. If no user is logged in, it 
 * returns `null`.
 * 
 * @async
 * @function
 * @returns {Promise<{
 *   totalTests: number;
 *   completedTests: number;
 *   avgScore: number;
 *   totalResumes: number;
 *   totalApplications: number;
 *   pendingFollowups: number;
 * } | null>} An object containing the following statistics:
 *   - `totalTests`: Total number of tests created by the user.
 *   - `completedTests`: Number of tests completed by the user.
 *   - `avgScore`: Average score of the completed tests (defaults to 0 if no scores are available).
 *   - `totalResumes`: Total number of resumes created by the user.
 *   - `totalApplications`: Total number of job applications submitted by the user.
 *   - `pendingFollowups`: Number of applications with follow-up dates up to the current date.
 *   Returns `null` if no user is logged in.
 * 
 * @throws {Error} If there is an issue with database queries.
 */
export async function getDashboardStats() {
    const user = await getCurrentUser();
    if (!user) {
        console.log("No user logged in");
        return null;
    }
    const userId = user.id;

    const totalTests = await prisma.test.count({
        where: { userId: userId },
    });
    
    const completedTests = await prisma.test.count({
        where: { userId: userId, status: 'completed' },
    });
    const avgScore = await prisma.test.aggregate({
        where: { userId: userId, status: 'completed' },
        _avg: { score: true },
    });
    const totalResumes = await prisma.resume.count({
        where: { userId: userId },
    });
    const totalApplications = await prisma.application.count({
        where: { userId: userId },
    });
    const pendingFollowups = await prisma.application.count({
        where: { 
            userId: userId,
            followUpDate: {
                lte: new Date(),
            },
        },
    });

    return {
        totalTests,
        completedTests,
        avgScore: avgScore._avg.score || 0,
        totalResumes,
        totalApplications,
        pendingFollowups
    };
}



/**
 * Retrieves a specified number of tests associated with the currently logged-in user.
 * 
 * @param numberOfTests - The maximum number of tests to retrieve.
 * @returns A promise that resolves to an array of tests. If no user is logged in, returns an empty array.
 * 
 * @remarks
 * - The tests are fetched from the database and are ordered by their creation date in descending order.
 * - This function depends on the `getCurrentUser` function to determine the logged-in user.
 * - If no user is logged in, a message is logged to the console.
 * 
 * @throws Will throw an error if there is an issue with the database query.
 */
export async function getTests(numberOfTests: number) {
    const user = await getCurrentUser();
    if (!user) {
        console.log("No user logged in");
        return [];
    }
    return prisma.test.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: numberOfTests,
    });
}


/**
 * Retrieves a specified number of applications for the currently logged-in user.
 *
 * @param numberOfApplications - The maximum number of applications to retrieve.
 * @returns A promise that resolves to an array of applications. If no user is logged in, returns an empty array.
 *
 * @remarks
 * - The applications are fetched from the database and are ordered by their creation date in descending order.
 * - This function depends on the `getCurrentUser` function to determine the currently logged-in user.
 * - If no user is logged in, a message is logged to the console.
 *
 * @throws Will throw an error if there is an issue with the database query.
 */
export async function getApplications(numberOfApplications: number) {
    const user = await getCurrentUser();
    if (!user) {
        console.log("No user logged in");
        return [];
    }
    return prisma.application.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: numberOfApplications,
    });
}



/**
 * Retrieves mock data from the database based on the provided mock ID.
 *
 * @param mockid - The unique identifier of the mock data to retrieve.
 * @returns A promise that resolves to the mock data object if found, or `null` if no matching record exists.
 */
export async function getMockData(mockid: string) {
    return prisma.test.findUnique({
        where: { id: mockid },
    });
}



/**
 * Retrieves a resume profile from the database based on the provided resume ID.
 *
 * @param resumeId - The unique identifier of the resume to retrieve.
 * @returns A promise that resolves to the resume profile if found, or `null` if no matching resume exists.
 */
export async function getResumeProfile(resumeId: string) {
    return prisma.resume.findUnique({
        where: { id: resumeId },
    });
}