// web/context/AuthContext.tsx
import { createContext, useContext, type ReactNode } from 'react';
import type { User as AuthUser } from '@supabase/supabase-js';
// Remove direct Prisma User import if only used via the context type
// import type { User as ProfileUser } from '@prisma/client';
import type { UserProfileContextType } from '@/lib/userData'; // Import the enhanced type

// Define the shape of the context data using the imported type
interface AuthContextType {
  authUser: AuthUser | null;
  profile: UserProfileContextType; // Use the type from userData.ts
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook (remains the same)
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;