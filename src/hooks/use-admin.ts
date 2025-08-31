import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { env } from '@/lib/env';

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw new Error(`Session error: ${sessionError.message}`);
        }

        if (!session?.user) {
          setIsAdmin(false);
          return;
        }

        // Bypass admin check if flag is enabled (for debugging)
        if (env.VITE_BYPASS_ADMIN_FOR_UPLOAD) {
          console.warn('⚠️ Admin check bypassed for debugging');
          setIsAdmin(true);
          return;
        }

        // Check user profile for admin role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          // If profiles table doesn't exist or other error, fall back to user metadata
          const userRole = session.user.user_metadata?.role;
          setIsAdmin(userRole === 'admin');
        } else {
          setIsAdmin(profile?.role === 'admin');
        }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to check admin status';
        setError(errorMessage);
        console.error('Admin check error:', err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAdminStatus();
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    isAdmin,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      checkAdminStatus();
    }
  };
}
