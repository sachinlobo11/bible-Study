import React from 'react'
import QuizWrapper from './QuizWrapper.jsx'
import { loadAllQuizzes } from './loadAllQuizzes.js'
import { useEffect, useState } from "react";

import { createClient } from "@supabase/supabase-js";
import ReactMarkdown from "react-markdown";
import SignInButton from './SignInButton'
import { useRef } from "react";
import rehypeRaw from "rehype-raw";
import { motion } from "framer-motion";
import { FaYoutube, FaFacebook } from "react-icons/fa"; 
import remarkGfm from "remark-gfm";


// Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);





function cx(...classes) { return classes.filter(Boolean).join(' ') }

function rankFromXP(xp) {
  if (xp >= 200) return { level: 3, title: 'Shepherd', min: 200, nextAt: null }
  if (xp >= 100) return { level: 2, title: 'Teacher', min: 100, nextAt: 200 }
  return { level: 1, title: 'Disciple', min: 0, nextAt: 100 }
}

function useXP() {
  const [xp, setXP] = React.useState(() => Number(localStorage.getItem('xp') || 0))
  React.useEffect(() => localStorage.setItem('xp', String(xp)), [xp])
  return [xp, setXP]
}

function useTheme() {
  const [dark, setDark] = React.useState(() => document.documentElement.classList.contains('dark'))
  React.useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])
  return [dark, setDark]
}

function nextTuesday530() {
  const now = new Date()
  const target = new Date(now)
  const day = now.getDay() // 0 Sun ... 6 Sat
  const daysUntilTue = (2 - day + 7) % 7 || 7 // next Tuesday (not today)
  target.setDate(now.getDate() + daysUntilTue)
  target.setHours(5, 30, 0, 0)
  return target
}

function useCountdown(targetDate,aiMode) {
  const [remaining, setRemaining] = React.useState(() => Math.max(0, targetDate - new Date()))
  React.useEffect(() => {
    
      const id = setInterval(() => setRemaining(Math.max(0, targetDate - new Date())), 180000)
    return () => clearInterval(id)
    
    
  }, [targetDate])
  const s = Math.floor(remaining / 1000)
  const days = Math.floor(s / 86400)
  const hours = Math.floor((s % 86400) / 3600)
  const mins = Math.floor((s % 3600) / 60)
  const secs = s % 60
  return { days, hours, mins, secs }
}

const studies = [
  {
    id: 1,
    title: 'Fruit of the Spirit — Love',
    duration: '12:34',
    verses: 'Galatians 5:22–23',
    thumb: 'https://images.unsplash.com/photo-1527904219733-fddc7493790e?q=80&w=1200&auto=format&fit=crop',
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    notes: `# Love

**Key idea:** Love is the root from which other fruit grows.

- Read: Galatians 5:22–23
- Pray: John 15:9–12





> Practice love in action this week.`
  },
  {
    id: 2,
    title: 'Prayer that Abides',
    duration: '18:20',
    verses: 'John 15:1–11',
    thumb: 'https://images.unsplash.com/photo-1504051771394-dd2e66b2e08f?q=80&w=1200&auto=format&fit=crop',
    video: 'https://www.youtube.com/embed/ysz5S6PUM-U',
    notes: `# Abide in Jesus

Remaining in the Vine produces lasting fruit.

- **Observe:** What is pruned?
- **Apply:** Where do you need pruning?`
  },
  {
    id: 3,
    title: 'Joy in Trials',
    duration: '09:45',
    verses: 'James 1:2–4',
    thumb: 'https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?q=80&w=1200&auto=format&fit=crop',
    video: 'https://www.youtube.com/embed/oHg5SJYRHA0',
    notes: `# Joy

Consider it pure joy... (Jas 1:2–4).

- Trials refine faith.
- Joy is anchored in Christ.`
  },
]

function Markdown({ text }) {
  const html = React.useMemo(() => {
    let t = text || ''
    t = t.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^\* \*\*(.*?)\*\*/gim, '<li><strong>$1</strong></li>')
      .replace(/^---$/gm, '<hr class="my-4 border-white/20"/>')
      .replace(/^\* \*\*(.*?)\*\*/gim, '<li><strong>$1</strong></li>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="px-1 py-0.5 rounded bg-white/10">$1</code>')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-white/20 pl-3 my-2 italic">$1</blockquote>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a class="underline" href="$2" target="_blank" rel="noreferrer">$1</a>')
      .replace(/\n/g, '<br/>')
    return t
  }, [text])
  return <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
}
function SkeletonCard() {
  return (
    <article className="glass rounded-2xl overflow-hidden">
      <div className="relative">
        {/* Thumbnail placeholder */}
        <div className="h-40 w-full shimmer" />
        {/* Duration tag */}
        <div className="absolute top-2 right-2 h-5 w-10 shimmer rounded-lg" />
      </div>
      <div className="p-4 space-y-2">
        <div className="h-5 w-2/3 shimmer rounded" />
        <div className="h-4 w-1/2 shimmer rounded" />
        <div className="mt-3 flex gap-2">
          <div className="h-8 w-16 shimmer rounded-xl" />
          <div className="h-8 w-20 shimmer rounded-xl" />
        </div>
      </div>
    </article>
  );
}

// Animated gradient border
// Animated multi-color border for cells
function AnimatedBorder({ children }) {
  return (
    <div className="relative p-0.5 rounded border-2 border-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 animate-gradient-x overflow-hidden">
      <div className="bg-zinc-900 rounded h-full w-full p-2">{children || "\u00A0"}</div>
      <style>{`
        @keyframes gradient-x {
          0% { background-position: 0% }
          50% { background-position: 100% }
          100% { background-position: 0% }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s linear infinite;
        }
      `}</style>
    </div>
  );
}

export function MarkdownTable({ markdown }) {
  const rowIndex = useRef(0);

  return (
    <div className="bg-zinc-900 p-4 rounded-xl max-w-2xl w-full text-left prose prose-invert overflow-auto">
     
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        table({ children }) {
          rowIndex.current = 0;
          return <table className="w-full border-collapse">{children}</table>;
        },
        tr({ children }) {
          const index = rowIndex.current++;
          return (
            <motion.tr
              key={index}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
             // transition={{ delay: index * 0.1 }}
              className={index % 2 === 0 ? "bg-black" : "bg-gray"}
            >
              {children}
            </motion.tr>
          );
        },
        th({ children }) {
          const isEmpty =
            !children ||
            (Array.isArray(children) &&
              children.every((c) => c === null || c === "" || c === false));
          return (
            <th className="border border-white/20 px-3 py-2 font-semibold bg-gray-800 text-white">
              {isEmpty ? <TableShimmer height="1.2rem" /> : children}
            </th>
          );
        },
        td({ children }) {
          const isEmpty =
            false;
          return (
            <td className="border border-white/20 px-3 py-2 text-gray-200">
             {children}
            </td>
          );
        },
        br() {
          return <br />;
        },
      }}
    >
      {markdown}
    </ReactMarkdown>
    
    </div>
  );
}


export default function BibleStudyLMS() {
  const [query, setQuery] = React.useState('')
  const [selected, setSelected] = React.useState(null)
  const [openQuizFor, setOpenQuizFor] = React.useState(null)
  const [xp, setXP] = useXP()
  const [dark, setDark] = useTheme()
  const [studies, setStudies] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const target = React.useMemo(() => nextTuesday530(), [])
  
  const [error, setError] = useState(null);
  const filtered = studies.filter(s => {
    const q = query.toLowerCase()
    return s.title.toLowerCase().includes(q) || s.verses.toLowerCase().includes(q)
  })

  const rank = rankFromXP(xp)
  const nextXP = rank.nextAt ? Math.min(100, Math.round(((xp - rank.min) / (rank.nextAt - rank.min)) * 100)) : 100
  


  const [aiMode, setAiMode] = useState(false);
  const t = useCountdown(target);
  const [events, setEvents] = useState("");

  useEffect(() => {
    function checkHash() {
      if (window.location.hash === "#AI") {
        setAiMode(true);
        console.log("#AI")
      } else {
        setAiMode(false);
      }
    }
    checkHash()
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, []);

  // Fetch events from Supabase
  useEffect(() => {
    if (aiMode) {
      (async () => {
        const { data, error } = await supabase
          .from("anou")
          .select("content")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (error) console.error(error);
        else setEvents(data?.content || "No events found.");
      })();
    }
  }, [aiMode]);





  function addXP(earned) { setXP(x => x + earned) }
  React.useEffect(() => {
    async function fetchStudies() {
      try {
        const res = await fetch("/api/studies", {
          method: "GET", // or "POST", "PUT", etc.
          headers: {
            "Content-Type": "application/json", // Specify the content type
            "Authorization": "Bearer **********yiyi**", // Example of an authorization header
            "Access-Control-Allow-Origin": "https://bible-study-xi.vercel.app",//append,Add any custom headers if needed
          }
        });


        const data = await res.json();
        setStudies(data);
      } catch (err) {
        console.log("Error fetching studies:", err);
        setError("Could not load studies. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchStudies();
  }, []);
  //if (loading) return <p className="text-center">Loading....</p>;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-red-500 font-semibold">{error} </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600"
        >
          Retry
        </button>
      </div>
    );
  }

 // react-icons package

if (aiMode) {
  console.log("2");
  return (
    <div className="sticky inset-0 z-[9999] flex flex-col items-center justify-center 
                    bg-black text-white text-center p-6 overflow-auto">

      <h1 className="text-4xl font-bold mb-6">📢 AI Announcer</h1>

      {/* Animated border wrapper */}
      <div className="relative max-w-2xl w-full p-[2px] rounded-xl 
                      bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500
                      animate-gradient-x">

        <div className="bg-zinc-900 p-4 rounded-xl prose prose-invert">

          {/* Source badges */}
          <div className="flex gap-3 mb-4">
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
              <FaYoutube className="text-red-500 w-6 h-6" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
              <FaFacebook className="text-blue-500 w-6 h-6" />
            </a>
            {/* Add more badges here */}
          </div>

          {/* Markdown content */}
          {events ? (
            <MarkdownTable markdown={events} />
          ) : (
            <div className="w-full space-y-3 animate-pulse">
              <div className="h-5 bg-white/20 rounded w-3/4"></div>
              <div className="h-5 bg-white/20 rounded w-2/3"></div>
              <div className="h-5 bg-white/20 rounded w-5/6"></div>
              <div className="h-5 bg-white/20 rounded w-1/2"></div>
            </div>
          )}

        </div>
      </div>

      <button
        onClick={() => (window.location.hash = "")}
        className="mt-8 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30"
      >
        Back to LMS
      </button>

      {/* Animation styles */}
      <style>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 5s linear infinite;
        }
      `}</style>
    </div>
  );
}

  return (
    <div className="min-h-screen flex flex-col dark:bg-black dark:text-white overflow-x-hidden w-full">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur bg-white/50 dark:bg-black/30 border-b border-black/10 dark:border-white/10 w-full max-w-full overflow-x-hidden">
        

        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-4 w-full">
          <div className="flex items-center flex-shrink-0">
          {/* YouTube Logo */}
          <img
            src="https://yt3.googleusercontent.com/hPxsHv5S9dzTExHcvGtnqHZkLDNTr0Y3hTTTfQmm7DLcXKekC7RGJngDCnMvlNZ9aA4jy9iQSJw=s50-c-k-c0x00f00fff"
            alt="YouTube"
            className="w-10 h-10 rounded-full "
            onClick={() => window.open("https://youtube.com/@etfgrhchurch", "_blank")}
          />
        </div>
          <h1 className="text-2xl font-bold">Bible Study LMS</h1>
          <div className="ml-auto flex items-center gap-3">
            {/* Dark mode */}
            <button onClick={() => setDark(d => !d)} className="glass px-3 py-1.5 rounded-xl text-sm hover:bg-white/10" aria-label="Toggle dark mode">
              {dark ? '🌙 Dark' : '☀️ Light'}
            </button>
            {/* XP */}
            <div className="glass px-3 py-2 rounded-2xl" >
              <div className="text-xs opacity-80">Level {rank.level} • {rank.title}</div>
              <div className="mt-1 w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-xp-bar/80 animate-pulseGlow" style={{ width: `${nextXP}%` }} />
              </div>
              <div className="text-[11px] opacity-75 mt-1">XP: {xp}</div>
              <SignInButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 w-full overflow-x-hidden">

        {/* Study view */}
        {selected && (
          <section className="mt-8 grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="glass rounded-2xl sticky top-10 overflow-hidden">
                <iframe className="w-full aspect-video" src={selected.video} title={selected.title} allowFullScreen></iframe>
              </div>
              <div className="glass p-4 rounded-2xl">
                <h3 className="font-semibold text-lg">Verses</h3>
                <p className="opacity-80">{selected.verses}</p>
              </div>
            </div>
            <aside className="space-y-4">
              <div id="friday-notes" className="glass p-4 rounded-2xl">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-lg">Notes</h3>
                  <button className="px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30" onClick={() => setOpenQuizFor(selected.id)}>Take Quiz</button>
                </div>
                <div className="mt-2">
                  <Markdown text={selected.notes} />
                </div>
              </div>
              <button className="w-full px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20" onClick={() => setSelected(null)}>Close Study</button>
            </aside>
            <p></p>
          </section>


        )}





        {/* Top row: search + countdown + links */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 glass p-4 rounded-2xl">
            <label className="text-sm opacity-80">Search studies</label>
            <input
              className="mt-2 w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Search by title or verses..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          {!aiMode && (
  <div className="glass p-4 rounded-2xl">
    <div className="text-sm opacity-80">Next Tuesday 5:30 AM</div>
    <div className="mt-1 text-xl font-semibold">
      {t.days}d {t.hours}h {t.mins}m 
    </div>
    <a href="#changelog" className="block mt-3 text-sm underline opacity-90">View changelog ↓</a>
    <a href="#friday-notes" className="block mt-1 text-sm underline opacity-90">Friday Bible study notes →</a>
  </div>
)}
        </div>

        {/* Grid of studies */}
        <section className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : (filtered.map(s => (
            <article key={s.id} className="glass rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img src={s.thumbnail} alt="thumbnail" className="h-40 w-full object-cover" />
                <div className="absolute top-2 right-2 glass px-2 py-1 rounded-lg text-xs">{s.duration}</div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="text-sm opacity-80">{s.verses}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20"
                    onClick={() => {
                      setSelected(s);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Open
                  </button>

                  <button className="px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30" onClick={() => setOpenQuizFor(s.id)}>Take Quiz</button>
                </div>
              </div>
            </article>
          )))}
        </section>


        {/* Changelog */}
        <section id="changelog" className="mt-12 glass p-4 rounded-2xl">
          <h3 className="text-lg font-semibold">Changelog</h3>
          <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
            <li>[v1.0.0] Initial release with grid, study view, quiz overlay, XP & ranks.</li>
            <li>[v1.1.0] Added dark/light toggle and animated aurora quiz theme.</li>
            <li>[v1.2.0] Countdown to Tuesday 5:30 AM and motivational marquee.</li>
          </ul>
        </section>
      </main>

      {/* Quiz overlay */}
      <QuizWrapper
        studyId={openQuizFor}
        open={openQuizFor != null}
        onClose={() => setOpenQuizFor(null)}
        onEarnXP={addXP}
      />
      <footer className="mt-12 py-6 text-center border-t border-white/10 dark:border-white/5 overflow-hidden">
  <div className="relative h-14 flex items-center justify-center font-bold text-3xl bitcount-prop-double-ink tracking-wide">
    {/* Hebrew */}
    <span className="fade-slide absolute font-chokmah">חָ כְ מָ ה</span>
    {/* English */}
    <span className="fade-slide absolute delay font-chokmah">C H O K M A H</span>
  </div>

  <p className="text-sm opacity-80 mt-2">End Time Full Gospel Revival Harvester Church, Mangalore</p>
  <p className="text-xs opacity-60 mt-1">© 2025 Chokmah. All rights reserved.</p>

  <style>{`
  
    @keyframes fadeSlide {
      0%   { opacity: 0; transform: translateY(10px); }
      10%  { opacity: 1; transform: translateY(0); }
      40%  { opacity: 1; transform: translateY(0); }
      50%  { opacity: 0; transform: translateY(-10px); }
      100% { opacity: 0; transform: translateY(-10px); }
    }
    .fade-slide {
      animation: fadeSlide 6s ease-in-out infinite;
    }
    .delay {
      animation-delay: 3s;
    }
  `}</style>
</footer>

    </div>
  )
}
