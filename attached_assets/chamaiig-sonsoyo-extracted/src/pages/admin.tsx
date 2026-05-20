import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { useGetAdminDashboard, useGetUsers, useUpdateUser, useCreateUser, useGetSurveys, useUpdateSurvey, getGetAdminDashboardQueryKey, getGetUsersQueryKey, getGetSurveysQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Users, FileText, BarChart3, ShieldAlert, Plus, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const userSchema = z.object({
  name: z.string().min(2, "Нэрээ оруулна уу"),
  email: z.string().email("Имэйл хаяг буруу байна"),
  role: z.string().min(1, "Эрх сонгоно уу"),
  grade: z.string().optional(),
});

export default function Admin() {
  const [activeTab, setActiveTab] = useState("users");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  
  const { data: dashboard, isLoading: dashLoading } = useGetAdminDashboard();
  const { data: users, isLoading: usersLoading } = useGetUsers();
  const { data: surveys, isLoading: surveysLoading } = useGetSurveys();
  
  const updateUser = useUpdateUser();
  const createUser = useCreateUser();
  const updateSurvey = useUpdateSurvey();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: "", email: "", role: "teacher", grade: "" }
  });

  const onAddUser = (values: z.infer<typeof userSchema>) => {
    createUser.mutate(
      { data: values },
      {
        onSuccess: () => {
          toast({ title: "Амжилттай", description: "Хэрэглэгч нэмэгдлээ" });
          setIsAddUserOpen(false);
          form.reset();
          queryClient.invalidateQueries({ queryKey: getGetUsersQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetAdminDashboardQueryKey() });
        }
      }
    );
  };

  const handleToggleUserStatus = (id: number, isActive: boolean) => {
    updateUser.mutate(
      { id, data: { isActive: !isActive } },
      {
        onSuccess: () => {
          toast({ title: "Амжилттай", description: "Хэрэглэгчийн төлөв өөрчлөгдлөө" });
          queryClient.invalidateQueries({ queryKey: getGetUsersQueryKey() });
        }
      }
    );
  };

  const handleUpdateSurveyStatus = (id: number, status: string) => {
    updateSurvey.mutate(
      { id, data: { status } },
      {
        onSuccess: () => {
          toast({ title: "Амжилттай", description: "Судалгааны төлөв өөрчлөгдлөө" });
          queryClient.invalidateQueries({ queryKey: getGetSurveysQueryKey() });
        }
      }
    );
  };

  const roleLabels: Record<string, string> = {
    admin: "Админ",
    teacher: "Багш",
    psychologist: "Сэтгэл зүйч",
    social_worker: "Нийгмийн ажилтан",
    student: "Сурагч"
  };

  const surveyStatusLabels: Record<string, { label: string, color: string }> = {
    draft: { label: "Ноорог", color: "bg-gray-100 text-gray-800" },
    reviewed: { label: "Хянагдсан", color: "bg-blue-100 text-blue-800" },
    approved: { label: "Зөвшөөрөгдсөн", color: "bg-purple-100 text-purple-800" },
    active: { label: "Идэвхтэй", color: "bg-green-100 text-green-800" },
    archived: { label: "Архивлагдсан", color: "bg-red-100 text-red-800" }
  };

  if (dashLoading) return <div className="p-8 text-center">Уншиж байна...</div>;
  if (!dashboard) return <div className="p-8 text-center">Мэдээлэл олдсонгүй</div>;

  const { userStats, surveyStats, riskSummary, schoolStats } = dashboard;

  const chartData = [
    { name: "Багш", count: userStats.teachers },
    { name: "Сэтгэл зүйч", count: userStats.psychologists },
    { name: "Админ", count: userStats.admins },
    { name: "Сурагч", count: userStats.students },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gray-800 rounded-xl">
          <Settings className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Системийн удирдлага</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><Users className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Нийт хэрэглэгч</p>
              <h3 className="text-2xl font-bold">{userStats.total}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-full"><FileText className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Идэвхтэй судалгаа</p>
              <h3 className="text-2xl font-bold">{surveyStats.active}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-full"><ShieldAlert className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Өндөр эрсдэлтэй</p>
              <h3 className="text-2xl font-bold">{riskSummary.red}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-full"><BarChart3 className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Хамрагдалт</p>
              <h3 className="text-2xl font-bold">{schoolStats.participationRate}%</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 h-12">
          <TabsTrigger value="users" className="text-base">Хэрэглэгчид</TabsTrigger>
          <TabsTrigger value="surveys" className="text-base">Судалгаа</TabsTrigger>
          <TabsTrigger value="stats" className="text-base">Статистик</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Хэрэглэгчийн жагсаалт</h2>
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="w-4 h-4 mr-2" /> Шинэ хэрэглэгч</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Хэрэглэгч нэмэх</DialogTitle>
                  <DialogDescription>Шинэ багш, сэтгэл зүйч эсвэл админ эрхтэй хэрэглэгч нэмэх</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onAddUser)} className="space-y-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Овог нэр</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Имэйл</FormLabel>
                        <FormControl><Input type="email" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="role" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Эрх</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Сонгох" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="teacher">Багш</SelectItem>
                            <SelectItem value="psychologist">Сэтгэл зүйч</SelectItem>
                            <SelectItem value="social_worker">Нийгмийн ажилтан</SelectItem>
                            <SelectItem value="admin">Админ</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" className="w-full" disabled={createUser.isPending}>Нэмэх</Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Нэр</TableHead>
                  <TableHead>Имэйл</TableHead>
                  <TableHead>Эрх</TableHead>
                  <TableHead>Төлөв</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!usersLoading && users?.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell><Badge variant="outline">{roleLabels[u.role] || u.role}</Badge></TableCell>
                    <TableCell>
                      <Switch 
                        checked={u.isActive} 
                        onCheckedChange={() => handleToggleUserStatus(u.id, u.isActive || false)}
                        disabled={updateUser.isPending}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="surveys" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Судалгааны хуудаснууд</h2>
            <Button variant="outline"><Plus className="w-4 h-4 mr-2" /> Шинэ судалгаа үүсгэх</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!surveysLoading && surveys?.map(s => {
              const statusData = surveyStatusLabels[s.status] || surveyStatusLabels.draft;
              return (
                <Card key={s.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{s.title}</h3>
                        <p className="text-sm text-muted-foreground">{s.gradeGroup} анги</p>
                      </div>
                      <Badge className={statusData.color} variant="secondary">{statusData.label}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {s.description || "Тайлбар байхгүй байна."}
                    </div>
                    <div className="flex gap-2">
                      <Select 
                        value={s.status} 
                        onValueChange={(val) => handleUpdateSurveyStatus(s.id, val)}
                        disabled={updateSurvey.isPending}
                      >
                        <SelectTrigger className="w-full text-xs h-8">
                          <SelectValue placeholder="Төлөв өөрчлөх" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Ноорог</SelectItem>
                          <SelectItem value="reviewed">Хянагдсан</SelectItem>
                          <SelectItem value="approved">Зөвшөөрсөн</SelectItem>
                          <SelectItem value="active">Идэвхтэй</SelectItem>
                          <SelectItem value="archived">Архивлах</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" className="h-8">Засах</Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <h2 className="text-xl font-bold">Системийн нэгдсэн үзүүлэлт</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Хэрэглэгчдийн харьцаа</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <RechartsTooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Сургуулийн дундаж индекс</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 mt-4">
                <div>
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span>Дээрэлхэлтийн индекс (Сургуулийн хэмжээнд)</span>
                    <span className="text-muted-foreground">{schoolStats.avgBullyingIndex}%</span>
                  </div>
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 to-red-500" 
                      style={{ width: `${schoolStats.avgBullyingIndex}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span>Ганцаардлын индекс (Сургуулийн хэмжээнд)</span>
                    <span className="text-muted-foreground">{schoolStats.avgLonelinessIndex}%</span>
                  </div>
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 to-orange-500" 
                      style={{ width: `${schoolStats.avgLonelinessIndex}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
