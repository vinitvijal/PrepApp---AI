import { getResumeProfile } from "@/app/server/db"
import { NextRequest, NextResponse } from "next/server"

/**
 * Handles the GET request to fetch and serve a resume file.
 *
 * @param request - The incoming HTTP request object.
 * @param context - The route context containing parameters.
 * @param context.params - The route parameters.
 * @param context.params.rid - The resume ID used to fetch the resume profile.
 * @returns A `NextResponse` object containing the resume file as a PDF or an error response.
 *
 * The function performs the following steps:
 * 1. Retrieves the resume profile using the provided `rid` parameter.
 * 2. If the resume or its file URL is not found, returns a 404 error response.
 * 3. Fetches the resume file from the upstream URL.
 * 4. If the upstream fetch fails, returns a 502 error response.
 * 5. Serves the resume file as a PDF with appropriate headers:
 *    - `Content-Type`: `application/pdf`
 *    - `Content-Disposition`: Inline or attachment based on the `download` query parameter.
 *    - `Cache-Control`: Private, no caching.
 */
export async function GET(request: NextRequest, { params }: { params: { rid: string } }) {
  const { rid } = params
  const resume = await getResumeProfile(rid)

  if (!resume?.fileUrl) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 })
  }

  const url = new URL(request.url)
  const forceDownload = url.searchParams.get("download") === "1"

  const upstream = await fetch(resume.fileUrl, { cache: "no-store" })
  if (!upstream.ok) {
    return NextResponse.json({ error: "Unable to fetch resume file" }, { status: 502 })
  }

  const arrayBuffer = await upstream.arrayBuffer()
  const filename = `${resume.title ?? "resume"}-${resume.targetRole ?? "file"}.pdf`

  return new NextResponse(arrayBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${forceDownload ? "attachment" : "inline"}; filename="${encodeURIComponent(
        filename
      )}"`,
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  })
}
