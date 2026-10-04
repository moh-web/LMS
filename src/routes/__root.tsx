import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const route = createRootRoute({
  component: () => (
    <>
      <div className="p-4 flex gap-4 bg-slate-100 dark:bg-slate-900">
        <Link to="/" className="[&.active]:font-bold text-blue-600">main</Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
  