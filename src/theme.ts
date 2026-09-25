import { alpha, createTheme } from '@mui/material/styles';

// Sparkle Me Creations brand colours.
export const brand = {
  berry: '#b45777', // backgrounds, soft accents
  caramel: '#a2784f', // highlights, CTA buttons
  charcoal: '#3c3c3c', // primary text
  cream: '#fff9f2', // secondary background
  rose: '#b96a80', // buttons, links
};

export const theme = createTheme({
  palette: {
    primary: { main: brand.rose, contrastText: '#fff' },
    secondary: { main: brand.caramel, contrastText: '#fff' },
    background: { default: brand.cream, paper: '#fff' },
    text: { primary: brand.charcoal, secondary: alpha(brand.charcoal, 0.72) },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    // Base size for the whole app (MUI default is 14); headings scale with it.
    fontSize: 12,
    button: { fontWeight: 300, textTransform: 'none' },
    overline: { fontWeight: 400, letterSpacing: '.13em', lineHeight: 1.6 },
  },
});

// Soft berry tint behind each board column.
export const columnColor = alpha(brand.berry, 0.08);
