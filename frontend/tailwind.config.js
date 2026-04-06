/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#7C3AED',
                secondary: '#2563EB',
                dark: '#1F2937',
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)',
            },
        },
    },
    plugins: [],
};
