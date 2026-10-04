
import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  redirect,
  Outlet,
  Link,
  useNavigate,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { RouterContext } from '../routerContext';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { VerifyEmailPage } from '@/pages/VerifyEmailPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';

// ----------------------------------------------------------------------
// 1. Root Route
// ----------------------------------------------------------------------
const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});

function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <header className="border-b bg-white px-6 py-4 flex justify-between items-center shadow-sm">
        <Link to="/" className="text-xl font-bold text-blue-600">
          MyApp
        </Link>
        <nav className="flex gap-4">
          <Link to="/dashboard" activeProps={{ className: 'font-bold text-blue-600' }}>
            Dashboard
          </Link>
          <Link to="/admin" activeProps={{ className: 'font-bold text-blue-600' }}>
            Admin
          </Link>
          <Link to="/login" activeProps={{ className: 'font-bold text-blue-600' }}>
            Login
          </Link>
        </nav>
      </header>

      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        <Outlet />
      </main>

      <TanStackRouterDevtools position="bottom-right" />
    </div>
  );
}

// ----------------------------------------------------------------------
// 2. Public Routes
// ----------------------------------------------------------------------
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <div className="text-center py-12">
      <h1 className="text-3xl font-bold">Welcome to MyApp</h1>
      <p className="mt-2 text-gray-600">Public home page accessible to everyone.</p>
    </div>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  beforeLoad: ({ context }) => {
    // Redirect away if user is already logged in
    if (context.auth.user) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  beforeLoad: ({ context }) => {
    if (context.auth.user) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: RegisterPage,
});

// ----------------------------------------------------------------------
// 3. Protected Authenticated Layout
// ----------------------------------------------------------------------
const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: '_authenticated',
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isLoading && !context.auth.user) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      });
    }
  },
});

const dashboardRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/dashboard',
  component: () => (
    <div>
      <h1 className="text-2xl font-bold">User Dashboard</h1>
      <p className="mt-2">Protected content visible to logged-in users.</p>
    </div>
  ),
});

// ----------------------------------------------------------------------
// 4. Role-Based Admin Route
// ----------------------------------------------------------------------
const adminRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/admin',
  beforeLoad: ({ context }) => {
    if (context.auth.user?.role !== 'ADMIN') {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: () => (
    <div>
      <h1 className="text-2xl font-bold text-red-600">Admin Panel</h1>
      <p className="mt-2">Restricted to users with ADMIN role.</p>
    </div>
  ),
});

// ----------------------------------------------------------------------
// 5. 404 Page Component
// ----------------------------------------------------------------------
function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-extrabold text-gray-800">404</h1>
      <p className="text-gray-600 mt-2">Page Not Found</p>
      <button
        onClick={() => navigate({ to: '/' })}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go Home
      </button>
    </div>
  );
}
const verifyEmailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/verify-email',
  component: VerifyEmailPage,
});

const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reset-password',
  component: ResetPasswordPage,
});

// ----------------------------------------------------------------------
// 6. Router Instance Construction
// ----------------------------------------------------------------------
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
    verifyEmailRoute,
    resetPasswordRoute,
  authenticatedRoute.addChildren([dashboardRoute, adminRoute]),
]);

export const router = createRouter({
  routeTree,
  context: {
    queryClient: undefined!,
    auth: undefined!,
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}