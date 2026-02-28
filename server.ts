import express from "express";
import { createServer as createViteServer } from "vite";
import { OrderRepository, connectDB } from "./src/lib/store";
import dotenv from "dotenv";
import multer from "multer";

dotenv.config();

const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  await connectDB(process.env.MONGODB_URI || "");

  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/orders", upload.array('photos'), async (req, res) => {
    try {
      const orderData = JSON.parse(req.body.orderData);

      const uploadedFiles = req.files as Express.Multer.File[];

      // Store just a textual indicator that photos were provided
      orderData.photo_paths = uploadedFiles && uploadedFiles.length > 0 ? ['(Bellekte İşlendi)'] : [];

      const order = await OrderRepository.create(orderData);

      // Telegram Notification
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;
      const shopierUrl = process.env.SHOPIER_PAYMENT_URL || "Belirtilmedi";


      if (botToken && chatId) {
        let storyText = order.story.longText || "(boş)";
        let storySuffix = "";

        if (storyText.length > 1500) {
          storySuffix = storyText.substring(1500);
          storyText = storyText.substring(0, 1500) + "...";
        }

        const message = `
🚀 *Yeni Sipariş Alındı!*
🆔 ID: \`${order.id}\`
👤 Müşteri: ${order.customer.fullName}
📧 E-posta: ${order.customer.email}
🎭 Tema: ${order.story.themes?.join(", ")}
📖 Tür: ${order.story.isFiction ? "Kurgu" : "Gerçek"}
👥 Karakter Sayısı: ${order.characters?.length || 0}
💰 Ödeme Durumu: ${order.paymentStatus}
💳 Ödeme Linki: ${shopierUrl}

📝 Hikaye: ${storyText}
📸 Fotoğraflar: ${uploadedFiles && uploadedFiles.length > 0 ? uploadedFiles.length + " dosya" : "(yok)"}
        `;

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown'
          })
        }).catch(err => console.error("Telegram error:", err));

        if (storySuffix) {
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: `📝 *Hikaye (Devamı):*\n\n${storySuffix}`,
              parse_mode: 'Markdown'
            })
          }).catch(console.error);
        }

        if (uploadedFiles && uploadedFiles.length > 0) {
          for (const file of uploadedFiles) {
            try {
              const blob = new Blob([new Uint8Array(file.buffer)]);
              const fd = new FormData();
              fd.append('chat_id', chatId);
              fd.append('document', blob as any, file.originalname);

              await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
                method: 'POST',
                body: fd
              });
            } catch (err) {
              console.error("Photo send error:", err);
            }
          }
        }
      }

      res.status(201).json(order);
    } catch (error) {
      console.error("Order creation error:", error);
      res.status(500).json({ error: "Sipariş oluşturulamadı" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    const order = await OrderRepository.getById(req.params.id);
    if (!order) return res.status(404).json({ error: "Sipariş bulunamadı" });
    res.json(order);
  });

  // Admin Routes (Simple Auth)
  const adminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const password = req.headers['x-admin-password'];
    if (password === process.env.ADMIN_PASSWORD) {
      next();
    } else {
      res.status(401).json({ error: "Yetkisiz erişim" });
    }
  };

  app.get("/api/admin/orders", adminAuth, async (req, res) => {
    res.json(await OrderRepository.getAll());
  });

  app.patch("/api/admin/orders/:id", adminAuth, async (req, res) => {
    const order = await OrderRepository.update(req.params.id, req.body);
    if (!order) return res.status(404).json({ error: "Sipariş bulunamadı" });
    res.json(order);
  });

  app.get("/api/admin/mark-paid", async (req, res) => {
    const password = req.query.password;
    const id = req.query.id as string;

    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Yetkisiz erişim" });
    }

    const order = await OrderRepository.update(id, { paymentStatus: 'paid' });
    if (!order) return res.status(404).json({ error: "Sipariş bulunamadı" });

    // Telegram Notification
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (botToken && chatId) {
      fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `✅ *Ödeme Onaylandı!*\n🆔 Sipariş ID: \`${order.id}\`\n👤 Müşteri: ${order.customer.fullName}`,
          parse_mode: 'Markdown'
        })
      }).catch(console.error);
    }

    res.json(order);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => res.sendFile("dist/index.html", { root: "." }));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
