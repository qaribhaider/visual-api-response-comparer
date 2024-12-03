import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark theme color palette
        dark: {
          50: '#1E2329',   // Lightest background
          100: '#1A1E23',  // Light background
          200: '#161A1E',  // Medium background
          300: '#121518',  // Darker background
          400: '#0E1012',  // Darkest background
          
          // Accent and interactive colors
          primary: '#3B82F6',    // Bright blue
          secondary: '#10B981',  // Teal green
          accent: '#6366F1',     // Indigo
          
          // Text colors
          text: {
            primary: '#E5E7EB',   // Light gray for main text
            secondary: '#9CA3AF', // Muted gray for secondary text
            muted: '#6B7280',     // Even more muted text
          },
          
          // Border and divider colors
          border: '#2C3036',
          divider: '#2C3036',
        },
      },
      backgroundColor: {
        dark: {
          50: '#1E2329',
          100: '#1A1E23',
          200: '#161A1E',
          300: '#121518',
          400: '#0E1012',
        }
      },
      borderColor: {
        dark: {
          DEFAULT: '#2C3036',
          light: '#3A4046',
        }
      },
      boxShadow: {
        'dark-sm': '0 1px 2px 0 rgba(255, 255, 255, 0.05)',
        'dark-md': '0 4px 6px -1px rgba(255, 255, 255, 0.1), 0 2px 4px -1px rgba(255, 255, 255, 0.06)',
      },
      typography: {
        dark: {
          css: {
            color: '#E5E7EB',
            a: {
              color: '#3B82F6',
            },
            strong: {
              color: '#E5E7EB',
            },
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
