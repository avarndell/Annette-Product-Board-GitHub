import { useState, type FormEvent } from 'react';
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material';
import { supabase } from '../supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const login = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const { error } = await supabase!.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    setMessage(error
      ? { text: error.message, isError: true }
      : { text: 'Check your email for the secure sign-in link.', isError: false });
  };

  return (
    <Box component="main" sx={{ maxWidth: 440, mx: 'auto', mt: { xs: 6, sm: 12 }, px: 2 }}>
      <Typography variant="overline" color="secondary">PRIVATE WORKSPACE</Typography>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>Annette's Product Board</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>Sign in with your owner email to access the board.</Typography>
      <Stack component="form" spacing={2} onSubmit={login}>
        <TextField
          type="email"
          required
          label="Email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" variant="contained" color="secondary" size="large">Send secure sign-in link</Button>
      </Stack>
      {message && <Alert severity={message.isError ? 'error' : 'info'} sx={{ mt: 2 }}>{message.text}</Alert>}
    </Box>
  );
}
