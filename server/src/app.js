import "dotenv/config";
import express from "express";
import cors from "cors";
import searchRouter from "./routes/search.js";

const app = express();

// Trust proxy headers when deployed behind Render/Vercel reverse proxies for accurate IP rate limiting
app.set("trust proxy", 1);

const parsedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",")
      .map((origin) => origin.trim().replace(/\/+$/, ""))
      .filter(Boolean)
  : [];

const allowedOrigins = parsedOrigins.length > 0 ? parsedOrigins : "*";

app.use(
  cors({
    origin: allowedOrigins,
  })
);
app.use(express.json({ limit: "16kb" }));

app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    service: "ayursathi-server",
    endpoints: ["/api/health", "/api/search"],
  });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "ayursathi-server" });
});

app.use("/api/search", searchRouter);

// Handle malformed JSON request bodies cleanly
app.use((err, _req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON request body." });
  }
  return next(err);
});

// Fallback 404 for unknown routes
app.use((_req, res) => {
  res.status(404).json({ error: "Endpoint not found." });
});

export default app;
