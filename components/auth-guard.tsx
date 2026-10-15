"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { getAuthToken } from "@/lib/api"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const isAuthRoute = pathname === "/signin"
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const token = getAuthToken()
    if (isAuthRoute) {
      if (token) router.replace("/")
      else setReady(true)
      return
    }
    if (!token) {
      router.replace("/signin")
      return
    }
    setReady(true)
  }, [isAuthRoute, pathname, router])

  if (!ready && !isAuthRoute) return null
  return <>{children}</>
}
