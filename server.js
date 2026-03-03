import express from "express";
import rateLimit from "express-rate-limit";
import Stripe from "stripe";
import OpenAI from "openai";
import PDFDocument from "pdfkit";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { techStack } from "./tech-stack.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("trust proxy", 1);

app.use(["/webhook", "/api/webhook"], bodyParser.raw({ type: "application/json" }));
app.use((req, res, next) => {
  if (req.path === "/webhook" || req.path === "/api/webhook") {
    return next();
  }

  return bodyParser.json()(req, res, next);
});

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;
const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;

const PRICE_ONE_TIME = process.env.STRIPE_PRICE_ONE_TIME;
const PRICE_SUB = process.env.STRIPE_PRICE_SUB;

let subscriptions = {};
let singlePurchases = {};

const hasAccess = (email) => Boolean(singlePurchases[email] || subscriptions[email]);
const markAccess = (collection, email) => {
  if (!email) {
    return;
  }

  collection[email.toLowerCase()] = true;
};
const normalizeEmail = (email) => (typeof email === "string" ? email.toLowerCase() : "");

const generateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { error: "Too many requests, please try again later." }
});

const healthHandler = (req, res) => {
  res.status(200).json({
    status: "ok",
    integrations: {
      stripe: Boolean(stripeSecretKey),
      stripePrices: Boolean(PRICE_ONE_TIME && PRICE_SUB),
      stripeWebhook: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
      openai: Boolean(openaiApiKey)
    }
  });
};

app.get("/health", healthHandler);
app.get("/api/health", healthHandler);

const stackHandler = (req, res) => {
  res.json({ stack: techStack });
};

app.get("/stack", stackHandler);
app.get("/api/stack", stackHandler);

const createCheckoutSessionHandler = async (req, res) => {
  if (!stripe) {
    return res.status(503).json({
      error: "Checkout unavailable: STRIPE_SECRET_KEY is not configured."
    });
  }

  if (!PRICE_ONE_TIME || !PRICE_SUB) {
    return res.status(503).json({
      error:
        "Checkout unavailable: STRIPE_PRICE_ONE_TIME and STRIPE_PRICE_SUB must be configured."
    });
  }

  try {
    const { type } = req.body;
    if (type !== "sub" && type !== "payment") {
      return res.status(400).json({
        error: "Invalid checkout type. Expected 'sub' or 'payment'."
      });
    }

    const priceId = type === "sub" ? PRICE_SUB : PRICE_ONE_TIME;
    const origin = req.headers.origin || process.env.APP_BASE_URL || "http://localhost:5173";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: type === "sub" ? "subscription" : "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/success`,
      cancel_url: `${origin}/cancel`
    });

    if (!session.url) {
      return res.status(500).json({ error: "Checkout URL was not created" });
    }

    res.json({ id: session.id, url: session.url });
  } catch (err) {
    console.error("Checkout session creation failed:", err);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};

app.post("/create-checkout-session", createCheckoutSessionHandler);
app.post("/api/create-checkout-session", createCheckoutSessionHandler);

const webhookHandler = (req, res) => {
  if (!stripe) {
    return res.status(503).json({
      error: "Webhook unavailable: STRIPE_SECRET_KEY is not configured."
    });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(503).json({
      error: "Webhook unavailable: STRIPE_WEBHOOK_SECRET is not configured."
    });
  }

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const customerEmail =
      session.customer_email || session.customer_details?.email || session.customer?.email;

    if (session.mode === "payment") {
      markAccess(singlePurchases, customerEmail);
    }

    if (session.mode === "subscription") {
      markAccess(subscriptions, customerEmail);
    }
  }

  res.json({ received: true });
};

app.post("/webhook", webhookHandler);
app.post("/api/webhook", webhookHandler);

const generateHandler = async (req, res) => {
  if (!openai) {
    return res.status(503).json({
      error: "Document generation unavailable: OPENAI_API_KEY is not configured."
    });
  }

  const { email, content, letterType } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (!hasAccess(normalizedEmail)) {
    return res.status(403).json({ error: "Payment required" });
  }

  try {
    const prompt = `Write a professional ${letterType}. Details: ${content}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    const text = completion.choices[0].message.content;

    const doc = new PDFDocument();
    const filePath = `./${uuidv4()}.pdf`;
    doc.pipe(fs.createWriteStream(filePath));
    doc.fontSize(12).text(text);
    doc.end();

    doc.on("finish", () => {
      res.download(filePath, () => {
        fs.unlink(filePath, (err) => {
          if (err) console.error("Failed to delete PDF:", err);
        });
      });
    });
  } catch (err) {
    console.error("Generate error:", err);
    res.status(500).json({ error: "Failed to generate document" });
  }
};

app.post("/generate", generateLimiter, generateHandler);
app.post("/api/generate", generateLimiter, generateHandler);

const distPath = path.join(__dirname, "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  app.get(/^\/(?!api|webhook).*/, (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  app.use(express.static("public"));
}

app.listen(process.env.PORT || 10000, () => console.log("Server running"));
