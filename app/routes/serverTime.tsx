import { createFileRoute } from '@tanstack/react-router';
import { getServerTime } from '../serverFunctions/getServerTime';

export const Route = createFileRoute('/serverTime')({
  component: Home,
});

function Home() {
  let serverTime = getServerTime({ data: 'foo' });

  return (
    <div>
      Hello /serverTime ${serverTime}!
      <button
        type="button"
        onClick={() => {
          serverTime = getServerTime({ data: 'bar' });
        }}
      >
        {serverTime}
      </button>
    </div>
  );
}
