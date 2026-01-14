
// Fix: Import React to provide the 'React' namespace for React.ReactNode
import React from 'react';

export interface FashionTool {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  badge?: string;
}

export type AppView = 'dashboard' | 'studio' | 'settings';

export enum Category {
  VIDEO = 'Video & Storytelling',
  VISUAL = 'Fotografi & Visual',
  STYLING = 'Utilitas & Styling',
  CATALOG = 'Katalog & Produk'
}
