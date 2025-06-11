// src/pages/index.tsx (临时简化版)
import React from 'react';
import Head from 'next/head';

function HomePage() {
  return (
    <>
      <Head>
        <title>Hello Vercel Test</title>
      </Head>
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h1>Hello Vercel!</h1>
        <p>If you see this, the frontend is working.</p>
      </div>
    </>
  );
}

export default HomePage;
