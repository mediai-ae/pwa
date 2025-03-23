export default {
    content: [
        './index.html',
        './dashboard.html',
        './src/**/*.{vue,js,ts,jsx,tsx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                tahoma: ['Tahoma', 'sans-serif'],
            },
            colors: {
                primary: {
                    light: '#f3f4f6',
                    dark: '#1c2533',
                },
                secondary: {
                    light: '#e5e7eb',
                    dark: '#2c3b55',
                },
                accent: {
                    DEFAULT: '#6b78a7',
                    soft: '#3e4c66',
                },
                rga: {
                    r: 'red',
                    g: 'green',
                    a: 'orange',
                    na: 'gray',
                },
            },
        },
    },
}
