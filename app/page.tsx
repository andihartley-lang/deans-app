'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.replace('/app');
        return;
      }

      setLoading(false);
    }

    checkUser();
  }, [router]);

  if (loading) {
    return null;
  }

  return (
    <main>
      <h1>Orbit Landing Page</h1>
    </main>
  );
}