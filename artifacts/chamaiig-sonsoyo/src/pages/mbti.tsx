import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, Brain, Mail } from "lucide-react";
import { useSendNotification } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const mbtiQuestions = [
  { id: 1, dichotomy: "E/I", text: "Чи чөлөөт цагаа хэрхэн өнгөрүүлэхийг илүүд үздэг вэ?", optionA: "Найзуудтайгаа уулзах, олон хүнтэй газар байх (E)", optionB: "Ганцаараа ном унших, кино үзэх, тайван байх (I)", valA: "E", valB: "I" },
  { id: 2, dichotomy: "S/N", text: "Шинэ зүйл сурахдаа чи...", optionA: "Бодит баримт, туршлага дээр суурилдаг (S)", optionB: "Шинэ санаа, төсөөлөл, боломжуудыг боддог (N)", valA: "S", valB: "N" },
  { id: 3, dichotomy: "T/F", text: "Шийдвэр гаргахдаа чи юуг илүү анхаардаг вэ?", optionA: "Зөв, буруу, логик үндэслэл (T)", optionB: "Хүмүүст ямар санагдах, тэдний мэдрэмж (F)", valA: "T", valB: "F" },
  { id: 4, dichotomy: "J/P", text: "Чиний ажиллах хэв маяг:", optionA: "Төлөвлөгөөний дагуу, цаг тухайд нь (J)", optionB: "Уян хатан, цагийг тулгаж эсвэл гэнэтийн шийдвэрээр (P)", valA: "J", valB: "P" },
  // Adding a few more to simulate a 16-question test
  { id: 5, dichotomy: "E/I", text: "Олон шинэ хүнтэй танилцах үед чи...", optionA: "Эрч хүчтэй болж, амархан яриа өрнүүлдэг (E)", optionB: "Ядарч, дараа нь ганцаараа амарч эрч хүчээ нөхөх хэрэгтэй болдог (I)", valA: "E", valB: "I" },
  { id: 6, dichotomy: "S/N", text: "Юм хийхдээ чи...", optionA: "Яг өгөгдсөн зааврын дагуу хийх дуртай (S)", optionB: "Өөрийнхөөрөө шинэчлэн хийхийг оролддог (N)", valA: "S", valB: "N" },
  { id: 7, dichotomy: "T/F", text: "Бусадтай санал зөрөлдвөл...", optionA: "Үнэнийг батлахын тулд маргахыг илүүд үздэг (T)", optionB: "Муудалцахгүйн тулд буулт хийх үе байдаг (F)", valA: "T", valB: "F" },
  { id: 8, dichotomy: "J/P", text: "Аялалд гарахдаа...", optionA: "Бүх зүйлсийг урьдчилан нарийн төлөвлөдөг (J)", optionB: "Очсон газрынхаа байдлаас шалтгаалж шийддэг (P)", valA: "J", valB: "P" },
];

const mbtiResults: Record<string, any> = {
  "INTJ": {
    name: "Архитектор (INTJ)",
    desc: "Стратегийн сэтгэлгээтэй, бие даасан, шинийг санаачлагч. Аливаа зүйлийг нарийвчлан судалж, холын ирээдүйг харах чадвартай.",
    strengths: "Шийдвэртэй, бие даасан, мэдлэгт дурлагч.",
    growth: "Бусдын сэтгэл хөдлөлийг ойлгох тал дээр анхаарах.",
    careers: ["Программ хангамжийн инженер", "Эрдэмтэн", "Бизнесийн зөвлөх", "Архитектор"]
  },
  "ENFP": {
    name: "Тэмцэгч (ENFP)",
    desc: "Эрч хүчтэй, урам зоригтой, бүтээлч. Шинэ санаа гаргах дуртай бөгөөд бусадтай амархан ойлголцдог.",
    strengths: "Сэргэлэн, хүмүүстэй харилцах чадвар сайтай, бүтээлч.",
    growth: "Эхлүүлсэн ажлаа дуусгаж сурах.",
    careers: ["Сэтгүүлч", "Маркетер", "Сэтгэл зүйч", "Багш"]
  },
  // Default fallback
  "DEFAULT": {
    name: "Дасан зохицогч (Алдаа заасан тохиолдолд)",
    desc: "Таны хариултууд олон янзын хэв маягийг илтгэж байна. Та нөхцөл байдалд тааруулан өөрчлөгдөх чадвартай уян хатан хүн юм.",
    strengths: "Уян хатан, дасан зохицох чадвар.",
    growth: "Өөрийн жинхэнэ хүсэл сонирхлыг илрүүлэх.",
    careers: ["Менежер", "Зохицуулагч", "Аналист", "Чөлөөт уран бүтээлч"]
  }
};

export default function MBTI() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [resultType, setResultType] = useState<string | null>(null);
  const { toast } = useToast();
  const sendNotification = useSendNotification();

  const progress = (currentStep / mbtiQuestions.length) * 100;

  const handleAnswer = (dichotomy: string, val: string) => {
    const newAnswers = { ...answers };
    // Just simple counting
    newAnswers[`${dichotomy}_${currentStep}`] = val;
    setAnswers(newAnswers);

    if (currentStep < mbtiQuestions.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: Record<string, string>) => {
    // Simple logic: count the E/I, S/N, T/F, J/P
    let counts: Record<string, number> = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    Object.values(finalAnswers).forEach(v => counts[v]++);
    
    const type = 
      (counts.E >= counts.I ? "E" : "I") +
      (counts.S >= counts.N ? "S" : "N") +
      (counts.T >= counts.F ? "T" : "F") +
      (counts.J >= counts.P ? "J" : "P");

    setResultType(mbtiResults[type] ? type : (type === "INTJ" || type === "ENFP" ? type : "DEFAULT"));
  };

  const handleSendEmail = () => {
    sendNotification.mutate({
      data: {
        to: "student@school.mn",
        subject: "Таны MBTI үр дүн",
        type: "risk_alert",
      }
    }, {
      onSuccess: () => {
        toast({
          title: "📧 Үр дүн илгээгдлээ",
          description: "Таны MBTI үр дүн имэйл рүү амжилттай илгээгдлээ.",
        });
      }
    });
  };

  if (resultType) {
    const res = mbtiResults[resultType] || mbtiResults["DEFAULT"];
    return (
      <div className="p-4 md:p-8 max-w-2xl mx-auto animate-in fade-in zoom-in duration-500">
        <Card className="border-none shadow-lg overflow-hidden bg-white/80 backdrop-blur">
          <div className="bg-primary/10 h-32 flex items-center justify-center">
            <Brain className="w-16 h-16 text-primary" />
          </div>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-primary">{res.name}</CardTitle>
            <CardDescription className="text-lg mt-2">{res.desc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-xl">
              <h4 className="font-bold text-gray-800 mb-2">Давуу тал:</h4>
              <p className="text-muted-foreground">{res.strengths}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <h4 className="font-bold text-gray-800 mb-2">Хөгжүүлэх шаардлагатай:</h4>
              <p className="text-muted-foreground">{res.growth}</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-3">Тохиромжтой мэргэжлүүд:</h4>
              <div className="flex flex-wrap gap-2">
                {res.careers.map((c: string) => (
                  <span key={c} className="px-3 py-1 bg-secondary/20 text-secondary-foreground rounded-full text-sm font-medium">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <Button onClick={handleSendEmail} className="w-full h-12 mt-4" disabled={sendNotification.isPending}>
              <Mail className="w-4 h-4 mr-2" />
              Үр дүнг email рүү илгээх
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const q = mbtiQuestions[currentStep];

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto min-h-[80vh] flex flex-col justify-center">
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Асуулт {currentStep + 1} / {mbtiQuestions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <h2 className="text-2xl font-bold text-center text-foreground mb-8">
        {q.text}
      </h2>

      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-full h-auto p-6 text-lg justify-start text-left whitespace-normal rounded-2xl hover:bg-primary/5 hover:border-primary/30"
          onClick={() => handleAnswer(q.dichotomy, q.valA)}
        >
          {q.optionA}
        </Button>
        <Button
          variant="outline"
          className="w-full h-auto p-6 text-lg justify-start text-left whitespace-normal rounded-2xl hover:bg-primary/5 hover:border-primary/30"
          onClick={() => handleAnswer(q.dichotomy, q.valB)}
        >
          {q.optionB}
        </Button>
      </div>
    </div>
  );
}
