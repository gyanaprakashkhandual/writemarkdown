"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Heart, Mail, Coffee } from "lucide-react";
import { FaCoffee } from "react-icons/fa";
import { useRouter } from "next/navigation";

const SOCIALS = [
  {
    name: "YouTube",
    url: "https://youtube.com/@GyanaprakashKhandual",
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/gyana-prakash-khandual-79b205332/",
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    url: "https://github.com/GyanaprakashKhandual",
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    url: "https://instagram.com/GyanaprakashKhandual",
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    url: "https://facebook.com/GyanaprakashKhandual",
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "VS Marketplace",
    url: "https://marketplace.visualstudio.com/manage/publishers/gyanaprakashkhandual",
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
        <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
      </svg>
    ),
  },
];

const PRODUCT_LINKS = [
  { label: "Web Editor", href: "/" },
  { label: "NPM Package", href: "/package" },
  { label: "VS Code Extension", href: "/extension" },
  { label: "Documentation", href: "/docs" },
  { label: "Changelog", href: "/changelog" },
];

const RESOURCE_LINKS = [
  { label: "Getting Started", href: "/docs" },
  { label: "API Reference", href: "/docs/api" },
  { label: "Markdown Guide", href: "/docs/guide" },
  { label: "Examples", href: "/docs/examples" },
  { label: "Keyboard Shortcuts", href: "/docs/shortcuts" },
];

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "GitHub", href: "https://github.com/GyanaprakashKhandual", external: true },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
];

function FooterLink({ label, href, external }: { label: string; href: string; external?: boolean }) {
  return (
    <li>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="group inline-flex items-center gap-1 text-[13px] text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors duration-150 font-medium"
      >
        {label}
        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-0.5 translate-y-0.5 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-150" />
      </a>
    </li>
  );
}

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="bg-white dark:bg-neutral-950 border-t border-neutral-200/60 dark:border-neutral-800/60">

      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-10">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-14">

          {/* Brand col */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-6">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2.5 group"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm transition-colors">
                <FaCoffee className="w-3.5 h-3.5" />
              </span>
              <span className="text-[15px] font-semibold text-neutral-900 dark:text-white tracking-[-0.01em]">
                Write Markdown
              </span>
            </button>

            <p className="text-[13.5px] text-neutral-500 dark:text-neutral-500 leading-relaxed max-w-xs">
              A unified markdown ecosystem — write, preview, export, and share. Available as a web editor, NPM package, and VS Code extension.
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              {SOCIALS.map((s) => (
                <motion.a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.name}
                  whileHover={{ scale: 1.08, y: -1 }}
                  whileTap={{ scale: 0.92 }}
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-neutral-500 dark:text-neutral-500 hover:bg-neutral-900 dark:hover:bg-white hover:text-white dark:hover:text-neutral-900 hover:border-transparent transition-all duration-200 shadow-sm"
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>

            <a
              href="mailto:contact@writemarkdown.dev"
              className="inline-flex items-center gap-2 text-[12.5px] text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors font-medium"
            >
              <Mail className="w-3.5 h-3.5" />
              contact@writemarkdown.dev
            </a>
          </div>

          {/* Nav cols */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400 dark:text-neutral-600 mb-5">
              Product
            </h4>
            <ul className="space-y-3">
              {PRODUCT_LINKS.map((l) => (
                <FooterLink key={l.label} label={l.label} href={l.href} />
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400 dark:text-neutral-600 mb-5">
              Resources
            </h4>
            <ul className="space-y-3">
              {RESOURCE_LINKS.map((l) => (
                <FooterLink key={l.label} label={l.label} href={l.href} />
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400 dark:text-neutral-600 mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              {COMPANY_LINKS.map((l) => (
                <FooterLink key={l.label} label={l.label} href={l.href} external={l.external} />
              ))}
            </ul>
          </div>
        </div>

        {/* Install strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-neutral-800/50 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-white flex items-center justify-center shrink-0">
              <Coffee className="w-3.5 h-3.5 text-white dark:text-neutral-900" />
            </div>
            <div>
              <p className="text-[12.5px] font-semibold text-neutral-900 dark:text-white">Install the NPM package</p>
              <p className="text-[11.5px] text-neutral-400 dark:text-neutral-500 font-mono mt-0.5">npm install write-markdown</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href="/package"
              className="text-[12px] font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1 transition-colors"
            >
              NPM docs <ArrowUpRight className="w-3 h-3" />
            </a>
            <span className="w-px h-3 bg-neutral-200 dark:bg-neutral-700" />
            <a
              href="/extension"
              className="text-[12px] font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1 transition-colors"
            >
              VS Code extension <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-neutral-200/60 dark:border-neutral-800/50">
          <p className="text-[11.5px] text-neutral-400 dark:text-neutral-600 order-2 sm:order-1">
            © 2026 Write Markdown · Gyana Prakash Khandual. All rights reserved.
          </p>

          <div className="flex items-center gap-1.5 text-[11.5px] text-neutral-400 dark:text-neutral-600 order-1 sm:order-2">
            <span>Built with</span>
            <Heart className="w-3 h-3 fill-neutral-400 dark:fill-neutral-600 text-neutral-400 dark:text-neutral-600" />
            <span>and lots of</span>
            <FaCoffee className="w-3 h-3" />
          </div>

          <div className="flex items-center gap-4 order-3">
            <a href="/privacy" className="text-[11.5px] text-neutral-400 dark:text-neutral-600 hover:text-neutral-700 dark:hover:text-neutral-400 transition-colors">Privacy</a>
            <a href="/terms" className="text-[11.5px] text-neutral-400 dark:text-neutral-600 hover:text-neutral-700 dark:hover:text-neutral-400 transition-colors">Terms</a>
            <a href="/sitemap" className="text-[11.5px] text-neutral-400 dark:text-neutral-600 hover:text-neutral-700 dark:hover:text-neutral-400 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}