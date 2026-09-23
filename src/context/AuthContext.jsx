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
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, role, is_active')
      .eq('id', currentUser.id)
      .maybeSingle();

    if (error) {
      console.error('Profile loading error:', error);
      setProfile(null);
      return;
    }

    setProfile(data);
  }

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (!mounted) return;

      const currentUser = session?.user || null;

      setUser(currentUser);
      await loadProfile(currentUser);

      if (mounted) {
        setLoading(false);
      }
    }

    initializeAuth();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user || null;

      setUser(currentUser);

      window.setTimeout(async () => {
        if (!mounted) return;

        await loadProfile(currentUser);

        if (mounted) {
          setLoading(false);
        }
      }, 0);
    });

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
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
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