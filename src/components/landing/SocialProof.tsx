import { motion } from "framer-motion";
import { MessageSquare, Star } from "lucide-react";

const testimonials = [
  {
    name: "Alex Chen",
    role: "Digital Entrepreneur",
    quote: "Found a $3K/month opportunity in my first week. The scoring system is incredibly accurate.",
    rating: 5,
  },
  {
    name: "Sarah Mitchell",
    role: "Freelance Marketer",
    quote: "Stopped wasting time on saturated markets. AutoIncome showed me where the real gaps are.",
    rating: 5,
  },
  {
    name: "James Rodriguez",
    role: "Side Hustler",
    quote: "The automation scores saved me months of trial and error. Made my first dollar in 36 hours.",
    rating: 5,
  },
];

const SocialProof = () => {
  return (
    <section className="py-24">
      <div className="container max-w-5xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">
            Trusted By <span className="text-gradient">Builders</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="p-6 rounded-xl bg-card border border-border"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-secondary-foreground text-sm leading-relaxed mb-4">
                <MessageSquare className="w-4 h-4 text-muted-foreground inline mr-1" />
                "{t.quote}"
              </p>
              <div>
                <div className="font-semibold text-sm">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
