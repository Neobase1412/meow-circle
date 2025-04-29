// web/context/AuthContext.tsx
import { createContext, useContext, type ReactNode } from 'react';
import type { User as AuthUser } from '@supabase/supabase-js';
import type { User as ProfileUser } from '@prisma/client';

// Define the shape of the context data
interface AuthContextType {
  authUser: AuthUser | null;
  profile: Pick<ProfileUser, 'id' | 'username' | 'avatarUrl'> | null; // Use the same picked type
  // You could add loading states or helper functions here if needed later
}

// Create the context with a default value (null or appropriate defaults)
// Using 'null' initially forces consumers to handle the case where context might not be ready,
// but since we provide it from the root layout, it should always be available.
// Using 'undefined' and checking in useAuth is a common pattern too.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the AuthContext, provides better error handling
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Export the context itself if needed elsewhere, though the hook is preferred
export default AuthContext;