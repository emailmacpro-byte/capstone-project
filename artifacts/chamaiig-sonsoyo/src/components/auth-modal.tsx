import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [selectedRole, setSelectedRole] = useState<"teacher" | "psychologist">("teacher");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUserData } = useAuth();
  const { toast } = useToast();

  const reset = () => {
    setName(""); setEmail(""); setPhone(""); setPassword("");
  };

  const handleRegister = async () => {
    if (!name || !email || !phone || !password) {
      toast({ title: "Бүх талбарыг бөглөнө үү", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password, role: selectedRole }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast({ title: "Алдаа", description: err.error || "Бүртгэл амжилтгүй", variant: "destructive" });
        return;
      }
      const user = await res.json();
      setUserData(user.role as any, user.name, user.email, user.phone ?? "", user.id);
      toast({ title: "✅ Бүртгэл амжилттай!", description: `${user.name}, тавтай морил!` });
      reset();
      onClose();
    } catch {
      toast({ title: "Холболтын алдаа гарлаа", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast({ title: "Имэйл болон нууц үгээ оруулна уу", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast({ title: "Алдаа", description: err.error || "Нэвтрэлт амжилтгүй", variant: "destructive" });
        return;
      }
      const user = await res.json();
      setUserData(user.role as any, user.name, user.email, user.phone ?? "", user.id);
      toast({ title: "✅ Нэвтэрлээ!", description: `Тавтай морил, ${user.name}!` });
      reset();
      onClose();
    } catch {
      toast({ title: "Холболтын алдаа гарлаа", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-sm rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-black text-purple-800">
            {tab === "login" ? "🔐 Нэвтрэх" : "✨ Бүртгүүлэх"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex rounded-2xl overflow-hidden border border-purple-200 mb-3">
          {(["login", "register"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 text-sm font-bold transition-colors ${
                tab === t ? "bg-purple-600 text-white" : "bg-white text-purple-600 hover:bg-purple-50"
              }`}
            >
              {t === "login" ? "Нэвтрэх" : "Бүртгүүлэх"}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {tab === "register" && (
            <>
              <div className="flex gap-2">
                {(["teacher", "psychologist"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelectedRole(r)}
                    className={`flex-1 rounded-xl p-2.5 font-bold text-sm border-2 transition-all ${
                      selectedRole === r
                        ? "border-purple-500 bg-purple-50 text-purple-700"
                        : "border-gray-200 text-gray-500 bg-white hover:border-purple-300"
                    }`}
                  >
                    {r === "teacher" ? "👨‍🏫 Багш" : "🧠 Сэтгэлзүйч"}
                  </button>
                ))}
              </div>
              <input
                className="w-full rounded-xl border border-purple-200 px-4 py-2.5 text-sm outline-none focus:border-purple-500 transition-colors"
                placeholder="Нэр"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="w-full rounded-xl border border-purple-200 px-4 py-2.5 text-sm outline-none focus:border-purple-500 transition-colors"
                placeholder="Утасны дугаар"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </>
          )}

          <input
            className="w-full rounded-xl border border-purple-200 px-4 py-2.5 text-sm outline-none focus:border-purple-500 transition-colors"
            placeholder="Имэйл хаяг"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full rounded-xl border border-purple-200 px-4 py-2.5 text-sm outline-none focus:border-purple-500 transition-colors"
            placeholder="Нууц үг"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold h-11"
            onClick={tab === "login" ? handleLogin : handleRegister}
            disabled={loading}
          >
            {loading ? "Уншиж байна..." : tab === "login" ? "Нэвтрэх" : "Бүртгүүлэх"}
          </Button>

          {tab === "register" && (
            <p className="text-xs text-gray-400 text-center">
              Бүртгэлийн дараа мэдээллээ профайлаасаа шинэчлэх боломжтой.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
