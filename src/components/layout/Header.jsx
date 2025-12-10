import React from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Link } from "react-router-dom";

const Header = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Home", to: "/" },
    { name: "Explore Plants", to: "/home" },
    { name: "Categories", to: "/home" },
    { name: "About", to: "/about" },
  ];

  const MotionLink = motion.create(Link);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-md shadow-sm py-2 text-foreground"
            : "bg-transparent py-4 text-white"
        }`}
      >
        <div className="w-full max-w-7xl px-4 mx-auto">
          <div className="flex items-center justify-between whitespace-nowrap h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3">
              <span className="material-symbols-outlined text-2xl sm:text-3xl">
                spa
              </span>
              <h2 className="text-base sm:text-lg font-bold leading-tight tracking-[-0.015em]">
                HarbLoom
              </h2>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex flex-1 justify-end items-center gap-8">
              <nav className="flex items-center gap-2">
                {navLinks.map((link) => (
                  <Button
                    key={link.name}
                    variant="ghost"
                    asChild
                    className={`font-medium hover:text-primary ${
                      isScrolled
                        ? "text-foreground"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    <Link to={link.to}>{link.name}</Link>
                  </Button>
                ))}
              </nav>
              <ThemeToggle />
              <div className="flex items-center gap-4">
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className={`font-bold ${
                      isScrolled
                        ? "text-foreground"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                    Signup
                  </Button>
                </Link>
              </div>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Open menu"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] sm:w-[320px] bg-background shadow-2xl z-50 overflow-y-auto"
            >
              <div className="flex flex-col h-full">
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-2xl">
                      spa
                    </span>
                    <h3 className="text-base font-bold text-foreground">
                      Menu
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2 rounded-lg hover:bg-muted transition-colors"
                      aria-label="Close menu"
                    >
                      <span className="material-symbols-outlined text-2xl text-foreground">
                        close
                      </span>
                    </button>
                  </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col p-6 gap-2">
                  {navLinks.map((link, index) => (
                    <MotionLink
                      key={link.name}
                      to={link.to}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground font-medium hover:bg-muted hover:text-primary transition-all duration-200"
                    >
                      {link.name}
                    </MotionLink>
                  ))}
                </nav>

                {/* Auth Buttons */}
                <div className="mt-auto p-6 border-t border-border space-y-3">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full font-bold">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg">
                      Signup
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
