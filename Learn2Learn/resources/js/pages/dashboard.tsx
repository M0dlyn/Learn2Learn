import { useState, useEffect } from "react";
// Keep Inertia import if used elsewhere, or update based on Inertia version
import { Inertia } from '@inertiajs/inertia';
import { usePage } from "@inertiajs/react";
// Ensure LearningTechnic type is correctly imported from your types file
import { type SharedData, type LearningTechnic } from "@/types";
import { Clock, FileText, BookMarked, ListTodo, Lightbulb, LayoutGrid } from "lucide-react"; // Keep icons
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from '../components/navbar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";

// Mapping from LearningTechnic ID to Lucide Icon Component
// *** IMPORTANT: Adjust IDs/Icons below as necessary based on your actual database IDs ***
const technicIcons: { [key: number]: React.ElementType } = {
    1: Clock,       // Assuming ID 1 is Pomodoro Technique
    2: ListTodo,    // Assuming ID 2 is Spaced Repetition
    3: BookMarked,  // Assuming ID 3 is Feynman Technique
    4: Lightbulb,   // Assuming ID 4 is Active Recall
    5: LayoutGrid,  // Assuming ID 5 is Mind Mapping
    6: FileText,    // Assuming ID 6 is Cornell Method
    // Add mappings for any other techniques by their database ID
};

export default function DashboardPage() {
    // Get auth data from props
    const { auth } = usePage<SharedData>().props;

    // State for storing techniques fetched from API
    const [learningTechnics, setLearningTechnics] = useState<LearningTechnic[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State for the dialog
    const [selectedTechnicId, setSelectedTechnicId] = useState<number | null>(null);

    // Helper function to get CSRF token from cookies
    function getXsrfToken() {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.split('=').map(c => c.trim());
            if (name === 'XSRF-TOKEN') {
                return decodeURIComponent(value);
            }
        }
        return null;
    }

    // Fetch data on component mount
    useEffect(() => {
        async function fetchTechniques() {
            setIsLoading(true);
            setError(null);
            try {
                // Use standard fetch or a library like axios
                const xsrfToken = getXsrfToken();
                const headers: HeadersInit = {
                    'Accept': 'application/json', // Important for API requests
                };
                
                if (xsrfToken) {
                    headers['X-XSRF-TOKEN'] = xsrfToken;
                }

                const response = await fetch('/api/learning-technics', {
                    credentials: 'include',
                    headers: headers
                });
                
                if (!response.ok) {
                    // Log the response text for more details on error
                    const errorText = await response.text();
                    console.error('API Error Response:', errorText);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                // Assuming the API returns { data: [...] } structure from ResourceCollection
                setLearningTechnics(data.data || []);
            } catch (err) {
                console.error("Failed to fetch learning techniques:", err);
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setIsLoading(false);
            }
        }

        fetchTechniques();
    }, []); // Empty dependency array means this runs once on mount

    const handleSelectMethod = (technicId: number) => {
        // Navigate to the notepad page, passing the selected method ID
        Inertia.visit(`/notepad?method=${technicId}`);
    };

    // Find the full selected technic object for the dialog based on its ID
    const selectedTechnic = selectedTechnicId
        ? learningTechnics.find(tech => tech.id === selectedTechnicId)
        : null;

    // Determine the icon for the selected technic in the dialog
    const SelectedIcon = selectedTechnic && technicIcons[selectedTechnic.id]
        ? technicIcons[selectedTechnic.id]
        : LayoutGrid; // Provide a default icon if mapping is missing

    return (
        <div className="flex min-h-screen flex-col bg-[#E0F2F1] text-[#263238] dark:bg-[#263238] dark:text-[#E0F2F1]">
            <Navbar />

            <div className="flex-1 flex flex-col items-center justify-center py-12">
                <div className="container px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold mb-2 text-[#00796B] dark:text-[#4DB6AC]">
                            Welcome to Learn2Learn, {auth.user.name}
                        </h1>
                        <p className="text-[#263238]/80 dark:text-[#E0F2F1]/80">
                            Select a learning technique below to get started with your notes.
                        </p>
                    </div>

                    {/* Display loading state */}
                    {isLoading && (
                        <div className="text-center mt-8 text-[#00796B] dark:text-[#4DB6AC]">
                            Loading techniques...
                        </div>
                    )}

                    {/* Display error state */}
                    {error && (
                        <div className="text-center mt-8 text-red-500">
                            Error loading techniques: {error}
                        </div>
                    )}

                    {/* Map over learningTechnics from state */}
                    {!isLoading && !error && (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full">
                            {learningTechnics.map((technic) => {
                                const IconComponent = technicIcons[technic.id] || LayoutGrid;
                                return (
                                    <Card
                                        key={technic.id}
                                        className="overflow-hidden hover:shadow-md transition-shadow border-[#4DB6AC]/30 bg-[#B2DFDB]/30 dark:bg-[#263238]/60 dark:border-[#4DB6AC]/20"
                                    >
                                        <CardHeader className="pb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-full p-2 bg-[#00796B] text-[#E0F2F1] dark:bg-[#4DB6AC] dark:text-[#263238]">
                                                    <IconComponent className="h-8 w-8" />
                                                </div>
                                                <CardTitle className="text-lg text-[#00796B] dark:text-[#4DB6AC]">
                                                    {technic.name}
                                                </CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pb-2">
                                            <CardDescription className="line-clamp-2 text-[#263238]/80 dark:text-[#E0F2F1]/80">
                                                {technic.short_desc}
                                            </CardDescription>
                                        </CardContent>
                                        <CardFooter className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                className="flex-1 border-[#00796B] text-[#00796B] hover:bg-[#4DB6AC]/30 hover:text-[#00796B] dark:border-[#4DB6AC] dark:text-[#4DB6AC] dark:hover:bg-[#00796B]/30 dark:hover:text-[#B2DFDB]"
                                                onClick={() => setSelectedTechnicId(technic.id)}
                                            >
                                                Learn More
                                            </Button>
                                            <Button
                                                className="flex-1 bg-[#00796B] text-[#E0F2F1] hover:bg-[#4DB6AC] dark:bg-[#4DB6AC] dark:text-[#263238] dark:hover:bg-[#B2DFDB]"
                                                onClick={() => handleSelectMethod(technic.id)}
                                            >
                                                Use Technique
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Dialog for displaying detailed information */}
            <Dialog open={selectedTechnicId !== null} onOpenChange={(open) => !open && setSelectedTechnicId(null)}>
                <DialogContent className="sm:max-w-md bg-[#E0F2F1] border-[#4DB6AC]/30 dark:bg-[#263238] dark:border-[#4DB6AC]/20">
                    {selectedTechnic && (
                        <>
                            <DialogHeader className="flex flex-row items-center gap-3">
                                <div className="rounded-full p-2 bg-[#00796B] text-[#E0F2F1] dark:bg-[#4DB6AC] dark:text-[#263238]">
                                    <SelectedIcon className="h-8 w-8" />
                                </div>
                                <DialogTitle className="text-[#00796B] dark:text-[#4DB6AC]">
                                    {selectedTechnic.name}
                                </DialogTitle>
                            </DialogHeader>
                            <DialogDescription className="mt-2 max-h-60 overflow-y-auto text-[#263238]/80 dark:text-[#E0F2F1]/80">
                                {selectedTechnic.detailed_desc}
                            </DialogDescription>
                            <div className="flex justify-end gap-2 mt-4">
                                <DialogClose asChild>
                                    <Button 
                                        variant="outline" 
                                        className="border-[#00796B] text-[#00796B] hover:bg-[#4DB6AC]/30 hover:text-[#00796B] dark:border-[#4DB6AC] dark:text-[#4DB6AC] dark:hover:bg-[#00796B]/30 dark:hover:text-[#B2DFDB]"
                                    >
                                        Close
                                    </Button>
                                </DialogClose>
                                <Button
                                    className="bg-[#00796B] text-[#E0F2F1] hover:bg-[#4DB6AC] dark:bg-[#4DB6AC] dark:text-[#263238] dark:hover:bg-[#B2DFDB]"
                                    onClick={() => {
                                        handleSelectMethod(selectedTechnic.id);
                                        setSelectedTechnicId(null);
                                    }}
                                >
                                    Use This Technique
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}