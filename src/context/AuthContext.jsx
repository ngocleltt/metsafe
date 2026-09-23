import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(currentUser) {
    if (!currentUser) {
      setProfile(null);
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        email,
        phone,
        role,
        is_active,
        candidate_id,
        employee_id
      `)
      .eq('id', currentUser.id)
      .maybeSingle();

    if (error) {
      console.error('Profile loading error:', error);
      setProfile(null);
      return null;
    }

    setProfile(data);
    return data;
  }

  async function refreshProfile() {
    const currentUser = user;

    if (!currentUser) {
      setProfile(null);
      return null;
    }

    return loadProfile(currentUser);
  }

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        const {
          data: { session },
          error: sessionError
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!mounted) return;

        const currentUser = session?.user || null;

        setUser(currentUser);
        await loadProfile(currentUser);

        if (mounted) {
          setLoading(false);
        }
      } catch (authError) {
        console.error(
          'Authentication initialization error:',
          authError
        );

        if (mounted) {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    }

    initializeAuth();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user || null;

        setUser(currentUser);

        window.setTimeout(async () => {
          if (!mounted) return;

          await loadProfile(currentUser);

          if (mounted) {
            setLoading(false);
          }
        }, 0);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function logout() {
    const { error } = await supabase.auth.signOut({
      scope: 'local'
    });

    if (error) {
      console.error('Logout error:', error);
      return;
    }

    setUser(null);
    setProfile(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        refreshProfile,
        isAdmin: profile?.role === 'admin',
        isEmployee: profile?.role === 'employee',
        isCandidate: profile?.role === 'candidate',
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}