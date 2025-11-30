import { getResumeProfile } from "@/app/server/db"
import { NextResponse } from "next/server"

interface RouteContext {
  params: { rid: string }
}

export async function GET(request: Request, { params }: RouteContext) {
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
