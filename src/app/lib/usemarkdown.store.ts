"use client";

import { useState, useEffect, useCallback } from "react";

export type FileNode = {
  id: string;
  type: "file";
  name: string;
  content: string;
  parentId: string | null;
  createdAt: number;
  updatedAt: number;
};

export type FolderNode = {
  id: string;
  type: "folder";
  name: string;
  parentId: string | null;
  isOpen: boolean;
  createdAt: number;
};

export type Node = FileNode | FolderNode;

const STORAGE_KEY = "wm_nodes";
const ACTIVE_KEY = "wm_active";

function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const DEFAULT_NODES: Node[] = [
  {
    id: "folder-start",
    type: "folder",
    name: "My Notes",
    parentId: null,
    isOpen: true,
    createdAt: Date.now(),
  },
  {
    id: "file-welcome",
    type: "file",
    name: "welcome.md",
    parentId: "folder-start",
    content: `# Welcome to Write Markdown ✦

A beautiful, distraction-free markdown editor — right in your browser.

## Getting Started

- **Create files** using the \`+\` icon in the sidebar
- **Organize** with folders
- **Write** here in the editor — preview updates live

## Markdown Basics

### Text Formatting
**Bold**, *italic*, ~~strikethrough~~, and \`inline code\`.

### Lists

Unordered:
- Item one
- Item two
  - Nested item

Ordered:
1. First step
2. Second step
3. Third step

### Code Blocks

\`\`\`javascript
const editor = new WriteMarkdown();
editor.on("change", (content) => {
  preview.render(content);
});
\`\`\`

### Blockquotes

> "The best tool is the one that gets out of your way."

### Tables

| Feature       | Status  |
|---------------|---------|
| Live Preview  | ✅ Done |
| File Manager  | ✅ Done |
| Export PDF    | ✅ Done |
| Sharing       | ✅ Done |

---

Happy writing! ☕
`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "file-readme",
    type: "file",
    name: "README.md",
    parentId: null,
    content: `# My Project

A short description of your project.

## Installation

\`\`\`bash
npm install
npm run dev
\`\`\`

## Usage

Write your usage instructions here.

## License

MIT
`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

function loadNodes(): Node[] {
  if (typeof window === "undefined") return DEFAULT_NODES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_NODES;
    return JSON.parse(raw) as Node[];
  } catch {
    return DEFAULT_NODES;
  }
}

function saveNodes(nodes: Node[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nodes));
}

function loadActiveId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_KEY);
}

function saveActiveId(id: string | null) {
  if (typeof window === "undefined") return;
  if (id) localStorage.setItem(ACTIVE_KEY, id);
  else localStorage.removeItem(ACTIVE_KEY);
}

export function useMarkdownStore() {
  const [nodes, setNodes] = useState<Node[]>(() => loadNodes());
  const [activeFileId, setActiveFileIdState] = useState<string | null>(() => {
    const stored = loadActiveId();
    const all = loadNodes();
    const files = all.filter((n) => n.type === "file");
    if (stored && files.find((f) => f.id === stored)) return stored;
    return files[0]?.id ?? null;
  });

  const persistNodes = useCallback((updated: Node[]) => {
    setNodes(updated);
    saveNodes(updated);
  }, []);

  const setActiveFileId = useCallback((id: string | null) => {
    setActiveFileIdState(id);
    saveActiveId(id);
  }, []);

  const activeFile = nodes.find(
    (n) => n.id === activeFileId && n.type === "file",
  ) as FileNode | undefined;

  const updateFileContent = useCallback((id: string, content: string) => {
    setNodes((prev) => {
      const updated = prev.map((n) =>
        n.id === id && n.type === "file"
          ? { ...n, content, updatedAt: Date.now() }
          : n,
      );
      saveNodes(updated);
      return updated;
    });
  }, []);

  const createFile = useCallback(
    (name: string, parentId: string | null) => {
      const safeName = name.endsWith(".md") ? name : `${name}.md`;
      const node: FileNode = {
        id: generateId(),
        type: "file",
        name: safeName,
        parentId,
        content: `# ${safeName.replace(".md", "")}\n\nStart writing here...\n`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      const updated = [...nodes, node];
      persistNodes(updated);
      setActiveFileId(node.id);
      return node.id;
    },
    [nodes, persistNodes, setActiveFileId],
  );

  const createFolder = useCallback(
    (name: string, parentId: string | null) => {
      const node: FolderNode = {
        id: generateId(),
        type: "folder",
        name,
        parentId,
        isOpen: true,
        createdAt: Date.now(),
      };
      persistNodes([...nodes, node]);
      return node.id;
    },
    [nodes, persistNodes],
  );

  const renameNode = useCallback(
    (id: string, newName: string) => {
      const updated = nodes.map((n) => {
        if (n.id !== id) return n;
        if (n.type === "file") {
          const safeName = newName.endsWith(".md") ? newName : `${newName}.md`;
          return { ...n, name: safeName, updatedAt: Date.now() };
        }
        return { ...n, name: newName };
      });
      persistNodes(updated);
    },
    [nodes, persistNodes],
  );

  const deleteNode = useCallback(
    (id: string) => {
      const toDelete = new Set<string>();
      const collectIds = (nodeId: string) => {
        toDelete.add(nodeId);
        nodes
          .filter((n) => n.parentId === nodeId)
          .forEach((child) => collectIds(child.id));
      };
      collectIds(id);
      const updated = nodes.filter((n) => !toDelete.has(n.id));
      persistNodes(updated);
      if (activeFileId && toDelete.has(activeFileId)) {
        const remaining = updated.filter((n) => n.type === "file");
        setActiveFileId(remaining[0]?.id ?? null);
      }
    },
    [nodes, persistNodes, activeFileId, setActiveFileId],
  );

  const toggleFolder = useCallback(
    (id: string) => {
      const updated = nodes.map((n) =>
        n.id === id && n.type === "folder" ? { ...n, isOpen: !n.isOpen } : n,
      );
      persistNodes(updated);
    },
    [nodes, persistNodes],
  );

  const moveNode = useCallback(
    (id: string, newParentId: string | null) => {
      const updated = nodes.map((n) =>
        n.id === id ? { ...n, parentId: newParentId } : n,
      );
      persistNodes(updated);
    },
    [nodes, persistNodes],
  );

  return {
    nodes,
    activeFileId,
    activeFile,
    setActiveFileId,
    updateFileContent,
    createFile,
    createFolder,
    renameNode,
    deleteNode,
    toggleFolder,
    moveNode,
  };
}

export type MarkdownStore = ReturnType<typeof useMarkdownStore>;
