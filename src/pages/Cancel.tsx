import { motion } from "framer-motion";
import { XCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Cancel = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <motion.div
        className="text-center max-w-md mx-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold mb-3">Payment Cancelled</h1>
        <p className="text-muted-foreground mb-8">
          No worries! You can try again whenever you're ready.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold shadow-glow hover:shadow-glow-lg transition-all"
        >
          Back to Home
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  );
};

export default Cancel;
