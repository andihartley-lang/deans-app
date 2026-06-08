'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { isPasswordRecoveryLink } from '@/lib/auth';
import LandingPage from '@/components/LandingPage';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const isRecovery = isPasswordRecoveryLink();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (isRecovery) {
        router.replace('/reset-password');
        return;
      }

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

  return <LandingPage />;
}