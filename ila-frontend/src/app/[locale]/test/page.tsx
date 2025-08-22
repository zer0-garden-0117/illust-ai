'use client';

import Head from 'next/head';
import AuthButton from '../../../components/Common/AuthBottan/AuthButton';
import { useAuth } from '../../../apis/auth/useAuth';

export default function Home() {
  const { user, idToken } = useAuth();

  return (
    <div>
      <Head>
        <title>Twitter Auth with Firebase</title>
      </Head>

      <main>
        <h1>Twitter Authentication Example</h1>
        <AuthButton />
        
        {user && (
          <div style={{ marginTop: '20px' }}>
            <h2>User Info:</h2>
            <p>Name: {user.displayName}</p>
            <p>Email: {user.email}</p>
            <p>UID: {user.uid}</p>
            <p>id token: {idToken}</p>
          </div>
        )}
      </main>

      <style jsx>{`
        .twitter-login-btn {
          background-color: #1DA1F2;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
        }

        .twitter-login-btn:hover {
          background-color: #0d8bd9;
        }

        .logout-btn {
          background-color: #ff4757;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          margin-left: 10px;
        }
      `}</style>
    </div>
  );
}