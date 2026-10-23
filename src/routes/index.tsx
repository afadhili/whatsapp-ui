import { useEffect, useMemo, useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowLeft,
  CheckCheck,
  Lock,
  MessageCircle,
  MoreVertical,
  Paperclip,
  Search,
  Send,
  Smile,
} from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '#/components/theme-toggle'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

type Message = {
  id: number
  text: string
  time: string
  fromMe: boolean
}

type Chat = {
  id: number
  name: string
  status: string
  lastMessage: string
  time: string
  unread: number
  messages: Message[]
}

const initialChats: Chat[] = [
  {
    id: 1,
    name: 'Rizky Pratama',
    status: 'online',
    lastMessage: 'Oke, nanti malam kita kerjain bareng ya',
    time: '18:25',
    unread: 2,
    messages: [
      {
        id: 1,
        text: 'Bro, tugas jaringan udah sampai mana?',
        time: '18:10',
        fromMe: false,
      },
      {
        id: 2,
        text: 'Baru selesai bagian konfigurasi VLAN',
        time: '18:12',
        fromMe: true,
      },
      {
        id: 3,
        text: 'Lanjut ke routing-nya masih bingung',
        time: '18:12',
        fromMe: true,
      },
      {
        id: 4,
        text: 'Sama, aku juga masih stuck di situ',
        time: '18:20',
        fromMe: false,
      },
      {
        id: 5,
        text: 'Oke, nanti malam kita kerjain bareng ya',
        time: '18:25',
        fromMe: false,
      },
    ],
  },
  {
    id: 2,
    name: 'Kelompok AI 2024',
    status: 'Dina, Fajar, Salsa, Kamu',
    lastMessage: 'Dina: Slide sudah aku upload di drive',
    time: '17:48',
    unread: 5,
    messages: [
      {
        id: 1,
        text: 'Presentasinya hari Senin jam berapa?',
        time: '17:30',
        fromMe: true,
      },
      {
        id: 2,
        text: 'Jam 10 pagi kalau tidak salah',
        time: '17:41',
        fromMe: false,
      },
      {
        id: 3,
        text: 'Slide sudah aku upload di drive',
        time: '17:48',
        fromMe: false,
      },
    ],
  },
  {
    id: 3,
    name: 'Mama',
    status: 'terakhir dilihat hari ini 16.02',
    lastMessage: 'Jangan lupa makan ya, nak',
    time: '16:02',
    unread: 0,
    messages: [
      {
        id: 1,
        text: 'Assalamualaikum, lagi di kampus?',
        time: '15:58',
        fromMe: false,
      },
      {
        id: 2,
        text: 'Waalaikumsalam Ma, iya baru selesai kelas',
        time: '16:00',
        fromMe: true,
      },
      {
        id: 3,
        text: 'Jangan lupa makan ya, nak',
        time: '16:02',
        fromMe: false,
      },
    ],
  },
  {
    id: 4,
    name: 'Aulia',
    status: 'online',
    lastMessage: 'Makasih ya catatannya!',
    time: 'Kemarin',
    unread: 0,
    messages: [
      {
        id: 1,
        text: 'Catatan keamanan jaringan minggu lalu ada?',
        time: '20:10',
        fromMe: false,
      },
      {
        id: 2,
        text: 'Ada, aku kirim PDF-nya sebentar lagi',
        time: '20:15',
        fromMe: true,
      },
      { id: 3, text: 'Makasih ya catatannya!', time: '20:21', fromMe: false },
    ],
  },
  {
    id: 5,
    name: 'Komunitas Linux Surabaya',
    status: 'Andi, Budi, Citra, +120 lainnya',
    lastMessage: 'Budi: Ada yang pakai Hyprland di sini?',
    time: 'Kemarin',
    unread: 12,
    messages: [
      {
        id: 1,
        text: 'Ada yang pakai Hyprland di sini?',
        time: '21:05',
        fromMe: false,
      },
      {
        id: 2,
        text: 'Aku pakai, dotfiles-nya bisa dilihat di repo',
        time: '21:09',
        fromMe: true,
      },
    ],
  },
  {
    id: 6,
    name: 'Fajar Nugroho',
    status: 'terakhir dilihat kemarin 22.40',
    lastMessage: 'Sip, besok aku kabarin lagi',
    time: 'Selasa',
    unread: 0,
    messages: [
      { id: 1, text: 'Jadi mabar malam ini?', time: '19:00', fromMe: true },
      {
        id: 2,
        text: 'Sip, besok aku kabarin lagi',
        time: '19:30',
        fromMe: false,
      },
    ],
  },
]

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function nowTime() {
  return new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function RouteComponent() {
  const [chats, setChats] = useState<Chat[]>(initialChats)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const selected = chats.find((c) => c.id === selectedId) ?? null

  const filtered = useMemo(
    () =>
      chats.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())),
    [chats, query],
  )

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedId, selected?.messages.length])

  function openChat(id: number) {
    setSelectedId(id)
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)))
  }

  function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    const text = draft.trim()
    if (!text || !selected) return

    setChats((prev) =>
      prev.map((c) =>
        c.id === selected.id
          ? {
              ...c,
              lastMessage: text,
              time: nowTime(),
              messages: [
                ...c.messages,
                {
                  id: c.messages.length + 1,
                  text,
                  time: nowTime(),
                  fromMe: true,
                },
              ],
            }
          : c,
      ),
    )
    setDraft('')
  }

  return (
    <main className="bg-background flex h-screen w-full overflow-hidden">
      <aside
        className={cn(
          'flex w-full flex-col border-r md:w-[380px] md:min-w-[380px]',
          selected ? 'hidden md:flex' : 'flex',
        )}
      >
        <header className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-[#00a884]">WhatsApp</h1>
          <div className="flex gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" aria-label="Menu">
              <MoreVertical className="size-5" />
            </Button>
          </div>
        </header>

        <div className="px-3 pb-3">
          <div className="relative">
            <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari atau mulai chat baru"
              className="bg-muted/60 border-0 pl-9"
            />
          </div>
        </div>

        <Separator />

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 && (
            <p className="text-muted-foreground p-6 text-center text-sm">
              Tidak ada chat yang cocok.
            </p>
          )}
          {filtered.map((chat) => (
            <button
              key={chat.id}
              onClick={() => openChat(chat.id)}
              className={cn(
                'hover:bg-muted/60 flex w-full items-center gap-3 px-4 py-3 text-left transition-colors',
                chat.id === selectedId && 'bg-muted',
              )}
            >
              <Avatar className="size-12">
                <AvatarFallback className="bg-[#00a884]/15 font-medium text-[#00a884]">
                  {initials(chat.name)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1 border-b pb-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-medium">{chat.name}</span>
                  <span
                    className={cn(
                      'shrink-0 text-xs',
                      chat.unread > 0
                        ? 'font-medium text-[#00a884]'
                        : 'text-muted-foreground',
                    )}
                  >
                    {chat.time}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground truncate text-sm">
                    {chat.lastMessage}
                  </span>
                  {chat.unread > 0 && (
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#00a884] text-xs font-medium text-white">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      <section
        className={cn(
          'min-w-0 flex-1 flex-col',
          selected ? 'flex' : 'hidden md:flex',
        )}
      >
        {!selected ? (
          <div className="bg-muted/40 flex flex-1 flex-col items-center justify-center gap-4 border-b-4 border-[#00a884] px-8 text-center">
            <div className="flex size-24 items-center justify-center rounded-full bg-[#00a884]/15 text-[#00a884]">
              <MessageCircle className="size-12" />
            </div>
            <h2 className="text-3xl font-light">WhatsApp Web</h2>
            <p className="text-muted-foreground max-w-md text-sm">
              Kirim dan terima pesan tanpa perlu menyalakan ponsel. Pilih salah
              satu chat di sebelah kiri untuk mulai mengobrol.
            </p>
            <p className="text-muted-foreground mt-6 flex items-center gap-1.5 text-xs">
              <Lock className="size-3" />
              Pesan pribadi kamu terenkripsi secara end-to-end
            </p>
          </div>
        ) : (
          <>
            <header className="bg-muted/40 flex items-center gap-3 border-b px-4 py-2.5">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setSelectedId(null)}
                aria-label="Kembali"
              >
                <ArrowLeft className="size-5" />
              </Button>
              <Avatar className="size-10">
                <AvatarFallback className="bg-[#00a884]/15 font-medium text-[#00a884]">
                  {initials(selected.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium leading-tight">
                  {selected.name}
                </p>
                <p className="text-muted-foreground truncate text-xs">
                  {selected.status}
                </p>
              </div>
              <Button variant="ghost" size="icon" aria-label="Cari di chat">
                <Search className="size-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Menu">
                <MoreVertical className="size-5" />
              </Button>
            </header>

            <div className="flex-1 space-y-1.5 overflow-y-auto bg-[#efeae2] px-4 py-4 md:px-16 dark:bg-[#0b141a]">
              <div className="mb-3 flex justify-center">
                <span className="rounded-md bg-white/90 px-3 py-1 text-xs text-neutral-600 shadow-sm dark:bg-[#182229] dark:text-neutral-400">
                  Hari ini
                </span>
              </div>

              {selected.messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    'flex',
                    m.fromMe ? 'justify-end' : 'justify-start',
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[80%] rounded-lg px-3 py-1.5 text-sm shadow-sm md:max-w-[60%]',
                      m.fromMe
                        ? 'rounded-tr-none bg-[#d9fdd3] text-neutral-900 dark:bg-[#005c4b] dark:text-white'
                        : 'rounded-tl-none bg-white text-neutral-900 dark:bg-[#202c33] dark:text-white',
                    )}
                  >
                    <span>{m.text}</span>
                    <span className="float-right ml-3 mt-1.5 flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                      {m.time}
                      {m.fromMe && (
                        <CheckCheck className="size-3.5 text-sky-500" />
                      )}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <form
              onSubmit={sendMessage}
              className="bg-muted/40 flex items-center gap-2 border-t px-3 py-2.5"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Emoji"
              >
                <Smile className="size-5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Lampirkan"
              >
                <Paperclip className="size-5" />
              </Button>
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ketik pesan"
                className="bg-background flex-1"
              />
              <Button
                type="submit"
                size="icon"
                className="bg-[#00a884] text-white hover:bg-[#008f6f]"
                aria-label="Kirim"
              >
                <Send className="size-5" />
              </Button>
            </form>
          </>
        )}
      </section>
    </main>
  )
}
