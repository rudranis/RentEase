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
            fontFamily: {
                sans: ['DM Sans', 'sans-serif'],
                display: ['Syne', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)',
                'gradient-soft': 'linear-gradient(135deg, #f5f3ff 0%, #eff6ff 100%)',
            },
            borderRadius: {
                '3xl': '1.5rem',
                '4xl': '2rem',
                '5xl': '2.5rem',
            },
            boxShadow: {
                'purple': '0 4px 24px -4px rgba(124, 58, 237, 0.3)',
                'card': '0 2px 16px 0 rgba(0, 0, 0, 0.06)',
            },
            animation: {
                'fade-in': 'fade-in 0.5s ease-out',
                'float': 'float 6s ease-in-out infinite',
            },
        },
    },
    plugins: [],
};