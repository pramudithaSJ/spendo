"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import Logo from "@/components/branding/Logo";
import TrustBadge from "@/components/branding/TrustBadge";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signUp } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError(t.auth.passwordsDontMatch);
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError(t.auth.passwordMinLength);
      setLoading(false);
      return;
    }

    try {
      await signUp(email, password, name);
      router.push("/dashboard");
    } catch (error: unknown) {
      const firebaseError = error as { code?: string };
      if (firebaseError.code === "auth/email-already-in-use") {
        setError(t.auth.emailInUse);
      } else if (firebaseError.code === "auth/weak-password") {
        setError(t.auth.weakPassword);
      } else {
        setError(t.auth.failedToCreate);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 hexagon-bg py-8 bg-gradient-to-br from-[var(--surface-bg)] via-[var(--surface-bg)] to-[var(--surface-accent)] relative">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        {/* Logo Header */}
        <div className="flex justify-center mb-8 animate-scale-in">
          <Logo size="lg" variant="landscape" />
        </div>

        {/* Main Card */}
        <Card
          className="card-elevated border-[var(--surface-border)] animate-fade-slide-up backdrop-blur-sm bg-white/95 dark:bg-[var(--card)]/95"
          style={{
            animationDelay: "0.2s",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          <CardHeader className="text-center space-y-3 pb-6">
            <CardTitle className="text-2xl font-bold text-[var(--text-primary)]">
              Join BeeWise Today
            </CardTitle>
            <CardDescription className="text-[var(--text-secondary)]">
              Start your journey to financial wisdom
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-[var(--text-primary)]"
                >
                  {t.auth.fullName}
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={t.auth.fullNamePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 input-focus border-[var(--surface-border)] focus:border-[var(--bee-primary)]"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-[var(--text-primary)]"
                >
                  {t.auth.email}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t.auth.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 input-focus border-[var(--surface-border)] focus:border-[var(--bee-primary)]"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-[var(--text-primary)]"
                >
                  {t.auth.password}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t.auth.createPasswordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 input-focus border-[var(--surface-border)] focus:border-[var(--bee-primary)] pr-12"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-[var(--text-muted)]" />
                    ) : (
                      <Eye className="h-4 w-4 text-[var(--text-muted)]" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-[var(--text-primary)]"
                >
                  {t.auth.confirmPassword}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t.auth.confirmPasswordPlaceholder}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 input-focus border-[var(--surface-border)] focus:border-[var(--bee-primary)] pr-12"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-[var(--text-muted)]" />
                    ) : (
                      <Eye className="h-4 w-4 text-[var(--text-muted)]" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-[var(--error-light)] border border-[var(--error)] text-sm text-[var(--error)] text-center">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold mt-2"
                disabled={loading}
              >
                {loading ? t.auth.creatingAccount : t.auth.createAccount}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="text-center text-sm pt-2">
              <span className="text-[var(--text-secondary)]">
                {t.auth.alreadyHaveAccount}{" "}
              </span>
              <Link
                href="/login"
                className="font-semibold text-[var(--bee-primary)] hover:text-[var(--bee-primary-dark)] transition-colors"
              >
                {t.auth.signIn}
              </Link>
            </div>

            {/* Trust Badge & Powered By */}
            <div className="pt-4 border-t border-[var(--surface-border)] space-y-4">
              <TrustBadge variant="compact" />
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div
          className="mt-6 text-center animate-fade-slide-up"
          style={{
            animationDelay: "0.4s",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          <p className="text-xs text-[var(--text-muted)]">
            Aligned with Central Bank of Sri Lanka&apos;s Financial Literacy
            Initiative
          </p>
        </div>
      </div>
    </div>
  );
}
