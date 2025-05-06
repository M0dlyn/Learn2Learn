import axios from 'axios';

// Helper function to get CSRF token
export const getXsrfToken = async () => {
    // Re-implement logic to retrieve XSRF-TOKEN from cookies or wherever it's stored
    // Example using standard cookie parsing:
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.split('=').map((c) => c.trim());
        if (name === 'XSRF-TOKEN') {
            return decodeURIComponent(value);
        }
    }
    // Attempt to fetch if not found (common pattern with Laravel Sanctum)
    try {
        await axios.get('/sanctum/csrf-cookie');
        // Retry getting the cookie
        const updatedCookies = document.cookie.split(';');
        for (let cookie of updatedCookies) {
            const [name, value] = cookie.split('=').map((c) => c.trim());
            if (name === 'XSRF-TOKEN') {
                return decodeURIComponent(value);
            }
        }
    } catch (error) {
        console.error('Error fetching CSRF cookie:', error);
    }
    console.error('XSRF Token not found.'); // Add error handling
    return null;
};

// Helper function to get a consistent color for a tag
export const getTagColor = (tagId: number): string => {
    const colors = [
        'bg-red-500/20 text-red-700 border-red-500/30 hover:bg-red-500/30',
        'bg-blue-500/20 text-blue-700 border-blue-500/30 hover:bg-blue-500/30',
        'bg-green-500/20 text-green-700 border-green-500/30 hover:bg-green-500/30',
        'bg-yellow-500/20 text-yellow-700 border-yellow-500/30 hover:bg-yellow-500/30',
        'bg-purple-500/20 text-purple-700 border-purple-500/30 hover:bg-purple-500/30',
        'bg-indigo-500/20 text-indigo-700 border-indigo-500/30 hover:bg-indigo-500/30',
        'bg-pink-500/20 text-pink-700 border-pink-500/30 hover:bg-pink-500/30',
        'bg-teal-500/20 text-teal-700 border-teal-500/30 hover:bg-teal-500/30',
    ];
    return colors[tagId % colors.length];
};
