/** @type {import('tailwindcss').Config} */
module.exports = {
  // darkMode: 'class',
  content: ['./public/views/*.html'],
  theme: {
    extend: {
      colors: {
        bgcharcoal: 'hsl(223, 18%, 27%)',
        bgcharcoal1: 'hsl(223, 17%, 28%)',
        bgcharcoal2: 'hsl(230, 11%, 43%)',
        bgcharcoalhover: 'hsl(235, 10%, 59%)',
        bglavender: 'hsl(245, 44%, 90%)',
        bglavendertext: 'hsl(243, 43%, 93%)',
        bglavenderhover: 'hsl(243, 24%, 83%)',
        bgxiketic: 'hsl(274, 17%, 12%)',
      },
    },
  },
  plugins: [],
}
