import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import SocialProof from "@/components/landing/SocialProof";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";
import { ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <Hero />
        <Features />
        <SocialProof />
        <Pricing />

        {/* Final CTA */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-glow/5 rounded-full blur-[150px]" />
          <motion.div
            className="relative z-10 container max-w-3xl mx-auto px-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-glow/20 bg-glow/5 text-primary text-sm font-medium mb-6">
              <Zap className="w-3.5 h-3.5" />
              Limited spots available
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Stop Searching.{" "}
              <span className="text-gradient">Start Earning.</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands who found their fastest path to online income.
            </p>
            <Link
              to="/auth"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-primary text-primary-foreground font-semibold text-lg shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-105"
            >
              Unlock Opportunities
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </section>

        <Footer />
      </main>
    </div>
  );
};

export default Index;
