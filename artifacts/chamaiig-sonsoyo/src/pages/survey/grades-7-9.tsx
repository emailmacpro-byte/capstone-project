import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Pause } from "lucide-react";
import { useSubmitSurveyResponse } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const questions = [
  { id: "q1", text: "Сүүлийн үед хичээлийн ачаалал, стресс хэр их байна вэ?" },
  { id: "q2", text: "Сэтгэл түгших, шалтгаангүйгээр сандрах үе гардаг уу?" },
  { id: "q3", text: "Өөртөө итгэлгүй болох, өөрийгөө голомтгой байдал ажиглагддаг уу?" },
  { id: "q4", text: "Цахим орчинд (сошиал медиа) хэн нэгний дарамт, доромжлолд өртөж байсан уу?" },
  { id: "q5", text: "Гэр бүлдээ хэр их зөрчилдөж байна вэ?" },
  { id: "q6", text: "Сургууль дээр болон гэртээ байхдаа өөрийгөө аюулгүй мэдэрч чаддаг уу?" },
  { id: "q7", text: "Сургууль дээр дээрэлхүүлэх, ялгаварлан гадуурхагдах асуудалтай нүүр тулж байсан уу?" },
];

export default function SurveyGrades7to9() {
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
          surveyId: 2,
          studentCode: "STU-ANON",
          grade: "8",
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
        <div className="text-center mb-8">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            Асуулт {currentStep + 1} / {questions.length}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-primary mt-2 max-w-xl mx-auto">
            {question.text}
          </h2>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-md">
          {[
            { label: "Огт үгүй", score: 1 },
            { label: "Ховор", score: 2 },
            { label: "Заримдаа", score: 3 },
            { label: "Ихэнхдээ", score: 4 },
            { label: "Байнга", score: 5 },
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
