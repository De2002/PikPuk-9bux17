import { useState } from "react";
import { X, Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { authService } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type Mode = "signin" | "signup";
type SignupStep = "email" | "otp" | "password";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultMode?: Mode;
}

const AuthModal = ({ open, onClose, defaultMode = "signup" }: AuthModalProps) => {
  const { login } = useAuth();
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [signupStep, setSignupStep] = useState<SignupStep>("email");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const reset = () => {
    setEmail(""); setOtp(""); setPassword(""); setUsername("");
    setSignupStep("email"); setLoading(false); setShowPassword(false);
  };

  const handleClose = () => { reset(); onClose(); };
  const switchMode = (m: Mode) => { reset(); setMode(m); };

  /* ── SIGN IN ── */
  const handleSignIn = async () => {
    if (!email || !password) return toast.error("Please fill in all fields.");
    setLoading(true);
    try {
      const user = await authService.signInWithPassword(email, password);
      login(authService.mapUser(user));
      toast.success("Welcome back!");
      handleClose();
    } catch (err: any) {
      toast.error(err.message || "Sign in failed.");
      setLoading(false);
    }
  };

  /* ── SIGN UP: step 1 ── */
  const handleSendOtp = async () => {
    if (!email) return toast.error("Please enter your email.");
    setLoading(true);
    try {
      await authService.sendOtp(email);
      toast.success("Check your email for a 4-digit code.");
      setSignupStep("otp");
    } catch (err: any) {
      toast.error(err.message || "Failed to send code.");
    } finally {
      setLoading(false);
    }
  };

  /* ── SIGN UP: step 2 ── */
  const handleVerifyOtp = async () => {
    if (otp.length < 4) return toast.error("Enter the 4-digit code from your email.");
    setSignupStep("password");
  };

  /* ── SIGN UP: step 3 ── */
  const handleCreateAccount = async () => {
    if (!password || password.length < 6) return toast.error("Password must be at least 6 characters.");
    setLoading(true);
    try {
      const u = await authService.verifyOtpAndSetPassword(email, otp, password, username || email.split("@")[0]);
      login(authService.mapUser(u));
      toast.success("Account created — welcome to Inktella!");
      handleClose();
    } catch (err: any) {
      toast.error(err.message || "Account creation failed.");
      setLoading(false);
    }
  };

  const stepLabel = mode === "signin" ? "" : signupStep === "email" ? "1 / 3" : signupStep === "otp" ? "2 / 3" : "3 / 3";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-background rounded-2xl shadow-2xl border border-border overflow-hidden">
        {/* Header */}
        <div className="bg-foreground px-6 py-5 flex items-start justify-between">
          <div>
            <p className="text-background/60 font-sans text-xs tracking-widest uppercase mb-1">
              Inktella · {stepLabel}
            </p>
            <h2 className="font-serif text-2xl font-bold text-background">
              {mode === "signin"
                ? "Welcome back"
                : signupStep === "email"
                ? "Create account"
                : signupStep === "otp"
                ? "Check your email"
                : "Set your password"}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors mt-0.5"
          >
            <X className="w-4 h-4 text-background" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-4">

          {/* ── SIGN IN ── */}
          {mode === "signin" && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-widest">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-secondary font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 focus:ring-2 focus:ring-foreground/10 transition-all"
                    onKeyDown={e => e.key === "Enter" && handleSignIn()}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-widest">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Your password"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-secondary font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 focus:ring-2 focus:ring-foreground/10 transition-all"
                    onKeyDown={e => e.key === "Enter" && handleSignIn()}
                  />
                  <button onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button
                onClick={handleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-foreground text-background rounded-xl font-sans font-semibold text-sm hover:bg-foreground/90 transition-all disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ArrowRight className="w-4 h-4" />Sign In</>}
              </button>
            </>
          )}

          {/* ── SIGN UP: step 1 – email ── */}
          {mode === "signup" && signupStep === "email" && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-widest">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-secondary font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 focus:ring-2 focus:ring-foreground/10 transition-all"
                    onKeyDown={e => e.key === "Enter" && handleSendOtp()}
                  />
                </div>
              </div>
              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-foreground text-background rounded-xl font-sans font-semibold text-sm hover:bg-foreground/90 transition-all disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ArrowRight className="w-4 h-4" />Continue</>}
              </button>
            </>
          )}

          {/* ── SIGN UP: step 2 – OTP ── */}
          {mode === "signup" && signupStep === "otp" && (
            <>
              <p className="text-sm font-sans text-muted-foreground">
                We sent a 4-digit code to <strong className="text-foreground">{email}</strong>.
              </p>
              <div className="space-y-1">
                <label className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-widest">Verification code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="1234"
                  maxLength={4}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-secondary font-serif text-2xl text-center tracking-[0.5em] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 focus:ring-2 focus:ring-foreground/10 transition-all"
                  onKeyDown={e => e.key === "Enter" && handleVerifyOtp()}
                />
              </div>
              <button
                onClick={handleVerifyOtp}
                disabled={otp.length < 4}
                className="w-full flex items-center justify-center gap-2 py-3 bg-foreground text-background rounded-xl font-sans font-semibold text-sm hover:bg-foreground/90 transition-all disabled:opacity-60"
              >
                <ArrowRight className="w-4 h-4" />Verify Code
              </button>
              <button onClick={() => setSignupStep("email")} className="w-full text-xs font-sans text-muted-foreground hover:text-foreground transition-colors underline">
                ← Change email
              </button>
            </>
          )}

          {/* ── SIGN UP: step 3 – password ── */}
          {mode === "signup" && signupStep === "password" && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-widest">Username (optional)</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder={email.split("@")[0]}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-secondary font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 focus:ring-2 focus:ring-foreground/10 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-widest">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-secondary font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 focus:ring-2 focus:ring-foreground/10 transition-all"
                    onKeyDown={e => e.key === "Enter" && handleCreateAccount()}
                  />
                  <button onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button
                onClick={handleCreateAccount}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-foreground text-background rounded-xl font-sans font-semibold text-sm hover:bg-foreground/90 transition-all disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ArrowRight className="w-4 h-4" />Create Account</>}
              </button>
            </>
          )}

          {/* Switch mode */}
          <p className="text-center text-xs font-sans text-muted-foreground pt-1">
            {mode === "signin" ? (
              <>No account?{" "}
                <button onClick={() => switchMode("signup")} className="text-foreground font-medium underline underline-offset-2 hover:text-accent transition-colors">
                  Sign up free
                </button>
              </>
            ) : (
              <>Already have an account?{" "}
                <button onClick={() => switchMode("signin")} className="text-foreground font-medium underline underline-offset-2 hover:text-accent transition-colors">
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
