import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Password = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Small delay for better UX
    setTimeout(() => {
      const success = login(password);
      if (success) {
        navigate("/", { replace: true });
      } else {
        setError("סיסמה שגויה. נסי שוב.");
        setPassword("");
        setIsLoading(false);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(350,60%,97%)] via-[hsl(345,45%,95%)] to-[hsl(35,60%,95%)] flex items-center justify-center px-4">
      <Card className="max-w-md w-full border-2 border-[hsl(345,35%,90%)] bg-white/90 backdrop-blur-sm shadow-2xl animate-fade-in-up">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Lock className="h-16 w-16 text-[hsl(345,75%,70%)] absolute" />
              <Heart className="h-12 w-12 text-[hsl(0,70%,75%)] fill-[hsl(0,70%,75%)] relative top-2 left-2 animate-float" />
            </div>
          </div>
          <CardTitle className="font-handwriting text-4xl md:text-5xl text-[hsl(340,40%,25%)] mb-2">
            מכתבי אהבה מוגנים
          </CardTitle>
          <CardDescription className="font-body text-base text-[hsl(340,25%,50%)]">
            הכניסי את הסיסמה כדי לגשת למכתבי האהבה שלך
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="font-body text-[hsl(340,40%,25%)]">
                סיסמה
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="הכניסי סיסמה"
                  className="font-body pl-10 border-[hsl(345,35%,90%)] focus:border-[hsl(345,75%,70%)] focus:ring-[hsl(345,75%,70%)]"
                  disabled={isLoading}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(340,25%,50%)] hover:text-[hsl(340,40%,25%)] transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {error && (
                <p className="text-sm text-[hsl(0,70%,65%)] font-body animate-fade-in-up">
                  {error}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full font-body bg-[hsl(345,75%,70%)] hover:bg-[hsl(345,75%,65%)] text-white"
              disabled={isLoading || !password}
            >
              {isLoading ? "בודקת..." : "פתחי מכתבי אהבה"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Password;

