'use server'

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


const s3Client = new S3Client({
    region: "auto", 
    endpoint: process.env.R2_ENDPOINT!,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
});


/**
 * Generates a presigned URL for uploading a file to a Cloudflare R2 bucket.
 *
 * The function builds a PutObject request for the target bucket and object key (folder + '/' + fileName),
 * then creates a time-limited signed URL that can be used by clients to upload the file directly.
 *
 * Remarks:
 * - The environment variable `R2_BUCKET_NAME` must be defined and point to the target bucket.
 * - The generated URL is valid for 300 seconds (5 minutes).
 * - Any errors encountered while generating the URL are caught and returned as a failure result; the function does not throw.
 *
 * @param fileName - The name of the file to be uploaded (including extension). This will be appended to the provided folder path.
 * @param fileType - The MIME type (Content-Type) of the file being uploaded (e.g., "image/png", "application/pdf").
 * @param folder - The folder/path inside the bucket where the file should be placed. Use an empty string to place the file at the bucket root.
 *
 * @returns A promise that resolves to an object indicating success or failure:
 * - On success: { success: true, url: string } where `url` is the presigned PUT URL.
 * - On failure: { success: false, error: string } with a human-readable error message.
 */
export async function getPresignedUploadUrl(fileName: string, fileType: string, folder: string) {
    try {
        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: folder + '/' + fileName,
            ContentType: fileType,
        });

        const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });

        return { success: true, url };
    } catch (error) {
        console.error("Error generating presigned URL:", error);
        return { success: false, error: "Failed to generate upload URL." };
    }
}