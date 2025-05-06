import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Filter, Loader2, Plus, Search } from 'lucide-react';
import React from 'react';
import { Note, Tag } from './types';

interface NotesListProps {
    notes: Note[];
    isLoadingNotes: boolean;
    notesError: string | null;
    activeNoteId: number | null;
    onSelectNote: (noteId: number) => void;
    onNewNote: () => void;
    allTags: Tag[];
    isLoadingTags: boolean;
    tagsError: string | null;
    selectedFilterTags: Tag[];
    onFilterTagToggle: (tag: Tag) => void;
    onClearTagFilters: () => void;
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
}

export const NotesList: React.FC<NotesListProps> = ({
    notes,
    isLoadingNotes,
    notesError,
    activeNoteId,
    onSelectNote,
    onNewNote,
    allTags,
    isLoadingTags,
    tagsError,
    selectedFilterTags,
    onFilterTagToggle,
    onClearTagFilters,
    searchTerm,
    onSearchTermChange,
}) => {
    // Filter notes by search term AND selected tags
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

    return (
        <div className="flex w-64 flex-col border-r border-[#4DB6AC]/30 bg-[#B2DFDB] dark:bg-[#37474F]">
            <div className="flex items-center justify-between border-b border-[#4DB6AC]/30 p-2">
                <span className="text-sm font-medium text-[#00796B] dark:text-[#4DB6AC]">Files</span>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-[#263238] dark:text-[#E0F2F1]"
                        onClick={() => {
                            const searchInput = prompt('Search notes:', searchTerm);
                            if (searchInput !== null) {
                                onSearchTermChange(searchInput);
                            }
                        }}
                    >
                        <Search className="h-3.5 w-3.5" />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative h-6 w-6 text-[#263238]/70 hover:text-[#263238] dark:text-[#E0F2F1]/70 dark:hover:text-[#E0F2F1]"
                            >
                                <Filter className="h-4 w-4" />
                                {selectedFilterTags.length > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-[#00796B] text-xs text-white dark:bg-[#4DB6AC]">
                                        {selectedFilterTags.length}
                                    </span>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-56 border-[#4DB6AC]/50 bg-[#E0F2F1] text-[#263238] dark:bg-[#37474F] dark:text-[#E0F2F1]"
                        >
                            <DropdownMenuLabel className="text-[#00796B] dark:text-[#4DB6AC]">Filter by Tag</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-[#4DB6AC]/50" />

                            {isLoadingTags ? (
                                <div className="flex justify-center p-2">
                                    <Loader2 className="h-4 w-4 animate-spin text-[#00796B] dark:text-[#4DB6AC]" />
                                </div>
                            ) : tagsError ? (
                                <p className="p-2 text-center text-xs text-red-600 dark:text-red-400">{tagsError}</p>
                            ) : allTags.length === 0 ? (
                                <p className="p-2 text-center text-xs text-[#263238]/60 dark:text-[#E0F2F1]/60">No tags available</p>
                            ) : (
                                <>
                                    {allTags.map((tag) => {
                                        const isSelected = selectedFilterTags.some((t) => t.id === tag.id);
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={tag.id}
                                                checked={isSelected}
                                                onCheckedChange={() => onFilterTagToggle(tag)}
                                                className={`${isSelected ? 'bg-[#00796B]/10 dark:bg-[#4DB6AC]/10' : ''}`}
                                            >
                                                {tag.name}
                                            </DropdownMenuCheckboxItem>
                                        );
                                    })}
                                    {selectedFilterTags.length > 0 && (
                                        <>
                                            <DropdownMenuSeparator className="bg-[#4DB6AC]/50" />
                                            <DropdownMenuItem
                                                onClick={onClearTagFilters}
                                                className="justify-center text-[#00796B] hover:text-[#00796B]/90 dark:text-[#4DB6AC] dark:hover:text-[#4DB6AC]/90"
                                            >
                                                Clear Filters
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-[#263238] dark:text-[#E0F2F1]" onClick={onNewNote}>
                        <Plus className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-2">
                    {isLoadingNotes && <p className="p-4 text-center text-[#00796B]/80 dark:text-[#B2DFDB]/80">Loading notes...</p>}
                    {notesError && <p className="p-4 text-center text-red-500 dark:text-red-400">Error: {notesError}</p>}
                    {!isLoadingNotes && !notesError && (
                        <ul className="space-y-1">
                            {filteredNotes.map((note) => (
                                <li key={note.id}>
                                    <Button
                                        variant={activeNoteId === note.id ? 'secondary' : 'ghost'}
                                        className={`h-auto w-full justify-start px-3 py-2 text-left whitespace-normal ${
                                            activeNoteId === note.id
                                                ? 'border-l-2 border-[#00796B] bg-[#00796B]/20 text-[#263238] dark:border-[#4DB6AC] dark:bg-[#4DB6AC]/20 dark:text-[#E0F2F1]'
                                                : 'text-[#263238]/80 hover:bg-[#00796B]/10 hover:text-[#263238] dark:text-[#B2DFDB] dark:hover:bg-[#4DB6AC]/10 dark:hover:text-[#E0F2F1]'
                                        }`}
                                        onClick={() => onSelectNote(note.id)}
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
    );
};
