import { useState } from "react";
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
    // Get learningTechnics from props passed by Laravel in routes/web.php
    const { auth, learningTechnics } = usePage<SharedData>().props;
    const [selectedTechnicId, setSelectedTechnicId] = useState<number | null>(null);

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
        <div className="flex min-h-screen flex-col bg-background">
            <Navbar />

            <main className="flex-1 container py-8 w-full">
                <div className="pt-8 text-center">
                    <h1 className="text-3xl font-bold mb-2 text-foreground">Welcome to Learn2Learn, {auth.user.name}</h1>
                    <p className="text-muted-foreground">Select a learning technique below to get started with your notes.</p>
                </div>

                {/* Map over learningTechnics fetched from the database (ONLY ONCE) */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-screen-xl mt-8">
                    {learningTechnics.map((technic) => {
                        // Get the corresponding icon or use a default
                        const IconComponent = technicIcons[technic.id] || LayoutGrid;
                        return (
                            <Card
                                key={technic.id}
                                className="overflow-hidden hover:shadow-md transition-shadow border-secondary bg-card"
                            >
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full p-2 bg-secondary text-accent-foreground">
                                            <IconComponent className="h-8 w-8" />
                                        </div>
                                        {/* Use data from prop */}
                                        <CardTitle className="text-lg">{technic.name}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="pb-2">
                                    {/* Use short description from prop */}
                                    <CardDescription className="line-clamp-2">{technic.short_desc}</CardDescription>
                                </CardContent>
                                <CardFooter className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        className="flex-1 border-accent hover:bg-accent hover:text-accent-foreground"
                                        onClick={() => setSelectedTechnicId(technic.id)} // Set state to open dialog
                                    >
                                        Learn More
                                    </Button>
                                    <Button
                                        className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                                        onClick={() => handleSelectMethod(technic.id)} // Navigate to notepad
                                    >
                                        Use Technique
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
                {/* The duplicate grid rendering block is removed */}
            </main>

            {/* Dialog for displaying detailed information */}
            <Dialog open={selectedTechnicId !== null} onOpenChange={(open) => !open && setSelectedTechnicId(null)}>
                <DialogContent className="sm:max-w-md bg-card">
                    {/* Ensure selectedTechnic is not null before rendering details */}
                    {selectedTechnic && (
                        <>
                            <DialogHeader className="flex flex-row items-center gap-3">
                                <div className="rounded-full p-2 bg-secondary text-accent-foreground">
                                   <SelectedIcon className="h-8 w-8" />
                                </div>
                                <DialogTitle>{selectedTechnic.name}</DialogTitle>
                            </DialogHeader>
                            {/* Use detailed description from prop */}
                            <DialogDescription className="mt-2 max-h-60 overflow-y-auto">
                                {selectedTechnic.detailed_desc}
                            </DialogDescription>
                            {/* Note: Benefits are not included as they weren't in the seeder/DB schema */}
                             <div className="flex justify-end gap-2 mt-4">
                                <DialogClose asChild>
                                    <Button variant="outline" className="border-accent">Close</Button>
                                </DialogClose>
                                <Button
                                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                                    onClick={() => {
                                        handleSelectMethod(selectedTechnic.id); // Navigate
                                        setSelectedTechnicId(null); // Close dialog after selection
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