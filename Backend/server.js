import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  connectDB();
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};

// app.post("/gemini", async (req, res) => {
//   const { systemPrompt, userMessage } = req.body;

//   const options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
//     },
//     body: JSON.stringify({
//       model: "provider-6/gemini-2.5-flash",
//       messages: [
//         { role: "system", content: systemPrompt },
//         { role: "user", content: userMessage },
//       ],
//     }),
//   };

//   try {
//     const response = await fetch(
//       "https://api.a4f.co/v1/chat/completions",
//       options
//     );
//     const data = await response.json();

//     console.log("ENV Key:", process.env.GEMINI_API_KEY?.slice(0, 8));
//     console.log("Response:", JSON.stringify(data, null, 2));

//     res.status(200).json(data.choices[0].message.content);
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
