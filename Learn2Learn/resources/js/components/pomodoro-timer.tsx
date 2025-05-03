"use client"

import { useState, useEffect } from "react"
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function PomodoroTimer() {
  const [mode, setMode] = useState<"focus" | "shortBreak" | "longBreak">("focus")
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)

 
  useEffect(() => {
    if (mode === "focus") {
      setTimeLeft(25 * 60)
    } else if (mode === "shortBreak") {
      setTimeLeft(5 * 60)
    } else if (mode === "longBreak") {
      setTimeLeft(15 * 60)
    }
    setIsRunning(false)
  }, [mode])


  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false)
      if (mode === "focus") {
        setCompletedPomodoros(completedPomodoros + 1)
        if (completedPomodoros % 4 === 3) {
          setMode("longBreak")
        } else {
          setMode("shortBreak")
        }
      } else {
        setMode("focus")
      }
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft, mode, completedPomodoros, soundEnabled])

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    if (mode === "focus") {
      setTimeLeft(25 * 60)
    } else if (mode === "shortBreak") {
      setTimeLeft(5 * 60)
    } else if (mode === "longBreak") {
      setTimeLeft(15 * 60)
    }
    setIsRunning(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const calculateProgress = () => {
    let totalTime
    if (mode === "focus") {
      totalTime = 25 * 60
    } else if (mode === "shortBreak") {
      totalTime = 5 * 60
    } else {
      totalTime = 15 * 60
    }
    return ((totalTime - timeLeft) / totalTime) * 100
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="focus" value={mode} onValueChange={(value) => setMode(value as any)}>
        <TabsList className="grid w-full grid-cols-3 bg-secondary">
          <TabsTrigger
            value="focus"
            className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
          >
            Focus
          </TabsTrigger>
          <TabsTrigger
            value="shortBreak"
            className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
          >
            Short Break
          </TabsTrigger>
          <TabsTrigger
            value="longBreak"
            className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
          >
            Long Break
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col items-center justify-center py-4">
        <div className="relative flex items-center justify-center">
          <svg className="w-32 h-32">
            <circle
              className="text-secondary stroke-current"
              strokeWidth="4"
              stroke="currentColor"
              fill="transparent"
              r="58"
              cx="64"
              cy="64"
            />
            <circle
              className="text-accent stroke-current"
              strokeWidth="4"
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="58"
              cx="64"
              cy="64"
              strokeDasharray="364.4"
              strokeDashoffset={364.4 - (364.4 * calculateProgress()) / 100}
              transform="rotate(-90 64 64)"
            />
          </svg>
          <span className="absolute text-3xl font-bold">{formatTime(timeLeft)}</span>
        </div>

        <div className="flex items-center justify-center gap-4 mt-6">
          <Button
            variant="outline"
            size="icon"
            onClick={resetTimer}
            disabled={isRunning && timeLeft === (mode === "focus" ? 25 * 60 : mode === "shortBreak" ? 5 * 60 : 15 * 60)}
            className="border-accent"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="sr-only">Reset</span>
          </Button>
          <Button size="lg" onClick={toggleTimer} className="w-24 bg-accent hover:bg-accent/80 text-accent-foreground">
            {isRunning ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Start
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch id="sound-mode" checked={soundEnabled} onCheckedChange={setSoundEnabled} />
          <Label htmlFor="sound-mode" className="flex items-center gap-1">
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            Sound
          </Label>
        </div>
        <div className="text-sm text-muted-foreground">
          Completed: <span className="font-medium">{completedPomodoros}</span>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        <p>
          The Pomodoro Technique suggests working for 25 minutes, then taking a 5-minute break. After 4 pomodoros, take
          a longer 15-minute break.
        </p>
      </div>
    </div>
  )
}
