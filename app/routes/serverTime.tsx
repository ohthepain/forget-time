import { createFileRoute, useRouter } from '@tanstack/react-router'
import { getServerTime } from '../serverFunctions/getServerTime'

export const Route = createFileRoute('/serverTime')({
  component: Home,
})

function Home() {
  const router = useRouter()
  const state = Route.useLoaderData()
  let serverTime = getServerTime({data: 'foo',})

  return (
    <div>Hello "/serverTime" ${serverTime}!
    <button
      type="button"
      onClick={() => {
        serverTime = getServerTime({data: 'bar',});
      }}
    >
      {serverTime}
    </button>
    </div>
  )
}
