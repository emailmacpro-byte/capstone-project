import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { PhoneCall, Home, RotateCcw } from "lucide-react";
import { useSendNotification } from "@workspace/api-client-react";

const LEVELS = {
  green: {
    gradient: "from-emerald-400 via-green-300 to-teal-400",
    glow: "rgba(52,211,153,0.5)",
    emoji: "🌟",
    badge: "ХЭВИЙН",
    badgeColor: "#059669",
    title: "Чи маш сайн байна!",
    message: "Өнөөдрийн өдөр сайхан өнгөрч байгаад бид баяртай байна. Байнга ийм байгаарай! 💚",
    sub: "Багш танд анхааралтай хандсаар байна.",
    action: null,
    route: "/",
  },
  yellow: {
    gradient: "from-yellow-400 via-amber-300 to-orange-300",
    glow: "rgba(251,191,36,0.5)",
    emoji: "💛",
    badge: "АНХААРАХ",
    badgeColor: "#b45309",
    title: "Бага зэрэг санаа зовж байна уу?",
    message: "Заримдаа хэцүү өдрүүд байдаг. Сургуулийн багш эсвэл сэтгэл зүйчтэй ярилцаарай. 🤝",
    sub: "Багшид тусламжийн мэдэгдэл илгээгдлээ.",
    action: "Тусламж авах",
    route: "/help",
  },
  orange: {
    gradient: "from-orange-400 via-red-300 to-pink-400",
    glow: "rgba(249,115,22,0.5)",
    emoji: "🧡",
    badge: "МЭРГЭЖИЛТЭНД",
    badgeColor: "#c2410c",
    title: "Чи ганцаараа биш шүү.",
    message: "Чамд хэцүү байгааг бид ойлгоно. Нийгмийн ажилтан эсвэл сэтгэл зүйчтэй уулзахыг зөвлөж байна. 💙",
    sub: "Багш болон сэтгэл зүйчид мэдэгдэл илгээгдлээ.",
    action: "Тусламж хүсэх",
    route: "/help",
  },
  red: {
    gradient: "from-red-500 via-rose-400 to-pink-500",
    glow: "rgba(239,68,68,0.6)",
    emoji: "🆘",
    badge: "ЯАРАЛТАЙ",
    badgeColor: "#991b1b",
    title: "Яаралтай тусламж хэрэгтэй!",
    message: "Чи аюулгүй байх ёстой. Яг одоо 108 дугаарт залга эсвэл итгэлтэй хүнд хэл! 🚨",
    sub: "Багш болон нийгмийн ажилтанд яаралтай мэдэгдэл илгээгдлээ.",
    action: "108 руу залгах",
    route: "tel:108",
  },
};

const STARS = [
  { top: "10%", left: "8%", size: 22, delay: 0 },
  { top: "20%", left: "88%", size: 16, delay: 0.4 },
  { top: "60%", left: "5%",  size: 18, delay: 0.9 },
  { top: "75%", left: "85%", size: 14, delay: 1.3 },
];

export default function SurveyResult() {
  const [_, setLocation] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const score = Math.min(100, Math.max(0, parseInt(params.get("score") || "0", 10)));
  const notified = useRef(false);

  let level: keyof typeof LEVELS = "green";
  if (score > 25 && score <= 50) level = "yellow";
  if (score > 50 && score <= 75) level = "orange";
  if (score > 75) level = "red";

  const cfg = LEVELS[level];
  const sendNotification = useSendNotification();

  useEffect(() => {
    if (!notified.current && (level === "orange" || level === "red")) {
      notified.current = true;
      sendNotification.mutate({
        data: {
          to: "teacher@school.mn",
          subject: `Эрсдэлийн анхааруулга — ${cfg.badge}`,
          type: "risk_alert",
          studentCode: "STU-ANON",
          riskLevel: level,
          grade: "unknown",
          flags: [],
        },
      });
    }
  }, []);

  const handleAction = () => {
    if (cfg.route?.startsWith("tel:")) window.location.href = cfg.route;
    else if (cfg.route) setLocation(cfg.route);
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pb-12"
      style={{ background: "linear-gradient(160deg,#f8f4ff 0%,#fef0f8 50%,#f0faff 100%)" }}
    >
      {/* Floating stars */}
      {STARS.map((s, i) => (
        <span key={i} className="star animate-sparkle" style={{ top: s.top, left: s.left, fontSize: s.size, animationDelay: `${s.delay}s` }}>★</span>
      ))}

      {/* Floating blobs */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-br from-purple-300 to-pink-200 rounded-full opacity-20 animate-float" />
      <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-gradient-to-br from-sky-300 to-teal-200 rounded-full opacity-20 animate-float-slow" />

      <div className="relative z-10 w-full max-w-md px-4 text-center space-y-6 animate-bounce-in">

        {/* Big animated emoji circle */}
        <div
          className="w-44 h-44 rounded-full mx-auto flex items-center justify-center shadow-2xl"
          style={{
            background: `linear-gradient(135deg, ${cfg.gradient.includes("emerald") ? "#34d399,#10b981" : cfg.gradient.includes("yellow") ? "#fbbf24,#f59e0b" : cfg.gradient.includes("orange") ? "#fb923c,#f87171" : "#ef4444,#f43f5e"})`,
            boxShadow: `0 0 60px ${cfg.glow}, 0 0 100px ${cfg.glow}55`,
            animation: level === "red" ? "pulse-glow-red 1.6s ease-in-out infinite" : "pulse-glow 2s ease-in-out infinite",
          }}
        >
          <span style={{ fontSize: 72 }} className="animate-float">{cfg.emoji}</span>
        </div>

        {/* Level badge */}
        <div
          className="inline-block rounded-full px-5 py-2 text-sm font-black tracking-widest text-white shadow-lg"
          style={{ background: cfg.badgeColor }}
        >
          {cfg.badge}
        </div>

        {/* Score bar */}
        <div>
          <p className="text-purple-500 text-sm font-bold mb-2">Эрсдэлийн оноо: {score} / 100</p>
          <div className="h-4 bg-purple-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${score}%`,
                background: score <= 25 ? "linear-gradient(90deg,#34d399,#10b981)" : score <= 50 ? "linear-gradient(90deg,#fbbf24,#f59e0b)" : score <= 75 ? "linear-gradient(90deg,#fb923c,#f87171)" : "linear-gradient(90deg,#ef4444,#f43f5e)",
                boxShadow: `0 0 12px ${cfg.glow}`,
              }}
            />
          </div>
        </div>

        {/* Message card */}
        <div className={`rounded-3xl p-6 bg-gradient-to-br ${cfg.gradient} text-white shadow-xl`}>
          <h1 className="text-2xl font-black mb-3 drop-shadow">{cfg.title}</h1>
          <p className="text-white/90 text-base leading-relaxed">{cfg.message}</p>
        </div>

        {/* 108 hotline for red */}
        {level === "red" && (
          <div className="rounded-3xl p-5 bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-2xl animate-pulse-glow-red">
            <PhoneCall className="w-10 h-10 mx-auto mb-2 animate-float" />
            <p className="font-black text-xl mb-1">Хүүхдийн тусламжийн утас</p>
            <a href="tel:108" className="text-5xl font-black block underline decoration-wavy">108</a>
            <p className="text-white/80 text-sm mt-1">24 цаг — Үнэгүй — Нууцлалтай</p>
          </div>
        )}

        {/* Notification indicator */}
        {(level === "orange" || level === "red") && (
          <div className="glass rounded-2xl px-4 py-3 border border-purple-100 text-purple-700 text-sm font-bold animate-slide-up">
            📧 {cfg.sub}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {cfg.action && (
            <Button
              size="lg"
              onClick={handleAction}
              className="flex-1 rounded-full h-13 font-black text-base shadow-xl hover:scale-105 transition-all border-0 text-white"
              style={{ background: `linear-gradient(135deg,#a855f7,#ec4899)` }}
            >
              {cfg.action}
            </Button>
          )}
          <Button
            size="lg"
            variant="outline"
            onClick={() => setLocation("/")}
            className="flex-1 rounded-full h-13 font-bold border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:scale-105 transition-all"
          >
            <Home className="w-4 h-4 mr-2" /> Нүүр хуудас
          </Button>
          <Button
            size="lg"
            variant="ghost"
            onClick={() => setLocation("/survey")}
            className="flex-1 rounded-full h-13 font-bold text-purple-500 hover:bg-purple-50"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Дахин
          </Button>
        </div>
      </div>
    </div>
  );
}
