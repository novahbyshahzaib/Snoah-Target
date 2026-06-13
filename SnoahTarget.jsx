import { useState, useEffect } from "react";

// ── STYLE TOKENS ──────────────────────────────────────────
const SS = {
  Ph: { bg:"#EFF6FF", bd:"#BFDBFE", tx:"#1E40AF", ac:"#3B82F6", lbl:"Physics" },
  PC: { bg:"#F5F3FF", bd:"#DDD6FE", tx:"#5B21B6", ac:"#7C3AED", lbl:"Phy Chem" },
  Zo: { bg:"#ECFDF5", bd:"#A7F3D0", tx:"#065F46", ac:"#059669", lbl:"Zoology" },
  Bo: { bg:"#FFFBEB", bd:"#FDE68A", tx:"#92400E", ac:"#D97706", lbl:"Botany" },
};
const SC = {
  pending: { label:"Pending", bg:"#F9FAFB", bd:"#E5E7EB", tx:"#6B7280" },
  done:    { label:"Done",    bg:"#F0FDF4", bd:"#BBF7D0", tx:"#15803D" },
  missed:  { label:"Missed",  bg:"#FEF2F2", bd:"#FECACA", tx:"#DC2626" },
};
const SFLBL = { Ph:"Physics", PC:"Phy Chem", Zo:"Zoology", Bo:"Botany" };

// ── ICONS (SVG only, no emojis) ───────────────────────────
const CheckIC = () => (
  <svg viewBox="0 0 24 24" width="17" height="17">
    <circle cx="12" cy="12" r="11" fill="#16a34a"/>
    <polyline points="6 12 10 16 18 8" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const CrossIC = () => (
  <svg viewBox="0 0 24 24" width="17" height="17">
    <circle cx="12" cy="12" r="11" fill="#dc2626"/>
    <line x1="7" y1="7" x2="17" y2="17" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="17" y1="7" x2="7" y2="17" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);
const PendIC = () => (
  <svg viewBox="0 0 24 24" width="17" height="17">
    <circle cx="12" cy="12" r="11" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1"/>
    <circle cx="12" cy="12" r="4" fill="#9ca3af"/>
  </svg>
);
const CalIC = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const TestIC = () => (
  <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="9" y1="15" x2="15" y2="15"/><line x1="9" y1="11" x2="15" y2="11"/>
  </svg>
);
const BookIC = () => (
  <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);
const TickIC = ({ c = "#16a34a" }) => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
    <polyline points="20 6 9 17 4 12" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const InfoIC = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

// ── DATA ──────────────────────────────────────────────────
const PLAN_START = new Date(2026, 5, 15, 0, 0, 0);
const WEEK_SLOTS = {
  1:["Ph","Ph","PC"], 2:["Ph","PC","PC"], 3:["Ph","Ph","PC"],
  4:["Zo","Zo","Bo"], 5:["Zo","Bo","Bo"], 6:["PC","Zo","Bo"], 0:[],
};
const CURR_CH = {
  Ph: "Electric Charges & Fields",
  PC: "Solution",
  Zo: "Human Reproduction",
  Bo: "Sexual Repro. in Flowering Plants",
};
const SPECIAL = {
  "2026-06-21": { type:"test", label:"Rank Booster Test-1", sub:"Full length test — prepare thoroughly" },
};
const BACKLOG = [
  { s:"Ph", ch:"Electric Charges & Fields",         done:5, total:22 },
  { s:"Ph", ch:"Electrostatic Potential & Cap.",     done:0, total:9  },
  { s:"PC", ch:"Solution",                           done:2, total:15 },
  { s:"PC", ch:"Electrochemistry",                   done:0, total:10 },
  { s:"PC", ch:"Chemical Kinetics",                  done:0, total:5  },
  { s:"Zo", ch:"Human Reproduction",                done:1, total:17 },
  { s:"Zo", ch:"Reproductive Health",               done:0, total:2  },
  { s:"Bo", ch:"Sexual Repro. in Flowering Plants",  done:5, total:13 },
  { s:"Bo", ch:"Principle of Inheritance & Var.",    done:0, total:5  },
];
const DAY_PLAN_DISP = [
  { d:"MON", slots:["Ph","Ph","PC"], live:"Physics + Phy Chem live" },
  { d:"TUE", slots:["Ph","PC","PC"], live:"Physics + Phy Chem live" },
  { d:"WED", slots:["Ph","Ph","PC"], live:"Physics + Phy Chem live" },
  { d:"THU", slots:["Zo","Zo","Bo"], live:"Zoology + Botany live"   },
  { d:"FRI", slots:["Zo","Bo","Bo"], live:"Zoology + Botany live"   },
  { d:"SAT", slots:["PC","Zo","Bo"], live:"No live class"           },
  { d:"SUN", slots:null,             live:"Vectors / Diff / Int / Revision" },
];
const DSHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONS   = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ── HELPERS ───────────────────────────────────────────────
function dkey(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function now0() { const d = new Date(); d.setHours(0,0,0,0); return d; }

function buildWeeks() {
  const rows = [];
  let ph=26, pc=28, zo=18, bo=13;
  const s0 = new Date(2026,5,13);
  for (let i=0; i<16; i++) {
    ph=Math.max(0,ph-2); pc=Math.max(0,pc-2); zo=Math.max(0,zo-2); bo=Math.max(0,bo-2);
    const d0 = new Date(s0.getTime()+i*7*864e5);
    const d1 = new Date(d0.getTime()+6*864e5);
    const f = x => `${x.getDate()}/${x.getMonth()+1}`;
    rows.push({ w:i+1, dt:`${f(d0)}–${f(d1)}`, ph, pc, zo, bo });
    if(!ph&&!pc&&!zo&&!bo) break;
  }
  return rows;
}

// ── MAIN ──────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState(0);
  const [schedData, setSchedData] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [modal, setModal] = useState(null); // {dk,idx,subj,ch}

  const TABS = ["Schedule","Backlog","Daily","Tracker"];

  // Storage load
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("neet-sched-v1");
        if (r?.value) setSchedData(JSON.parse(r.value));
      } catch {}
      setLoaded(true);
    })();
  }, []);

  // Storage save
  useEffect(() => {
    if (!loaded) return;
    (async () => { try { await window.storage.set("neet-sched-v1", JSON.stringify(schedData)); } catch {} })();
  }, [schedData, loaded]);

  function getSt(dk, idx) { return schedData[dk]?.[idx] || "pending"; }
  function setSt(dk, idx, status) {
    setSchedData(prev => {
      const a = [...(prev[dk] || ["pending","pending","pending"])];
      a[idx] = status;
      return { ...prev, [dk]: a };
    });
    setModal(null);
  }

  // Compute date context
  const now = now0();
  const preplan = now < PLAN_START;
  const dispFrom = preplan ? new Date(PLAN_START) : new Date(now);
  const days7 = Array.from({ length:7 }, (_,i) => {
    const d = new Date(dispFrom);
    d.setDate(dispFrom.getDate()+i);
    return d;
  });
  const todayKey = dkey(now);

  // Backlog totals
  const bl = { Ph:0, PC:0, Zo:0, Bo:0 };
  BACKLOG.forEach(c => { bl[c.s] += c.total - c.done; });
  const totalBL = Object.values(bl).reduce((a,b)=>a+b,0);
  const weeks = buildWeeks();

  return (
    <div style={{ maxWidth:460, margin:"0 auto", fontFamily:"system-ui,-apple-system,sans-serif", background:"#fff", minHeight:"100vh" }}>

      {/* ── HEADER ── */}
      <div style={{ background:"linear-gradient(145deg,#14532d,#166534)", color:"#fff", padding:"20px 16px 18px" }}>
        <p style={{ margin:0, fontSize:10, opacity:0.65, textTransform:"uppercase", letterSpacing:0.8 }}>Lakshya NEET 2027</p>
        <h1 style={{ margin:"5px 0 14px", fontSize:22, fontWeight:800 }}>Catch-Up Planner</h1>
        <div style={{ display:"flex", gap:7 }}>
          {["Ph","PC","Zo","Bo"].map(k => (
            <div key={k} style={{ flex:1, background:"rgba(255,255,255,0.17)", borderRadius:10, padding:"9px 4px", textAlign:"center" }}>
              <div style={{ fontSize:22, fontWeight:800, lineHeight:1 }}>{bl[k]}</div>
              <div style={{ fontSize:9.5, opacity:0.75, marginTop:3 }}>{SFLBL[k]}</div>
            </div>
          ))}
        </div>
        <p style={{ margin:"11px 0 0", fontSize:12, opacity:0.9, textAlign:"center" }}>
          <b>{totalBL}</b> lectures remaining &nbsp;·&nbsp; Complete ~<b>Sep 18, 2026</b>
        </p>
      </div>

      {/* ── TABS ── */}
      <div style={{ display:"flex", borderBottom:"2px solid #f3f4f6", background:"#fff", position:"sticky", top:0, zIndex:50 }}>
        {TABS.map((t,i) => (
          <button key={i} onClick={() => setTab(i)} style={{
            flex:1, padding:"11px 2px", fontSize:11, fontWeight:700,
            border:"none", background:"none", cursor:"pointer",
            borderBottom:`2.5px solid ${tab===i?"#166534":"transparent"}`,
            color:tab===i?"#166534":"#9ca3af", marginBottom:-2,
          }}>{t}</button>
        ))}
      </div>

      <div style={{ padding:"16px 14px" }}>

        {/* ══════════ SCHEDULE TAB ══════════ */}
        {tab===0 && <>

          {/* Pre-plan notice */}
          {preplan && (
            <div style={{ display:"flex", alignItems:"center", gap:10, background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:12, padding:"11px 14px", marginBottom:14 }}>
              <CalIC/>
              <div>
                <p style={{ margin:0, fontSize:12, fontWeight:700, color:"#1e40af" }}>Schedule starts Monday, 15 June 2026</p>
                <p style={{ margin:"2px 0 0", fontSize:11, color:"#3b82f6" }}>
                  {Math.ceil((new Date(PLAN_START)-now)/864e5)} day(s) away — upcoming week shown below
                </p>
              </div>
            </div>
          )}

          {days7.map((day, di) => {
            const dk      = dkey(day);
            const jsDay   = day.getDay();
            const special = SPECIAL[dk];
            const slots   = special?.type==="test" ? [] : WEEK_SLOTS[jsDay];
            const isSun   = jsDay===0;
            const isToday = (dk===todayKey) && !preplan;
            const isPast  = day<now && !isToday;

            const sts      = slots.map((_,i) => getSt(dk,i));
            const allDone  = slots.length>0 && sts.every(s=>s==="done");
            const anyMissed= sts.some(s=>s==="missed");
            const allPend  = slots.length>0 && sts.every(s=>s==="pending");

            // Section header: TODAY | UPCOMING
            const secLabel = (!preplan && di===0) ? "TODAY"
              : (!preplan && di===1)  ? "UPCOMING"
              : (preplan  && di===0)  ? "UPCOMING"
              : null;

            const bdrC = isToday?"#166534":allDone?"#bbf7d0":anyMissed?"#fecaca":"#e5e7eb";

            return (
              <div key={dk}>
                {secLabel && (
                  <p style={{ margin:di===0?"0 0 9px":"16px 0 9px", fontSize:10, fontWeight:800, color:"#9ca3af", letterSpacing:1.2, textTransform:"uppercase" }}>
                    {secLabel}
                  </p>
                )}

                <div style={{ border:`1.5px solid ${bdrC}`, borderRadius:14, overflow:"hidden", marginBottom:10, opacity:isPast&&allPend?0.72:1 }}>

                  {/* Card header */}
                  <div style={{
                    padding:"10px 14px",
                    background:isToday?"#f0fdf4":allDone?"#f0fdf4":anyMissed?"#fef2f2":"#f9fafb",
                    display:"flex", justifyContent:"space-between", alignItems:"center",
                    borderBottom:`1px solid ${bdrC}`,
                  }}>
                    <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                      <span style={{ fontSize:14, fontWeight:800, color:"#111" }}>
                        {DSHORT[jsDay]}, {day.getDate()} {MONS[day.getMonth()]}
                      </span>
                      {isToday && (
                        <span style={{ fontSize:9, fontWeight:800, letterSpacing:0.5, background:"#166534", color:"#fff", padding:"2px 9px", borderRadius:20 }}>
                          TODAY
                        </span>
                      )}
                      {isPast && !allDone && (
                        <span style={{ fontSize:9, fontWeight:700, background:"#fee2e2", color:"#dc2626", padding:"2px 7px", borderRadius:20 }}>
                          OVERDUE
                        </span>
                      )}
                    </div>
                    {allDone ? <CheckIC/> : anyMissed ? <CrossIC/> : null}
                  </div>

                  {/* Card body */}
                  <div style={{ padding:"10px 13px" }}>

                    {/* Test day */}
                    {special?.type==="test" && (
                      <div style={{ display:"flex", alignItems:"center", gap:11, background:"#fffbeb", border:"1px solid #fde68a", borderRadius:10, padding:"11px 13px" }}>
                        <TestIC/>
                        <div>
                          <p style={{ margin:0, fontSize:13, fontWeight:700, color:"#92400e" }}>{special.label}</p>
                          <p style={{ margin:"2px 0 0", fontSize:11, color:"#a16207" }}>{special.sub}</p>
                        </div>
                      </div>
                    )}

                    {/* Sunday rest */}
                    {isSun && !special && (
                      <div style={{ display:"flex", alignItems:"center", gap:11, background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:10, padding:"11px 13px" }}>
                        <BookIC/>
                        <div>
                          <p style={{ margin:0, fontSize:13, fontWeight:600, color:"#475569" }}>Rest and Revision Day</p>
                          <p style={{ margin:"2px 0 0", fontSize:11, color:"#94a3b8", lineHeight:1.5 }}>
                            Vectors · Integration · Differentiation · Class 11 Revision
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Lecture slots */}
                    {slots.map((subj, idx) => {
                      const st     = SS[subj];
                      const status = getSt(dk, idx);
                      const sSC    = SC[status];
                      return (
                        <div
                          key={idx}
                          onClick={() => setModal({ dk, idx, subj, ch:CURR_CH[subj] })}
                          style={{
                            display:"flex", alignItems:"center", gap:10,
                            background:sSC.bg, border:`1.5px solid ${sSC.bd}`,
                            borderRadius:10, padding:"10px 12px",
                            marginBottom:idx<slots.length-1?7:0,
                            cursor:"pointer", userSelect:"none",
                          }}
                        >
                          <div style={{ flexShrink:0 }}>
                            {status==="done"?<CheckIC/>:status==="missed"?<CrossIC/>:<PendIC/>}
                          </div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                              <span style={{ fontSize:10, fontWeight:700, padding:"2px 9px", background:st.ac, color:"#fff", borderRadius:20 }}>
                                {st.lbl}
                              </span>
                              <span style={{ fontSize:10, color:"#9ca3af" }}>Slot {idx+1}</span>
                            </div>
                            <p style={{ margin:0, fontSize:12, color:"#374151", lineHeight:1.3, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                              {CURR_CH[subj]}
                            </p>
                          </div>
                          <span style={{ fontSize:10, fontWeight:600, color:sSC.tx, flexShrink:0 }}>{sSC.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          <div style={{ display:"flex", alignItems:"flex-start", gap:8, background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:10, padding:"11px 13px", marginTop:4 }}>
            <div style={{ paddingTop:1 }}><InfoIC/></div>
            <p style={{ margin:0, fontSize:11, color:"#64748b", lineHeight:1.6 }}>
              Tap any lecture slot to mark it as <b>Done</b>, <b>Missed</b>, or <b>Pending</b>. Status is saved automatically.
            </p>
          </div>
        </>}

        {/* ══════════ BACKLOG TAB ══════════ */}
        {tab===1 && <>
          {BACKLOG.map((c,i) => {
            const rem = c.total-c.done;
            const pct = Math.round(c.done/c.total*100);
            const st  = SS[c.s];
            return (
              <div key={i} style={{ background:st.bg, border:`1px solid ${st.bd}`, borderRadius:12, padding:"11px 13px", marginBottom:9 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:7 }}>
                  <div style={{ flex:1, paddingRight:8 }}>
                    <span style={{ background:st.ac, color:"#fff", fontSize:10, fontWeight:700, padding:"2px 9px", borderRadius:20 }}>{SFLBL[c.s]}</span>
                    <p style={{ margin:"5px 0 0", fontSize:13, fontWeight:600, color:"#111", lineHeight:1.3 }}>{c.ch}</p>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontSize:11, color:"#9ca3af" }}>{c.done}/{c.total} done</div>
                    <div style={{ fontSize:12, fontWeight:700, color:rem>0?"#dc2626":"#16a34a" }}>{rem} left</div>
                  </div>
                </div>
                <div style={{ height:7, background:"#e5e7eb", borderRadius:4, overflow:"hidden" }}>
                  <div style={{ width:`${pct}%`, height:"100%", background:st.ac, borderRadius:4 }}/>
                </div>
                <p style={{ margin:"4px 0 0", fontSize:10, color:st.tx }}>{pct}% complete</p>
              </div>
            );
          })}
          <div style={{ background:"#fef3c7", border:"1px solid #fde68a", borderRadius:12, padding:12, marginTop:4 }}>
            <p style={{ margin:"0 0 4px", fontSize:12, fontWeight:700, color:"#92400e" }}>Content Pending Upload</p>
            <p style={{ margin:0, fontSize:12, color:"#78350f", lineHeight:1.5 }}>
              Organic Chemistry and Inorganic Chemistry not yet available. Revise plan once uploaded.
            </p>
          </div>
          <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:12, padding:12, marginTop:9 }}>
            <p style={{ margin:"0 0 4px", fontSize:12, fontWeight:700, color:"#14532d" }}>DPP Reminder</p>
            <p style={{ margin:0, fontSize:12, color:"#166534", lineHeight:1.5 }}>
              Attempt each chapter DPP on the same day you finish its lectures. Completion counts both.
            </p>
          </div>
        </>}

        {/* ══════════ DAILY PLAN TAB ══════════ */}
        {tab===2 && <>
          <p style={{ margin:"0 0 14px", fontSize:12, color:"#6b7280", lineHeight:1.6 }}>
            3 recorded catch-up lectures per day, timed to mirror the live schedule subjects.
          </p>
          {DAY_PLAN_DISP.map((d,i) => (
            <div key={i} style={{ background:d.d==="SUN"?"#f8fafc":"#fff", border:`1px solid ${d.d==="SUN"?"#e2e8f0":"#efefef"}`, borderRadius:12, padding:"12px 13px", marginBottom:9, boxShadow:d.d==="SUN"?"none":"0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:9 }}>
                <span style={{ fontSize:15, fontWeight:800, color:"#111" }}>{d.d}</span>
                <span style={{ fontSize:10, color:"#9ca3af" }}>{d.live}</span>
              </div>
              {d.slots ? (
                <div style={{ display:"flex", gap:6 }}>
                  {d.slots.map((s,j) => (
                    <div key={j} style={{ flex:1, background:SS[s].ac, color:"#fff", padding:"9px 3px", borderRadius:8, textAlign:"center", fontSize:11, fontWeight:700, lineHeight:1.3 }}>
                      {SFLBL[s]}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ background:"#e2e8f0", borderRadius:8, padding:"9px", textAlign:"center", fontSize:11, fontWeight:600, color:"#64748b" }}>
                  Extra / Revision
                </div>
              )}
            </div>
          ))}
          <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:12, padding:13, marginTop:4 }}>
            <p style={{ margin:"0 0 10px", fontSize:13, fontWeight:700, color:"#14532d" }}>Weekly Targets (Mon–Sat)</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {[["Ph",5],["PC",5],["Zo",4],["Bo",4]].map(([s,n]) => (
                <div key={s} style={{ display:"flex", alignItems:"center", gap:7, fontSize:12 }}>
                  <div style={{ width:10, height:10, borderRadius:"50%", background:SS[s].ac, flexShrink:0 }}/>
                  <span style={{ color:"#374151" }}>{SFLBL[s]}:</span>
                  <strong style={{ color:"#111" }}>{n}/week</strong>
                </div>
              ))}
            </div>
            <p style={{ margin:"10px 0 0", fontSize:11, color:"#166534", borderTop:"1px solid #bbf7d0", paddingTop:9 }}>
              3 Extra / Revision sessions every Sunday
            </p>
          </div>
          <div style={{ background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:12, padding:12, marginTop:9 }}>
            <p style={{ margin:"0 0 6px", fontSize:12, fontWeight:700, color:"#1e40af" }}>Distribution Logic</p>
            <p style={{ margin:0, fontSize:12, color:"#1d4ed8", lineHeight:1.7 }}>
              Mon / Wed: 2 Physics + 1 Phy Chem<br/>
              Tue: 1 Physics + 2 Phy Chem<br/>
              Thu: 2 Zoology + 1 Botany<br/>
              Fri: 1 Zoology + 2 Botany<br/>
              Sat: 1 Phy Chem + 1 Zoology + 1 Botany
            </p>
          </div>
        </>}

        {/* ══════════ TRACKER TAB ══════════ */}
        {tab===3 && <>
          <p style={{ margin:"0 0 12px", fontSize:12, color:"#6b7280", lineHeight:1.6 }}>
            Net reduction of ~2 backlog lectures/week per subject at current catch-up pace.
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
            {[{s:"Bo",lbl:"~Jul 31",wk:"Week 7"},{s:"Zo",lbl:"~Aug 14",wk:"Week 9"},{s:"Ph",lbl:"~Sep 11",wk:"Week 13"},{s:"PC",lbl:"~Sep 18",wk:"Week 14"}].map(m => (
              <div key={m.s} style={{ background:SS[m.s].bg, border:`1px solid ${SS[m.s].bd}`, borderRadius:12, padding:11 }}>
                <p style={{ margin:0, fontSize:11, fontWeight:700, color:SS[m.s].tx }}>{SFLBL[m.s]}</p>
                <p style={{ margin:"3px 0 0", fontSize:18, fontWeight:800, color:"#111" }}>{m.lbl}</p>
                <p style={{ margin:0, fontSize:10, color:"#9ca3af" }}>{m.wk}</p>
              </div>
            ))}
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
            <thead>
              <tr style={{ background:"#f9fafb" }}>
                {[{h:"Week",c:"#6b7280",left:true},{h:"Ph",c:SS.Ph.ac},{h:"PC",c:SS.PC.ac},{h:"Zo",c:SS.Zo.ac},{h:"Bo",c:SS.Bo.ac}].map(({h,c,left}) => (
                  <th key={h} style={{ padding:"7px 5px", textAlign:left?"left":"center", color:c, fontWeight:700, fontSize:left?10:13, borderBottom:"2px solid #e5e7eb" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map(w => {
                const isTest = w.w===2;
                const allDone = !w.ph&&!w.pc&&!w.zo&&!w.bo;
                return (
                  <tr key={w.w} style={{ borderBottom:"1px solid #f3f4f6", background:allDone?"#f0fdf4":isTest?"#fef9c3":w.w%2===0?"#fafafa":"#fff" }}>
                    <td style={{ padding:"7px 5px", fontSize:10, color:"#374151", fontWeight:isTest?700:400, lineHeight:1.3 }}>
                      {w.dt}{isTest?" [Test]":""}
                    </td>
                    {[w.ph,w.pc,w.zo,w.bo].map((v,j) => (
                      <td key={j} style={{ padding:"7px 5px", textAlign:"center", fontWeight:700 }}>
                        {v===0
                          ? <span style={{ color:"#16a34a", fontSize:14 }}>&#10003;</span>
                          : <span style={{ color:v>15?"#dc2626":v>7?"#f59e0b":"#16a34a" }}>{v}</span>
                        }
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ marginTop:12, background:"#fef3c7", border:"1px solid #fde68a", borderRadius:10, padding:11, fontSize:11, color:"#92400e", lineHeight:1.7 }}>
            <b>Week 2 (Jun 20–26):</b> Rank Booster Test-1 on Jun 21 (Sunday).<br/>
            Timeline will extend once Organic and Inorganic Chemistry content goes live.
          </div>
        </>}
      </div>

      {/* ══════════ STATUS MODAL ══════════ */}
      {modal && (
        <div
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:1000, display:"flex", alignItems:"flex-end" }}
          onClick={() => setModal(null)}
        >
          <div
            style={{ background:"#fff", width:"100%", maxWidth:460, margin:"0 auto", borderRadius:"20px 20px 0 0", padding:"16px 16px 40px" }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ width:40, height:5, background:"#e5e7eb", borderRadius:3, margin:"0 auto 18px" }}/>

            <p style={{ margin:"0 0 10px", fontSize:10, color:"#9ca3af", textTransform:"uppercase", letterSpacing:1 }}>
              Update Lecture Status
            </p>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
              <span style={{ fontSize:11, fontWeight:700, padding:"3px 11px", background:SS[modal.subj].ac, color:"#fff", borderRadius:20 }}>
                {SS[modal.subj].lbl}
              </span>
              <span style={{ fontSize:12, fontWeight:600, color:"#374151" }}>Slot {modal.idx+1}</span>
            </div>
            <p style={{ margin:"0 0 16px", fontSize:12, color:"#6b7280", lineHeight:1.4 }}>{modal.ch}</p>

            {[
              { s:"done",    icon:<CheckIC/>, label:"Mark as Done",    sub:"Watched and completed" },
              { s:"missed",  icon:<CrossIC/>, label:"Mark as Missed",  sub:"Did not watch on this day" },
              { s:"pending", icon:<PendIC/>,  label:"Mark as Pending", sub:"Not yet watched" },
            ].map(({ s, icon, label, sub }) => {
              const sSC    = SC[s];
              const isCurr = getSt(modal.dk, modal.idx)===s;
              return (
                <div
                  key={s}
                  onClick={() => setSt(modal.dk, modal.idx, s)}
                  style={{
                    display:"flex", alignItems:"center", gap:12,
                    padding:"12px 14px", borderRadius:12, marginBottom:8,
                    border:`1.5px solid ${isCurr?sSC.bd:"#e5e7eb"}`,
                    background:isCurr?sSC.bg:"#fff",
                    cursor:"pointer",
                  }}
                >
                  {icon}
                  <div style={{ flex:1 }}>
                    <p style={{ margin:0, fontSize:13, fontWeight:isCurr?700:500, color:isCurr?sSC.tx:"#374151" }}>{label}</p>
                    <p style={{ margin:"2px 0 0", fontSize:11, color:"#9ca3af" }}>{sub}</p>
                  </div>
                  {isCurr && <TickIC c={sSC.tx}/>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
