import Conversation from "./models/Conversation.js";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  dbName: "novaai",
})
.then(() => {
  console.log("MongoDB Connected");
})
.catch((err) => {
  console.log(err);
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


// GET ALL CHATS
app.get("/chats", async (req, res) => {

  try {

    const chats = await Conversation.find().sort({
      pinned: -1,
      updatedAt: -1,
    });

    res.json(chats);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Failed to fetch chats",
    });

  }

});


// LOAD SINGLE CHAT
app.get("/chat/:id", async (req, res) => {

  try {

    const chat = await Conversation.findById(
      req.params.id
    );

    res.json(chat);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Failed to load chat",
    });

  }

});


// DELETE CHAT
app.delete("/chat/:id", async (req, res) => {

  try {

    await Conversation.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Delete failed",
    });

  }

});


// RENAME CHAT
app.put("/chat/:id", async (req, res) => {

  try {

    const { title } = req.body;

    const updatedChat =
      await Conversation.findByIdAndUpdate(

        req.params.id,

        {
          title,
        },

        {
          new: true,
        }

      );

    res.json(updatedChat);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Rename failed",
    });

  }

});


// PIN CHAT
app.put("/chat/pin/:id", async (req, res) => {

  try {

    const chat = await Conversation.findById(
      req.params.id
    );

    chat.pinned = !chat.pinned;

    await chat.save();

    res.json(chat);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Pin failed",
    });

  }

});


// CHAT API
app.post("/chat", async (req, res) => {

  try {

    const { message, chatId } = req.body;

    let conversation;

    // Existing Chat
    if (chatId) {

      conversation =
        await Conversation.findById(chatId);

    }

    // New Chat
    else {

      conversation =
        await Conversation.create({
          title: message.substring(0, 50),
          messages: [],
          pinned: false,
        });

    }

    // Save User Message First
    conversation.messages.push({
      role: "user",
      content: message,
    });

    await conversation.save();

    // MEMORY BUILD
    const memoryMessages = [
     {
  role: "system",
  content: `
You are NOVA AI.

You have access to the complete conversation history.

CORE RULES:

1. Always remember previous messages.
2. Use previous context naturally.
3. Never forget code shared earlier in the same chat.
4. If user says:
   - this code
   - above code
   - previous code
   - fix it
   - simplify it
   - optimize it
   then find the relevant code from chat history.

5. Never say:
   "I can't see previous messages"
   "This conversation just started"
   if chat history exists.

6. Match response length to user input.

SHORT QUESTION = SHORT ANSWER
LONG QUESTION = DETAILED ANSWER

7. If user says:
   "only code"
   "short code"
   "simple code"
   "one line code"

Return ONLY code.

No explanation.
No examples.
No extra text.

8. If request is ambiguous:

Ask a short clarification question before answering.

Example:

User:
python code for plus c

Assistant:
Do you mean:
1. a+b+c in Python
2. C language code
3. C++ code

9. For coding:

- Give production-ready code.
- Detect bugs automatically.
- Suggest fixes when needed.
- Preserve existing functionality.

10. For greetings:

If user says:
hi
hello
hey
hlo

Reply with maximum 1-2 short sentences.

Example:
"Hello 👋 How can I help you today?"

Never introduce your abilities.
Never write long greetings.

11. Do not repeat information unnecessarily.

12. Give direct answers first.
Then details if needed.

13. Behave like ChatGPT.
Natural.
Smart.
Concise.
Helpful.

14. If user asks about previous messages,
search conversation history before answering.

15. Prefer practical answers over theoretical answers.
`,
},

      ...conversation.messages
  .slice(-30)
  .map((msg) => ({
        role:
          msg.role === "ai"
            ? "assistant"
            : "user",

        content: msg.content,
      })),
    ];

    console.log(
      "MEMORY SIZE:",
      memoryMessages.length
    );

 const completion =
  await groq.chat.completions.create({

    model:
      "llama-3.1-8b-instant",

    messages: memoryMessages,

    temperature: 0.3,

    max_tokens: 2048,

    top_p: 1,

  });

    const reply =
      completion.choices[0]?.message
        ?.content || "No response";

    // Save AI Reply
    conversation.messages.push({
      role: "ai",
      content: reply,
    });

    await conversation.save();

    res.status(200).json({
      reply,
      chatId: conversation._id,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Something went wrong",
    });

  }

});

app.listen(5000, "0.0.0.0", () => {

  console.log("Server running on port 5000");

});