import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Compass } from "lucide-react";
import { useSendNotification } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const riasecQuestions = [
  { id: 1, category: "R", text: "Би багаж хэрэгсэл, машин механизмтай ажиллах, засварлах дуртай." },
  { id: 2, category: "I", text: "Би шинжлэх ухаан, математикийн асуудал бодох, судлах дуртай." },
  { id: 3, category: "A", text: "Би зураг зурах, хөгжим тоглох, бүтээлч зүйл хийх дуртай." },
  { id: 4, category: "S", text: "Би хүмүүст зааж сургах, туслах, тэдэнтэй харилцах дуртай." },
  { id: 5, category: "E", text: "Би хүмүүсийг удирдан зохион байгуулах, бизнес хийх сонирхолтой." },
  { id: 6, category: "C", text: "Би бичиг баримт цэгцлэх, нарийн тооцоолол хийх, дүрэм журам баримтлах дуртай." },
  // Just a simplified subset to demonstrate the module
];

const categoryNames: Record<string, string> = {
  R: "Реалист",
  I: "Судлаач",
  A: "Уран бүтээлч",
  S: "Нийгэмч",
  E: "Бизнес эрхлэгч",
  C: "Бичиг хэрэгч"
};

const careersMap: Record<string, string[]> = {
  R: ["Инженер", "Механикч", "Мэдээллийн технологийн мэргэжилтэн", "Архитектор"],
  I: ["Эрдэмтэн", "Эмч", "Программист", "Аналист"],
  A: ["Дизайнер", "Зохиолч", "Хөгжимчин", "Сэтгүүлч"],
  S: ["Багш", "Сэтгэл зүйч", "Нийгмийн ажилтан", "Сувилагч"],
  E: ["Маркетингийн менежер", "Бизнесмэн", "Хуульч", "Удирдагч"],
  C: ["Нягтлан бодогч", "Санхүүгийн шинжээч", "Өгөгдлийн сангийн администратор"]
};

export default function RIASEC() {
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
  const [finished, setFinished] = useState(false);
  const { toast } = useToast();
  const sendNotification = useSendNotification();

  const q = riasecQuestions[currentStep];
  const progress = (currentStep / riasecQuestions.length) * 100;

  const handleAnswer = (rating: number) => {
    setScores(prev => ({
      ...prev,
      [q.category]: prev[q.category] + rating
    }));

    if (currentStep < riasecQuestions.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      setFinished(true);
    }
  };

  const handleSendEmail = () => {
    sendNotification.mutate({
      data: {
        to: "student@school.mn",
        subject: "Таны RIASEC үр дүн",
        type: "risk_alert",
      }
    }, {
      onSuccess: () => {
        toast({
          title: "📧 Үр дүн илгээгдлээ",
          description: "Таны мэргэжил сонголтын үр дүн имэйл рүү амжилттай илгээгдлээ.",
        });
      }
    });
  };

  if (finished) {
    const chartData = Object.entries(scores).map(([key, value]) => ({
      name: categoryNames[key],
      score: value
    })).sort((a, b) => b.score - a.score); // Sort by highest score

    const topCategories = chartData.slice(0, 3);

    return (
      <div className="p-4 md:p-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="border-none shadow-lg overflow-hidden bg-white/80 backdrop-blur">
          <div className="bg-primary/10 h-24 flex items-center justify-center">
            <Compass className="w-12 h-12 text-primary" />
          </div>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-primary">Таны сонирхлын профайл</CardTitle>
            <CardDescription>Таны хувийн онцлогт тохирох мэргэжлийн чиглэлүүд</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis hide />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="score" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">Танд хамгийн тохиромжтой чиглэлүүд:</h3>
              {topCategories.map((cat, idx) => {
                const catCode = Object.keys(categoryNames).find(key => categoryNames[key] === cat.name)!;
                return (
                  <div key={idx} className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-bold text-lg text-primary mb-2">{idx + 1}. {cat.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">Тохирох мэргэжлүүд:</p>
                    <div className="flex flex-wrap gap-2">
                      {careersMap[catCode].map(career => (
                        <span key={career} className="px-3 py-1 bg-white border rounded-full text-sm font-medium text-gray-700">
                          {career}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <Button onClick={handleSendEmail} className="w-full h-12" disabled={sendNotification.isPending}>
              <Mail className="w-4 h-4 mr-2" />
              Үр дүнг email рүү илгээх
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto min-h-[80vh] flex flex-col justify-center">
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Асуулт {currentStep + 1} / {riasecQuestions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <h2 className="text-2xl font-bold text-center text-foreground mb-12">
        {q.text}
      </h2>

      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-full max-w-lg mx-auto w-full">
        <span className="text-sm font-medium text-muted-foreground">Огт үгүй</span>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((val) => (
            <button
              key={val}
              onClick={() => handleAnswer(val)}
              className="w-12 h-12 rounded-full border-2 border-primary/20 hover:border-primary hover:bg-primary/10 text-primary font-bold transition-all hover:scale-110 active:scale-95"
            >
              {val}
            </button>
          ))}
        </div>
        <span className="text-sm font-medium text-muted-foreground">Маш их</span>
      </div>
    </div>
  );
}
