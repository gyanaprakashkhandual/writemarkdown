"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Copy, Check, Download, Maximize2, X, FileText } from "lucide-react";
import { MarkdownStore } from "../../lib/usemarkdown.store";

interface PreviewProps {
  store: MarkdownStore;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderMarkdown(md: string): string {
  let html = md;

  // Code blocks (fenced)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const langLabel = lang ? `<span class="code-lang">${escapeHtml(lang)}</span>` : "";
    return `<pre class="code-block"><div class="code-header">${langLabel}<div class="code-dots"><span></span><span></span><span></span></div></div><code>${escapeHtml(code.trimEnd())}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code class=\"inline-code\">$1</code>");

  // Headings
  html = html.replace(/^###### (.+)$/gm, "<h6>$1</h6>");
  html = html.replace(/^##### (.+)$/gm, "<h5>$1</h5>");
  html = html.replace(/^#### (.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");

  // Tables
  html = html.replace(/^\|(.+)\|\n\|[-| :]+\|\n((?:\|.+\|\n?)*)/gm, (match, header, rows) => {
    const ths = header.split("|").filter(Boolean).map((c: string) => `<th>${c.trim()}</th>`).join("");
    const trs = rows.trim().split("\n").map((row: string) => {
      const tds = row.split("|").filter(Boolean).map((c: string) => `<td>${c.trim()}</td>`).join("");
      return `<tr>${tds}</tr>`;
    }).join("");
    return `<table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`;
  });

  // Horizontal rules
  html = html.replace(/^(-{3,}|\*{3,}|_{3,})$/gm, "<hr />");

  // Unordered lists
  html = html.replace(/(^[-*+] .+(\n[-*+] .+)*)/gm, (match) => {
    const items = match.split("\n").map((l) => `<li>${l.replace(/^[-*+] /, "")}</li>`).join("");
    return `<ul>${items}</ul>`;
  });

  // Ordered lists
  html = html.replace(/(^\d+\. .+(\n\d+\. .+)*)/gm, (match) => {
    const items = match.split("\n").map((l) => `<li>${l.replace(/^\d+\. /, "")}</li>`).join("");
    return `<ol>${items}</ol>`;
  });

  // Task lists
  html = html.replace(/<li>\[x\] (.+)<\/li>/gi, "<li class=\"task-done\"><span class=\"checkbox checked\">✓</span>$1</li>");
  html = html.replace(/<li>\[ \] (.+)<\/li>/g, "<li class=\"task\"><span class=\"checkbox\"></span>$1</li>");

  // Bold + italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/~~(.+?)~~/g, "<del>$1</del>");

  // Links & images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "<img src=\"$2\" alt=\"$1\" />");
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<a href=\"$2\" target=\"_blank\" rel=\"noopener\">$1</a>");

  // Paragraphs — wrap non-tagged lines
  html = html.replace(/^(?!<[a-z]|$)(.+)$/gm, "<p>$1</p>");

  // Clean up blank lines
  html = html.replace(/\n{3,}/g, "\n\n");

  return html;
}

const PREVIEW_STYLES = `
  .md-preview {
    font-family: 'Georgia', 'Times New Roman', serif;
    font-size: 15px;
    line-height: 1.8;
    color: var(--text-color);
    max-width: 100%;
  }
  .md-preview h1, .md-preview h2, .md-preview h3,
  .md-preview h4, .md-preview h5, .md-preview h6 {
    font-family: 'Georgia', serif;
    font-weight: 700;
    line-height: 1.25;
    color: var(--heading-color);
    margin-top: 1.8em;
    margin-bottom: 0.6em;
    letter-spacing: -0.025em;
  }
  .md-preview h1 { font-size: 2em; border-bottom: 1px solid var(--border); padding-bottom: 0.3em; margin-top: 0; }
  .md-preview h2 { font-size: 1.45em; border-bottom: 1px solid var(--border); padding-bottom: 0.2em; }
  .md-preview h3 { font-size: 1.2em; }
  .md-preview h4 { font-size: 1em; }
  .md-preview p { margin: 0.85em 0; }
  .md-preview a { color: var(--link-color); text-decoration: underline; text-underline-offset: 3px; }
  .md-preview a:hover { opacity: 0.75; }
  .md-preview strong { font-weight: 700; color: var(--heading-color); }
  .md-preview em { font-style: italic; }
  .md-preview del { text-decoration: line-through; opacity: 0.5; }
  .md-preview ul, .md-preview ol { padding-left: 1.6em; margin: 0.8em 0; }
  .md-preview li { margin: 0.3em 0; }
  .md-preview li.task, .md-preview li.task-done { list-style: none; display: flex; align-items: flex-start; gap: 0.5em; margin-left: -1em; }
  .md-preview .checkbox { display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; border: 1.5px solid var(--border-strong); border-radius: 3px; margin-top: 4px; shrink: 0; font-size: 9px; }
  .md-preview .checkbox.checked { background: var(--heading-color); border-color: var(--heading-color); color: var(--bg); }
  .md-preview blockquote { border-left: 3px solid var(--border-strong); padding: 0.5em 1em; margin: 1em 0; color: var(--muted); font-style: italic; background: var(--surface); border-radius: 0 6px 6px 0; }
  .md-preview hr { border: none; border-top: 1px solid var(--border); margin: 2em 0; }
  .md-preview .inline-code { font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 0.85em; background: var(--code-bg); color: var(--code-color); padding: 0.15em 0.45em; border-radius: 4px; border: 1px solid var(--border); }
  .md-preview .code-block { background: var(--code-block-bg); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin: 1.2em 0; }
  .md-preview .code-header { display: flex; align-items: center; justify-content: space-between; padding: 8px 14px; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .md-preview .code-dots { display: flex; gap: 5px; }
  .md-preview .code-dots span { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.15); }
  .md-preview .code-lang { font-family: monospace; font-size: 11px; color: rgba(255,255,255,0.35); font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; }
  .md-preview .code-block code { display: block; font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 13px; line-height: 1.7; color: #e4e4ef; padding: 14px 16px; overflow-x: auto; white-space: pre; }
  .md-preview table { width: 100%; border-collapse: collapse; margin: 1.2em 0; font-size: 0.9em; border-radius: 8px; overflow: hidden; border: 1px solid var(--border); }
  .md-preview th { background: var(--surface); font-family: sans-serif; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); padding: 10px 14px; text-align: left; border-bottom: 1px solid var(--border); }
  .md-preview td { padding: 9px 14px; border-bottom: 1px solid var(--border); font-family: sans-serif; font-size: 13.5px; }
  .md-preview tr:last-child td { border-bottom: none; }
  .md-preview img { max-width: 100%; border-radius: 8px; margin: 0.8em 0; border: 1px solid var(--border); }
`;

function getVars(isDark: boolean) {
  if (isDark) return `
    --text-color: #d4d4d8;
    --heading-color: #fafafa;
    --muted: #71717a;
    --link-color: #a1a1aa;
    --border: rgba(255,255,255,0.08);
    --border-strong: #52525b;
    --surface: rgba(255,255,255,0.04);
    --bg: #09090b;
    --code-bg: rgba(255,255,255,0.07);
    --code-color: #d4d4d8;
    --code-block-bg: #18181b;
  `;
  return `
    --text-color: #374151;
    --heading-color: #111827;
    --muted: #6b7280;
    --link-color: #374151;
    --border: rgba(0,0,0,0.08);
    --border-strong: #d1d5db;
    --surface: rgba(0,0,0,0.025);
    --bg: #ffffff;
    --code-bg: #f3f4f6;
    --code-color: #111827;
    --code-block-bg: #1e1e2e;
  `;
}

export default function Preview({ store }: PreviewProps) {
  const file = store.activeFile;
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [scrollSync, setScrollSync] = useState(true);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const rendered = useMemo(() => {
    if (!file) return "";
    return renderMarkdown(file.content);
  }, [file?.content]);

  const copyHtml = async () => {
    if (!rendered) return;
    await navigator.clipboard.writeText(rendered);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadHtml = () => {
    if (!file) return;
    const full = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${file.name.replace(".md", "")}</title>
<style>
body { margin: 0; padding: 40px; max-width: 780px; margin: 0 auto; font-family: Georgia, serif; background: #fff; color: #111; }
${PREVIEW_STYLES.replace(/\.md-preview /g, "")}
:root { ${getVars(false)} }
</style>
</head>
<body>
${rendered}
</body>
</html>`;
    const blob = new Blob([full], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name.replace(".md", ".html");
    a.click();
    URL.revokeObjectURL(url);
  };

  const vars = getVars(isDark);
  const previewContent = (
    <div
      className="flex-1 overflow-y-auto min-h-0 px-8 py-7 scrollbar-thin"
      ref={containerRef}
      style={{ background: isDark ? "#09090b" : "#ffffff" }}
    >
      <style>{`
        :root { ${vars} }
        ${PREVIEW_STYLES}
      `}</style>
      {rendered ? (
        <div
          className="md-preview max-w-[680px] mx-auto"
          dangerouslySetInnerHTML={{ __html: rendered }}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-neutral-300 dark:text-neutral-700 py-20">
          <Eye className="w-10 h-10 opacity-30" />
          <p className="text-[13px] font-medium">Nothing to preview yet</p>
        </div>
      )}
    </div>
  );

  if (!file) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-900/30 text-neutral-400 dark:text-neutral-600 gap-4 border-l border-neutral-200/60 dark:border-neutral-800/60">
        <Eye className="w-8 h-8 opacity-30" />
        <p className="text-[13px] font-medium">Preview will appear here</p>
      </div>
    );
  }

  const toolbar = (
    <div className="flex items-center gap-1.5 px-3 py-2 border-b border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/80 dark:bg-neutral-900/50 shrink-0">
      <Eye className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
      <span className="text-[12.5px] font-semibold text-neutral-500 dark:text-neutral-500">Preview</span>
      <span className="text-[10px] font-medium text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/40 ml-0.5">Live</span>

      <div className="ml-auto flex items-center gap-0.5">
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.span
              key="check"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1 text-[10.5px] text-emerald-500 font-medium px-2"
            >
              <Check className="w-3 h-3" /> Copied
            </motion.span>
          ) : (
            <motion.button
              key="copy"
              whileTap={{ scale: 0.9 }}
              onClick={copyHtml}
              title="Copy as HTML"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </AnimatePresence>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={downloadHtml}
          title="Export as HTML"
          className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setFullscreen(true)}
          title="Fullscreen preview"
          className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex-1 flex flex-col min-h-0 border-l border-neutral-200/60 dark:border-neutral-800/60 overflow-hidden">
        {toolbar}

        {/* File name bar */}
        <div className="flex items-center gap-2 px-5 py-2 border-b border-neutral-100 dark:border-neutral-800/40 shrink-0">
          <FileText className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span className="text-[13px] font-semibold text-neutral-900 dark:text-white truncate font-mono">{file.name}</span>
        </div>

        {previewContent}
      </div>

      {/* Fullscreen modal */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-neutral-950"
          >
            <div className="flex items-center justify-between px-6 py-3 border-b border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/80 dark:bg-neutral-900/50 shrink-0">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-neutral-400" />
                <span className="text-[13px] font-semibold text-neutral-700 dark:text-neutral-300">{file.name}</span>
              </div>
              <button
                onClick={() => setFullscreen(false)}
                className="p-2 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div
              className="flex-1 overflow-y-auto px-8 py-10"
              style={{ background: isDark ? "#09090b" : "#ffffff" }}
            >
              <style>{`:root { ${vars} } ${PREVIEW_STYLES}`}</style>
              <div className="md-preview max-w-[720px] mx-auto" dangerouslySetInnerHTML={{ __html: rendered }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}