"use client";
import React, { useState, useEffect } from "react";
import { Celeste, Spark, I } from "@/components/icons";
import { Avatar, TONE } from "@/components/dashboard/DashComponents";
import AdminDash from "@/components/dashboard/AdminDash";
import VendorDash from "@/components/dashboard/VendorDash";
import CustomerDash from "@/components/dashboard/CustomerDash";
import { NOTIFS } from "@/lib/dash-data";

type Role = "admin" | "vendor" | "customer";

interface NavItem {
  id: string; label: string;
  icon: (p?: { size?: number; style?: React.CSSProperties }) => React.ReactElement;
  badge?: number; ai?: boolean;
}

const ROLES: Record<Role, { label: string; who: string; role: string; avatar: string; nav: NavItem[] }> = {
  admin: {
    label: "Admin", who: "Celeste HQ", role: "Platform admin", avatar: "Celeste HQ",
    nav: [
      { id: "overview",   label: "Overview",    icon: I.grid },
      { id: "vendors",    label: "Vendors",     icon: I.store,       badge: 2 },
      { id: "customers",  label: "Customers",   icon: I.users },
      { id: "orders",     label: "Orders",      icon: I.inbox },
      { id: "moderation", label: "Moderation",  icon: I.shieldcheck, ai: true, badge: 4 },
      { id: "payouts",    label: "Payouts",     icon: I.wallet },
      { id: "insights",   label: "AI Insights", icon: I.wand,        ai: true },
    ],
  },
  vendor: {
    label: "Vendor", who: "Mori Ceramics", role: "Seller", avatar: "Mori Ceramics",
    nav: [
      { id: "overview",  label: "Overview",  icon: I.grid },
      { id: "orders",    label: "Orders",    icon: I.inbox,  badge: 2 },
      { id: "products",  label: "Products",  icon: I.box },
      { id: "growth",    label: "AI Growth", icon: I.rocket, ai: true },
      { id: "reviews",   label: "Reviews",   icon: I.star },
      { id: "payouts",   label: "Payouts",   icon: I.wallet },
    ],
  },
  customer: {
    label: "Customer", who: "Alex Morgan", role: "Shopper", avatar: "Alex Morgan",
    nav: [
      { id: "overview",  label: "Overview",      icon: I.grid },
      { id: "orders",    label: "My Orders",     icon: I.truck,    badge: 2 },
      { id: "sets",      label: "Saved AI Sets", icon: I.heartset, ai: true },
      { id: "wishlist",  label: "Wishlist",      icon: I.heart },
      { id: "assistant", label: "AI Assistant",  icon: I.chat,     ai: true },
      { id: "account",   label: "Account",       icon: I.settings },
    ],
  },
};

export default function DashboardPage() {
  const [role, setRole] = useState<Role>("admin");
  const [section, setSection] = useState("overview");
  const [navOpen, setNavOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [customerName, setCustomerName] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("cel_profile_name") || "Alex Morgan";
    }
    return "Alex Morgan";
  });

  const cfg = ROLES[role];
  const displayName = role === "customer" ? customerName : cfg.who;

  const switchRole = (r: Role) => { setRole(r); setSection("overview"); setNavOpen(false); };
  const goSection = (s: string) => {
    setSection(s);
    setNavOpen(false);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const openAssistant = () => { if (typeof window !== "undefined") window.open("/assistant", "_blank"); };
  const notifs = NOTIFS[role];

  const sidebarClass = [
    "dash-sidebar",
    navOpen ? "open" : "",
    collapsed ? "collapsed" : "",
  ].filter(Boolean).join(" ");

  return (
    <div className="dash-root">

      {/* ── Sidebar ── */}
      <aside className={sidebarClass}>

        {/* Brand */}
        <div className="dash-brand">
          <Celeste size={20} color="#fff" />
        </div>

        {/* Role switcher */}
        <div className="role-switch">
          {(Object.keys(ROLES) as Role[]).map(k => (
            <button key={k} onClick={() => switchRole(k)} className={"role-btn" + (role === k ? " active" : "")}>
              {ROLES[k].label}
            </button>
          ))}
        </div>

        {/* Nav items */}
        <div className="dash-nav">
          {cfg.nav.map(n => (
            <button
              key={n.id}
              onClick={() => goSection(n.id)}
              className={"dash-navitem" + (section === n.id ? " active" : "")}
              title={collapsed ? n.label : undefined}
            >
              <n.icon size={19} />
              <span className="dash-nav-label">{n.label}</span>
              {n.ai && (
                <span className="nav-ai-spark">
                  <Spark size={13} style={{ color: section === n.id ? "var(--green)" : "var(--yellow)" }} />
                </span>
              )}
              {n.badge && <span className="nav-badge">{n.badge}</span>}
            </button>
          ))}

          {/* Collapse toggle (desktop only, hidden on mobile via override CSS) */}
          <button
            className="dash-navitem sidebar-collapse-btn"
            onClick={() => setCollapsed(v => !v)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <span className="collapse-chevron"><I.chevleft size={18} /></span>
            <span className="dash-nav-label" style={{ fontSize: 13, opacity: .8 }}>Collapse</span>
          </button>
        </div>

        {/* User box */}
        <div className="dash-userbox">
          <Avatar name={displayName} size={34} />
          <div className="ub-details">
            <div className="ub-name">{displayName}</div>
            <div className="ub-role">{cfg.role}</div>
          </div>
          <button className="ub-logout" title="Sign out"><I.logout size={17} /></button>
        </div>
      </aside>

      {/* Overlay (mobile) */}
      {navOpen && (
        <div
          className="dash-overlay"
          onClick={() => setNavOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Main ── */}
      <div className="dash-main">

        {/* Topbar */}
        <div className="dash-topbar">
          {/* Burger (mobile) — morphs ☰ → ✕ */}
          <button
            className={"dash-burger" + (navOpen ? " open" : "")}
            onClick={() => setNavOpen(v => !v)}
            aria-label={navOpen ? "Close menu" : "Open menu"}
          >
            <span className="burger-icon">
              {navOpen ? <I.close size={19} /> : <I.menu size={19} />}
            </span>
          </button>

          {/* Search */}
          <div className="dash-search">
            <I.search size={16} style={{ color: "var(--text-muted)", flex: "0 0 auto" }} />
            <input
              placeholder={
                role === "admin" ? "Search vendors, orders, customers…"
                  : role === "vendor" ? "Search your products & orders…"
                  : "Search your orders…"
              }
            />
          </div>

          <div className="row gap-8" style={{ marginLeft: "auto" }}>
            <button className="btn btn-secondary btn-sm hide-mobile" onClick={openAssistant}>
              <Spark size={14} />
              {role === "admin" ? "Open store" : role === "vendor" ? "View storefront" : "Go shopping"}
            </button>

            {/* Notifications */}
            <div style={{ position: "relative" }}>
              <button className="topbar-icon" onClick={() => setNotifOpen(v => !v)} aria-label="Notifications">
                <I.bell size={20} />
                <span className="notif-dot" />
              </button>

              {notifOpen && (
                <div className="card notif-pop fade-in">
                  <div className="row" style={{ justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
                    <b style={{ fontFamily: "var(--font-ui)", fontSize: 14 }}>Notifications</b>
                    <span className="t-detail" style={{ fontSize: 12 }}>{notifs.length} new</span>
                  </div>
                  {notifs.map((n, i) => {
                    const Ic = (I as Record<string, (p?: {size?: number; style?: React.CSSProperties}) => React.ReactElement>)[n.icon] || I.bell;
                    const tone = TONE[n.tone] || TONE.neutral;
                    return (
                      <div key={i} className="row gap-10" style={{ padding: "13px 16px", borderTop: i ? "1px solid var(--border)" : "none" }}>
                        <span style={{ width: 34, height: 34, borderRadius: 9, background: tone.bg, display: "grid", placeItems: "center", flex: "0 0 auto" }}>
                          <Ic size={16} style={{ color: tone.fg }} />
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontFamily: "var(--font-ui)" }}>{n.text}</div>
                          <div className="t-detail" style={{ fontSize: 11 }}>{n.time} ago</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <Avatar name={displayName} size={34} />
          </div>
        </div>

        {/* Content */}
        <div className="dash-content" onClick={() => notifOpen && setNotifOpen(false)}>
          <div className="dash-inner wide" key={role + section}>
            {role === "admin"    && <AdminDash    section={section} />}
            {role === "vendor"   && <VendorDash   section={section} />}
            {role === "customer" && <CustomerDash section={section} openAssistant={openAssistant} goSection={goSection} onNameChange={setCustomerName} />}
          </div>
        </div>

      </div>
    </div>
  );
}
