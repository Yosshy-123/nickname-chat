import { createClient } from "@/lib/supabase/server"
import { RoomList } from "@/components/room-list"
import { CreateRoomForm } from "@/components/create-room-form"

export default async function HomePage() {
  const supabase = await createClient()

  const { data: rooms } = await supabase.from("rooms").select("*").order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-slate-900">チャットルーム</h1>
          <p className="text-lg text-slate-600">ルームを選んで会話を始めましょう</p>
        </div>

        <div className="mb-8">
          <CreateRoomForm />
        </div>

        <RoomList rooms={rooms || []} />
      </div>
    </div>
  )
}
