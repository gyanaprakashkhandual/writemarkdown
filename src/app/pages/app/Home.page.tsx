"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Download, Share2, Eye, FileText, Package, Puzzle,
  Check, Copy, ArrowRight, Terminal, Zap, RefreshCw,
  Star, ChevronRight, Code2, Globe, Layers
} from "lucide-react";
import { FaCoffee } from "react-icons/fa";
import { useRouter } from "next/navigation";

function useInViewOnce(threshold = 0.15) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: threshold });
  return { ref, inView };
}

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInViewOnce();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInViewOnce();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const INSTALL_CMD = "npm install write-markdown";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all text-xs font-medium"
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1 text-emerald-500">
            <Check className="w-3.5 h-3.5" /> Copied
          </motion.span>
        ) : (
          <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1">
            <Copy className="w-3.5 h-3.5" /> Copy
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

const MARKDOWN_DEMO = `# Hello, World

Write **bold**, *italic*, or \`inline code\`.

## Features
- Live preview
- Syntax highlighting
- Export to PDF

> Beautiful markdown, instantly.

\`\`\`js
const md = new WriteMarkdown();
md.render("# Hello");
\`\`\``;

const RENDERED_DEMO = [
  { type: "h1", content: "Hello, World" },
  { type: "p", content: ["Write ", { bold: "bold" }, ", ", { italic: "italic" }, ", or ", { code: "inline code" }, "."] },
  { type: "h2", content: "Features" },
  { type: "ul", items: ["Live preview", "Syntax highlighting", "Export to PDF"] },
  { type: "blockquote", content: "Beautiful markdown, instantly." },
  { type: "codeblock", lang: "js", content: `const md = new WriteMarkdown();\nmd.render("# Hello");` },
];

function RenderedMarkdown() {
  return (
    <div className="font-serif text-[13.5px] text-neutral-800 dark:text-neutral-200 space-y-3 leading-relaxed">
      {RENDERED_DEMO.map((block, i) => {
        if (block.type === "h1") return <h1 key={i} className="text-xl font-bold text-neutral-900 dark:text-white font-sans tracking-tight">{block.content as string}</h1>;
        if (block.type === "h2") return <h2 key={i} className="text-base font-semibold text-neutral-900 dark:text-white font-sans tracking-tight mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-700">{block.content as string}</h2>;
        if (block.type === "p") return (
          <p key={i} className="text-neutral-700 dark:text-neutral-300">
            {(block.content as any[]).map((c, j) =>
              typeof c === "string" ? c :
              c.bold ? <strong key={j} className="font-semibold text-neutral-900 dark:text-white">{c.bold}</strong> :
              c.italic ? <em key={j} className="italic">{c.italic}</em> :
              c.code ? <code key={j} className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-mono text-[11.5px]">{c.code}</code> : null
            )}
          </p>
        );
        if (block.type === "ul") return (
          <ul key={i} className="space-y-1 ml-4">
            {(block.items as string[]).map((item, j) => (
              <li key={j} className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        );
        if (block.type === "blockquote") return (
          <blockquote key={i} className="border-l-2 border-neutral-300 dark:border-neutral-600 pl-3 text-neutral-500 dark:text-neutral-400 italic">{block.content as string}</blockquote>
        );
        if (block.type === "codeblock") return (
          <div key={i} className="rounded-lg bg-neutral-900 dark:bg-neutral-950 p-3 mt-2">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span className="ml-1 text-[10px] text-neutral-500 font-mono">{block.lang}</span>
            </div>
            <pre className="font-mono text-[11px] text-neutral-300 leading-relaxed whitespace-pre">{block.content as string}</pre>
          </div>
        );
        return null;
      })}
    </div>
  );
}

const FEATURES = [
  {
    icon: <Zap className="w-4 h-4" />,
    title: "Live Preview",
    desc: "See your markdown rendered in real-time as you type. No refresh, no delay — instant visual feedback.",
  },
  {
    icon: <Download className="w-4 h-4" />,
    title: "Export & Download",
    desc: "Save your work as .md files or export to PDF. Your content, your format.",
  },
  {
    icon: <Share2 className="w-4 h-4" />,
    title: "Share Instantly",
    desc: "Generate shareable links for your markdown files. Collaborate without friction.",
  },
  {
    icon: <RefreshCw className="w-4 h-4" />,
    title: "Sync Anywhere",
    desc: "Your files are accessible across the web editor, VS Code extension, and NPM package.",
  },
  {
    icon: <Code2 className="w-4 h-4" />,
    title: "Syntax Highlighting",
    desc: "Full code block support with language detection and beautiful syntax coloring.",
  },
  {
    icon: <Layers className="w-4 h-4" />,
    title: "Rich Formatting",
    desc: "Tables, blockquotes, task lists, footnotes — the full CommonMark spec supported.",
  },
];

const PRODUCTS = [
  {
    icon: <Package className="w-5 h-5" />,
    tag: "NPM Package",
    title: "Drop into any React project",
    desc: "Install once, render anywhere. A zero-config React component that takes raw markdown and returns beautiful HTML. Fully typed, tree-shakeable, and tiny.",
    code: `import { MarkdownRenderer } from 'write-markdown';

export default function App() {
  return (
    <MarkdownRenderer>
      # Hello World
      Write **beautiful** markdown.
    </MarkdownRenderer>
  );
}`,
    action: "View on NPM",
    href: "/package",
    badge: "v2.4.1",
  },
  {
    icon: <Puzzle className="w-5 h-5" />,
    tag: "VS Code Extension",
    title: "Preview .md files inside VS Code",
    desc: "Open any raw .md file in VS Code and get a live split-pane preview. Syntax highlighting, scroll sync, and export — all without leaving your editor.",
    code: `// Just open any .md file
// Press Cmd+Shift+P

> Write Markdown: Open Preview
> Write Markdown: Export PDF
> Write Markdown: Copy HTML`,
    action: "Install Extension",
    href: "/extension",
    badge: "4.9 ★",
  },
  {
    icon: <Globe className="w-5 h-5" />,
    tag: "Web Editor",
    title: "Write and preview in the browser",
    desc: "A full-featured online markdown editor with live preview, file management, export, sharing, and collaboration. Works offline too.",
    code: `Features:
• Live split-pane editor
• Save & manage files
• Export to PDF / HTML
• Shareable links
• Dark & light mode
• Keyboard shortcuts`,
    action: "Open Editor",
    href: "/",
    badge: "Free",
  },
];

const STATS = [
  { value: "12k+", label: "NPM downloads / week" },
  { value: "4.9★", label: "VS Code rating" },
  { value: "100%", label: "CommonMark spec" },
  { value: "< 3kb", label: "gzipped bundle" },
];

export default function HomePage() {
  const router = useRouter();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const [activeTab, setActiveTab] = useState(0);
  const [typedIndex, setTypedIndex] = useState(0);

  useEffect(() => {
    if (typedIndex < MARKDOWN_DEMO.length) {
      const t = setTimeout(() => setTypedIndex((i) => i + 1), 18);
      return () => clearTimeout(t);
    }
  }, [typedIndex]);

  return (
    <main className="bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white overflow-x-hidden">

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative min-h-[90vh] flex flex-col items-center justify-center px-5 pt-16 pb-24 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(0,0,0,0.04),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(255,255,255,0.05),transparent)]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-200 dark:via-neutral-800 to-transparent" />
          <svg className="absolute inset-0 w-full h-full opacity-[0.025] dark:opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-700/60 text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-8 shadow-sm"
          >
            <FaCoffee className="w-3 h-3 text-neutral-500" />
            <span>NPM · VS Code · Web Editor</span>
            <span className="w-px h-3 bg-neutral-300 dark:bg-neutral-600" />
            <span className="text-emerald-500 font-semibold">All-in-one</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(2.5rem,7vw,5rem)] font-bold tracking-[-0.03em] leading-[1.08] text-neutral-900 dark:text-white mb-6"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            Markdown, done{" "}
            <span className="relative inline-block">
              beautifully
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-1 left-0 right-0 h-[3px] bg-neutral-900 dark:bg-white origin-left rounded-full"
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
            className="text-[clamp(1rem,2.5vw,1.2rem)] text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            One ecosystem — an NPM package for React apps, a VS Code extension for raw file preview, and a full web editor with live preview, export, and sharing.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.38, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/")}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold text-sm shadow-lg shadow-black/10 dark:shadow-white/5 hover:bg-neutral-700 dark:hover:bg-neutral-100 transition-colors"
            >
              Open Editor <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 font-mono text-sm text-neutral-700 dark:text-neutral-300 shadow-sm"
            >
              <Terminal className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span>{INSTALL_CMD}</span>
              <CopyButton text={INSTALL_CMD} />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Hero editor mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-5xl mx-auto mt-16 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-2xl shadow-black/8 dark:shadow-black/50"
        >
          <div className="flex items-center gap-2 px-4 py-3 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
            <span className="flex-1 mx-3 text-center text-xs text-neutral-400 font-medium">Write Markdown — Editor</span>
            <div className="flex items-center gap-3 text-neutral-400">
              <Eye className="w-3.5 h-3.5" />
              <Download className="w-3.5 h-3.5" />
              <Share2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 min-h-[300px] bg-white dark:bg-neutral-950">
            <div className="border-r border-neutral-200 dark:border-neutral-800 p-5">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-xs text-neutral-400 font-medium font-mono">README.md</span>
              </div>
              <pre className="font-mono text-[11.5px] text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-wrap break-words">
                {MARKDOWN_DEMO.slice(0, typedIndex)}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                  className="inline-block w-[2px] h-[13px] bg-neutral-900 dark:bg-white align-middle ml-0.5"
                />
              </pre>
            </div>
            <div className="p-5 bg-neutral-50/50 dark:bg-neutral-900/30">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-xs text-neutral-400 font-medium">Preview</span>
              </div>
              <RenderedMarkdown />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-900/30">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-neutral-200 dark:divide-neutral-800">
            {STATS.map((s, i) => (
              <FadeIn key={i} delay={i * 0.08} className="flex flex-col items-center md:px-8 text-center">
                <span className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>{s.value}</span>
                <span className="text-xs text-neutral-500 dark:text-neutral-500 mt-1 font-medium">{s.label}</span>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400 dark:text-neutral-500 mb-3">Everything you need</p>
            <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-[-0.025em] text-neutral-900 dark:text-white" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
              Built for writers and developers
            </h2>
            <p className="mt-4 text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto text-[15px] leading-relaxed">
              From quick notes to full documentation — Write Markdown has every feature to make your workflow seamless.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <FadeUp key={i} delay={i * 0.07}>
                <motion.div
                  whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(0,0,0,0.06)" }}
                  transition={{ duration: 0.22 }}
                  className="group p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/60 bg-white dark:bg-neutral-900/40 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors h-full"
                >
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300 mb-4 group-hover:bg-neutral-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-neutral-900 transition-colors">
                    {f.icon}
                  </div>
                  <h3 className="text-[14.5px] font-semibold text-neutral-900 dark:text-white mb-2 tracking-tight">{f.title}</h3>
                  <p className="text-[13.5px] text-neutral-500 dark:text-neutral-400 leading-relaxed">{f.desc}</p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Products ── */}
      <section className="py-24 px-5 sm:px-8 bg-neutral-50/60 dark:bg-neutral-900/20 border-y border-neutral-100 dark:border-neutral-800/50">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400 dark:text-neutral-500 mb-3">Three ways to use it</p>
            <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-[-0.025em] text-neutral-900 dark:text-white" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
              Pick your workflow
            </h2>
            <p className="mt-4 text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto text-[15px] leading-relaxed">
              One unified markdown ecosystem — in your browser, your React app, or VS Code.
            </p>
          </FadeUp>

          <div className="flex flex-col sm:flex-row gap-1.5 bg-neutral-100 dark:bg-neutral-900 rounded-xl p-1.5 mb-8 max-w-md mx-auto">
            {PRODUCTS.map((p, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                  activeTab === i
                    ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm"
                    : "text-neutral-500 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                }`}
              >
                {p.icon}
                <span className="hidden sm:inline">{p.tag.split(" ")[0]}</span>
                <span className="sm:hidden">{p.tag.split(" ")[0]}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {PRODUCTS.map((product, i) =>
              activeTab === i ? (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="grid md:grid-cols-2 gap-6 items-start"
                >
                  <div className="flex flex-col justify-center py-4">
                    <div className="flex items-center gap-2 mb-5">
                      <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                        {product.icon}
                      </span>
                      <div>
                        <span className="text-[10.5px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">{product.tag}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-medium text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 px-2 py-0.5 rounded-full">{product.badge}</span>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mb-3" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>{product.title}</h3>
                    <p className="text-[14px] text-neutral-500 dark:text-neutral-400 leading-relaxed mb-6">{product.desc}</p>
                    <motion.button
                      whileHover={{ x: 3 }}
                      onClick={() => router.push(product.href)}
                      className="self-start flex items-center gap-1.5 text-sm font-semibold text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                    >
                      {product.action} <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                  <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-lg shadow-black/5 dark:shadow-black/30 bg-white dark:bg-neutral-950">
                    <div className="flex items-center gap-1.5 px-4 py-3 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                      <span className="ml-2 text-[11px] text-neutral-400 font-mono">{product.tag}</span>
                    </div>
                    <pre className="p-5 font-mono text-[12px] text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre overflow-x-auto">
                      <code>{product.code}</code>
                    </pre>
                  </div>
                </motion.div>
              ) : null
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400 dark:text-neutral-500 mb-3">Simple workflow</p>
            <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-[-0.025em] text-neutral-900 dark:text-white" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
              Up and running in seconds
            </h2>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-8 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800" />
            {[
              { step: "01", icon: <Terminal className="w-4 h-4" />, title: "Install or Open", desc: "Install the NPM package, grab the VS Code extension from the marketplace, or open the web editor in your browser." },
              { step: "02", icon: <FileText className="w-4 h-4" />, title: "Write Markdown", desc: "Start typing your markdown with full syntax support — headings, tables, code blocks, and more." },
              { step: "03", icon: <Share2 className="w-4 h-4" />, title: "Export & Share", desc: "Download as .md, export as PDF, or generate a shareable link. Your content, delivered anywhere." },
            ].map((step, i) => (
              <FadeUp key={i} delay={i * 0.12}>
                <div className="flex flex-col items-center text-center p-6 relative">
                  <div className="w-14 h-14 rounded-2xl bg-neutral-900 dark:bg-white flex items-center justify-center text-white dark:text-neutral-900 mb-4 shadow-lg shadow-black/10 dark:shadow-white/5 z-10 relative">
                    {step.icon}
                  </div>
                  <span className="text-[11px] font-bold text-neutral-300 dark:text-neutral-700 mb-2 tracking-widest font-mono">{step.step}</span>
                  <h3 className="text-[15px] font-semibold text-neutral-900 dark:text-white mb-2 tracking-tight">{step.title}</h3>
                  <p className="text-[13.5px] text-neutral-500 dark:text-neutral-400 leading-relaxed">{step.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 px-5 sm:px-8 bg-neutral-50/60 dark:bg-neutral-900/20 border-y border-neutral-100 dark:border-neutral-800/50">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400 dark:text-neutral-500 mb-3">Loved by developers</p>
            <h2 className="text-[clamp(1.6rem,3.5vw,2.4rem)] font-bold tracking-[-0.025em] text-neutral-900 dark:text-white" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
              What people are saying
            </h2>
          </FadeUp>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { quote: "Write Markdown is the cleanest markdown tool I've used. The live preview is buttery smooth and the VS Code extension is a must-have.", name: "Sarah K.", role: "Frontend Developer" },
              { quote: "Dropped the NPM package into our docs site in 5 minutes. Tiny bundle, perfect output. Zero config needed.", name: "Marcus T.", role: "Full-stack Engineer" },
              { quote: "I write all my READMEs in the web editor now. The sharing feature alone saves me so much time.", name: "Priya M.", role: "Open Source Maintainer" },
            ].map((t, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/60 bg-white dark:bg-neutral-900/40 flex flex-col gap-4 h-full">
                  <div className="flex gap-0.5">
                    {Array(5).fill(0).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-neutral-900 dark:fill-white text-neutral-900 dark:text-white" />
                    ))}
                  </div>
                  <p className="text-[13.5px] text-neutral-600 dark:text-neutral-400 leading-relaxed flex-1">"{t.quote}"</p>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-[12px] font-bold text-neutral-600 dark:text-neutral-300">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-[12.5px] font-semibold text-neutral-900 dark:text-white">{t.name}</p>
                      <p className="text-[11.5px] text-neutral-400 dark:text-neutral-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 px-5 sm:px-8 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(0,0,0,0.03),transparent)] dark:bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(255,255,255,0.04),transparent)]" />
        </div>
        <div className="max-w-2xl mx-auto text-center">
          <FadeUp>
            <div className="flex justify-center mb-6">
              <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xl shadow-black/10 dark:shadow-white/5">
                <FaCoffee className="w-6 h-6" />
              </span>
            </div>
            <h2 className="text-[clamp(2rem,5vw,3.2rem)] font-bold tracking-[-0.03em] text-neutral-900 dark:text-white mb-4" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
              Start writing better markdown today
            </h2>
            <p className="text-[15px] text-neutral-500 dark:text-neutral-400 mb-10 leading-relaxed">
              Free forever. No sign-up required. Open the editor and start writing in seconds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/")}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold text-sm shadow-lg shadow-black/10 dark:shadow-white/5 hover:bg-neutral-700 dark:hover:bg-neutral-100 transition-colors w-full sm:w-auto justify-center"
              >
                Open Editor — it's free <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/docs")}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors w-full sm:w-auto justify-center"
              >
                Read the docs
              </motion.button>
            </div>
            <p className="mt-6 text-[12px] text-neutral-400 dark:text-neutral-600">
              Also available as an{" "}
              <button onClick={() => router.push("/package")} className="underline underline-offset-2 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors">NPM package</button>
              {" "}and a{" "}
              <button onClick={() => router.push("/extension")} className="underline underline-offset-2 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors">VS Code extension</button>
            </p>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}