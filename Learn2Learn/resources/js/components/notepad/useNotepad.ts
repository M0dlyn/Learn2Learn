import type { SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { AIReviewResult, LearningMethod, Note, Tag } from './types';
import { getXsrfToken } from './utils';

export const useNotepad = () => {
    const { url } = usePage<SharedData>();
    const params = new URLSearchParams(url.split('?')[1]);
    const methodParam = params.get('method');
    const noteParam = params.get('note');
    const methodIdNumber = methodParam ? parseInt(methodParam, 10) : 0;
    const noteIdParam = noteParam ? parseInt(noteParam, 10) : null;

    // State variables
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoadingNotes, setIsLoadingNotes] = useState(true);
    const [notesError, setNotesError] = useState<string | null>(null);

    const [allTags, setAllTags] = useState<Tag[]>([]);
    const [isLoadingTags, setIsLoadingTags] = useState(true);
    const [tagsError, setTagsError] = useState<string | null>(null);
    const [selectedFilterTags, setSelectedFilterTags] = useState<Tag[]>([]);

    const [newTagName, setNewTagName] = useState<string>('');
    const [isCreatingTag, setIsCreatingTag] = useState(false);
    const [createTagError, setCreateTagError] = useState<string | null>(null);

    const [activeNoteId, setActiveNoteId] = useState<number | null>(noteIdParam);
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [showFileExplorer, setShowFileExplorer] = useState(true);
    const [showMethodPanel, setShowMethodPanel] = useState(methodIdNumber > 0);
    const [searchTerm, setSearchTerm] = useState('');

    const [fetchedLearningMethods, setFetchedLearningMethods] = useState<LearningMethod[]>([]);
    const [isLoadingMethods, setIsLoadingMethods] = useState(true);
    const [methodsError, setMethodsError] = useState<string | null>(null);

    const [showTipWidget, setShowTipWidget] = useState(true);
    const [isReviewingWithAI, setIsReviewingWithAI] = useState(false);
    const [showAIReviewDialog, setShowAIReviewDialog] = useState(false);
    const [aiReviewResult, setAiReviewResult] = useState<AIReviewResult | null>(null);
    const [aiReviewError, setAiReviewError] = useState<string | null>(null);

    // Find selected method from fetched data
    const selectedMethod: LearningMethod | null = methodIdNumber > 0 ? fetchedLearningMethods.find((m) => m.id === methodIdNumber) || null : null;

    // Get the full Note object for the active ID
    const activeNote: Note | null = activeNoteId ? notes.find((n) => n.id === activeNoteId) || null : null;

    // Effect for method changes
    useEffect(() => {
        if (methodIdNumber > 0) {
            setShowMethodPanel(true);
        }
    }, [methodIdNumber]);

    // Fetch notes from API
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
                    credentials: 'include',
                    headers: headers,
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('API Error Response (Notes):', errorText);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                // Convert tag IDs to full tag objects
                const notesWithFullTags = (data.data || []).map(
                    (note: {
                        id: number;
                        title: string;
                        content: string;
                        learning_technic_id: number | null;
                        tags: number[];
                        created_at: string;
                        updated_at: string;
                    }) => ({
                        ...note,
                        tags: (note.tags || [])
                            .map((tagId: number) => allTags.find((tag) => tag.id === tagId))
                            .filter((tag): tag is Tag => tag !== undefined),
                    }),
                );

                setNotes(notesWithFullTags);
            } catch (err) {
                console.error('Failed to fetch notes:', err);
                setNotesError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setIsLoadingNotes(false);
            }
        }

        // Only fetch notes if we have tags loaded
        if (allTags.length > 0) {
            fetchNotes();
        }
    }, [allTags]); // Add allTags as a dependency

    // Fetch tags
    useEffect(() => {
        const fetchTags = async () => {
            setIsLoadingTags(true);
            setTagsError(null);
            try {
                const csrfToken = await getXsrfToken();
                const response = await axios.get('/api/tags', {
                    headers: { 'X-XSRF-TOKEN': csrfToken },
                });
                setAllTags(response.data.data || response.data);
            } catch (error: any) {
                console.error('Error fetching tags:', error);
                setTagsError('Failed to load tags.');
            } finally {
                setIsLoadingTags(false);
            }
        };

        fetchTags();
    }, []);

    // Fetch learning methods
    useEffect(() => {
        const fetchLearningMethods = async () => {
            setIsLoadingMethods(true);
            setMethodsError(null);
            try {
                const csrfToken = await getXsrfToken();
                const response = await axios.get('/api/learning-techniques', {
                    headers: { 'X-XSRF-TOKEN': csrfToken },
                });

                if (Array.isArray(response.data)) {
                    setFetchedLearningMethods(response.data);
                } else if (response.data.data && Array.isArray(response.data.data)) {
                    setFetchedLearningMethods(response.data.data);
                } else {
                    console.error('Unexpected API response format:', response.data);
                    setMethodsError('API returned an unexpected format');
                }
            } catch (error: any) {
                console.error('Error fetching learning methods:', error);
                setMethodsError('Failed to load learning methods.');
            } finally {
                setIsLoadingMethods(false);
            }
        };

        fetchLearningMethods();
    }, []);

    // Effect to load note data into editor when activeNoteId changes or notes are loaded
    useEffect(() => {
        if (activeNoteId) {
            const noteToLoad = notes.find((n) => n.id === activeNoteId);
            if (noteToLoad) {
                setNoteTitle(noteToLoad.title);
                setNoteContent(noteToLoad.content);
                setIsCreatingNew(false);
            }
        } else {
            if (!isCreatingNew) {
                setNoteTitle('Untitled Note');
                setNoteContent('');
            }
        }
    }, [activeNoteId, notes, isCreatingNew]);

    // Handler to add/remove a tag from the active note's local state
    const handleTagToggle = (tag: Tag) => {
        if (!activeNoteId) return;

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
    };

    // Handler to create a new tag via API
    const handleCreateTag = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedName = newTagName.trim();
        if (!trimmedName) {
            setCreateTagError('Tag name cannot be empty.');
            return;
        }

        if (allTags.some((tag) => tag.name.toLowerCase() === trimmedName.toLowerCase())) {
            setCreateTagError(`Tag "${trimmedName}" already exists.`);
            return;
        }

        setIsCreatingTag(true);
        setCreateTagError(null);
        const csrfToken = await getXsrfToken();

        try {
            const response = await axios.post('/api/tags', { name: trimmedName }, { headers: { 'X-XSRF-TOKEN': csrfToken } });

            const newTag: Tag = response.data.data;

            setAllTags((prevTags) => [...prevTags, newTag]);
            setNewTagName('');

            if (activeNoteId) {
                handleTagToggle(newTag);
            }
            toast.success(`Tag "${newTag.name}" created successfully!`);
        } catch (error: any) {
            console.error('Error creating tag:', error);
            const errorMsg = error.response?.data?.message || 'Failed to create tag.';

            if (error.response?.status === 422) {
                const validationError = error.response?.data?.errors?.name?.[0] || 'Validation failed.';
                setCreateTagError(validationError);
                toast.error(validationError);
            } else {
                setCreateTagError(errorMsg);
                toast.error(errorMsg);
            }
        } finally {
            setIsCreatingTag(false);
        }
    };

    // Handler to toggle a tag in the filter state
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

    // Handler to clear all tag filters
    const clearTagFilters = () => {
        setSelectedFilterTags([]);
    };

    // Handler to select a note
    const handleSelectNote = useCallback(
        (noteId: number) => {
            const note = notes.find((n) => n.id === noteId);
            if (note) {
                setActiveNoteId(noteId);
                setNoteTitle(note.title);
                setNoteContent(note.content);
                setIsCreatingNew(false);

                // Update URL based on selected note's method
                const currentMethodId = note.learning_technic_id;
                if (currentMethodId && currentMethodId > 0 && currentMethodId !== methodIdNumber) {
                    router.visit(`/notepad?note=${noteId}&method=${currentMethodId}`, { preserveState: true, replace: true });
                } else if (!currentMethodId && methodIdNumber > 0) {
                    router.visit(`/notepad?note=${noteId}`, { preserveState: true, replace: true });
                } else if (!currentMethodId && !methodIdNumber) {
                    router.visit(`/notepad?note=${noteId}`, { preserveState: true, replace: true });
                }
            }
        },
        [notes, methodIdNumber],
    );

    // Handler to create a new note
    const handleNewNote = () => {
        setActiveNoteId(null);
        setNoteTitle('Untitled Note');
        setNoteContent('');
        setIsCreatingNew(true);

        if (methodIdNumber > 0) {
            router.visit('/notepad', { preserveState: true, replace: true });
        }
    };

    // Toggle file explorer
    const toggleFileExplorer = () => {
        setShowFileExplorer((prev) => !prev);
    };

    // Toggle method panel
    const toggleMethodPanel = () => {
        setShowMethodPanel((prev) => !prev);
    };

    // Save note
    const handleSaveNote = async () => {
        if (!noteTitle.trim()) return;
        setIsSaving(true);

        // Get the current note with updated tags from the notes array
        const currentNote = notes.find((note) => note.id === activeNoteId);
        const currentTags = currentNote?.tags || [];

        // Filter out any null or invalid tag IDs
        const validTagIds = currentTags
            .filter((tag) => tag && tag.id) // Ensure tag exists and has an id
            .map((tag) => tag.id);

        const noteData = {
            title: noteTitle.trim(),
            content: noteContent,
            learning_technic_id: methodIdNumber === 0 ? null : methodIdNumber,
            tags: validTagIds,
        };

        const csrfToken = await getXsrfToken();

        try {
            let response;
            // Type the response to match the API response structure
            interface NoteResponse {
                data: {
                    id: number;
                    title: string;
                    content: string;
                    learning_technic_id: number | null;
                    tags: number[];
                    created_at: string;
                    updated_at: string;
                };
            }

            if (activeNoteId) {
                // Update existing note
                response = await axios.put<NoteResponse>(`/api/notes/${activeNoteId}`, noteData, {
                    headers: { 'X-XSRF-TOKEN': csrfToken },
                });
                const savedNote = response.data.data;

                // Convert tag IDs to full tag objects
                const fullTags = savedNote.tags
                    .map((tagId) => allTags.find((tag) => tag.id === tagId))
                    .filter((tag): tag is Tag => tag !== undefined);

                // Update the notes state with the saved note and full tag objects
                setNotes((prevNotes) => prevNotes.map((note) => (note.id === activeNoteId ? { ...savedNote, tags: fullTags } : note)));

                toast.success('Note updated successfully!');
            } else {
                // Create new note
                response = await axios.post<NoteResponse>('/api/notes', noteData, {
                    headers: { 'X-XSRF-TOKEN': csrfToken },
                });
                const savedNote = response.data.data;

                // Convert tag IDs to full tag objects
                const fullTags = savedNote.tags
                    .map((tagId) => allTags.find((tag) => tag.id === tagId))
                    .filter((tag): tag is Tag => tag !== undefined);

                // Add the new note to the beginning of the notes array with full tag objects
                setNotes((prevNotes) => [{ ...savedNote, tags: fullTags }, ...prevNotes]);
                setActiveNoteId(savedNote.id);
                setNoteTitle(savedNote.title);

                // Update URL to reflect the new note ID and method (if applicable)
                const newUrl = `/notepad?note=${savedNote.id}` + (savedNote.learning_technic_id ? `&method=${savedNote.learning_technic_id}` : '');
                router.visit(newUrl, { preserveState: true, preserveScroll: true, replace: true });

                toast.success('Note created successfully!');
            }
        } catch (error: any) {
            console.error('Error saving note:', error);
            const errorMsg = error.response?.data?.message || 'Failed to save note.';
            toast.error(errorMsg);
        } finally {
            setIsSaving(false);
        }
    };

    // Delete note
    const handleDeleteNote = async () => {
        if (!activeNoteId || isDeleting) {
            return;
        }

        if (!window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
            return;
        }

        setIsDeleting(true);
        setNotesError(null);
        const csrfToken = await getXsrfToken();

        try {
            const response = await axios.delete(`/api/notes/${activeNoteId}`, {
                headers: { 'X-XSRF-TOKEN': csrfToken },
            });

            toast.success('Note deleted successfully!');

            // Remove note from state
            setNotes((prevNotes) => prevNotes.filter((note) => note.id !== activeNoteId));

            // Clear editor and selection
            setActiveNoteId(null);
            setNoteTitle('');
            setNoteContent('');

            // Navigate back to base URL
            router.visit('/notepad', { preserveState: false, replace: true });
        } catch (error: any) {
            console.error('Error deleting note:', error);
            toast.error('Failed to delete note.');
        } finally {
            setIsDeleting(false);
        }
    };

    // Handler for method selection
    const handleMethodSelect = (methodId: number) => {
        // Update the learning_technic_id for the currently active note in the notes state
        if (activeNoteId) {
            setNotes((prevNotes) =>
                prevNotes.map((note) =>
                    note.id === activeNoteId
                        ? {
                              ...note,
                              learning_technic_id: methodId === 0 ? null : methodId,
                          }
                        : note,
                ),
            );
        }

        // Update URL without full reload
        const newUrl =
            methodId > 0
                ? `/notepad?method=${methodId}${activeNoteId ? '&note=' + activeNoteId : ''}`
                : `/notepad${activeNoteId ? '?note=' + activeNoteId : ''}`;

        router.visit(newUrl, { preserveState: true, replace: true });
    };

    // AI Review
    const handleAIReview = async () => {
        if (!activeNoteId) {
            toast.error('Please save your note before requesting AI review');
            return;
        }

        if (!noteContent || noteContent.trim().length < 10) {
            toast.error('Your note is too short for a meaningful AI review');
            return;
        }

        setIsReviewingWithAI(true);
        setAiReviewError(null);
        setAiReviewResult(null);

        try {
            const csrfToken = await getXsrfToken();
            const loadingToast = toast.loading('Analyzing your note with AI...', { id: 'ai-review' });

            const response = await axios.post(
                `/api/notes/${activeNoteId}/rate`,
                {}, // No body needed for this request
                { headers: { 'X-XSRF-TOKEN': csrfToken } },
            );

            if (response.data.success) {
                toast.success('AI review completed', { id: 'ai-review' });
                setAiReviewResult({
                    rating: response.data.rating,
                    feedback: response.data.feedback,
                });
                setShowAIReviewDialog(true);
            } else {
                throw new Error(response.data.error || 'Failed to get AI review');
            }
        } catch (error: any) {
            console.error('Error getting AI review:', error);
            const errorMsg = error.response?.data?.error || error.message || 'Failed to get AI review';
            setAiReviewError(errorMsg);
            toast.error(errorMsg, { id: 'ai-review' });
        } finally {
            setIsReviewingWithAI(false);
        }
    };

    // Filter notes by search term AND selected tags
    const filteredNotes = notes.filter((note) => {
        const searchTermLower = searchTerm.toLowerCase();
        const titleMatch = note.title.toLowerCase().includes(searchTermLower);
        const searchMatch = titleMatch;

        const tagsMatch =
            selectedFilterTags.length === 0 || selectedFilterTags.every((filterTag) => note.tags?.some((noteTag) => noteTag.id === filterTag.id));

        return searchMatch && tagsMatch;
    });

    const closeTipWidget = () => {
        setShowTipWidget(false);
    };

    return {
        // States
        notes: filteredNotes,
        isLoadingNotes,
        notesError,
        allTags,
        isLoadingTags,
        tagsError,
        selectedFilterTags,
        newTagName,
        isCreatingTag,
        createTagError,
        activeNote,
        activeNoteId,
        noteTitle,
        noteContent,
        isCreatingNew,
        isSaving,
        isDeleting,
        showFileExplorer,
        showMethodPanel,
        searchTerm,
        fetchedLearningMethods,
        isLoadingMethods,
        methodsError,
        methodIdNumber,
        selectedMethod,
        showTipWidget,
        isReviewingWithAI,
        showAIReviewDialog,
        aiReviewResult,
        aiReviewError,

        // Actions
        handleTagToggle,
        handleCreateTag,
        handleFilterTagToggle,
        clearTagFilters,
        handleSelectNote,
        handleNewNote,
        toggleFileExplorer,
        toggleMethodPanel,
        handleSaveNote,
        handleDeleteNote,
        handleMethodSelect,
        handleAIReview,
        setNoteTitle,
        setNoteContent,
        setNewTagName,
        setSearchTerm,
        setShowAIReviewDialog,
        closeTipWidget,
    };
};
