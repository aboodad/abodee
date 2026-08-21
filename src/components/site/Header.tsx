import { Link, useRouter } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  Boxes,
  Crown,
  Flame,
  Home,
  Info,
  LogOut,
  MapPin,
  Menu,
  MessageCircle,
  Package,
  ShoppingBag,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { LogoLockup } from "@/components/brand/Logo";
import { useQuery } from "@tanstack/react-query";
import { fetchStoreSettings } from "@/lib/settings";

function AnnouncementBar() {
  const { t, pick } = useI18n();
  const { data: settings } = useQuery({
    queryKey: ["store-settings"],
    queryFn: fetchStoreSettings,
  });

  if (settings && settings.announcement_bar_active === false && settings.announcement_enabled === false) {
    return null;
  }

  const customText = pick(settings?.announcement_text_ar, settings?.announcement_text_en) || settings?.announcement_bar_text;
  const text = customText && customText.trim() ? customText : t("marquee");

  return (
    <div className="overflow-hidden bg-teal-deep py-2 border-b border-primary/20">
      <div className="marquee-track gap-16 px-8 text-[11px] font-medium tracking-[0.2em] text-teal-foreground">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="whitespace-nowrap flex items-center gap-4">
            <span>✨</span>
            <span>{text}</span>
            <span>✨</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Header() {
  const { t, lang, toggle, pick } = useI18n();
  const { count, setOpen } = useCart();
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ["store-settings"],
    queryFn: fetchStoreSettings,
  });

  const linkClass =
    "relative py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";
  const activeClass =
    "text-foreground font-semibold after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-gold-gradient";

  const closeMenu = () => setMobileMenuOpen(false);

  const navItems = [
    { to: "/", label: t("nav_home"), icon: Home, exact: true },
    { to: "/shop", label: t("nav_shop"), icon: Boxes },
    {
      to: "/offers",
      label: t("nav_offers"),
      icon: Flame,
      highlight: true,
      badge: pick("خصومات", "Offers"),
    },
    {
      to: "/shop",
      search: { category: "incense" },
      label: t("nav_incense"),
      icon: Sparkles,
    },
    {
      to: "/shop",
      search: { category: "fragrances" },
      label: t("nav_perfumes"),
      icon: Sparkles,
    },
    { to: "/branches", label: t("nav_branches"), icon: MapPin },
    { to: "/about", label: t("nav_about"), icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40">
      <AnnouncementBar />
      <div className="border-b border-border/70 bg-background/90 backdrop-blur-xl shadow-xs">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          {/* Brand Logo */}
          <Link to="/" onClick={closeMenu} aria-label={t("brand")}>
            <LogoLockup />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-7 lg:flex">
            <Link to="/" className={linkClass} activeProps={{ className: activeClass }}>
              {t("nav_home")}
            </Link>
            <Link to="/shop" className={linkClass} activeProps={{ className: activeClass }}>
              {t("nav_shop")}
            </Link>
            <Link
              to="/offers"
              className={`${linkClass} flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold`}
              activeProps={{ className: activeClass }}
            >
              <Flame className="size-4 text-amber-500 animate-pulse" />
              {t("nav_offers")}
            </Link>
            <Link
              to="/shop"
              search={{ category: "incense" }}
              className={linkClass}
              activeProps={{ className: "" }}
            >
              {t("nav_incense")}
            </Link>
            <Link
              to="/shop"
              search={{ category: "fragrances" }}
              className={linkClass}
              activeProps={{ className: "" }}
            >
              {t("nav_perfumes")}
            </Link>
            <Link
              to="/branches"
              className={`${linkClass} flex items-center gap-1`}
              activeProps={{ className: activeClass }}
            >
              <MapPin className="size-3.5 text-primary" />
              {t("nav_branches")}
            </Link>
            <Link to="/about" className={linkClass} activeProps={{ className: activeClass }}>
              {t("nav_about")}
            </Link>
            {user ? (
              <Link to="/orders" className={linkClass} activeProps={{ className: activeClass }}>
                {t("nav_orders")}
              </Link>
            ) : null}
            {isAdmin ? (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/40 px-3 py-1 text-xs font-semibold text-primary shadow-xs transition-all hover:bg-primary hover:text-primary-foreground"
              >
                <Crown className="size-3.5 text-primary group-hover:text-primary-foreground" />
                {t("nav_admin")}
              </Link>
            ) : null}
          </nav>

          {/* Action Buttons & Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Language Switch */}
            <button
              onClick={toggle}
              aria-label={t("language")}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-bold tracking-widest text-primary transition-colors hover:bg-accent cursor-pointer"
            >
              {lang === "ar" ? "EN" : "عربي"}
            </button>

            {/* User Profile / Auth Button */}
            {user ? (
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.navigate({ to: "/" });
                }}
                aria-label={t("sign_out")}
                title={t("sign_out")}
                className="hidden sm:inline-flex rounded-full border border-border p-2 text-muted-foreground transition-colors hover:text-primary cursor-pointer"
              >
                <LogOut className="size-4" />
              </button>
            ) : (
              <Link
                to="/auth"
                aria-label={t("sign_in")}
                title={t("sign_in")}
                className="hidden sm:inline-flex rounded-full border border-border p-2 text-muted-foreground transition-colors hover:text-primary"
              >
                <User className="size-4" />
              </Link>
            )}

            {/* Cart Button */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => {
                closeMenu();
                setOpen(true);
              }}
              className="flex items-center gap-2 rounded-full bg-teal px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-semibold text-teal-foreground shadow-soft cursor-pointer hover:opacity-95 transition-opacity"
            >
              <ShoppingBag className="size-4" />
              <span className="hidden md:inline">{t("cart")}</span>
              {count > 0 ? (
                <span className="flex size-5 items-center justify-center rounded-full bg-gold-gradient text-[10px] font-bold text-primary-foreground">
                  {count}
                </span>
              ) : null}
            </motion.button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex lg:hidden size-10 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-all cursor-pointer"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden border-b border-border/80 bg-background/95 backdrop-blur-2xl shadow-2xl overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Link
                  to="/"
                  onClick={closeMenu}
                  className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-border/60 bg-card/60 text-foreground hover:bg-accent font-medium transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Home className="size-4" />
                    </span>
                    <span className="text-sm">{t("nav_home")}</span>
                  </div>
                </Link>

                <Link
                  to="/shop"
                  onClick={closeMenu}
                  className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-border/60 bg-card/60 text-foreground hover:bg-accent font-medium transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Boxes className="size-4" />
                    </span>
                    <span className="text-sm">{t("nav_shop")}</span>
                  </div>
                </Link>

                <Link
                  to="/offers"
                  onClick={closeMenu}
                  className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-500">
                      <Flame className="size-4 animate-pulse" />
                    </span>
                    <span className="text-sm">{t("nav_offers")}</span>
                  </div>
                  <span className="rounded-full bg-amber-500 text-primary-foreground text-[10px] font-bold px-2 py-0.5 animate-pulse">
                    {pick("خصومات", "Offers")}
                  </span>
                </Link>

                <Link
                  to="/shop"
                  search={{ category: "incense" }}
                  onClick={closeMenu}
                  className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-border/60 bg-card/60 text-foreground hover:bg-accent font-medium transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Sparkles className="size-4" />
                    </span>
                    <span className="text-sm">{t("nav_incense")}</span>
                  </div>
                </Link>

                <Link
                  to="/shop"
                  search={{ category: "fragrances" }}
                  onClick={closeMenu}
                  className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-border/60 bg-card/60 text-foreground hover:bg-accent font-medium transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Sparkles className="size-4" />
                    </span>
                    <span className="text-sm">{t("nav_perfumes")}</span>
                  </div>
                </Link>

                <Link
                  to="/branches"
                  onClick={closeMenu}
                  className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-border/60 bg-card/60 text-foreground hover:bg-accent font-medium transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <MapPin className="size-4" />
                    </span>
                    <span className="text-sm">{t("nav_branches")}</span>
                  </div>
                </Link>

                <Link
                  to="/about"
                  onClick={closeMenu}
                  className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-border/60 bg-card/60 text-foreground hover:bg-accent font-medium transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Info className="size-4" />
                    </span>
                    <span className="text-sm">{t("nav_about")}</span>
                  </div>
                </Link>

                {user ? (
                  <Link
                    to="/orders"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-border/60 bg-card/60 text-foreground hover:bg-accent font-medium"
                  >
                    <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Package className="size-4" />
                    </span>
                    <span className="text-sm">{t("nav_orders")}</span>
                  </Link>
                ) : null}

                {isAdmin ? (
                  <Link
                    to="/admin"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-primary/40 bg-primary/15 text-primary font-bold shadow-gold-glow"
                  >
                    <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <Crown className="size-4" />
                    </span>
                    <span className="text-sm">{t("nav_admin")}</span>
                  </Link>
                ) : null}
              </div>

              {/* Bottom Quick Actions (Auth & WhatsApp) */}
              <div className="pt-3 border-t border-border/60 flex flex-col sm:flex-row gap-2.5">
                {user ? (
                  <button
                    type="button"
                    onClick={async () => {
                      closeMenu();
                      await supabase.auth.signOut();
                      router.navigate({ to: "/" });
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive text-xs font-bold cursor-pointer hover:bg-destructive/20"
                  >
                    <LogOut className="size-4" />
                    <span>{t("sign_out")}</span>
                  </button>
                ) : (
                  <Link
                    to="/auth"
                    onClick={closeMenu}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gold-gradient text-primary-foreground shadow-gold-glow text-xs font-bold"
                  >
                    <User className="size-4" />
                    <span>{t("sign_in")} / {t("sign_up")}</span>
                  </Link>
                )}

                {settings?.whatsapp_number ? (
                  <a
                    href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-emerald-600/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-600/25 transition-all"
                  >
                    <MessageCircle className="size-4" />
                    <span>{pick("تواصل واتساب", "WhatsApp Chat")}</span>
                  </a>
                ) : null}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
