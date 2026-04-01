"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FilePlus,
  FolderPlus,
  ChevronRight,
  ChevronDown,
  FileText,
  Folder,
  FolderOpen,
  Pencil,
  Trash2,
  MoreHorizontal,
  X,
  Check,
  FolderInput,
} from "lucide-react";
import { FaCoffee } from "react-icons/fa";
import { MarkdownStore, Node, FileNode, FolderNode } from "../../lib/usemarkdown.store";

interface SidebarProps {
  store: MarkdownStore;
  isOpen: boolean;
  onClose: () => void;
}

type CreatingState = {
  parentId: string | null;
  type: "file" | "folder";
} | null;
type RenamingState = { id: string; value: string } | null;
type ContextMenu = { id: string; x: number; y: number } | null;

function getChildren(nodes: Node[], parentId: string | null): Node[] {
  return nodes
    .filter((n) => n.parentId === parentId)
    .sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === "folder" ? -1 : 1;
    });
}

function InlineInput({
  value,
  onChange,
  onConfirm,
  onCancel,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  placeholder: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === "Enter") onConfirm();
    if (e.key === "Escape") onCancel();
  };

  return (
    <div className="flex items-center gap-1 px-2 py-1">
      <input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKey}
        placeholder={placeholder}
        className="flex-1 min-w-0 text-[12.5px] bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md px-2 py-1 text-neutral-900 dark:text-white outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-500 font-mono"
      />
      <button
        onClick={onConfirm}
        className="p-1 rounded text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
      >
        <Check className="w-3 h-3" />
      </button>
      <button
        onClick={onCancel}
        className="p-1 rounded text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

interface TreeNodeProps {
  node: Node;
  depth: number;
  store: MarkdownStore;
  creating: CreatingState;
  setCreating: (s: CreatingState) => void;
  renaming: RenamingState;
  setRenaming: (s: RenamingState) => void;
  contextMenu: ContextMenu;
  setContextMenu: (s: ContextMenu) => void;
  onConfirmCreate: (name: string) => void;
  onConfirmRename: () => void;
}

function TreeNode({
  node,
  depth,
  store,
  creating,
  setCreating,
  renaming,
  setRenaming,
  contextMenu,
  setContextMenu,
  onConfirmCreate,
  onConfirmRename,
}: TreeNodeProps) {
  const isActive = store.activeFileId === node.id;
  const isFolder = node.type === "folder";
  const isRenaming = renaming?.id === node.id;
  const folder = node as FolderNode;
  const children = isFolder ? getChildren(store.nodes, node.id) : [];
  const isCreatingHere = creating?.parentId === node.id;

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ id: node.id, x: e.clientX, y: e.clientY });
  };

  const handleClick = () => {
    if (isFolder) {
      store.toggleFolder(node.id);
    } else {
      store.setActiveFileId(node.id);
    }
  };

  const indentPx = depth * 12;

  return (
    <div>
      {isRenaming ? (
        <div style={{ paddingLeft: indentPx }}>
          <InlineInput
            value={renaming.value}
            onChange={(v) => setRenaming({ ...renaming, value: v })}
            onConfirm={onConfirmRename}
            onCancel={() => setRenaming(null)}
            placeholder={node.name}
          />
        </div>
      ) : (
        <motion.div
          whileHover={{
            backgroundColor: isActive ? undefined : "rgba(0,0,0,0.03)",
          }}
          onContextMenu={handleContextMenu}
          onClick={handleClick}
          style={{ paddingLeft: indentPx + 8 }}
          className={`
            group relative flex items-center gap-1.5 pr-2 py-[5px] cursor-pointer rounded-lg mx-1 transition-colors
            ${
              isActive
                ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }
          `}
        >
          {isFolder ? (
            <>
              <span className="shrink-0 text-neutral-400 dark:text-neutral-500">
                {folder.isOpen ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </span>
              <span className="shrink-0">
                {folder.isOpen ? (
                  <FolderOpen className="w-3.5 h-3.5" />
                ) : (
                  <Folder className="w-3.5 h-3.5" />
                )}
              </span>
            </>
          ) : (
            <span className="shrink-0 ml-3.5">
              <FileText className="w-3.5 h-3.5" />
            </span>
          )}

          <span className="flex-1 min-w-0 text-[12.5px] font-medium truncate">
            {node.name}
          </span>

          <div
            className={`shrink-0 flex items-center gap-0.5 transition-opacity ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
            onClick={(e) => e.stopPropagation()}
          >
            {isFolder && (
              <>
                <button
                  onClick={() =>
                    setCreating({ parentId: node.id, type: "file" })
                  }
                  title="New file"
                  className={`p-0.5 rounded transition-colors ${isActive ? "hover:bg-white/20" : "hover:bg-neutral-200 dark:hover:bg-neutral-700"}`}
                >
                  <FilePlus className="w-3 h-3" />
                </button>
                <button
                  onClick={() =>
                    setCreating({ parentId: node.id, type: "folder" })
                  }
                  title="New folder"
                  className={`p-0.5 rounded transition-colors ${isActive ? "hover:bg-white/20" : "hover:bg-neutral-200 dark:hover:bg-neutral-700"}`}
                >
                  <FolderPlus className="w-3 h-3" />
                </button>
              </>
            )}
            <button
              onClick={() => setRenaming({ id: node.id, value: node.name })}
              title="Rename"
              className={`p-0.5 rounded transition-colors ${isActive ? "hover:bg-white/20" : "hover:bg-neutral-200 dark:hover:bg-neutral-700"}`}
            >
              <Pencil className="w-3 h-3" />
            </button>
            <button
              onClick={() => store.deleteNode(node.id)}
              title="Delete"
              className={`p-0.5 rounded transition-colors ${isActive ? "hover:bg-red-400/30 text-red-300" : "hover:bg-red-50 dark:hover:bg-red-950/30 text-red-400"}`}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      )}

      {isFolder && folder.isOpen && (
        <AnimatePresence initial={false}>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            {children.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                depth={depth + 1}
                store={store}
                creating={creating}
                setCreating={setCreating}
                renaming={renaming}
                setRenaming={setRenaming}
                contextMenu={contextMenu}
                setContextMenu={setContextMenu}
                onConfirmCreate={onConfirmCreate}
                onConfirmRename={onConfirmRename}
              />
            ))}

            {isCreatingHere && (
              <div style={{ paddingLeft: (depth + 1) * 12 }}>
                <InlineInput
                  value={
                    creating?.type === "file" ? "untitled.md" : "New Folder"
                  }
                  onChange={() => {}}
                  onConfirm={() => {}}
                  onCancel={() => setCreating(null)}
                  placeholder={
                    creating?.type === "file" ? "filename.md" : "folder name"
                  }
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

export default function Sidebar({ store, isOpen, onClose }: SidebarProps) {
  const [creating, setCreating] = useState<CreatingState>(null);
  const [createName, setCreateName] = useState("");
  const [renaming, setRenaming] = useState<RenamingState>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenu>(null);
  const [search, setSearch] = useState("");

  const rootChildren = getChildren(store.nodes, null);

  const filteredFiles = search.trim()
    ? store.nodes.filter(
        (n) =>
          n.type === "file" &&
          n.name.toLowerCase().includes(search.toLowerCase()),
      )
    : null;

  useEffect(() => {
    if (creating) setCreateName(creating.type === "file" ? "" : "");
  }, [creating]);

  useEffect(() => {
    if (!contextMenu) return;
    const close = () => setContextMenu(null);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [contextMenu]);

  const confirmCreate = (name: string) => {
    if (!name.trim() || !creating) return;
    if (creating.type === "file") {
      store.createFile(name.trim(), creating.parentId);
    } else {
      store.createFolder(name.trim(), creating.parentId);
    }
    setCreating(null);
    setCreateName("");
  };

  const confirmRename = () => {
    if (!renaming || !renaming.value.trim()) return;
    store.renameNode(renaming.id, renaming.value.trim());
    setRenaming(null);
  };

  const fileCount = store.nodes.filter((n) => n.type === "file").length;
  const folderCount = store.nodes.filter((n) => n.type === "folder").length;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="lg:hidden fixed inset-0 bg-black/20 dark:bg-black/50 z-30 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className={`
          fixed lg:relative lg:translate-x-0 top-0 left-0 z-40 lg:z-auto
          h-full w-64 flex flex-col
          bg-neutral-50 dark:bg-neutral-900/80
          border-r border-neutral-200/60 dark:border-neutral-800/60
          overflow-hidden
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200/60 dark:border-neutral-800/60 shrink-0">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-900">
              <FaCoffee className="w-3 h-3" />
            </span>
            <span className="text-[13px] font-semibold text-neutral-900 dark:text-white tracking-tight">
              Files
            </span>
            <span className="text-[10px] text-neutral-400 dark:text-neutral-600 font-medium bg-neutral-200/60 dark:bg-neutral-800 px-1.5 py-0.5 rounded-full">
              {fileCount}f · {folderCount}d
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setCreating({ parentId: null, type: "file" })}
              title="New file at root"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              <FilePlus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCreating({ parentId: null, type: "folder" })}
              title="New folder at root"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              <FolderPlus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 py-2 shrink-0 border-b border-neutral-200/40 dark:border-neutral-800/40">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files..."
            className="w-full text-[12px] bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-1.5 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 outline-none focus:ring-1 focus:ring-neutral-300 dark:focus:ring-neutral-600 transition-all"
          />
        </div>

        {/* Tree */}
        <div className="flex-1 overflow-y-auto py-2 scrollbar-thin">
          {search.trim() && filteredFiles ? (
            filteredFiles.length > 0 ? (
              <div className="px-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-600 px-2 py-1.5">
                  Results ({filteredFiles.length})
                </p>
                {filteredFiles.map((f) => (
                  <motion.button
                    key={f.id}
                    whileHover={{ x: 2 }}
                    onClick={() => {
                      store.setActiveFileId(f.id);
                      setSearch("");
                    }}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors mb-0.5 ${
                      store.activeFileId === f.id
                        ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[12.5px] font-medium truncate">
                      {f.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-10 text-neutral-400 dark:text-neutral-600">
                <FileText className="w-8 h-8 opacity-30" />
                <p className="text-[12px] font-medium">No files found</p>
              </div>
            )
          ) : (
            <>
              {creating?.parentId === null && (
                <div className="px-2 mb-1">
                  <InlineInput
                    value={createName}
                    onChange={setCreateName}
                    onConfirm={() => confirmCreate(createName)}
                    onCancel={() => {
                      setCreating(null);
                      setCreateName("");
                    }}
                    placeholder={
                      creating.type === "file" ? "filename.md" : "folder name"
                    }
                  />
                </div>
              )}

              {rootChildren.length === 0 && !creating ? (
                <div className="flex flex-col items-center gap-3 py-14 px-4 text-center">
                  <div className="w-10 h-10 rounded-xl bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                    <FolderInput className="w-5 h-5 text-neutral-400 dark:text-neutral-600" />
                  </div>
                  <div>
                    <p className="text-[12.5px] font-semibold text-neutral-500 dark:text-neutral-500">
                      No files yet
                    </p>
                    <p className="text-[11.5px] text-neutral-400 dark:text-neutral-600 mt-0.5">
                      Click + to create your first file
                    </p>
                  </div>
                </div>
              ) : (
                rootChildren.map((node) => (
                  <TreeNode
                    key={node.id}
                    node={node}
                    depth={0}
                    store={store}
                    creating={creating}
                    setCreating={setCreating}
                    renaming={renaming}
                    setRenaming={setRenaming}
                    contextMenu={contextMenu}
                    setContextMenu={setContextMenu}
                    onConfirmCreate={confirmCreate}
                    onConfirmRename={confirmRename}
                  />
                ))
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 px-4 py-3 border-t border-neutral-200/60 dark:border-neutral-800/60">
          <p className="text-[10.5px] text-neutral-400 dark:text-neutral-600 font-medium">
            Saved to localStorage · {fileCount}{" "}
            {fileCount === 1 ? "file" : "files"}
          </p>
        </div>
      </motion.aside>

      {/* Right-click context menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            style={{ top: contextMenu.y, left: contextMenu.x }}
            className="fixed z-50 w-44 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl shadow-black/10 dark:shadow-black/40 overflow-hidden p-1"
          >
            {(() => {
              const node = store.nodes.find((n) => n.id === contextMenu.id);
              if (!node) return null;
              return (
                <>
                  {node.type === "folder" && (
                    <>
                      <button
                        onClick={() => {
                          setCreating({ parentId: node.id, type: "file" });
                          store.toggleFolder(node.id);
                          setContextMenu(null);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-[12.5px] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors font-medium"
                      >
                        <FilePlus className="w-3.5 h-3.5" /> New File
                      </button>
                      <button
                        onClick={() => {
                          setCreating({ parentId: node.id, type: "folder" });
                          store.toggleFolder(node.id);
                          setContextMenu(null);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-[12.5px] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors font-medium"
                      >
                        <FolderPlus className="w-3.5 h-3.5" /> New Folder
                      </button>
                      <div className="my-1 h-px bg-neutral-100 dark:bg-neutral-800" />
                    </>
                  )}
                  <button
                    onClick={() => {
                      setRenaming({ id: node.id, value: node.name });
                      setContextMenu(null);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[12.5px] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors font-medium"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Rename
                  </button>
                  <button
                    onClick={() => {
                      store.deleteNode(node.id);
                      setContextMenu(null);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[12.5px] text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
