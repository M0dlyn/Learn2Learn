import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export type User = {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: unknown; 
};

export type LearningTechnic = {
  id: number;
  name: string;
  short_desc: string;
  detailed_desc: string;
  created_at: string; 
  updated_at: string; 
  // Add other fields if they exist and are needed
};

export interface Auth {
    user: User;
}

export type SharedData = {
  name: string;
  quote: { message: string; author: string };
  auth: Auth;
  ziggy: Config & { location: string };
  sidebarOpen: boolean;
  [key: string]: unknown;
};
