"use client"

import { useState, useEffect } from "react"
import { router, usePage, Head } from "@inertiajs/react"
import type { SharedData } from "@/types"
import {
  FileText,
  Plus,
  Search,
  ChevronDown,
  FolderTree,
  Hash,
  Clock,
  BookMarked,
  ListTodo,
  Lightbulb,
  LayoutGrid,
  X,
  Menu,
  Save,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PomodoroTimer } from "@/components/pomodoro-timer"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Navbar } from "@/components/navbar"

// Learning methods data
const learningMethods = [
  {
    id: 1,
    title: "Pomodoro Technique",
    description: "Work for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer break.",
    icon: Clock,
    color: "text-accent",
  },
  {
    id: 2,
    title: "Spaced Repetition",
    description: "Review information at increasing intervals to improve long-term retention.",
    icon: ListTodo,
    color: "text-accent",
  },
  {
    id: 3,
    title: "Feynman Technique",
    description: "Explain a concept in simple terms to identify gaps in your understanding.",
    icon: BookMarked,
    color: "text-accent",
  },
  {
    id: 4,
    title: "Active Recall",
    description: "Test yourself on material instead of passively reviewing it.",
    icon: Lightbulb,
    color: "text-accent",
  },
  {
    id: 5,
    title: "Mind Mapping",
    description: "Create visual diagrams to connect related concepts and ideas.",
    icon: LayoutGrid,
    color: "text-accent",
  },
  {
    id: 6,
    title: "Cornell Method",
    description: "Divide your page into sections for notes, cues, and summary.",
    icon: FileText,
    color: "text-accent",
  },
]

// Sample folders and notes data
const sampleFolders = [
  {
    id: 1,
    name: "School",
    notes: [
      {
        id: 101,
        title: "Biology Chapter 1",
        content: "Cell structure and function. The cell is the basic unit of life...",
        method: 6, // Cornell Method
        updatedAt: "2 days ago",
        tags: ["Biology", "Science"],
      },
      {
        id: 102,
        title: "Physics: Laws of Motion",
        content: "Newton's three laws of motion and their applications in everyday life...",
        method: 5, // Mind Mapping
        updatedAt: "3 days ago",
        tags: ["Physics", "Science"],
      },
    ],
  },
  {
    id: 2,
    name: "Work",
    notes: [
      {
        id: 201,
        title: "Project Planning",
        content: "Steps for the new project implementation...",
        method: 1, // Pomodoro
        updatedAt: "1 day ago",
        tags: ["Project", "Planning"],
      },
    ],
  },
  {
    id: 3,
    name: "Personal",
    notes: [
      {
        id: 301,
        title: "Book Notes: Atomic Habits",
        content: "Key takeaways from the book Atomic Habits by James Clear...",
        method: 3, // Feynman
        updatedAt: "5 days ago",
        tags: ["Books", "Self-improvement"],
      },
      {
        id: 302,
        title: "Workout Plan",
        content: "Weekly workout schedule and exercises...",
        method: 0, // No specific method
        updatedAt: "1 week ago",
        tags: ["Health", "Fitness"],
      },
    ],
  },
]

// Flatten notes for easier access
const allNotes = sampleFolders.flatMap((folder) =>
  folder.notes.map((note) => ({
    ...note,
    folder: folder.name,
  })),
)

export default function NotepadPage() {
  const { url, props } = usePage()
  const params = new URLSearchParams(url.split('?')[1])
  const methodParam = params.get('method')
  const methodIdNumber = methodParam ? parseInt(methodParam, 10) : 0

  const [activeNote, setActiveNote] = useState<number | null>(null)
  const [noteTitle, setNoteTitle] = useState("")
  const [noteContent, setNoteContent] = useState("")
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [showFileExplorer, setShowFileExplorer] = useState(true)
  const [showMethodPanel, setShowMethodPanel] = useState(methodIdNumber > 0)
  const [expandedFolders, setExpandedFolders] = useState<number[]>([1, 2, 3]) // All folders expanded by default
  const [isSaving, setIsSaving] = useState(false)

  const selectedMethod = methodIdNumber > 0 ? learningMethods.find((m) => m.id === methodIdNumber) : null

  useEffect(() => {
    // When method changes via URL param, update the UI
    if (methodIdNumber > 0) {
      setShowMethodPanel(true)
    }
  }, [methodIdNumber])

  const handleSelectNote = (noteId: number) => {
    const note = allNotes.find((n) => n.id === noteId)
    if (note) {
      setActiveNote(noteId)
      setNoteTitle(note.title)
      setNoteContent(note.content)
      setIsCreatingNew(false)

      // If note has a method and it's different from current, update URL
      if (note.method > 0 && note.method !== methodIdNumber) {
        router.visit(`/notepad?method=${note.method}`, { preserveState: true })
      } else if (note.method === 0 && methodIdNumber > 0) {
        // If note has no method but URL has one, remove method from URL
        router.visit('/notepad', { preserveState: true })
      }
    }
  }

  const handleNewNote = () => {
    setActiveNote(null)
    setNoteTitle("")
    setNoteContent("")
    setIsCreatingNew(true)
  }

  const toggleFolder = (folderId: number) => {
    setExpandedFolders((prev) => (prev.includes(folderId) ? prev.filter((id) => id !== folderId) : [...prev, folderId]))
  }

  const toggleFileExplorer = () => {
    setShowFileExplorer(!showFileExplorer)
  }

  const toggleMethodPanel = () => {
    setShowMethodPanel(!showMethodPanel)
  }

  const handleChangeMethod = (newMethodId: number) => {
    if (newMethodId === 0) {
      router.visit('/notepad', { preserveState: true })
    } else {
      router.visit(`/notepad?method=${newMethodId}`, { preserveState: true })
    }
  }

  const handleSaveNote = () => {
    if (!noteTitle.trim()) return
    setIsSaving(true)

    const noteData = {
      title: noteTitle,
      content: noteContent,
      learning_technic_id: methodIdNumber || null,
    }

    if (isCreatingNew) {
      router.post('/api/notes', noteData, {
        preserveState: true,
        onSuccess: (page) => {
          setIsSaving(false)
          setIsCreatingNew(false)
        },
        onError: () => {
          setIsSaving(false)
        }
      })
    } else if (activeNote) {
      router.put(`/api/notes/${activeNote}`, noteData, {
        preserveState: true,
        onSuccess: () => {
          setIsSaving(false)
        },
        onError: () => {
          setIsSaving(false)
        }
      })
    }
  }

  const renderMethodComponent = () => {
    if (!methodIdNumber) return null

    switch (methodIdNumber) {
      case 1: // Pomodoro
        return <PomodoroTimer />
      case 2: // Spaced Repetition
        return (
          <div className="p-4 bg-card rounded-md">
            <h3 className="font-medium mb-3">Spaced Repetition Schedule</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-secondary rounded-md">
                <span>First review</span>
                <Badge className="bg-accent hover:bg-accent/80 text-accent-foreground">Today</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-secondary rounded-md">
                <span>Second review</span>
                <Badge className="bg-accent hover:bg-accent/80 text-accent-foreground">Tomorrow</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-secondary rounded-md">
                <span>Third review</span>
                <Badge className="bg-accent hover:bg-accent/80 text-accent-foreground">3 days later</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-secondary rounded-md">
                <span>Fourth review</span>
                <Badge className="bg-accent hover:bg-accent/80 text-accent-foreground">1 week later</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-secondary rounded-md">
                <span>Fifth review</span>
                <Badge className="bg-accent hover:bg-accent/80 text-accent-foreground">2 weeks later</Badge>
              </div>
            </div>
            <Button className="w-full mt-4 bg-accent hover:bg-accent/80 text-accent-foreground">
              Mark as Reviewed
            </Button>
          </div>
        )
      // Add other method components as needed
      default:
        return (
          <div className="p-4 bg-card rounded-md">
            <h3 className="font-medium mb-2">{selectedMethod?.title}</h3>
            <p className="text-sm">{selectedMethod?.description}</p>
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top navbar */}
      <Navbar />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* File explorer sidebar */}
        {showFileExplorer && (
          <div className="w-64 border-r bg-card flex flex-col">
            <div className="flex items-center justify-between p-2 border-b">
              <span className="font-medium text-sm">Files</span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Search className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleNewNote}>
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2">
                {sampleFolders.map((folder) => (
                  <div key={folder.id} className="mb-1">
                    <div
                      className="flex items-center gap-1 p-1 rounded hover:bg-secondary cursor-pointer"
                      onClick={() => toggleFolder(folder.id)}
                    >
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform ${expandedFolders.includes(folder.id) ? "" : "-rotate-90"}`}
                      />
                      <FolderTree className="h-3.5 w-3.5 text-accent" />
                      <span className="text-sm">{folder.name}</span>
                    </div>

                    {expandedFolders.includes(folder.id) && (
                      <div className="ml-4 mt-1 space-y-1">
                        {folder.notes.map((note) => (
                          <div
                            key={note.id}
                            className={`flex items-center gap-1 p-1 rounded cursor-pointer ${activeNote === note.id ? "bg-secondary" : "hover:bg-secondary/50"}`}
                            onClick={() => handleSelectNote(note.id)}
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span className="text-sm truncate">{note.title}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
        {/* Main editor area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor toolbar */}
          <div className="flex items-center justify-between p-2 border-b bg-card">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleFileExplorer}>
                <Menu className="h-4 w-4" />
              </Button>
              <Input
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Untitled"
                className="h-7 w-48 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-1 font-medium"
              />
              <div className="flex items-center gap-1">
                <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">No tags</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleMethodPanel}>
                      {selectedMethod ? <selectedMethod.icon className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{showMethodPanel ? "Hide method panel" : "Show method panel"}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 gap-1">
                    {selectedMethod ? selectedMethod.title : "No Method"}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleChangeMethod(0)}>No Method</DropdownMenuItem>
                  {learningMethods.map((method) => (
                    <DropdownMenuItem key={method.id} onClick={() => handleChangeMethod(method.id)}>
                      <method.icon className="mr-2 h-4 w-4" />
                      <span>{method.title}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7"
                onClick={handleSaveNote}
                disabled={isSaving}
              >
                <Save className={`h-4 w-4 ${isSaving ? "animate-pulse" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {/* Content area with optional method panel */}
          <div className="flex-1 flex overflow-hidden">
            {/* Note editor */}
            <div className="flex-1 overflow-auto">
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Start writing..."
                className="w-full h-full p-4 bg-background resize-none focus:outline-none"
              />
            </div>
            {/* Method panel */}
            {showMethodPanel && (
              <div className="w-80 border-l bg-card flex flex-col">
                <div className="flex items-center justify-between p-2 border-b">
                  <span className="font-medium text-sm">
                    {selectedMethod ? selectedMethod.title : "Learning Method"}
                  </span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={toggleMethodPanel}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="flex-1 overflow-auto p-2">{renderMethodComponent()}</div>
              </div>
            )}
          </div>
          {/* Status bar */}
          <div className="flex items-center justify-between px-3 py-1 text-xs text-muted-foreground border-t bg-secondary">
            <div>
              {activeNote
                ? "Last edited: " + allNotes.find((n) => n.id === activeNote)?.updatedAt
                : isCreatingNew
                  ? "New note"
                  : "No note selected"}
            </div>
            <div>{noteContent.split(/\s+/).filter(Boolean).length} words</div>
          </div>
        </div>
      </div>
    </div>
  )
}