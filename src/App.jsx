import { useState, useEffect, useRef, useCallback } from "react";

// ─── Router ───
const routeMap = {
  "/": "home", "/features": "features", "/pricing": "pricing",
  "/how-it-works": "howItWorks", "/industries": "industries",
  "/about": "about", "/contact": "contact",
};
function useRouter() {
  const [path, setPath] = useState("/");
  const navigate = (to) => { setPath(to); window.scrollTo({ top: 0, behavior: "instant" }); };
  return { path, navigate, page: routeMap[path] || "home" };
}

// ─── Design Tokens ───
const T = {
  font: { display: "'Outfit', sans-serif", body: "'Source Sans 3', sans-serif", mono: "'JetBrains Mono', monospace" },
  color: {
    bg: "#08090C", surface: "rgba(255,255,255,0.025)", surfaceHover: "rgba(255,255,255,0.05)",
    border: "rgba(255,255,255,0.06)", borderHover: "rgba(255,120,50,0.35)",
    text: "#fff", textMuted: "rgba(255,255,255,0.55)", textFaint: "rgba(255,255,255,0.35)",
    accent: "#FF6B2C", accentLight: "#FF8F5E", accentDark: "#E04A10",
    accentGlow: "rgba(255,107,44,0.2)", green: "#34D399", red: "#F87171",
  },
};

// ─── Shared Components ───
function Nav({ navigate, currentPath }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { label: "How It Works", path: "/how-it-works" },
    { label: "Features", path: "/features" },
    { label: "Industries", path: "/industries" },
    { label: "Pricing", path: "/pricing" },
    { label: "About", path: "/about" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      background: scrolled ? "rgba(8,9,12,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(24px) saturate(1.4)" : "none",
      borderBottom: scrolled ? `1px solid ${T.color.border}` : "1px solid transparent",
      transition: "all 0.5s cubic-bezier(0.4,0,0.2,1)",
    }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68, padding: "0 clamp(16px, 4vw, 40px)" }}>
        <div onClick={() => navigate("/")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%, #FF8F5E, #FF3D00, #B82800)`, boxShadow: "0 0 24px rgba(255,61,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z" fill="white" opacity="0.95"/></svg>
          </div>
          <span style={{ fontFamily: T.font.display, fontWeight: 800, fontSize: 20, letterSpacing: "-0.03em", background: "linear-gradient(135deg, #fff 30%, #FF8F5E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>MAGMA AI</span>
        </div>
        <div className="dsk-nav" style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {links.map((l) => (
            <span key={l.path} onClick={() => navigate(l.path)} style={{
              color: currentPath === l.path ? T.color.accent : T.color.textMuted,
              fontFamily: T.font.body, fontSize: 14, fontWeight: 600, cursor: "pointer",
              transition: "color 0.3s", letterSpacing: "0.01em",
            }}
              onMouseEnter={(e) => e.target.style.color = T.color.accent}
              onMouseLeave={(e) => e.target.style.color = currentPath === l.path ? T.color.accent : T.color.textMuted}
            >{l.label}</span>
          ))}
          <button onClick={() => navigate("/contact")} style={{
            background: `linear-gradient(135deg, ${T.color.accent}, ${T.color.accentDark})`,
            color: "#fff", border: "none", borderRadius: 8, padding: "9px 22px",
            fontFamily: T.font.body, fontSize: 13, fontWeight: 700, cursor: "pointer",
            boxShadow: `0 4px 20px rgba(255,61,0,0.3)`, transition: "all 0.3s",
          }}>Book a Demo</button>
        </div>
        <div className="mob-tog" onClick={() => setOpen(!open)} style={{ cursor: "pointer", padding: 8, display: "none" }}>
          {[0,1,2].map(i => <div key={i} style={{ width: 22, height: 2, background: "#fff", marginBottom: i < 2 ? 5 : 0, transition: "all 0.3s", transform: open ? (i===0?"rotate(45deg) translate(3.5px,3.5px)":i===2?"rotate(-45deg) translate(3.5px,-3.5px)":"scaleX(0)") : "none", opacity: open && i===1 ? 0 : 1 }} />)}
        </div>
      </div>
      {open && <div style={{ position: "fixed", top: 68, left: 0, right: 0, bottom: 0, background: "rgba(8,9,12,0.98)", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 20, zIndex: 199 }}>
        {links.map(l => <div key={l.path} onClick={() => { navigate(l.path); setOpen(false); }} style={{ fontFamily: T.font.display, fontWeight: 700, fontSize: 22, color: "#fff", cursor: "pointer" }}>{l.label}</div>)}
        <button onClick={() => { navigate("/contact"); setOpen(false); }} style={{ background: `linear-gradient(135deg, ${T.color.accent}, ${T.color.accentDark})`, color: "#fff", border: "none", borderRadius: 10, padding: "14px 28px", fontFamily: T.font.body, fontSize: 16, fontWeight: 700, cursor: "pointer", marginTop: 12 }}>Book a Demo</button>
      </div>}
      <style>{`.dsk-nav{display:flex!important}.mob-tog{display:none!important}@media(max-width:900px){.dsk-nav{display:none!important}.mob-tog{display:block!important}}`}</style>
    </nav>
  );
}

function Footer({ navigate }) {
  const cols = [
    { t: "Product", items: [["How It Works", "/how-it-works"], ["Features", "/features"], ["Pricing", "/pricing"]] },
    { t: "Industries", items: [["All Industries", "/industries"], ["Real Estate", "/industries"], ["Healthcare", "/industries"], ["Retail & Salons", "/industries"]] },
    { t: "Company", items: [["About", "/about"], ["Contact", "/contact"], ["Book Demo", "/contact"]] },
  ];
  return (
    <footer style={{ borderTop: `1px solid ${T.color.border}`, padding: "64px clamp(16px,4vw,40px) 32px" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", display: "grid", gridTemplateColumns: "2fr repeat(3, 1fr)", gap: 40, marginBottom: 48 }} className="ftr-grid">
        <div>
          <div style={{ fontFamily: T.font.display, fontWeight: 800, fontSize: 22, color: T.color.accent, marginBottom: 12 }}>MAGMA AI</div>
          <p style={{ color: T.color.textFaint, fontFamily: T.font.body, fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>AI agents that don't just talk — they qualify leads, book appointments, send reminders, and close the loop. For any industry.</p>
          <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.03)", border: `1px solid ${T.color.border}`, borderRadius: 6, padding: "5px 10px" }}>
            <span style={{ fontSize: 12 }}>🦞</span>
            <span style={{ fontFamily: T.font.mono, fontSize: 10, color: T.color.textFaint, fontWeight: 500 }}>Powered by OpenClaw</span>
          </div>
        </div>
        {cols.map(c => <div key={c.t}><div style={{ color: T.color.textFaint, fontFamily: T.font.body, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", marginBottom: 14 }}>{c.t.toUpperCase()}</div>{c.items.map(([l,p]) => <div key={l} onClick={() => navigate(p)} style={{ color: T.color.textMuted, fontFamily: T.font.body, fontSize: 14, padding: "5px 0", cursor: "pointer" }} onMouseEnter={e=>e.target.style.color=T.color.accent} onMouseLeave={e=>e.target.style.color=T.color.textMuted}>{l}</div>)}</div>)}
      </div>
      <div style={{ borderTop: `1px solid ${T.color.border}`, paddingTop: 20, textAlign: "center" }}>
        <span style={{ color: T.color.textFaint, fontFamily: T.font.body, fontSize: 12 }}>© 2026 Magma AI · All rights reserved</span>
      </div>
      <style>{`@media(max-width:700px){.ftr-grid{grid-template-columns:1fr 1fr!important}}`}</style>
    </footer>
  );
}

function Heading({ eyebrow, title, sub, center = true, maxW = 700 }) {
  return (
    <div style={{ textAlign: center ? "center" : "left", marginBottom: 48 }}>
      {eyebrow && <div style={{ color: T.color.accent, fontFamily: T.font.mono, fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>{eyebrow}</div>}
      <h2 style={{ fontFamily: T.font.display, fontWeight: 800, fontSize: "clamp(26px,4.5vw,46px)", color: T.color.text, lineHeight: 1.1, marginBottom: sub ? 16 : 0 }}>{title}</h2>
      {sub && <p style={{ color: T.color.textMuted, fontFamily: T.font.body, fontSize: "clamp(15px,1.6vw,18px)", lineHeight: 1.7, maxWidth: center ? maxW : "none", margin: center ? "0 auto" : 0 }}>{sub}</p>}
    </div>
  );
}

function Btn({ children, onClick, v = "primary", style: sx = {} }) {
  const p = v === "primary";
  return <button onClick={onClick} style={{ background: p ? `linear-gradient(135deg, ${T.color.accent}, ${T.color.accentDark})` : "transparent", color: "#fff", border: p ? "none" : `1px solid ${T.color.borderHover}`, borderRadius: 10, padding: "13px 30px", fontFamily: T.font.body, fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: p ? "0 4px 24px rgba(255,61,0,0.25)" : "none", transition: "all 0.3s", ...sx }}>{children}</button>;
}

function Card({ children, style: sx = {}, hover = true }) {
  return <div style={{ background: T.color.surface, border: `1px solid ${T.color.border}`, borderRadius: 16, padding: "28px 24px", transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)", ...sx }}
    onMouseEnter={hover ? (e) => { e.currentTarget.style.borderColor = T.color.borderHover; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.3)"; } : undefined}
    onMouseLeave={hover ? (e) => { e.currentTarget.style.borderColor = T.color.border; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; } : undefined}
  >{children}</div>;
}

// ─── Lead Lifecycle Flow Chart ───
function LeadFlowChart() {
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const steps = [
    { id: 0, icon: "📥", label: "Lead Comes In", sub: "WhatsApp message or phone call", color: "#3B82F6", detail: "A potential customer reaches out via WhatsApp, phone call, or missed call. Magma picks up instantly — no waiting, no IVR menus, no hold music. Available 24/7 in 40+ languages — and customizable in any language you need.", side: "left" },
    { id: 1, icon: "🤖", label: "AI Handles the Query", sub: "Qualifies, answers questions, handles objections", color: "#8B5CF6", detail: "Magma understands the enquiry, asks qualifying questions (budget, preferences, timeline), answers FAQs, and handles objections — all in the customer's language. Not scripted — truly conversational.", side: "right" },
    { id: 2, icon: "📋", label: "Lead Forwarded to Agent", sub: "Hot lead routed to the assigned salesperson", color: "#EC4899", detail: "Qualified leads are instantly forwarded to the assigned agent with the complete conversation transcript, qualification score, and customer preferences. The agent knows everything before saying hello.", side: "left" },
    { id: 3, icon: "📅", label: "Appointment Booked", sub: "Google Calendar event created automatically", color: "#F59E0B", detail: "Magma checks the agent's real-time calendar availability, books the appointment, and creates a Google Calendar event for both parties. Time, date, attendees — all handled automatically.", side: "right" },
    { id: 4, icon: "📍", label: "Location Sent to Customer", sub: "Meeting venue shared via WhatsApp with map pin", color: "#10B981", detail: "The office address, site location, or clinic details are sent to the customer on WhatsApp with a Google Maps pin — immediately after booking. No manual follow-up needed.", side: "left" },
    { id: 5, icon: "⏰", label: "Reminder Call Before Meeting", sub: "AI calls customer to confirm attendance", color: "#06B6D4", detail: "A few hours before the meeting, Magma calls the customer to confirm they're coming, offers rescheduling if needed, and notifies the agent of the confirmation status.", side: "right" },
    { id: 6, icon: "🔔", label: "Agent Informed", sub: "Salesperson notified with full context", color: "#F97316", detail: "The assigned agent receives a notification with customer name, conversation summary, preferences, confirmation status, and any special requests — fully prepared to close the deal.", side: "left" },
    { id: 7, icon: "📞", label: "Post-Meeting Follow-up", sub: "AI calls to collect feedback and nurture", color: "#FF6B2C", detail: "After the meeting, Magma follows up with the customer — collects feedback, answers remaining questions, shares additional information, and keeps the lead warm until conversion.", side: "right" },
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => setActiveStep(s => (s + 1) % steps.length), 3200);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ position: "relative", padding: "20px 0" }}>
        <div className="flow-center-line" style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, background: `linear-gradient(180deg, transparent, ${T.color.border} 5%, ${T.color.border} 95%, transparent)`, transform: "translateX(-50%)" }} />

        {steps.map((step, i) => {
          const isActive = i === activeStep;
          const isPast = i < activeStep;
          return (
            <div key={step.id} className="flow-step-row" onClick={() => { setActiveStep(i); setIsAutoPlaying(false); }}
              style={{ display: "grid", gridTemplateColumns: "1fr 56px 1fr", alignItems: "start", marginBottom: i < steps.length - 1 ? 10 : 0, cursor: "pointer", position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "flex-end", paddingRight: 20 }}>
                {step.side === "left" && (
                  <div style={{
                    maxWidth: 380, padding: isActive ? "20px 22px" : "14px 18px", borderRadius: 14,
                    background: isActive ? `linear-gradient(135deg, ${step.color}14, ${step.color}08)` : T.color.surface,
                    border: `1px solid ${isActive ? step.color + "45" : T.color.border}`,
                    transition: "all 0.5s cubic-bezier(0.4,0,0.2,1)",
                    boxShadow: isActive ? `0 8px 32px ${step.color}15` : "none",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: isActive ? 8 : 4 }}>
                      <span style={{ fontSize: isActive ? 20 : 16, transition: "all 0.3s" }}>{step.icon}</span>
                      <h4 style={{ fontFamily: T.font.display, fontWeight: 700, fontSize: isActive ? 16 : 14, color: isActive ? "#fff" : T.color.textMuted, transition: "all 0.3s" }}>{step.label}</h4>
                    </div>
                    <p style={{ fontFamily: T.font.body, fontSize: 12.5, color: T.color.textFaint, lineHeight: 1.4 }}>{step.sub}</p>
                    {isActive && <p style={{ fontFamily: T.font.body, fontSize: 13, color: T.color.textMuted, lineHeight: 1.65, borderTop: `1px solid ${step.color}20`, paddingTop: 10, marginTop: 8 }}>{step.detail}</p>}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", justifyContent: "center", paddingTop: step.side === "left" ? 12 : 12 }}>
                <div style={{
                  width: isActive ? 38 : 26, height: isActive ? 38 : 26, borderRadius: "50%",
                  background: isActive ? step.color : isPast ? step.color + "50" : "rgba(255,255,255,0.06)",
                  border: `2px solid ${isActive ? step.color : isPast ? step.color + "35" : T.color.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.5s cubic-bezier(0.4,0,0.2,1)",
                  boxShadow: isActive ? `0 0 18px ${step.color}50, 0 0 36px ${step.color}18` : "none",
                  zIndex: 2, position: "relative",
                }}>
                  <span style={{ fontFamily: T.font.display, fontWeight: 800, fontSize: isActive ? 13 : 10, color: isActive || isPast ? "#fff" : T.color.textFaint }}>{i + 1}</span>
                </div>
              </div>
              <div style={{ paddingLeft: 20 }}>
                {step.side === "right" && (
                  <div style={{
                    maxWidth: 380, padding: isActive ? "20px 22px" : "14px 18px", borderRadius: 14,
                    background: isActive ? `linear-gradient(135deg, ${step.color}14, ${step.color}08)` : T.color.surface,
                    border: `1px solid ${isActive ? step.color + "45" : T.color.border}`,
                    transition: "all 0.5s cubic-bezier(0.4,0,0.2,1)",
                    boxShadow: isActive ? `0 8px 32px ${step.color}15` : "none",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: isActive ? 8 : 4 }}>
                      <span style={{ fontSize: isActive ? 20 : 16, transition: "all 0.3s" }}>{step.icon}</span>
                      <h4 style={{ fontFamily: T.font.display, fontWeight: 700, fontSize: isActive ? 16 : 14, color: isActive ? "#fff" : T.color.textMuted, transition: "all 0.3s" }}>{step.label}</h4>
                    </div>
                    <p style={{ fontFamily: T.font.body, fontSize: 12.5, color: T.color.textFaint, lineHeight: 1.4 }}>{step.sub}</p>
                    {isActive && <p style={{ fontFamily: T.font.body, fontSize: 13, color: T.color.textMuted, lineHeight: 1.65, borderTop: `1px solid ${step.color}20`, paddingTop: 10, marginTop: 8 }}>{step.detail}</p>}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <style>{`@media(max-width:768px){.flow-step-row{grid-template-columns:36px 1fr!important}.flow-step-row>div:first-child{display:none!important}.flow-step-row>div:last-child{padding-left:14px!important}.flow-step-row>div:last-child>div{max-width:100%!important}.flow-center-line{left:18px!important}}`}</style>
      <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 28 }}>
        {steps.map((s, i) => (
          <div key={i} onClick={() => { setActiveStep(i); setIsAutoPlaying(false); }}
            style={{ width: i === activeStep ? 28 : 7, height: 4, borderRadius: 2, cursor: "pointer", background: i === activeStep ? s.color : i < activeStep ? s.color + "50" : "rgba(255,255,255,0.1)", transition: "all 0.4s" }} />
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 10 }}>
        <span onClick={() => setIsAutoPlaying(!isAutoPlaying)} style={{ fontFamily: T.font.mono, fontSize: 11, color: T.color.textFaint, cursor: "pointer", userSelect: "none" }}>
          {isAutoPlaying ? "⏸ Auto-playing" : "▶ Click to auto-play"}
        </span>
      </div>
    </div>
  );
}

// ─── Voice Dashboard Demo ───
function VoiceDashboardDemo() {
  const [conversation, setConversation] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const prompts = [
    { q: "What happened with leads yesterday?", a: "Yesterday you received 14 new leads. 9 were qualified — 5 from WhatsApp, 4 from calls. 3 site visits were booked for today. 2 leads asked about 3BHK in Sector 45, and 1 lead from Dr. Mehta's clinic rescheduled to Thursday. Rahul's team has the hottest lead — Mrs. Sharma, budget ₹1.2 Cr, ready to visit today at 4 PM." },
    { q: "Tell me about Mrs. Sharma's lead", a: "Mrs. Priya Sharma — inbound WhatsApp enquiry on March 23rd. Looking for a 3BHK in Whitefield, budget ₹1.2 Cr, preferred move-in by August. Qualified score: 92/100. Site visit booked today at 4 PM with Rahul. She had one objection about parking — Magma addressed it with the double-basement info. Follow-up reminder sent at 1 PM. She confirmed attendance." },
    { q: "How many appointments this week?", a: "This week: 23 appointments booked across all projects. 18 confirmed, 3 pending confirmation, 2 rescheduled. Your busiest agent is Rahul with 8 appointments. Conversion rate from appointment to site visit: 78%, up 12% from last week." },
  ];

  const handlePrompt = (prompt) => {
    if (isTyping) return;
    setConversation(c => [...c, { role: "user", text: prompt.q }]);
    setIsTyping(true);
    setTimeout(() => {
      setConversation(c => [...c, { role: "ai", text: prompt.a }]);
      setIsTyping(false);
    }, 1400);
  };

  return (
    <div style={{ maxWidth: 820, margin: "0 auto" }}>
      <Card style={{ padding: 0, overflow: "hidden", border: `1px solid rgba(255,120,50,0.2)` }} hover={false}>
        <div style={{ padding: "14px 22px", borderBottom: `1px solid ${T.color.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.015)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: T.color.green, boxShadow: `0 0 8px ${T.color.green}60`, animation: "pulse 2s infinite" }} />
            <span style={{ fontFamily: T.font.mono, fontSize: 11, color: T.color.textMuted, fontWeight: 600 }}>MAGMA DASHBOARD — VOICE ACTIVE</span>
          </div>
          <div style={{ display: "flex", gap: 5 }}>{["#FF5F57","#FEBC2E","#28C840"].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c, opacity: 0.6 }} />)}</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderBottom: `1px solid ${T.color.border}` }} className="dash-stats">
          {[{ label: "Today's Leads", val: "14", trend: "+23%" }, { label: "Qualified", val: "9", trend: "64%" }, { label: "Appointments", val: "5", trend: "+2" }, { label: "Conversion", val: "78%", trend: "↑12%" }].map(s => (
            <div key={s.label} style={{ padding: "12px 18px", borderRight: `1px solid ${T.color.border}` }}>
              <div style={{ fontFamily: T.font.body, fontSize: 10, color: T.color.textFaint, marginBottom: 3 }}>{s.label}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontFamily: T.font.display, fontWeight: 800, fontSize: 20, color: "#fff" }}>{s.val}</span>
                <span style={{ fontFamily: T.font.mono, fontSize: 10, color: T.color.green }}>{s.trend}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: "18px 22px", minHeight: 180, maxHeight: 300, overflowY: "auto" }}>
          {conversation.length === 0 && (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>🎙️</div>
              <p style={{ fontFamily: T.font.body, fontSize: 14, color: T.color.textFaint }}>Ask your dashboard anything by voice or text</p>
              <p style={{ fontFamily: T.font.mono, fontSize: 11, color: T.color.textFaint, marginTop: 4 }}>Try a prompt below ↓</p>
            </div>
          )}
          {conversation.map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
              <div style={{ maxWidth: "85%", padding: "10px 14px", borderRadius: 12, background: msg.role === "user" ? "rgba(255,107,44,0.14)" : "rgba(255,255,255,0.03)", border: `1px solid ${msg.role === "user" ? "rgba(255,107,44,0.25)" : T.color.border}` }}>
                <p style={{ fontFamily: T.font.body, fontSize: 13, color: msg.role === "user" ? T.color.accentLight : T.color.textMuted, lineHeight: 1.6 }}>{msg.text}</p>
              </div>
            </div>
          ))}
          {isTyping && <div style={{ display: "flex", gap: 4, padding: "10px 14px" }}>{[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: T.color.accent, animation: `bounce 1.4s infinite ${i * 0.16}s` }} />)}</div>}
        </div>

        <div style={{ padding: "14px 22px", borderTop: `1px solid ${T.color.border}`, display: "flex", flexWrap: "wrap", gap: 6 }}>
          {prompts.map((p, i) => (
            <button key={i} onClick={() => handlePrompt(p)} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${T.color.border}`, borderRadius: 8, padding: "7px 12px", color: T.color.textMuted, fontFamily: T.font.body, fontSize: 11.5, cursor: "pointer", transition: "all 0.3s", textAlign: "left" }}
              onMouseEnter={e => { e.target.style.borderColor = T.color.borderHover; e.target.style.color = "#fff"; }}
              onMouseLeave={e => { e.target.style.borderColor = T.color.border; e.target.style.color = T.color.textMuted; }}
            >🎙️ "{p.q}"</button>
          ))}
        </div>
      </Card>
      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}@media(max-width:600px){.dash-stats{grid-template-columns:1fr 1fr!important}}`}</style>
    </div>
  );
}


// ═══════════════════════════════════════════
//  PAGES
// ═══════════════════════════════════════════

function HomePage({ navigate }) {
  const industries = ["Real Estate", "Hospitals", "Dentists", "Salons", "Elevator Companies", "Grocery Stores", "Gyms", "Law Firms", "Auto Dealers", "Insurance", "Coaching Centres", "Restaurants"];
  const [indIdx, setIndIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIndIdx(i => (i + 1) % industries.length), 2000); return () => clearInterval(t); }, []);

  return (
    <div>
      {/* ── HERO ── */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "120px clamp(16px,4vw,40px) 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)", width: "140vw", height: "70vh", background: "radial-gradient(ellipse at center, rgba(255,61,0,0.1) 0%, rgba(255,61,0,0.03) 40%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 960 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: T.color.accentGlow, border: `1px solid ${T.color.borderHover}`, borderRadius: 100, padding: "5px 16px 5px 8px", marginBottom: 28 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.color.green, animation: "pulse 2s infinite" }} />
            <span style={{ fontFamily: T.font.mono, fontSize: 12, color: T.color.textMuted, fontWeight: 500 }}>AI that acts, not just talks</span>
          </div>

          <h1 style={{ fontFamily: T.font.display, fontWeight: 800, fontSize: "clamp(34px,6.5vw,76px)", lineHeight: 1.04, color: T.color.text, marginBottom: 12 }}>
            Your AI Employee That<br/>
            <span style={{ background: `linear-gradient(135deg, ${T.color.accent}, ${T.color.accentLight}, #FFD0A8)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Actually Gets Things Done
            </span>
          </h1>

          <p style={{ fontFamily: T.font.body, fontSize: "clamp(16px,2vw,20px)", color: T.color.textMuted, lineHeight: 1.7, maxWidth: 650, margin: "0 auto 20px" }}>
            Not another chatbot. Magma answers calls, qualifies leads, books appointments, sends locations, makes reminder calls, follows up after meetings, and reports to you by voice.
          </p>

          <div style={{ marginBottom: 36, height: 28, overflow: "hidden" }}>
            <p style={{ fontFamily: T.font.mono, fontSize: 14, color: T.color.textFaint }}>
              Built for <span style={{ color: T.color.accent, fontWeight: 700 }} key={indIdx}>{industries[indIdx]}</span> — and any business that takes calls
            </p>
          </div>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn onClick={() => navigate("/contact")}>Book a Free Demo</Btn>
            <Btn v="secondary" onClick={() => navigate("/how-it-works")}>See the Full Flow →</Btn>
          </div>
        </div>
      </section>

      {/* ── AI THAT ACTS — Comparison ── */}
      <section style={{ padding: "80px clamp(16px,4vw,40px) 100px" }}>
        <Heading eyebrow="The Difference" title="Other AI Talks. Magma Acts." sub="Most AI assistants can only have conversations. Magma completes the entire lead lifecycle — from first contact to closed deal — without human intervention." />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 1000, margin: "0 auto" }} className="acts-grid">
          <Card style={{ borderColor: "rgba(248,113,113,0.15)", background: "rgba(248,113,113,0.03)" }} hover={false}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(248,113,113,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🤷</div>
              <h3 style={{ fontFamily: T.font.display, fontWeight: 700, fontSize: 18, color: T.color.red }}>Other AI Agents</h3>
            </div>
            {["Answers calls but can't book appointments", "Chats on WhatsApp but can't send locations", "Qualifies leads but can't notify agents", "No follow-up calls or reminders", "No calendar integration", "Can't report back on lead status", "One channel only — call OR chat"].map(item => (
              <div key={item} style={{ display: "flex", gap: 10, padding: "7px 0", alignItems: "start" }}>
                <span style={{ color: T.color.red, fontSize: 13, marginTop: 2, fontFamily: T.font.mono }}>✕</span>
                <span style={{ fontFamily: T.font.body, fontSize: 14, color: "rgba(248,113,113,0.6)", lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </Card>
          <Card style={{ borderColor: "rgba(52,211,153,0.2)", background: "rgba(52,211,153,0.03)" }} hover={false}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${T.color.accent}, ${T.color.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
              <h3 style={{ fontFamily: T.font.display, fontWeight: 700, fontSize: 18, color: T.color.green }}>Magma AI</h3>
            </div>
            {["Answers calls AND books on Google Calendar", "Chats on WhatsApp AND sends location pins", "Qualifies leads AND notifies the assigned agent", "Makes reminder calls before every meeting", "Follows up after meetings for feedback", "Voice dashboard — ask about any lead anytime", "Calls + WhatsApp + Dashboard — fully integrated"].map(item => (
              <div key={item} style={{ display: "flex", gap: 10, padding: "7px 0", alignItems: "start" }}>
                <span style={{ color: T.color.green, fontSize: 13, marginTop: 2, fontFamily: T.font.mono }}>✓</span>
                <span style={{ fontFamily: T.font.body, fontSize: 14, color: "rgba(52,211,153,0.75)", lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </Card>
        </div>
        <style>{`@media(max-width:700px){.acts-grid{grid-template-columns:1fr!important}}`}</style>
      </section>

      {/* ── FLOW CHART ── */}
      <section style={{ padding: "80px clamp(16px,4vw,40px) 100px", background: "linear-gradient(180deg, rgba(255,61,0,0.02) 0%, transparent 50%, rgba(255,61,0,0.02) 100%)" }}>
        <Heading eyebrow="The Complete Loop" title="From First Call to Closed Deal" sub="Click any step to see exactly what Magma does. This isn't a roadmap — this is what happens with every single lead, automatically." />
        <LeadFlowChart />
      </section>

      {/* ── VOICE DASHBOARD ── */}
      <section style={{ padding: "80px clamp(16px,4vw,40px) 100px" }}>
        <Heading eyebrow="Voice Dashboard" title={<>Just Ask. <span style={{ color: T.color.accent }}>Magma Answers.</span></>} sub="No more digging through CRMs. Ask your dashboard what happened yesterday, the status of any lead, or how many appointments are booked — and get an instant spoken response." />
        <VoiceDashboardDemo />
      </section>

      {/* ── INDUSTRIES GRID ── */}
      <section style={{ padding: "80px clamp(16px,4vw,40px)" }}>
        <Heading eyebrow="Any Industry" title="If Your Business Takes Calls, Magma Works" sub="We're not limited to one vertical. Any business that handles inbound calls, outbound follow-ups, or WhatsApp enquiries can use Magma." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 10, maxWidth: 1100, margin: "0 auto" }}>
          {[
            { emoji: "🏢", name: "Real Estate", live: true }, { emoji: "🏥", name: "Hospitals" }, { emoji: "🦷", name: "Dentists" },
            { emoji: "💇", name: "Salons & Spas" }, { emoji: "🛗", name: "Elevator Cos." }, { emoji: "🛒", name: "Grocery Stores" },
            { emoji: "🏋️", name: "Gyms & Fitness" }, { emoji: "⚖️", name: "Law Firms" }, { emoji: "🚗", name: "Auto Dealers" },
            { emoji: "🛡️", name: "Insurance" }, { emoji: "📚", name: "Coaching" }, { emoji: "🍽️", name: "Restaurants" },
            { emoji: "🏨", name: "Hotels" }, { emoji: "💼", name: "Consulting" }, { emoji: "🔧", name: "Home Services" },
            { emoji: "🧪", name: "Diagnostic Labs" }, { emoji: "💰", name: "Finance" }, { emoji: "🏫", name: "Schools" },
          ].map(ind => (
            <div key={ind.name} onClick={() => navigate("/industries")} style={{
              padding: "18px 12px", borderRadius: 12, textAlign: "center",
              background: T.color.surface, border: `1px solid ${ind.live ? "rgba(52,211,153,0.25)" : T.color.border}`,
              transition: "all 0.3s", cursor: "pointer", position: "relative",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.color.borderHover; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = ind.live ? "rgba(52,211,153,0.25)" : T.color.border; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {ind.live && <div style={{ position: "absolute", top: 7, right: 7, width: 6, height: 6, borderRadius: "50%", background: T.color.green, boxShadow: `0 0 6px ${T.color.green}` }} />}
              <div style={{ fontSize: 26, marginBottom: 6 }}>{ind.emoji}</div>
              <div style={{ fontFamily: T.font.body, fontSize: 12, fontWeight: 600, color: T.color.textMuted }}>{ind.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PLUG & PLAY ── */}
      <section style={{ padding: "40px clamp(16px,4vw,40px) 80px" }}>
        <div style={{ maxWidth: 920, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
          {[
            { icon: "📦", title: "We Configure & Ship", desc: "Tell us your business. We build your AI agent on OpenClaw's proven platform, load it onto a dedicated Mac Mini, and ship it to you. Zero technical knowledge needed." },
            { icon: "🔌", title: "You Plug In", desc: "Connect the Mac Mini to power and internet. That's literally all the setup. Your AI employee starts working immediately." },
            { icon: "🌐", title: "40+ Languages & Counting", desc: "Hindi, Tamil, Telugu, Kannada, Arabic, Spanish, French, Mandarin — and any language you need. We'll configure your AI to speak your customer's language, no matter what it is." },
          ].map(c => <Card key={c.title}><span style={{ fontSize: 30, marginBottom: 14, display: "block" }}>{c.icon}</span><h3 style={{ fontFamily: T.font.display, fontWeight: 700, fontSize: 17, color: "#fff", marginBottom: 8 }}>{c.title}</h3><p style={{ fontFamily: T.font.body, fontSize: 14, color: T.color.textMuted, lineHeight: 1.7 }}>{c.desc}</p></Card>)}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: "40px clamp(16px,4vw,40px) 100px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center", background: `linear-gradient(135deg, rgba(255,61,0,0.1), rgba(255,107,44,0.04))`, border: `1px solid ${T.color.borderHover}`, borderRadius: 24, padding: "52px 32px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-40%", right: "-15%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,61,0,0.06), transparent 70%)", pointerEvents: "none" }} />
          <h2 style={{ fontFamily: T.font.display, fontWeight: 800, fontSize: "clamp(24px,4vw,36px)", color: "#fff", marginBottom: 12, position: "relative" }}>Stop Losing Leads. Start Closing Them.</h2>
          <p style={{ color: T.color.textMuted, fontFamily: T.font.body, fontSize: 16, marginBottom: 28, position: "relative", maxWidth: 480, margin: "0 auto 28px" }}>See Magma handle a live call in your language, with your business scripts, in under 15 minutes.</p>
          <Btn onClick={() => navigate("/contact")}>Book Your Free Demo</Btn>
        </div>
      </section>
    </div>
  );
}

function HowItWorksPage({ navigate }) {
  return (
    <div style={{ paddingTop: 100 }}>
      <section style={{ padding: "40px clamp(16px,4vw,40px) 60px" }}>
        <Heading eyebrow="How It Works" title="The Complete Lead Lifecycle" sub="From the moment a lead contacts you to the post-meeting follow-up — Magma handles every step. Click each step to see the details." />
      </section>
      <section style={{ padding: "0 clamp(16px,4vw,40px) 80px" }}><LeadFlowChart /></section>

      <section style={{ padding: "60px clamp(16px,4vw,40px) 80px", background: "rgba(255,61,0,0.015)" }}>
        <Heading eyebrow="Key Difference" title="It's Not a Chatbot. It's an Employee." />
        <div style={{ maxWidth: 920, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 18 }}>
          {[
            { icon: "📅", title: "Books Real Appointments", desc: "Creates Google Calendar events with correct times, attendees, and details. Not a suggestion — an actual booking." },
            { icon: "📍", title: "Sends Real Locations", desc: "Shares Google Maps pins via WhatsApp so customers know exactly where to go." },
            { icon: "📞", title: "Makes Real Calls", desc: "Calls the customer before the meeting to confirm. Calls after to follow up." },
            { icon: "🔔", title: "Notifies Real People", desc: "Your agent gets an instant notification with full context — name, preferences, score, history." },
            { icon: "🗣️", title: "Reports by Voice", desc: "Ask 'what happened yesterday?' and hear a spoken brief. No clicking, no scrolling." },
            { icon: "🔄", title: "Closes the Loop", desc: "Follows up, nurtures, reminds, and reports — until the deal is done." },
          ].map(f => <Card key={f.title}><span style={{ fontSize: 26, marginBottom: 10, display: "block" }}>{f.icon}</span><h3 style={{ fontFamily: T.font.display, fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 6 }}>{f.title}</h3><p style={{ fontFamily: T.font.body, fontSize: 13, color: T.color.textMuted, lineHeight: 1.7 }}>{f.desc}</p></Card>)}
        </div>
      </section>

      <section style={{ padding: "80px clamp(16px,4vw,40px) 80px" }}>
        <Heading eyebrow="Voice-Powered Dashboard" title="Ask About Any Lead. Get an Instant Answer." sub="Your dashboard doesn't just show data — it talks to you. Ask about yesterday's leads, a specific customer, or this week's pipeline." />
        <VoiceDashboardDemo />
      </section>

      <section style={{ padding: "40px clamp(16px,4vw,40px) 100px", textAlign: "center" }}>
        <Btn onClick={() => navigate("/contact")}>See This In Action — Book a Demo</Btn>
      </section>
    </div>
  );
}

function FeaturesPage({ navigate }) {
  return (
    <div style={{ paddingTop: 100, padding: "100px clamp(16px,4vw,40px) 80px" }}>
      <Heading eyebrow="Features" title="Everything Your AI Employee Can Do" sub="Magma isn't a tool you use — it's a team member that works independently, across channels, in any language." />
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {[
          { cat: "Communication", features: [
            { icon: "📞", title: "Inbound Call Handling", desc: "Picks up every call instantly. Natural voice powered by ElevenLabs in the customer's language." },
            { icon: "📤", title: "Outbound Follow-up Calls", desc: "Proactively calls leads who enquired but didn't convert. Handles objections on pricing and competition." },
            { icon: "💬", title: "WhatsApp Business Chat", desc: "Full WhatsApp Business API integration. Shares images, PDFs, location pins. Carries context across messages." },
            { icon: "⏰", title: "Pre-Meeting Reminder Calls", desc: "Calls the customer before the meeting. Confirms attendance, offers rescheduling, updates the agent." },
            { icon: "📞", title: "Post-Meeting Follow-up", desc: "Follows up — collects feedback, answers questions, shares info, keeps the lead warm." },
          ]},
          { cat: "Actions", features: [
            { icon: "📅", title: "Google Calendar Integration", desc: "Checks availability and books appointments. Creates events for both customer and agent. Handles rescheduling." },
            { icon: "📍", title: "Location Sharing", desc: "Sends meeting venue via WhatsApp with Google Maps pin — automatically after booking." },
            { icon: "🔔", title: "Agent Notifications", desc: "Instant notifications to the assigned salesperson with full lead context and conversation transcript." },
            { icon: "📋", title: "Smart Lead Routing", desc: "Routes leads to the right agent based on project, language, location, or round-robin rules." },
            { icon: "🔄", title: "Human Handoff", desc: "Seamlessly transfers to a human with full context when the situation requires personal attention." },
          ]},
          { cat: "Intelligence", features: [
            { icon: "🗣️", title: "Voice-Powered Dashboard", desc: "Ask anything by voice — lead status, daily summary, pipeline. Magma speaks the answer." },
            { icon: "🛡️", title: "Objection Handling", desc: "Trained on your industry-specific objections. Handles pricing, timing, and competitor comparisons." },
            { icon: "🌐", title: "40+ Languages, Any Custom", desc: "Hindi, Tamil, Telugu, Kannada, Bengali, Arabic, English, and 35+ more out of the box. Need a language we don't have? We'll add it. Your AI speaks whatever your customers speak." },
            { icon: "📊", title: "Analytics & Reporting", desc: "Lead volume, qualification rates, conversion funnels, agent performance, and AI confidence scores." },
          ]},
        ].map(section => (
          <div key={section.cat} style={{ marginBottom: 56 }}>
            <div style={{ fontFamily: T.font.mono, fontSize: 12, fontWeight: 700, color: T.color.accent, letterSpacing: "0.12em", marginBottom: 18, textTransform: "uppercase" }}>{section.cat}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 14 }}>
              {section.features.map(f => (
                <Card key={f.title}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span style={{ fontSize: 20 }}>{f.icon}</span>
                    <h3 style={{ fontFamily: T.font.display, fontWeight: 700, fontSize: 14, color: "#fff" }}>{f.title}</h3>
                  </div>
                  <p style={{ fontFamily: T.font.body, fontSize: 13, color: T.color.textMuted, lineHeight: 1.65 }}>{f.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        ))}
        <div style={{ textAlign: "center", marginTop: 20 }}><Btn onClick={() => navigate("/contact")}>Get a Personalized Demo</Btn></div>
      </div>
    </div>
  );
}

function IndustriesPage({ navigate }) {
  const [selected, setSelected] = useState("real-estate");
  const industries = {
    "real-estate": { emoji: "🏢", name: "Real Estate", live: true, desc: "Qualify property enquiries, schedule site visits, send brochures, and follow up — in their language.", useCases: ["Inbound enquiry qualification (budget, BHK, location)", "Site visit booking on Google Calendar", "Location pin shared via WhatsApp", "Reminder call before site visit", "Post-visit follow-up and feedback", "Objection handling (pricing, location, reputation)"] },
    "hospitals": { emoji: "🏥", name: "Hospitals & Clinics", desc: "Book OPD appointments, handle enquiries, send doctor availability, reduce front-desk burden.", useCases: ["Patient appointment booking", "Doctor availability sharing", "Prescription refill requests", "Post-visit follow-up calls", "Appointment reminders to reduce no-shows", "Emergency call routing"] },
    "dentists": { emoji: "🦷", name: "Dental Clinics", desc: "Schedule appointments, send clinic location, remind patients, follow up after treatments.", useCases: ["Appointment booking for checkups and procedures", "Treatment cost enquiry handling", "Clinic location via WhatsApp", "Pre-appointment reminders", "Post-treatment follow-up", "Review collection"] },
    "salons": { emoji: "💇", name: "Salons & Spas", desc: "Book appointments, share service menus, handle package enquiries, send reminders.", useCases: ["Service booking by specialist and time", "Package and pricing enquiry handling", "Stylist availability checking", "Appointment reminders", "Feedback collection", "Loyalty program updates"] },
    "elevators": { emoji: "🛗", name: "Elevator Companies", desc: "Handle maintenance requests, schedule technician visits, manage service contracts.", useCases: ["Maintenance request logging", "AMC enquiry and renewal handling", "Technician visit booking", "Emergency breakdown routing", "Service report follow-up", "New installation enquiry qualification"] },
    "grocery": { emoji: "🛒", name: "Grocery & Retail", desc: "Take phone orders, check availability, schedule deliveries, integrate with billing.", useCases: ["Phone order taking in local languages", "Product availability checking", "Delivery slot booking", "Billing integration (Busy/Tally)", "Reorder reminders", "Offer announcements"] },
    "gyms": { emoji: "🏋️", name: "Gyms & Fitness", desc: "Handle membership enquiries, book trials, share class schedules, follow up.", useCases: ["Membership enquiry and pricing", "Trial session booking", "Class schedule sharing", "Trainer availability checking", "Renewal reminders", "Post-trial follow-up"] },
    "auto": { emoji: "🚗", name: "Auto Dealers", desc: "Qualify vehicle enquiries, schedule test drives, share pricing, follow up.", useCases: ["Vehicle enquiry qualification", "Test drive scheduling", "EMI and pricing handling", "Showroom location sharing", "Post-test-drive follow-up", "Service appointment booking"] },
  };
  const ind = industries[selected];

  return (
    <div style={{ paddingTop: 100, padding: "100px clamp(16px,4vw,40px) 80px" }}>
      <Heading eyebrow="Industries" title="Built for Any Business That Takes Calls" sub="Magma adapts to your industry, your scripts, your objections, and your workflow." />
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "240px 1fr", gap: 28 }} className="ind-layout">
        <div>
          {Object.entries(industries).map(([key, val]) => (
            <div key={key} onClick={() => setSelected(key)} style={{ padding: "12px 16px", borderRadius: 10, cursor: "pointer", background: selected === key ? T.color.accentGlow : "transparent", border: `1px solid ${selected === key ? T.color.borderHover : "transparent"}`, marginBottom: 3, display: "flex", alignItems: "center", gap: 10, transition: "all 0.3s" }}>
              <span style={{ fontSize: 18 }}>{val.emoji}</span>
              <span style={{ fontFamily: T.font.body, fontSize: 13.5, fontWeight: 600, color: selected === key ? "#fff" : T.color.textMuted }}>{val.name}</span>
              {val.live && <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: T.color.green, boxShadow: `0 0 6px ${T.color.green}` }} />}
            </div>
          ))}
        </div>
        <Card hover={false} style={{ padding: "32px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 34 }}>{ind.emoji}</span>
            <h2 style={{ fontFamily: T.font.display, fontWeight: 800, fontSize: 24, color: "#fff" }}>{ind.name}</h2>
            {ind.live && <span style={{ fontFamily: T.font.mono, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: "rgba(52,211,153,0.15)", color: T.color.green }}>LIVE</span>}
          </div>
          <p style={{ fontFamily: T.font.body, fontSize: 15, color: T.color.textMuted, lineHeight: 1.7, marginBottom: 24, maxWidth: 560 }}>{ind.desc}</p>
          <h4 style={{ fontFamily: T.font.display, fontWeight: 700, fontSize: 15, color: T.color.accent, marginBottom: 14 }}>What Magma Does</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }} className="uc-grid">
            {ind.useCases.map(uc => (
              <div key={uc} style={{ display: "flex", gap: 8, alignItems: "start", padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,0.02)" }}>
                <span style={{ color: T.color.green, fontFamily: T.font.mono, fontSize: 12, marginTop: 2 }}>✓</span>
                <span style={{ fontFamily: T.font.body, fontSize: 13, color: T.color.textMuted, lineHeight: 1.5 }}>{uc}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24, padding: "16px 18px", borderRadius: 12, background: "rgba(255,107,44,0.05)", border: `1px solid rgba(255,107,44,0.12)` }}>
            <p style={{ fontFamily: T.font.body, fontSize: 13, color: T.color.textMuted, lineHeight: 1.6 }}>
              <strong style={{ color: "#fff" }}>Don't see your industry?</strong> Magma works for any business that handles calls, WhatsApp messages, or appointment bookings.
            </p>
          </div>
          <div style={{ marginTop: 20 }}><Btn onClick={() => navigate("/contact")}>Get a Demo for {ind.name}</Btn></div>
        </Card>
      </div>
      <style>{`@media(max-width:768px){.ind-layout{grid-template-columns:1fr!important}.uc-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}

function PricingPage({ navigate }) {
  const [region, setRegion] = useState("india");
  const plans = {
    india: [
      { name: "Starter", setup: "₹1,00,000", mo: "₹10,000/mo", desc: "For businesses getting started with AI voice.", features: ["1 AI voice agent", "Inbound calls", "Up to 5 languages", "Google Calendar booking", "WhatsApp chat", "Basic dashboard", "Email support"] },
      { name: "Growth", setup: "₹1,25,000", mo: "₹15,000/mo", desc: "Outbound calls, follow-ups, and voice dashboard.", features: ["2 AI agents", "Inbound + Outbound", "Up to 15 languages", "WhatsApp + location sharing", "Reminder & follow-up calls", "Objection handling", "Voice dashboard", "Priority support"], pop: true },
      { name: "Enterprise", setup: "₹1,50,000", mo: "₹20,000/mo", desc: "For large operations with custom needs.", features: ["Unlimited agents", "All channels", "40+ languages + any custom", "Custom integrations", "Multi-project support", "Full voice dashboard", "Dedicated manager", "SLA guarantee", "API access"] },
    ],
    dubai: [
      { name: "Starter", setup: "AED 5,000", mo: "AED 2,000/mo", desc: "Enter the UAE market with AI voice.", features: ["1 AI voice agent", "Inbound calls", "Up to 5 languages", "Google Calendar", "DNCR compliance", "Email support"] },
      { name: "Growth", setup: "AED 7,500", mo: "AED 3,500/mo", desc: "Multi-channel AI for the Dubai market.", features: ["2 AI agents", "Inbound + Outbound", "Up to 15 languages", "WhatsApp integration", "DNCR compliance", "Objection handling", "Voice dashboard", "Priority support"], pop: true },
      { name: "Enterprise", setup: "AED 10,000", mo: "AED 5,000/mo", desc: "Full-featured solution for large firms.", features: ["Unlimited agents", "All channels", "40+ languages + any custom", "DNCR compliance", "Custom integrations", "Voice dashboard", "Dedicated manager", "SLA guarantee", "API access"] },
    ],
  };

  return (
    <div style={{ paddingTop: 100, padding: "100px clamp(16px,4vw,40px) 80px" }}>
      <Heading eyebrow="Pricing" title="Hardware + Setup + Monthly Support" sub="One-time fee for your pre-configured Mac Mini and setup. Monthly fee for ongoing AI maintenance, updates, and support." />
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
        <div style={{ display: "inline-flex", background: T.color.surface, border: `1px solid ${T.color.border}`, borderRadius: 10, padding: 3 }}>
          {[["india","🇮🇳 India"],["dubai","🇦🇪 Dubai"]].map(([k,l]) => (
            <button key={k} onClick={() => setRegion(k)} style={{ background: region === k ? T.color.accentGlow : "transparent", border: region === k ? `1px solid ${T.color.borderHover}` : "1px solid transparent", color: region === k ? T.color.accent : T.color.textMuted, borderRadius: 8, padding: "9px 22px", fontFamily: T.font.body, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.3s" }}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18, maxWidth: 1020, margin: "0 auto" }}>
        {plans[region].map(p => (
          <div key={p.name} style={{ background: p.pop ? "rgba(255,107,44,0.04)" : T.color.surface, border: `1px solid ${p.pop ? T.color.borderHover : T.color.border}`, borderRadius: 20, padding: "30px 22px", position: "relative", transform: p.pop ? "scale(1.02)" : "none" }}>
            {p.pop && <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", background: `linear-gradient(135deg, ${T.color.accent}, ${T.color.accentDark})`, padding: "4px 14px", borderRadius: 100, fontFamily: T.font.mono, fontSize: 11, fontWeight: 700, color: "#fff" }}>POPULAR</div>}
            <h3 style={{ fontFamily: T.font.display, fontWeight: 700, fontSize: 22, color: "#fff", marginBottom: 6 }}>{p.name}</h3>
            <p style={{ fontFamily: T.font.body, fontSize: 13, color: T.color.textFaint, marginBottom: 18, lineHeight: 1.5 }}>{p.desc}</p>
            <div style={{ marginBottom: 4 }}><span style={{ fontFamily: T.font.display, fontWeight: 800, fontSize: 28, color: "#fff" }}>{p.setup}</span><span style={{ fontFamily: T.font.body, fontSize: 13, color: T.color.textFaint }}> one-time</span></div>
            <div style={{ marginBottom: 22 }}><span style={{ fontFamily: T.font.display, fontWeight: 700, fontSize: 19, color: T.color.accent }}>{p.mo}</span></div>
            <div style={{ borderTop: `1px solid ${T.color.border}`, paddingTop: 14, marginBottom: 18 }}>
              {p.features.map(f => <div key={f} style={{ display: "flex", gap: 8, padding: "4px 0" }}><span style={{ color: T.color.accent, fontFamily: T.font.mono, fontSize: 12 }}>✓</span><span style={{ fontFamily: T.font.body, fontSize: 13, color: T.color.textMuted }}>{f}</span></div>)}
            </div>
            <Btn v={p.pop ? "primary" : "secondary"} onClick={() => navigate("/contact")} style={{ width: "100%", textAlign: "center" }}>Get Started</Btn>
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutPage({ navigate }) {
  return (
    <div style={{ paddingTop: 100, padding: "100px clamp(16px,4vw,40px) 80px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <Heading eyebrow="About" title="We're Building AI Employees, Not Chatbots" center={false} />
        <div style={{ fontFamily: T.font.body, fontSize: 16, color: T.color.textMuted, lineHeight: 1.9 }}>
          <p style={{ marginBottom: 20 }}>Magma AI started from a simple frustration: businesses lose leads not because their product is bad, but because no one picked up the phone. Or picked up but forgot to follow up. Or followed up but in the wrong language. Or booked a meeting but forgot to send the location.</p>
          <p style={{ marginBottom: 20 }}>We didn't want to build another chatbot that just "talks." We wanted an AI that <strong style={{ color: "#fff" }}>actually does things</strong> — books real appointments on Google Calendar, sends real location pins on WhatsApp, makes real reminder calls, and reports back to you by voice.</p>
          <p style={{ marginBottom: 20 }}>The result is Magma: an AI employee that handles the complete lead lifecycle from first contact to closed deal. It works for real estate developers, hospitals, dental clinics, salons, elevator companies, grocery stores — any business that takes calls and books appointments.</p>
          <p>Our plug-and-play approach means you don't need a tech team. We build your AI agent on OpenClaw's open-source platform, configure it for your industry, load it onto a dedicated Mac Mini, and ship it to you. Plug it in, and your AI employee starts working. Your data stays on your hardware — private, secure, and always under your control.</p>
        </div>
        <div style={{ margin: "44px 0", padding: "28px", background: "rgba(255,107,44,0.06)", border: `1px solid ${T.color.borderHover}`, borderRadius: 16 }}>
          <h3 style={{ fontFamily: T.font.display, fontWeight: 700, fontSize: 20, color: "#fff", marginBottom: 10 }}>Our Mission</h3>
          <p style={{ fontFamily: T.font.body, fontSize: 16, color: T.color.accentLight, lineHeight: 1.8, fontStyle: "italic" }}>Give every business an AI employee that works 24/7, speaks every language, and never lets a lead go cold — regardless of industry or technical capability.</p>
        </div>
        {/* Infrastructure */}
        <div style={{ margin: "44px 0" }}>
          <h3 style={{ fontFamily: T.font.display, fontWeight: 700, fontSize: 20, color: "#fff", marginBottom: 20 }}>Our Infrastructure</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            {[
              { icon: "🦞", title: "Built on OpenClaw", desc: "Our agents run on OpenClaw's open-source agent platform — the same technology trusted by 300K+ developers worldwide. Local-first, private by default, and battle-tested." },
              { icon: "🖥️", title: "Dedicated Mac Mini", desc: "Each client gets a dedicated Mac Mini running their AI agent locally. Your data never leaves your hardware. No shared servers, no cloud dependencies." },
              { icon: "🔒", title: "Privacy First", desc: "Conversations, lead data, and recordings stay on your machine. We configure remotely, but your business data is yours — always." },
            ].map(item => (
              <div key={item.title} style={{ padding: "22px 20px", borderRadius: 14, background: T.color.surface, border: `1px solid ${T.color.border}` }}>
                <span style={{ fontSize: 24, marginBottom: 10, display: "block" }}>{item.icon}</span>
                <h4 style={{ fontFamily: T.font.display, fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 6 }}>{item.title}</h4>
                <p style={{ fontFamily: T.font.body, fontSize: 13, color: T.color.textMuted, lineHeight: 1.65 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div style={{ margin: "32px 0 44px" }}>
          <h3 style={{ fontFamily: T.font.display, fontWeight: 700, fontSize: 20, color: "#fff", marginBottom: 16 }}>Tech Stack</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["OpenClaw", "Node.js", "OpenAI Realtime API", "ElevenLabs TTS", "Twilio", "Google Calendar API", "WhatsApp Business API", "Google Sheets"].map(tech => (
              <div key={tech} style={{ padding: "8px 16px", borderRadius: 8, background: T.color.surface, border: `1px solid ${T.color.border}`, fontFamily: T.font.mono, fontSize: 12, color: T.color.textMuted, fontWeight: 500 }}>{tech}</div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 36 }}><Btn onClick={() => navigate("/contact")}>Let's Talk</Btn></div>
      </div>
    </div>
  );
}

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", industry: "", message: "" });
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const upd = (k, v) => setForm({ ...form, [k]: v });
  const inpS = { width: "100%", padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: `1px solid ${T.color.border}`, color: "#fff", fontFamily: T.font.body, fontSize: 15, outline: "none", transition: "border-color 0.3s", boxSizing: "border-box" };

  // ─── SETUP: Replace YOUR_FORM_ID with your Formspree form ID ───
  // 1. Go to https://formspree.io and sign up (free)
  // 2. Click "New Form", name it "Magma Demo Requests"
  // 3. Copy the form ID (looks like "xwpkgjqn")
  // 4. Replace YOUR_FORM_ID below with your actual ID
  const FORMSPREE_ID = "mvzvorep";

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setSending(true);
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
          industry: form.industry,
          message: form.message,
          _subject: `New Demo Request from ${form.name} — ${form.industry || "No industry selected"}`,
        }),
      });
      if (res.ok) {
        setDone(true);
      } else {
        setError("Something went wrong. Please email us at hello@magma-ai.com");
      }
    } catch (err) {
      setError("Connection error. Please email us at hello@magma-ai.com");
    }
    setSending(false);
  };

  if (done) return (
    <div style={{ paddingTop: 100, padding: "160px clamp(16px,4vw,40px)", textAlign: "center" }}>
      <div style={{ fontSize: 52, marginBottom: 18 }}>🎉</div>
      <h2 style={{ fontFamily: T.font.display, fontWeight: 800, fontSize: 32, color: "#fff", marginBottom: 12 }}>Thank You!</h2>
      <p style={{ color: T.color.textMuted, fontFamily: T.font.body, fontSize: 16, maxWidth: 460, margin: "0 auto" }}>We'll reach out within 24 hours to schedule your personalized demo.</p>
    </div>
  );

  return (
    <div style={{ paddingTop: 100, padding: "100px clamp(16px,4vw,40px) 80px" }}>
      <div style={{ maxWidth: 940, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }} className="contact-grid">
        <div>
          <Heading eyebrow="Get Started" title="See Magma In Action" sub="15-minute demo. Live call in your language. Your business scripts." center={false} />
          <div style={{ marginTop: 24 }}>
            {[
              { icon: "📞", t: "Live Call Demo", d: "Watch Magma handle a real conversation in your customer's language." },
              { icon: "🔄", t: "Full Flow Walkthrough", d: "See the lifecycle: call → qualify → book → remind → follow-up." },
              { icon: "🗣️", t: "Voice Dashboard", d: "Ask about leads and hear instant spoken responses." },
            ].map(i => (
              <div key={i.t} style={{ display: "flex", gap: 12, marginBottom: 18 }}>
                <span style={{ fontSize: 20 }}>{i.icon}</span>
                <div><h4 style={{ fontFamily: T.font.display, fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 2 }}>{i.t}</h4><p style={{ fontFamily: T.font.body, fontSize: 13, color: T.color.textFaint }}>{i.d}</p></div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 28, padding: "14px 18px", background: T.color.surface, borderRadius: 12, border: `1px solid ${T.color.border}` }}>
            <div style={{ fontFamily: T.font.body, fontSize: 11, color: T.color.textFaint, marginBottom: 4 }}>Or email us</div>
            <div style={{ fontFamily: T.font.body, fontSize: 15, color: "#fff" }}>hello@magma-ai.com</div>
          </div>
        </div>
        <Card hover={false} style={{ padding: "28px 24px" }}>
          <div style={{ display: "grid", gap: 16 }}>
            {[{ k:"name", l:"Full Name *", ph:"Your name", t:"text" }, { k:"email", l:"Email *", ph:"you@company.com", t:"email" }, { k:"phone", l:"Phone *", ph:"+91 98765 43210", t:"tel" }, { k:"company", l:"Company", ph:"Company name", t:"text" }].map(f => (
              <div key={f.k}><label style={{ display: "block", fontFamily: T.font.body, fontSize: 12, color: T.color.textFaint, fontWeight: 600, marginBottom: 4 }}>{f.l}</label><input type={f.t} value={form[f.k]} onChange={e => upd(f.k, e.target.value)} placeholder={f.ph} style={inpS} onFocus={e => e.target.style.borderColor = T.color.borderHover} onBlur={e => e.target.style.borderColor = T.color.border} /></div>
            ))}
            <div><label style={{ display: "block", fontFamily: T.font.body, fontSize: 12, color: T.color.textFaint, fontWeight: 600, marginBottom: 4 }}>Industry</label><select value={form.industry} onChange={e => upd("industry", e.target.value)} style={{ ...inpS, appearance: "none" }}><option value="" style={{ background: "#12131a" }}>Select your industry</option>{["Real Estate","Hospital / Clinic","Dental Clinic","Salon / Spa","Elevator Company","Grocery / Retail","Gym / Fitness","Auto Dealer","Other"].map(o => <option key={o} value={o} style={{ background: "#12131a" }}>{o}</option>)}</select></div>
            <div><label style={{ display: "block", fontFamily: T.font.body, fontSize: 12, color: T.color.textFaint, fontWeight: 600, marginBottom: 4 }}>Message</label><textarea value={form.message} onChange={e => upd("message", e.target.value)} placeholder="Tell us about your needs..." style={{ ...inpS, minHeight: 70, resize: "vertical" }} onFocus={e => e.target.style.borderColor = T.color.borderHover} onBlur={e => e.target.style.borderColor = T.color.border} /></div>
            <Btn onClick={handleSubmit} style={{ width: "100%", textAlign: "center", opacity: sending ? 0.6 : 1, pointerEvents: sending ? "none" : "auto" }}>{sending ? "Sending..." : "Request Demo"}</Btn>
            {error && <p style={{ fontFamily: T.font.body, fontSize: 12, color: T.color.red, textAlign: "center" }}>{error}</p>}
            <p style={{ fontFamily: T.font.body, fontSize: 11, color: T.color.textFaint, textAlign: "center" }}>We respond within 24 hours. No spam.</p>
          </div>
        </Card>
      </div>
      <style>{`@media(max-width:700px){.contact-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}

// ═══════════════════════════════════════
//  APP
// ═══════════════════════════════════════
export default function App() {
  const { path, navigate, page } = useRouter();
  const render = () => {
    switch (page) {
      case "home": return <HomePage navigate={navigate} />;
      case "howItWorks": return <HowItWorksPage navigate={navigate} />;
      case "features": return <FeaturesPage navigate={navigate} />;
      case "industries": return <IndustriesPage navigate={navigate} />;
      case "pricing": return <PricingPage navigate={navigate} />;
      case "about": return <AboutPage navigate={navigate} />;
      case "contact": return <ContactPage />;
      default: return <HomePage navigate={navigate} />;
    }
  };
  return (
    <div style={{ background: T.color.bg, minHeight: "100vh", fontFamily: T.font.body }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Source+Sans+3:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        ::selection{background:rgba(255,107,44,0.3);color:#fff}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,107,44,0.25);border-radius:3px}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.2)}
        html{scroll-behavior:smooth}
      `}</style>
      <Nav navigate={navigate} currentPath={path} />
      {render()}
      <Footer navigate={navigate} />
    </div>
  );
}
