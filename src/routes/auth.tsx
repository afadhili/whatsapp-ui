import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Eye, EyeOff, Lock, Mail, MessageCircle, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import GoogleSvg from "../assets/google.svg";

export const Route = createFileRoute('/auth')({
  component: RouteComponent,
})

function PasswordInput({ id, placeholder }: { id: string; placeholder: string }) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative">
      <Lock className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
      <Input
        id={id}
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        className="pl-9 pr-10"
        autoComplete={id === 'login-password' ? 'current-password' : 'new-password'}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2"
        aria-label={show ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )
}

function RouteComponent() {
  return (
    <main className="bg-muted/40 relative min-h-screen">
      {/* Header hijau ala WhatsApp Web */}
      <div className="h-56 w-full bg-[#00a884]">
        <div className="container mx-auto flex items-center gap-2 px-6 pt-8 text-white">
          <MessageCircle className="size-7" />
          <span className="text-2xl font-bold uppercase tracking-wide">
            Whatsapp
          </span>
        </div>
      </div>

      <div className="container mx-auto -mt-32 flex justify-center px-4 pb-12">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="items-center text-center">
            <div className="mb-2 flex size-14 items-center justify-center rounded-full bg-[#00a884] text-white">
              <MessageCircle className="size-7" />
            </div>
            <CardTitle className="text-2xl">Selamat datang</CardTitle>
            <CardDescription>
              Masuk atau buat akun untuk mulai mengobrol dengan teman-temanmu.
            </CardDescription>
          </CardHeader>

          <Tabs defaultValue="login" className="w-full">
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Masuk</TabsTrigger>
                <TabsTrigger value="register">Daftar</TabsTrigger>
              </TabsList>
            </div>

            {/* LOGIN */}
            <TabsContent value="login">
              <form onSubmit={(e) => e.preventDefault()}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="nama@email.com"
                        className="pl-9"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">Kata sandi</Label>
                      <a
                        href="#"
                        className="text-xs font-medium text-[#00a884] hover:underline"
                      >
                        Lupa kata sandi?
                      </a>
                    </div>
                    <PasswordInput id="login-password" placeholder="••••••••" />
                  </div>
                </CardContent>

                <CardFooter className="flex-col gap-4 pt-2">
                  <Button
                    type="submit"
                    className="w-full bg-[#00a884] text-white hover:bg-[#008f6f]"
                  >
                    Masuk
                  </Button>

                  <div className="flex w-full items-center gap-3">
                    <Separator className="flex-1" />
                    <span className="text-muted-foreground text-xs">atau</span>
                    <Separator className="flex-1" />
                  </div>

                  <Button type="button" variant="outline" className="w-full font-semibold">
                    Lanjutkan dengan Google <img src={GoogleSvg} alt="Google Logo" width="18" />
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            {/* REGISTER */}
            <TabsContent value="register">
              <form onSubmit={(e) => e.preventDefault()}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nama</Label>
                    <div className="relative">
                      <User className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                      <Input
                        id="register-name"
                        placeholder="Nama lengkap"
                        className="pl-9"
                        autoComplete="name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="nama@email.com"
                        className="pl-9"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Kata sandi</Label>
                    <PasswordInput
                      id="register-password"
                      placeholder="Minimal 8 karakter"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm">Konfirmasi kata sandi</Label>
                    <PasswordInput
                      id="register-confirm"
                      placeholder="Ulangi kata sandi"
                    />
                  </div>
                </CardContent>

                <CardFooter className="flex-col gap-4 pt-2">
                  <Button
                    type="submit"
                    className="w-full bg-[#00a884] text-white hover:bg-[#008f6f]"
                  >
                    Buat akun
                  </Button>

                  <p className="text-muted-foreground text-center text-xs">
                    Dengan mendaftar, kamu menyetujui{' '}
                    <a href="#" className="text-[#00a884] hover:underline">
                      Ketentuan Layanan
                    </a>{' '}
                    dan{' '}
                    <a href="#" className="text-[#00a884] hover:underline">
                      Kebijakan Privasi
                    </a>
                    .
                  </p>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </main>
  )
}
