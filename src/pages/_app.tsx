// src/pages/_app.tsx
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import '@/index.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  console.log('Rendering _app.tsx'); // Add this line to log when _app.tsx is rendered
  console.log(`Session data: ${JSON.stringify(session)}`);
  console.log(`ar ar ar mother ar ar ar 1 ${JSON.stringify(pageProps)}`);

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
