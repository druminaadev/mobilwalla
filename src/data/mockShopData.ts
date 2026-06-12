export const CATEGORIES = [
  { id: 'hair', name: 'Hair Care', image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=200&q=80' },
  { id: 'skin', name: 'Skin Care', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=200&q=80' },
  { id: 'makeup', name: 'Makeup', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=200&q=80' },
  { id: 'body', name: 'Body Care', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=200&q=80' },
  { id: 'fragrance', name: 'Perfume', image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=200&q=80' },
];

export const ALL_PRODUCTS = [
  { id: '1', name: 'Keratin Repair Serum', brand: 'L\'Oréal Paris', price: 899, rating: 4.8, categoryId: 'hair', image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=400&q=80' },
  { id: '2', name: 'Vitamin C Cream', brand: 'Neutrogena', price: 1299, rating: 4.5, categoryId: 'skin', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=400&q=80' },
  { id: '3', name: 'Matte Lipstick', brand: 'MAC', price: 1500, rating: 4.7, categoryId: 'makeup', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80' },
  { id: '4', name: 'Shea Butter Lotion', brand: 'The Body Shop', price: 950, rating: 4.6, categoryId: 'body', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=400&q=80' },
  { id: '5', name: 'Floral Eau de Parfum', brand: 'Chanel', price: 8500, rating: 4.9, categoryId: 'fragrance', image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=400&q=80' },
  { id: '6', name: 'Argan Hair Oil', brand: 'Moroccanoil', price: 2500, rating: 4.8, categoryId: 'hair', image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=400&q=80' },
  { id: '7', name: 'Hyaluronic Serum', brand: 'The Ordinary', price: 2199, rating: 4.9, categoryId: 'skin', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80' },
  { id: '8', name: 'Foundation Set', brand: 'Fenty Beauty', price: 3200, rating: 4.8, categoryId: 'makeup', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=400&q=80' },
  { id: '9', name: 'Exfoliating Scrub', brand: 'Clinique', price: 1800, rating: 4.5, categoryId: 'body', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=400&q=80' },
  { id: '10', name: 'Tea Tree Face Wash', brand: 'Body Shop', price: 799, rating: 4.4, categoryId: 'skin', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=400&q=80' },
  { id: '11', name: 'Hydrating Shampoo', brand: 'Olaplex', price: 2800, rating: 4.9, categoryId: 'hair', image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=400&q=80' },
  { id: '12', name: 'Rose Body Wash', brand: 'Dove', price: 350, rating: 4.3, categoryId: 'body', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=400&q=80' },
  { id: '13', name: 'Night Repair Serum', brand: 'Estée Lauder', price: 6500, rating: 4.9, categoryId: 'skin', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80' },
  { id: '14', name: 'Volume Mascara', brand: 'Maybelline', price: 599, rating: 4.6, categoryId: 'makeup', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80' },
  { id: '15', name: 'Oud Wood Intense', brand: 'Tom Ford', price: 15500, rating: 4.9, categoryId: 'fragrance', image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=400&q=80' },
  { id: '16', name: 'Color Protect Conditioner', brand: 'L\'Oréal Paris', price: 450, rating: 4.4, categoryId: 'hair', image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=400&q=80' },
];

export const BEST_SELLERS = ALL_PRODUCTS.filter(p => ['1', '7', '2', '5', '8'].includes(p.id));
