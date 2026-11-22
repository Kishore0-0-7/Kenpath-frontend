import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, User, ArrowRight } from "lucide-react";
import { SweetyBrandIcon } from "../components/icons/custom-icons.js";
import { useAuth } from "../context/auth-context.js";
import { Button } from "../components/ui/button.js";
import { Input } from "../components/ui/input.js";
import { Label } from "../components/ui/label.js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card.js";
import { useToast } from "../hooks/use-toast.js";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage("Please enter a name of at least 2 characters.");
      return;
    }

    if (!email.trim()) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      await register(name.trim(), email.trim(), password);
      toast({
        title: "Account created",
        description: `Welcome to Sweety, ${name.trim()}! Your journal is ready.`,
        type: "success",
      });
      navigate("/");
    } catch (err: any) {
      setErrorMessage(
        err.message || "Failed to create account. Please check your information."
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
          Create your personal blood glucose journal
        </p>
      </div>

      <Card className="w-full max-w-[420px] shadow-sm border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#1D2621]">
        <CardHeader className="space-y-1.5 pb-4">
          <CardTitle className="text-xl text-neutral-900 dark:text-neutral-50">Create account</CardTitle>
          <CardDescription className="text-neutral-500 dark:text-neutral-400">
            Begin tracking your daily clinical glucose rhythms
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
              <Label htmlFor="name">Full name</Label>
              <div className="relative">
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="e.g. Maya Sharma"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrorMessage(null);
                  }}
                  className="pl-9"
                  disabled={isLoading}
                  required
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              </div>
            </div>

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
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
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

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  className="pl-9"
                  disabled={isLoading}
                  required
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full gap-2 mt-2 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Creating account…" : "Create personal journal"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-neutral-500 dark:text-neutral-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary dark:text-[#73B99A] hover:underline"
            >
              Sign in
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
