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
        <p>If you see this, the frontend is working. VERCEL_URL: {process.env.VERCEL_URL}</p>
        <p>NEXT_PUBLIC_API_BASE_URL: {process.env.NEXT_PUBLIC_API_BASE_URL}</p>
        <p>Current Time: {new Date().toISOString()}</p>
      </div>
    </>
  );
}

export default HomePage;
