export default function MarketPass({ compact = false }) {
  return (
    <div className={`pass-scene${compact ? " pass-scene-compact" : ""}`} aria-hidden="true">
      <div className="pass-ribbon"><span>NIGHT MARKET · NIGHT MARKET ·</span></div>
      <div className="pass-ring" />
      <div className="pass-clip" />
      <div className="market-pass">
        <div className="pass-slot" />
        <span className="pass-monogram">nm</span>
        <div className="pass-title">market<span>Access</span></div>
        <div className="pass-edition">YOUR SPACE. YOUR STORY.</div>
        <div className="pass-identity">
          <div className="pass-portrait"><svg viewBox="0 0 100 100" fill="none"><g fill="#2453cf"><circle cx="50" cy="25" r="17" /><circle cx="71" cy="37" r="17" /><circle cx="71" cy="62" r="17" /><circle cx="50" cy="75" r="17" /><circle cx="29" cy="62" r="17" /><circle cx="29" cy="37" r="17" /></g><circle cx="50" cy="50" r="22" fill="#f1f4b3" /><ellipse cx="43" cy="46" rx="2" ry="3" fill="#15377d" /><ellipse cx="57" cy="46" rx="2" ry="3" fill="#15377d" /><path d="M41 55q9 10 18 0" stroke="#15377d" strokeWidth="2.5" strokeLinecap="round" /></svg></div>
          <div className="pass-fields">
            <div><strong>YOUR NEXT CHAPTER</strong><span>VENDOR NAME</span></div>
            <div><strong>BKK — NIGHT MARKET</strong><span>DESTINATION</span></div>
            <div><strong>A LITTLE SPACE TO BEGIN</strong><span>BIG POSSIBILITIES</span></div>
          </div>
        </div>
        <p className="pass-message">A SPACE FOR YOUR IDEAS.<br />A NIGHT FULL OF POSSIBILITY.<br />MAKE IT YOURS.</p>
        <div className="barcode" />
        <span className="pass-serial">N M · V E N D O R · P A S S</span>
      </div>
      <span className="pass-caption">YOUR NEXT CHAPTER STARTS HERE ↗</span>
    </div>
  );
}
