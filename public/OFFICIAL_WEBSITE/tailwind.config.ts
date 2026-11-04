import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['var(--font-work-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  			display: ['var(--font-space-grotesk)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  		},
  		colors: {
  			ink: {
  				DEFAULT: '#15181C',
  				900: '#0E1013',
  				800: '#15181C',
  				700: '#1E2227',
  			},
  			paper: '#F4EFE6',
  			brand: {
  				50: '#F6F4FE',
  				100: '#EEEAFD',
  				200: '#DED6FB',
  				300: '#C3B5F6',
  				400: '#A48EEE',
  				500: '#8A70E3',
  				600: '#7358D1',
  				700: '#5D45AC',
  				800: '#4A3888',
  				900: '#3C2E6E',
  				950: '#251C47',
  			},
  			calm: {
  				50: '#F1FAF6',
  				100: '#DFF3EA',
  				200: '#BFE6D5',
  				300: '#96D4BC',
  				400: '#6BBE9F',
  				500: '#4FA687',
  				600: '#3D8A70',
  				700: '#326F5B',
  				800: '#2A594B',
  				900: '#23483E',
  				950: '#122922',
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		animation: {
			marquee: 'marquee 20s linear infinite',
			float: 'float 8s ease-in-out infinite',
			'float-slow': 'float 12s ease-in-out infinite',
			breathe: 'breathe 6s ease-in-out infinite'
		},
		keyframes: {
			marquee: {
				'0%': { transform: 'translateX(0)' },
				'100%': { transform: 'translateX(-50%)' }
			},
			float: {
				'0%, 100%': { transform: 'translateY(0px)' },
				'50%': { transform: 'translateY(-16px)' }
			},
			breathe: {
				'0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
				'50%': { transform: 'scale(1.08)', opacity: '0.9' }
			}
		}
  	}
  },
  variants: {
	extend: {
		animation: ['hover', 'focus']
	},
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
