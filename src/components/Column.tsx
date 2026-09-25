import { Box, Button, Paper, Typography } from '@mui/material';
import ProductCard from './ProductCard';
import { alpha } from '@mui/material/styles';
import { brand, columnColor } from '../theme';
import type { Product } from '../products';

interface Props {
  stage: string;
  products: Product[];
  onEdit: (id: Product['id'], changes: Partial<Product>) => void;
  onSave: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function Column({ stage, products, onEdit, onSave, onDelete }: Props) {
  return (
    <Paper variant="outlined" sx={{ bgcolor: columnColor, borderColor: alpha(brand.berry, 0.2), p: 1.5, minHeight: 330 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mb: 1.5 }}>
        <Typography component="h2" sx={{ fontSize: 12, fontWeight: 700 }}>{stage}</Typography>
        <Typography color="secondary" sx={{ fontSize: 12, fontWeight: 700 }}>{products.length}</Typography>
      </Box>
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          onEdit={(changes) => onEdit(p.id, changes)}
          onSave={onSave}
          onDelete={onDelete}
        />
      ))}
      <Button
        fullWidth
        variant="outlined"
        sx={{ borderStyle: 'dashed' }}
        onClick={() => onSave({ title: 'New product', stage, priority: 'Medium', notes: '' })}
      >
        + Add product
      </Button>
    </Paper>
  );
}
