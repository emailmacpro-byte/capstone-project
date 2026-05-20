import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Pause, Heart, PhoneCall } from "lucide-react";
import { useSubmitSurveyResponse } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const questions = [
  { id: "q1", text: "Сүүлийн хоёр долоо хоногт юу ч хийх сонирхолгүй, урам зориггүй байх мэдрэмж төрсөн үү?", type: "scale" },
  { id: "q2", text: "Сүүлийн үед өөрийгөө буруутгах, эсвэл ямар ч хэрэггүй хүн мэтээр бодох үе гарч байна уу?", type: "scale" },
  { id: "q3", text: "Гэр бүл, эсвэл үерхэж буй хэн нэгний зүгээс чамд бие махбодын эсвэл сэтгэл санааны дарамт үзүүлдэг үү?", type: "yes_no" },
  { id: "q4", text: "Үе тэнгийнхэн, найз нөхдийн дунд чамайг гадуурхах, доромжлох үйлдэл гарч байсан уу?", type: "yes_no" },
  { id: "q5", text: "Нойргүйдэх, эсвэл хэт их унтах, хоолны дуршил огцом өөрчлөгдөх зүйл ажиглагдсан уу?", type: "scale" },
  { id: "q6", text: "Ирээдүйдээ итгэлгүй болох, бүх зүйл утгагүй мэт санагдах үе байдаг уу?", type: "scale" },
  { id: "q7", text: "Цахим орчинд (сошиал медиа) хэн нэгний зүгээс чамайг дарамтлах, айлгах үйлдэл гарсан уу?", type: "yes_no" },
  { id: "q8", text: "Хэцүү байсан ч гэсэн чи хэн нэгэнтэй (найз, багш, сэтгэл зүйч) ярилцахад бэлэн үү?", type: "yes_no" },
];

export default function SurveyGrades10to12() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  
  const submitSurvey = useSubmitSurveyResponse();

  const question = questions[currentStep];
  const progress = ((currentStep) / questions.length) * 100;

  const handleSelect = (val: string | number) => {
    setAnswers({ ...answers, [question.id]: val });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      const answersList = Object.entries(answers).map(([qId, val]) => ({
        questionId: qId,
        value: val.toString()
      }));

      submitSurvey.mutate({
        data: {
          surveyId: 1,
          studentCode: "STU-ANON",
          grade: "11",
          answers: answersList
        }
      }, {
        onSuccess: (res) => {
          setLocation(`/survey/result?id=${res.id}&score=${res.riskScore}`);
        },
        onError: () => {
          toast({
            title: "Алдаа гарлаа",
            description: "Судалгааг илгээхэд алдаа гарлаа. Дахин оролдоно уу.",
            variant: "destructive"
          });
        }
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
    } else {
      setLocation("/survey");
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col bg-white">
      <div className="p-4 border-b">
        <Progress value={progress} className="h-2 mb-4" />
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <Button variant="ghost" size="sm" onClick={handleBack} className="rounded-full">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Буцах
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full border-destructive/50 text-destructive hover:bg-destructive/10" onClick={() => setLocation("/help")}>
              <PhoneCall className="w-4 h-4 mr-1" />
              Надад одоо хүнтэй ярилцах хэрэгтэй байна
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 md:p-10 flex flex-col items-center justify-center animate-in slide-in-from-right-4 duration-300">
        <div className="text-center mb-8">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            Асуулт {currentStep + 1} / {questions.length}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-primary mt-2 max-w-xl mx-auto">
            {question.text}
          </h2>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-md">
          {question.type === "scale" ? (
            [
              { label: "Огт үгүй", score: 1 },
              { label: "Цөөн хэдэн өдөр", score: 2 },
              { label: "Өдрүүдийн талаас илүүд", score: 3 },
              { label: "Бараг өдөр бүр", score: 4 },
            ].map((opt) => {
              const isSelected = answers[question.id] === opt.score;
              return (
                <Button
                  key={opt.score}
                  variant="outline"
                  className={`h-16 text-lg justify-start px-6 rounded-2xl transition-all ${
                    isSelected 
                    ? 'border-primary bg-primary/10 text-primary hover:bg-primary/20 scale-[1.02]' 
                    : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelect(opt.score)}
                >
                  <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${isSelected ? 'border-primary' : 'border-gray-300'}`}>
                    {isSelected && <div className="w-3 h-3 rounded-full bg-primary" />}
                  </div>
                  {opt.label}
                </Button>
              );
            })
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className={`h-24 text-xl rounded-2xl transition-all ${
                  answers[question.id] === "yes" 
                  ? 'border-primary bg-primary/10 text-primary hover:bg-primary/20 scale-105' 
                  : 'hover:bg-gray-50'
                }`}
                onClick={() => handleSelect("yes")}
              >
                Тийм
              </Button>
              <Button
                variant="outline"
                className={`h-24 text-xl rounded-2xl transition-all ${
                  answers[question.id] === "no" 
                  ? 'border-primary bg-primary/10 text-primary hover:bg-primary/20 scale-105' 
                  : 'hover:bg-gray-50'
                }`}
                onClick={() => handleSelect("no")}
              >
                Үгүй
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 flex flex-col items-center justify-center border-t bg-gray-50/50">
        <Button 
          size="lg" 
          className="rounded-full px-12 text-lg h-14 w-full max-w-xs mb-4"
          disabled={answers[question.id] === undefined || submitSurvey.isPending}
          onClick={handleNext}
        >
          {submitSurvey.isPending ? "Уншиж байна..." : (currentStep === questions.length - 1 ? "Дуусгах" : "Дараах")}
          {!submitSurvey.isPending && <ChevronRight className="w-5 h-5 ml-2" />}
        </Button>
        <p className="text-xs text-muted-foreground max-w-md text-center">
          Энэ систем онош тавихгүй. Зөвхөн эрт илрүүлэлт, дэмжлэг, чиглүүлгийн зорилготой.
        </p>
      </div>
    </div>
  );
}
