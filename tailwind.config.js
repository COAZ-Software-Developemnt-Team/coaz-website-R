/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nunitoSansBlack: ["'NunitoSans-Black'", 'sans-serif'],
        nunitoSansBlackItalic: ["'NunitoSans-BlackItalic'", 'sans-serif'],
        nunitoSansBold: ["'NunitoSans-Bold'", 'sans-serif'],
        nunitoSansboldItalic: ["'NunitoSans-BoldItalic'", 'sans-serif'],
        nunitoSansextraBold: ["'NunitoSans-ExtraBold'", 'sans-serif'],
        nunitoSansextraBoldItalic:["'NunitoSans-ExtraBoldItalic'", 'sans-serif'],
        nunitoSansextraLight: ["'NunitoSans-ExtraLight'", 'sans-serif'],
        nunitoSansextraLightItalic:["'NunitoSans-ExtraLightItalic'", 'sans-serif'],
        nunitoSansItalic: ["'NunitoSans-Italic'", 'sans-serif'],
        nunitoSansLight: ["'NunitoSans-Light'", 'sans-serif'],
        nunitoSansLightItalic: ["'NunitoSans-LightItalic'", 'sans-serif'],
        nunitoSansMedium: ["'NunitoSans-Medium'", 'sans-serif'],
        nunitoSansMediumItalic: ["'NunitoSans-MediumItalic'", 'sans-serif'],
        nunitoSansRegular: ["'NunitoSans-Regular'", 'sans-serif'],
        nunitoSansSemiBold: ["'NunitoSans-SemiBold'", 'sans-serif'],
        nunitoSansSemiBoldItalic: ["'NunitoSans-SemiBoldItalic'", 'sans-serif'],
        nunitoSansExtraBlackItalic:["'NunitoSansExtraBlack-Italic'", 'sans-serif'],
        nunitoSansExtraBlackRegular:["'NunitoSansExtraBlack-Regular'", 'sans-serif'],
      },
      colors: {
        theme: 'var(--color-theme)',
        heading: 'var(--color-heading)',
        gray: 'var(--color-gray)'
      },
      screens: {
        xs: "480px"
      }
    },
  },
  plugins: [],
}

