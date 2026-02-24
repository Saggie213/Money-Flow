import { useInternetIdentity } from './hooks/useInternetIdentity';
import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import TransactionsPage from './pages/TransactionsPage';
import BudgetPage from './pages/BudgetPage';
import SummaryPage from './pages/SummaryPage';
import RecurringTransactionsPage from './pages/RecurringTransactionsPage';
import Navigation from './components/Navigation';

function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <footer className="border-t border-border mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MoneyFlow. Built with ❤️ using{' '}
            <a 
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return <LoginPage />;
  }

  return <>{children}</>;
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  ),
});

const transactionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/transactions',
  component: () => (
    <ProtectedRoute>
      <TransactionsPage />
    </ProtectedRoute>
  ),
});

const budgetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/budget',
  component: () => (
    <ProtectedRoute>
      <BudgetPage />
    </ProtectedRoute>
  ),
});

const summaryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/summary',
  component: () => (
    <ProtectedRoute>
      <SummaryPage />
    </ProtectedRoute>
  ),
});

const recurringRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/recurring',
  component: () => (
    <ProtectedRoute>
      <RecurringTransactionsPage />
    </ProtectedRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  transactionsRoute,
  budgetRoute,
  summaryRoute,
  recurringRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
