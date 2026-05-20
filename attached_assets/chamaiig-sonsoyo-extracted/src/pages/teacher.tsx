import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useGetTeacherDashboard, useUpdateCase, useAddCaseNote, useSendNotification, getGetTeacherDashboardQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, Clock, ShieldAlert, Phone, User, Users, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function Teacher() {
  const { data, isLoading } = useGetTeacherDashboard();
  const updateCase = useUpdateCase();
  const addCaseNote = useAddCaseNote();
  const sendNotification = useSendNotification();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Уншиж байна...</div>;
  }

  if (!data) {
    return <div className="p-8 text-center text-muted-foreground">Мэдээлэл олдсонгүй</div>;
  }

  const { riskSummary, followUpList, recentResponses, weeklyAlerts, bullyingIndex = 0, lonelinessIndex = 0 } = data;

  const handleAction = (caseId: number, studentCode: string, grade: string, riskLevel: string, action: string, label: string) => {
    updateCase.mutate(
      { id: caseId, data: { status: "in_progress" } },
      {
        onSuccess: () => {
          addCaseNote.mutate(
            { id: caseId, data: { content: label, action } },
            {
              onSuccess: () => {
                toast({ title: "Амжилттай", description: "Үйлдэл бүртгэгдлээ." });
                queryClient.invalidateQueries({ queryKey: getGetTeacherDashboardQueryKey() });
                
                if (action === "referred_psychologist" || action === "referred_social") {
                  sendNotification.mutate({
                    data: {
                      to: "psychologist@school.mn",
                      subject: "Эрсдэлийн анхааруулга: Шилжүүлсэн кейс",
                      type: "risk_alert",
                      studentCode,
                      riskLevel,
                      grade
                    }
                  });
                }
              }
            }
          );
        }
      }
    );
  };

  const getRiskColor = (level: string) => {
    switch(level) {
      case 'red': return 'bg-red-500 hover:bg-red-600 text-white';
      case 'orange': return 'bg-orange-500 hover:bg-orange-600 text-white';
      case 'yellow': return 'bg-yellow-500 hover:bg-yellow-600 text-white';
      case 'green': return 'bg-green-500 hover:bg-green-600 text-white';
      default: return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
  };

  const getRiskBadge = (level: string) => {
    const labels: Record<string, string> = {
      'red': 'Өндөр эрсдэл',
      'orange': 'Дунд эрсдэл',
      'yellow': 'Анхаарал хандуулах',
      'green': 'Хэвийн'
    };
    return <Badge className={getRiskColor(level)}>{labels[level] || level}</Badge>;
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Багшийн хянах самбар</h1>
        {weeklyAlerts > 0 && (
          <div className="flex items-center gap-2 text-red-600 font-bold bg-red-50 px-4 py-2 rounded-full">
            <Bell className="w-5 h-5" />
            Энэ долоо хоногийн анхааруулга: {weeklyAlerts}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-t-4 border-t-red-500">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground font-medium">Өндөр эрсдэл</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-red-600">{riskSummary.red}</div></CardContent>
        </Card>
        <Card className="border-t-4 border-t-orange-500">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground font-medium">Дунд эрсдэл</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-orange-600">{riskSummary.orange}</div></CardContent>
        </Card>
        <Card className="border-t-4 border-t-yellow-500">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground font-medium">Анхаарах</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-yellow-600">{riskSummary.yellow}</div></CardContent>
        </Card>
        <Card className="border-t-4 border-t-green-500">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground font-medium">Хэвийн</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-green-600">{riskSummary.green}</div></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ангийн уур амьсгал</CardTitle>
            <CardDescription>Судалгааны үр дүнгээс тооцсон индекс</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span>Дээрэлхэлтийн индекс</span>
                <span className={bullyingIndex > 50 ? "text-red-500" : "text-green-500"}>{bullyingIndex}%</span>
              </div>
              <Progress value={bullyingIndex} className="h-3" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span>Ганцаардлын индекс</span>
                <span className={lonelinessIndex > 50 ? "text-orange-500" : "text-blue-500"}>{lonelinessIndex}%</span>
              </div>
              <Progress value={lonelinessIndex} className="h-3" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Сүүлийн өдрүүдийн судалгаа</CardTitle>
            <CardDescription>Саяхан бөглөсөн сурагчдын үр дүн</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2">
              {recentResponses.slice(0, 5).map(res => (
                <div key={res.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{res.studentName || res.studentCode}</div>
                    <div className="text-xs text-muted-foreground">{res.grade}-р анги • {new Date(res.createdAt).toLocaleDateString()}</div>
                  </div>
                  {getRiskBadge(res.riskLevel)}
                </div>
              ))}
              {recentResponses.length === 0 && (
                <div className="text-center text-muted-foreground py-4">Сүүлийн үед судалгаа бөглөөгүй байна.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-t-4 border-t-primary">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <ShieldAlert className="text-primary" />
            Энэ долоо хоногт анхаарах сурагчид (Кейсүүд)
          </CardTitle>
          <CardDescription>Эрсдэлтэй үнэлэгдсэн сурагчидтай ажиллах хэсэг</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {followUpList.map(c => (
              <div key={c.id} className="border rounded-xl p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 bg-white shadow-sm">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg">{c.studentName || c.studentCode}</h3>
                    <Badge variant="outline" className="text-muted-foreground">{c.grade}-р анги</Badge>
                    {getRiskBadge(c.riskLevel)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Clock className="w-4 h-4" />
                    Бүртгэгдсэн: {new Date(c.createdAt).toLocaleDateString()}
                  </div>
                  {c.flags && c.flags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {c.flags.map(flag => (
                        <Badge key={flag} variant="secondary" className="bg-red-50 text-red-700 border-red-200">
                          {flag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full md:w-auto">
                  <Button 
                    variant="outline" size="sm" className="w-full justify-start"
                    disabled={updateCase.isPending || addCaseNote.isPending}
                    onClick={() => handleAction(c.id, c.studentCode, c.grade || "", c.riskLevel, "talked", "Ярилцсан")}
                  >
                    <User className="w-4 h-4 mr-2" /> Ярилцсан
                  </Button>
                  <Button 
                    variant="outline" size="sm" className="w-full justify-start"
                    disabled={updateCase.isPending || addCaseNote.isPending}
                    onClick={() => handleAction(c.id, c.studentCode, c.grade || "", c.riskLevel, "contacted_parent", "Эцэг эхтэй холбогдсон")}
                  >
                    <Phone className="w-4 h-4 mr-2" /> Эцэг эхтэй
                  </Button>
                  <Button 
                    variant="outline" size="sm" className="w-full justify-start"
                    disabled={updateCase.isPending || addCaseNote.isPending}
                    onClick={() => handleAction(c.id, c.studentCode, c.grade || "", c.riskLevel, "referred_social", "Нийгмийн ажилтанд шилжүүлсэн")}
                  >
                    <Users className="w-4 h-4 mr-2" /> Нийгмийн ажилтан
                  </Button>
                  <Button 
                    variant="outline" size="sm" className="w-full justify-start"
                    disabled={updateCase.isPending || addCaseNote.isPending}
                    onClick={() => handleAction(c.id, c.studentCode, c.grade || "", c.riskLevel, "referred_psychologist", "Сэтгэл зүйч рүү илгээсэн")}
                  >
                    <AlertCircle className="w-4 h-4 mr-2 text-orange-500" /> Сэтгэл зүйч
                  </Button>
                  <Button 
                    variant="outline" size="sm" className="w-full justify-start col-span-2 md:col-span-1"
                    disabled={updateCase.isPending || addCaseNote.isPending}
                    onClick={() => handleAction(c.id, c.studentCode, c.grade || "", c.riskLevel, "confidential", "Нууцлалтай кейс")}
                  >
                    <ShieldAlert className="w-4 h-4 mr-2 text-primary" /> Нууцлалтай
                  </Button>
                </div>
              </div>
            ))}
            {followUpList.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed">
                <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <p className="text-lg font-medium text-gray-700">Энэ долоо хоногт анхаарал хандуулах кейс байхгүй байна.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
