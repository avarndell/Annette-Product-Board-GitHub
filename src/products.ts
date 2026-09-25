export const stages = [
  'To Research',
  'Researching',
  'Designing',
  'Listed in Shopify',
  'Flip Anywhere POD in Shopify',
  'Listed in Etsy',
  'Flip Anywhere POD in Etsy',
  'Image Ads Made',
  'Video Ads Made',
  'Copy Made',
  'Ads Launched',
];

export const priorities = ['High', 'Medium', 'Low'];

// A row of the Supabase `products` table. Only the fields the board edits are
// listed; the rest (ad spend, revenue, dates…) pass through untouched.
export interface Product {
  id?: string;
  title: string;
  stage: string;
  priority: string;
  notes?: string | null;
  recipient?: string | null;
  occasion?: string | null;
  product_type?: string | null;
  [column: string]: unknown;
}

// Starter products shown in demo mode.
export const seed: Product[] = [
  { title: 'Daughter Milestone Jewelry Dish', recipient: 'Daughter', occasion: 'Birthday / milestone', product_type: 'Jewelry dish', stage: 'Researching', priority: 'High', notes: 'Personalized emotional gift concept.' },
  { title: 'Grandma Holiday Platter', recipient: 'Grandma', occasion: 'Christmas', product_type: 'Platter', stage: 'To Research', priority: 'High', notes: 'Holiday gifting angle.' },
  { title: 'Best Friend Keepsake', recipient: 'Best friend', occasion: 'Birthday', product_type: 'Gift', stage: 'Designing', priority: 'Medium', notes: 'Warm, cheeky message direction.' },
];
