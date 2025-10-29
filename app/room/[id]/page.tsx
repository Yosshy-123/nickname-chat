import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ChatRoom } from "@/components/chat-room"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function RoomPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: room } = await supabase.from("rooms").select("*").eq("id", id).single()

  if (!room) {
    notFound()
  }

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("room_id", id)
    .order("created_at", { ascending: true })

  return <ChatRoom room={room} initialMessages={messages || []} />
}
