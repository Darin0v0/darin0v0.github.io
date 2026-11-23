:root {
  --bg-color: #030303;
  --text-main: #b8b8b8;
  --accent-red: #c90000;
  --accent-glow: #ff1e1e;
  --border-dim: #3a0000;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border-radius: 0 !important; /* Zero zaokrągleń */
}

body {
  background-color: var(--bg-color);
  color: var(--text-main);
  font-family: "Courier New", Courier, "Times New Roman", serif;
  min-height: 100vh;
  overflow-x: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: crosshair;
  selection-background-color: var(--accent-red);
}

::selection {
  background: var(--accent-red);
  color: #000;
}

/* Efekt linii CRT na całym ekranie */
.crt-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
    rgba(18, 16, 16, 0) 50%, 
    rgba(0, 0, 0, 0.45) 50%
  ), linear-gradient(
    90deg,
    rgba(255, 0, 0, 0.04),
    rgba(0, 255, 0, 0.01),
    rgba(0, 0, 255, 0.04)
  );
  background-size: 100% 3px, 6px 100%;
  pointer-events: none;
  z-index: 999;
}

.wired-container {
  width: 100%;
  max-width: 720px;
  padding: 2rem;
  border: 1px solid var(--border-dim);
  background: radial-gradient(circle at center, #0d0000 0%, #000000 85%);
  box-shadow: 0 0 25px rgba(180, 0, 0, 0.15);
  position: relative;
}

.sys-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--accent-red);
  border-bottom: 1px dashed var(--border-dim);
  padding-bottom: 0.5rem;
  margin-bottom: 2rem;
  letter-spacing: 2px;
}

.blink {
  animation: blinker 1.2s steps(2, start) infinite;
}

@keyframes blinker {
  to { visibility: hidden; }
}

.core-node {
  text-align: center;
  margin-bottom: 2.5rem;
}

/* Efekt Glitch na tytule */
.glitch-title {
  font-size: 2.8rem;
  font-weight: bold;
  letter-spacing: 0.6rem;
  color: #e0e0e0;
  text-shadow: 2px 0 var(--accent-red), -2px 0 #0044ff;
  margin-bottom: 0.75rem;
  animation: glitch-skew 3s infinite linear alternate-reverse;
}

@keyframes glitch-skew {
  0% { transform: skew(0deg); }
  20% { transform: skew(0deg); }
  21% { transform: skew(4deg); }
  22% { transform: skew(-3deg); }
  23% { transform: skew(0deg); }
  100% { transform: skew(0deg); }
}

.cryptic-quote {
  font-family: "Times New Roman", Times, serif;
  font-style: italic;
  font-size: 0.95rem;
  color: #777;
  margin-bottom: 1.5rem;
}

.media-frame {
  border: 1px double var(--accent-red);
  padding: 1.5rem;
  margin: 0 auto;
  max-width: 360px;
  background-color: #050000;
}

.placeholder-sigil {
  font-size: 0.8rem;
  color: var(--accent-red);
  line-height: 1.6;
  letter-spacing: 2px;
}

/* Linki */
.scattered-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.2rem;
  margin-bottom: 2rem;
}

.node-link {
  color: var(--text-main);
  text-decoration: none;
  font-size: 0.85rem;
  padding: 0.4rem 0.7rem;
  border: 1px solid #222;
  transition: all 0.1s steps(2);
}

.node-link:hover {
  color: #fff;
  background-color: var(--accent-red);
  border-color: var(--accent-glow);
  text-shadow: 0 0 5px #fff;
}

/* Ukryte sekcje */
.hidden-layer {
  display: none;
  border-top: 1px solid var(--border-dim);
  padding: 1.2rem 0;
  margin-top: 1rem;
  font-size: 0.9rem;
  line-height: 1.6;
}

.hidden-layer.active {
  display: block;
}

.hidden-layer h2 {
  font-size: 1rem;
  color: var(--accent-red);
  margin-bottom: 0.8rem;
  letter-spacing: 2px;
}

.hidden-layer ul {
  list-style: none;
}

.hidden-layer a {
  color: var(--accent-glow);
  text-decoration: none;
}

.hidden-layer a:hover {
  text-decoration: underline;
}

.red-text {
  color: var(--accent-glow);
}

/* Stopka */
.sys-footer {
  border-top: 1px dashed var(--border-dim);
  padding-top: 1rem;
  font-size: 0.75rem;
  color: #555;
  text-align: center;
}

.marquee-box {
  overflow: hidden;
  white-space: nowrap;
  color: var(--accent-red);
  margin-bottom: 0.5rem;
}

.marquee-box span {
  display: inline-block;
  padding-left: 100%;
  animation: marquee 16s linear infinite;
}

@keyframes marquee {
  0% { transform: translate(0, 0); }
  100% { transform: translate(-100%, 0); }
}
