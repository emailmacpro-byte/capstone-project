import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";
import { useGetPsychologistDashboard, useUpdateCase, useAddCaseNote, getGetPsychologistDashboardQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Users, FileText, Activity, CheckCircle, ChevronDown, ChevronUp, Shield, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default function Psychologist() {
  const { data, isLoading } = useGetPsychologistDashboard();
  const updateCase = useUpdateCase();
  const addCaseNote = useAddCaseNote();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [expandedCases, setExpandedCases] = useState<Record<number, boolean>>({});
  const [noteContent, setNoteContent] = useState<Record<number, string>>({});
  const [noteAction, setNoteAction] = useState<Record<number, string>>({});

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Уншиж байна...</div>;
  }

  if (!data) {
    return <div className="p-8 text-center text-muted-foreground">Мэдээлэл олдсонгүй</div>;
  }

  const { activeCases, riskSummary, recentActivity, pendingReferrals, totalCases, closedThisMonth } = data;

  const chartData = [
    { name: "Өндөр эрсдэл", value: riskSummary.red, color: "hsl(var(--chart-4))" },
    { name: "Дунд эрсдэл", value: riskSummary.orange, color: "hsl(var(--chart-2))" },
    { name: "Анхаарах", value: riskSummary.yellow, color: "hsl(var(--chart-5))" },
    { name: "Хэвийн", value: riskSummary.green, color: "hsl(var(--chart-3))" },
  ].filter(d => d.value > 0);

  const toggleCase = (id: number) => {
    setExpandedCases(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddNote = (caseId: number) => {
    const content = noteContent[caseId];
    const action = noteAction[caseId] || "talked";
    
    if (!content) {
      toast({ title: "Анхааруулга", description: "Тэмдэглэл бичнэ үү", variant: "destructive" });
      return;
    }

    addCaseNote.mutate(
      { id: caseId, data: { content, action } },
      {
        onSuccess: () => {
          toast({ title: "Амжилттай", description: "Тэмдэглэл нэмэгдлээ" });
          setNoteContent(prev => ({ ...prev, [caseId]: "" }));
          queryClient.invalidateQueries({ queryKey: getGetPsychologistDashboardQueryKey() });
        }
      }
    );
  };

  const handleUpdateStatus = (caseId: number, status: string) => {
    updateCase.mutate(
      { id: caseId, data: { status } },
      {
        onSuccess: () => {
          toast({ title: "Амжилттай", description: "Төлөв өөрчлөгдлөө" });
          queryClient.invalidateQueries({ queryKey: getGetPsychologistDashboardQueryKey() });
        }
      }
    );
  };

  const getRiskBadge = (level: string) => {
    const map: Record<string, { label: string, color: string }> = {
      'red': { label: 'Өндөр эрсдэл', color: 'bg-red-500 hover:bg-red-600 text-white' },
      'orange': { label: 'Дунд эрсдэл', color: 'bg-orange-500 hover:bg-orange-600 text-white' },
      'yellow': { label: 'Анхаарал хандуулах', color: 'bg-yellow-500 hover:bg-yellow-600 text-white' },
      'green': { label: 'Хэвийн', color: 'bg-green-500 hover:bg-green-600 text-white' }
    };
    const mapped = map[level] || { label: level, color: 'bg-gray-500 text-white' };
    return <Badge className={mapped.color}>{mapped.label}</Badge>;
  };

  const actionLabels: Record<string, string> = {
    "talked": "Ярилцсан",
    "contacted_parent": "Эцэг эхтэй холбогдсон",
    "referred_social": "Нийгмийн ажилтанд шилжүүлсэн",
    "referred_psychologist": "Сэтгэл зүйчид шилжүүлсэн",
    "confidential": "Нууцлалтай кейс"
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-accent/20 rounded-xl">
          <Shield className="w-8 h-8 text-accent-foreground" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Сэтгэл зүйч / Нийгмийн ажилтны самбар</h1>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50/50 border-blue-100">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Users className="w-8 h-8 text-blue-500 mb-2" />
              <div className="text-3xl font-bold text-blue-700">{totalCases || 0}</div>
              <div className="text-sm font-medium text-blue-600 mt-1">Нийт бүртгэлтэй</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-orange-50/50 border-orange-100">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Activity className="w-8 h-8 text-orange-500 mb-2" />
              <div className="text-3xl font-bold text-orange-700">{activeCases.length}</div>
              <div className="text-sm font-medium text-orange-600 mt-1">Идэвхтэй кейс</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50/50 border-purple-100">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <FileText className="w-8 h-8 text-purple-500 mb-2" />
              <div className="text-3xl font-bold text-purple-700">{pendingReferrals || 0}</div>
              <div className="text-sm font-medium text-purple-600 mt-1">Хүлээгдэж буй</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50/50 border-green-100">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
              <div className="text-3xl font-bold text-green-700">{closedThisMonth || 0}</div>
              <div className="text-sm font-medium text-green-600 mt-1">Энэ сард хаасан</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Cases Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Идэвхтэй кейсүүд</span>
                <Badge variant="outline">{activeCases.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeCases.map(c => (
                <div key={c.id} className="border rounded-xl bg-white shadow-sm overflow-hidden">
                  <div 
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleCase(c.id)}
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg">{c.studentName || c.studentCode}</span>
                        <span className="text-sm text-muted-foreground">{c.grade}-р анги</span>
                        {getRiskBadge(c.riskLevel)}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {c.status === "in_progress" ? "Ажиллаж байгаа" : c.status === "open" ? "Нээлттэй" : c.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          Сүүлд шинэчлэгдсэн: {new Date(c.updatedAt || c.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {expandedCases[c.id] ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                  </div>

                  {expandedCases[c.id] && (
                    <div className="p-4 border-t bg-gray-50/50">
                      {c.flags && c.flags.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold mb-2">Эрсдэлийн хүчин зүйлс:</h4>
                          <div className="flex flex-wrap gap-2">
                            {c.flags.map(flag => (
                              <Badge key={flag} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                {flag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mb-6 space-y-3">
                        <h4 className="text-sm font-semibold">Өмнөх тэмдэглэлүүд:</h4>
                        {c.notes && c.notes.length > 0 ? (
                          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                            {c.notes.map(note => (
                              <div key={note.id} className="bg-white p-3 rounded border text-sm">
                                <div className="flex justify-between items-start mb-1">
                                  <Badge variant="secondary" className="text-xs font-normal">
                                    {actionLabels[note.action] || note.action}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">{new Date(note.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-gray-700 mt-2">{note.content}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground italic">Тэмдэглэл байхгүй байна.</div>
                        )}
                      </div>

                      <div className="space-y-3 bg-white p-4 rounded-xl border">
                        <h4 className="text-sm font-semibold">Шинэ тэмдэглэл нэмэх:</h4>
                        <div className="flex gap-2">
                          <Select 
                            value={noteAction[c.id] || "talked"} 
                            onValueChange={(val) => setNoteAction(prev => ({ ...prev, [c.id]: val }))}
                          >
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Үйлдэл сонгох" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="talked">Ярилцсан</SelectItem>
                              <SelectItem value="contacted_parent">Эцэг эхтэй холбогдсон</SelectItem>
                              <SelectItem value="referred_social">Нийгмийн ажилтан руу</SelectItem>
                              <SelectItem value="referred_psychologist">Сэтгэл зүйч рүү</SelectItem>
                              <SelectItem value="confidential">Нууцлалтай</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Textarea 
                          placeholder="Тэмдэглэлийн агуулга..." 
                          value={noteContent[c.id] || ""}
                          onChange={(e) => setNoteContent(prev => ({ ...prev, [c.id]: e.target.value }))}
                          className="min-h-[100px]"
                        />
                        <div className="flex justify-between items-center pt-2">
                          <div className="space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-green-600 hover:text-green-700 border-green-200 hover:bg-green-50"
                              onClick={() => handleUpdateStatus(c.id, "closed")}
                              disabled={updateCase.isPending}
                            >
                              Хаах (Шийдвэрлэгдсэн)
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-purple-600 hover:text-purple-700 border-purple-200 hover:bg-purple-50"
                              onClick={() => handleUpdateStatus(c.id, "referred")}
                              disabled={updateCase.isPending}
                            >
                              Шилжүүлэх
                            </Button>
                          </div>
                          <Button 
                            onClick={() => handleAddNote(c.id)}
                            disabled={addCaseNote.isPending || !noteContent[c.id]}
                          >
                            Хадгалах
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {activeCases.length === 0 && (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
                  Одоогоор идэвхтэй кейс алга байна.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Эрсдэлийн түвшин</CardTitle>
              <CardDescription>Нийт сургуулийн хэмжээнд</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">Мэдээлэл хангалтгүй</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Сүүлийн үйл ажиллагаа</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map(note => (
                  <div key={note.id} className="flex gap-3 text-sm border-l-2 pl-3 pb-4 border-gray-100 last:pb-0 last:border-0 relative">
                    <div className="absolute w-2 h-2 rounded-full bg-primary -left-[5px] top-1"></div>
                    <div>
                      <div className="font-medium">{actionLabels[note.action] || note.action}</div>
                      <div className="text-muted-foreground mt-1 line-clamp-2">{note.content}</div>
                      <div className="text-xs text-gray-400 mt-1">{new Date(note.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
                {recentActivity.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm">Сүүлийн үйл ажиллагаа алга.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
