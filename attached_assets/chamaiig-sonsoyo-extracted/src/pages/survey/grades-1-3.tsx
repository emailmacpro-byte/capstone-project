import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Pause } from "lucide-react";

const questions = [
  {
    id: "q1",
    text: "Өнөөдөр сургууль дээр хэр байв?",
    bg: "from-violet-400 to-purple-300",
    options: [
      { emoji: "😄", label: "Маш гоё!", score: 0, color: "#22c55e" },
      { emoji: "🙂", label: "Дажгүй", score: 5, color: "#86efac" },
      { emoji: "🙁", label: "Онцгүй", score: 15, color: "#fbbf24" },
      { emoji: "😢", label: "Уйлмаар", score: 25, color: "#f87171" },
    ],
  },
  {
    id: "q2",
    text: "Хэн нэгэн чамайг гомдоосон уу?",
    bg: "from-pink-400 to-rose-300",
    options: [
      { emoji: "👍", label: "Үгүй, зүгээр", score: 0, color: "#22c55e" },
      { emoji: "😥", label: "Тийм...", score: 30, color: "#f87171" },
    ],
  },
  {
    id: "q3",
    text: "Сургуульд өөрийгөө аюулгүй гэж мэдэрдэг үү?",
    bg: "from-sky-400 to-blue-300",
    options: [
      { emoji: "💚", label: "Тийм, аюулгүй", score: 0, color: "#22c55e" },
      { emoji: "😨", label: "Заримдаа айдаг", score: 20, color: "#fbbf24" },
      { emoji: "🚨", label: "Айдаг байна", score: 35, color: "#f87171" },
    ],
  },
  {
    id: "q4",
    text: "Багштайгаа ярилцмаар санагдаж байна уу?",
    bg: "from-amber-400 to-orange-300",
    options: [
      { emoji: "🙋", label: "Тиймээ, яг одоо!", score: 15, color: "#f59e0b" },
      { emoji: "🙅", label: "Үгүй, зүгээр", score: 0, color: "#22c55e" },
    ],
  },
  {
    id: "q5",
    text: "Гэртээ таван санагддаг уу?",
    bg: "from-emerald-400 to-teal-300",
    options: [
      { emoji: "🏠", label: "Тийм, тав тухтай", score: 0, color: "#22c55e" },
      { emoji: "😶", label: "Заримдаа", score: 10, color: "#fbbf24" },
      { emoji: "😰", label: "Үгүй...", score: 30, color: "#f87171" },
    ],
  },
];

const CONFETTI_COLORS = ["#f472b6","#a78bfa","#60a5fa","#34d399","#fbbf24","#f87171"];

export default function SurveyGrades1to3() {
  const [_, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [animKey, setAnimKey] = useState(0);

  const q = questions[step];
  const progress = (step / questions.length) * 100;
  const progressFull = ((step + 1) / questions.length) * 100;

  const handleSelect = (score: number, idx: number) => {
    setSelected(idx);
    setAnswers((prev) => ({ ...prev, [q.id]: score }));
  };

  const handleNext = () => {
    if (answers[q.id] === undefined) return;
    if (step < questions.length - 1) {
      setStep((s) => s + 1);
      setSelected(null);
      setAnimKey((k) => k + 1);
    } else {
      const total = Object.values(answers).reduce((a, b) => a + b, 0);
      setLocation(`/survey/result?score=${Math.min(100, total)}`);
    }
  };

  const handleBack = () => {
    if (step > 0) { setStep((s) => s - 1); setSelected(null); setAnimKey((k) => k + 1); }
    else setLocation("/survey");
  };

  const isLastQ = step === questions.length - 1;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(160deg,#f8f4ff 0%,#fef0f8 50%,#f0faff 100%)" }}>

      {/* Progress bar */}
      <div className="px-4 pt-4">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={handleBack} className="p-2 rounded-full glass border border-purple-100 hover:scale-110 transition-all">
            <ChevronLeft className="w-5 h-5 text-purple-600" />
          </button>
          <div className="flex-1 h-5 bg-purple-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressFull}%`,
                background: "linear-gradient(90deg,#a855f7,#ec4899,#f59e0b)",
                boxShadow: "0 0 12px rgba(168,85,247,0.5)",
              }}
            />
          </div>
          <button className="p-2 rounded-full glass border border-purple-100 hover:scale-110 transition-all">
            <Pause className="w-5 h-5 text-purple-400" />
          </button>
        </div>
        <p className="text-center text-sm font-bold text-purple-400">
          {step + 1} / {questions.length} асуулт
        </p>
      </div>

      {/* Question card */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div
          key={animKey}
          className={`w-full max-w-md rounded-3xl p-6 bg-gradient-to-br ${q.bg} text-white shadow-2xl animate-bounce-in mb-8`}
        >
          {/* Floating emoji clouds */}
          <div className="relative h-24 flex items-center justify-center mb-4">
            <div className="absolute left-4 top-0 text-4xl animate-float opacity-30">⭐</div>
            <div className="absolute right-4 bottom-0 text-3xl animate-float delay-500 opacity-30">✨</div>
            <span className="text-8xl">{q.options[0].emoji}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-center leading-snug drop-shadow">
            {q.text}
          </h2>
        </div>

        {/* Answer options */}
        <div
          className={`grid gap-4 w-full max-w-md ${q.options.length === 2 ? "grid-cols-2" : q.options.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}
        >
          {q.options.map((opt, i) => {
            const isSel = selected === i;
            return (
              <button
                key={i}
                onClick={() => handleSelect(opt.score, i)}
                className={`emoji-btn flex flex-col items-center justify-center gap-3 p-5 rounded-3xl border-4 transition-all glass ${isSel ? "selected scale-110 shadow-2xl" : "border-transparent hover:border-purple-200"}`}
                style={isSel ? { borderColor: opt.color, background: `${opt.color}22`, boxShadow: `0 12px 30px ${opt.color}55` } : {}}
              >
                <span style={{ fontSize: 56 }}>{opt.emoji}</span>
                <span className="text-base font-black text-gray-700">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Next button */}
      <div className="px-4 pb-8 flex justify-center">
        <Button
          size="lg"
          onClick={handleNext}
          disabled={answers[q.id] === undefined}
          className="rounded-full h-14 px-12 text-lg font-black shadow-xl transition-all hover:scale-105 disabled:opacity-40"
          style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)", border: "none", color: "white" }}
        >
          {isLastQ ? "🎉 Дуусгах" : "Дараах"} <ChevronRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
