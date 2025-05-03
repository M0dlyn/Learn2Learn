import axios from 'axios';
import { Lightbulb, RefreshCw, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

interface Tip {
    id: number;
    tip: string;
}

interface TipWidgetProps {
    onClose?: () => void;
} 

export function TipWidget({ onClose }: TipWidgetProps) {
    const [currentTip, setCurrentTip] = useState<Tip | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRandomTip = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('/tips/random');
            if (response.data) {
                setCurrentTip(response.data);
            }
        } catch (err) {
            console.error('Failed to fetch a tip:', err);
            setError('Could not load a tip. Try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch a tip on initial load
    useEffect(() => {
        fetchRandomTip();

        // Set up interval to refresh tips (every 5 minutes)
        const intervalId = setInterval(fetchRandomTip, 5 * 60 * 1000);

        // Clean up the interval when component unmounts
        return () => clearInterval(intervalId);
    }, []);

    // Define animation style within the component
    const appearAnimation = `
    @keyframes appear {
      from {
        transform: scale(0.8);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
  `;

    return (
        <div
            className="fixed bottom-4 left-4 z-10"
            style={{
                transformOrigin: 'bottom left',
                animation: 'appear 0.3s ease-out',
            }}
        >
            <div className="flex flex-col">
                <div className="h-[70px] w-[280px] rounded-md border border-[#F0C33C] bg-[#FDFD96] text-gray-800 shadow-md">
                    <div className="flex h-full items-center px-3">
                        <Lightbulb className="mr-2 h-4 w-4 flex-shrink-0 text-amber-500" />
                        <div className="flex flex-wrap overflow-hidden">
                            <span className="mr-1 font-medium">tip:</span>
                            {loading ? (
                                <span className="text-gray-600 italic">Loading...</span>
                            ) : error ? (
                                <span className="text-sm text-red-500">{error}</span>
                            ) : currentTip ? (
                                <span className="line-clamp-2">{currentTip.tip}</span>
                            ) : (
                                <span className="text-gray-600 italic">No tips available.</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="mt-1 flex justify-end">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-md bg-amber-100 text-amber-700 hover:bg-amber-200"
                        onClick={fetchRandomTip}
                        disabled={loading}
                    >
                        <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    {onClose && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="ml-1 h-6 w-6 rounded-md bg-amber-100 text-amber-700 hover:bg-amber-200"
                            onClick={onClose}
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    )}
                </div>
            </div>
            <style dangerouslySetInnerHTML={{ __html: appearAnimation }} />
        </div>
    );
}
