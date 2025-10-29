import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquareOff } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md border-slate-200 bg-white shadow-lg">
        <CardContent className="py-12 text-center">
          <MessageSquareOff className="mx-auto mb-4 h-16 w-16 text-slate-300" />
          <h2 className="mb-2 text-2xl font-bold text-slate-900">ルームが見つかりません</h2>
          <p className="mb-6 text-slate-600">このルームは存在しないか、削除された可能性があります。</p>
          <Link href="/">
            <Button>ホームに戻る</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
