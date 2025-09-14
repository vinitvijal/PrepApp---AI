'use server'

import { PrismaClient } from '@prisma/client';  
import { createClient } from '@/utils/supabase/server';
import { analyzeResume } from './ai';

const prisma = new PrismaClient();


async function getCurrentUser() {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    return data.user
} 


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
        analyzeResume(resumeUrl, targetRole).then(async (result) => {
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
    }

}