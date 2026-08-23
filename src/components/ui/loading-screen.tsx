"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { NumberTicker } from "@/components/ui/number-ticker"

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    // Luôn hiển thị loading screen khi tải lại trang (F5)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1800)

    return () => clearTimeout(timer)
  }, [])

  if (!isMounted || !isLoading) return null

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/98 backdrop-blur-2xl"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Brand Logo & Presentation Area */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-5 px-4 text-center"
          >
            {/* Logo */}
            <div className="relative">
              <motion.img
                src="/main_logo.png"
                alt="AFTER HOURS"
                className="h-20 sm:h-24 md:h-28 w-auto object-contain drop-shadow-lg"
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              />
              <div className="absolute -inset-4 bg-primary/10 rounded-full blur-xl -z-10" />
            </div>

            {/* Brand Title */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-1"
            >
              <h2 className="text-xl sm:text-2xl font-bold tracking-widest text-foreground font-display">
                AFTER HOURS
              </h2>
              <p className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-primary font-medium">
                Modern Dining • Investor Portal
              </p>
            </motion.div>

            {/* Percentage Counter */}
            <div className="flex items-baseline gap-1 mt-1">
              <NumberTicker
                value={100}
                startValue={0}
                delay={0.1}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter text-foreground"
              />
              <span className="text-xl sm:text-2xl font-bold text-primary">%</span>
            </div>

            {/* Loading text */}
            <motion.p
              className="text-xs text-muted-foreground tracking-wider uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              Đang tải dữ liệu...
            </motion.p>

            {/* Loading bar */}
            <div className="w-48 sm:w-56 h-1 bg-muted rounded-full overflow-hidden mt-1">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
