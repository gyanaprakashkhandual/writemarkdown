"use client";
import { motion } from "framer-motion";
import { ArrowUpRight, Heart } from "lucide-react";


const socials = [
  {
    name: "YouTube",
    url: "https://youtube.com/@GyanaprakashKhandual",
    color: "hover:text-red-500 hover:border-red-500/30 hover:bg-red-500/8",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/gyanaprakashkhandual",
    color: "hover:text-blue-500 hover:border-blue-500/30 hover:bg-blue-500/8",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    url: "https://instagram.com/GyanaprakashKhandual",
    color: "hover:text-pink-500 hover:border-pink-500/30 hover:bg-pink-500/8",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    url: "https://facebook.com/GyanaprakashKhandual",
    color: "hover:text-blue-600 hover:border-blue-600/30 hover:bg-blue-600/8",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="relative px-6 lg:px-12 pt-20 pb-10 bg-white dark:bg-[#0d0d0f] border-t border-black/6 dark:border-white/6">
      <div className="relative max-w-7xl mx-auto">
        <div className="grid gap-12 lg:grid-cols-12 mb-16">
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-black dark:text-white tracking-tight">
                Gyana Prakash Khandual
              </h3>
              <p className="text-sm text-black/45 dark:text-white/45 font-medium">
                Full-Stack Developer · QA Engineer · Ethical Hacker
              </p>
            </div>

            <p className="text-sm text-black/45 dark:text-white/45 leading-relaxed max-w-sm">
              Building secure, scalable, and intelligent web applications.
              Committed to quality at every layer of the stack.
            </p>

            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <motion.a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.name}
                  whileTap={{ scale: 0.92 }}
                  className={`group relative flex items-center justify-center w-11 h-11 rounded-2xl bg-black/4 dark:bg-white/4 border border-black/8 dark:border-white/8 text-black/40 dark:text-white/40 ${s.color} transition-all duration-200 shadow-sm hover:shadow-md`}
                >
                  {s.icon}
                  <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] font-semibold tracking-wide bg-black dark:bg-white text-white dark:text-black rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap shadow-lg">
                    {s.name}
                  </span>
                </motion.a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 lg:col-start-7">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/35 dark:text-white/35 mb-5">
              Navigate
            </h4>
            <ul className="space-y-3">
              {["About", "Projects", "Skills", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href={`https://gyanprakash.vercel.app/${link.toLowerCase()}`}
                    className="group inline-flex items-center gap-1.5 text-sm text-black/55 dark:text-white/55 hover:text-black dark:hover:text-white transition-colors duration-150 font-medium"
                  >
                    {link}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/35 dark:text-white/35 mb-5">
              Projects
            </h4>
            <ul className="space-y-3">
              {["Caffetest", "Fetch", "Selenium Ext.", "Caffetest Ext."].map(
                (p) => (
                  <li key={p}>
                    <a
                      href="#"
                      className="group inline-flex items-center gap-1.5 text-sm text-black/55 dark:text-white/55 hover:text-black dark:hover:text-white transition-colors duration-150 font-medium"
                    >
                      {p}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/35 dark:text-white/35 mb-5">
              Connect
            </h4>
            <ul className="space-y-3">
              {[
                {
                  name: "GitHub",
                  url: "https://github.com/GyanaprakashKhandual",
                },
                {
                  name: "LinkedIn",
                  url: "https://www.linkedin.com/in/gyana-prakash-khandual-79b205332/",
                },
                {
                  name: "Email",
                  url: "https://gyanprakash.vercel.app/contact",
                },
                {
                  name: "Marketplace",
                  url: "https://marketplace.visualstudio.com/manage/publishers/gyanaprakashkhandual",
                },
              ].map((l) => (
                <li key={l.name}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-black/55 dark:text-white/55 hover:text-black dark:hover:text-white transition-colors font-medium flex items-center gap-1.5 group"
                  >
                    {l.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-black/6 dark:border-white/6">
          <p className="text-xs text-black/35 dark:text-white/35">
            © 2026 Gyana Prakash Khandual. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-black/35 dark:text-white/35">
            <span>Built with</span>
            <span>Lots of Love for Music</span>
            <Heart className="w-3 h-3 ml-1 text-black fill-black" />
          </div>
          <div className="flex gap-5 text-xs text-black/35 dark:text-white/35">
            <a
              href="/privacy-policy"
              className="hover:text-black dark:hover:text-white transition-colors"
            >
              Privacy
            </a>
            <a
              href="/terms-and-conditions"
              className="hover:text-black dark:hover:text-white transition-colors"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}