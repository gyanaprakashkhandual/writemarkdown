"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PanelLeft, PanelRight, Columns2, LayoutTemplate } from "lucide-react";
import { useMarkdownStore } from "../../lib/usemarkdown.store";
import Sidebar from "@/app/components/app/Sidebar";
import Editor from "@/app/components/app/Editor";
import Preview from "@/app/components/app/Preview";

type Layout = "both" | "editor" | "preview";

export default function EditorPage() {
  const store = useMarkdownStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [layout, setLayout] = useState<Layout>("both");

  return (
    <div className="flex min-h-screen max-h-screen overflow-hidden bg-white dark:bg-neutral-950">

      {/* Sidebar */}
      <Sidebar
        store={store}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Top control bar */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/60 dark:bg-neutral-900/40 shrink-0">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setSidebarOpen((v) => !v)}
            title="Toggle sidebar"
            className={`p-1.5 rounded-lg transition-colors ${
              sidebarOpen
                ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                : "text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700"
            }`}
          >
            <PanelLeft className="w-3.5 h-3.5" />
          </motion.button>

          <span className="w-px h-4 bg-neutral-200 dark:bg-neutral-700" />

          <div className="flex items-center gap-0.5">
            {(["both", "editor", "preview"] as Layout[]).map((l) => {
              const icons: Record<Layout, React.ReactNode> = {
                both: <Columns2 className="w-3.5 h-3.5" />,
                editor: <PanelLeft className="w-3.5 h-3.5" />,
                preview: <PanelRight className="w-3.5 h-3.5" />,
              };
              const labels: Record<Layout, string> = {
                both: "Split view",
                editor: "Editor only",
                preview: "Preview only",
              };
              return (
                <motion.button
                  key={l}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setLayout(l)}
                  title={labels[l]}
                  className={`p-1.5 rounded-lg transition-colors ${
                    layout === l
                      ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                      : "text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  }`}
                >
                  {icons[l]}
                </motion.button>
              );
            })}
          </div>

          {store.activeFile && (
            <div className="ml-auto flex items-center gap-1.5 text-[11.5px] text-neutral-400 dark:text-neutral-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Auto-saving
            </div>
          )}
        </div>

        {/* Editor / Preview area */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <AnimatePresence initial={false}>
            {(layout === "both" || layout === "editor") && (
              <motion.div
                key="editor"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex min-h-0 overflow-hidden ${layout === "both" ? "w-1/2" : "w-full"}`}
              >
                <Editor store={store} />
              </motion.div>
            )}

            {(layout === "both" || layout === "preview") && (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex min-h-0 overflow-hidden ${layout === "both" ? "w-1/2" : "w-full"}`}
              >
                <Preview store={store} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}