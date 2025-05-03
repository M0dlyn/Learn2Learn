'use client';

import { Navbar } from '@/components/navbar';
import { PomodoroTimer } from '@/components/pomodoro-timer';
import { TipWidget } from '@/components/tip-widget'; // Import TipWidget component
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import {
    Clock,
    FileText, // Icon for adding tags
    Filter,
    Menu,
    MoreHorizontal,
    Plus,
    PlusCircle,
    Save,
    Search,
    Trash2, // Restore Filter icon import
  Brain, // Add this for the AI icon
  Loader2, // Add this for the loading state
    Wand2,
    X,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast'; // Import toast components
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Define Note and Tag interfaces (reuse from dashboard or define here)
interface Tag {
    id: number;
    name: string;
    // Add color later if provided by API
}

interface Note {
    id: number;
    title: string;
    content: string;
    learning_technic_id: number | null; // Allow null for no method
    tags: Tag[];
    created_at: string;
    updated_at: string;
    // Add other fields if returned by the API and needed, e.g., user_id
}

// Define interface for Learning Method data from API
interface LearningMethod {
    id: number;
    name: string; // Changed from title to match API
    description: string;
    how_to_use: string; // Add the how_to_use field
    category?: string; // Optional fields as needed
    created_at?: string;
    updated_at?: string;
}

// Helper function to get CSRF token
const getXsrfToken = async () => {
    // Re-implement logic to retrieve XSRF-TOKEN from cookies or wherever it's stored
    // Example using standard cookie parsing:
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.split('=').map((c) => c.trim());
        if (name === 'XSRF-TOKEN') {
            return decodeURIComponent(value);
        }
    }
    // Attempt to fetch if not found (common pattern with Laravel Sanctum)
    try {
        await axios.get('/sanctum/csrf-cookie');
        // Retry getting the cookie
        const updatedCookies = document.cookie.split(';');
        for (let cookie of updatedCookies) {
            const [name, value] = cookie.split('=').map((c) => c.trim());
            if (name === 'XSRF-TOKEN') {
                return decodeURIComponent(value);
            }
        }
    } catch (error) {
        console.error('Error fetching CSRF cookie:', error);
    }
    console.error('XSRF Token not found.'); // Add error handling
    return null;
};

// Helper function to get a consistent color for a tag
const getTagColor = (tagId: number): string => {
    const colors = [
        'bg-red-500/20 text-red-700 border-red-500/30 hover:bg-red-500/30',
        'bg-blue-500/20 text-blue-700 border-blue-500/30 hover:bg-blue-500/30',
        'bg-green-500/20 text-green-700 border-green-500/30 hover:bg-green-500/30',
        'bg-yellow-500/20 text-yellow-700 border-yellow-500/30 hover:bg-yellow-500/30',
        'bg-purple-500/20 text-purple-700 border-purple-500/30 hover:bg-purple-500/30',
        'bg-indigo-500/20 text-indigo-700 border-indigo-500/30 hover:bg-indigo-500/30',
        'bg-pink-500/20 text-pink-700 border-pink-500/30 hover:bg-pink-500/30',
        'bg-teal-500/20 text-teal-700 border-teal-500/30 hover:bg-teal-500/30',
    ];
    return colors[tagId % colors.length];
};

// --- Placeholder Components (Define inline for now) ---
const ActiveRecallDisplay: React.FC = () => (
    <div className="bg-secondary/10 text-secondary-foreground mt-4 rounded border p-4">
        <p className="text-sm italic">(Interactive Active Recall Component Placeholder)</p>
    </div>
);
const SpacedRepetitionDisplay: React.FC = () => (
    <div className="bg-secondary/10 text-secondary-foreground mt-4 rounded border p-4">
        <p className="text-sm italic">(Interactive Spaced Repetition Component Placeholder)</p>
    </div>
);
const BlurtingDisplay: React.FC = () => (
    <div className="bg-secondary/10 text-secondary-foreground mt-4 rounded border p-4">
        <p className="text-sm italic">(Interactive Blurting Method Component Placeholder)</p>
    </div>
);
const HighlightRevisitDisplay: React.FC = () => (
    <div className="bg-secondary/10 text-secondary-foreground mt-4 rounded border p-4">
        <p className="text-sm italic">(Interactive Highlight & Revisit Component Placeholder)</p>
    </div>
);
const TwoColumnNotesDisplay: React.FC = () => (
    <div className="bg-secondary/10 text-secondary-foreground mt-4 rounded border p-4">
        <p className="text-sm italic">(Interactive Two Column Notes Component Placeholder)</p>
    </div>
);

// --- Component Mapping ---
const techniqueComponentMap: { [key: string]: React.FC } = {
    'Pomodoro Technique': PomodoroTimer,
    'Active Recall': ActiveRecallDisplay,
    'Spaced Repetition': SpacedRepetitionDisplay,
    'Blurting Method': BlurtingDisplay,
    'Highlight & Revisit': HighlightRevisitDisplay,
    'Two Column Notes': TwoColumnNotesDisplay,
};

export default function NotepadPage() {
    const { url, props } = usePage<SharedData>();
    const params = new URLSearchParams(url.split('?')[1]);
    const methodParam = params.get('method');
    const methodIdNumber = methodParam ? parseInt(methodParam, 10) : 0;

    // --- State Variables ---
    const [notes, setNotes] = useState<Note[]>([]); // State for fetched notes
    const [isLoadingNotes, setIsLoadingNotes] = useState(true);
    const [notesError, setNotesError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [allTags, setAllTags] = useState<Tag[]>([]);
    const [isLoadingTags, setIsLoadingTags] = useState(true);
    const [tagsError, setTagsError] = useState<string | null>(null);
    const [newTagName, setNewTagName] = useState<string>('');
    const [isCreatingTag, setIsCreatingTag] = useState(false);
    const [createTagError, setCreateTagError] = useState<string | null>(null);

    const [activeNoteId, setActiveNoteId] = useState<number | null>(null); // Changed to activeNoteId
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [showFileExplorer, setShowFileExplorer] = useState(true);
    const [showMethodPanel, setShowMethodPanel] = useState(methodIdNumber > 0);
    const [searchTerm, setSearchTerm] = useState(''); // Added search state
    const [selectedFilterTags, setSelectedFilterTags] = useState<Tag[]>([]); // Restore state for selected filter tags
    const [fetchedLearningMethods, setFetchedLearningMethods] = useState<LearningMethod[]>([]); // Use the new interface
    const [isLoadingMethods, setIsLoadingMethods] = useState(true); // Loading state for methods
    const [methodsError, setMethodsError] = useState<string | null>(null); // Error state for methods
    const [showTipWidget, setShowTipWidget] = useState(true); // State to control tip widget visibility

  // Add these AI review state variables with your other states
  const [isReviewingWithAI, setIsReviewingWithAI] = useState(false);
  const [aiReviewResult, setAiReviewResult] = useState<{ rating: string; feedback: string } | null>(null);
  const [aiReviewError, setAiReviewError] = useState<string | null>(null);
  const [showAIReviewDialog, setShowAIReviewDialog] = useState(false);

    // Find selected method from fetched data
    const selectedMethod = methodIdNumber > 0 ? fetchedLearningMethods.find((m) => m.id === methodIdNumber) : null;

    useEffect(() => {
        // When method changes via URL param, update the UI
        if (methodIdNumber > 0) {
            setShowMethodPanel(true);
        }
    }, [methodIdNumber]);

    // --- Fetch Notes from API ---
    useEffect(() => {
        async function fetchNotes() {
            setIsLoadingNotes(true);
            setNotesError(null);
            try {
                const xsrfToken = await getXsrfToken();
                const headers: HeadersInit = {
                    Accept: 'application/json',
                };
                if (xsrfToken) {
                    headers['X-XSRF-TOKEN'] = xsrfToken;
                }
                const response = await fetch('/api/notes', {
                    // Use API endpoint
                    credentials: 'include',
                    headers: headers,
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('API Error Response (Notes):', errorText);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setNotes(data.data || []); // Assuming { data: [...] } structure
            } catch (err) {
                console.error('Failed to fetch notes:', err);
                setNotesError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setIsLoadingNotes(false);
            }
        }

        fetchNotes();
    }, []); // Fetch once on mount

    useEffect(() => {
        const fetchTags = async () => {
            setIsLoadingTags(true);
            setTagsError(null);
            try {
                const csrfToken = await getXsrfToken();
                // Assuming /api/tags returns all tags, adjust if paginated or different structure
                const response = await axios.get('/api/tags', {
                    headers: { 'X-XSRF-TOKEN': csrfToken },
                });
                // Assuming response structure is { data: Tag[] }
                // If it's paginated like notes, you might need response.data.data
                setAllTags(response.data.data || response.data);
            } catch (error: any) {
                console.error('Error fetching tags:', error);
                setTagsError('Failed to load tags.');
            } finally {
                setIsLoadingTags(false);
            }
        };

        fetchTags();
    }, []); // Fetch tags once on mount

    useEffect(() => {
        const fetchLearningMethods = async () => {
            setIsLoadingMethods(true);
            setMethodsError(null);
            try {
                const csrfToken = await getXsrfToken();
                // Adjust endpoint if needed
                const response = await axios.get('/api/learning-techniques', {
                    headers: { 'X-XSRF-TOKEN': csrfToken },
                });
                console.log('Raw Learning Methods API Response:', response.data); // <-- ADD THIS LOG
                setFetchedLearningMethods(response.data); // Assuming response.data is an array of LearningMethod
            } catch (error: any) {
                console.error('Error fetching learning methods:', error);
                setMethodsError('Failed to load learning methods.');
            } finally {
                setIsLoadingMethods(false);
            }
        };

        fetchLearningMethods();
    }, []); // Fetch methods once on mount

    // Effect to load note data into editor when activeNoteId changes or notes are loaded
    useEffect(() => {
        if (activeNoteId) {
            const noteToLoad = notes.find((n) => n.id === activeNoteId);
            if (noteToLoad) {
                setNoteTitle(noteToLoad.title);
                setNoteContent(noteToLoad.content);
                setIsCreatingNew(false); // Ensure we are not in 'creating new' mode
            } else {
                // Note ID from URL is invalid or not found in loaded notes
                // Optionally handle this case, e.g., show error or switch to new note view
                // console.warn(`Note with ID ${activeNoteId} not found.`);
                // handleNewNote(); // Example: Treat as new note if ID invalid
            }
        } else {
            // If no activeNoteId is set (e.g., navigating to /notepad directly)
            // ensure we are in the 'new note' state if not already.
            if (!isCreatingNew) {
                // Reset fields if not explicitly creating new
                // handleNewNote(); // Or just reset fields if handleNewNote has side effects we don't want
                setNoteTitle('Untitled Note');
                setNoteContent('');
            }
        }
    }, [activeNoteId, notes]); // Rerun when ID changes or notes array updates

    // Handler to add/remove a tag from the active note's local state
    const handleTagToggle = (tag: Tag) => {
        if (!activeNoteId) return;

        if (process.env.NODE_ENV === 'development') {
            console.log('handleTagToggle received tag:', JSON.stringify(tag, null, 2)); // Log the received tag object
        }

        setNotes((prevNotes: Note[]) =>
            prevNotes.map((note: Note) => {
                if (note.id === activeNoteId) {
                    const tagExists = note.tags?.some((t: Tag) => t.id === tag.id);
                    let updatedTags;
                    if (tagExists) {
                        // Remove tag
                        updatedTags = note.tags?.filter((t: Tag) => t.id !== tag.id) || [];
                    } else {
                        // Add tag
                        updatedTags = [...(note.tags || []), tag];
                    }
                    return { ...note, tags: updatedTags };
                }
                return note;
            }),
        );
        // Note: This only updates local state. The actual save happens via handleSaveNote.
    };

    // Handler to create a new tag via API
    const handleCreateTag = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission if used in a form
        const trimmedName = newTagName.trim();
        if (!trimmedName) {
            setCreateTagError('Tag name cannot be empty.');
            return;
        }

        // Optional: Check if tag name already exists locally (case-insensitive)
        if (allTags.some((tag) => tag.name.toLowerCase() === trimmedName.toLowerCase())) {
            setCreateTagError(`Tag "${trimmedName}" already exists.`);
            return;
        }

        setIsCreatingTag(true);
        setCreateTagError(null);
        const csrfToken = await getXsrfToken();

        try {
            const response = await axios.post('/api/tags', { name: trimmedName }, { headers: { 'X-XSRF-TOKEN': csrfToken } });

            const newTag: Tag = response.data.data; // Assuming response { data: Tag }

            // Add to the list of all tags
            setAllTags((prevTags) => [...prevTags, newTag]);
            // Clear the input
            setNewTagName('');
            // Optionally automatically assign the new tag to the current note
            if (activeNoteId) {
                handleTagToggle(newTag);
            }
            console.log('Tag created:', newTag);
            toast.success(`Tag "${newTag.name}" created successfully!`);
        } catch (error: any) {
            console.error('Error creating tag:', error);
            const errorMsg = error.response?.data?.message || 'Failed to create tag.';
            // Handle specific errors like uniqueness constraint from backend if needed
            if (error.response?.status === 422) {
                // Unprocessable Entity (validation failed)
                const validationError = error.response?.data?.errors?.name?.[0] || 'Validation failed.';
                setCreateTagError(validationError);
                toast.error(validationError); // Show validation error in toast
            } else {
                setCreateTagError(errorMsg);
                toast.error(errorMsg); // Show general error in toast
            }
            // Add error toast here if desired
        } finally {
            setIsCreatingTag(false);
        }
    };

    // Restore Handler to toggle a tag in the filter state
    const handleFilterTagToggle = (tag: Tag) => {
        setSelectedFilterTags((prevSelected) => {
            const isSelected = prevSelected.some((t) => t.id === tag.id);
            if (isSelected) {
                return prevSelected.filter((t) => t.id !== tag.id);
            } else {
                return [...prevSelected, tag];
            }
        });
    };

    // Restore Handler to clear all tag filters
    const clearTagFilters = () => {
        setSelectedFilterTags([]);
    };

    // --- Event Handlers ---
    const handleSelectNote = useCallback(
        (noteId: number) => {
            const note = notes.find((n) => n.id === noteId); // Use fetched notes
            if (note) {
                setActiveNoteId(noteId); // Update ID state
                setNoteTitle(note.title);
                setNoteContent(note.content);
                setIsCreatingNew(false);

                // Update URL based on selected note's method
                const currentMethodId = note.learning_technic_id;
                if (currentMethodId && currentMethodId > 0 && currentMethodId !== methodIdNumber) {
                    // If note has a method and it's different from URL param, update URL to match note
                    router.visit(`/notepad?note=${noteId}&method=${currentMethodId}`, { preserveState: true, replace: true });
                } else if (!currentMethodId && methodIdNumber > 0) {
                    router.visit('/notepad', { preserveState: true });
                }
            }
        },
        [notes, methodIdNumber],
    ); // Depend on notes and methodIdNumber

    const handleNewNote = () => {
        setActiveNoteId(null); // Clear active ID
        setNoteTitle('Untitled Note'); // Provide default title
        setNoteContent('');
        setIsCreatingNew(true);
        // Optionally clear the method from URL if creating new
        if (methodIdNumber > 0) {
            router.visit('/notepad', { preserveState: true });
        }
    };

    const toggleFileExplorer = () => {
        setShowFileExplorer((prev) => !prev);
    };

    const toggleMethodPanel = () => {
        setShowMethodPanel((prev) => !prev);
    };

    // Restore filtering by search term AND selected tags
    const filteredNotes = notes.filter((note) => {
        const searchTermLower = searchTerm.toLowerCase();
        const titleMatch = note.title.toLowerCase().includes(searchTermLower);
        // Basic content match (consider performance for large notes)
        // const contentMatch = note.content?.toLowerCase().includes(searchTermLower);
        const searchMatch = titleMatch; // || contentMatch;

        const tagsMatch =
            selectedFilterTags.length === 0 || selectedFilterTags.every((filterTag) => note.tags?.some((noteTag) => noteTag.id === filterTag.id));

        return searchMatch && tagsMatch;
    });

    // Get the full Note object for the active ID
    const activeNote = activeNoteId ? notes.find((n) => n.id === activeNoteId) : null;

    // --- Save Note Logic (Placeholder - requires API call) ---
    const handleSaveNote = async () => {
        if (!noteTitle.trim()) return;
        setIsSaving(true);

        const noteData = {
            title: noteTitle.trim(),
            content: noteContent,
            learning_technic_id: methodIdNumber === 0 ? null : methodIdNumber,
            tags: activeNote?.tags?.map((tag) => tag.id) || [], // Send array of tag IDs
        };

        if (process.env.NODE_ENV === 'development') {
            console.log('Data being sent to backend:', JSON.stringify(noteData, null, 2)); // Log the data
        }

        const csrfToken = await getXsrfToken();

        try {
            let response;
            let savedNote: Note;

            if (activeNoteId) {
                // Update existing note
                response = await axios.put(`/api/notes/${activeNoteId}`, noteData, {
                    headers: { 'X-XSRF-TOKEN': csrfToken },
                });
                savedNote = response.data.data;

                setNotes((prevNotes) =>
                    prevNotes.map(
                        (note) => (note.id === activeNoteId ? savedNote : note), // Use the complete updated note from the response
                    ),
                );
            } else {
                // Create new note
                response = await axios.post('/api/notes', noteData, {
                    headers: { 'X-XSRF-TOKEN': csrfToken },
                });
                savedNote = response.data.data;

                setNotes((prevNotes) => [savedNote, ...prevNotes]);
                setActiveNoteId(savedNote.id);
                // Ensure title is updated after save completes
                setNoteTitle(savedNote.title);
                // Update URL to reflect the new note ID and method (if applicable)
                const newUrl = `/notepad?note=${savedNote.id}` + (savedNote.learning_technic_id ? `&method=${savedNote.learning_technic_id}` : '');
                router.visit(newUrl, { preserveState: true, preserveScroll: true, replace: true });
            }

            console.log('Note saved successfully:', savedNote);
            if (activeNoteId) {
                toast.success('Note updated successfully!');
            } else {
                toast.success('Note created successfully!');
            }
        } catch (error: any) {
            console.error('Error saving note:', error);
            const errorMsg = error.response?.data?.message || 'Failed to save note.';
            toast.error(errorMsg); // Display error via toast
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteNote = async () => {
        if (!activeNoteId || isDeleting) {
            return;
        }

        if (!window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
            return;
        }

        setIsDeleting(true);
        setNotesError(null); // Clear previous errors
        const csrfToken = await getXsrfToken();

        try {
            const response = await axios.delete(`/api/notes/${activeNoteId}`, {
                headers: { 'X-XSRF-TOKEN': csrfToken },
            });

            console.log('Note deleted:', response.data);
            toast.success('Note deleted successfully!');

            // Remove note from state
            setNotes((prevNotes) => prevNotes.filter((note) => note.id !== activeNoteId));

            // Clear editor and selection
            setActiveNoteId(null);
            setNoteTitle('');
            setNoteContent('');

            // Navigate back to base URL
            router.visit('/notepad', { preserveState: false, replace: true }); // Use preserveState: false to reset component state if needed
        } catch (error: any) {
            console.error('Error deleting note:', error);
            const errorMsg = error.response?.data?.message || 'Failed to delete note.';
            toast.error('Failed to delete note.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleMethodSelect = (methodId: number) => {
        // Update the learning_technic_id for the currently active note in the notes state
        if (activeNoteId) {
            setNotes((prevNotes) =>
                prevNotes.map((note) =>
                    note.id === activeNoteId
                        ? { ...note, learning_technic_id: methodId === 0 ? null : methodId } // Set null if methodId is 0 (No Method)
                        : note,
                ),
            );
            // Mark that changes are pending save? (Optional, depends on desired UX)
            // setIsDirty(true);
        }
        // Update URL without full reload
        const newUrl =
            methodId > 0
                ? `/notepad?method=${methodId}${activeNoteId ? '&note=' + activeNoteId : ''}`
                : `/notepad${activeNoteId ? '?note=' + activeNoteId : ''}`;
        router.visit(newUrl, { preserveState: true, replace: true });
    };

  const handleAIReview = async () => {
    if (!activeNoteId) {
      toast.error('Please save your note before requesting AI review');
      return;
    }
  
    // Prevent reviewing empty or very short notes
    if (!noteContent || noteContent.trim().length < 10) {
      toast.error('Your note is too short for a meaningful AI review');
      return;
    }
  
    setIsReviewingWithAI(true);
    setAiReviewError(null);
    setAiReviewResult(null); // Reset previous result
  
    try {
      const csrfToken = await getXsrfToken();
      toast.loading('Analyzing your note with AI...', { id: 'ai-review' });
      
      const response = await axios.post(
        `/api/notes/${activeNoteId}/rate`,
        {}, // No body needed for this request
        { headers: { 'X-XSRF-TOKEN': csrfToken } }
      );
  
      if (response.data.success) {
        toast.success('AI review completed', { id: 'ai-review' });
        setAiReviewResult({
          rating: response.data.rating,
          feedback: response.data.feedback
        });
        setShowAIReviewDialog(true);
      } else {
        throw new Error(response.data.message || 'Failed to get AI review');
      }
    } catch (error: any) {
      console.error("Error getting AI review:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to get AI review";
      setAiReviewError(errorMsg);
      toast.error(errorMsg, { id: 'ai-review' });
    } finally {
      setIsReviewingWithAI(false);
    }
  };

    const renderMethodComponent = () => {
        if (!methodIdNumber) return null;

        // Ensure we have a selected method and name before looking up
        if (!selectedMethod?.name) {
            return null;
        }
        // Now it's safe to use selectedMethod.name
        const TechniqueComponent = techniqueComponentMap[selectedMethod.name];
        return TechniqueComponent ? <TechniqueComponent /> : null;
    };

    return (
        <div className="flex h-screen flex-col bg-[#E0F2F1] text-[#263238] dark:bg-[#263238] dark:text-[#E0F2F1]">
            <Head title="Notepad" />
            <Toaster
                position="top-right"
                toastOptions={{
                    // Define default options
                    className: '',
                    duration: 5000,
                    style: {
                        background: '#B2DFDB', // Light background in light mode
                        color: '#263238',   // Dark text in light mode
                        border: '1px solid #4DB6AC', // Teal border
                    },
                    // Color modes handled through theme detection in toast
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: '#00796B', // Deep blue icon for light mode
                            secondary: '#E0F2F1', // Light background for icon
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#EF9A9A', // Light red icon
                            secondary: '#263238', // Dark background for icon in light mode
                        },
                    },
                }}
            />
            <Navbar />

            <div className="flex flex-1 overflow-hidden">
                {/* File explorer sidebar */}
                {showFileExplorer && (
                    <div className="bg-card flex w-64 flex-col border-r">
                        <div className="flex items-center justify-between border-b p-2">
                            <span className="text-sm font-medium">Files</span>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <Search className="h-3.5 w-3.5" />
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative h-6 w-6">
                                            <Filter className="h-4 w-4" />
                                            {selectedFilterTags.length > 0 && (
                                                <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-teal-500 text-xs text-white">
                                                    {selectedFilterTags.length}
                                                </span>
                                            )}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 border-[#4DB6AC]/50 bg-[#263238] text-[#E0F2F1]">
                                        <DropdownMenuLabel className="text-teal-200">Filter by Tag</DropdownMenuLabel>
                                        <DropdownMenuSeparator className="bg-[#4DB6AC]/50" />
                                        {isLoadingTags ? (
                                            <DropdownMenuItem disabled className="text-gray-400">
                                                Loading tags...
                                            </DropdownMenuItem>
                                        ) : tagsError ? (
                                            <DropdownMenuItem disabled className="text-red-400">
                                                {tagsError}
                                            </DropdownMenuItem>
                                        ) : allTags.length > 0 ? (
                                            allTags.map((tag) => (
                                                <DropdownMenuCheckboxItem
                                                    key={tag.id}
                                                    checked={selectedFilterTags.some((t) => t.id === tag.id)}
                                                    onCheckedChange={() => handleFilterTagToggle(tag)}
                                                    className="focus:bg-[#4DB6AC]/20 focus:text-[#E0F2F1]"
                                                >
                                                    {tag.name}
                                                </DropdownMenuCheckboxItem>
                                            ))
                                        ) : (
                                            <DropdownMenuItem disabled className="text-gray-400">
                                                No tags available
                                            </DropdownMenuItem>
                                        )}
                                        {selectedFilterTags.length > 0 && (
                                            <>
                                                <DropdownMenuSeparator className="bg-[#4DB6AC]/50" />
                                                <DropdownMenuItem
                                                    onSelect={clearTagFilters}
                                                    className="text-red-400 focus:bg-red-500/20 focus:text-red-400"
                                                >
                                                    Clear Filters
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleNewNote}>
                                    <Plus className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>

                        <ScrollArea className="flex-1">
                            <div className="p-2">
                                {isLoadingNotes && <p className="p-4 text-center text-[#B2DFDB]/80">Loading notes...</p>}
                                {notesError && <p className="p-4 text-center text-red-400">Error: {notesError}</p>}
                                {!isLoadingNotes && !notesError && (
                                    <ul className="space-y-1">
                                        {filteredNotes.map((note) => (
                                            <li key={note.id}>
                                                <Button
                                                    variant={activeNoteId === note.id ? 'secondary' : 'ghost'}
                                                    className={`h-auto w-full justify-start px-3 py-2 text-left whitespace-normal ${activeNoteId === note.id ? 'bg-[#4DB6AC]/20 text-[#E0F2F1]' : 'text-[#B2DFDB] hover:bg-[#4DB6AC]/10 hover:text-[#E0F2F1]'}`}
                                                    onClick={() => handleSelectNote(note.id)}
                                                >
                                                    <FileText className="mr-2 h-4 w-4 flex-shrink-0" />
                                                    <span className="flex-grow truncate font-medium">{note.title || 'Untitled Note'}</span>
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                )}
                {/* Main editor area */}
                <div className="flex flex-1 flex-col overflow-hidden">
                    {/* Editor toolbar */}
                    <div className="bg-card flex items-center justify-between border-b p-2">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleFileExplorer}>
                                <Menu className="h-4 w-4" />
                            </Button>
                            <Input
                                value={noteTitle}
                                onChange={(e) => setNoteTitle(e.target.value)}
                                placeholder="Untitled"
                                className="h-7 w-48 border-none bg-transparent px-1 font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                            <div className="mt-2 mb-1 flex min-h-[24px] flex-wrap items-center gap-2">
                                {activeNote && activeNote.tags && activeNote.tags.length > 0
                                    ? activeNote.tags.map((tag) => (
                                          <Badge
                                              key={tag.id}
                                              variant="outline"
                                              className={`cursor-default rounded-full border px-2 py-0.5 text-xs ${getTagColor(tag.id)}`}
                                          >
                                              {tag.name}
                                          </Badge>
                                      ))
                                    : // Placeholder when no tags or no active note
                                      activeNoteId && <span className="text-xs text-gray-400 italic">No tags</span>}
                                {/* Tag Management Dropdown */}
                                {activeNoteId && ( // Only show button if a note is active
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="ml-2 h-6 w-6 p-0 text-teal-400 hover:text-teal-300 disabled:opacity-50"
                                                disabled={isLoadingTags || !!tagsError} // Disable if tags are loading/error
                                            >
                                                <PlusCircle className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="w-48 border-[#4DB6AC]/50 bg-[#263238] text-[#E0F2F1]">
                                            <DropdownMenuLabel className="text-teal-200">Assign Tags</DropdownMenuLabel>
                                            <DropdownMenuSeparator className="bg-[#4DB6AC]/50" />
                                            {isLoadingTags ? (
                                                <DropdownMenuItem disabled>Loading tags...</DropdownMenuItem>
                                            ) : tagsError ? (
                                                <DropdownMenuItem disabled className="text-red-400">
                                                    {tagsError}
                                                </DropdownMenuItem>
                                            ) : allTags.length > 0 ? (
                                                allTags.map((tag) => (
                                                    <DropdownMenuCheckboxItem
                                                        key={tag.id}
                                                        checked={activeNote?.tags?.some((t) => t.id === tag.id)}
                                                        onCheckedChange={() => handleTagToggle(tag)}
                                                        className="focus:bg-[#4DB6AC]/20 focus:text-[#E0F2F1]"
                                                    >
                                                        {tag.name}
                                                    </DropdownMenuCheckboxItem>
                                                ))
                                            ) : (
                                                <DropdownMenuItem disabled className="text-gray-400">
                                                    No tags available
                                                </DropdownMenuItem>
                                            )}
                                            {/* Add New Tag Section */}
                                            <DropdownMenuSeparator className="bg-[#4DB6AC]/50" />
                                            <div className="space-y-2 p-2">
                                                <p className="text-xs font-medium text-teal-200">Create New Tag</p>
                                                <form onSubmit={handleCreateTag} className="flex items-center gap-2">
                                                    <Input
                                                        type="text"
                                                        placeholder="New tag name..."
                                                        value={newTagName}
                                                        onChange={(e) => {
                                                            setNewTagName(e.target.value);
                                                            setCreateTagError(null); // Clear error on typing
                                                        }}
                                                        className="h-7 border-[#4DB6AC]/50 bg-[#37474F] text-xs text-[#E0F2F1] placeholder:text-gray-400 focus:border-teal-500 focus:ring-teal-500"
                                                    />
                                                    <Button
                                                        type="submit"
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-7 border-teal-500 bg-teal-600 px-2 text-xs text-white hover:bg-teal-700 disabled:opacity-60"
                                                        disabled={isCreatingTag || !newTagName.trim()}
                                                    >
                                                        {isCreatingTag ? '...' : 'Add'}
                                                    </Button>
                                                </form>
                                                {createTagError && <p className="mt-1 text-xs text-red-400">{createTagError}</p>}
                                            </div>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                                {tagsError && <p className="mt-1 ml-0 text-xs text-red-500">{tagsError}</p>}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleMethodPanel}>
                                            <Clock className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {selectedMethod ? selectedMethod.name : 'Method Panel'} - {showMethodPanel ? 'Hide' : 'Show'}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-7 w-7">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="border-[#4DB6AC]/50 bg-[#263238] text-[#E0F2F1]">
                                    {/* Add other items like Search toggle, etc. if needed */}
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger className="focus:bg-[#4DB6AC]/20 focus:text-[#E0F2F1]">
                                            <Wand2 className="mr-2 h-4 w-4" /> {/* Use Wand2 icon */}
                                            <span>Apply Method</span>
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent className="border-[#4DB6AC]/50 bg-[#263238] text-[#E0F2F1]">
                                                <DropdownMenuItem
                                                    className="focus:bg-[#4DB6AC]/20 focus:text-[#E0F2F1]"
                                                    onSelect={() => handleMethodSelect(0)} // Pass 0 for 'No Method'
                                                >
                                                    No Method
                                                </DropdownMenuItem>
                                                {isLoadingMethods ? (
                                                    <DropdownMenuItem disabled>Loading methods...</DropdownMenuItem>
                                                ) : methodsError ? (
                                                    <DropdownMenuItem disabled className="text-destructive">
                                                        Error loading methods
                                                    </DropdownMenuItem>
                                                ) : (
                                                    fetchedLearningMethods.map((method) => (
                                                        <DropdownMenuItem
                                                            key={method.id}
                                                            className="focus:bg-[#4DB6AC]/20 focus:text-[#E0F2F1]"
                                                            onSelect={() => handleMethodSelect(method.id)}
                                                        >
                                                            {method.name}
                                                        </DropdownMenuItem>
                                                    ))
                                                )}
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                    <DropdownMenuSeparator className="bg-[#4DB6AC]/50" />
                                    <DropdownMenuItem
                                        className="text-red-500 focus:bg-red-500/20 focus:text-red-400"
                                        onSelect={handleDeleteNote}
                                        disabled={!activeNoteId || isDeleting || isSaving}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        {isDeleting ? 'Deleting...' : 'Delete Note'}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleSaveNote} disabled={isSaving}>
                                <Save className={`h-4 w-4 ${isSaving ? 'animate-pulse' : ''}`} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    {/* Tip widget - positioned at the bottom left corner of the screen */}
                    {showTipWidget && <TipWidget onClose={() => setShowTipWidget(false)} />}
                    {/* Content area with optional method panel */}
                    <div className="flex flex-1 overflow-hidden">
                        {/* Note editor */}
                        <div className="flex-1 overflow-auto">
                            <textarea
                                value={noteContent}
                                onChange={(e) => setNoteContent(e.target.value)}
                                placeholder="Start writing..."
                                className="bg-background h-full w-full resize-none p-4 focus:outline-none"
                            />
                        </div>
                        {/* Method panel */}
                        {showMethodPanel && (
                            <div className="bg-card flex w-80 flex-col border-l">
                                <div className="flex items-center justify-between border-b p-2">
                                    <span className="text-sm font-medium">{selectedMethod ? selectedMethod.name : 'Learning Method'}</span>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={toggleMethodPanel}>
                                        <X className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                                <div className="flex-1 overflow-auto p-2">
                                    {isLoadingMethods ? (
                                        <p>Loading methods...</p>
                                    ) : methodsError ? (
                                        <p className="text-destructive">Error: {methodsError}</p>
                                    ) : selectedMethod ? (
                                        <>
                                            <h3 className="flex items-center text-lg font-semibold">{selectedMethod.name}</h3>
                                            <p className="text-muted-foreground text-sm">{selectedMethod.description}</p>
                                            <div className="border-border mt-4 border-t pt-4">
                                                <h4 className="mb-2 font-semibold">How to Use:</h4>
                                                <p className="mb-4 text-sm whitespace-pre-wrap">{selectedMethod.how_to_use}</p>
                                                {renderMethodComponent()}
                                            </div>
                                            {/* Add other method details here if needed */}
                                        </>
                                    ) : (
                                        <p>No learning method selected or applied.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Status bar */}
                    <div className="text-muted-foreground bg-secondary flex items-center justify-between border-t px-3 py-1 text-xs">
                        <div>{activeNoteId ? 'Last edited: ' + activeNote?.updated_at : isCreatingNew ? 'New note' : 'No note selected'}</div>
                        <div>{noteContent.split(/\s+/).filter(Boolean).length} words</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
