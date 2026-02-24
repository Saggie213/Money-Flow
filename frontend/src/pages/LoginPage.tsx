import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950 px-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-24 h-24 mb-4">
            <img 
              src="/assets/generated/logo.dim_256x256.png" 
              alt="MoneyFlow Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
            MoneyFlow
          </CardTitle>
          <CardDescription className="text-base">
            Track and manage your finances efficiently
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Secure personal finance management with income tracking, expense monitoring, and budget planning.
            </p>
            <Button 
              onClick={login} 
              disabled={isLoggingIn}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 dark:from-emerald-500 dark:to-teal-500 dark:hover:from-emerald-600 dark:hover:to-teal-600"
              size="lg"
            >
              {isLoggingIn ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Connecting...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Login with Internet Identity
                </>
              )}
            </Button>
          </div>
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Your data is securely stored and only accessible by you
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
