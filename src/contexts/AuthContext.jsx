import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/customSupabaseClient";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  // 🔹 Busca o papel (role) do usuário
  const fetchUserRole = useCallback(async (userId) => {
    if (!userId) return null;
    try {
      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Erro ao buscar papel do usuário:", error);
        return "admin";
      }
      return data ? data.role : "admin";
    } catch (error) {
      console.error("Erro ao buscar papel do usuário:", error);
      return "admin";
    }
  }, []);

  // 🔹 Atualiza sessão e usuário
  const handleSession = useCallback(
    async (session) => {
      setSession(session);
      const currentUser = session?.user && session.user.id ? session.user : null;

      if (currentUser && currentUser.id) {
        const role = await fetchUserRole(currentUser.id);
        setUserRole(role);

        const userWithDetails = {
          ...currentUser,
          role,
          name:
            currentUser.user_metadata?.full_name ||
            currentUser.user_metadata?.responsibleName ||
            currentUser.email,
          company: currentUser.user_metadata?.companyName || "FlexiSaaS User",
        };
        setUser(userWithDetails);
      } else {
        setUser(null);
        setUserRole(null);
      }

      setLoading(false);
    },
    [fetchUserRole]
  );

  // 🔹 Inicializa sessão + escuta mudanças
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      await handleSession(session);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const role = await fetchUserRole(session.user.id);
        if (!role) {
          const { error: insertError } = await supabase.from("users").insert([
            {
              id: session.user.id,
              email: session.user.email,
              role: "admin",
              raw_user_meta_data: session.user.user_metadata,
            },
          ]);
          if (insertError)
            console.error(
              "Erro ao criar perfil do usuário após login OAuth:",
              insertError
            );
        }
      }

      // 🔸 Se o evento for SIGNED_OUT, limpa tudo imediatamente
      if (event === "SIGNED_OUT") {
        setUser(null);
        setSession(null);
        setUserRole(null);
        setLoading(false);
      } else {
        await handleSession(session);
      }
    });

    return () => subscription.unsubscribe();
  }, [handleSession, fetchUserRole]);

  // 🔹 Cadastro
  const signUp = useCallback(
    async (email, password, options) => {
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
        const { error: insertError } = await supabase.from("users").insert([
          {
            id: data.user.id,
            email: data.user.email,
            role: "admin",
            raw_user_meta_data: options.data,
          },
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
    },
    [toast]
  );

  // 🔹 Login normal
  const signIn = useCallback(
    async (email, password) => {
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
    },
    [toast]
  );

  // 🔹 Login com Google
  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      toast({
        variant: "destructive",
        title: "Falha no login com Google",
        description: error.message || "Algo deu errado",
      });
    }
  }, [toast]);

  // 🔹 Logout corrigido
  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();

      // 🔸 Limpa tudo localmente
      setUser(null);
      setSession(null);
      setUserRole(null);
      setLoading(false);

      // 🔸 Remove tokens locais (caso existam)
      Object.keys(localStorage)
        .filter((k) => k.startsWith("sb-") || k.includes("supabase"))
        .forEach((k) => localStorage.removeItem(k));

      if (error) {
        toast({
          variant: "destructive",
          title: "Falha ao sair",
          description: error.message || "Algo deu errado",
        });
      } else {
        toast({
          title: "Logout realizado",
          description: "Você foi desconectado com sucesso",
        });
      }
    } catch (err) {
      console.error("Erro no signOut:", err);
    }
  }, [toast]);

  // 🔹 Valor global
  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      userRole,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
    }),
    [user, session, loading, userRole, signUp, signIn, signInWithGoogle, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 🔹 Hook personalizado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
