import { useEffect, useRef, useState } from "react";
import PDF_PAGES from "./pdfPages.json";

// ─────────────────────────────────────────────────────────────
// 콘텐츠 — 여기만 고치면 됨.
// ─────────────────────────────────────────────────────────────
const PROFILE = {
  name: "최승현",
  nameEn: "Choi Seunghyun",
  role: "UE5 Game Client Programmer",
  github: "https://github.com/audidas",
  email: "audidas1197@gmail.com",
  about: "서버를 아는 클라이언트 프로그래머\n백엔드 5년에서 언리얼로\n데디케이티드 서버 멀티플레이 TPS의 네트워크, 턴제 전술 RPG의 적 AI",
};

const PROJECTS = [
  {
    id: "blackout",
    title: "Project Blackout",
    kind: "4인 협동 보스러쉬 TPS",
    accent: "#E0A020",
    role: "클라이언트 · 네트워크 (NET)",
    desc: "데디케이티드 서버 기반 4인 협동 보스러쉬 TPS. 매치메이킹 서버와 세션 흐름(로비, 재접속, 종료 통계), 플레이 데이터 분석 파이프라인 담당.",
    stack: ["UE5", "C++", "Dedicated Server", "AWS", "Nest.js", "Redis"],
    links: [
      { label: "포트폴리오 PDF", href: "/pdf/Project_Blackout_포트폴리오.pdf" },
      { label: "시연 영상", href: "https://www.youtube.com/watch?v=kEN8ivT0YxE" },
      { label: "GitHub", href: "https://github.com/audidas/ProjectBlackout-code" },
    ],
  },
  {
    id: "b3",
    title: "Project B3",
    kind: "BG3 전투 모작 · 턴제 전술 RPG",
    accent: "#9B7BC7",
    role: "적 AI 의사결정",
    desc: "턴제 전투 적 AI. DFS + Branch & Bound 턴 플래너와 Utility 스코어링, StateTree/EQS/GAS 파이프라인 구성.",
    stack: ["UE5", "C++", "Utility AI", "StateTree", "EQS", "GAS"],
    links: [
      { label: "포트폴리오 PDF", href: "/pdf/Project_B3_포트폴리오.pdf" },
      { label: "시연 영상", href: "https://www.youtube.com/watch?v=2lpiPeEUtsQ" },
      { label: "GitHub", href: "https://github.com/audidas/ProjectB3-code" },
    ],
  },
  {
    id: "console",
    title: "ConsoleProject",
    kind: "Slay the Spire 모작",
    accent: "#4FA8C4",
    role: "1인 개발",
    desc: "C++17/SFML 3.0 기반 콘솔 덱빌더. 카드 시스템과 전투 루프를 엔진 없이 구현.",
    stack: ["C++17", "SFML 3.0"],
    links: [
      { label: "포트폴리오 PDF", href: "/pdf/Project_Deckbuilder_포트폴리오.pdf" },
      { label: "GitHub", href: "https://github.com/audidas/ConsoleProject" },
    ],
  },
];

// Dock 아이콘 — 프로젝트별 SVG 글리프
const PROJECT_ICONS = {
  // 몬스터 (보스러쉬)
  blackout: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="#fff">
      <path fillRule="evenodd" d="M12 2.5c-4.1 0-7.5 3.4-7.5 7.5v9.8l2.5-2 2.5 2 2.5-2 2.5 2 2.5-2 2.5 2V10c0-4.1-3.4-7.5-7.5-7.5zM7.5 10.2l3.4 1.2v1.8l-3.4-1.2v-1.8zm9 0v1.8l-3.4 1.2v-1.8l3.4-1.2z" />
    </svg>
  ),
  // 불꽃
  b3: (
    <svg viewBox="0 0 16 16" width="23" height="23" fill="#fff">
      <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16Zm0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15Z" />
    </svg>
  ),
  // 카드 팬 (덱빌더)
  console: (
    <svg viewBox="0 0 24 24" width="25" height="25" fill="#fff">
      <rect x="4" y="5" width="9" height="13" rx="1.5" opacity="0.45" transform="rotate(-12 8.5 11.5)" />
      <rect x="10.5" y="5.5" width="9" height="13" rx="1.5" transform="rotate(10 15 12)" />
    </svg>
  ),
};

// ─────────────────────────────────────────────────────────────
function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(t);
  }, []);
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const h = now.getHours();
  const ampm = h < 12 ? "오전" : "오후";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const m = String(now.getMinutes()).padStart(2, "0");
  return `${days[now.getDay()]} ${now.getMonth() + 1}월 ${now.getDate()}일 ${ampm} ${h12}:${m}`;
}

function TrafficLights({ onClose, onMin, onMax }) {
  const lights = [
    { c: "#FF5F57", b: "#E14640", click: onClose, t: "닫기" },
    { c: "#FEBC2E", b: "#D89E24", click: onMin, t: "최소화" },
    { c: "#28C840", b: "#1DA82F", click: onMax, t: "최대화" },
  ];
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {lights.map((l, i) => (
        <span
          key={i}
          className="tl"
          onClick={l.click}
          title={l.click ? l.t : undefined}
          style={{
            width: 12, height: 12, borderRadius: "50%",
            background: l.c, border: `0.5px solid ${l.b}`, display: "inline-block",
            cursor: l.click ? "pointer" : "default",
          }}
        />
      ))}
    </div>
  );
}

function DockIcon({ label, gradient, char, onClick, href }) {
  const inner = (
    <div className="dock-icon" title={label} style={{
      width: 52, height: 52, borderRadius: 13,
      background: gradient,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 4px 10px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.25)",
      cursor: "pointer", color: "#fff", fontWeight: 700, fontSize: 22,
    }}>
      {char}
    </div>
  );
  if (href) return <a href={href} style={{ textDecoration: "none" }}>{inner}</a>;
  return <div onClick={onClick}>{inner}</div>;
}

export default function App() {
  const [windows, setWindows] = useState([
    { id: 1, section: "about", initPos: { x: 0, y: 0 }, min: false, max: false, z: 1 },
  ]);
  const [openPdf, setOpenPdf] = useState(null);
  const zRef = useRef(1);
  const idRef = useRef(1);
  const clock = useClock();

  // 섹션 창이 이미 있으면 맨 앞으로(최소화 해제), 없으면 계단식 위치에 새 창
  const openSection = (section) => {
    setWindows((ws) => {
      const ex = ws.find((w) => w.section === section);
      if (ex) return ws.map((w) => (w.section === section ? { ...w, min: false, z: ++zRef.current } : w));
      const n = ws.length;
      return [...ws, {
        id: ++idRef.current, section,
        initPos: { x: (n % 5) * 28, y: (n % 5) * 28 },
        min: false, max: false, z: ++zRef.current,
      }];
    });
  };
  const focusWin = (id) => setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, z: ++zRef.current } : w)));
  const closeWin = (id) => setWindows((ws) => ws.filter((w) => w.id !== id));
  const minWin = (id) => setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, min: true } : w)));
  const maxToggleWin = (id) => setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, max: !w.max } : w)));

  useEffect(() => {
    [
      "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css",
      "https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5.0.18/index.min.css",
    ].forEach((href) => {
      const el = document.createElement("link");
      el.rel = "stylesheet";
      el.href = href;
      document.head.appendChild(el);
    });
  }, []);

  const sans = 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif';
  const mono = '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

  return (
    <div style={{
      "--mono": mono, fontFamily: sans,
      height: "100vh",
      // macOS 다크 월페이퍼 느낌
      background: "radial-gradient(ellipse 120% 90% at 50% 0%, #2a2438 0%, #16141f 45%, #0c0b12 100%)",
      display: "flex", flexDirection: "column",
      color: "#f5f5f7", position: "relative", overflow: "hidden",
    }}>
      <style>{`
        /* 섹션 전환 시 새 창이 뜨는 느낌 — translate(드래그 위치)와 충돌하지 않게 scale 단독 속성 사용 */
        @keyframes winPop { from { scale: .96; opacity: 0; } to { scale: 1; opacity: 1; } }
        .finder-window { animation: winPop .24s cubic-bezier(.2,.8,.3,1); }
        .tl { transition: filter .15s; }
        .tl:hover { filter: brightness(0.9); }
        .dock-icon { transition: transform .18s cubic-bezier(.2,.8,.3,1.4); }
        .dock-icon:hover { transform: translateY(-10px) scale(1.18); }
        .side-item { transition: background .15s; }
        .side-item:hover { background: rgba(255,255,255,0.06) !important; }
        .menu-item:hover { background: rgba(255,255,255,0.12); }
        a.link-row:hover { border-bottom-color: currentColor !important; }
        @media (max-width: 720px) {
          .finder-window { flex-direction: column !important; }
          .finder-sidebar { width: auto !important; flex-direction: row !important;
            overflow-x: auto; border-right: none !important;
            border-bottom: 1px solid rgba(255,255,255,0.08) !important; }
          .finder-sidebar .side-label { display: none !important; }
        }
      `}</style>

      {/* ── 메뉴바 ── */}
      <div style={{
        height: 28, flexShrink: 0,
        background: "rgba(22,20,30,0.6)", backdropFilter: "blur(20px)",
        borderBottom: "0.5px solid rgba(255,255,255,0.1)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 14px", fontSize: 13, position: "relative", zIndex: 2000,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <span style={{ fontSize: 15 }}></span>
          <span style={{ fontWeight: 700 }}>Portfolio</span>
          {["File", "Edit", "View", "Window", "Help"].map((m) => (
            <span key={m} className="menu-item" style={{
              padding: "2px 7px", borderRadius: 4, color: "#e5e5ea", cursor: "default",
            }}>{m}</span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, color: "#e5e5ea" }}>
          {/* wifi */}
          <svg width="17" height="12" viewBox="0 0 18 13" fill="currentColor"><path d="M9 13l2.5-3.1C10.8 9.3 9.9 9 9 9s-1.8.3-2.5.9L9 13zM3 5.6l1.4 1.7C5.7 6.2 7.3 5.6 9 5.6s3.3.6 4.6 1.7L15 5.6C13.4 4.2 11.3 3.4 9 3.4S4.6 4.2 3 5.6zM9 0C5.6 0 2.5 1.2 0 3.2l1.4 1.7C3.5 3.2 6.1 2.2 9 2.2s5.5 1 7.6 2.7L18 3.2C15.5 1.2 12.4 0 9 0z"/></svg>
          {/* battery */}
          <svg width="26" height="12" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="22" height="12" rx="3.5" stroke="currentColor" strokeOpacity="0.5"/><rect x="2" y="2" width="17" height="9" rx="2" fill="currentColor"/><path d="M24.5 4.5c1 0 1.5.6 1.5 2s-.5 2-1.5 2v-4z" fill="currentColor" fillOpacity="0.5"/></svg>
          <span style={{ font: "500 13px/1 var(--mono)" }}>{clock}</span>
        </div>
      </div>

      {/* ── 데스크톱: Finder 창들 ── */}
      <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
        {windows.map((w) => (
          <FinderWindow
            key={w.id} win={w}
            onFocus={() => focusWin(w.id)}
            onClose={() => closeWin(w.id)}
            onMin={() => minWin(w.id)}
            onMaxToggle={() => maxToggleWin(w.id)}
            openSection={openSection}
            onOpenPdf={setOpenPdf}
          />
        ))}
      </div>

      <DockAndOverlays openSection={openSection} openPdf={openPdf} setOpenPdf={setOpenPdf} />
    </div>
  );
}

// 개별 Finder 창 — 자체 드래그 위치를 갖고, 겹침 순서(z)는 App이 관리
function FinderWindow({ win, onFocus, onClose, onMin, onMaxToggle, openSection, onOpenPdf }) {
  const [pos, setPos] = useState(win.initPos);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef(null);

  // 타이틀바 드래그 — 신호등 클릭은 제외, 최대화 상태에선 비활성
  const onTitleDown = (e) => {
    if (win.max || e.target.closest(".tl")) return;
    dragRef.current = { sx: e.clientX, sy: e.clientY, bx: pos.x, by: pos.y };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onTitleMove = (e) => {
    if (!dragRef.current) return;
    const d = dragRef.current;
    setPos({ x: d.bx + e.clientX - d.sx, y: d.by + e.clientY - d.sy });
  };
  const onTitleUp = () => { dragRef.current = null; setDragging(false); };

  const proj = PROJECTS.find((p) => p.id === win.section);
  const title = win.section === "about" ? "소개" : win.section === "contact" ? "연락처" : proj?.title;

  return (
        <div className="finder-window" onPointerDownCapture={onFocus} style={{
          position: "absolute", zIndex: win.z,
          display: "flex", overflow: "hidden",
          background: "rgba(30,28,38,0.85)", backdropFilter: "blur(30px)",
          border: "0.5px solid rgba(255,255,255,0.12)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.55), 0 0 0 0.5px rgba(255,255,255,0.05)",
          ...(win.max && !win.min
            ? { left: 20, right: 20, top: 36, bottom: 120, borderRadius: 8, transform: "none" }
            : {
                left: "50%", top: "calc(50% - 42px)",
                width: "min(960px, calc(100% - 40px))", height: "min(620px, calc(100% - 156px))",
                borderRadius: 12,
                // 드래그 이동 + 최소화(독으로 빨려 들어가는 느낌) 변환
                transform: win.min
                  ? `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y + 420}px)) scale(0.06)`
                  : `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
              }),
          opacity: win.min ? 0 : 1,
          pointerEvents: win.min ? "none" : "auto",
          transition: dragging ? "none" : "transform .3s cubic-bezier(.2,.8,.3,1), opacity .3s ease",
        }}>
          {/* 사이드바 */}
          <div className="finder-sidebar" style={{
            width: 220, flexShrink: 0, padding: "40px 12px 12px",
            background: "rgba(255,255,255,0.02)",
            borderRight: "0.5px solid rgba(255,255,255,0.08)",
            display: "flex", flexDirection: "column", gap: 4,
          }}>
            <div className="side-label" style={{ fontSize: 11, fontWeight: 700, color: "#86868b", padding: "6px 10px 4px", letterSpacing: "0.02em" }}>즐겨찾기</div>
            <SideItem icon="🏠" label="소개" active={win.section === "about"} onClick={() => openSection("about")} />
            <SideItem icon="✉️" label="연락처" active={win.section === "contact"} onClick={() => openSection("contact")} />
            <div className="side-label" style={{ fontSize: 11, fontWeight: 700, color: "#86868b", padding: "14px 10px 4px", letterSpacing: "0.02em" }}>프로젝트</div>
            {PROJECTS.map((p) => (
              <SideItem key={p.id} dot={p.accent} label={p.title} active={win.section === p.id} onClick={() => openSection(p.id)} />
            ))}
          </div>

          {/* 콘텐츠 */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
            {/* 타이틀바 — 드래그 핸들, 더블클릭 시 최대화 토글 */}
            <div className="win-titlebar"
              onPointerDown={onTitleDown} onPointerMove={onTitleMove}
              onPointerUp={onTitleUp} onPointerCancel={onTitleUp}
              onDoubleClick={(e) => { if (!e.target.closest(".tl")) onMaxToggle(); }}
              style={{
              height: 40, flexShrink: 0, display: "flex", alignItems: "center",
              padding: "0 16px", gap: 14,
              borderBottom: "0.5px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.02)",
              touchAction: "none", userSelect: "none",
            }}>
              <TrafficLights onClose={onClose} onMin={onMin} onMax={onMaxToggle} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#c7c7cc" }}>
                {title}
              </span>
            </div>

            {/* 본문 */}
            <div style={{ flex: 1, overflowY: "auto", padding: "36px 40px" }}>
              {win.section === "about" && (
                <div>
                  <div style={{ font: "500 12px/1 var(--mono)", color: "#E0A020", letterSpacing: "0.08em", marginBottom: 16 }}>
                    {PROFILE.role.toUpperCase()}
                  </div>
                  <h1 style={{ margin: 0, fontSize: 44, fontWeight: 800, letterSpacing: "-0.03em" }}>{PROFILE.name}</h1>
                  <div style={{ marginTop: 6, fontSize: 15, color: "#86868b", font: "500 15px/1 var(--mono)" }}>{PROFILE.nameEn}</div>
                  <p style={{ marginTop: 28, fontSize: 17, lineHeight: 1.65, color: "#d5d5da", maxWidth: 520, whiteSpace: "pre-line" }}>
                    {PROFILE.about}
                  </p>
                </div>
              )}

              {win.section === "contact" && (
                <div>
                  <h1 style={{ margin: 0, fontSize: 30, fontWeight: 700, letterSpacing: "-0.02em" }}>연락처</h1>
                  <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 16, font: "500 16px/1 var(--mono)" }}>
                    <a className="link-row" href={PROFILE.github} style={linkRow}>GitHub <span style={{ color: "#E0A020" }}>↗</span></a>
                    <a className="link-row" href={`mailto:${PROFILE.email}`} style={linkRow}>{PROFILE.email}</a>
                  </div>
                </div>
              )}

              {proj && (
                <div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                    <h1 style={{ margin: 0, fontSize: 30, fontWeight: 700, letterSpacing: "-0.02em" }}>{proj.title}</h1>
                    <span style={{ font: "500 13px/1 var(--mono)", color: proj.accent }}>{proj.kind}</span>
                  </div>
                  <div style={{ marginTop: 10, fontSize: 14, color: "#86868b", fontWeight: 500 }}>{proj.role}</div>
                  <p style={{ margin: "22px 0 26px", fontSize: 16, lineHeight: 1.65, color: "#d5d5da", maxWidth: 540 }}>{proj.desc}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 30 }}>
                    {proj.stack.map((s) => (
                      <span key={s} style={{
                        font: "500 12px/1 var(--mono)", color: "#a1a1a6",
                        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 6, padding: "6px 9px",
                      }}>{s}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
                    {proj.links.map((l) => {
                      const isPdf = l.label.includes("PDF");
                      const inner = <>{l.label} <span style={{ color: proj.accent }}>{isPdf ? "⤢" : "→"}</span></>;
                      const style = {
                        fontSize: 14, fontWeight: 600, color: "#f5f5f7", textDecoration: "none",
                        borderBottom: `1px solid ${proj.accent}`, paddingBottom: 2,
                        display: "inline-flex", gap: 5, cursor: "pointer",
                      };
                      return isPdf ? (
                        <span key={l.label} className="link-row" style={style}
                          onClick={() => onOpenPdf({ title: proj.title, src: l.href, id: proj.id })}>
                          {inner}
                        </span>
                      ) : (
                        <a key={l.label} className="link-row" href={l.href} style={style}>{inner}</a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
  );
}

// Dock + PDF 오버레이 — App 상태를 프롭으로 받는다
function DockAndOverlays({ openSection, openPdf, setOpenPdf }) {
  return (
    <>
      {/* ── Dock ── */}
      <div style={{
        position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)",
        display: "flex", alignItems: "flex-end", gap: 10, padding: "8px 12px",
        background: "rgba(50,48,60,0.45)", backdropFilter: "blur(30px)",
        borderRadius: 18, border: "0.5px solid rgba(255,255,255,0.15)",
        boxShadow: "0 10px 40px rgba(0,0,0,0.5)", zIndex: 2000,
      }}>
        <DockIcon label="소개" char="👤" gradient="linear-gradient(160deg,#5a5a66,#33333c)" onClick={() => openSection("about")} />
        {PROJECTS.map((p) => (
          <DockIcon key={p.id} label={p.title} char={PROJECT_ICONS[p.id]}
            gradient={`linear-gradient(160deg,${p.accent},${p.accent}99)`}
            onClick={() => openSection(p.id)} />
        ))}
        <div style={{ width: 1, alignSelf: "stretch", margin: "4px 2px", background: "rgba(255,255,255,0.15)" }} />
        <DockIcon label="GitHub" gradient="linear-gradient(160deg,#333,#111)" href={PROFILE.github}
          char={<svg viewBox="0 0 16 16" width="28" height="28" fill="#fff"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>} />
        <DockIcon label="Mail" char="✉" gradient="linear-gradient(160deg,#3b9dff,#0a6cf0)" href={`mailto:${PROFILE.email}`} />
      </div>

      {/* ── PDF 미리보기 창 ── */}
      {openPdf && (
        <PdfViewer
          title={openPdf.title} src={openPdf.src}
          pages={PDF_PAGES[openPdf.id] ?? 0} dir={`/pdf-pages/${openPdf.id}`}
          onClose={() => setOpenPdf(null)}
        />
      )}
    </>
  );
}

const linkRow = {
  color: "#f5f5f7", textDecoration: "none",
  borderBottom: "1px solid transparent", paddingBottom: 3, width: "fit-content",
  display: "inline-flex", gap: 6,
};

function PdfViewer({ title, src, pages, dir, onClose }) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setPage((p) => Math.max(1, p - 1));
      if (e.key === "ArrowRight") setPage((p) => Math.min(Math.max(pages, 1), p + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, pages]);

  // 다음 페이지 미리 로드
  useEffect(() => {
    if (page < pages) { const im = new Image(); im.src = `${dir}/${page + 1}.webp`; }
  }, [page, pages, dir]);

  const hasPages = pages > 0;
  const hasPdf = src && src !== "#";
  const fileName = `${title}.pdf`;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 3000,
        background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "48px 20px 100px", animation: "pdfFade .2s ease",
      }}
    >
      <style>{`
        @keyframes pdfFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes pdfPop { from { opacity: 0; transform: scale(.96) translateY(8px) } to { opacity: 1; transform: none } }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 760, height: "100%",
          display: "flex", flexDirection: "column",
          background: "#1e1c26", borderRadius: 12, overflow: "hidden",
          border: "0.5px solid rgba(255,255,255,0.14)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
          animation: "pdfPop .22s cubic-bezier(.2,.8,.3,1)",
        }}
      >
        {/* 미리보기 툴바 */}
        <div style={{
          height: 44, flexShrink: 0, display: "flex", alignItems: "center", gap: 14,
          padding: "0 16px", background: "rgba(255,255,255,0.04)",
          borderBottom: "0.5px solid rgba(255,255,255,0.1)",
        }}>
          <div style={{ display: "flex", gap: 8 }}>
            <span onClick={onClose} title="닫기" style={{
              width: 12, height: 12, borderRadius: "50%", background: "#FF5F57",
              border: "0.5px solid #E14640", cursor: "pointer", display: "inline-block",
            }} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#FEBC2E", border: "0.5px solid #D89E24", display: "inline-block" }} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28C840", border: "0.5px solid #1DA82F", display: "inline-block" }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#c7c7cc", flex: 1, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {fileName}
          </span>
          {hasPages && (
            <span style={{ font: "500 12px/1 var(--mono)", color: "#86868b" }}>{page} / {pages}</span>
          )}
          {hasPdf && (
            <a href={src} download style={{ fontSize: 13, color: "#3b9dff", textDecoration: "none", fontWeight: 600 }}>
              다운로드
            </a>
          )}
        </div>

        {/* 본문 — 페이지 이미지 슬라이드 */}
        <div style={{
          flex: 1, background: "#2a2833", minHeight: 0, position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 18,
        }}>
          {hasPages ? (
            <>
              <img
                src={`${dir}/${page}.webp`} alt={`${title} ${page}쪽`}
                style={{
                  maxWidth: "100%", maxHeight: "100%", objectFit: "contain",
                  borderRadius: 3, boxShadow: "0 8px 30px rgba(0,0,0,0.45)",
                }}
              />
              <NavBtn side="left" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} />
              <NavBtn side="right" disabled={page >= pages} onClick={() => setPage((p) => Math.min(pages, p + 1))} />
            </>
          ) : (
            <div style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 12,
              color: "#86868b", textAlign: "center", padding: 24,
            }}>
              <div style={{ fontSize: 34 }}>📄</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#c7c7cc" }}>페이지 이미지가 아직 없어요</div>
              <div style={{ fontSize: 13, lineHeight: 1.6, maxWidth: 320 }}>
                <code style={{ font: "500 12px/1 var(--mono)", color: "#a1a1a6" }}>python tools/make_pdf_pages.py</code>를
                실행하면 생성됩니다.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NavBtn({ side, disabled, onClick }) {
  return (
    <button
      onClick={onClick} disabled={disabled}
      aria-label={side === "left" ? "이전 페이지" : "다음 페이지"}
      style={{
        position: "absolute", top: "50%", [side]: 14, transform: "translateY(-50%)",
        width: 36, height: 36, borderRadius: "50%",
        background: "rgba(20,18,26,0.7)", border: "0.5px solid rgba(255,255,255,0.15)",
        color: "#f5f5f7", fontSize: 20, lineHeight: 1,
        cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.25 : 1,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      {side === "left" ? "‹" : "›"}
    </button>
  );
}

function SideItem({ icon, dot, label, active, onClick }) {
  return (
    <div className="side-item" onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 9,
      padding: "7px 10px", borderRadius: 7, cursor: "pointer",
      background: active ? "rgba(255,255,255,0.1)" : "transparent",
      fontSize: 14, fontWeight: 500, whiteSpace: "nowrap",
    }}>
      {dot ? (
        <span style={{ width: 11, height: 11, borderRadius: "50%", background: dot, flexShrink: 0 }} />
      ) : (
        <span style={{ fontSize: 15 }}>{icon}</span>
      )}
      <span className="side-label">{label}</span>
    </div>
  );
}
