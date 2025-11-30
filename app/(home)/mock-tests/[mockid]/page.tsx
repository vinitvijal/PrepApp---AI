import { getMockData } from "@/app/server/db"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Brain, CalendarDays, Clock, ListChecks, Target } from "lucide-react"
import { notFound } from "next/navigation"

interface MockTestDetailPageProps {
  params: { mockid: string }
}

const difficultyStyles: Record<string, string> = {
  easy: "bg-emerald-500/15 text-emerald-100 border-emerald-400/40",
  medium: "bg-amber-500/20 text-amber-100 border-amber-400/40",
  hard: "bg-rose-500/20 text-rose-100 border-rose-400/40",
}

const statusStyles: Record<string, string> = {
  completed: "bg-emerald-500/10 text-emerald-600 border-emerald-300",
  in_progress: "bg-amber-500/10 text-amber-700 border-amber-300",
  scheduled: "bg-sky-500/10 text-sky-700 border-sky-300",
  draft: "bg-slate-500/10 text-slate-600 border-slate-300",
}

const formatDateTime = (value: Date | string) => {
  const date = typeof value === "string" ? new Date(value) : value
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date)
}

const titleCase = (input: string) =>
  input
    .replace(/_/g, " ")
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")

export default async function MockTestDetailPage({ params }: MockTestDetailPageProps) {
  const { mockid } = params
  const mockData = await getMockData(mockid)

  if (!mockData) {
    notFound()
  }

  const durationMinutes = mockData.durationMinutes ?? 0
  const totalQuestions = mockData.totalQuestions ?? 0
  const correctAnswers = mockData.correctAnswers ?? 0
  const timeTakenMinutes = mockData.timeTakenMinutes ?? 0
  const providedWrongAnswers = typeof mockData.wrongAnswers === "number" ? mockData.wrongAnswers : null

  const accuracy = totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100) : 0
  const incorrectCount = providedWrongAnswers ?? Math.max(totalQuestions - correctAnswers, 0)
  const unanswered = Math.max(totalQuestions - (correctAnswers + incorrectCount), 0)
  const timeUsage = durationMinutes
    ? Math.min(100, Math.round((timeTakenMinutes / durationMinutes) * 100))
    : 0

  const difficultyBadge = difficultyStyles[mockData.difficulty] || "bg-white/10 text-white border-white/20"
  const statusBadge = statusStyles[mockData.status] || "bg-slate-100 text-slate-700 border-slate-200"

  return (
    <div className="p-6 md:p-10 space-y-8 bg-slate-50 min-h-[calc(100vh-6rem)]">
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="relative overflow-hidden border-none bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent)]" />
          <CardHeader className="relative space-y-6">
            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide">
              <Badge className={`border-white/20 bg-white/10 text-white/90`}>{titleCase(mockData.subject)}</Badge>
              <Badge className={`${difficultyBadge} uppercase`}>{titleCase(mockData.difficulty)}</Badge>
              <Badge className={`${statusBadge} uppercase`}>{titleCase(mockData.status)}</Badge>
              {mockData.isAIGenerated && (
                <Badge className="bg-purple-500/30 text-white border-purple-300/50">AI Generated</Badge>
              )}
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl md:text-4xl font-semibold tracking-tight">
                {mockData.title}
              </CardTitle>
              <CardDescription className="text-blue-100 text-sm md:text-base max-w-2xl">
                Personalized insights from your recent mock test. Review your performance, understand your pacing,
                and spot the areas to focus on next.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="relative grid gap-6 pb-8 sm:grid-cols-2 text-sm text-blue-100">
            <div className="flex items-center gap-3">
              <Clock className="h-10 w-10 rounded-lg bg-white/15 p-2 text-white" />
              <div>
                <p className="text-xs uppercase tracking-wide text-blue-200">Planned Duration</p>
                <p className="text-lg font-semibold text-white">{durationMinutes} minutes</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Target className="h-10 w-10 rounded-lg bg-white/15 p-2 text-white" />
              <div>
                <p className="text-xs uppercase tracking-wide text-blue-200">Total Questions</p>
                <p className="text-lg font-semibold text-white">{totalQuestions}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CalendarDays className="h-10 w-10 rounded-lg bg-white/15 p-2 text-white" />
              <div>
                <p className="text-xs uppercase tracking-wide text-blue-200">Completed On</p>
                <p className="text-lg font-semibold text-white">
                  {formatDateTime(mockData.updatedAt ?? mockData.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Brain className="h-10 w-10 rounded-lg bg-white/15 p-2 text-white" />
              <div>
                <p className="text-xs uppercase tracking-wide text-blue-200">Mock ID</p>
                <p className="text-lg font-semibold text-white truncate">{mockData.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-indigo-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-indigo-700">Overall Score</CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Performance snapshot for this mock test
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6 py-6">
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-indigo-50">
              <div className="absolute inset-1 rounded-full border border-indigo-100" />
              <span className="text-4xl font-semibold text-indigo-700">{mockData.score ?? "-"}</span>
              <span className="absolute bottom-3 text-xs font-medium uppercase tracking-wide text-indigo-500">
                Score
              </span>
            </div>
            <div className="w-full space-y-4 text-sm">
              <div className="flex items-center justify-between text-gray-600">
                <span>Status</span>
                <span className="font-medium text-indigo-700">{titleCase(mockData.status)}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Correct Answers</span>
                <span className="font-medium text-indigo-700">{correctAnswers}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Wrong Answers</span>
                <span className="font-medium text-indigo-700">{incorrectCount}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Time Taken</span>
                <span className="font-medium text-indigo-700">{timeTakenMinutes} minutes</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Award className="h-4 w-4 text-blue-500" />
              Accuracy
            </CardTitle>
            <CardDescription className="text-xs text-gray-500">
              Ratio of correct answers to total questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-gray-900">{accuracy}%</span>
              <span className="text-xs uppercase text-gray-500">Accuracy</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div className="h-full rounded-full bg-blue-500" style={{ width: `${accuracy}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Clock className="h-4 w-4 text-violet-500" />
              Time Management
            </CardTitle>
            <CardDescription className="text-xs text-gray-500">
              Time taken compared to the planned duration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-gray-900">{timeTakenMinutes}m</span>
              <span className="text-xs uppercase text-gray-500">Used of {durationMinutes}m</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div className="h-full rounded-full bg-violet-500" style={{ width: `${timeUsage}%` }} />
            </div>
            <p className="text-xs text-gray-500">
              You used {timeUsage}% of the allotted time. {timeUsage < 60 ? "Plenty of time left—consider slowing down to double-check answers." : "Great pacing—keep practicing to maintain consistency."}
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-emerald-500" />
              Question Breakdown
            </CardTitle>
            <CardDescription className="text-xs text-gray-500">
              Summary of your responses across the test
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <div className="flex items-center justify-between rounded-md border border-emerald-100 bg-emerald-50 px-3 py-2">
              <span className="text-emerald-700">Correct</span>
              <span className="font-semibold text-emerald-800">{correctAnswers}</span>
            </div>
            <div className="flex items-center justify-between rounded-md border border-rose-100 bg-rose-50 px-3 py-2">
              <span className="text-rose-700">Incorrect</span>
              <span className="font-semibold text-rose-800">{incorrectCount}</span>
            </div>
            <div className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50 px-3 py-2">
              <span className="text-slate-700">Unanswered</span>
              <span className="font-semibold text-slate-800">{unanswered}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-500" />
              Weak Areas
            </CardTitle>
            <CardDescription className="text-xs text-gray-500">
              Focus topics generated from your responses
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mockData.weakAreas && mockData.weakAreas.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {mockData.weakAreas.map((area: string) => (
                  <Badge key={area} className="bg-purple-50 text-purple-700 border border-purple-200">
                    {area}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-purple-200 bg-purple-50/50 p-4 text-sm text-purple-700">
                Outstanding work—no weak areas detected for this mock. Keep challenging yourself with a higher difficulty to stay sharp.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-slate-500" />
            Activity Timeline
          </CardTitle>
          <CardDescription className="text-xs text-gray-500">
            Quick snapshot of when this mock test was created and last updated
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 text-sm text-gray-600">
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-gray-500">Created</p>
            <p className="mt-1 font-medium text-gray-900">{formatDateTime(mockData.createdAt)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-gray-500">Last Updated</p>
            <p className="mt-1 font-medium text-gray-900">{formatDateTime(mockData.updatedAt ?? mockData.createdAt)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}