"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Link,
  List,
  ListOrdered,
  Quote,
  Minus,
  Table,
  Heading1,
  Heading2,
  Heading3,
  Save,
  Download,
  Clock,
  FileText,
} from "lucide-react";
import { MarkdownStore } from "../../lib/usemarkdown.store";

interface EditorProps {
  store: MarkdownStore;
}

function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

type ToolbarAction = {
  icon: React.ReactNode;
  title: string;
  action: (
    selected: string,
    full: string,
    start: number,
    end: number,
  ) => {
    text: string;
    cursorOffset?: number;
    selectFrom?: number;
    selectTo?: number;
  };
  shortcut?: string;
};

const TOOLBAR_ACTIONS: (ToolbarAction | "divider")[] = [
  {
    icon: <Heading1 className="w-3.5 h-3.5" />,
    title: "Heading 1",
    shortcut: "⌘1",
    action: (sel) => ({
      text: sel ? `# ${sel}` : "# Heading 1",
      cursorOffset: 2,
    }),
  },
  {
    icon: <Heading2 className="w-3.5 h-3.5" />,
    title: "Heading 2",
    action: (sel) => ({
      text: sel ? `## ${sel}` : "## Heading 2",
      cursorOffset: 3,
    }),
  },
  {
    icon: <Heading3 className="w-3.5 h-3.5" />,
    title: "Heading 3",
    action: (sel) => ({
      text: sel ? `### ${sel}` : "### Heading 3",
      cursorOffset: 4,
    }),
  },
  "divider",
  {
    icon: <Bold className="w-3.5 h-3.5" />,
    title: "Bold",
    shortcut: "⌘B",
    action: (sel) => ({
      text: sel ? `**${sel}**` : "**bold text**",
      selectFrom: 2,
      selectTo: sel ? 2 + sel.length : 11,
    }),
  },
  {
    icon: <Italic className="w-3.5 h-3.5" />,
    title: "Italic",
    shortcut: "⌘I",
    action: (sel) => ({
      text: sel ? `*${sel}*` : "*italic text*",
      selectFrom: 1,
      selectTo: sel ? 1 + sel.length : 12,
    }),
  },
  {
    icon: <Strikethrough className="w-3.5 h-3.5" />,
    title: "Strikethrough",
    action: (sel) => ({
      text: sel ? `~~${sel}~~` : "~~strikethrough~~",
      selectFrom: 2,
      selectTo: sel ? 2 + sel.length : 15,
    }),
  },
  {
    icon: <Code className="w-3.5 h-3.5" />,
    title: "Inline Code",
    shortcut: "⌘`",
    action: (sel) => ({
      text: sel ? `\`${sel}\`` : "`code`",
      selectFrom: 1,
      selectTo: sel ? 1 + sel.length : 5,
    }),
  },
  "divider",
  {
    icon: <Link className="w-3.5 h-3.5" />,
    title: "Link",
    shortcut: "⌘K",
    action: (sel) => ({
      text: sel ? `[${sel}](url)` : "[link text](url)",
      selectFrom: 1,
      selectTo: sel ? 1 + sel.length : 9,
    }),
  },
  {
    icon: <List className="w-3.5 h-3.5" />,
    title: "Bullet List",
    action: (sel) => ({
      text: sel
        ? sel
            .split("\n")
            .map((l) => `- ${l}`)
            .join("\n")
        : "- List item",
      cursorOffset: 2,
    }),
  },
  {
    icon: <ListOrdered className="w-3.5 h-3.5" />,
    title: "Numbered List",
    action: (sel) => ({
      text: sel
        ? sel
            .split("\n")
            .map((l, i) => `${i + 1}. ${l}`)
            .join("\n")
        : "1. List item",
      cursorOffset: 3,
    }),
  },
  {
    icon: <Quote className="w-3.5 h-3.5" />,
    title: "Blockquote",
    action: (sel) => ({
      text: sel ? `> ${sel}` : "> Blockquote",
      cursorOffset: 2,
    }),
  },
  "divider",
  {
    icon: <Minus className="w-3.5 h-3.5" />,
    title: "Horizontal Rule",
    action: () => ({ text: "\n---\n", cursorOffset: 5 }),
  },
  {
    icon: <Table className="w-3.5 h-3.5" />,
    title: "Table",
    action: () => ({
      text: "| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n",
      cursorOffset: 0,
    }),
  },
];

export default function Editor({ store }: EditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [saveIndicator, setSaveIndicator] = useState(false);
  const [tick, setTick] = useState(0);

  const file = store.activeFile;

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!file) return;
      store.updateFileContent(file.id, e.target.value);
      setSaveIndicator(true);
      setTimeout(() => setSaveIndicator(false), 1200);
    },
    [file, store],
  );

  const insertAtCursor = useCallback(
    (action: ToolbarAction) => {
      const ta = textareaRef.current;
      if (!ta || !file) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const selected = ta.value.slice(start, end);
      const full = ta.value;
      const result = action.action(selected, full, start, end);
      const before = full.slice(0, start);
      const after = full.slice(end);
      const newText = before + result.text + after;
      store.updateFileContent(file.id, newText);
      setSaveIndicator(true);
      setTimeout(() => setSaveIndicator(false), 1200);
      requestAnimationFrame(() => {
        if (!ta) return;
        ta.focus();
        const newStart =
          result.selectFrom != null
            ? start + result.selectFrom
            : start + result.text.length;
        const newEnd =
          result.selectTo != null ? start + result.selectTo : newStart;
        ta.setSelectionRange(newStart, newEnd);
      });
    },
    [file, store],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const ta = textareaRef.current;
      if (!ta || !file) return;
      const isMod = e.metaKey || e.ctrlKey;

      if (isMod) {
        const boldAction = TOOLBAR_ACTIONS.find(
          (a) => a !== "divider" && (a as ToolbarAction).title === "Bold",
        ) as ToolbarAction;
        const italicAction = TOOLBAR_ACTIONS.find(
          (a) => a !== "divider" && (a as ToolbarAction).title === "Italic",
        ) as ToolbarAction;
        const codeAction = TOOLBAR_ACTIONS.find(
          (a) =>
            a !== "divider" && (a as ToolbarAction).title === "Inline Code",
        ) as ToolbarAction;
        const linkAction = TOOLBAR_ACTIONS.find(
          (a) => a !== "divider" && (a as ToolbarAction).title === "Link",
        ) as ToolbarAction;

        if (e.key === "b") {
          e.preventDefault();
          insertAtCursor(boldAction);
          return;
        }
        if (e.key === "i") {
          e.preventDefault();
          insertAtCursor(italicAction);
          return;
        }
        if (e.key === "`") {
          e.preventDefault();
          insertAtCursor(codeAction);
          return;
        }
        if (e.key === "k") {
          e.preventDefault();
          insertAtCursor(linkAction);
          return;
        }
        if (e.key === "s") {
          e.preventDefault();
          setSaveIndicator(true);
          setTimeout(() => setSaveIndicator(false), 1500);
          return;
        }
      }

      if (e.key === "Tab") {
        e.preventDefault();
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const newText = ta.value.slice(0, start) + "  " + ta.value.slice(end);
        store.updateFileContent(file.id, newText);
        requestAnimationFrame(() => {
          ta.setSelectionRange(start + 2, start + 2);
        });
      }
    },
    [file, store, insertAtCursor],
  );

  const downloadFile = useCallback(() => {
    if (!file) return;
    const blob = new Blob([file.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  }, [file]);

  if (!file) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-neutral-950 text-neutral-400 dark:text-neutral-600 gap-4">
        <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
          <FileText className="w-6 h-6" />
        </div>
        <div className="text-center">
          <p className="text-[14px] font-semibold text-neutral-500 dark:text-neutral-500">
            No file selected
          </p>
          <p className="text-[12.5px] mt-1">
            Create or select a file from the sidebar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-neutral-950 overflow-hidden">
      <div className="flex items-center gap-1 px-3 py-2 border-b border-neutral-100 dark:border-neutral-800/60 bg-white dark:bg-neutral-900/50 overflow-x-auto scrollbar-none shrink-0 flex-wrap">
        {TOOLBAR_ACTIONS.map((action, i) =>
          action === "divider" ? (
            <span
              key={`div-${i}`}
              className="w-px h-4 bg-neutral-200 dark:bg-neutral-700 mx-0.5 shrink-0"
            />
          ) : (
            <motion.button
              key={(action as ToolbarAction).title}
              whileTap={{ scale: 0.88 }}
              onClick={() => insertAtCursor(action as ToolbarAction)}
              title={
                (action as ToolbarAction).title +
                ((action as ToolbarAction).shortcut
                  ? ` (${(action as ToolbarAction).shortcut})`
                  : "")
              }
              className="p-1.5 rounded-lg text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors shrink-0"
            >
              {(action as ToolbarAction).icon}
            </motion.button>
          ),
        )}

        <div className="ml-auto flex items-center gap-2.5 shrink-0 pl-3 border-l border-neutral-200 dark:border-neutral-700 ml-2">
          <div className="flex items-center gap-1 text-[11px] text-neutral-400 dark:text-neutral-600">
            <Clock className="w-3 h-3 shrink-0" />
            <span>{formatRelativeTime(file.updatedAt)}</span>
          </div>
          <AnimatePresence>
            {saveIndicator && (
              <motion.span
                initial={{ opacity: 0, x: 4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1 text-[10.5px] text-emerald-500 font-medium"
              >
                <Save className="w-3 h-3" /> Saved
              </motion.span>
            )}
          </AnimatePresence>
          <button
            onClick={downloadFile}
            title="Download .md file"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <textarea
        ref={textareaRef}
        value={file.content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        spellCheck={true}
        placeholder="Start writing markdown..."
        className="
          flex-1 resize-none w-full min-h-0
          bg-white dark:bg-neutral-950
          text-neutral-800 dark:text-neutral-200
          text-[13.5px] leading-[1.7]
          tracking-[0.01em]
          px-10 py-7
          outline-none
          placeholder-neutral-300 dark:placeholder-neutral-700
          scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800
        "
        style={{
          fontFamily:
            "'JetBrains Mono', 'Geist Mono', 'Fira Code', 'Cascadia Code', ui-monospace, 'Courier New', monospace",
          fontVariantLigatures: "contextual",
          fontFeatureSettings: '"liga" 1, "calt" 1',
          tabSize: 2,
        }}
      />
    </div>
  );
}
