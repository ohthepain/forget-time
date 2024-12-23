import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/signin')({
  component: AuthPage,
  beforeLoad: async ({ context }) => {
    if (context.user) {
      throw redirect({
        to: '/users',
      });
    }
  },
});

function AuthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-8 rounded-xl border bg-card p-10">
        Logo here
        <form method="GET" className="flex flex-col gap-2">
          <button formAction="/api/auth/discord" type="submit">
            Sign in with Discord
          </button>
          <button formAction="/api/auth/github" type="submit">
            Sign in with GitHub
          </button>
          <button formAction="/api/auth/google" type="submit">
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
}
