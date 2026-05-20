import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Heart, FileText, Scale, Shield, Users, LayoutDashboard, Star, Sparkles, Zap, Rainbow, Brain, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

const MOODS = [
  { emoji: "😄", label: "Маш сайн!", color: "#22c55e", bg: "from-green-400 to-emerald-300", ring: "#86efac", msg: "Гайхалтай! Өдрийг сайхан өнгөрүүлээрэй! 🌟" },
  { emoji: "🙂", label: "Дундаж", color: "#facc15", bg: "from-yellow-400 to-amber-300", ring: "#fde68a", msg: "Тайван өдөр байна даа. Бас л сайн хэрэг! 🎈" },
  { emoji: "😢", label: "Гунигтай", color: "#60a5fa", bg: "from-blue-400 to-indigo-300", ring: "#bfdbfe", msg: "Чамайг ойлгож байна. Хэн нэгэнтэй ярилцмаар байна уу? 💙" },
  { emoji: "😨", label: "Айсан", color: "#a78bfa", bg: "from-violet-400 to-purple-300", ring: "#ddd6fe", msg: "Айхаа мэдэрч байгаа бол — тусламж авах боломжтой 💜" },
  { emoji: "😠", label: "Ууртай", color: "#f87171", bg: "from-red-400 to-pink-300", ring: "#fecaca", msg: "Уурхан байгаа бол бид ойлгоно. Ярилцвал хялбар болно 🤝" },
];

const STUDENT_CARDS = [
  {
    href: "/survey",
    emoji: "📋",
    title: "Судалгаа бөглөх",
    desc: "Өөрийнхөө мэдрэмжийг хуваалц",
    gradient: "from-violet-500 to-purple-400",
    glow: "shadow-purple-200",
  },
  {
    href: "/help",
    emoji: "💖",
    title: "Тусламж авах",
    desc: "Хэн нэгэнтэй ярилцмаар байвал",
    gradient: "from-pink-500 to-rose-400",
    glow: "shadow-pink-200",
  },
  {
    href: "/legal",
    emoji: "⚖️",
    title: "Хуулийн булан",
    desc: "Миний эрх юу вэ?",
    gradient: "from-sky-500 to-blue-400",
    glow: "shadow-sky-200",
  },
  {
    href: "/mbti",
    emoji: "🧠",
    title: "MBTI тест",
    desc: "Зан чанараа нээж мэдэр",
    gradient: "from-fuchsia-500 to-pink-400",
    glow: "shadow-fuchsia-200",
  },
  {
    href: "/riasec",
    emoji: "🚀",
    title: "Мэргэжил олох",
    desc: "Ямар мэргэжил тохирох вэ?",
    gradient: "from-amber-500 to-orange-400",
    glow: "shadow-amber-200",
  },
];

const SUPPORT_QUOTES = [
  { text: "Санаа зовж байвал ганцаараа бүү үлд", color: "from-violet-400 to-purple-300", star: "⭐" },
  { text: "Чи буруутай биш", color: "from-pink-400 to-rose-300", star: "💫" },
  { text: "Тусламж хүсэх нь зориг", color: "from-sky-400 to-blue-300", star: "✨" },
  { text: "Чамайг сонсох хүн бий", color: "from-emerald-400 to-teal-300", star: "🌟" },
];

const STARS = [
  { top: "8%", left: "12%", size: 20, delay: 0 },
  { top: "15%", left: "82%", size: 16, delay: 0.5 },
  { top: "45%", left: "5%",  size: 12, delay: 1 },
  { top: "60%", left: "90%", size: 18, delay: 1.5 },
  { top: "80%", left: "20%", size: 14, delay: 0.8 },
  { top: "72%", left: "70%", size: 22, delay: 0.3 },
];

export default function Home() {
  const { role } = useAuth();
  const [_, setLocation] = useLocation();
  const [mood, setMood] = useState<string | null>(null);
  const [popped, setPopped] = useState<number | null>(null);

  const selectedMood = MOODS.find(m => m.label === mood);
  const isStudent = !role || role === "student";

  const handleMood = (label: string, i: number) => {
    setMood(label);
    setPopped(i);
    setTimeout(() => setPopped(null), 400);
  };

  return (
    <div className="relative min-h-screen pb-12 overflow-hidden">

      {/* Floating star sparkles */}
      {STARS.map((s, i) => (
        <span key={i} className="star animate-sparkle" style={{ top: s.top, left: s.left, fontSize: s.size, animationDelay: `${s.delay}s` }}>★</span>
      ))}

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-hero-gradient px-6 py-14 text-white text-center">
        {/* Inner decorative circles */}
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-white/10 rounded-full animate-float" />
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full animate-float-slow delay-500" />
        <div className="absolute top-6 right-10 w-20 h-20 bg-yellow-300/20 rounded-full animate-float delay-300" />

        <div className="relative z-10 max-w-2xl mx-auto animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-sm font-semibold mb-5 border border-white/30">
            <Sparkles className="w-4 h-4 text-yellow-300 animate-sparkle" />
            Монгол сургуулийн хамгаалагч систем
          </div>

          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-5 drop-shadow-lg">
            Чамайг сонсох,<br />
            <span className="text-yellow-300">хамгаалах,</span><br />
            дэмжих орчин
          </h1>

          <p className="text-white/90 text-lg md:text-xl mb-8 leading-relaxed">
            Энд чи юу ч ярьж болно.<br/>
            Бид чамайг шүүхгүй — <strong>харин туслах болно.</strong>
          </p>

          {isStudent && (
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                onClick={() => setLocation("/survey")}
                className="rounded-full bg-white text-purple-700 hover:bg-yellow-100 font-bold px-7 h-12 text-base shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                📋 Судалгаа эхлэх
              </Button>
              <Button
                onClick={() => setLocation("/help")}
                className="rounded-full bg-pink-500 hover:bg-pink-400 text-white font-bold px-7 h-12 text-base shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                💖 Тусламж авах
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ─── MOOD WIDGET ─── */}
      {isStudent && (
        <section className="px-4 md:px-8 max-w-2xl mx-auto mt-8">
          <div className="glass rounded-3xl p-6 shadow-xl border border-purple-100 animate-slide-up delay-200">
            <h2 className="text-2xl font-black text-center text-purple-800 mb-6">
              Өнөөдөр чамд ямар санагдаж байна? 🌈
            </h2>
            <div className="flex justify-around flex-wrap gap-4">
              {MOODS.map((m, i) => {
                const isSelected = mood === m.label;
                return (
                  <button
                    key={i}
                    onClick={() => handleMood(m.label, i)}
                    className={`emoji-btn flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border-4 ${popped === i ? "animate-pop" : ""}`}
                    style={{
                      borderColor: isSelected ? m.color : "transparent",
                      background: isSelected
                        ? `linear-gradient(135deg, ${m.ring}, ${m.ring}88)`
                        : "rgba(255,255,255,0.6)",
                      boxShadow: isSelected ? `0 8px 24px ${m.ring}` : "none",
                    }}
                  >
                    <span style={{ fontSize: 52 }}>{m.emoji}</span>
                    <span className="text-sm font-bold" style={{ color: m.color }}>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {selectedMood && (
              <div className="mt-6 animate-bounce-in">
                <div className={`rounded-2xl p-4 text-white text-center bg-gradient-to-r ${selectedMood.bg} shadow-lg`}>
                  <p className="text-lg font-bold">{selectedMood.msg}</p>
                  {(mood === "Гунигтай" || mood === "Айсан" || mood === "Ууртай") && (
                    <Button
                      onClick={() => setLocation("/help")}
                      className="mt-3 rounded-full bg-white/30 hover:bg-white/50 text-white font-bold border border-white/50"
                    >
                      💙 Тусламж авах
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── STUDENT CARDS ─── */}
      {isStudent && (
        <section className="px-4 md:px-8 max-w-2xl mx-auto mt-8">
          <h2 className="text-2xl font-black text-center text-purple-800 mb-5 animate-slide-up delay-300">
            <Rainbow className="inline w-7 h-7 mr-2 text-pink-400" />
            Юу хийх вэ?
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {STUDENT_CARDS.map((card, i) => (
              <Link key={i} href={card.href}>
                <div
                  className={`card-shimmer rounded-3xl p-5 cursor-pointer bg-gradient-to-r ${card.gradient} shadow-xl ${card.glow} text-white`}
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-5xl animate-float" style={{ animationDelay: `${i * 0.3}s` }}>{card.emoji}</span>
                    <div>
                      <h3 className="text-xl font-black">{card.title}</h3>
                      <p className="text-white/80 text-sm">{card.desc}</p>
                    </div>
                    <div className="ml-auto text-white/60 text-3xl">›</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Staff quick links */}
      {role === "teacher" && (
        <section className="px-4 md:px-8 max-w-2xl mx-auto mt-8">
          <Link href="/teacher">
            <div className="card-shimmer rounded-3xl p-6 bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-xl cursor-pointer">
              <div className="flex items-center gap-4">
                <Shield className="w-12 h-12" />
                <div>
                  <h3 className="text-2xl font-black">Багшийн самбар</h3>
                  <p className="text-white/80">Ангийн сурагчдын төлөв байдал</p>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}
      {role === "psychologist" && (
        <section className="px-4 md:px-8 max-w-2xl mx-auto mt-8">
          <Link href="/psychologist">
            <div className="card-shimmer rounded-3xl p-6 bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-xl cursor-pointer">
              <div className="flex items-center gap-4">
                <Users className="w-12 h-12" />
                <div>
                  <h3 className="text-2xl font-black">Сэтгэл зүйчийн самбар</h3>
                  <p className="text-white/80">Идэвхтэй кейсүүд болон мэдээлэл</p>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}
      {role === "admin" && (
        <section className="px-4 md:px-8 max-w-2xl mx-auto mt-8">
          <Link href="/admin">
            <div className="card-shimmer rounded-3xl p-6 bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-xl cursor-pointer">
              <div className="flex items-center gap-4">
                <LayoutDashboard className="w-12 h-12" />
                <div>
                  <h3 className="text-2xl font-black">Админ самбар</h3>
                  <p className="text-white/80">Системийн хяналт, тайлан</p>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ─── SUPPORT QUOTES ─── */}
      {isStudent && (
        <section className="px-4 md:px-8 max-w-2xl mx-auto mt-10">
          <h2 className="text-xl font-black text-center text-purple-700 mb-5 animate-slide-up">
            💌 Чамд хэлэхийг хүсэж байна
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {SUPPORT_QUOTES.map((q, i) => (
              <div
                key={i}
                className={`rounded-3xl p-4 bg-gradient-to-br ${q.color} text-white shadow-lg animate-slide-up card-shimmer`}
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                <div className="text-2xl mb-2">{q.star}</div>
                <p className="text-sm font-bold leading-snug">"{q.text}"</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── EMERGENCY BANNER ─── */}
      {isStudent && (
        <section className="px-4 md:px-8 max-w-2xl mx-auto mt-8">
          <div className="rounded-3xl p-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-center shadow-xl animate-pulse-glow-red">
            <p className="text-lg font-black mb-2">🆘 Яаралтай тусламж хэрэгтэй бол:</p>
            <a href="tel:108" className="text-4xl font-black underline decoration-wavy">108</a>
            <p className="text-white/80 text-sm mt-1">Хүүхдийн тусламжийн утас — 24/7</p>
          </div>
        </section>
      )}
    </div>
  );
}
