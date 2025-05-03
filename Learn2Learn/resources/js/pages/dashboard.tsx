import { useState, useEffect } from "react";

import { Inertia } from '@inertiajs/inertia';
import { usePage } from "@inertiajs/react";

import { type SharedData, type LearningTechnic } from "@/types";
import { Clock, FileText, BookMarked, ListTodo, Lightbulb, LayoutGrid, Tag as TagIcon } from "lucide-react"; // Keep icons, add TagIcon

import { Clock, FileText, BookMarked, ListTodo, Lightbulb, LayoutGrid } from "lucide-react"; 

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
const technicIcons: { [key: number]: React.ElementType } = {
    1: Clock,       
    2: ListTodo,    
    3: BookMarked,  
    4: Lightbulb,   
    5: LayoutGrid,  
    6: FileText,    
};

// Define simple interfaces for Note and Tag - ideally move to @/types
interface Tag {
    id: number;
    name: string;
}

interface Note {
    id: number;
    title: string;
    content: string; 
    learning_technic_id: number;
    tags: Tag[];
    created_at: string;
    updated_at: string;
}

export default function DashboardPage() {

    // Get auth data from props
    const { auth } = usePage<SharedData>().props;

    // State for storing techniques fetched from API
    const [learningTechnics, setLearningTechnics] = useState<LearningTechnic[]>([]);
    const [isLoadingTechnics, setIsLoadingTechnics] = useState(true); // Renamed for clarity
    const [technicsError, setTechnicsError] = useState<string | null>(null); // Renamed for clarity

    // State for storing notes fetched from API
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoadingNotes, setIsLoadingNotes] = useState(true);
    const [notesError, setNotesError] = useState<string | null>(null);

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
        async function fetchData() {
            // Fetch Techniques
            setIsLoadingTechnics(true);
            setTechnicsError(null);
            try {
                const xsrfToken = getXsrfToken();
                const headers: HeadersInit = {
                    'Accept': 'application/json',
                
                const xsrfToken = getXsrfToken();
                const headers: HeadersInit = {
                    'Accept': 'application/json', 
                };
                if (xsrfToken) {
                    headers['X-XSRF-TOKEN'] = xsrfToken;
                }

                const response = await fetch('/api/learning-technics', {
                    credentials: 'include',
                    headers: headers
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('API Error Response (Techniques):', errorText);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                setLearningTechnics(data.data || []);
            } catch (err) {
                console.error("Failed to fetch learning techniques:", err);
                setTechnicsError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setIsLoadingTechnics(false);
            }

            // Fetch Notes
            setIsLoadingNotes(true);
            setNotesError(null);
            try {
                // Reuse headers and token logic
                const xsrfToken = getXsrfToken(); // Re-get in case of expiry, though unlikely needed here
                const headers: HeadersInit = {
                    'Accept': 'application/json',
                };
                if (xsrfToken) {
                    headers['X-XSRF-TOKEN'] = xsrfToken;
                }

                const notesResponse = await fetch('/api/notes', { // Fetch notes
                    credentials: 'include',
                    headers: headers
                });
                if (!notesResponse.ok) {
                    const errorText = await notesResponse.text();
                    console.error('API Error Response (Notes):', errorText);
                    throw new Error(`HTTP error! status: ${notesResponse.status}`);
                }
                const notesData = await notesResponse.json();
                // Assuming the API returns { data: [...] } structure from ResourceCollection
                setNotes(notesData.data || []);
            } catch (err) {
                console.error("Failed to fetch notes:", err);
                setNotesError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setIsLoadingNotes(false);
            }
        }

        fetchData();
    }, []); // Empty dependency array means this runs once on mount
        fetchTechniques();
    }, []); 

    const handleSelectMethod = (technicId: number) => {
        
        Inertia.visit(`/notepad?method=${technicId}`);
    };

    
    const selectedTechnic = selectedTechnicId
        ? learningTechnics.find(tech => tech.id === selectedTechnicId)
        : null;

    
    const SelectedIcon = selectedTechnic && technicIcons[selectedTechnic.id]
        ? technicIcons[selectedTechnic.id]
        : LayoutGrid; 

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

                    {/* Display loading state for Techniques */}
                    {isLoadingTechnics && (
                        <div className="text-center mt-8 text-[#00796B] dark:text-[#4DB6AC]">
                            Loading techniques...
                        </div>
                    )}

                    {/* Display error state for Techniques */}
                    {technicsError && (
                        <div className="text-center mt-8 text-red-500">
                            Error loading techniques: {technicsError}
                        </div>
                    )}

                    {/* Map over learningTechnics from state */}
                    {!isLoadingTechnics && !technicsError && (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full mb-12"> {/* Added margin-bottom */} 

                    {!isLoading && !error && (
                        <div className="grid gap-6 lg:grid-cols-3 w-full">
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

                    {/* --- Notes Section --- */} 
                    <div className="w-full mt-12"> {/* Add margin-top */} 
                        <h2 className="text-2xl font-semibold mb-6 text-center text-[#00796B] dark:text-[#4DB6AC]">
                            Your Recent Notes
                        </h2>

                        {/* Display loading state for Notes */} 
                        {isLoadingNotes && (
                            <div className="text-center text-[#00796B] dark:text-[#4DB6AC]">
                                Loading notes...
                            </div>
                        )}

                        {/* Display error state for Notes */} 
                        {notesError && (
                            <div className="text-center text-red-500">
                                Error loading notes: {notesError}
                            </div>
                        )}

                        {/* Display Notes */} 
                        {!isLoadingNotes && !notesError && (
                            notes.length > 0 ? (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
                                    {notes.map((note) => (
                                        <Card key={note.id} className="overflow-hidden hover:shadow-md transition-shadow border-[#4DB6AC]/30 bg-white/50 dark:bg-[#263238]/50 dark:border-[#4DB6AC]/20">
                                            <CardHeader>
                                                <CardTitle className="text-md text-[#00796B] dark:text-[#4DB6AC]">{note.title}</CardTitle>
                                                {/* Optional: Display a snippet of content */} 
                                                {/* <CardDescription className="text-sm line-clamp-2 text-[#263238]/70 dark:text-[#E0F2F1]/70 pt-1">
                                                    {note.content}
                                                </CardDescription> */} 
                                            </CardHeader>
                                            <CardContent className="pb-3">
                                                {note.tags && note.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {note.tags.map(tag => (
                                                            <span key={tag.id} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#4DB6AC]/20 text-[#00796B] dark:bg-[#00796B]/30 dark:text-[#B2DFDB]">
                                                                <TagIcon className="h-3 w-3 mr-1" />
                                                                {tag.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </CardContent>
                                            {/* Add CardFooter for actions later (Edit/Delete) */} 
                                            {/* <CardFooter className="flex justify-end gap-2">
                                                <Button size="sm" variant="ghost">Edit</Button>
                                                <Button size="sm" variant="destructive">Delete</Button>
                                            </CardFooter> */} 
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-[#263238]/70 dark:text-[#E0F2F1]/70">
                                    You haven't created any notes yet.
                                </p>
                            )
                        )}
                    </div>
                    {/* --- End Notes Section --- */} 
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
                            <DialogDescription className="mt-2 max-h-60 overflow-y-auto text-[#263238]/80 dark:text-[#E0F2F1]/80 whitespace-pre-wrap"> {/* Added whitespace-pre-wrap */} 
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