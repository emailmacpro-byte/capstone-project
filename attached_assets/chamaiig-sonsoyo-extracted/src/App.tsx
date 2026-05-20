import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import { useAuth } from "@/lib/auth";
import { useEffect } from "react";

// Pages
import Home from "@/pages/home";
import Login from "@/pages/login";
import SurveyStart from "@/pages/survey";
import SurveyGrades1to3 from "@/pages/survey/grades-1-3";
import SurveyGrades4to6 from "@/pages/survey/grades-4-6";
import SurveyGrades7to9 from "@/pages/survey/grades-7-9";
import SurveyGrades10to12 from "@/pages/survey/grades-10-12";
import SurveyResult from "@/pages/survey/result";
import MBTI from "@/pages/mbti";
import RIASEC from "@/pages/riasec";
import Help from "@/pages/help";
import Legal from "@/pages/legal";
import NotFound from "@/pages/not-found";

import Teacher from "@/pages/teacher";
import Psychologist from "@/pages/psychologist";
import Admin from "@/pages/admin";

const queryClient = new QueryClient();

function Router() {
  const { role } = useAuth();
  const [location, setLocation] = useLocation();

  // Simple auth guard for staff
  useEffect(() => {
    const staffRoutes = ["/teacher", "/psychologist", "/admin"];
    if (staffRoutes.some(r => location.startsWith(r)) && !role) {
      setLocation("/login");
    }
  }, [location, role, setLocation]);

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        
        {/* Child-facing Routes */}
        <Route path="/survey" component={SurveyStart} />
        <Route path="/survey/grades-1-3" component={SurveyGrades1to3} />
        <Route path="/survey/grades-4-6" component={SurveyGrades4to6} />
        <Route path="/survey/grades-7-9" component={SurveyGrades7to9} />
        <Route path="/survey/grades-10-12" component={SurveyGrades10to12} />
        <Route path="/survey/result" component={SurveyResult} />
        
        <Route path="/mbti" component={MBTI} />
        <Route path="/riasec" component={RIASEC} />
        
        <Route path="/help" component={Help} />
        <Route path="/legal" component={Legal} />
        
        {/* Staff routes */}
        <Route path="/teacher" component={Teacher} />
        <Route path="/psychologist" component={Psychologist} />
        <Route path="/admin" component={Admin} />

        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
