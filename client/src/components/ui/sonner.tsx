"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "white",
          "--normal-text": "black",
          "--normal-border": "#e5e7eb",
          "--success-bg": "white",
          "--success-text": "black",
          "--success-border": "#10b981",
          "--error-bg": "white",
          "--error-text": "black",
          "--error-border": "#ef4444",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-white group-[.toaster]:text-black group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg",
          success: "group-[.toaster]:border-green-500 group-[.toaster]:text-green-700",
          error: "group-[.toaster]:border-red-500 group-[.toaster]:text-red-700",
          description: "group-[.toaster]:text-gray-600",
          actionButton: "group-[.toaster]:bg-primary group-[.toaster]:text-primary-foreground",
          cancelButton: "group-[.toaster]:bg-muted group-[.toaster]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
