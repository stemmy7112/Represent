import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Zap, TrendingUp, Clock, Bot, Shield, LogOut, Crown, ExternalLink } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

interface Opportunity {
  id: string;
  title: string;
  category: string;
  description: string;
  automation_level: number;
  speed_to_cash: number;
  competition_score: number;
  score: number;
  time_to_cash: string;
}

const Dashboard = () => {
  const { user, loading, subscription, signOut, checkSubscription } = useAuth();
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchOpportunities = async () => {
      const { data } = await supabase
        .from("opportunities")
        .select("*")
        .order("score", { ascending: false });
      setOpportunities((data as Opportunity[]) || []);
      setLoadingData(false);
    };
    fetchOpportunities();
  }, [user]);

  useEffect(() => {
    if (user) checkSubscription();
  }, [user]);

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw new Error(error.message);
      if (data?.url) window.open(data.url, "_blank");
    } catch (error: any) {
      toast.error(error.message || "Could not open subscription manager");
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const gated = !subscription.subscribed;
  const displayedOpportunities = gated ? opportunities.slice(0, 3) : opportunities;

  const getScoreColor = (score: number) => {
    if (score >= 3) return "text-emerald-400";
    if (score >= 2) return "text-amber-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Zap className="w-5 h-5 text-primary" />
            AutoIncome
          </div>
          <div className="flex items-center gap-4">
            {subscription.subscribed && (
              <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                <Crown className="w-3 h-3" />
                {subscription.plan?.toUpperCase()}
              </span>
            )}
            {subscription.subscribed && (
              <button
                onClick={handleManageSubscription}
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                Manage <ExternalLink className="w-3 h-3" />
              </button>
            )}
            <button onClick={signOut} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Opportunity Dashboard</h1>
          <p className="text-muted-foreground">
            Ranked by Score = (Automation × 0.4) + (Speed × 0.4) − (Competition × 0.2)
          </p>
        </div>

        <div className="grid gap-4">
          {loadingData ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-card border border-border animate-pulse" />
            ))
          ) : (
            displayedOpportunities.map((opp, i) => (
              <motion.div
                key={opp.id}
                className="rounded-xl bg-card border border-border p-6 flex flex-col sm:flex-row sm:items-center gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {opp.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg">{opp.title}</h3>
                  <p className="text-sm text-muted-foreground">{opp.description}</p>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1" title="Automation">
                    <Bot className="w-4 h-4 text-primary" />
                    <span>{opp.automation_level}</span>
                  </div>
                  <div className="flex items-center gap-1" title="Speed to Cash">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{opp.speed_to_cash}</span>
                  </div>
                  <div className="flex items-center gap-1" title="Competition">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span>{opp.competition_score}</span>
                  </div>
                  <div className="flex items-center gap-1 font-bold" title="Score">
                    <TrendingUp className={`w-4 h-4 ${getScoreColor(Number(opp.score))}`} />
                    <span className={getScoreColor(Number(opp.score))}>{Number(opp.score).toFixed(1)}</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {gated && (
          <motion.div
            className="mt-8 text-center p-8 rounded-xl bg-card border border-primary/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-xl font-bold mb-2">Unlock All Opportunities</h3>
            <p className="text-muted-foreground mb-4">
              Subscribe to see all {opportunities.length} ranked opportunities with full details.
            </p>
            <button
              onClick={() => navigate("/pricing")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold shadow-glow hover:shadow-glow-lg transition-all"
            >
              View Plans
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
