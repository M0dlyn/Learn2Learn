import { TipWidget } from '@/components/tip-widget';
import { Badge } from '@/components/ui/badge';
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
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Brain, Clock, Loader2, Menu, MoreHorizontal, PlusCircle, Save, Trash2, Wand2, X } from 'lucide-react';
import React from 'react';
import { LearningMethodDisplay } from './LearningMethods';
import { LearningMethod, Note, Tag } from './types';
import { getTagColor } from './utils';

interface TagsDropdownProps {
    activeNote: Note | null;
    allTags: Tag[];
    isLoadingTags: boolean;
    tagsError: string | null;
    isCreatingTag: boolean;
    newTagName: string;
    createTagError: string | null;
    onNewTagNameChange: (name: string) => void;
    onCreateTag: (e: React.FormEvent) => void;
    onTagToggle: (tag: Tag) => void;
}

const TagsDropdown: React.FC<TagsDropdownProps> = ({
    activeNote,
    allTags,
    isLoadingTags,
    tagsError,
    isCreatingTag,
    newTagName,
    createTagError,
    onNewTagNameChange,
    onCreateTag,
    onTagToggle,
}) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button
                variant="ghost"
                size="sm"
                className="ml-2 h-6 w-6 p-0 text-[#00796B] hover:text-[#00796B]/80 disabled:opacity-50 dark:text-[#4DB6AC] dark:hover:text-[#B2DFDB]"
                disabled={isLoadingTags || !!tagsError}
            >
                <PlusCircle className="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="border-[#4DB6AC]/50 bg-[#E0F2F1] text-[#263238] dark:bg-[#37474F] dark:text-[#E0F2F1]">
            <DropdownMenuLabel className="text-[#00796B] dark:text-[#4DB6AC]">Manage Tags</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#4DB6AC]/50" />

            {/* Add Tag form */}
            <form onSubmit={onCreateTag} className="p-2">
                <div className="mb-2 flex gap-2">
                    <Input
                        placeholder="New tag name"
                        value={newTagName}
                        onChange={(e) => onNewTagNameChange(e.target.value)}
                        className="h-7 border-[#4DB6AC]/50 bg-transparent text-[#263238] dark:text-[#E0F2F1]"
                    />
                    <Button
                        type="submit"
                        size="sm"
                        disabled={isCreatingTag || !newTagName.trim()}
                        className="h-7 bg-[#00796B] text-[#E0F2F1] hover:bg-[#00796B]/90 dark:bg-[#4DB6AC] dark:text-[#263238] dark:hover:bg-[#B2DFDB]"
                    >
                        {isCreatingTag ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Add'}
                    </Button>
                </div>
                {createTagError && <p className="text-xs text-red-600 dark:text-red-400">{createTagError}</p>}
            </form>

            <DropdownMenuSeparator className="bg-[#4DB6AC]/50" />

            {/* Available tags list */}
            <div className="max-h-48 overflow-y-auto p-1">
                {isLoadingTags ? (
                    <div className="flex justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin text-[#00796B] dark:text-[#4DB6AC]" />
                    </div>
                ) : tagsError ? (
                    <p className="p-2 text-center text-xs text-red-600 dark:text-red-400">{tagsError}</p>
                ) : allTags.length === 0 ? (
                    <p className="p-2 text-center text-xs text-[#263238]/60 dark:text-[#E0F2F1]/60">No tags available</p>
                ) : (
                    allTags.map((tag) => {
                        const isActive = activeNote?.tags?.some((t) => t.id === tag.id);
                        return (
                            <DropdownMenuCheckboxItem
                                key={tag.id}
                                checked={isActive}
                                onCheckedChange={() => onTagToggle(tag)}
                                className={`${isActive ? 'bg-[#00796B]/10 dark:bg-[#4DB6AC]/10' : ''}`}
                            >
                                {tag.name}
                            </DropdownMenuCheckboxItem>
                        );
                    })
                )}
            </div>
        </DropdownMenuContent>
    </DropdownMenu>
);

interface NoteToolbarProps {
    noteTitle: string;
    onTitleChange: (title: string) => void;
    activeNote: Note | null;
    toggleFileExplorer: () => void;
    toggleMethodPanel: () => void;
    handleAIReview: () => void;
    isReviewingWithAI: boolean;
    isSaving: boolean;
    handleSaveNote: () => void;
    handleDeleteNote: () => void;
    isDeleting: boolean;
    selectedMethod: LearningMethod | null;
    showMethodPanel: boolean;
    isLoadingMethods: boolean;
    methodIdNumber: number;
    fetchedLearningMethods: LearningMethod[];
    handleMethodSelect: (methodId: number) => void;
    tagsDropdownProps: TagsDropdownProps;
}

const NoteToolbar: React.FC<NoteToolbarProps> = ({
    noteTitle,
    onTitleChange,
    activeNote,
    toggleFileExplorer,
    toggleMethodPanel,
    handleAIReview,
    isReviewingWithAI,
    isSaving,
    handleSaveNote,
    handleDeleteNote,
    isDeleting,
    selectedMethod,
    showMethodPanel,
    isLoadingMethods,
    methodIdNumber,
    fetchedLearningMethods,
    handleMethodSelect,
    tagsDropdownProps,
}) => (
    <div className="flex items-center justify-between border-b border-[#4DB6AC]/30 bg-[#B2DFDB] p-2 dark:bg-[#37474F]">
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-[#263238] dark:text-[#E0F2F1]" onClick={toggleFileExplorer}>
                <Menu className="h-4 w-4" />
            </Button>
            <Input
                value={noteTitle}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="Untitled"
                className="h-7 w-48 border-none bg-transparent px-1 font-medium text-[#263238] focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-[#E0F2F1]"
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
                    : activeNote && <span className="text-xs text-[#263238]/50 italic dark:text-[#E0F2F1]/50">No tags</span>}
                {/* Tag Management Dropdown */}
                {activeNote && <TagsDropdown {...tagsDropdownProps} />}
            </div>
        </div>
        {/* Toolbar buttons with updated colors */}
        <div className="flex items-center gap-2">
            {/* Method panel toggle button */}
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-[#263238] dark:text-[#E0F2F1]" onClick={toggleMethodPanel}>
                            <Clock className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        {selectedMethod ? selectedMethod.name : 'Method Panel'} - {showMethodPanel ? 'Hide' : 'Show'}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            {/* AI Review Button */}
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-[#00796B] hover:text-[#00796B]/80 dark:text-[#4DB6AC] dark:hover:text-[#B2DFDB]"
                            onClick={handleAIReview}
                            disabled={isReviewingWithAI || !activeNote?.id}
                        >
                            {isReviewingWithAI ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent className="border-[#4DB6AC]/50 bg-[#E0F2F1] text-[#263238] dark:bg-[#37474F] dark:text-[#E0F2F1]">
                        Review with Gemini AI
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            {/* Learning Method selection dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-[#00796B] hover:text-[#00796B]/80 dark:text-[#4DB6AC] dark:hover:text-[#B2DFDB]"
                        disabled={!activeNote?.id || isLoadingMethods}
                    >
                        {isLoadingMethods ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="w-56 border-[#4DB6AC]/50 bg-[#E0F2F1] text-[#263238] dark:bg-[#37474F] dark:text-[#E0F2F1]"
                >
                    <DropdownMenuLabel className="text-[#00796B] dark:text-[#4DB6AC]">Learning Method</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-[#4DB6AC]/50" />

                    {isLoadingMethods ? (
                        <div className="flex justify-center p-2">
                            <Loader2 className="h-4 w-4 animate-spin text-[#00796B] dark:text-[#4DB6AC]" />
                        </div>
                    ) : (
                        <>
                            <DropdownMenuCheckboxItem
                                checked={!methodIdNumber}
                                onCheckedChange={(checked) => {
                                    if (checked) handleMethodSelect(0);
                                }}
                            >
                                None
                            </DropdownMenuCheckboxItem>
                            {fetchedLearningMethods.map((method) => (
                                <DropdownMenuCheckboxItem
                                    key={method.id}
                                    checked={methodIdNumber === method.id}
                                    onCheckedChange={(checked) => {
                                        if (checked) handleMethodSelect(method.id);
                                    }}
                                    className={`${methodIdNumber === method.id ? 'bg-[#00796B]/10 dark:bg-[#4DB6AC]/10' : ''}`}
                                >
                                    {method.name}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Save button */}
            <Button variant="ghost" size="icon" className="h-7 w-7 text-[#263238] dark:text-[#E0F2F1]" onClick={handleSaveNote} disabled={isSaving}>
                <Save className={`h-4 w-4 ${isSaving ? 'animate-pulse' : ''}`} />
            </Button>

            {/* More options dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-[#263238] dark:text-[#E0F2F1]">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-[#4DB6AC]/50 bg-[#E0F2F1] text-[#263238] dark:bg-[#37474F] dark:text-[#E0F2F1]">
                    {activeNote?.id && (
                        <DropdownMenuItem
                            className="text-red-600 focus:text-red-700 dark:text-red-400 dark:focus:text-red-300"
                            onClick={handleDeleteNote}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Note
                                </>
                            )}
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </div>
);

interface LearningMethodPanelProps {
    showMethodPanel: boolean;
    toggleMethodPanel: () => void;
    selectedMethod: LearningMethod | null;
}

const LearningMethodPanel: React.FC<LearningMethodPanelProps> = ({ showMethodPanel, toggleMethodPanel, selectedMethod }) => {
    if (!showMethodPanel) return null;

    return (
        <div className="flex w-80 flex-col border-l border-[#4DB6AC]/30 bg-[#B2DFDB] dark:bg-[#37474F]">
            <div className="flex items-center justify-between border-b border-[#4DB6AC]/30 p-2">
                <span className="text-sm font-medium text-[#00796B] dark:text-[#4DB6AC]">
                    {selectedMethod ? selectedMethod.name : 'Learning Method'}
                </span>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-[#263238] dark:text-[#E0F2F1]" onClick={toggleMethodPanel}>
                    <X className="h-3.5 w-3.5" />
                </Button>
            </div>
            <div className="flex-1 overflow-auto p-2">
                <LearningMethodDisplay method={selectedMethod} />
            </div>
        </div>
    );
};

interface NoteEditorProps {
    activeNote: Note | null;
    noteTitle: string;
    noteContent: string;
    onTitleChange: (title: string) => void;
    onContentChange: (content: string) => void;
    toggleFileExplorer: () => void;
    toggleMethodPanel: () => void;
    handleAIReview: () => void;
    isReviewingWithAI: boolean;
    isSaving: boolean;
    handleSaveNote: () => void;
    handleDeleteNote: () => void;
    isDeleting: boolean;
    selectedMethod: LearningMethod | null;
    showMethodPanel: boolean;
    isLoadingMethods: boolean;
    methodIdNumber: number;
    fetchedLearningMethods: LearningMethod[];
    handleMethodSelect: (methodId: number) => void;
    showTipWidget: boolean;
    onCloseTipWidget: () => void;
    tagsDropdownProps: TagsDropdownProps;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
    activeNote,
    noteTitle,
    noteContent,
    onTitleChange,
    onContentChange,
    toggleFileExplorer,
    toggleMethodPanel,
    handleAIReview,
    isReviewingWithAI,
    isSaving,
    handleSaveNote,
    handleDeleteNote,
    isDeleting,
    selectedMethod,
    showMethodPanel,
    isLoadingMethods,
    methodIdNumber,
    fetchedLearningMethods,
    handleMethodSelect,
    showTipWidget,
    onCloseTipWidget,
    tagsDropdownProps,
}) => {
    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            <NoteToolbar
                noteTitle={noteTitle}
                onTitleChange={onTitleChange}
                activeNote={activeNote}
                toggleFileExplorer={toggleFileExplorer}
                toggleMethodPanel={toggleMethodPanel}
                handleAIReview={handleAIReview}
                isReviewingWithAI={isReviewingWithAI}
                isSaving={isSaving}
                handleSaveNote={handleSaveNote}
                handleDeleteNote={handleDeleteNote}
                isDeleting={isDeleting}
                selectedMethod={selectedMethod}
                showMethodPanel={showMethodPanel}
                isLoadingMethods={isLoadingMethods}
                methodIdNumber={methodIdNumber}
                fetchedLearningMethods={fetchedLearningMethods}
                handleMethodSelect={handleMethodSelect}
                tagsDropdownProps={tagsDropdownProps}
            />
            {showTipWidget && <TipWidget onClose={onCloseTipWidget} />}

            <div className="flex flex-1 overflow-hidden">
                {/* Note content editor */}
                <div className="flex-1 overflow-auto">
                    <textarea
                        value={noteContent}
                        onChange={(e) => onContentChange(e.target.value)}
                        placeholder="Start writing..."
                        className="h-full w-full resize-none bg-[#E0F2F1] p-4 text-[#263238] focus:outline-none dark:bg-[#263238] dark:text-[#E0F2F1]"
                    />
                </div>

                {/* Method panel */}
                {showMethodPanel && (
                    <LearningMethodPanel showMethodPanel={showMethodPanel} toggleMethodPanel={toggleMethodPanel} selectedMethod={selectedMethod} />
                )}
            </div>

            {/* Status bar */}
            <div className="flex items-center justify-between border-t border-[#4DB6AC]/30 bg-[#B2DFDB] px-3 py-1 text-xs text-[#263238] dark:bg-[#00796B] dark:text-[#B2DFDB]">
                <div>{activeNote?.id ? 'Last edited: ' + activeNote?.updated_at : 'New note'}</div>
                <div>{noteContent.split(/\s+/).filter(Boolean).length} words</div>
            </div>
        </div>
    );
};
