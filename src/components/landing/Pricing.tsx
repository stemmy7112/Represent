import { motion } from "framer-motion";
import { Check, ArrowRight, Star } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const tiers = [
  {
    name: "Starter",
    tier: "starter",
    price: 9,
    description: "Perfect for exploring opportunities",
    features: [
      "50 ranked opportunities",
      "Basic scoring algorithm",
      "Weekly updates",
      "Email support",
    ],
    popular: false,
  },
  {
    name: "Pro",
    tier: "pro",
    price: 29,
    description: "For serious income builders",
    features: [
      "Unlimited opportunities",
      "Advanced AI scoring",
      "Real-time updates",
      "Automation blueprints",
      "Priority support",
      "Referral dashboard",
    ],
    popular: true,
  },
  {
    name: "Scale",
    tier: "scale",
    price: 79,
    description: "For teams and agencies",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Custom scoring weights",
      "API access",
      "Dedicated account manager",
      "White-label reports",
    ],
    popular: false,
  },
];

const Pricing = () => {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async (tier: string, tierName: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      setLoadingTier(tierName);
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { tier },
      });

      if (error) throw new Error(error.message);
      if (!data?.url) throw new Error("Checkout URL was not returned");

      window.location.href = data.url;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to start checkout";
      toast.error(message);
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <section id="pricing" className="py-24 relative">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="relative z-10 container max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Simple, Transparent <span className="text-gradient">Pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Start finding high-score opportunities today. Cancel anytime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              className={`relative rounded-xl p-8 flex flex-col ${
                tier.popular
                  ? "bg-card border-2 border-glow/30 shadow-glow"
                  : "bg-card border border-border"
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-4 py-1 rounded-full bg-gradient-primary text-primary-foreground text-xs font-semibold">
                  <Star className="w-3 h-3" /> Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-1">{tier.name}</h3>
                <p className="text-sm text-muted-foreground">{tier.description}</p>
              </div>

              <div className="mb-8">
                <span className="text-5xl font-bold">${tier.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-secondary-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => handleCheckout(tier.tier, tier.name)}
                disabled={loadingTier === tier.name}
                className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  tier.popular
                    ? "bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-lg hover:scale-[1.02]"
                    : "border border-border text-secondary-foreground hover:bg-secondary"
                } ${loadingTier === tier.name ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {loadingTier === tier.name ? "Processing..." : "Get Started"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
