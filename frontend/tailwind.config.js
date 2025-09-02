/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 极客风格主题
        geek: {
          bg: '#0a0a0a',
          surface: '#1a1a1a',
          primary: '#00ff00',
          secondary: '#00aaff',
          accent: '#ff6600',
          text: '#ffffff',
          muted: '#666666'
        },
        // 极简风格主题
        minimal: {
          bg: '#ffffff',
          surface: '#f8f9fa',
          primary: '#007bff',
          secondary: '#6c757d',
          accent: '#28a745',
          text: '#212529',
          muted: '#6c757d'
        }
      },
      fontFamily: {
        'mono': ['Monaco', 'Menlo', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
  darkMode: 'class'
}