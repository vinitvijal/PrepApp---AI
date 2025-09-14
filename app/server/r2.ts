'use server'

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


const s3Client = new S3Client({
    region: "auto", 
    endpoint: process.env.R2_ENDPOINT!,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
});


export async function getPresignedUploadUrl(fileName: string, fileType: string, folder: string) {
    try {
        const command = new GetObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: folder + '/' + fileName,
            ResponseContentType: fileType,
        });

        const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });

        return { success: true, url };
    } catch (error) {
        console.error("Error generating presigned URL:", error);
        return { success: false, error: "Failed to generate upload URL." };
    }
}