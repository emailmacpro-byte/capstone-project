import { useState } from "react";
import { Link } from "wouter";
import { XCircle, Sparkles, UserRound, LogOut, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { AuthModal } from "@/components/auth-modal";
import { WaCallDialog } from "@/components/wa-call-dialog";

export function Layout({ children }: { children: React.ReactNode }) {
  const { role, name, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [show108, setShow108] = useState(false);

  const handleQuickExit = () => {
    window.location.href = "https://www.google.com";
  };

  return (
    <div
      className="min-h-[100dvh] flex flex-col w-full max-w-md mx-auto shadow-2xl relative md:max-w-4xl overflow-hidden"
      style={{ background: "linear-gradient(160deg, #f8f4ff 0%, #fef0f8 40%, #f0faff 80%, #f4fff8 100%)" }}
    >
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="shape animate-float" style={{ width: 220, height: 220, background: "linear-gradient(135deg,#c084fc,#818cf8)", top: "-60px", left: "-60px" }} />
        <div className="shape animate-float delay-700" style={{ width: 160, height: 160, background: "linear-gradient(135deg,#fb7185,#fbbf24)", top: "30%", right: "-50px" }} />
        <div className="shape animate-float-slow delay-300" style={{ width: 280, height: 280, background: "linear-gradient(135deg,#34d399,#60a5fa)", bottom: "10%", left: "10%" }} />
        <div className="shape animate-float delay-1000" style={{ width: 120, height: 120, background: "linear-gradient(135deg,#f472b6,#c084fc)", bottom: "20%", right: "5%" }} />
      </div>

      {/* Top header */}
      <header className="sticky top-0 z-50 glass border-b border-white/60 px-4 py-3 flex items-center justify-between shadow-md">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-hero-gradient flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-xl tracking-tight">
            <span className="rainbow-text">Чамайг</span>
            <span className="text-purple-800 ml-1">Сонсъё</span>
          </span>
        </Link>

        <div className="flex items-center gap-1.5">
          {/* Emergency 108 */}
          <Button
            variant="destructive"
            size="sm"
            className="rounded-full font-bold shadow-lg animate-pulse-glow-red bg-gradient-to-r from-red-500 to-pink-500 border-0 text-white"
            onClick={() => setShow108(true)}
          >
            <PhoneCall className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Яаралтай</span>
            <span className="sm:hidden">108</span>
          </Button>

          {/* Auth button */}
          {role ? (
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-purple-700 hidden sm:inline max-w-[72px] truncate">{name}</span>
              <Button
                variant="outline"
                size="sm"
                title="Нэвтрэлтээс гарах"
                className="rounded-full border-purple-200 text-purple-700 hover:bg-purple-50 glass px-2"
                onClick={logout}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-purple-200 text-purple-700 hover:bg-purple-50 glass"
              onClick={() => setShowAuth(true)}
            >
              <UserRound className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Нэвтрэх</span>
            </Button>
          )}

        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto w-full relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 glass border-t border-white/60 p-4 text-center text-xs text-purple-600">
        <p>⚠️ Энэ систем онош тавихгүй. Зөвхөн эрт илрүүлэлт, дэмжлэг, чиглүүлгийн зорилготой.</p>
        {role && (
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="font-semibold text-purple-700">Нэвтэрсэн: {name} ({role})</span>
            <Button variant="link" size="sm" onClick={logout} className="h-auto p-0 text-pink-500">Гарах</Button>
          </div>
        )}
      </footer>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
      <WaCallDialog open={show108} onClose={() => setShow108(false)} />
    </div>
  );
}
