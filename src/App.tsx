import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import {
  Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Stack, TextField, Typography,
} from '@mui/material';
import { hasConfig, supabase } from './supabase';
import { seed, stages, type Product } from './products';
import { downloadBackup } from './backup';
import Login from './components/Login';
import Column from './components/Column';

const STORAGE_KEY = 'annette-products';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);

  const saveLocally = (next: Product[]) => {
    setProducts(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const load = async () => {
    setLoading(true);
    setError('');
    if (!supabase) {
      // Starter products (and demo boards saved before this fix) have no id,
      // which breaks card keys and makes edits save as new products.
      const stored: Product[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || seed;
      saveLocally(stored.map((p) => (p.id ? p : { ...p, id: crypto.randomUUID() })));
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!supabase) {
      load();
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user || null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) load();
  }, [user]);

  // Changes shown while typing, before they are saved.
  const edit = (id: Product['id'], changes: Partial<Product>) =>
    setProducts((ps) => ps.map((x) => (x.id === id ? { ...x, ...changes } : x)));

  const save = async (p: Product) => {
    if (!supabase) {
      saveLocally(p.id ? products.map((x) => (x.id === p.id ? p : x)) : [{ ...p, id: crypto.randomUUID() }, ...products]);
      return;
    }
    const payload = { ...p };
    if (!p.id) delete payload.id;
    const query = p.id
      ? supabase.from('products').update(payload).eq('id', p.id)
      : supabase.from('products').insert(payload);
    const { error } = await query;
    if (error) {
      setError(error.message);
      return;
    }
    load();
  };

  const remove = async (p: Product) => {
    setPendingDelete(null);
    if (!supabase) {
      saveLocally(products.filter((x) => x.id !== p.id));
      return;
    }
    const { error } = await supabase.from('products').delete().eq('id', p.id);
    if (error) {
      setError(error.message);
      return;
    }
    load();
  };

  const add = () => save({ title: 'New product', recipient: '', occasion: '', product_type: '', stage: 'To Research', priority: 'Medium', notes: '' });

  if (hasConfig && !user) return <Login />;

  const visible = products.filter((p) =>
    [p.title, p.recipient, p.occasion, p.product_type, p.stage].join(' ').toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <Box component="main" sx={{ p: { xs: 2, sm: 4 }, minHeight: '100vh' }}>
      <Stack
        component="header"
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2.5}
        sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 2 }}
      >
        <div>
          <Typography variant="overline" color="secondary">PRODUCT COMMAND CENTER</Typography>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>Research to Launch Product Board</Typography>
          <Typography color="text.secondary">Track Sparkle Me Creations products from idea to ads.</Typography>
        </div>
        <Stack direction="row" spacing={1.25} useFlexGap sx={{ flexWrap: 'wrap' }}>
          <Button variant="outlined" onClick={() => downloadBackup(products)}>Download backup</Button>
          <Button variant="contained" color="secondary" onClick={add}>+ New product</Button>
        </Stack>
      </Stack>
      {!hasConfig && <Alert severity="warning" sx={{ my: 2 }}>Demo mode: add your Supabase keys in Vercel to save across devices.</Alert>}
      {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
      <TextField
        fullWidth
        size="small"
        placeholder="Search products, recipients, occasions…"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        sx={{ mb: 2.5, bgcolor: 'background.paper' }}
      />
      {loading ? (
        <Typography>Loading board…</Typography>
      ) : (
        <Box
          component="section"
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${stages.length}, minmax(240px, 1fr))`,
            gap: 1.75,
            overflowX: 'auto',
            pb: 2.5,
          }}
        >
          {stages.map((stage) => (
            <Column
              key={stage}
              stage={stage}
              products={visible.filter((p) => p.stage === stage)}
              onEdit={edit}
              onSave={save}
              onDelete={setPendingDelete}
            />
          ))}
        </Box>
      )}
      <Dialog open={pendingDelete !== null} onClose={() => setPendingDelete(null)}>
        <DialogTitle>Delete "{pendingDelete?.title}"?</DialogTitle>
        <DialogContent>
          <DialogContentText>This can't be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingDelete(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={() => pendingDelete && remove(pendingDelete)}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
