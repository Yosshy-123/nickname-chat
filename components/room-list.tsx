"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Users } from "lucide-react"

interface Room {
  id: string
  name: string
  created_at: string
}

interface RoomListProps {
  rooms: Room[]
}

export function RoomList({ rooms }: RoomListProps) {
  if (rooms.length === 0) {
    return (
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardContent className="py-12 text-center">
          <MessageSquare className="mx-auto mb-4 h-12 w-12 text-slate-300" />
          <p className="text-slate-500">まだルームがありません。最初のルームを作成しましょう！</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {rooms.map((room) => (
        <Link key={room.id} href={`/room/${room.id}`}>
          <Card className="group cursor-pointer border-slate-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-slate-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {room.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Users className="h-4 w-4" />
                    <span>参加する</span>
                  </div>
                </div>
                <MessageSquare className="h-5 w-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
