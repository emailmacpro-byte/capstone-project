import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Pause } from "lucide-react";
import { useSubmitSurveyResponse } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const questions = [
  {
    id: "q1",
    text: "Найзуудтайгаа байх үед чи ямар санагддаг вэ?",
    options: [
      { emoji: "😁", label: "Маш сайхан", score: 0 },
      { emoji: "🙂", label: "Дажгүй", score: 1 },
      { emoji: "🙁", label: "Ганцаарддаг", score: 3 },
      { emoji: "😢", label: "Намайг гадуурхдаг", score: 5 },
    ]
  },
  {
    id: "q2",
    text: "Сургууль дээр чамайг хэн нэгэн дээрэлхэж байсан уу?",
    options: [
      { emoji: "👍", label: "Үгүй", score: 0 },
      { emoji: "👎", label: "Тийм", score: 5 },
    ]
  },
  {
    id: "q3",
    text: "Чи уур бухимдлаа хэрхэн илэрхийлдэг вэ?",
    options: [
      { emoji: "🗣️", label: "Хүнтэй ярилцдаг", score: 0 },
      { emoji: "🏃", label: "Холддог", score: 1 },
      { emoji: "🤐", label: "Дотроо хадгалдаг", score: 3 },
      { emoji: "💥", label: "Юм шиддэг, цохьдог", score: 5 },
    ]
  },
  {
    id: "q4",
    text: "Гэртээ байхдаа чи хэр тайван байдаг вэ?",
    options: [
      { emoji: "🏠", label: "Маш тайван", score: 0 },
      { emoji: "😌", label: "Дажгүй", score: 1 },
      { emoji: "😟", label: "Заримдаа айдаг", score: 3 },
      { emoji: "😨", label: "Байнга айдаг", score: 5 },
    ]
  },
  {
    id: "q5",
    text: "Чамд тусламж хэрэгтэй үед хэн нэгнээс асууж чаддаг уу?",
    options: [
      { emoji: "🙋", label: "Тиймээ, чөлөөтэй", score: 0 },
      { emoji: "🤷", label: "Заримдаа л", score: 2 },
      { emoji: "🙅", label: "Үгүй, асууж чаддаггүй", score: 4 },
    ]
  }
];

export default function SurveyGrades4to6() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  
  const submitSurvey = useSubmitSurveyResponse();

  const question = questions[currentStep];
  const progress = ((currentStep) / questions.length) * 100;

  const handleSelect = (score: number) => {
    setAnswers({ ...answers, [question.id]: score });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      const answersList = Object.entries(answers).map(([qId, score]) => ({
        questionId: qId,
        value: score.toString()
      }));

      submitSurvey.mutate({
        data: {
          surveyId: 3,
          studentCode: "STU-ANON",
          grade: "5",
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
          <Button variant="ghost" size="sm" className="rounded-full text-gray-400">
            <Pause className="w-4 h-4 mr-1" />
            Түр зогсоох
          </Button>
        </div>
      </div>

      <div className="flex-1 p-6 md:p-10 flex flex-col items-center justify-center animate-in slide-in-from-right-4 duration-300">
        
        <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-12 max-w-xl">
          {question.text}
        </h2>

        <div className="grid grid-cols-2 gap-4 md:gap-8 w-full max-w-md">
          {question.options.map((opt, i) => {
            const isSelected = answers[question.id] === opt.score;
            return (
              <button
                key={i}
                onClick={() => handleSelect(opt.score)}
                className={`flex flex-col items-center justify-center p-6 rounded-3xl border-4 transition-all hover:scale-105 active:scale-95 ${
                  isSelected 
                  ? 'border-primary bg-primary/10 scale-105' 
                  : 'border-transparent bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <span className="text-5xl md:text-6xl mb-4">{opt.emoji}</span>
                <span className="text-base font-medium text-gray-700 text-center">{opt.label}</span>
              </button>
            )
          })}
        </div>

      </div>

      <div className="p-6 flex justify-center border-t bg-gray-50/50">
        <Button 
          size="lg" 
          className="rounded-full px-12 text-lg h-14 w-full max-w-xs"
          disabled={answers[question.id] === undefined || submitSurvey.isPending}
          onClick={handleNext}
        >
          {submitSurvey.isPending ? "Уншиж байна..." : (currentStep === questions.length - 1 ? "Дуусгах" : "Дараах")}
          {!submitSurvey.isPending && <ChevronRight className="w-5 h-5 ml-2" />}
        </Button>
      </div>
    </div>
  );
}
