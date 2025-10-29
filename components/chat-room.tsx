"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft, Send, User, Settings } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Message {
  id: string
  room_id: string
  nickname: string
  content: string
  created_at: string
  type?: "message" | "nickname_change"
}

interface Room {
  id: string
  name: string
  created_at: string
}

interface ChatRoomProps {
  room: Room
  initialMessages: Message[]
}

export function ChatRoom({ room, initialMessages }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [nickname, setNickname] = useState("")
  const [hasSetNickname, setHasSetNickname] = useState(false)
  const [messageContent, setMessageContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newNickname, setNewNickname] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const savedNickname = localStorage.getItem("chat-nickname")
    if (savedNickname) {
      setNickname(savedNickname)
      setHasSetNickname(true)
    }
  }, [])

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`room:${room.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${room.id}`,
        },
        (payload) => {
          setMessages((current) => [...current, payload.new as Message])
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [room.id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSetNickname = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nickname.trim()) return

    localStorage.setItem("chat-nickname", nickname.trim())
    setHasSetNickname(true)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageContent.trim() || !hasSetNickname) return

    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("messages").insert({
        room_id: room.id,
        nickname: nickname,
        content: messageContent.trim(),
      })

      if (error) throw error

      setMessageContent("")
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangeNickname = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNickname.trim()) return

    const supabase = createClient()
    const oldNickname = nickname

    try {
      await supabase.from("messages").insert({
        room_id: room.id,
        nickname: oldNickname,
        content: `${oldNickname}が${newNickname.trim()}に名前を変更しました`,
        type: "nickname_change",
      })

      localStorage.setItem("chat-nickname", newNickname.trim())
      setNickname(newNickname.trim())
      setNewNickname("")
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error changing nickname:", error)
    }
  }

  if (!hasSetNickname) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <Card className="w-full max-w-md border-slate-200 bg-white shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{room.name}</h2>
                <p className="text-sm text-slate-500">ニックネームを入力してください</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSetNickname} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <User className="h-5 w-5 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="ニックネーム"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="border-0 bg-transparent p-0 focus-visible:ring-0"
                    autoFocus
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={!nickname.trim()}>
                チャットに参加
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-900">{room.name}</h1>
            <p className="text-sm text-slate-500">{nickname}として参加中</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Settings className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleChangeNickname}>
                <DialogHeader>
                  <DialogTitle>ニックネームを変更</DialogTitle>
                  <DialogDescription>
                    新しいニックネームを入力してください。変更後のメッセージから新しいニックネームが適用されます。
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nickname">現在のニックネーム</Label>
                    <Input id="current-nickname" value={nickname} disabled className="bg-slate-50" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-nickname">新しいニックネーム</Label>
                    <Input
                      id="new-nickname"
                      value={newNickname}
                      onChange={(e) => setNewNickname(e.target.value)}
                      placeholder="新しいニックネームを入力"
                      autoFocus
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    キャンセル
                  </Button>
                  <Button type="submit" disabled={!newNickname.trim()}>
                    変更
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <div className="space-y-4">
            {messages.map((message) => {
              if (message.type === "nickname_change") {
                return (
                  <div key={message.id} className="flex justify-center">
                    <div className="rounded-full bg-slate-200 px-4 py-1">
                      <p className="text-xs text-slate-600">{message.content}</p>
                    </div>
                  </div>
                )
              }

              const isOwnMessage = message.nickname === nickname
              return (
                <div key={message.id} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] space-y-1 ${isOwnMessage ? "items-end" : "items-start"}`}>
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-xs font-medium text-slate-600">{message.nickname}</span>
                      <span className="text-xs text-slate-400">
                        {new Date(message.created_at).toLocaleTimeString("ja-JP", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        isOwnMessage ? "bg-blue-500 text-white" : "bg-white text-slate-900 shadow-sm"
                      }`}
                    >
                      <p className="break-words text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 bg-white shadow-lg">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <Input
              type="text"
              placeholder="メッセージを入力..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !messageContent.trim()} size="icon" className="h-10 w-10">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
