import { useState } from "react";
import { Shield, Star } from "lucide-react";

const RIGHTS = [
  { emoji: "🛡️", title: "Аюулгүй байх эрх", desc: "Хүүхэд бүр эрүүл, аюулгүй орчинд өсөж торних эрхтэй.", color: "from-sky-400 to-blue-300", bg: "#e0f2fe" },
  { emoji: "💪", title: "Хамгаалуулах эрх", desc: "Ямар ч хүчирхийлэл, дарамтаас ангид байх эрхтэй.", color: "from-green-400 to-emerald-300", bg: "#dcfce7" },
  { emoji: "📚", title: "Сурч боловсрох эрх", desc: "Чанартай боловсрол эзэмшиж, авьяас чадвараа хөгжүүлэх эрхтэй.", color: "from-violet-400 to-purple-300", bg: "#ede9fe" },
  { emoji: "🗣️", title: "Санал бодлоо хэлэх эрх", desc: "Өөрт хамааралтай асуудлаар үзэл бодлоо чөлөөтэй илэрхийлэх эрхтэй.", color: "from-amber-400 to-orange-300", bg: "#fef3c7" },
  { emoji: "🤝", title: "Тусламж авах эрх", desc: "Хэрэгтэй үед тусламж хүсэх, мэргэжилтнүүдэд хандах эрхтэй.", color: "from-pink-400 to-rose-300", bg: "#fce7f3" },
  { emoji: "🌈", title: "Ялгаварлан гадуурхуулахгүй байх эрх", desc: "Гарал, шашин, хүйс харгалзахгүйгээр тэгш эрхтэй байх эрхтэй.", color: "from-fuchsia-400 to-violet-300", bg: "#fae8ff" },
];

const VIOLENCE_TYPES = [
  { emoji: "👊", title: "Бие махбодын хүчирхийлэл", desc: "Зодох, цохих, түлхэх, чимхэх зэргээр биед халдаж өвтгөх. Ямар ч шалтаанаар зогшоогүй.", color: "from-red-400 to-rose-300" },
  { emoji: "😢", title: "Сэтгэл санааны хүчирхийлэл", desc: "Доромжлох, айлган сүрдүүлэх, басамжлах, ганцаардуулах зэргээр сэтгэлд дарамт учруулах.", color: "from-orange-400 to-amber-300" },
  { emoji: "📵", title: "Хэрэгцээг хязгаарлах", desc: "Хүнс, хувцас, боловсрол авах боломжийг хаах, мөнгийг нь хянах.", color: "from-yellow-400 to-lime-300" },
  { emoji: "📱", title: "Цахим дарамт", desc: "Интернетэд доромжлох, нууц зураг тараах, хуурмаг мэдээ дэлгэрүүлэх.", color: "from-teal-400 to-cyan-300" },
  { emoji: "🚫", title: "Хүсээгүй зүйл тулгах", desc: "Зөвшөөрөлгүйгээр хүнийг ямар нэг зүйл хийлгэх гэж заналхийлэх.", color: "from-violet-400 to-purple-300" },
];

const QUIZ = [
  { q: "Найзыг минь цохих нь хүчирхийлэл мөн үү?", a: true, exp: "Тийм! Хэн нэгнийг цохих нь ямар ч тохиолдолд хүчирхийлэл." },
  { q: "Хэрэв хэн нэгэн надад \"муу хүн\" гэвэл тэр зөв үү?", a: false, exp: "Үгүй! Чамайг доромжлох нь сэтгэл санааны хүчирхийлэл бөгөөд буруу." },
  { q: "Тусламж хүсэх нь сулдалт гэсэн үг мөн үү?", a: false, exp: "Огт үгүй! Тусламж хүсэх нь зориг ба ухаалаг шийдвэр." },
];

export default function Legal() {
  const [quizAnswers, setQuizAnswers] = useState<Record<number, boolean>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const handleQuiz = (i: number, ans: boolean) => {
    setQuizAnswers(prev => ({ ...prev, [i]: ans }));
    setRevealed(prev => ({ ...prev, [i]: true }));
  };

  return (
    <div className="relative pb-12 overflow-hidden">

      {/* Header gradient */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-violet-500 via-purple-400 to-pink-400 rounded-b-[3rem] -z-0" />
      <div className="absolute top-6 left-6 w-24 h-24 bg-white/20 rounded-full animate-float" />
      <div className="absolute top-4 right-10 w-16 h-16 bg-yellow-300/30 rounded-full animate-float delay-500" />

      {/* Hero */}
      <div className="relative z-10 px-6 py-12 text-center text-white">
        <div className="text-6xl mb-4 animate-float">⚖️</div>
        <h1 className="text-4xl font-black mb-2 drop-shadow-lg">Хуулийн булан</h1>
        <p className="text-white/90 text-base max-w-sm mx-auto">
          Өөрийн эрхээ мэдэж, өөрийгөө хамгаалах талаар суралцаарай.
        </p>
      </div>

      <div className="relative z-10 px-4 md:px-8 max-w-2xl mx-auto space-y-8">

        {/* Rights */}
        <section>
          <h2 className="text-2xl font-black text-purple-800 mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6" /> Миний эрхүүд
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {RIGHTS.map((r, i) => (
              <div
                key={i}
                className={`card-shimmer rounded-3xl p-4 bg-gradient-to-br ${r.color} text-white shadow-lg`}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="text-4xl mb-2 animate-float" style={{ animationDelay: `${i * 0.4}s` }}>{r.emoji}</div>
                <h3 className="font-black text-base leading-tight">{r.title}</h3>
                <p className="text-white/80 text-xs mt-1 leading-snug">{r.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Violence types */}
        <section>
          <h2 className="text-2xl font-black text-red-600 mb-4">
            ⚠️ Хүчирхийлэл гэж юу вэ?
          </h2>
          <div className="space-y-3">
            {VIOLENCE_TYPES.map((v, i) => (
              <div key={i} className={`card-shimmer rounded-3xl p-4 bg-gradient-to-r ${v.color} text-white shadow-lg flex items-start gap-4`}>
                <span className="text-4xl">{v.emoji}</span>
                <div>
                  <h3 className="font-black text-base">{v.title}</h3>
                  <p className="text-white/80 text-sm mt-0.5">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mini Quiz */}
        <section>
          <h2 className="text-2xl font-black text-purple-800 mb-4">
            🧩 Mini Quiz — Ийм үед яах вэ?
          </h2>
          <div className="space-y-4">
            {QUIZ.map((q, i) => (
              <div key={i} className="glass rounded-3xl p-5 border border-purple-100 shadow-md">
                <p className="font-bold text-purple-900 mb-3">{q.q}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleQuiz(i, true)}
                    className={`flex-1 py-2.5 rounded-2xl font-black text-sm transition-all hover:scale-105 ${quizAnswers[i] === true ? (q.a ? "bg-green-500 text-white shadow-lg" : "bg-red-500 text-white shadow-lg") : "bg-green-100 text-green-800 hover:bg-green-200"}`}
                  >
                    ✅ Тийм
                  </button>
                  <button
                    onClick={() => handleQuiz(i, false)}
                    className={`flex-1 py-2.5 rounded-2xl font-black text-sm transition-all hover:scale-105 ${quizAnswers[i] === false ? (!q.a ? "bg-green-500 text-white shadow-lg" : "bg-red-500 text-white shadow-lg") : "bg-red-100 text-red-700 hover:bg-red-200"}`}
                  >
                    ❌ Үгүй
                  </button>
                </div>
                {revealed[i] && (
                  <div className={`mt-3 rounded-2xl p-3 text-sm font-semibold animate-bounce-in ${quizAnswers[i] === q.a ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                    {quizAnswers[i] === q.a ? "✅ Зөв!" : "💡 Оролдоорой:"} {q.exp}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Remember banner */}
        <div className="rounded-3xl p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center shadow-xl">
          <Star className="w-8 h-8 mx-auto mb-2 text-yellow-300 animate-sparkle" />
          <p className="font-black text-lg">Хэрэв хүчирхийллийн нөхцөлд байгаа бол:</p>
          <p className="text-white/90 mt-1">Итгэдэг насанд хүрэгч хүнд хэл, эсвэл <strong>108</strong> утсаар залга!</p>
        </div>
      </div>
    </div>
  );
}
