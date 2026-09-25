import { Button, Card, MenuItem, Stack, TextField } from '@mui/material';
import { priorities, stages, type Product } from '../products';

interface Props {
  product: Product;
  onEdit: (changes: Partial<Product>) => void;
  onSave: (product: Product) => void;
  onDelete: (product: Product) => void;
}

// Text fields update locally while typing and save when you click away.
// Dropdowns save immediately.
export default function ProductCard({ product, onEdit, onSave, onDelete }: Props) {
  return (
    <Card variant="outlined" sx={{ p: 1.25, mb: 1.25 }}>
      <Stack spacing={1}>
        <TextField
          size="small"
          aria-label="Product title"
          value={product.title}
          onChange={(e) => onEdit({ title: e.target.value })}
          onBlur={(e) => onSave({ ...product, title: e.target.value })}
          slotProps={{ htmlInput: { style: { fontWeight: 700 } } }}
        />
        <TextField
          size="small"
          multiline
          minRows={2}
          placeholder="Notes"
          value={product.notes ?? ''}
          onChange={(e) => onEdit({ notes: e.target.value })}
          onBlur={(e) => onSave({ ...product, notes: e.target.value })}
        />
        <TextField
          select
          size="small"
          label="Stage"
          value={product.stage}
          onChange={(e) => onSave({ ...product, stage: e.target.value })}
        >
          {stages.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </TextField>
        <TextField
          select
          size="small"
          label="Priority"
          value={product.priority}
          onChange={(e) => onSave({ ...product, priority: e.target.value })}
        >
          {priorities.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
        </TextField>
        <Button size="small" color="error" variant="outlined" onClick={() => onDelete(product)}>Delete</Button>
      </Stack>
    </Card>
  );
}
