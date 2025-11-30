const DUMMY_PDF_URL = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"

interface ResumePageProps {
	params: { rid: string }
}

export default function ResumePage({ params }: ResumePageProps) {
	return (
		<div className="flex min-h-screen flex-col gap-4 bg-slate-50 p-6">
			<a
				href={DUMMY_PDF_URL}
				download={`resume-${params.rid}.pdf`}
				className="inline-flex w-fit items-center gap-2 border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:text-slate-900"
			>
				Download PDF
			</a>
			<iframe
				src={DUMMY_PDF_URL}
				title={`Resume ${params.rid}`}
				className="h-[calc(100vh-140px)] w-full border border-slate-300 bg-white shadow-sm"
			/>
		</div>
	)
}
