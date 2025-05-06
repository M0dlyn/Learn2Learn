export interface Tag {
    id: number;
    name: string;
    // Add color later if provided by API
}

export interface Note {
    id: number;
    title: string;
    content: string;
    learning_technic_id: number | null; // Allow null for no method
    tags: Tag[];
    created_at: string;
    updated_at: string;
    // Add other fields if returned by the API and needed, e.g., user_id
}

// Define interface for Learning Method data from API
export interface LearningMethod {
    id: number;
    name: string;
    short_desc: string;
    detailed_desc: string;
    how_to_use: string;
    category?: string; // Optional fields as needed
    created_at?: string;
    updated_at?: string;
}

export interface AIReviewResult {
    rating?: number | null;
    feedback: string;
}
