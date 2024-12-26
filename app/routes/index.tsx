// app/routes/index.tsx
import * as fs from 'node:fs';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/start';
import { Button } from '../components/Button';

const filePath = 'count.txt';

async function readCount() {
  return parseInt(
    await fs.promises.readFile(filePath, 'utf-8').catch(() => '0'),
  );
}

const getCount = createServerFn({
  method: 'GET',
}).handler(() => {
  return readCount();
});

const updateCount = createServerFn({ method: 'POST' })
  .validator((d: number) => d)
  .handler(async ({ data }) => {
    const count = await readCount();
    await fs.promises.writeFile(filePath, `${count + data}`);
  });

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => await getCount(),
});

function Home() {
  const router = useRouter();
  const state = Route.useLoaderData();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Button
        className="flex h-12 w-32 items-center gap-8 justify-center rounded-lg bg-primary m-4"
        type="button"
        variant="outline"
        onClick={() => {
          updateCount({ data: 1 }).then(() => {
            router.invalidate();
          });
        }}
      >
        Add 1 to {state}?
      </Button>
      <div className="flex flex-col items-center gap-2 rounded-xl border bg-card p-10 shadow-lg">
        <a
          className="flex text-muted-foreground underline hover:text-foreground"
          href="https://github.com/ohthepain/forget-time"
          target="_blank"
          rel="noreferrer noopener"
        >
          ohthepain/forget-time
        </a>
        <form method="POST" action="/users">
          <Button type="submit" className="w-fit" variant="outline">
            Users
          </Button>
        </form>
        <form method="POST" action="/signin">
          <Button type="submit" className="w-fit" variant="outline">
            Sign in
          </Button>
        </form>
        <form method="POST" action="/api/auth/logout">
          <Button type="submit" className="w-fit" variant="outline">
            Sign out
          </Button>
        </form>
      </div>
    </div>
  );
}
