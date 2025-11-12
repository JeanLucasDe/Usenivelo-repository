
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient'; // Importa a instância do Supabase já configurada

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null); // Adicionado userRole

  const fetchUserRole = useCallback(async (userId) => {
    if (!userId) return null;
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116: "exact-one" violation (0 rows)
        console.error('Error fetching user role:', error);
        return 'admin'; 
      }
      return data ? data.role : 'admin';
    } catch (error) {
      console.error('Error fetching user role:', error);
      return 'admin';
    }
  }, []);

  const handleSession = useCallback(async (session) => {
    setSession(session);
    const currentUser = session?.user ?? null;
    
    if (currentUser) {
      const role = await fetchUserRole(currentUser.id);
      setUserRole(role);
      
      const userWithDetails = {
        ...currentUser,
        role: role,
        name: currentUser.user_metadata?.full_name || currentUser.user_metadata?.responsibleName || currentUser.email,
        company: currentUser.user_metadata?.companyName || 'FlexiSaaS User'
      };
      setUser(userWithDetails);

    } else {
      setUser(null);
      setUserRole(null);
    }
    setLoading(false);
  }, [fetchUserRole]);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      await handleSession(session);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
            const role = await fetchUserRole(session.user.id);
            if (!role) { // User signed in with OAuth but doesn't exist in our 'users' table
                const { error: insertError } = await supabase
                    .from('users')
                    .insert([{ 
                        id: session.user.id, 
                        email: session.user.email,
                        role: 'admin',
                        raw_user_meta_data: session.user.user_metadata
                    }]);

                if (insertError) {
                    console.error("Error creating user profile after OAuth sign in:", insertError);
                }
            }
        }
        await handleSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, [handleSession, fetchUserRole]);

  const signUp = useCallback(async (email, password, options) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Falha no cadastro",
        description: error.message || "Algo deu errado",
      });
      return { error };
    }

    if (data.user) {
        const { error: insertError } = await supabase
          .from('users')
          .insert([
            { 
              id: data.user.id, 
              email: data.user.email,
              role: 'admin',
              raw_user_meta_data: options.data
            }
          ]);

        if (insertError) {
            toast({
                variant: "destructive",
                title: "Falha ao salvar dados do usuário",
                description: insertError.message || "Algo deu errado",
            });
            return { error: insertError };
        }
    }
    
    return { data, error: null };
  }, [toast]);

  const signIn = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Falha no login",
        description: error.message || "Credenciais inválidas",
      });
    }

    return { error };
  }, [toast]);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      toast({
        variant: "destructive",
        title: "Falha no login com Google",
        description: error.message || "Algo deu errado",
      });
    }
  }, [toast]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserRole(null);

    if (error) {
      toast({
        variant: "destructive",
        title: "Falha ao sair",
        description: error.message || "Algo deu errado",
      });
    }

    return { error };
  }, [toast]);

  const value = useMemo(() => ({
    user,
    session,
    loading,
    userRole,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  }), [user, session, loading, userRole, signUp, signIn, signInWithGoogle, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
