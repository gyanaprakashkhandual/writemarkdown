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