import MarketPass from "./MarketPass.jsx";

export function MarketIllustration() {
  return (
    <svg viewBox="0 0 320 260" fill="none" aria-hidden="true">
      <path d="M10 227C84 211 226 207 310 230" stroke="currentColor" strokeWidth="2" />
      <path d="M16 250C105 231 226 237 308 247" stroke="currentColor" strokeWidth="1.5" />
      <path d="M39 48Q160 116 289 39" stroke="currentColor" strokeWidth="2" />
      {[52, 87, 122, 158, 194, 230, 265].map((x, i) => <g key={x}><path d={`M${x} ${i < 4 ? 54 + i * 7 : 76 - (i - 4) * 12}v12`} stroke="currentColor" /><circle cx={x} cy={i < 4 ? 69 + i * 7 : 91 - (i - 4) * 12} r="4" fill="#eff4a4" /></g>)}
      <path d="M266 6a23 23 0 1 0 27 28A23 23 0 0 1 266 6Z" fill="#eff4a4" />
      <path d="m38 13 3 8 9 2-8 4-1 8-4-7-9-1 8-5ZM178 12l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" transform="translate(0 50)" fill="currentColor" />
      <path d="M35 144h109v80H35z" fill="#d3e6ff" stroke="currentColor" strokeWidth="3" />
      <path d="M27 143h126l-20-34H48z" fill="#8db4ff" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="m50 109-9 34h20l4-34ZM81 109v34h20l-5-34ZM112 109l12 34h21l-17-34Z" fill="currentColor" />
      <path d="M27 143v10a10 10 0 0 0 20 0 10 10 0 0 0 20 0 10 10 0 0 0 20 0 10 10 0 0 0 20 0 10 10 0 0 0 20 0 13 13 0 0 0 26 0v-10" fill="#f9f8ef" stroke="currentColor" strokeWidth="2" />
      <path d="M46 179h86v30H46z" fill="#f9f8ef" stroke="currentColor" strokeWidth="2" />
      <path d="M53 176h18v-14H53zM105 176l6-15 11 15" fill="#eff4a4" stroke="currentColor" strokeWidth="2" />
      <path d="M56 213v12M125 213v12" stroke="currentColor" strokeWidth="4" />
      <path d="M180 129h104v96H180z" fill="#f9f8ef" stroke="currentColor" strokeWidth="3" />
      <path d="m169 130 19-35h89l18 35z" fill="#d3e6ff" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="m190 95-8 35h18l3-35ZM219 95v35h18l-3-35ZM249 95l9 35h19l-15-35Z" fill="currentColor" />
      <path d="M169 130v10a10 10 0 0 0 20 0 10 10 0 0 0 20 0 10 10 0 0 0 20 0 10 10 0 0 0 20 0 10 10 0 0 0 20 0 13 13 0 0 0 26 0v-10" fill="#d3e6ff" stroke="currentColor" strokeWidth="2" />
      <path d="M191 172h82v38h-82z" fill="#d3e6ff" stroke="currentColor" strokeWidth="2" />
      <path d="M205 169v-19m-6 0h12m24 19v-17m-5 0h10m19 17v-24m-6 0h12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M211 188q12-12 23 0t23 0" stroke="currentColor" strokeWidth="2" />
      <circle cx="159" cy="207" r="6" fill="#eff4a4" stroke="currentColor" strokeWidth="2" />
      <path d="M159 213v16m0-10-7 5m7-5 7 4m-7 6-5 8m5-8 5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function MarketCollage({ compact = false }) {
  return (
    <div className={`market-collage${compact ? " market-collage-compact" : ""}`} aria-hidden="true">
      <div className="collage-orbit" />
      <div className="collage-poster">
        <span className="poster-tape" />
        <div className="poster-top"><span>BANGKOK<br />AFTER DARK</span><span>✦</span></div>
        <strong>GOOD<br />NIGHTS.<br /><em>GREAT IDEAS.</em></strong>
        <MarketIllustration />
        <span className="poster-bottom">SMALL SHOPS. BIG DREAMS. EST. TONIGHT.</span>
      </div>
      <div className="collage-seal"><span>NIGHT MARKET</span><strong>จองล็อก<br />แล้วมาเจอกัน!</strong><span>SEE YOU THERE ✦</span></div>
      <div className="collage-pass"><MarketPass /></div>
      <div className="collage-ticket"><span>ONE GOOD IDEA IS ALL IT TAKES.</span><strong>YOUR SPOT.<br /><em>your story.</em></strong><div className="barcode" /><span>BKK / NIGHT MARKET CLUB</span></div>
      <span className="collage-spark spark-one">✳</span>
      <span className="collage-spark spark-two">✧</span>
      <svg className="collage-scribble" viewBox="0 0 140 95" fill="none"><path d="M9 57c26-58 103-60 112-24 7 29-48 37-40 12 5-17 33-10 33 11s-26 30-46 24m0 0 11-13m-11 13 17 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <span className="collage-note">ที่ตรงนี้…รอร้านคุณอยู่</span>
    </div>
  );
}
