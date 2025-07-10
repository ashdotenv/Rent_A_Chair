"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/redux/hooks"
import { selectIsAuthenticated } from "@/redux/features/auth/authSlice"

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  // Don't render children if user is authenticated
  if (isAuthenticated) {
    return null
  }

  return <>{children}</>
} 