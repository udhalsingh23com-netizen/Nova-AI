import React from 'react'
import { Activity, Award, Bell, ChevronLeft, ChevronRight, Coffee, Globe, HelpCircle, Home, Info, Layers, LogOut, MapPin, MessageCircle, Moon, Plus, RefreshCw, Send, Shield, Smile, Sun, Target, User, Zap } from 'lucide-react'

var generateImageUrl = window.generateImageUrl || function(p, w, h) {
  var seed = 0; for (var i = 0; i < p.length; i++) seed = (seed * 31 + p.charCodeAt(i)) % 100000;
  return "https://picsum.photos/seed/" + Math.abs(seed) + "/" + (w || 400) + "/" + (h || 300);
};
var generateAvatarUrl = window.generateAvatarUrl || function(d) {
  var s = d || "avatar"; var seed = 0; for (var i = 0; i < s.length; i++) seed = (seed * 31 + s.charCodeAt(i)) % 100000;
  return "https://api.dicebear.com/7.x/avataaars/svg?seed=" + Math.abs(seed);
};
var generateHeroUrl = window.generateHeroUrl || function(d, w) {
  return generateImageUrl(d || "abstract background", w || 800, 400);
};
var page = null;
var _zdbPfx = "zdb_" + ((typeof window !== "undefined" && window.__APPIO_APP_ID__) ? window.__APPIO_APP_ID__ + "_" : "");
var ZapplyDB = (window.ZapplyDB && typeof window.ZapplyDB.load === "function") ? window.ZapplyDB : {
  save: function(k,d) { try { localStorage.setItem(_zdbPfx+k, JSON.stringify(d)); } catch(e) {} return d; },
  load: function(k,f) { try { var r = localStorage.getItem(_zdbPfx+k); if(r===null||r==="undefined") return f!==undefined?f:null; return JSON.parse(r); } catch(e) { return f!==undefined?f:null; } },
  remove: function(k) { localStorage.removeItem(_zdbPfx+k); },
  addItem: function(k,item) { var l=ZapplyDB.load(k,[]); if(!Array.isArray(l))l=[]; var n={}; for(var p in item){if(item.hasOwnProperty(p))n[p]=item[p];} if(!n.id)n.id=Date.now().toString(36)+"_"+Math.random().toString(36).slice(2,7); l.push(n); ZapplyDB.save(k,l); return l; },
  removeItem: function(k,id) { var l=ZapplyDB.load(k,[]); if(!Array.isArray(l))return[]; var f=l.filter(function(x){return x.id!==id}); ZapplyDB.save(k,f); return f; },
  updateItem: function(k,id,u) { var l=ZapplyDB.load(k,[]); if(!Array.isArray(l))return[]; var m=l.map(function(x){if(x.id!==id)return x; var o={}; for(var p in x){if(x.hasOwnProperty(p))o[p]=x[p];} for(var p2 in u){if(u.hasOwnProperty(p2))o[p2]=u[p2];} return o;}); ZapplyDB.save(k,m); return m; }
};
var useZapplyDB = (window.useZapplyDB && typeof window.useZapplyDB === "function") ? window.useZapplyDB : function(key, initialValue) {
  var stored = ZapplyDB.load(key, initialValue);
  var s = React.useState(stored); var val = s[0]; var setRaw = s[1];
  var setVal = function(nv) { if(typeof nv==="function"){setRaw(function(p){var r=nv(p);ZapplyDB.save(key,r);return r;});}else{ZapplyDB.save(key,nv);setRaw(nv);} };
  return [val, setVal];
};
// PALETTE: bg=bg-sky-50 accent=sky-500 card=card-tone hero=accent-or-gradient
var SEED_CONVERSATIONS = [
  { id: 1, title: "Recipe ideas for dinner", preview: "Try making paneer butter masala with...", time: "2 min ago", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav", unread: true },
  { id: 2, title: "Help with math homework", preview: "Let me explain quadratic equations...", time: "1 hour ago", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya", unread: false },
  { id: 3, title: "Travel tips for Goa", preview: "Best time to visit is November...", time: "Yesterday", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul", unread: false },
  { id: 4, title: "Workout routine", preview: "Here's a 30-minute home workout...", time: "2 days ago", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya", unread: false },
  { id: 5, title: "Book recommendations", preview: "You might enjoy Atomic Habits by...", time: "3 days ago", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram", unread: false },
  { id: 6, title: "Coding question", preview: "Use React.useEffect for side effects...", time: "1 week ago", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha", unread: false }
];

var SEED_MESSAGES = [
  { id: 1, role: "user", text: "Hi! Can you help me with a recipe idea for tonight's dinner?", time: "10:24 AM" },
  { id: 2, role: "ai", text: "Of course! 👨‍🍳 What ingredients do you have at home? I can suggest something quick and delicious.", time: "10:24 AM" },
  { id: 3, role: "user", text: "I have paneer, tomatoes, onions, cream, and some spices.", time: "10:25 AM" },
  { id: 4, role: "ai", text: "Perfect! You can make Paneer Butter Masala! 🧈\n\nHere's the quick recipe:\n• Sauté onions till golden\n• Add tomatoes and cook till soft\n• Blend into a smooth paste\n• Add cream, butter, and spices (kasuri methi, garam masala)\n• Add paneer cubes and simmer for 5 minutes\n• Garnish with coriander\n\nServe with naan or rice. Total time: ~30 minutes!", time: "10:25 AM" },
  { id: 5, role: "user", text: "That sounds amazing! Can I make it less spicy?", time: "10:27 AM" },
  { id: 6, role: "ai", text: "Absolutely! Just reduce the red chili powder to half and skip green chilies. The cream and butter will keep it rich and mild. You can also add a teaspoon of sugar to balance the flavors. 😊", time: "10:27 AM" }
];

var AI_KNOWLEDGE = {
  "recipe|paneer|food|cook|dinner|lunch|breakfast": "I'd love to help with cooking! 🍳 Popular Indian dishes you can try: Paneer Butter Masala, Dal Makhani, Veg Biryani, Chole Bhature, Palak Paneer, or Masala Dosa. Tell me what ingredients you have and I'll suggest a recipe!",
  "math|equation|algebra|calculus|geometry": "Math can be fun! 📐 I can help with arithmetic, algebra, geometry, trigonometry, or calculus. Share the specific problem you're working on and I'll guide you through the solution step by step.",
  "code|programming|coding|javascript|python|react": "Happy to help with coding! 💻 I can assist with JavaScript, Python, React, HTML/CSS, and more. What are you trying to build or fix? Share your code snippet and I'll explain or debug it.",
  "travel|goa|manali|kerala|delhi|mumbai|trip|vacation": "India has amazing travel destinations! 🏖️ Top picks:\n• Goa - beaches & nightlife (Nov-Feb)\n• Manali - mountains & snow (Dec-Jan)\n• Kerala - backwaters & nature (Sep-Mar)\n• Jaipur - heritage & culture (Oct-Mar)\n\nWhere are you planning to go?",
  "workout|exercise|gym|fitness|yoga": "Here's a quick home workout (30 min): 💪\n• 5 min warm-up (jumping jacks, stretches)\n• 10 min strength (push-ups, squats, planks)\n• 10 min cardio (burpees, mountain climbers)\n• 5 min cool-down stretches\n\nFor yoga, try Surya Namaskar - 12 poses for full body flexibility!",
  "book|read|novel|recommend": "Great reads to consider: 📚\n• Atomic Habits - James Clear (self-growth)\n• The Alchemist - Paulo Coelho (fiction)\n• Ikigai - Hector Garcia (lifestyle)\n• Rich Dad Poor Dad - Robert Kiyosaki (finance)\n• Wings of Fire - APJ Abdul Kalam (biography)\n\nWhat genre interests you?",
  "movie|film|watch|series|netflix": "Top picks across genres: 🎬\n• 3 Idiots, Dangal, Lagaan (Bollywood classics)\n• Sacred Games, Mirzapur (Indian web series)\n• Inception, Interstellar (Hollywood sci-fi)\n• The Shawshank Redemption (drama)\n\nWhat's your mood today?",
  "joke|funny|laugh|humor": "Here's one for you! 😄\n\nWhy did the programmer quit his job?\nBecause he didn't get arrays! (a raise)\n\nWant to hear another one?",
  "weather|temperature|rain|forecast": "I can't fetch live weather data, but here's a tip: ☀️ For current conditions, check the India Meteorological Department website or apps like AccuWeather. Monsoon usually arrives in Kerala by June 1 and reaches Delhi by early July.",
  "hello|hi|hey|namaste|namaskar": "Namaste! 🙏 I'm your AI assistant. I can help with recipes, math, coding, travel tips, workout plans, book recommendations, and much more. What would you like to know today?",
  "thank|thanks|shukriya": "You're most welcome! 😊 Feel free to ask anything else - I'm here to help 24/7. Have a wonderful day!",
  "bye|goodbye|see you|phir milenge": "Goodbye! 👋 Take care and have a great day ahead. Come back anytime you need help - I'm always here!"
};

function getAIResponse(userText) {
  var text = (userText || "").toLowerCase();
  for (var key in AI_KNOWLEDGE) {
    var keywords = key.split("|");
    for (var i = 0; i < keywords.length; i++) {
      if (text.indexOf(keywords[i]) >= 0) {
        return AI_KNOWLEDGE[key];
      }
    }
  }
  var genericResponses = [
    "That's an interesting question! 🤔 Based on what you've shared, I'd suggest exploring this topic further. Could you give me a bit more context so I can help you better?",
    "Great point! 💡 Let me think about this... I believe the best approach would depend on your specific situation. What outcome are you hoping to achieve?",
    "I understand what you're asking. 📝 Here's my take: this is a topic with multiple perspectives. Let me know if you'd like me to dive deeper into any specific aspect.",
    "Thanks for asking! 🎯 I'd recommend breaking this down into smaller steps. What's the most important part you'd like to tackle first?",
    "Wonderful question! ✨ Based on general best practices, here are 3 things to consider: clarity, simplicity, and consistency. Which resonates most with you?"
  ];
  return genericResponses[Math.floor(Math.random() * genericResponses.length)];
}

function SplashScreen({onFinish}) {
  React.useEffect(function() { var t = setTimeout(onFinish, 1800); return function() { clearTimeout(t) } }, []);
  return (<>
    <div className="min-h-screen flex items-center justify-center bg-sky-50 dark:bg-gray-950">
      <div className="text-center">
        <img
          src={generateImageUrl("Nova AI app logo, glowing sparkle star emblem, indigo fuchsia pink gradient, minimal modern rounded icon", 200, 200)}
          alt="Nova AI"
          className="w-24 h-24 mx-auto mb-5 rounded-full shadow-lg shadow-fuchsia-500/30 ring-4 ring-white/40 object-cover"
        />
        <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">Nova AI</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 font-medium">Your intelligent conversation partner</p>
        <div className="flex justify-center gap-1 mt-6">
          <div className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" style={{animationDelay: "0ms"}}></div>
          <div className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" style={{animationDelay: "150ms"}}></div>
          <div className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" style={{animationDelay: "300ms"}}></div>
        </div>
      </div>
    </div>
  </>);
}

function HomePage({setPage, data, setData, darkMode, setDarkMode}) {
  var currentTime = "10:28 AM";
  var greeting = "Good Morning";
  var userName = "Aarav";
  var todayChats = 12;
  var totalMessages = 247;
  return (
    <div className="min-h-screen">
      <div key={page} className="animate-fade-in">
        <div className="px-5 pt-6 pb-24">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <img
                src={generateImageUrl("Nova AI app logo, glowing sparkle star emblem, indigo fuchsia pink gradient, minimal modern rounded icon", 120, 120)}
                alt="Nova AI"
                className="w-11 h-11 rounded-2xl object-cover ring-2 ring-sky-200/60 shadow-sm shadow-sky-500/20"
              />
              <div>
                <p className="text-base font-black tracking-tight text-gray-900 dark:text-white">Nova AI</p>
                <p className="text-[11px] uppercase tracking-[0.14em] text-gray-400">Your intelligent assistant</p>
              </div>
            </div>
            <button onClick={function() { setDarkMode(!darkMode) }} className="w-10 h-10 rounded-full bg-white dark:bg-gray-900 border border-sky-100 dark:border-gray-800 shadow-sm flex items-center justify-center hover:scale-105 transition-all">
              {darkMode ? <Sun size={18} className="text-gray-700 dark:text-gray-300" /> : <Moon size={18} className="text-gray-700 dark:text-gray-300" />}
            </button>
          </div>

          <div className="bg-gradient-to-br from-sky-500 via-sky-600 to-purple-600 rounded-3xl p-7 mb-6 shadow-lg shadow-sky-900/10">
            <div className="mb-4">
              <div>
                <p className="text-xs text-white/80 font-medium uppercase tracking-wider">{currentTime}</p>
                <h1 className="text-3xl font-black tracking-tight text-white mt-1">{greeting}, {userName}!</h1>
                <p className="text-sm text-white/80 mt-1">Ready to chat with Nova AI?</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <MessageCircle size={14} className="text-white" />
                  <span className="text-[10px] font-bold text-white/80 uppercase tracking-[0.16em]">Today</span>
                </div>
                <p className="text-2xl font-black text-white">{todayChats}</p>
                <p className="text-[10px] text-white/70 font-medium">Conversations</p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Zap size={14} className="text-white" />
                  <span className="text-[10px] font-bold text-white/80 uppercase tracking-[0.16em]">Total</span>
                </div>
                <p className="text-2xl font-black text-white">{totalMessages}</p>
                <p className="text-[10px] text-white/70 font-medium">Messages</p>
              </div>
            </div>
          </div>

          <button onClick={function() { setPage("chat") }} className="w-full bg-white dark:bg-gray-900 border border-sky-100 dark:border-gray-800 shadow-sm rounded-3xl p-5 mb-6 flex items-center gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-purple-600 flex items-center justify-center shrink-0">
              <Plus size={28} className="text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-lg font-bold text-gray-900 dark:text-white">Start New Chat</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Ask me anything, I'm here to help</p>
            </div>
            <ChevronRight size={20} className="text-gray-400 dark:text-gray-500" />
          </button>

          <div className="flex items-center justify-between mb-3 px-1">
            <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.12em]">Recent Conversations</div>
            <button className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">See All</button>
          </div>

          <div className="space-y-2">
            {(data || []).map(function(conv, i) {
              return (<>
                <button key={conv.id} onClick={function() { setPage("chat") }} style={{animationDelay: (i * 80) + "ms"}} className="animate-fade-in-up w-full bg-white dark:bg-gray-900 border border-sky-100 dark:border-gray-800 shadow-sm rounded-2xl p-4 flex items-center gap-3 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                  <img src={conv.avatar} className="w-12 h-12 rounded-xl shrink-0" alt={conv.title} />
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold truncate text-gray-900 dark:text-white">{conv.title}</p>
                      {conv.unread && <div className="w-2 h-2 rounded-full bg-sky-500 shrink-0 ml-2"></div>}
                    </div>
                    <p className="text-xs truncate text-gray-400 dark:text-gray-500 mt-0.5">{conv.preview}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mt-1">{conv.time}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-400 dark:text-gray-500 shrink-0" />
                </button>
              </>);
            })}
          </div>

          <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.12em] mt-6 mb-3 px-1">Quick Prompts</div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={function() { setPage("chat") }} className="bg-white dark:bg-gray-900 border border-sky-100 dark:border-gray-800 shadow-sm rounded-2xl p-4 text-left hover:shadow-lg hover:-translate-y-0.5 transition-all">
              <div className="text-2xl mb-2">🍳</div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">Recipe Ideas</p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">Quick dinner suggestions</p>
            </button>
            <button onClick={function() { setPage("chat") }} className="bg-white dark:bg-gray-900 border border-sky-100 dark:border-gray-800 shadow-sm rounded-2xl p-4 text-left hover:shadow-lg hover:-translate-y-0.5 transition-all">
              <div className="text-2xl mb-2">💻</div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">Code Help</p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">Debug or learn</p>
            </button>
            <button onClick={function() { setPage("chat") }} className="bg-white dark:bg-gray-900 border border-sky-100 dark:border-gray-800 shadow-sm rounded-2xl p-4 text-left hover:shadow-lg hover:-translate-y-0.5 transition-all">
              <div className="text-2xl mb-2">🏖️</div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">Travel Tips</p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">Plan your next trip</p>
            </button>
            <button onClick={function() { setPage("chat") }} className="bg-white dark:bg-gray-900 border border-sky-100 dark:border-gray-800 shadow-sm rounded-2xl p-4 text-left hover:shadow-lg hover:-translate-y-0.5 transition-all">
              <div className="text-2xl mb-2">📚</div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">Book Picks</p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">Find your next read</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatPage({setPage, data, setData}) {
  var ms = useZapplyDB("messages", SEED_MESSAGES);
  var messages = ms[0]; var setMessages = ms[1];
  var is = React.useState("");
  var input = is[0]; var setInput = is[1];
  var ts = React.useState(false);
  var typing = ts[0]; var setTyping = ts[1];
  var scrollRef = React.useRef(null);

  React.useEffect(function() {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  async function sendMessage() {
    var text = (input || "").trim();
    if (!text || typing) return;
    var userMsg = { id: Date.now(), role: "user", text: text, time: "Now" };
    var nextMessages = (messages || []).concat([userMsg]);
    setMessages(nextMessages);
    setInput("");
    setTyping(true);
    try {
      var response = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.slice(-20).map(function(m) {
            return { role: m.role === "ai" ? "model" : "user", text: m.text };
          })
        })
      });
      var data = await response.json();
      if (!response.ok) throw new Error(data && data.error ? data.error : "Unable to get a response.");
      var aiText = data.text || "Sorry, I couldn't generate a response.";
      setMessages(function(current) {
        return (current || []).concat([{ id: Date.now() + 1, role: "ai", text: aiText, time: "Now" }]);
      });
    } catch (error) {
      setMessages(function(current) {
        return (current || []).concat([{ id: Date.now() + 1, role: "ai", text: "Sorry, Nova AI could not connect right now. Please try again.", time: "Now" }]);
      });
    } finally {
      setTyping(false);
    }
  }

  function quickAsk(text) {
    setInput(text);
    setTimeout(function() {
      var inputEvent = { target: { value: text } };
      void inputEvent;
      // Send the quick prompt directly so React state timing cannot drop it.
      (async function() {
        var userMsg = { id: Date.now(), role: "user", text: text, time: "Now" };
        var nextMessages = (messages || []).concat([userMsg]);
        setMessages(nextMessages);
        setTyping(true);
        try {
          var response = await fetch("/.netlify/functions/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: nextMessages.slice(-20).map(function(m) { return { role: m.role === "ai" ? "model" : "user", text: m.text }; }) }) });
          var data = await response.json();
          if (!response.ok) throw new Error(data && data.error ? data.error : "Unable to get a response.");
          setMessages(function(current) { return (current || []).concat([{ id: Date.now() + 1, role: "ai", text: data.text || "Sorry, I couldn't generate a response.", time: "Now" }]); });
        } catch (error) {
          setMessages(function(current) { return (current || []).concat([{ id: Date.now() + 1, role: "ai", text: "Sorry, Nova AI could not connect right now. Please try again.", time: "Now" }]); });
        } finally { setTyping(false); }
      })();
    }, 0);
  }

  function clearChat() {
    var welcomeMsg = { id: Date.now(), role: "ai", text: "Hello! 👋 I'm Nova AI, your intelligent assistant. I can help with recipes, coding, math, travel tips, book recommendations, and much more. What would you like to know today?", time: "Now" };
    setMessages([welcomeMsg]);
    toast({ title: "Chat Cleared", description: "Started a fresh conversation" });
  }

  return (<>
    <div className="min-h-screen flex flex-col">
      <div className="px-5 pt-6 pb-32">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={function() { setPage("home") }} className="w-10 h-10 rounded-full bg-white dark:bg-gray-900 border border-sky-100 dark:border-gray-800 shadow-sm flex items-center justify-center hover:scale-105 transition-all">
              <ChevronLeft size={18} className="text-gray-700 dark:text-gray-300" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Nova AI</h2>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Online</span>
              </div>
            </div>
          </div>
          <button onClick={clearChat} className="w-10 h-10 rounded-full bg-white dark:bg-gray-900 border border-sky-100 dark:border-gray-800 shadow-sm flex items-center justify-center hover:scale-105 transition-all">
            <RefreshCw size={16} className="text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        <div ref={scrollRef} className="space-y-4 mb-4 overflow-y-auto" style={{maxHeight: "calc(100vh - 280px)"}}>
          {(messages || []).map(function(msg, i) {
            var isUser = msg.role === "user";
            return (<>
              <div key={msg.id} style={{animationDelay: (i * 50) + "ms"}} className={"animate-fade-in-up flex gap-2 " + (isUser ? "justify-end" : "justify-start")}>
                {!isUser && <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-purple-600 flex items-center justify-center shrink-0"><MessageCircle size={16} className="text-white" /></div>}
                <div className={"max-w-[78%] " + (isUser ? "items-end" : "items-start")}>
                  <div className={"px-4 py-3 rounded-2xl whitespace-pre-line " + (isUser ? "bg-sky-600 shadow-md shadow-sky-500/20 text-white rounded-br-md" : "bg-white dark:bg-gray-900 border border-sky-100 dark:border-gray-800 shadow-sm text-gray-900 dark:text-white rounded-bl-md")}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                  <p className={"text-[10px] font-semibold uppercase tracking-wider mt-1 px-1 " + (isUser ? "text-right text-gray-400 dark:text-gray-500" : "text-gray-400 dark:text-gray-500")}>{msg.time}</p>
                </div>
                {isUser && <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav" className="w-9 h-9 rounded-full shrink-0" alt="You" />}
              </div>
            </>);
          })}
          {typing && (
            <div className="flex gap-2 justify-start">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-purple-600 flex items-center justify-center shrink-0"><MessageCircle size={16} className="text-white" /></div>
              <div className="bg-white dark:bg-gray-900 border border-sky-100 dark:border-gray-800 shadow-sm px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{animationDelay: "0ms"}}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{animationDelay: "150ms"}}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{animationDelay: "300ms"}}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {(messages || []).length <= 2 && (
          <div className="mb-4">
            <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.12em] mb-2 px-1">Try asking</div>
            <div className="flex flex-wrap gap-2">
              {["Suggest a dinner recipe 🍳", "Help me with math 📐", "Travel tips for Goa 🏖️", "Workout at home 💪", "Tell me a joke 😄"].map(function(q, i) {
                return (<>
                  <button key={i} onClick={function() { quickAsk(q) }} className="bg-white dark:bg-gray-900 border border-sky-100 dark:border-gray-800 shadow-sm text-gray-700 dark:text-gray-300 rounded-full px-3.5 py-2 text-xs font-medium hover:bg-sky-50 dark:hover:bg-gray-800 transition-all">
                    {q}
                  </button>
                </>);
              })}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-20 left-0 right-0 px-5 pb-2">
        <div className="bg-white dark:bg-gray-900 border border-sky-100 dark:border-gray-800 shadow-lg rounded-2xl p-2 flex items-end gap-2">
          <button className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center shrink-0 hover:bg-sky-500/20 transition-all">
            <Plus size={20} className="text-sky-600 dark:text-sky-400" />
          </button>
          <textarea
            value={input}
            onChange={function(e) { setInput(e.target.value) }}
            onKeyDown={function(e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            placeholder="Type your message..."
            rows={1}
            className="flex-1 px-3 py-2.5 bg-transparent outline-none resize-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          <button onClick={sendMessage} disabled={!input.trim()} className={"w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all " + (input.trim() ? "bg-sky-600 shadow-md shadow-sky-500/20 text-white hover:scale-105" : "bg-gray-200 dark:bg-gray-800 text-gray-400")}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  </>);
}

function ExplorePage({setPage, data}) {
  var ss = React.useState("All");
  var selectedCat = ss[0]; var setSelectedCat = ss[1];

  var categories = [
    { id: "All", label: "All Topics", icon: <Layers size={16} />, color: "from-sky-500 to-purple-600" },
    { id: "Recipes", label: "Recipes", icon: <Coffee size={16} />, color: "from-orange-500 to-red-500" },
    { id: "Coding", label: "Coding", icon: <Zap size={16} />, color: "from-blue-500 to-cyan-500" },
    { id: "Travel", label: "Travel", icon: <MapPin size={16} />, color: "from-emerald-500 to-teal-500" },
    { id: "Fitness", label: "Fitness", icon: <Activity size={16} />, color: "from-pink-500 to-rose-500" },
    { id: "Learning", label: "Learning", icon: <Award size={16} />, color: "from-violet-500 to-purple-500" },
    { id: "Fun", label: "Fun & Jokes", icon: <Smile size={16} />, color: "from-amber-500 to-yellow-500" }
  ];

  var promptSuggestions = {
    All: [
      { title: "Quick dinner ideas", desc: "30-minute recipes with pantry staples", emoji: "🍳", count: "24 prompts" },
      { title: "JavaScript tips", desc: "ES6+ features and best practices", emoji: "💻", count: "18 prompts" },
      { title: "Mumbai travel guide", desc: "Best spots, food, and culture", emoji: "🏙️", count: "12 prompts" },
      { title: "Morning workout", desc: "15-minute energizing routines", emoji: "💪", count: "9 prompts" }
    ],
    Recipes: [
      { title: "Paneer Butter Masala", desc: "Creamy, restaurant-style curry", emoji: "🧈", count: "8 prompts" },
      { title: "Masala Chai", desc: "Perfect Indian tea at home", emoji: "☕", count: "6 prompts" },
      { title: "Veg Biryani", desc: "Aromatic one-pot rice dish", emoji: "🍚", count: "10 prompts" }
    ],
    Coding: [
      { title: "React Hooks guide", desc: "React.useState, React.useEffect, custom hooks", emoji: "⚛️", count: "15 prompts" },
      { title: "Python basics", desc: "Start your coding journey", emoji: "🐍", count: "20 prompts" },
      { title: "CSS animations", desc: "Smooth transitions and effects", emoji: "✨", count: "11 prompts" }
    ],
    Travel: [
      { title: "Goa beach guide", desc: "North vs South Goa, best time", emoji: "🏖️", count: "14 prompts" },
      { title: "Manali in winter", desc: "Snow, adventure, and stays", emoji: "❄️", count: "8 prompts" },
      { title: "Kerala backwaters", desc: "Houseboat and serenity", emoji: "🛶", count: "7 prompts" }
    ],
    Fitness: [
      { title: "Home workout plan", desc: "No equipment, full body", emoji: "🏋️", count: "12 prompts" },
      { title: "Yoga for beginners", desc: "Basic poses and breathing", emoji: "🧘", count: "9 prompts" },
      { title: "Daily 7-minute routine", desc: "Quick and effective", emoji: "⏱️", count: "6 prompts" }
    ],
    Learning: [
      { title: "Math made easy", desc: "Algebra to calculus basics", emoji: "📐", count: "16 prompts" },
      { title: "History of India", desc: "Key events and figures", emoji: "📜", count: "11 prompts" },
      { title: "English grammar", desc: "Tenses, articles, and more", emoji: "📝", count: "13 prompts" }
    ],
    Fun: [
      { title: "Tell me a joke", desc: "Hindi-English puns", emoji: "😄", count: "30 prompts" },
      { title: "Fun facts", desc: "Surprising trivia daily", emoji: "🤔", count: "25 prompts" },
      { title: "Riddles for kids", desc: "Brain-teasing puzzles", emoji: "🧩", count: "18 prompts" }
    ]
  };

  var currentPrompts = promptSuggestions[selectedCat] || promptSuggestions.All;

  return (<>
    <div className="min-h-screen">
      <div key={page} className="animate-fade-in px-5 pt-6 pb-24">
        <div className="mb-5">
          <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">Explore Prompts</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Discover conversation starters and ideas</p>
        </div>

        <div className="flex gap-2 mb-5 overflow-x-auto pb-2 -mx-1 px-1">
          {categories.map(function(cat) {
            var active = selectedCat === cat.id;
            return (<>
              <button key={cat.id} onClick={function() { setSelectedCat(cat.id) }} className={"flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all " + (active ? "bg-sky-600 shadow-md shadow-sky-500/20 text-white" : "bg-white dark:bg-gray-900 border border-sky-100 dark:border-gray-800 shadow-sm text-gray-700 dark:text-gray-300")}>
                {cat.icon}{cat.label}
              </button>
            </>);
          })}
        </div>

        <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.12em] mb-3 px-1">
          {selectedCat === "All" ? "Popular Prompts" : selectedCat + " Prompts"}
        </div>

        <div className="space-y-2 mb-6">
          {(currentPrompts || []).map(function(p, i) {
            return (<>
              <button key={i} onClick={function() { setPage("chat") }} style={{animationDelay: (i * 80) + "ms"}} className="animate-fade-in-up w-full bg-white dark:bg-gray-900 border border-sky-100 dark:border-gray-800 shadow-sm rounded-2xl p-4 flex items-center gap-3 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-left">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500/20 to-purple-500/20 flex items-center justify-center shrink-0 text-2xl">
                  {p.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{p.title}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">{p.desc}</p>
                </div>
                <div className="shrink-0">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400 bg-sky-500/10 px-2 py-1 rounded-full">{p.count}</span>
                </div>
              </button>
            </>);
          })}
        </div>

        <div className="bg-gradient-to-br from-sky-500 to-purple-600 rounded-3xl p-5 shadow-lg shadow-sky-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={16} className="text-white" />
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">AI Tip</span>
          </div>
          <p className="text-base font-bold text-white leading-tight">Be specific in your questions for better answers!</p>
          <p className="text-xs text-white/80 mt-2 leading-relaxed">Instead of "tell me about food", try "suggest a quick vegetarian dinner recipe with paneer".</p>
        </div>
      </div>
    </div>
  </>);
}

function ProfilePage({setPage, darkMode, setDarkMode}) {
  var userName = "Aarav Sharma";
  var email = "aarav.sharma@gmail.com";
  var initials = "AS";
  var totalChats = 247;
  var aiScore = 94;
  var streak = 18;
  var memberSince = "Jan 2026";

  var settingsRows = [
    { icon: <Bell size={18} />, title: "Notifications", subtitle: "Push, email, daily digest", value: "On", action: "toggle" },
    { icon: <Moon size={18} />, title: "Dark Mode", subtitle: "Switch app appearance", value: darkMode ? "On" : "Off", action: "toggleDark" },
    { icon: <Globe size={18} />, title: "Language", subtitle: "Response language", value: "English", action: "chevron" },
    { icon: <Shield size={18} />, title: "Privacy & Data", subtitle: "Manage your data", value: "", action: "chevron" },
    { icon: <HelpCircle size={18} />, title: "Help & Support", subtitle: "FAQs and contact us", value: "", action: "chevron" },
    { icon: <Info size={18} />, title: "About Nova AI", subtitle: "Version 2.4.1", value: "", action: "chevron" }
  ];

  return (<>
    <div className="min-h-screen">
      <div key={page} className="animate-fade-in px-5 pt-6 pb-24">
        <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white mb-5">Profile</h1>

        <div className="bg-gradient-to-br from-sky-500 via-sky-600 to-purple-600 rounded-3xl p-5 mb-5 shadow-lg shadow-sky-500/30">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-black text-white shrink-0 border-2 border-white/30">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-black text-white truncate">{userName}</h2>
              <p className="text-sm text-white/80 truncate">{email}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <Award size={12} className="text-white" />
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Pro Member</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-sky-100 dark:border-gray-800 shadow-sm rounded-3xl p-5 mb-5">
          <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.12em] mb-4">Your Stats</div>
          <div className="grid grid-cols-3 divide-x divide-sky-100 dark:divide-gray-800">
            <div className="flex flex-col  gap-1 px-2">
              <MessageCircle size={18} className="text-sky-600 dark:text-sky-400 mb-1" />
              <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{totalChats}</p>
              <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Chats</p>
            </div>
            <div className="flex flex-col  gap-1 px-2">
              <Zap size={18} className="text-sky-600 dark:text-sky-400 mb-1" />
              <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{aiScore}%</p>
              <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">AI Score</p>
            </div>
            <div className="flex flex-col  gap-1 px-2">
              <Target size={18} className="text-sky-600 dark:text-sky-400 mb-1" />
              <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{streak}</p>
              <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Day Streak</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-sky-100 dark:border-gray-800 shadow-sm rounded-3xl overflow-hidden mb-5">
          <div className="px-5 py-3 border-b border-sky-100 dark:border-gray-800">
            <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.12em]">Settings</div>
          </div>
          {(settingsRows || []).map(function(row, i) {
            var isLast = i === settingsRows.length - 1;
            return (<>
              <div key={i} className={"flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer " + (isLast ? "" : "border-b border-sky-100 dark:border-gray-800")}>
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center shrink-0">
                  <span className="text-sky-600 dark:text-sky-400">{row.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{row.title}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{row.subtitle}</p>
                </div>
                {row.action === "toggle" && (
                  <div className="w-10 h-5 rounded-full bg-sky-500 relative shrink-0">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow"></div>
                  </div>
                )}
                {row.action === "toggleDark" && (
                  <button onClick={function() { setDarkMode(!darkMode) }} className={"w-10 h-5 rounded-full relative shrink-0 transition-all " + (darkMode ? "bg-sky-500" : "bg-gray-300 dark:bg-gray-700")}>
                    <div className={"absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all " + (darkMode ? "right-0.5" : "left-0.5")}></div>
                  </button>
                )}
                {row.action === "chevron" && (
                  <div className="flex items-center gap-2 shrink-0">
                    {row.value && <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{row.value}</span>}
                    <ChevronRight size={16} className="text-gray-400 dark:text-gray-500" />
                  </div>
                )}
              </div>
            </>);
          })}
        </div>

        <button onClick={function() { toast({ title: "Signed Out", description: "You have been logged out successfully" }) }} className="w-full bg-white dark:bg-gray-900 border border-red-200 dark:border-red-900 shadow-sm rounded-2xl p-4 flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all">
          <LogOut size={18} />
          <span className="font-semibold text-sm">Sign Out</span>
        </button>

        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500 mt-4">Member since {memberSince}</p>
      </div>
    </div>
  </>);
}

function BottomNav({page, setPage}) {
  var tabs = [
    { page: "home", icon: <Home size={20} />, label: "Home" },
    { page: "chat", icon: <MessageCircle size={20} />, label: "Chat" },
    { page: "explore", icon: <Layers size={20} />, label: "Explore" },
    { page: "profile", icon: <User size={20} />, label: "Profile" }
  ];
  return (<>
    <div className="bg-white dark:bg-gray-900 border-t border-sky-100 dark:border-gray-800 shadow-sm fixed bottom-0 left-0 right-0 flex justify-around py-2 z-50">
      {tabs.map(function(tab, i) {
        var active = page === tab.page;
        return (<>
          <button key={i} onClick={function() { setPage(tab.page) }} className={"flex flex-col  gap-1 px-4 py-1 transition-all duration-200 " + (active ? "text-sky-600 dark:text-sky-400" : "text-gray-400 dark:text-gray-500")}>
            {tab.icon}
            <span className="text-[10px] font-medium">{tab.label}</span>
            {active && <div className="w-1 h-1 rounded-full bg-sky-500"></div>}
          </button>
        </>);
      })}
    </div>
  </>);
}

function App() {
  var ps = React.useState("splash");
  var page = ps[0]; var setPage = ps[1];
  var dm = useZapplyDB("novaDarkMode", false);
  var darkMode = dm[0]; var setDarkMode = dm[1];
  var ds = useZapplyDB("novaConversations", SEED_CONVERSATIONS);
  var data = ds[0]; var setData = ds[1];

  return (<>
    <div className={(darkMode ? "dark " : "") + "min-h-screen bg-sky-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300"}>
      {page === "splash" && <SplashScreen onFinish={function() { setPage("home") }} />}
      {page === "home" && <HomePage setPage={setPage} data={data} setData={setData} darkMode={darkMode} setDarkMode={setDarkMode} />}
      {page === "chat" && <ChatPage setPage={setPage} data={data} setData={setData} />}
      {page === "explore" && <ExplorePage setPage={setPage} data={data} />}
      {page === "profile" && <ProfilePage setPage={setPage} darkMode={darkMode} setDarkMode={setDarkMode} />}
      {page !== "splash" && <BottomNav page={page} setPage={setPage} />}
      <Toaster />
    </div>
  </>);
}

export default App;
