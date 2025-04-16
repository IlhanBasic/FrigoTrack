import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import cookies from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

import userRoute from "./routes/user.route.js";
import coldRoute from "./routes/coldRoom.route.js";
import partnerRoute from "./routes/partner.route.js";
import productRoute from "./routes/product.route.js";
import documentRoute from "./routes/document.route.js";
import paymentRoute from "./routes/payment.route.js";
import messageRoute from "./routes/message.route.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  path: "/socket.io",
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
  serveClient: false,
});

app.use(cookies());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/coldrooms", coldRoute);
app.use("/api/partners", partnerRoute);
app.use("/api/products", productRoute);
app.use("/api/documents", documentRoute);
app.use("/api/payments", paymentRoute);
app.use("/api/messages", messageRoute);

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("joinUser", (userId) => {
    socket.join(userId);
  });
  socket.on("sendMessage", async (messageData) => {
    try {
      io.to(messageData.sender)
        .to(messageData.receiver)
        .emit("newMessage", messageData);
      console.log(
        `Message emitted to rooms ${messageData.sender} and ${messageData.receiver}`
      );
    } catch (err) {
      console.error("Error handling message:", err);
      socket.emit("messageError", { error: err.message });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

httpServer.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  connectDB();
});
