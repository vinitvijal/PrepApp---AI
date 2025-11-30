import { getResumeProfile } from "@/app/server/db"

interface ResumePageProps {
	params: Promise<{ rid: string }>
}

export default async function ResumePage({ params }: ResumePageProps) {
	const { rid } = await params
	const resume = await getResumeProfile(rid)

	if (!resume) {
		return <div className="p-6">Resume not found.</div>
	}

	const previewUrl = `/api/resume/${rid}/preview`
	const downloadUrl = `${previewUrl}?download=1`

	return (
		<div className="flex min-h-screen flex-col gap-4 bg-slate-50 p-6">
			<a
				href={downloadUrl}
				download={`${resume.title}-${resume.targetRole}.pdf`}
				className="inline-flex w-fit items-center gap-2 border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:text-slate-900"
			>
				Download PDF
			</a>
			<iframe
				src={previewUrl}
				title={`Resume ${rid}`}
				className="h-[calc(100vh-140px)] w-full border border-slate-300 bg-white shadow-sm"
			/>
		</div>
	)
}
