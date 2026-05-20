import { useAuth, Role } from "@/lib/auth";
import { useLocation } from "wouter";

const ROLES = [
  {
    role: "student" as Role,
    name: "Сургуулийн сурагч",
    route: "/",
    emoji: "🎒",
    gradient: "from-violet-500 to-purple-400",
    title: "Сурагч",
    desc: "Судалгаа бөглөх, тусламж авах",
    glow: "shadow-purple-200",
  },
  {
    role: "teacher" as Role,
    name: "Бат багш",
    route: "/teacher",
    emoji: "👨‍🏫",
    gradient: "from-sky-500 to-blue-400",
    title: "Багш",
    desc: "Ангийн сурагчдын байдлыг хянах",
    glow: "shadow-sky-200",
  },
  {
    role: "psychologist" as Role,
    name: "Сарнай сэтгэл зүйч",
    route: "/psychologist",
    emoji: "🧠",
    gradient: "from-emerald-500 to-teal-400",
    title: "Сэтгэл зүйч",
    desc: "Кейсүүдтэй ажиллах, зөвлөгөө өгөх",
    glow: "shadow-emerald-200",
  },
  {
    role: "admin" as Role,
    name: "Систем Админ",
    route: "/admin",
    emoji: "⚙️",
    gradient: "from-slate-600 to-gray-500",
    title: "Админ",
    desc: "Системийн удирдлага, тайлан",
    glow: "shadow-slate-200",
  },
];

export default function Login() {
  const { setRole } = useAuth();
  const [_, setLocation] = useLocation();

  const handleLogin = (r: typeof ROLES[0]) => {
    setRole(r.role, r.name);
    setLocation(r.route);
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col">
      {/* Header gradient */}
      <div className="absolute top-0 left-0 w-full h-72 bg-hero-gradient rounded-b-[3rem] -z-0" />
      <div className="absolute top-6 left-6 w-28 h-28 bg-white/15 rounded-full animate-float" />
      <div className="absolute top-10 right-8 w-20 h-20 bg-yellow-300/25 rounded-full animate-float delay-700" />

      {/* Hero text */}
      <div className="relative z-10 pt-14 pb-10 px-6 text-center text-white">
        <div className="text-6xl mb-4 animate-float">🔐</div>
        <h1 className="text-4xl font-black drop-shadow-lg mb-2">Нэвтрэх</h1>
        <p className="text-white/85 max-w-xs mx-auto text-base">
          Өөрийн дүрийг сонгоно уу. <br/>
          <span className="text-yellow-300 font-bold">Энэ нь туршилтын горим юм.</span>
        </p>
      </div>

      {/* Role cards */}
      <div className="relative z-10 px-4 md:px-8 max-w-2xl mx-auto w-full grid grid-cols-1 gap-4 pb-12">
        {ROLES.map((r, i) => (
          <button
            key={i}
            onClick={() => handleLogin(r)}
            className={`card-shimmer rounded-3xl p-5 bg-gradient-to-r ${r.gradient} ${r.glow} text-white shadow-2xl text-left`}
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="flex items-center gap-5">
              <span className="text-5xl animate-float" style={{ animationDelay: `${i * 0.4}s` }}>{r.emoji}</span>
              <div className="flex-1">
                <h3 className="text-xl font-black">{r.title}</h3>
                <p className="text-white/75 text-sm">{r.desc}</p>
              </div>
              <span className="text-white/60 text-3xl">›</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
