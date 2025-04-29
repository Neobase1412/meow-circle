// web/providers/AuthProvider.tsx
"use client"; // This component wraps children and provides context, must be client-side

import { type ReactNode } from 'react';
import AuthContext from '@/context/AuthContext'; // Import the context
import type { User as AuthUser } from '@supabase/supabase-js';
import type { User as ProfileUser } from '@prisma/client';

interface AuthProviderProps {
  children: ReactNode;
  // Props to receive the server-fetched data
  authUser: AuthUser | null;
  profile: Pick<ProfileUser, 'id' | 'username' | 'avatarUrl'> | null;
}

export function AuthProvider({ children, authUser, profile }: AuthProviderProps) {
  // The value provided to the context consumers
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