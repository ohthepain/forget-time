// app/layout.tsx
"use client";

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';

interface RootLayoutProps {
  children: ReactNode;
  session: any;
}

export default function RootLayout({ children, session }: RootLayoutProps) {
  console.log('Rendering layout.tsx'); // Add this line to log when layout.tsx is rendered
  console.log(`Session data: ${JSON.stringify(session)}`);

  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
