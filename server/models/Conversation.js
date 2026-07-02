
import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "New Chat",
    },

    pinned: {
      type: Boolean,
      default: false,
    },

    messages: [
      {
        role: String,
        content: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);


const Conversation = mongoose.model(
  "Conversation",
  conversationSchema
);

export default Conversation;
