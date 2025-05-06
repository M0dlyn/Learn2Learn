import { PomodoroTimer } from '@/components/pomodoro-timer';
import React from 'react';
import { LearningMethod } from './types';

// Active Recall learning method display
export const ActiveRecallDisplay: React.FC<{ method?: LearningMethod }> = ({ method }) => (
    <div className="space-y-4 rounded-md border border-[#4DB6AC]/30 bg-[#4DB6AC]/10 p-4">
        <h3 className="text-lg font-medium text-[#00796B] dark:text-[#4DB6AC]">{method?.name || 'Active Recall'}</h3>

        {method && (
            <>
                <div>
                    <h4 className="mb-1 text-sm font-medium text-[#00796B] dark:text-[#4DB6AC]">Description</h4>
                    <p className="text-sm text-[#263238] dark:text-[#E0F2F1]">{method.short_desc}</p>
                </div>

                <div>
                    <h4 className="mb-1 text-sm font-medium text-[#00796B] dark:text-[#4DB6AC]">How to use</h4>
                    <p className="text-sm whitespace-pre-wrap text-[#263238] dark:text-[#E0F2F1]">{method.how_to_use}</p>
                </div>
            </>
        )}
    </div>
);

// Spaced Repetition learning method display
export const SpacedRepetitionDisplay: React.FC<{ method?: LearningMethod }> = ({ method }) => (
    <div className="space-y-4 rounded-md border border-[#4DB6AC]/30 bg-[#4DB6AC]/10 p-4">
        <h3 className="text-lg font-medium text-[#00796B] dark:text-[#4DB6AC]">{method?.name || 'Spaced Repetition'}</h3>

        {method && (
            <>
                <div>
                    <h4 className="mb-1 text-sm font-medium text-[#00796B] dark:text-[#4DB6AC]">Description</h4>
                    <p className="text-sm text-[#263238] dark:text-[#E0F2F1]">{method.short_desc}</p>
                </div>

                <div>
                    <h4 className="mb-1 text-sm font-medium text-[#00796B] dark:text-[#4DB6AC]">How to use</h4>
                    <p className="text-sm whitespace-pre-wrap text-[#263238] dark:text-[#E0F2F1]">{method.how_to_use}</p>
                </div>
            </>
        )}
    </div>
);

// Other learning method components
export const BlurtingDisplay: React.FC<{ method?: LearningMethod }> = ({ method }) => (
    <div className="bg-secondary/10 text-secondary-foreground mt-4 rounded border p-4">
        <p className="text-sm italic">(Interactive Blurting Method Component Placeholder)</p>
    </div>
);

export const HighlightRevisitDisplay: React.FC<{ method?: LearningMethod }> = ({ method }) => (
    <div className="bg-secondary/10 text-secondary-foreground mt-4 rounded border p-4">
        <p className="text-sm italic">(Interactive Highlight & Revisit Component Placeholder)</p>
    </div>
);

export const TwoColumnNotesDisplay: React.FC<{ method?: LearningMethod }> = ({ method }) => (
    <div className="bg-secondary/10 text-secondary-foreground mt-4 rounded border p-4">
        <p className="text-sm italic">(Interactive Two Column Notes Component Placeholder)</p>
    </div>
);

// Component mapping to render different learning methods
export const techniqueComponentMap: { [key: string]: React.FC<{ method?: LearningMethod }> } = {
    'Pomodoro Technique': PomodoroTimer as React.FC<{ method?: LearningMethod }>,
    'Active Recall': ActiveRecallDisplay,
    'Spaced Repetition': SpacedRepetitionDisplay,
    'Blurting Method': BlurtingDisplay,
    'Highlight & Revisit': HighlightRevisitDisplay,
    'Two Column Notes': TwoColumnNotesDisplay,
};

// Generic component to render any learning method based on its name
export const LearningMethodDisplay: React.FC<{ method: LearningMethod | null }> = ({ method }) => {
    if (!method) return null;

    // Try exact match first
    let TechniqueComponent = techniqueComponentMap[method.name];

    // If no exact match, try a fuzzy match based on substrings
    if (!TechniqueComponent) {
        const methodNameLower = method.name.toLowerCase();
        const matchingKey = Object.keys(techniqueComponentMap).find(
            (key) => key.toLowerCase().includes(methodNameLower) || methodNameLower.includes(key.toLowerCase()),
        );

        if (matchingKey) {
            console.log(`Using component for "${matchingKey}" to display "${method.name}"`);
            TechniqueComponent = techniqueComponentMap[matchingKey];
        }
    }

    // If we found a matching component, use it; otherwise, display a generic info panel
    if (TechniqueComponent) {
        return <TechniqueComponent method={method} />;
    } else {
        // Fallback display for methods without specific components
        return (
            <div className="space-y-4 rounded-md border border-[#4DB6AC]/30 bg-[#4DB6AC]/10 p-4">
                <h3 className="text-lg font-medium text-[#00796B] dark:text-[#4DB6AC]">{method.name}</h3>

                <div>
                    <h4 className="mb-1 text-sm font-medium text-[#00796B] dark:text-[#4DB6AC]">Description</h4>
                    <p className="text-sm text-[#263238] dark:text-[#E0F2F1]">{method.detailed_desc}</p>
                </div>

                <div>
                    <h4 className="mb-1 text-sm font-medium text-[#00796B] dark:text-[#4DB6AC]">How to use</h4>
                    <p className="text-sm whitespace-pre-wrap text-[#263238] dark:text-[#E0F2F1]">
                        {method.how_to_use || 'No detailed instructions available.'}
                    </p>
                </div>
            </div>
        );
    }
};
