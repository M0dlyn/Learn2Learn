import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Brain } from 'lucide-react';
import React from 'react';
import { AIReviewResult } from './types';

interface AIReviewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    result: AIReviewResult | null;
    error: string | null;
}

export const AIReviewDialog: React.FC<AIReviewDialogProps> = ({ open, onOpenChange, result, error }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border-[#4DB6AC]/50 bg-[#E0F2F1] text-[#263238] sm:max-w-md dark:bg-[#263238] dark:text-[#E0F2F1]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-[#00796B] dark:text-[#4DB6AC]">
                        <Brain className="h-5 w-5" />
                        Gemini AI Note Review
                    </DialogTitle>
                    <DialogDescription className="text-[#263238]/70 dark:text-[#B2DFDB]/70">
                        AI-powered analysis of your note's quality and effectiveness.
                    </DialogDescription>
                </DialogHeader>

                {result && (
                    <div className="my-2 space-y-4">
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-[#00796B] dark:text-[#4DB6AC]">Rating</h3>
                            <div className="rounded-md border border-[#4DB6AC]/30 bg-[#4DB6AC]/10 p-3 text-[#263238] dark:text-[#E0F2F1]">
                                {result.rating !== undefined && result.rating !== null ? `${result.rating}/10` : 'No rating available'}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-[#00796B] dark:text-[#4DB6AC]">Feedback</h3>
                            <div className="max-h-64 overflow-y-auto rounded-md border border-[#4DB6AC]/30 bg-[#4DB6AC]/10 p-3 whitespace-pre-wrap text-[#263238] dark:text-[#E0F2F1]">
                                {result.feedback}
                            </div>
                        </div>
                    </div>
                )}

                {error && <div className="my-2 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-red-600 dark:text-red-400">{error}</div>}

                <div className="mt-4 flex justify-end gap-2">
                    <Button
                        onClick={() => onOpenChange(false)}
                        className="bg-[#00796B] text-[#E0F2F1] hover:bg-[#00796B]/90 dark:bg-[#4DB6AC] dark:text-[#263238] dark:hover:bg-[#B2DFDB]"
                    >
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
