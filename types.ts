
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
  CORE = 'Core Isolation Engine',
  CATALOG = 'Studio Production',
  ASSISTANT = 'Creative Intelligence'
}
