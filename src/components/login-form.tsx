

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { auth, googleProvider } from "@/lib/firebase";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [mode, setMode] = useState<"signup" | "signin">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  // redirect if already logged in
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.replace("/today");
    });
    return () => unsub();
  }, [router]);

  const emailClean = email.trim().toLowerCase();
  const passClean = password.trim();

  // validation
  const emailValid = /^\S+@\S+\.\S+$/.test(emailClean);
  const strongPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
  const isValid = emailValid && (mode === "signin" || strongPassword.test(passClean));

  // password strength
  const getStrength = (pass: string) => {
    let s = 0;
    if (pass.length >= 8) s++;
    if (/[a-z]/.test(pass)) s++;
    if (/[A-Z]/.test(pass)) s++;
    if (/\d/.test(pass)) s++;
    if (/[^A-Za-z\d]/.test(pass)) s++;
    if (s <= 2) return "Weak";
    if (s <= 4) return "Medium";
    return "Strong";
  };
  const strength = getStrength(passClean);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      toast.error("Invalid email or password");
      return;
    }
    setLoadingEmail(true);
    try {
      if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, emailClean, passClean);
        toast.success("Account created successfully");
      } else {
        await signInWithEmailAndPassword(auth, emailClean, passClean);
        toast.success("Welcome back");
      }
      router.push("/today");
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleGoogle = async () => {
    setLoadingGoogle(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Signed in with Google");
      router.push("/today");
    } catch (error: any) {
      toast.error(error.message || "Google sign-in failed");
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleEmail} className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">
                  {mode === "signup" ? "Create Account" : "Welcome back"}
                </h1>
                <p className="text-balance text-muted-foreground">
                  {mode === "signup"
                    ? "Sign up to start winning your days"
                    : "Login to your Acme Inc account"}
                </p>
              </div>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  {mode === "signin" && (
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-2 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </Field>

              {/* Password strength indicator (only on signup) */}
              {mode === "signup" && password.length > 0 && (
                <p
                  className={`text-xs pl-1 ${
                    strength === "Weak"
                      ? "text-red-500"
                      : strength === "Medium"
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                >
                  Password strength: {strength}
                </p>
              )}

              <Field>
                <Button
                  type="submit"
                  disabled={!isValid || loadingEmail}
                  className="w-full"
                >
                  {loadingEmail
                    ? "Please wait..."
                    : mode === "signup"
                    ? "Create Account"
                    : "Login"}
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>

              <Field className="grid grid-cols-3 gap-4">
                {/* Apple (placeholder) */}
                <Button variant="outline" type="button" disabled>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Login with Apple</span>
                </Button>

                {/* Google */}
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleGoogle}
                  disabled={loadingGoogle}
                  className="flex items-center justify-center gap-2"
                >
                  {loadingGoogle ? (
                    "Wait..."
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.36 1.53 7.83 2.82l5.77-5.77C34.64 3.36 29.73 1.5 24 1.5 14.82 1.5 6.95 6.98 3.69 14.44l6.91 5.37C12.38 13.09 17.7 9.5 24 9.5z"/>
                        <path fill="#4285F4" d="M46.5 24c0-1.56-.14-3.06-.4-4.5H24v9h12.7c-.55 2.97-2.24 5.48-4.77 7.16l7.32 5.68C43.9 37.02 46.5 31.06 46.5 24z"/>
                        <path fill="#FBBC05" d="M10.6 28.81A14.5 14.5 0 0 1 9.5 24c0-1.67.29-3.28.8-4.79l-6.91-5.37A22.45 22.45 0 0 0 1.5 24c0 3.6.86 7 2.39 10l6.71-5.19z"/>
                        <path fill="#34A853" d="M24 46.5c5.73 0 10.54-1.9 14.05-5.17l-7.32-5.68c-2.02 1.36-4.6 2.17-6.73 2.17-6.3 0-11.62-3.59-13.4-8.81l-6.71 5.19C6.95 41.02 14.82 46.5 24 46.5z"/>
                      </svg>
                      <span className="sr-only">Login with Google</span>
                    </>
                  )}
                </Button>

                {/* Meta (placeholder) */}
                <Button variant="outline" type="button" disabled>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Login with Meta</span>
                </Button>
              </Field>

              <FieldDescription className="text-center">
                {mode === "signup" ? (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("signin")}
                      className="text-primary hover:underline font-medium"
                    >
                      Sign in
                    </button>
                  </>
                ) : (
                  <>
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("signup")}
                      className="text-primary hover:underline font-medium"
                    >
                      Sign up
                    </button>
                  </>
                )}
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="relative hidden bg-muted md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <a href="#" className="hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="hover:underline">
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  );
}