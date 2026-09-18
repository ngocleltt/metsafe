import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function SupabaseConnectionTest() {
  const [status, setStatus] = useState('Checking...');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase
        .from('connection_test')
        .select('message')
        .limit();

      if (error) {
        console.error('Supabase error:', error);
        setStatus('Connection failed');
        setMessage(error.message);
        return;
      }

      setStatus('Connection successful');
      setMessage(data?.[1]?.message || 'Connected, but no row was found');
    }

    testConnection();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Supabase Connection Test</h2>
      <p>Status: {status}</p>
      <p>Message: {message}</p>
    </div>
  );
}