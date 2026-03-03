import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold">
            <div className="w-6 h-6 rounded bg-gradient-primary flex items-center justify-center">
              <Zap className="w-3 h-3 text-primary-foreground" />
            </div>
            AutoIncome Engine
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/auth" className="hover:text-foreground transition-colors">Sign In</Link>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 AutoIncome Engine. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
