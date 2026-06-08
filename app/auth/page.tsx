'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { isPasswordRecoveryLink } from '@/lib/auth';
import AuthSection from '@/components/AuthSection';

export default function AuthPage() {
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-950 via-indigo-900 to-indigo-950 text-white flex items-center justify-center p-6">
      <AuthSection />
    </main>
  );
}