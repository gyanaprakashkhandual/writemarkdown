/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X } from "lucide-react";
import { FaCoffee } from "react-icons/fa";
import { useTheme } from "../context/Theme.context";

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Editor", href: "/" },
  { label: "Package", href: "/package" },
  { label: "Extension", href: "/extension" },
  { label: "Docs", href: "/docs" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, resolvedTheme, setTheme, mounted } = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (!themeOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest('[aria-label="Toggle theme"]') &&
        !target.closest(".theme-menu")
      ) {
        setThemeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [themeOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navigate = (href: string) => router.push(href);

  return (
    <>
      <motion.nav
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`
          select-none fixed top-0 left-0 right-0 z-50
          bg-white/95 dark:bg-neutral-950/95
          backdrop-blur-xl
          border-b border-neutral-200/60 dark:border-neutral-800/60
          transition-all duration-300
          ${scrolled ? "shadow-[0_1px_24px_0_rgba(0,0,0,0.06)] dark:shadow-[0_1px_24px_0_rgba(0,0,0,0.4)]" : ""}
        `}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-15">
            <motion.button
              onClick={() => navigate("/")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2.5 shrink-0 group"
            >
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 transition-colors shadow-sm">
                <FaCoffee className="w-3.5 h-3.5" />
              </span>
              <span className="text-[15px] font-semibold text-neutral-900 dark:text-white tracking-[-0.01em]">
                Write Markdown
              </span>
            </motion.button>

            <div className="hidden lg:flex items-center gap-0.5">
              {NAV_LINKS.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <motion.button
                    key={link.href}
                    onClick={() => navigate(link.href)}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i + 0.15, duration: 0.3 }}
                    className={`
                      relative px-3.5 py-2 text-[13.5px] font-medium rounded-lg transition-colors duration-150
                      ${
                        isActive
                          ? "text-neutral-900 dark:text-white"
                          : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/50"
                      }
                    `}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-lg bg-neutral-100 dark:bg-neutral-800/80 ring-1 ring-neutral-200/60 dark:ring-neutral-700/50"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 32,
                        }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </motion.button>
                );
              })}
            </div>

            <div className="flex items-center gap-1">
              {mounted && (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setThemeOpen(!themeOpen)}
                    aria-label="Toggle theme"
                    title={`Current theme: ${theme}`}
                    className="p-2 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {resolvedTheme === "dark" ? (
                        <motion.span
                          key="sun"
                          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                          animate={{ rotate: 0, opacity: 1, scale: 1 }}
                          exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                          className="flex"
                        >
                          <Sun className="w-4 h-4" strokeWidth={1.75} />
                        </motion.span>
                      ) : (
                        <motion.span
                          key="moon"
                          initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
                          animate={{ rotate: 0, opacity: 1, scale: 1 }}
                          exit={{ rotate: -90, opacity: 0, scale: 0.6 }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                          className="flex"
                        >
                          <Moon className="w-4 h-4" strokeWidth={1.75} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  <AnimatePresence>
                    {themeOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.96 }}
                        transition={{ duration: 0.14, ease: "easeOut" }}
                        className="theme-menu absolute right-0 mt-1.5 w-38 rounded-xl bg-white dark:bg-neutral-900 shadow-xl shadow-black/8 dark:shadow-black/50 border border-neutral-200/80 dark:border-neutral-800 overflow-hidden z-60 p-1"
                      >
                        {(["light", "dark", "system"] as const).map((t) => (
                          <button
                            key={t}
                            onClick={() => {
                              setTheme(t);
                              setThemeOpen(false);
                            }}
                            className={`
                              w-full px-3 py-2 text-left text-[13px] font-medium rounded-lg transition-colors
                              ${
                                theme === t
                                  ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                                  : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-white"
                              }
                            `}
                          >
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <div className="hidden lg:block w-px h-4 bg-neutral-200 dark:bg-neutral-800 mx-1" />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/docs")}
                className="hidden lg:flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[13px] font-semibold hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors shadow-sm"
              >
                Get Started
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => setMobileOpen((v) => !v)}
                className="lg:hidden ml-0.5 p-2 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={mobileOpen ? "close" : "open"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.14 }}
                    className="flex"
                  >
                    {mobileOpen ? (
                      <X className="w-4.5 h-4.5" />
                    ) : (
                      <Menu className="w-4.5 h-4.5" />
                    )}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden overflow-hidden border-t border-neutral-200/60 dark:border-neutral-800/60 bg-white dark:bg-neutral-950"
            >
              <div className="px-5 py-3 space-y-0.5">
                {NAV_LINKS.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.button
                      key={link.href}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.04, duration: 0.2 }}
                      onClick={() => navigate(link.href)}
                      className={`
                        w-full text-left px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors
                        ${
                          isActive
                            ? "bg-neutral-100 dark:bg-neutral-800/80 text-neutral-900 dark:text-white"
                            : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 hover:text-neutral-900 dark:hover:text-white"
                        }
                      `}
                    >
                      {link.label}
                    </motion.button>
                  );
                })}
                <div className="pt-2 pb-1">
                  <button
                    onClick={() => navigate("/docs")}
                    className="w-full py-2.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[13.5px] font-semibold hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <div className="h-15" />
    </>
  );
}
