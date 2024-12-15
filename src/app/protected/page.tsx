"use client";
import { useSession, signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  if (loading) return <p>Loading...</p>;

  if (!session) {
    return <p>Protected: You are not logged in. Please sign in.</p>;
  }

  return (
    <div>
      <h1>Welcome, {session?.user?.email}</h1>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
