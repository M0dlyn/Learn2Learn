import { useState, useEffect } from "react";
import {
  FileText, Plus, Search, ChevronDown, FolderTree, Hash, Clock, BookMarked, ListTodo, Lightbulb, LayoutGrid, X, Menu, Save, MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PomodoroTimer } from "@/components/pomodoro-timer";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Navbar } from "@/components/navbar";

const technicIcons = {
  1: Clock,
  2: ListTodo,
  3: BookMarked,
  4: Lightbulb,
  5: LayoutGrid,
  6: FileText,
};

export default function NotepadPage() {
  const [learningMethods, setLearningMethods] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNote, setActiveNote] = useState(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [showFileExplorer, setShowFileExplorer] = useState(true);
  const [showMethodPanel, setShowMethodPanel] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [methodIdNumber, setMethodIdNumber] = useState(0);

  // Fetch learning methods and notes from API
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/learning-technics').then(res => res.json()),
      fetch('/api/notes').then(res => res.json())
    ]).then(([methodsRes, notesRes]) => {
      setLearningMethods(methodsRes.data || []);
      setNotes(notesRes.data || []);
      // If you want to group by folder, extract unique folder names
      const folders = Array.from(new Set((notesRes.data || []).map(n => n.folder || "Uncategorized")));
      setExpandedFolders(folders);
    }).finally(() => setLoading(false));
  }, []);

  // Group notes by folder
  const folders = Array.from(new Set(notes.map(n => n.folder || "Uncategorized")));
  const notesByFolder = folders.map(folder => ({
    name: folder,
    notes: notes.filter(n => (n.folder || "Uncategorized") === folder)
  }));

  const selectedMethod = methodIdNumber > 0 ? learningMethods.find((m) => m.id === methodIdNumber) : null;

  const handleSelectNote = (noteId) => {
    const note = notes.find((n) => n.id === noteId);
    if (note) {
      setActiveNote(noteId);
      setNoteTitle(note.title);
      setNoteContent(note.content);
      setIsCreatingNew(false);
      if (note.learning_technic_id > 0 && note.learning_technic_id !== methodIdNumber) {
        setMethodIdNumber(note.learning_technic_id);
        setShowMethodPanel(true);
      } else if ((!note.learning_technic_id || note.learning_technic_id === 0) && methodIdNumber > 0) {
        setMethodIdNumber(0);
        setShowMethodPanel(false);
      }
    }
  };

  const handleNewNote = () => {
    setActiveNote(null);
    setNoteTitle("");
    setNoteContent("");
    setIsCreatingNew(true);
  };

  const toggleFolder = (folderName) => {
    setExpandedFolders((prev) =>
      prev.includes(folderName) ? prev.filter((f) => f !== folderName) : [...prev, folderName]
    );
  };

  const toggleFileExplorer = () => setShowFileExplorer(!showFileExplorer);
  const toggleMethodPanel = () => setShowMethodPanel(!showMethodPanel);

  const handleChangeMethod = (newMethodId) => {
    setMethodIdNumber(newMethodId);
    setShowMethodPanel(newMethodId > 0);
  };

  const handleSaveNote = () => {
    if (!noteTitle.trim()) return;
    setIsSaving(true);
    const noteData = {
      title: noteTitle,
      content: noteContent,
      learning_technic_id: methodIdNumber || null,
    };
    if (isCreatingNew) {
      fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData)
      })
        .then(res => res.json())
        .then((newNote) => {
          setNotes([newNote, ...notes]);
          setIsSaving(false);
          setIsCreatingNew(false);
        })
        .catch(() => setIsSaving(false));
    } else if (activeNote) {
      fetch(`/api/notes/${activeNote}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData)
      })
        .then(res => res.json())
        .then((updatedNote) => {
          setNotes(notes.map(n => n.id === activeNote ? updatedNote : n));
          setIsSaving(false);
        })
        .catch(() => setIsSaving(false));
    }
  };

  const renderMethodComponent = () => {
    if (!methodIdNumber) return null;
    const Icon = technicIcons[methodIdNumber] || Clock;
    switch (methodIdNumber) {
      case 1:
        return <PomodoroTimer />;
      default:
        return (
          <div className="p-4 bg-card rounded-md">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Icon className="h-5 w-5" />
              {selectedMethod?.name}
            </h3>
            <p className="text-sm">{selectedMethod?.detailed_desc || selectedMethod?.short_desc}</p>
          </div>
        );
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
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
                {notesByFolder.map((folder) => (
                  <div key={folder.name} className="mb-1">
                    <div
                      className="flex items-center gap-1 p-1 rounded hover:bg-secondary cursor-pointer"
                      onClick={() => toggleFolder(folder.name)}
                    >
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform ${expandedFolders.includes(folder.name) ? "" : "-rotate-90"}`}
                      />
                      <FolderTree className="h-3.5 w-3.5 text-accent" />
                      <span className="text-sm">{folder.name}</span>
                    </div>
                    {expandedFolders.includes(folder.name) && (
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
        <div className="flex-1 flex flex-col overflow-hidden">
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
                      {selectedMethod ? <Clock className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{showMethodPanel ? "Hide method panel" : "Show method panel"}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 gap-1">
                    {selectedMethod ? selectedMethod.name : "No Method"}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleChangeMethod(0)}>No Method</DropdownMenuItem>
                  {learningMethods.map((method) => {
                    const Icon = technicIcons[method.id] || Clock;
                    return (
                      <DropdownMenuItem key={method.id} onClick={() => handleChangeMethod(method.id)}>
                        <Icon className="mr-2 h-4 w-4" />
                        <span>{method.name}</span>
                      </DropdownMenuItem>
                    );
                  })}
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
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 overflow-auto">
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Start writing..."
                className="w-full h-full p-4 bg-background resize-none focus:outline-none"
              />
            </div>
            {showMethodPanel && (
              <div className="w-80 border-l bg-card flex flex-col">
                <div className="flex items-center justify-between p-2 border-b">
                  <span className="font-medium text-sm">
                    {selectedMethod ? selectedMethod.name : "Learning Method"}
                  </span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={toggleMethodPanel}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="flex-1 overflow-auto p-2">{renderMethodComponent()}</div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between px-3 py-1 text-xs text-muted-foreground border-t bg-secondary">
            <div>
              {activeNote
                ? "Last edited: " + (notes.find((n) => n.id === activeNote)?.updatedAt || "")
                : isCreatingNew
                  ? "New note"
                  : "No note selected"}
            </div>
            <div>{noteContent.split(/\s+/).filter(Boolean).length} words</div>
          </div>
        </div>
      </div>
    </div>
  );
}