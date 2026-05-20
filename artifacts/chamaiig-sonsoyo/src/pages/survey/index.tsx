import { useState } from "react";
import { useLocation, Link } from "wouter";

const GRADES = [
  { id: "1-3", label: "1-3-р анги", emoji: "🌱", color: "from-green-400 to-emerald-300", desc: "Зурагтай, emoji-тай асуулт" },
  { id: "4-6", label: "4-6-р анги", emoji: "🌈", color: "from-sky-400 to-blue-300", desc: "Богино комик хэлбэртэй" },
  { id: "7-9", label: "7-9-р анги", emoji: "⚡", color: "from-violet-400 to-purple-300", desc: "Өөрийгөө үнэлэх тест" },
  { id: "10-12", label: "10-12-р анги", emoji: "🔐", color: "from-pink-400 to-rose-300", desc: "Нууцлалтай, дэлгэрэнгүй" },
];

const MODULES = [
  {
    href: "/mbti",
    emoji: "🧠",
    title: "MBTI Зан чанарын тест",
    desc: "Би ямар хүн бэ? 16 зан чанарын онцлог олж мэд.",
    gradient: "from-fuchsia-500 to-violet-400",
    tag: "10-12-р анги",
  },
  {
    href: "/riasec",
    emoji: "🚀",
    title: "Мэргэжил сонголт (RIASEC)",
    desc: "Миний сонирхолд ямар мэргэжил тохирох вэ?",
    gradient: "from-amber-500 to-orange-400",
    tag: "Бүх ангийнхан",
  },
];

export default function SurveyStart() {
  const [_, setLocation] = useLocation();
  const [grade, setGrade] = useState<string | null>(null);
  const [animIdx, setAnimIdx] = useState<number | null>(null);

  const handleGrade = (id: string, i: number) => {
    setGrade(id);
    setAnimIdx(i);
  };

  const handleStart = () => {
    if (!grade) return;
    if (grade === "1-3") setLocation("/survey/grades-1-3");
    else if (grade === "4-6") setLocation("/survey/grades-4-6");
    else if (grade === "7-9") setLocation("/survey/grades-7-9");
    else if (grade === "10-12") setLocation("/survey/grades-10-12");
  };

  return (
    <div className="relative min-h-screen pb-12 overflow-hidden">
      {/* Header gradient */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-indigo-500 via-purple-400 to-pink-400 rounded-b-[3rem] -z-0" />
      <div className="absolute top-8 left-8 w-24 h-24 bg-white/20 rounded-full animate-float" />
      <div className="absolute top-6 right-10 w-16 h-16 bg-yellow-300/30 rounded-full animate-float delay-500" />
      <span className="star animate-sparkle" style={{ top: "5%", left: "20%", fontSize: 20, animationDelay: "0.2s" }}>★</span>
      <span className="star animate-sparkle" style={{ top: "12%", left: "75%", fontSize: 16, animationDelay: "0.8s" }}>★</span>

      {/* Hero */}
      <div className="relative z-10 px-6 py-12 text-center text-white">
        <div className="text-6xl mb-4 animate-float">📋</div>
        <h1 className="text-4xl font-black drop-shadow-lg mb-2">Судалгаа бөглөх</h1>
        <p className="text-white/85 text-base max-w-sm mx-auto">
          Чиний хариулт <strong>нууцлалтай</strong> бөгөөд зөвхөн чамд туслах зорилготой.
        </p>
      </div>

      <div className="relative z-10 px-4 md:px-8 max-w-2xl mx-auto space-y-6">

        {/* Grade selection */}
        <div className="glass rounded-3xl p-6 border border-purple-100 shadow-xl">
          <h2 className="text-xl font-black text-purple-800 text-center mb-5">
            🎒 Чи хэддүгээр ангид сурдаг вэ?
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {GRADES.map((g, i) => {
              const isSel = grade === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => handleGrade(g.id, i)}
                  className={`rounded-3xl p-4 text-left transition-all border-4 ${animIdx === i ? "animate-bounce-in" : ""} ${isSel ? "scale-105 shadow-xl" : "hover:scale-102 bg-white/60"}`}
                  style={isSel ? {
                    background: `linear-gradient(135deg, ${g.color.includes("green") ? "#4ade80,#34d399" : g.color.includes("sky") ? "#38bdf8,#60a5fa" : g.color.includes("violet") ? "#a78bfa,#818cf8" : "#f472b6,#fb7185"})`,
                    borderColor: "transparent",
                    color: "white",
                  } : { borderColor: "transparent" }}
                >
                  <div className="text-4xl mb-2">{g.emoji}</div>
                  <div className={`font-black text-base ${isSel ? "text-white" : "text-purple-800"}`}>{g.label}</div>
                  <div className={`text-xs mt-0.5 ${isSel ? "text-white/80" : "text-purple-400"}`}>{g.desc}</div>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex justify-center">
            <button
              disabled={!grade}
              onClick={handleStart}
              className="rounded-full h-14 px-14 text-lg font-black text-white shadow-xl transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg,#a855f7,#ec4899,#f59e0b)", border: "none" }}
            >
              🎯 Судалгаа эхлэх →
            </button>
          </div>
        </div>

        {/* Special modules */}
        <div>
          <h2 className="text-xl font-black text-purple-800 mb-3 text-center">✨ Тусгай модулиуд</h2>
          <div className="space-y-3">
            {MODULES.map((m, i) => (
              <Link key={i} href={m.href}>
                <div className={`card-shimmer rounded-3xl p-5 bg-gradient-to-r ${m.gradient} text-white shadow-xl cursor-pointer`}>
                  <div className="flex items-center gap-4">
                    <span className="text-5xl animate-float" style={{ animationDelay: `${i * 0.5}s` }}>{m.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-black text-lg">{m.title}</h3>
                      </div>
                      <p className="text-white/75 text-sm">{m.desc}</p>
                      <span className="inline-block mt-1 text-xs bg-white/25 rounded-full px-2 py-0.5 font-semibold">{m.tag}</span>
                    </div>
                    <span className="text-white/60 text-3xl">›</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Privacy note */}
        <div className="glass rounded-2xl p-4 border border-purple-100 text-center">
          <p className="text-purple-600 text-sm font-semibold">
            🔒 Чиний мэдээлэл <strong>нууцлагдана</strong>. Зөвхөн чамд туслах зорилгоор ашиглана.
          </p>
        </div>
      </div>
    </div>
  );
}
