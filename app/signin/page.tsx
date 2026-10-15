"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Lock, Mail, Sparkles } from "lucide-react"
import { authApi, setAuthToken } from "@/lib/api"

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function submit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError("")
    try {
      const response = await authApi.signIn({ email, password })
      const token = response.data?.data?.access_token ?? response.data?.access_token ?? response.data?.data?.token ?? response.data?.token
      if (!token) throw new Error("No access token returned")
      setAuthToken(token)
      router.replace("/")
    } catch {
      setError("Invalid credentials. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return <main className="flex min-h-screen items-center justify-center bg-[#f7f6f2] px-5 py-10 text-[#20221f]">
    <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-[#e5e3dc] bg-[#fbfaf7] shadow-xl shadow-black/5 md:grid-cols-2">
      <div className="p-8 md:p-11">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#20221f] text-[#e7cfa0]"><Sparkles size={19}/></div>
          <div>
            <p className="font-serif text-[21px] tracking-wide">Al Qasr</p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#8a8b84]">Admin studio</p>
          </div>
        </div>
        <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#ac8954]">Welcome back</p>
        <h1 className="font-serif text-3xl tracking-[-0.02em]">Sign in to your studio</h1>
        <p className="mt-2 text-sm text-[#85867f]">Manage your fragrance catalog, products and categories.</p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <label className="block text-xs font-medium">Email
            <span className="mt-2 flex items-center gap-2 rounded-xl border border-[#e2e0d8] bg-white px-3 focus-within:border-[#b28b58]">
              <Mail size={15} className="text-[#aaa9a2]"/>
              <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@alqasr.com" className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-[#aaa9a2]"/>
            </span>
          </label>
          <label className="block text-xs font-medium">Password
            <span className="mt-2 flex items-center gap-2 rounded-xl border border-[#e2e0d8] bg-white px-3 focus-within:border-[#b28b58]">
              <Lock size={15} className="text-[#aaa9a2]"/>
              <input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-[#aaa9a2]"/>
            </span>
          </label>
          {error && <p className="rounded-xl bg-[#f4e7e3] px-3 py-3 text-xs text-[#a56b6b]">{error}</p>}
          <button type="submit" disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#20221f] px-4 py-3 text-xs font-medium text-white shadow-lg shadow-black/10 transition hover:bg-[#363833] disabled:opacity-60">
            {saving && <Loader2 size={15} className="animate-spin"/>}
            {saving ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
      <div className="hidden flex-col justify-between bg-[#20221f] p-11 text-[#f3f0e9] md:flex">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#c7b899]">Atelier of fragrance</p>
        <div>
          <Sparkles className="mb-5 text-[#e7cfa0]" size={22}/>
          <p className="font-serif text-2xl leading-snug tracking-[-0.01em]">Every great house is built on a quiet craft.</p>
          <p className="mt-3 text-xs text-[#9a9b94]">Curate perfumes, attars and gift collections from a single studio.</p>
        </div>
        <p className="text-[10px] uppercase tracking-[0.22em] text-[#6f7169]">Al Qasr — Admin Studio</p>
      </div>
    </div>
  </main>
}
