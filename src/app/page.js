'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Box, Container } from '@mui/material';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'CHOFER') {
      router.push('/chofer/dashboard');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div>Cargando...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          ml: { sm: '240px' }
        }}
      >
        <Container maxWidth="lg">
          <h1>Dashboard Principal</h1>
          {/* Aquí irá el contenido del dashboard principal */}
        </Container>
      </Box>
    </Box>
  );
}