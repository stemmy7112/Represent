import { motion } from "framer-motion";
import { TrendingUp, Zap, Shield, BarChart3, Clock, Users } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "AI-Scored Rankings",
    description: "Every opportunity scored by automation, speed-to-cash, and competition using our proprietary algorithm.",
  },
  {
    icon: Zap,
    title: "Speed To Cash",
    description: "We prioritize opportunities where you can earn your first dollar within hours, not months.",
  },
  {
    icon: Shield,
    title: "Vetted Opportunities",
    description: "Each opportunity is verified and validated before making it to your dashboard.",
  },
  {
    icon: BarChart3,
    title: "Live Market Data",
    description: "Real-time competition scoring and market saturation analysis for every category.",
  },
  {
    icon: Clock,
    title: "Automation Level",
    description: "Know exactly how much can be automated, so you build income streams that scale without you.",
  },
  {
    icon: Users,
    title: "Referral System",
    description: "Earn recurring commissions by sharing AutoIncome Engine with your network.",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-surface-elevated">
      <div className="container max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Built For <span className="text-gradient">Results</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Stop guessing. Start with data-driven income opportunities.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="p-6 rounded-xl bg-card border border-border hover:border-glow/20 transition-colors group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:shadow-glow transition-shadow">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
