import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import novaAvatar from "./assets/nova55.png";
import Particles from "@tsparticles/react";
import { loadFull } from "tsparticles";



function App() {

const glowRef = useRef(null);
  const particlesInit = async (main) => {
await loadFull(main);
};


  const loadChat = async (id) => {

  try {

    const res = await axios.get(
      `https://nova-ai-1fpt.onrender.com/chat/${id}`
    );

    setCurrentChatId(id);

    const formattedMessages =
      res.data.messages.map((msg) => ({

        text: msg.content,

        sender:
          msg.role === "user"
            ? "user"
            : "ai",

      }));

    setMessages(formattedMessages);

  } catch (error) {

    console.log(error);

  }

};
const [eyePosition, setEyePosition] =
useState({
  x: 0,
  y: 0,
});

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

const recognitionRef = useRef(null);

useEffect(() => {
  if (SpeechRecognition) {
    recognitionRef.current =
      new SpeechRecognition();

    recognitionRef.current.continuous =
      false;

    recognitionRef.current.lang =
      "en-US";
  }
}, []);
// Glow Effect
useEffect(() => {

  let animationFrame;

  const handleMouseMove = (e) => {

    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }

    animationFrame = requestAnimationFrame(() => {

      if (glowRef.current) {

        glowRef.current.style.transform =
          `translate(${e.clientX - 175}px, ${e.clientY - 175}px)`;

      }

    });

  };

  window.addEventListener(
    "mousemove",
    handleMouseMove
  );

  return () => {

    window.removeEventListener(
      "mousemove",
      handleMouseMove
    );

  };

}, []);


// Eye Movement
useEffect(() => {

  const handleEyeMove = (e) => {

    const x =
      (e.clientX / window.innerWidth - 0.5) * 12;

    const y =
      (e.clientY / window.innerHeight - 0.5) * 12;

    setEyePosition({
      x,
      y,
    });

  };

  window.addEventListener(
    "mousemove",
    handleEyeMove
  );

  return () => {

    window.removeEventListener(
      "mousemove",
      handleEyeMove
    );

  };

}, []);
 

  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([
   
  ]);

  
const [history, setHistory] = useState([]);



  const [isTyping, setIsTyping] = useState(false);
 
const [darkMode, setDarkMode] = useState(true);

const [theme, setTheme] = useState(
  "from-black via-zinc-900 to-blue-950"
);
const [openMenu, setOpenMenu] = useState(null);
const [currentChatId, setCurrentChatId] = useState(null);
const [voiceEnabled, setVoiceEnabled] =
  useState(true);

  const [isSpeaking, setIsSpeaking] =
  useState(false);


  const [sidebarOpen, setSidebarOpen] = useState(false);


  const messagesEndRef = useRef(null);

  useEffect(() => {

  const closeMenu = () => {

    setOpenMenu(null);

  };

  window.addEventListener(
    "click",
    closeMenu
  );

  return () => {

    window.removeEventListener(
      "click",
      closeMenu
    );

  };

}, []);

  // Auto Scroll
  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);

  

  // Load Chats
  useEffect(() => {

  
fetch("https://nova-ai-1fpt.onrender.com/chats")
  .then((res) => res.json())
  .then((data) => {

    if (Array.isArray(data)) {
      setHistory(data);
    } else {
      setHistory([]);
      console.log("Chats API Error");
    }

  })
  .catch((err) => {
    console.log(err);
    setHistory([]);
  });

  }, []);

const startListening = () => {

  if (!recognitionRef.current) return;

  recognitionRef.current.start();

  recognitionRef.current.onresult = (
    event
  ) => {

    const transcript =
      event.results[0][0].transcript;

    setInput(transcript);

  };

  recognitionRef.current.onerror = (
    event
  ) => {

    console.log(event.error);

  };

};

  // New Chat
const handleNewChat = () => {

  window.speechSynthesis.cancel();

  setCurrentChatId(null);

 setMessages([]);
 

};

  // Send Message
  const handleSend = async () => {

    if (input.trim() === "") return;

    const userMessage = {
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentInput = input;

    setInput("");

    setIsTyping(true);

    try {

    const response = await axios.post(
  "https://nova-ai-1fpt.onrender.com/chat",
  {
    message: currentInput,
    chatId: currentChatId,
  }
);

const fullText = response.data.reply;

if (!currentChatId) {
  setCurrentChatId(response.data.chatId);
}

let currentText = "";

      const aiMessage = {
        text: "",
        sender: "ai",
      };

      setMessages((prev) => [...prev, aiMessage]);

const chars = fullText.split("");
      let index = 0;

      const interval = setInterval(() => {

currentText += chars[index];
        setMessages((prev) => {

          const updated = [...prev];

          updated[updated.length - 1] = {
            text: currentText,
            sender: "ai",
          };

          return updated;

        });

        index++;

     if (index >= chars.length) {

  clearInterval(interval);

  // 🔊 AI Voice Output
  // 🔊 AI Voice Output

const speech =
  new SpeechSynthesisUtterance(
    fullText
  );

// 🇮🇳 Smart Hinglish Detection

const hindiWords = [
  "kya",
  "kaise",
  "tum",
  "mera",
  "bhai",
  "haan",
  "nahi",
  "aur",
  "hai",
];

const isHindi = hindiWords.some(
  (word) =>
    currentInput
      .toLowerCase()
      .includes(word)
);

// 🇮🇳 Indian Voice

speech.lang = isHindi
  ? "hi-IN"
  : "en-IN";

speech.rate = 1;

speech.pitch = 1;

speech.volume = 1;

// 🔥 STOP OLD SPEECH FIRST
window.speechSynthesis.cancel();

// 🔊 Speak only if enabled

if (voiceEnabled) {

  setIsSpeaking(true);

  speech.onend = () => {

    setIsSpeaking(false);

  };

  window.speechSynthesis.speak(
    speech
  );

}

// Refresh Sidebar History
fetch("https://nova-ai-1fpt.onrender.com/chats")
  .then((res) => res.json())
  .then((data) => {
    setHistory(data);
  });
}

      }, 40);

    } catch (error) {

      console.log(error);

      const errorMessage = {
        text: "Something went wrong",
        sender: "ai",
      };

      setMessages((prev) => [...prev, errorMessage]);

    }

    setIsTyping(false);

  };
  const deleteChat = async (id) => {

  try {

    await axios.delete(
     `https://nova-ai-1fpt.onrender.com/chat/${id}`
    );

    setHistory(
      history.filter((chat) =>
        chat._id !== id
      )
    );

  } catch (error) {

    console.log(error);

  }

};


const renameChat = async (id) => {

const newTitle = window.prompt(
  "Rename chat:"
);

  if (!newTitle) return;

  try {

    await axios.put(
     `https://nova-ai-1fpt.onrender.com/chat/${id}`,
      {
        title: newTitle,
      }
    );

  fetch("https://nova-ai-1fpt.onrender.com/chats")
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
      });

  } catch (error) {

    console.log(error);

  }

};

const pinChat = async (id) => {

  try {

    await axios.put(
     `https://nova-ai-1fpt.onrender.com/chat/${id}`
    );

   fetch("https://nova-ai-1fpt.onrender.com/chats")
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
      });

  } catch (error) {

    console.log(error);

  }

};

  return (

    
    
<>
<Particles
  id="tsparticles"
  init={particlesInit}
  options={{
    background: {
      color: {
        value: "transparent",
      },
    },
    fpsLimit: 60,
    particles: {
      color: {
        value: "#00ffff",
      },
      links: {
        color: "#00ffff",
        distance: 120,
        enable: true,
        opacity: 0.2,
        width: 1,
      },
      move: {
        enable: true,
        speed: 1,
      },
      number: {
        value: 45,
      },
      opacity: {
        value: 0.2,
      },
      size: {
        value: { min: 1, max: 3 },
      },
    },
  }}
className="absolute inset-0 -z-10 pointer-events-none"/>

<div
  ref={glowRef}
  className="pointer-events-none fixed z-0 w-[350px] h-[350px] rounded-full blur-[120px] bg-cyan-400/20"
></div>
    
 

<div
className={`min-h-screen flex flex-col md:flex-row transition-all duration-500 overflow-hidden relative ${    darkMode
      ? `bg-gradient-to-br ${theme} text-white`
     : "bg-gradient-to-br from-zinc-100 via-white to-zinc-200 text-black"
  }`}
>

<div className="absolute top-0 left-0w-full max-w-[320px] md:w-80 h-72 bg-cyan-500/20 blur-[120px] rounded-full"></div>

<div className="absolute bottom-0 right-0w-full max-w-[320px] md:w-80 h-72 bg-fuchsia-500/20 blur-[120px] rounded-full"></div>

{sidebarOpen && (
<div
onClick={() => setSidebarOpen(false)}
className="fixed inset-0 bg-black/50 z-40 md:hidden"
/>
)}

    {/* Sidebar */}
<div
  className={`
fixed md:relative
top-0 left-0
z-50
h-screen
flex flex-col overflow-hidden
w-72
md:w-80
transform
transition-transform
duration-300
${
  sidebarOpen
    ? "translate-x-0"
    : "-translate-x-full md:translate-x-0"
}
${
  darkMode
    ? "bg-white/5 border border-cyan-400/20 shadow-[0_0_25px_rgba(0,255,255,0.15)]"
    : "bg-zinc-100 border-zinc-300"
}
`}
>

<div className="flex justify-between items-center md:hidden mb-5">

  <h2 className="text-xl font-bold">
    NOVA AI
  </h2>

 <button
  onClick={() => setSidebarOpen(false)}
  className="text-3xl p-2"
>
  ✕
</button>

</div>

{sidebarOpen && (
<div
onClick={()=>setSidebarOpen(false)}
 className="fixed inset-0 bg-black/40"
/>
)}

<span className="hidden md:block bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 bg-clip-text text-transparent animate-pulse">  NOVA AI ✨
</span>
        
<div className="flex gap-2 mb-4">
<button
  onClick={() =>
    setVoiceEnabled(!voiceEnabled)
  }
  className="bg-white/10 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-lg hover:scale-105 transition"
>
  {voiceEnabled ? "🔊" : "🔇"}
</button>

  <button
    onClick={() => setDarkMode(!darkMode)}
    className="bg-white/10 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-lg hover:scale-105 transition"
  >
    {darkMode ? "☀️" : "🌙"}
  </button>

  <button
    onClick={() =>
      setTheme(
       "from-[#050816] via-[#0f172a] to-[#020617]"
      )
    }
    className="w-8 h-8 rounded-full bg-blue-500"
  ></button>

  <button
    onClick={() =>
      setTheme(
        "from-black via-[#1a0033] to-[#0f001f]"
      )
    }
    className="w-8 h-8 rounded-full bg-purple-500"
  ></button>

  <button
    onClick={() =>
      setTheme(
        "from-black via-[#001f1b] to-[#00110f]"
      )
    }
    className="w-8 h-8 rounded-full bg-green-500"
  ></button>

</div>



        <button
        onClick={()=>{
handleNewChat();
setSidebarOpen(false);
}}
          className="w-full bg-white text-black py-3 rounded-xl font-semibold"
        >
          + New Chat
        </button>

        {/* Chat History */}
      
<div
className="
mt-6
space-y-3
overflow-y-auto
h-[calc(100vh-210px)]
pr-2
custom-scroll
">

<div className="flex-1 mt-6 overflow-y-auto px-2 custom-scroll">

  {/* 📌 PINNED CHATS */}
  {history.filter(chat => chat.pinned).length > 0 && (
    <>
      <h3 className="text-xs uppercase tracking-widest text-cyan-400 font-bold mb-3">
        📌 Pinned
      </h3>

      <div className="space-y-3 mb-6">
        {history
          .filter(chat => chat.pinned)
          .map((chat) => (

            <div
              key={chat._id}
              onClick={() => {
                loadChat(chat._id);
                setSidebarOpen(false);
              }}
              className={`p-3 rounded-xl text-sm transition flex items-center justify-between cursor-pointer ${
                darkMode
                  ? "bg-zinc-800 hover:bg-zinc-700 text-white"
                  : "bg-white hover:bg-zinc-100 text-black border border-zinc-300"
              }`}
            >
              <span className="truncate flex items-center gap-2">
                📌 {chat.title}
              </span>

              <div className="relative">

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenu(openMenu === chat._id ? null : chat._id);
                  }}
                  className="ml-2 text-lg hover:scale-110 transition"
                >
                  ⋮
                </button>

                {openMenu === chat._id && (

                  <div
                    onClick={(e) => e.stopPropagation()}
                    className={`absolute right-0 mt-2 w-32 rounded-xl shadow-xl z-50 ${
                      darkMode
                        ? "bg-zinc-900 border border-zinc-700"
                        : "bg-white border border-zinc-300"
                    }`}
                  >

                    <button
                      onClick={() => pinChat(chat._id)}
                      className="block w-full text-left px-4 py-2 hover:bg-zinc-700 rounded-t-xl"
                    >
                      📍 Unpin
                    </button>

                    <button
                      onClick={() => renameChat(chat._id)}
                      className="block w-full text-left px-4 py-2 hover:bg-zinc-700"
                    >
                      ✏️ Rename
                    </button>

                    <button
                      onClick={() => deleteChat(chat._id)}
                      className="block w-full text-left px-4 py-2 hover:bg-red-500 rounded-b-xl"
                    >
                      🗑 Delete
                    </button>

                  </div>

                )}

              </div>

            </div>

          ))}
      </div>
    </>
  )}

  {/* 🕒 RECENT CHATS */}

  <h3 className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-3">
    🕒 Recent
  </h3>

  <div className="space-y-3">

    {history
      .filter(chat => !chat.pinned)
      .map((chat) => (

        <div
          key={chat._id}
          onClick={() => {
            loadChat(chat._id);
            setSidebarOpen(false);
          }}
          className={`p-3 rounded-xl text-sm transition flex items-center justify-between cursor-pointer ${
            darkMode
              ? "bg-zinc-800 hover:bg-zinc-700 text-white"
              : "bg-white hover:bg-zinc-100 text-black border border-zinc-300"
          }`}
        >
          <span className="truncate">
            {chat.title}
          </span>

          <div className="relative">

            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenu(openMenu === chat._id ? null : chat._id);
              }}
              className="ml-2 text-lg hover:scale-110 transition"
            >
              ⋮
            </button>

            {openMenu === chat._id && (

              <div
                onClick={(e) => e.stopPropagation()}
                className={`absolute right-0 mt-2 w-32 rounded-xl shadow-xl z-50 ${
                  darkMode
                    ? "bg-zinc-900 border border-zinc-700"
                    : "bg-white border border-zinc-300"
                }`}
              >

                <button
                  onClick={() => pinChat(chat._id)}
                  className="block w-full text-left px-4 py-2 hover:bg-zinc-700 rounded-t-xl"
                >
                  📌 Pin
                </button>

                <button
                  onClick={() => renameChat(chat._id)}
                  className="block w-full text-left px-4 py-2 hover:bg-zinc-700"
                >
                  ✏️ Rename
                </button>

                <button
                  onClick={() => deleteChat(chat._id)}
                  className="block w-full text-left px-4 py-2 hover:bg-red-500 rounded-b-xl"
                >
                  🗑 Delete
                </button>

              </div>

            )}

          </div>

        </div>

      ))}

  </div>

</div>

</div>
</div>

    {/* Main Chat */}
<div className="flex-1 flex flex-col h-screen">

      {/* Header */}
<div
className={`p-4 md:p-5 text-lg md:text-2xl font-bold border-b ${
  darkMode
    ? "border-zinc-800 text-white"
    : "border-zinc-300 text-black"
}`}
>

<div className="flex items-center gap-3">

  {/* Mobile Menu Button */}
  <button
    onClick={() => setSidebarOpen(true)}
    className="text-2xl md:hidden"
  >
    ☰
  </button>

  <span>
    {isSpeaking
      ? "🟢 AI Speaking..."
      : "NOVA • AI Voice Assistant"}
  </span>

</div>

</div>
{/* ULTRA AI CORE */}

{isSpeaking && (
<div className="flex justify-center items-center py-3 md:py-6 px-3">

    <motion.div

      initial={{
        opacity: 0,
        scale: 0.7,
        y: 40,
      }}

      animate={{
        opacity: 1,
        scale: [1, 1.03, 1],
        y: [0, -8, 0],
        rotate: [0, 1.5, -1.5, 0],
      }}

      transition={{
        repeat: Infinity,
        duration: 3,
      }}

      className="
      relative
      overflow-hidden
      p-10
      rounded-[50px]
      border border-cyan-400/20
      backdrop-blur-3xl
      bg-gradient-to-br
      from-cyan-500/10
      via-white/5
      to-fuchsia-500/10
      shadow-[0_0_60px_rgba(0,255,255,0.25)]
      "
    >

      {/* CORE GLOW */}

      <motion.div

        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.4, 0.9, 0.4],
        }}

        transition={{
          repeat: Infinity,
          duration: 2,
        }}

        className="
        absolute
        inset-0
        bg-cyan-400/30
        blur-[120px]
        rounded-full
        "
      />

      {/* ROTATING OUTER RING */}

      <motion.div

        animate={{
          rotate: 360,
        }}

        transition={{
          repeat: Infinity,
          duration: 10,
          ease: "linear",
        }}

        className="
        absolute
        inset-0
        rounded-full
        border
        border-cyan-400/30
        "
      />

      {/* SECOND ROTATING RING */}

      <motion.div

        animate={{
          rotate: -360,
        }}

        transition={{
          repeat: Infinity,
          duration: 14,
          ease: "linear",
        }}

        className="
        absolute
        inset-[12px]
        rounded-full
        border
        border-fuchsia-400/20
        "
      />

      {/* AUDIO WAVE */}

      <motion.div

        animate={{
          scale: [1, 1.5],
          opacity: [0.6, 0],
        }}

        transition={{
          repeat: Infinity,
          duration: 1.5,
        }}

        className="
        absolute
        inset-[-10px]
        rounded-full
        border
        border-cyan-400/40
        "
      />

      {/* ENERGY RING */}

      <motion.div

        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.7, 0.2],
        }}

        transition={{
          repeat: Infinity,
          duration: 2.5,
        }}

        className="
        absolute
        inset-[-25px]
        rounded-full
        border-2
        border-cyan-400/20
        blur-sm
        "
      />

      {/* ORBIT DOT */}

      <motion.div

        animate={{
          rotate: 360,
        }}

        transition={{
          repeat: Infinity,
          duration: 6,
          ease: "linear",
        }}

        className="
        absolute
        inset-[-30px]
        "
      >

        <div
          className="
          absolute
          top-0
          left-1/2
          w-4
          h-4
          bg-fuchsia-400
          rounded-full
          shadow-[0_0_25px_rgba(217,70,239,1)]
          "
        ></div>

      </motion.div>

      {/* FLOATING ENERGY PARTICLES */}

      {[...Array(10)].map((_, i) => (

        <motion.div

          key={i}

          animate={{
            y: [0, -40, 0],
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5],
          }}

          transition={{
            repeat: Infinity,
            duration: 2 + i * 0.3,
          }}

          className="
          absolute
          w-1.5
          h-1.5
          bg-cyan-300
          rounded-full
          "

          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />

      ))}

      {/* AVATAR */}

      <motion.img

        animate={{
          scale: [1, 1.06, 1],
        }}

        transition={{
          repeat: Infinity,
          duration: 1.2,
        }}

        src={novaAvatar}

        alt="Nova AI"

        className="
        w-28
h-28
sm:w-36
sm:h-36
md:w-44
md:h-44
        object-contain
        relative
        z-10
        drop-shadow-[0_0_70px_rgba(0,255,255,1)]
        "
      />

      {/* AI EYES */}

      {/* LEFT EYE */}

<motion.div

  animate={{
    x: eyePosition.x,
    y: eyePosition.y,
    scale: [1, 1.2, 1],
  }}

  transition={{
    x: {
      type: "spring",
      stiffness: 120,
    },

    y: {
      type: "spring",
      stiffness: 120,
    },

    scale: {
      repeat: Infinity,
      duration: 1.5,
    },
  }}

  className="
  absolute
  top-[82px]
  left-[78px]
  w-3.5
  h-3.5
  bg-cyan-400
  rounded-full
  blur-[1px]
  shadow-[0_0_20px_rgba(0,255,255,1)]
  z-20
  "
/>

{/* RIGHT EYE */}

<motion.div

  animate={{
    x: eyePosition.x,
    y: eyePosition.y,
    scale: [1, 1.2, 1],
  }}

  transition={{
    x: {
      type: "spring",
      stiffness: 120,
    },

    y: {
      type: "spring",
      stiffness: 120,
    },

    scale: {
      repeat: Infinity,
      duration: 1.5,
    },
  }}

  className="
  absolute
  top-[82px]
  right-[78px]
  w-3.5
  h-3.5
  bg-cyan-400
  rounded-full
  blur-[1px]
  shadow-[0_0_20px_rgba(0,255,255,1)]
  z-20
  "
/>

    </motion.div>

  </div>
)}
{isSpeaking && (
  <div className="flex justify-center gap-1 mt-4">
    <div className="w-2 h-6 bg-cyan-400 rounded-full animate-bounce"></div>
    <div className="w-2 h-10 bg-blue-400 rounded-full animate-bounce delay-100"></div>
    <div className="w-2 h-6 bg-fuchsia-400 rounded-full animate-bounce delay-200"></div>
  </div>
)}

{messages.length === 0 && (
  <div className="flex flex-col items-center justify-center h-full text-center">

    <motion.div
      animate={{
        scale: [1, 1.1, 1],
      }}
      transition={{
        repeat: Infinity,
        duration: 2,
      }}
      className="w-40 h-40 rounded-full bg-cyan-500/20 blur-2xl absolute"
    ></motion.div>

    <motion.div
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        repeat: Infinity,
        duration: 3,
      }}
      className="relative z-10"
    >
      <img
        src={novaAvatar}
        alt=""
        className="w-36 h-36 object-contain drop-shadow-[0_0_35px_rgba(0,255,255,0.7)]"
      />
    </motion.div>

    <h1 className="text-4xl font-bold mt-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 bg-clip-text text-transparent">
      Ask Me Anything
    </h1>

    <p className="text-zinc-400 mt-3">
      Your futuristic AI assistant
    </p>

  </div>
)}

        {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 pb-36 space-y-4">

          {messages.map((msg, index) => (

            <motion.div
              key={index}
             initial={{
  opacity: 0,
  y: 30,
  scale: 0.95,
}}

animate={{
  opacity: 1,
  y: 0,
  scale: 1,
}}
          className={`w-fit max-w-[65%] p-4 rounded-2xl transition-all duration-300 ${
 msg.sender === "user"
? darkMode
  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 text-white ml-auto shadow-[0_0_20px_rgba(0,255,255,0.3)]"
  : "bg-gradient-to-r from-zinc-900 to-black text-white ml-auto shadow-lg"
    : darkMode
    ? "bg-white/5 backdrop-blur-2xl border border-fuchsia-400/20 text-white shadow-[0_0_30px_rgba(217,70,239,0.2)]"
    : "bg-white/80 backdrop-blur-xl border border-zinc-200 text-black shadow-lg"
}`}
            >

              {msg.text.includes("```") ? (

                <SyntaxHighlighter
                  language="javascript"
                  style={oneDark}
                  customStyle={{
                    borderRadius: "16px",
                    padding: "20px",
                    fontSize: "14px",
                  }}
                >
                  {msg.text.replace(/```/g, "")}
                </SyntaxHighlighter>


) : (

  <div className="prose prose-invert max-w-none">
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {msg.text}
    </ReactMarkdown>
  </div>

)}

            </motion.div>

          ))}

          {isTyping && (

            <div className="bg-zinc-800 p-4 rounded-2xl w-fit">
             <div className="flex gap-1">
  <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
  <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></span>
  <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></span>
</div>
            </div>

          )}

          <div ref={messagesEndRef}></div>

        </div>

        {/* Input */}
       
<div
className={`sticky bottom-0 z-20 p-3 border-t flex flex-wrap gap-2 ${
darkMode
? "bg-black/60 border-zinc-800 backdrop-blur-xl"
: "bg-white/90 border-zinc-300 backdrop-blur-xl"
}`}
>        

          <input
          flex-1 min-w-0
            type="text"
            placeholder="Ask anything..."
            value={input}
            
            onChange={(e) => setInput(e.target.value)}
            
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
              
            }}
        className={`flex-1 min-w-0 w-full md:w-auto p-4 rounded-2xl outline-none transition-all duration-300 shadow-lg ${
          
  darkMode
    ? "bg-white/5 border border-cyan-400/20 backdrop-blur-2xl text-white focus:ring-2 focus:ring-cyan-400 shadow-inner shadow-cyan-500/10"
    : "bg-white border border-zinc-300 text-black focus:ring-2 focus:ring-blue-400"
    
}`}
          />

          <button
            onClick={handleSend}
className="px-4 md:px-6 rounded-2xl font-semibold transition-all duration-300 hover:scale-110 active:scale-95 shadow-[0_0_25px_rgba(0,255,255,0.4)] bg-gradient-to-r from-cyan-500 via-blue-500 to-fuchsia-500 text-white"          >
           <>
<span className="hidden md:inline">Send</span>
<span className="md:hidden">➤</span>
</>
          </button>

          <button
            onClick={startListening}
className="px-4 md:px-6 rounded-2xl bg-white/10 border border-cyan-400/20 backdrop-blur-xl hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(0,255,255,0.25)]"          >
            🎤
          </button>
<button
  onClick={() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }}
  className="px-4 md:px-6 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-xl bg-gradient-to-r from-red-500 to-pink-500 text-white"
>
  <>
<span className="hidden md:inline">🛑 Stop Voice</span>
<span className="md:hidden">⏹</span>
</>
</button>
        </div>

      </div>

    </div>
    </>

  );


}
export default App;


