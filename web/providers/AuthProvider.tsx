// web/providers/AuthProvider.tsx
"use client";

import { type ReactNode } from 'react';
import AuthContext from '@/context/AuthContext';
import type { User as AuthUser } from '@supabase/supabase-js';
// Remove direct Prisma User import
import type { UserProfileContextType } from '@/lib/userData'; // Import the enhanced type

interface AuthProviderProps {
  children: ReactNode;
  authUser: AuthUser | null;
  profile: UserProfileContextType; // Use the enhanced type for the prop
}

export function AuthProvider({ children, authUser, profile }: AuthProviderProps) {
  const value = {
    authUser,
    profile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}