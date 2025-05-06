'use client';

import { Navbar } from '@/components/navbar';
import { AIReviewDialog } from '@/components/notepad/AIReviewDialog';
import { NoteEditor } from '@/components/notepad/NoteEditor';
import { NotesList } from '@/components/notepad/NotesList';
import { useNotepad } from '@/components/notepad/useNotepad';
import { Head } from '@inertiajs/react';
import { Toaster } from 'react-hot-toast';

export default function NotepadPage() {
    const notepad = useNotepad();

    // Prepare the props for the TagsDropdown component
    const tagsDropdownProps = {
        activeNote: notepad.activeNote,
        allTags: notepad.allTags,
        isLoadingTags: notepad.isLoadingTags,
        tagsError: notepad.tagsError,
        isCreatingTag: notepad.isCreatingTag,
        newTagName: notepad.newTagName,
        createTagError: notepad.createTagError,
        onNewTagNameChange: notepad.setNewTagName,
        onCreateTag: notepad.handleCreateTag,
        onTagToggle: notepad.handleTagToggle,
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
                        color: '#263238', // Dark text in light mode
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
                {notepad.showFileExplorer && (
                    <NotesList
                        notes={notepad.notes}
                        isLoadingNotes={notepad.isLoadingNotes}
                        notesError={notepad.notesError}
                        activeNoteId={notepad.activeNoteId}
                        onSelectNote={notepad.handleSelectNote}
                        onNewNote={notepad.handleNewNote}
                        allTags={notepad.allTags}
                        isLoadingTags={notepad.isLoadingTags}
                        tagsError={notepad.tagsError}
                        selectedFilterTags={notepad.selectedFilterTags}
                        onFilterTagToggle={notepad.handleFilterTagToggle}
                        onClearTagFilters={notepad.clearTagFilters}
                        searchTerm={notepad.searchTerm}
                        onSearchTermChange={notepad.setSearchTerm}
                    />
                )}

                {/* Main editor area */}
                <NoteEditor
                    activeNote={notepad.activeNote}
                    noteTitle={notepad.noteTitle}
                    noteContent={notepad.noteContent}
                    onTitleChange={notepad.setNoteTitle}
                    onContentChange={notepad.setNoteContent}
                    toggleFileExplorer={notepad.toggleFileExplorer}
                    toggleMethodPanel={notepad.toggleMethodPanel}
                    handleAIReview={notepad.handleAIReview}
                    isReviewingWithAI={notepad.isReviewingWithAI}
                    isSaving={notepad.isSaving}
                    handleSaveNote={notepad.handleSaveNote}
                    handleDeleteNote={notepad.handleDeleteNote}
                    isDeleting={notepad.isDeleting}
                    selectedMethod={notepad.selectedMethod}
                    showMethodPanel={notepad.showMethodPanel}
                    isLoadingMethods={notepad.isLoadingMethods}
                    methodIdNumber={notepad.methodIdNumber}
                    fetchedLearningMethods={notepad.fetchedLearningMethods}
                    handleMethodSelect={notepad.handleMethodSelect}
                    showTipWidget={notepad.showTipWidget}
                    onCloseTipWidget={notepad.closeTipWidget}
                    tagsDropdownProps={tagsDropdownProps}
                />
            </div>

            {/* AI Review Dialog */}
            <AIReviewDialog
                open={notepad.showAIReviewDialog}
                onOpenChange={notepad.setShowAIReviewDialog}
                result={notepad.aiReviewResult}
                error={notepad.aiReviewError}
            />
        </div>
    );
}
