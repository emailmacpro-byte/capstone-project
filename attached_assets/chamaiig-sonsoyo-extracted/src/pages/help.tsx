import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PhoneCall, UserRound, Users, ShieldAlert, Heart, CheckCircle } from "lucide-react";
import { useSendNotification } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const QUOTES = [
  { text: "Чи буруутай биш", emoji: "💙", color: "from-sky-400 to-blue-300" },
  { text: "Тусламж хүсэх нь зориг", emoji: "✨", color: "from-violet-400 to-purple-300" },
  { text: "Чамайг сонсох хүн бий", emoji: "💚", color: "from-emerald-400 to-teal-300" },
  { text: "Санаа зовж байвал ганцаараа бүү үлд", emoji: "🤝", color: "from-pink-400 to-rose-300" },
];

const RED_CROSS_TIPS = [
  { icon: "🧘", title: "Амьсгалын дасгал", tip: "Удаан, гүн амьсгалж, 4 дугаарт оруулаад 4 дугаарт гарга. 3 удаа давтана." },
  { icon: "🌊", title: "Тогтворжих дасгал", tip: "5 харж буй зүйл, 4 мэдэрж буй зүйл, 3 сонсж буй зүйл, 2 үнэрлэж буй зүйл, 1 амтлаж буй зүйл." },
  { icon: "💬", title: "Хэн нэгэнтэй ярилц", tip: "Итгэдэг хүнтэйгээ ярилцах нь сэтгэл зүйн ачааллыг хөнгөлдөг." },
  { icon: "🤲", title: "Тусламж хүсэх нь хэвийн", tip: "Монголын Улаан загалмайн нийгэмлэг: 70112400 — зөвлөгөө үнэгүй." },
];

export default function Help() {
  const { toast } = useToast();
  const sendNotification = useSendNotification();
  const [requested, setRequested] = useState<string | null>(null);

  const handleRequest = (type: string, label: string) => {
    sendNotification.mutate({
      data: {
        to: "teacher@school.mn",
        subject: `Тусламжийн хүсэлт: ${label}`,
        type: "risk_alert",
        studentCode: "STU-ANON",
        riskLevel: "yellow",
        grade: "unknown",
      }
    }, {
      onSuccess: () => {
        setRequested(type);
        toast({ title: "📨 Хүсэлт илгээгдлээ", description: `${label} хүсэлт амжилттай илгээгдлээ.` });
      }
    });
  };

  return (
    <div className="relative pb-12 overflow-hidden">

      {/* Floating blobs */}
      <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-br from-pink-400 via-rose-300 to-orange-300 rounded-b-[3rem] -z-0" />
      <div className="absolute top-8 right-8 w-32 h-32 bg-white/20 rounded-full animate-float" />
      <div className="absolute top-4 left-8 w-20 h-20 bg-yellow-300/30 rounded-full animate-float delay-700" />

      {/* Hero */}
      <div className="relative z-10 px-6 py-12 text-center text-white">
        <div className="text-6xl mb-4 animate-float">💖</div>
        <h1 className="text-4xl font-black mb-3 drop-shadow-lg">Тусламж хэрэгтэй юу?</h1>
        <p className="text-white/90 text-lg max-w-sm mx-auto leading-relaxed">
          Бид энд байна. Чамайг <strong>сонсоод, туслахад</strong> бэлэн байна.
        </p>
      </div>

      <div className="relative z-10 px-4 md:px-8 max-w-2xl mx-auto space-y-5 mt-2">

        {/* 108 Emergency */}
        <div className="rounded-3xl p-6 bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-2xl animate-pulse-glow-red">
          <div className="flex flex-col sm:flex-row items-center gap-5 justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center animate-float">
                <PhoneCall className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black">Хүүхдийн тусламжийн утас</h2>
                <p className="text-white/80 text-sm">24/7 — Яаралтай, нууцлалтай, үнэгүй</p>
              </div>
            </div>
            <a href="tel:108" className="w-full sm:w-auto">
              <Button size="lg" className="w-full rounded-2xl bg-white text-red-600 hover:bg-red-50 font-black text-2xl px-8 h-14 shadow-lg hover:scale-105 transition-all">
                📞 108
              </Button>
            </a>
          </div>
        </div>

        {/* Help options */}
        {[
          { type: "teacher", label: "Багштайгаа ярилцмаар байна", emoji: "👨‍🏫", gradient: "from-blue-500 to-indigo-400", desc: "Багш тантай ярилцахад бэлэн байна" },
          { type: "psychologist", label: "Сэтгэл зүйчтэй уулзмаар байна", emoji: "🧠", gradient: "from-violet-500 to-purple-400", desc: "Мэргэжлийн дэмжлэг авах" },
          { type: "social", label: "Надад аюултай санагдаж байна", emoji: "🆘", gradient: "from-orange-500 to-amber-400", desc: "Нийгмийн ажилтанд яаралтай мэдэгдэх" },
        ].map((item) => (
          <div
            key={item.type}
            className={`card-shimmer rounded-3xl p-5 bg-gradient-to-r ${item.gradient} text-white shadow-xl cursor-pointer`}
            onClick={() => !requested && handleRequest(item.type, item.label)}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-5xl animate-float">{item.emoji}</span>
                <div>
                  <h3 className="font-black text-lg leading-tight">{item.label}</h3>
                  <p className="text-white/75 text-sm">{item.desc}</p>
                </div>
              </div>
              {requested === item.type ? (
                <CheckCircle className="w-8 h-8 text-white shrink-0 animate-bounce-in" />
              ) : (
                <Button size="sm" className="rounded-full bg-white/25 hover:bg-white/40 text-white border border-white/30 shrink-0 font-bold">
                  Хүсэлт
                </Button>
              )}
            </div>
          </div>
        ))}

        {/* Support Quotes */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          {QUOTES.map((q, i) => (
            <div key={i} className={`card-shimmer rounded-3xl p-4 bg-gradient-to-br ${q.color} text-white shadow-lg`} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="text-3xl mb-2">{q.emoji}</div>
              <p className="text-sm font-bold leading-snug">"{q.text}"</p>
            </div>
          ))}
        </div>

        {/* Red Cross First Aid Tips */}
        <div className="mt-6">
          <h2 className="text-xl font-black text-purple-800 mb-4 text-center">
            🏥 Монголын Улаан загалмай — Анхны тусламж
          </h2>
          <div className="space-y-3">
            {RED_CROSS_TIPS.map((tip, i) => (
              <div key={i} className="glass rounded-2xl p-4 flex items-start gap-3 border border-purple-100 card-shimmer">
                <span className="text-3xl">{tip.icon}</span>
                <div>
                  <h3 className="font-black text-purple-800">{tip.title}</h3>
                  <p className="text-purple-600 text-sm mt-0.5">{tip.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Important disclaimer */}
        <div className="rounded-2xl p-4 bg-amber-50 border border-amber-200 text-center mt-4">
          <p className="text-amber-700 text-sm font-semibold">
            ⚠️ Хэрэв та эсвэл таны ойр дотны хүн шуурхай аюулд байвал — <strong>108</strong> эсвэл <strong>103</strong> дугаарт залга!
          </p>
        </div>
      </div>
    </div>
  );
}
