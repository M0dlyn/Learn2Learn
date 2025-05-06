/** @type {import('tailwindcss').Config} */
export default {
    content: ['./resources/**/*.{js,ts,jsx,tsx}', './resources/views/**/*.blade.php'],
    darkMode: 'class',
    theme: {
        extend: {
            typography: {
                DEFAULT: {
                    css: {
                        'code::before': {
                            content: '""',
                        },
                        'code::after': {
                            content: '""',
                        },
                        code: {
                            color: '#00796B',
                            backgroundColor: '#E0F2F1',
                            padding: '0.2em 0.4em',
                            borderRadius: '0.25rem',
                            fontWeight: '400',
                        },
                        'pre code': {
                            backgroundColor: 'transparent',
                            padding: '0',
                            color: 'inherit',
                        },
                        pre: {
                            backgroundColor: '#E0F2F1',
                            color: '#263238',
                            padding: '1em',
                            borderRadius: '0.5rem',
                            overflowX: 'auto',
                        },
                        'pre code': {
                            backgroundColor: 'transparent',
                            padding: '0',
                            color: 'inherit',
                        },
                        table: {
                            width: '100%',
                            borderCollapse: 'collapse',
                            marginTop: '1em',
                            marginBottom: '1em',
                        },
                        'thead th': {
                            backgroundColor: '#B2DFDB',
                            color: '#263238',
                            fontWeight: '600',
                            padding: '0.75em',
                            borderBottom: '2px solid #4DB6AC',
                        },
                        'tbody td': {
                            padding: '0.75em',
                            borderBottom: '1px solid #4DB6AC',
                        },
                        'tbody tr:last-child td': {
                            borderBottom: 'none',
                        },
                        'tbody tr:nth-child(even)': {
                            backgroundColor: '#E0F2F1',
                        },
                        blockquote: {
                            borderLeftColor: '#4DB6AC',
                            backgroundColor: '#E0F2F1',
                            padding: '1em',
                            borderRadius: '0.25rem',
                        },
                        'blockquote p': {
                            margin: '0',
                        },
                        'ul li::marker': {
                            color: '#00796B',
                        },
                        'ol li::marker': {
                            color: '#00796B',
                        },
                        'h1, h2, h3, h4, h5, h6': {
                            color: '#00796B',
                        },
                        a: {
                            color: '#00796B',
                            textDecoration: 'underline',
                            '&:hover': {
                                color: '#004D40',
                            },
                        },
                    },
                },
            },
        },
    },
    plugins: [require('@tailwindcss/typography')],
};
