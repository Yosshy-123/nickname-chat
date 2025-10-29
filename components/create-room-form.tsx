"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus } from "lucide-react"

export function CreateRoomForm() {
  const [roomName, setRoomName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!roomName.trim()) return

    setIsLoading(true)
    const supabase = createClient()

    try {
      const { data, error } = await supabase.from("rooms").insert({ name: roomName.trim() }).select().single()

      if (error) throw error

      setRoomName("")
      router.refresh()

      // Navigate to the new room
      if (data) {
        router.push(`/room/${data.id}`)
      }
    } catch (error) {
      console.error("Error creating room:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Input
            type="text"
            placeholder="新しいルーム名を入力..."
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !roomName.trim()}>
            <Plus className="mr-2 h-4 w-4" />
            作成
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
