"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { NumberTicker } from "@/components/ui/number-ticker"

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Auto dismiss after 2.5s
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  // Don't render on server
  if (!isMounted) return null

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-xl"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Brand Logo Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-6"
          >
            {/* Logo */}
            <motion.img
              src="/main_logo.png"
              alt="7Nhân"
              className="h-20 md:h-28 w-auto object-contain"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            />

            {/* Percentage Counter */}
            <div className="flex items-baseline gap-1">
              <NumberTicker
                value={100}
                startValue={0}
                delay={0.2}
                className="text-6xl md:text-8xl font-bold tracking-tighter text-foreground"
              />
              <span className="text-2xl md:text-4xl font-bold text-muted-foreground">%</span>
            </div>

            {/* Loading text */}
            <motion.p
              className="text-sm md:text-base text-muted-foreground tracking-widest uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Đợt tí...
            </motion.p>

            {/* Loading bar */}
            <div className="w-48 md:w-64 h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.2, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
