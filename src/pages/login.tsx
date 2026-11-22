import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import { SweetyBrandIcon } from "../components/icons/custom-icons.js";
import { useAuth } from "../context/auth-context.js";
import { Button } from "../components/ui/button.js";
import { Input } from "../components/ui/input.js";
import { Label } from "../components/ui/label.js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card.js";
import { useToast } from "../hooks/use-toast.js";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      await login(email.trim(), password);
      toast({
        title: "Welcome back",
        description: "You have signed in to your personal glucose journal.",
        type: "success",
      });
      navigate("/");
    } catch (err: any) {
      setErrorMessage(
        err.message || "Invalid credentials. Please verify your email and password."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail("demo@sweety.health");
    setPassword("Password123!");
    setErrorMessage(null);
    setIsLoading(true);

    try {
      await login("demo@sweety.health", "Password123!");
      toast({
        title: "Demo session active",
        description: "Signed in with the demo account.",
        type: "success",
      });
      navigate("/");
    } catch (err: any) {
      setErrorMessage(
        err.message || "Unable to sign in with demo credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F6F7F3] dark:bg-[#151B18] px-4 py-12 transition-colors">
      {/* Brand Header */}
      <div className="mb-8 flex flex-col items-center text-center">
        <SweetyBrandIcon size={56} withBackground className="mb-3 shadow-md" />
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          Sweety
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          A calm, trustworthy personal blood glucose journal
        </p>
      </div>

      <Card className="w-full max-w-[420px] shadow-sm border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#1D2621]">
        <CardHeader className="space-y-1.5 pb-4">
          <CardTitle className="text-xl text-neutral-900 dark:text-neutral-50">Sign in</CardTitle>
          <CardDescription className="text-neutral-500 dark:text-neutral-400">
            Enter your credentials to access your daily rhythm
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div
                className="p-3 text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg font-medium"
                role="alert"
              >
                {errorMessage}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage(null);
                  }}
                  className="pl-9"
                  disabled={isLoading}
                  required
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  className="pl-9 pr-10"
                  disabled={isLoading}
                  required
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-0.5"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full gap-2 mt-2 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Signing in…" : "Sign in to journal"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Quick Demo Shortcut */}
          <div className="mt-5 pt-5 border-t border-neutral-150 dark:border-neutral-800">
            <div className="rounded-lg bg-neutral-100 dark:bg-[#242F29] p-3 text-center">
              <p className="text-xs text-neutral-600 dark:text-neutral-300 mb-2 font-medium">
                Evaluating the Kenpath assignment?
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full text-xs font-semibold border-primary/20 dark:border-[#73B99A]/30 bg-white dark:bg-[#1D2621] hover:bg-primary/5 text-primary dark:text-[#73B99A]"
              >
                1-Click Demo Login (demo@sweety.health)
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-neutral-500 dark:text-neutral-400">
            Don&apos;t have an account yet?{" "}
            <Link
              to="/register"
              className="font-semibold text-primary dark:text-[#73B99A] hover:underline"
            >
              Create account
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Medical Disclaimer */}
      <p className="mt-8 text-center text-[11px] text-neutral-400 dark:text-neutral-500 max-w-sm">
        Sweety is a personal journal for logging glucose measurements and does
        not offer medical diagnosis or clinical treatment prescriptions.
      </p>
    </div>
  );
}
