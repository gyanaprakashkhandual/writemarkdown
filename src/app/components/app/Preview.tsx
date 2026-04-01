"use client";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  Copy,
  Check,
  Download,
  Maximize2,
  X,
  FileText,
} from "lucide-react";
import MarkdownRenderer from "../markdown/Markdown.render";
import { MarkdownStore } from "../../lib/usemarkdown.store";

interface PreviewProps {
  store: MarkdownStore;
}

export default function Preview({ store }: PreviewProps) {
  const file = store.activeFile;
  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  const copyHtml = async () => {
    if (!file?.content) return;
    await navigator.clipboard.writeText(file.content);
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
</head>
<body>
${file.content}
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

  const toolbar = (
    <div className="flex items-center gap-1.5 px-3 py-2 border-b border-neutral-100 dark:border-neutral-800/60 bg-neutral-50/80 dark:bg-neutral-900/50 shrink-0">
      <Eye className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
      <span className="text-[12.5px] font-semibold text-neutral-500 dark:text-neutral-500">
        Preview
      </span>
      <span className="text-[10px] font-medium text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/40 ml-0.5">
        Live
      </span>

      <div className="ml-auto flex items-center gap-2">
        <span className="text-[13px] font-semibold text-neutral-900 dark:text-white truncate font-mono flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          {file?.name}
        </span>

        <div className="flex items-center gap-0.5">
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
                title="Copy Markdown"
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

  return (
    <>
      <div className="flex-1 flex flex-col min-h-0 border-l border-neutral-200/60 dark:border-neutral-800/60 overflow-hidden">
        {toolbar}

        <div className="flex-1 overflow-y-auto min-h-0 px-8 py-7 scrollbar-thin bg-white dark:bg-[#09090b]">
          <MarkdownRenderer content={file.content} />
        </div>
      </div>

      {/* Fullscreen Modal */}
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
                <span className="text-[13px] font-semibold text-neutral-700 dark:text-neutral-300">
                  {file.name}
                </span>
              </div>
              <button
                onClick={() => setFullscreen(false)}
                className="p-2 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-10 bg-white dark:bg-[#09090b]">
              <MarkdownRenderer content={file.content} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
