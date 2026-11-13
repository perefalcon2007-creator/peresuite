/* APEX TACTICAL STUDIO // BROADCAST TELESTRATOR & SPATIAL PHYSICS ENGINE */
(() => {
  "use strict";

  const canvas = document.getElementById("tacticalCanvas");
  const ctx = canvas.getContext("2d");

  const W = 1050;
  const H = 680;
  const PAD = 30;
  const PITCH_W = W - PAD * 2;
  const PITCH_H = H - PAD * 2;

  canvas.width = W;
  canvas.height = H;

  const FORMATIONS = {
    "4-3-3": [
      { num: 1, role: "GK", x: 0.05, y: 0.50 },
      { num: 2, role: "RB", x: 0.24, y: 0.86 },
      { num: 4, role: "RCB", x: 0.20, y: 0.64 },
      { num: 5, role: "LCB", x: 0.20, y: 0.36 },
      { num: 3, role: "LB", x: 0.24, y: 0.14 },
      { num: 6, role: "DM", x: 0.36, y: 0.50 },
      { num: 8, role: "RCM", x: 0.48, y: 0.68 },
      { num: 10, role: "LCM", x: 0.48, y: 0.32 },
      { num: 7, role: "RW", x: 0.68, y: 0.84 },
      { num: 9, role: "ST", x: 0.72, y: 0.50 },
      { num: 11, role: "LW", x: 0.68, y: 0.16 }
    ],
    "3-2-5": [
      { num: 1, role: "GK", x: 0.05, y: 0.50 },
      { num: 4, role: "RCB", x: 0.22, y: 0.74 },
      { num: 5, role: "CCB", x: 0.20, y: 0.50 },
      { num: 3, role: "LCB", x: 0.22, y: 0.26 },
      { num: 6, role: "RDM", x: 0.38, y: 0.62 },
      { num: 8, role: "LDM", x: 0.38, y: 0.38 },
      { num: 2, role: "RWB", x: 0.64, y: 0.90 },
      { num: 7, role: "RHS", x: 0.66, y: 0.68 },
      { num: 9, role: "ST", x: 0.72, y: 0.50 },
      { num: 10, role: "LHS", x: 0.66, y: 0.32 },
      { num: 11, role: "LWB", x: 0.64, y: 0.10 }
    ],
    "4-2-3-1": [
      { num: 1, role: "GK", x: 0.05, y: 0.50 },
      { num: 2, role: "RB", x: 0.23, y: 0.86 },
      { num: 4, role: "RCB", x: 0.19, y: 0.64 },
      { num: 5, role: "LCB", x: 0.19, y: 0.36 },
      { num: 3, role: "LB", x: 0.23, y: 0.14 },
      { num: 6, role: "RDM", x: 0.36, y: 0.62 },
      { num: 8, role: "LDM", x: 0.36, y: 0.38 },
      { num: 7, role: "RAM", x: 0.55, y: 0.82 },
      { num: 10, role: "CAM", x: 0.56, y: 0.50 },
      { num: 11, role: "LAM", x: 0.55, y: 0.18 },
      { num: 9, role: "ST", x: 0.72, y: 0.50 }
    ],
    "4-4-2": [
      { num: 1, role: "GK", x: 0.05, y: 0.50 },
      { num: 2, role: "RB", x: 0.22, y: 0.86 },
      { num: 4, role: "RCB", x: 0.20, y: 0.64 },
      { num: 5, role: "LCB", x: 0.20, y: 0.36 },
      { num: 3, role: "LB", x: 0.22, y: 0.14 },
      { num: 7, role: "RM", x: 0.44, y: 0.85 },
      { num: 6, role: "RCM", x: 0.42, y: 0.61 },
      { num: 8, role: "LCM", x: 0.42, y: 0.39 },
      { num: 11, role: "LM", x: 0.44, y: 0.15 },
      { num: 9, role: "RS", x: 0.66, y: 0.60 },
      { num: 10, role: "LS", x: 0.66, y: 0.40 }
    ],
    "4-4-2-diamond": [
      { num: 1, role: "GK", x: 0.05, y: 0.50 },
      { num: 2, role: "RB", x: 0.25, y: 0.86 },
      { num: 4, role: "RCB", x: 0.20, y: 0.64 },
      { num: 5, role: "LCB", x: 0.20, y: 0.36 },
      { num: 3, role: "LB", x: 0.25, y: 0.14 },
      { num: 6, role: "DM", x: 0.35, y: 0.50 },
      { num: 8, role: "RCM", x: 0.46, y: 0.70 },
      { num: 7, role: "LCM", x: 0.46, y: 0.30 },
      { num: 10, role: "CAM", x: 0.57, y: 0.50 },
      { num: 9, role: "RS", x: 0.69, y: 0.61 },
      { num: 11, role: "LS", x: 0.69, y: 0.39 }
    ],
    "3-5-2": [
      { num: 1, role: "GK", x: 0.05, y: 0.50 },
      { num: 4, role: "RCB", x: 0.21, y: 0.73 },
      { num: 5, role: "CCB", x: 0.19, y: 0.50 },
      { num: 3, role: "LCB", x: 0.21, y: 0.27 },
      { num: 2, role: "RWB", x: 0.46, y: 0.90 },
      { num: 6, role: "DM", x: 0.37, y: 0.50 },
      { num: 8, role: "RCM", x: 0.48, y: 0.68 },
      { num: 10, role: "LCM", x: 0.48, y: 0.32 },
      { num: 11, role: "LWB", x: 0.46, y: 0.10 },
      { num: 9, role: "RS", x: 0.68, y: 0.60 },
      { num: 7, role: "LS", x: 0.68, y: 0.40 }
    ]
  };

  Object.assign(FORMATIONS, {
    "3-4-3": [
      { num: 1, role: "GK", x: 0.05, y: 0.50 },
      { num: 4, role: "RCB", x: 0.21, y: 0.74 },
      { num: 5, role: "CCB", x: 0.19, y: 0.50 },
      { num: 3, role: "LCB", x: 0.21, y: 0.26 },
      { num: 2, role: "RM", x: 0.45, y: 0.88 },
      { num: 6, role: "RCM", x: 0.42, y: 0.62 },
      { num: 8, role: "LCM", x: 0.42, y: 0.38 },
      { num: 11, role: "LM", x: 0.45, y: 0.12 },
      { num: 7, role: "RW", x: 0.67, y: 0.80 },
      { num: 9, role: "ST", x: 0.71, y: 0.50 },
      { num: 10, role: "LW", x: 0.67, y: 0.20 }
    ],
    "4-1-4-1": [
      { num: 1, role: "GK", x: 0.05, y: 0.50 },
      { num: 2, role: "RB", x: 0.22, y: 0.86 },
      { num: 4, role: "RCB", x: 0.20, y: 0.64 },
      { num: 5, role: "LCB", x: 0.20, y: 0.36 },
      { num: 3, role: "LB", x: 0.22, y: 0.14 },
      { num: 6, role: "DM", x: 0.34, y: 0.50 },
      { num: 7, role: "RM", x: 0.50, y: 0.85 },
      { num: 8, role: "RCM", x: 0.49, y: 0.62 },
      { num: 10, role: "LCM", x: 0.49, y: 0.38 },
      { num: 11, role: "LM", x: 0.50, y: 0.15 },
      { num: 9, role: "ST", x: 0.70, y: 0.50 }
    ],
    "4-2-2-2": [
      { num: 1, role: "GK", x: 0.05, y: 0.50 },
      { num: 2, role: "RB", x: 0.24, y: 0.86 },
      { num: 4, role: "RCB", x: 0.20, y: 0.64 },
      { num: 5, role: "LCB", x: 0.20, y: 0.36 },
      { num: 3, role: "LB", x: 0.24, y: 0.14 },
      { num: 6, role: "RDM", x: 0.38, y: 0.62 },
      { num: 8, role: "LDM", x: 0.38, y: 0.38 },
      { num: 7, role: "RAM", x: 0.54, y: 0.72 },
      { num: 10, role: "LAM", x: 0.54, y: 0.28 },
      { num: 9, role: "RS", x: 0.69, y: 0.60 },
      { num: 11, role: "LS", x: 0.69, y: 0.40 }
    ],
    "3-1-4-2": [
      { num: 1, role: "GK", x: 0.05, y: 0.50 },
      { num: 4, role: "RCB", x: 0.21, y: 0.74 },
      { num: 5, role: "CCB", x: 0.19, y: 0.50 },
      { num: 3, role: "LCB", x: 0.21, y: 0.26 },
      { num: 6, role: "DM", x: 0.34, y: 0.50 },
      { num: 2, role: "RWB", x: 0.50, y: 0.90 },
      { num: 8, role: "RCM", x: 0.50, y: 0.65 },
      { num: 10, role: "LCM", x: 0.50, y: 0.35 },
      { num: 11, role: "LWB", x: 0.50, y: 0.10 },
      { num: 9, role: "RS", x: 0.69, y: 0.60 },
      { num: 7, role: "LS", x: 0.69, y: 0.40 }
    ],
    "5-3-2": [
      { num: 1, role: "GK", x: 0.05, y: 0.50 },
      { num: 2, role: "RWB", x: 0.26, y: 0.88 },
      { num: 4, role: "RCB", x: 0.20, y: 0.70 },
      { num: 5, role: "CCB", x: 0.18, y: 0.50 },
      { num: 6, role: "LCB", x: 0.20, y: 0.30 },
      { num: 3, role: "LWB", x: 0.26, y: 0.12 },
      { num: 8, role: "RCM", x: 0.42, y: 0.68 },
      { num: 10, role: "CM", x: 0.40, y: 0.50 },
      { num: 7, role: "LCM", x: 0.42, y: 0.32 },
      { num: 9, role: "RS", x: 0.64, y: 0.60 },
      { num: 11, role: "LS", x: 0.64, y: 0.40 }
    ],
    "5-4-1": [
      { num: 1, role: "GK", x: 0.05, y: 0.50 },
      { num: 2, role: "RWB", x: 0.24, y: 0.88 },
      { num: 4, role: "RCB", x: 0.19, y: 0.70 },
      { num: 5, role: "CCB", x: 0.18, y: 0.50 },
      { num: 6, role: "LCB", x: 0.19, y: 0.30 },
      { num: 3, role: "LWB", x: 0.24, y: 0.12 },
      { num: 7, role: "RM", x: 0.40, y: 0.84 },
      { num: 8, role: "RCM", x: 0.38, y: 0.61 },
      { num: 10, role: "LCM", x: 0.38, y: 0.39 },
      { num: 11, role: "LM", x: 0.40, y: 0.16 },
      { num: 9, role: "ST", x: 0.60, y: 0.50 }
    ]
  });

  const state = {
    mode: "2d",
    tool: "select",
    color: "#00f5d4",
    turf: "vertical",
    displayMode: "number",
    showAway: true,
    overlays: { voronoi: false, hull: true, lanes: false, halfSpaces: false, thirds: false, zones18: false },
    home: { name: "HOME", color: "#ffffff", formation: "4-3-3", players: [] },
    away: { name: "AWAY", color: "#09090b", formation: "4-4-2", players: [] },
    ball: { x: W * 0.5, y: H * 0.5, r: 10 },
    drawings2D: [],
    drawingsTV: [],
    activeDraft: null,
    draggingItem: null,
    dragOffset: { x: 0, y: 0 },
    media: { type: null, element: null },
    calibration: { active: false, points: [], matrix: null }
  };

  const voronoiCanvas = document.createElement("canvas");
  voronoiCanvas.width = 210;
  voronoiCanvas.height = 136;
  const vCtx = voronoiCanvas.getContext("2d");

  function getContrastText(hex) {
    const clean = hex.replace("#", "");
    const r = parseInt(clean.substring(0, 2), 16) || 0;
    const g = parseInt(clean.substring(2, 4), 16) || 0;
    const b = parseInt(clean.substring(4, 6), 16) || 0;
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.58 ? "#09090b" : "#ffffff";
  }

  function buildSquad(teamKey, formationName) {
    const template = FORMATIONS[formationName] || FORMATIONS["4-3-3"];
    const isAway = teamKey === "away";
    state[teamKey].players = template.map((p, idx) => {
      const nx = isAway ? 1 - p.x : p.x;
      const ny = isAway ? 1 - p.y : p.y;
      return {
        id: `${teamKey}-${idx}`,
        team: teamKey,
        num: p.num,
        role: p.role,
        x: PAD + nx * PITCH_W,
        y: PAD + ny * PITCH_H,
        r: 16
      };
    });
  }

  function computeConvexHull(points) {
    if (points.length < 3) return points.slice();
    const sorted = points.slice().sort((a, b) => (a.x === b.x ? a.y - b.y : a.x - b.x));
    const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
    const lower = [];
    for (const p of sorted) {
      while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
      lower.push(p);
    }
    const upper = [];
    for (let i = sorted.length - 1; i >= 0; i--) {
      const p = sorted[i];
      while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
      upper.push(p);
    }
    upper.pop();
    lower.pop();
    return lower.concat(upper);
  }

  function updateCompactnessTelemetry() {
    ["home", "away"].forEach((teamKey) => {
      if (teamKey === "away" && !state.showAway) {
        document.getElementById("awayWidth").textContent = "--";
        document.getElementById("awayDepth").textContent = "--";
        document.getElementById("awayArea").textContent = "--";
        return;
      }
      const outfield = state[teamKey].players.slice(1);
      const xs = outfield.map((p) => ((p.x - PAD) / PITCH_W) * 105);
      const ys = outfield.map((p) => ((p.y - PAD) / PITCH_H) * 68);
      const depth = Math.max(...xs) - Math.min(...xs);
      const width = Math.max(...ys) - Math.min(...ys);

      const hull = computeConvexHull(
        outfield.map((p) => ({ x: ((p.x - PAD) / PITCH_W) * 105, y: ((p.y - PAD) / PITCH_H) * 68 }))
      );
      let area = 0;
      for (let i = 0; i < hull.length; i++) {
        const j = (i + 1) % hull.length;
        area += hull[i].x * hull[j].y - hull[j].x * hull[i].y;
      }
      area = Math.abs(area) / 2;

      document.getElementById(`${teamKey}Width`).textContent = width.toFixed(1);
      document.getElementById(`${teamKey}Depth`).textContent = depth.toFixed(1);
      document.getElementById(`${teamKey}Area`).textContent = Math.round(area);
    });
  }

  function computeHomography(pts) {
    if (pts.length !== 4) return null;
    const [p0, p1, p2, p3] = pts;
    const dx1 = p1.x - p2.x, dx2 = p3.x - p2.x, dx3 = p0.x - p1.x + p2.x - p3.x;
    const dy1 = p1.y - p2.y, dy2 = p3.y - p2.y, dy3 = p0.y - p1.y + p2.y - p3.y;
    const det = dx1 * dy2 - dx2 * dy1;
    if (Math.abs(det) < 1e-6) return null;

    const g = (dx3 * dy2 - dx2 * dy3) / det;
    const h = (dx1 * dy3 - dx3 * dy1) / det;
    return [
      p1.x - p0.x + g * p1.x,
      p3.x - p0.x + h * p3.x,
      p0.x,
      p1.y - p0.y + g * p1.y,
      p3.y - p0.y + h * p3.y,
      p0.y,
      g,
      h
    ];
  }

  function projectPoint3D(x, y) {
    const M = state.calibration.matrix;
    if (state.mode !== "tv" || !M) return { x, y, scale: 1 };
    const u = x / W;
    const v = y / H;
    const denom = M[6] * u + M[7] * v + 1;
    const px = (M[0] * u + M[1] * v + M[2]) / denom;
    const py = (M[3] * u + M[4] * v + M[5]) / denom;
    const scale = Math.max(0.45, Math.min(1.55, 0.65 + v * 0.65));
    return { x: px, y: py, scale };
  }

  function drawPitch() {
    const isStealth = state.turf === "stealth";
    ctx.fillStyle = isStealth ? "#0a0f18" : "#113825";
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.beginPath();
    ctx.rect(PAD, PAD, PITCH_W, PITCH_H);
    ctx.clip();

    const c1 = isStealth ? "#0d1420" : "#14452d";
    const c2 = isStealth ? "#111a29" : "#185236";

    if (state.turf === "vertical") {
      const sw = PITCH_W / 16;
      for (let i = 0; i < 16; i++) {
        ctx.fillStyle = i % 2 === 0 ? c1 : c2;
        ctx.fillRect(PAD + i * sw, PAD, sw, PITCH_H);
      }
    } else if (state.turf === "horizontal") {
      const bh = PITCH_H / 10;
      for (let i = 0; i < 10; i++) {
        ctx.fillStyle = i % 2 === 0 ? c1 : c2;
        ctx.fillRect(PAD, PAD + i * bh, PITCH_W, bh);
      }
    } else if (state.turf === "checkered") {
      const cw = PITCH_W / 16, ch = PITCH_H / 10;
      for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 16; c++) {
          ctx.fillStyle = (r + c) % 2 === 0 ? c1 : c2;
          ctx.fillRect(PAD + c * cw, PAD + r * ch, cw, ch);
        }
      }
    } else if (state.turf === "circles") {
      ctx.fillStyle = c1;
      ctx.fillRect(PAD, PAD, PITCH_W, PITCH_H);
      for (let rad = 520; rad > 0; rad -= 45) {
        ctx.fillStyle = (rad / 45) % 2 === 0 ? c1 : c2;
        ctx.beginPath();
        ctx.arc(W / 2, H / 2, rad, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      ctx.fillStyle = c1;
      ctx.fillRect(PAD, PAD, PITCH_W, PITCH_H);
    }

    drawGeometryOverlays();
    ctx.restore();

    const lineCol = isStealth ? "rgba(148, 163, 184, 0.45)" : "rgba(255, 255, 255, 0.78)";
    ctx.strokeStyle = lineCol;
    ctx.lineWidth = 2;
    ctx.strokeRect(PAD, PAD, PITCH_W, PITCH_H);
    ctx.beginPath();
    ctx.moveTo(W / 2, PAD);
    ctx.lineTo(W / 2, H - PAD);
    ctx.stroke();

    const mScaleX = PITCH_W / 105, mScaleY = PITCH_H / 68;
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, 9.15 * mScaleX, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = lineCol;
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, 3.5, 0, Math.PI * 2);
    ctx.fill();

    const penW = 16.5 * mScaleX, penH = 40.32 * mScaleY;
    const sixW = 5.5 * mScaleX, sixH = 18.32 * mScaleY;
    ctx.strokeRect(PAD, H / 2 - penH / 2, penW, penH);
    ctx.strokeRect(W - PAD - penW, H / 2 - penH / 2, penW, penH);
    ctx.strokeRect(PAD, H / 2 - sixH / 2, sixW, sixH);
    ctx.strokeRect(W - PAD - sixW, H / 2 - sixH / 2, sixW, sixH);

    const penSpot = 11 * mScaleX;
    [PAD + penSpot, W - PAD - penSpot].forEach((sx, idx) => {
      ctx.beginPath();
      ctx.arc(sx, H / 2, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(sx, H / 2, 9.15 * mScaleX, idx === 0 ? -0.92 : Math.PI - 0.92, idx === 0 ? 0.92 : Math.PI + 0.92);
      ctx.stroke();
    });

    const cRad = 1.5 * mScaleX;
    [
      [PAD, PAD, 0, Math.PI / 2],
      [W - PAD, PAD, Math.PI / 2, Math.PI],
      [W - PAD, H - PAD, Math.PI, Math.PI * 1.5],
      [PAD, H - PAD, Math.PI * 1.5, Math.PI * 2]
    ].forEach(([cx, cy, a1, a2]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, cRad, a1, a2);
      ctx.stroke();
    });
  }

  function drawGeometryOverlays() {
    ctx.save();
    const laneBounds = [0, 0.18, 0.36, 0.64, 0.82, 1.0];
    if (state.overlays.lanes) {
      ctx.strokeStyle = "rgba(0, 245, 212, 0.35)";
      ctx.setLineDash([8, 6]);
      for (let i = 1; i < laneBounds.length - 1; i++) {
        const y = PAD + laneBounds[i] * PITCH_H;
        ctx.beginPath();
        ctx.moveTo(PAD, y);
        ctx.lineTo(W - PAD, y);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    if (state.overlays.halfSpaces) {
      const hsBands = [
        { y1: PAD + 0.18 * PITCH_H, y2: PAD + 0.36 * PITCH_H, label: "LEFT HALF-SPACE" },
        { y1: PAD + 0.64 * PITCH_H, y2: PAD + 0.82 * PITCH_H, label: "RIGHT HALF-SPACE" }
      ];
      const allPlayers = state.home.players.concat(state.showAway ? state.away.players : []);
      hsBands.forEach((band) => {
        const count = allPlayers.filter((p) => p.y >= band.y1 && p.y <= band.y2).length;
        const crowded = count >= 5;
        ctx.fillStyle = crowded ? "rgba(255, 42, 109, 0.22)" : "rgba(254, 228, 64, 0.16)";
        ctx.fillRect(PAD, band.y1, PITCH_W, band.y2 - band.y1);
        ctx.font = "700 10px 'JetBrains Mono', monospace";
        ctx.fillStyle = crowded ? "#ff2a6d" : "#fee440";
        ctx.fillText(crowded ? `${band.label} // OVERLOAD (${count} PLAYERS)` : band.label, PAD + 14, band.y1 + 16);
      });
    }

    if (state.overlays.thirds) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
      ctx.setLineDash([8, 6]);
      [1 / 3, 2 / 3].forEach((t) => {
        const x = PAD + t * PITCH_W;
        ctx.beginPath();
        ctx.moveTo(x, PAD);
        ctx.lineTo(x, H - PAD);
        ctx.stroke();
      });
      ctx.setLineDash([]);
    }

    if (state.overlays.zones18) {
      const zw = PITCH_W / 6, zh = PITCH_H / 3;
      ctx.strokeStyle = "rgba(0, 245, 212, 0.28)";
      ctx.font = "600 11px 'JetBrains Mono', monospace";
      ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
      let zoneNum = 1;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 6; c++) {
          const zx = PAD + c * zw, zy = PAD + r * zh;
          ctx.strokeRect(zx, zy, zw, zh);
          ctx.fillText(`Z${zoneNum++}`, zx + 8, zy + 18);
        }
      }
    }
    ctx.restore();
  }

  function drawVoronoiOverlay() {
    if (!state.overlays.voronoi) return;
    const vw = voronoiCanvas.width, vh = voronoiCanvas.height;
    const imgData = vCtx.createImageData(vw, vh);
    const data = imgData.data;

    const hexToRgb = (hex) => {
      const clean = hex.replace("#", "");
      return [
        parseInt(clean.substring(0, 2), 16) || 0,
        parseInt(clean.substring(2, 4), 16) || 0,
        parseInt(clean.substring(4, 6), 16) || 0
      ];
    };

    const homeRgb = hexToRgb(state.home.color);
    const awayRgb = hexToRgb(state.away.color);
    const agents = state.home.players.map((p) => ({ x: (p.x / W) * vw, y: (p.y / H) * vh, team: "home" }));
    if (state.showAway) {
      state.away.players.forEach((p) => agents.push({ x: (p.x / W) * vw, y: (p.y / H) * vh, team: "away" }));
    }

    for (let y = 0; y < vh; y++) {
      for (let x = 0; x < vw; x++) {
        let minDist = Infinity, owner = "home";
        for (let i = 0; i < agents.length; i++) {
          const dx = x - agents[i].x, dy = y - agents[i].y;
          const d = dx * dx + dy * dy;
          if (d < minDist) { minDist = d; owner = agents[i].team; }
        }
        const idx = (y * vw + x) * 4;
        const rgb = owner === "home" ? homeRgb : awayRgb;
        data[idx] = rgb[0]; data[idx + 1] = rgb[1]; data[idx + 2] = rgb[2]; data[idx + 3] = 58;
      }
    }
    vCtx.putImageData(imgData, 0, 0);
    ctx.save();
    ctx.beginPath();
    ctx.rect(PAD, PAD, PITCH_W, PITCH_H);
    ctx.clip();
    ctx.drawImage(voronoiCanvas, 0, 0, W, H);
    ctx.restore();
  }

  function drawTeamHulls() {
    if (!state.overlays.hull) return;
    ["home", "away"].forEach((teamKey) => {
      if (teamKey === "away" && !state.showAway) return;
      const hull = computeConvexHull(state[teamKey].players.slice(1));
      if (hull.length < 3) return;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(hull[0].x, hull[0].y);
      for (let i = 1; i < hull.length; i++) ctx.lineTo(hull[i].x, hull[i].y);
      ctx.closePath();
      ctx.fillStyle = state[teamKey].color + "24";
      ctx.strokeStyle = state[teamKey].color;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });
  }

  function drawPlayersAndBall() {
    const drawTeam = (teamKey) => {
      const team = state[teamKey];
      const textCol = getContrastText(team.color);
      team.players.forEach((p) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y + 3, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,0,0,0.45)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = team.color;
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = team.color.toLowerCase() === "#ffffff" ? "#0f172a" : "#ffffff";
        ctx.stroke();

        ctx.fillStyle = textCol;
        ctx.font = state.displayMode === "number" ? "700 13px 'Rajdhani', sans-serif" : "700 10.5px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(state.displayMode === "number" ? String(p.num) : p.role, p.x, p.y + 0.5);
        ctx.restore();
      });
    };

    drawTeam("home");
    if (state.showAway) drawTeam("away");

    const b = state.ball;
    ctx.save();
    ctx.beginPath();
    ctx.arc(b.x, b.y + 2, b.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#09090b";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#09090b";
    ctx.fill();
    ctx.restore();
  }

  function drawArrowHead(x, y, angle, size, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-size, -size * 0.55);
    ctx.lineTo(-size * 0.78, 0);
    ctx.lineTo(-size, size * 0.55);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function renderGraphic(item) {
    const p1 = projectPoint3D(item.x1, item.y1);
    const p2 = projectPoint3D(item.x2 ?? item.x1, item.y2 ?? item.y1);
    const col = item.color;

    ctx.save();
    ctx.strokeStyle = col;
    ctx.fillStyle = col;
    ctx.lineWidth = 3.2 * p1.scale;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowColor = "rgba(0,0,0,0.65)";
    ctx.shadowBlur = 6;

    const dx = p2.x - p1.x, dy = p2.y - p1.y;
    const dist = Math.hypot(dx, dy);
    const ang = Math.atan2(dy, dx);

    switch (item.type) {
      case "goalpost": {
        const gw = 56 * p1.scale, gh = 24 * p1.scale;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3.5 * p1.scale;
        ctx.fillStyle = "rgba(255,255,255,0.14)";
        ctx.fillRect(p1.x - gw / 2, p1.y - gh, gw, gh);
        ctx.strokeRect(p1.x - gw / 2, p1.y - gh, gw, gh);
        break;
      }
      case "spotlight": {
        const rx = Math.max(24, dist || 34), ry = rx * 0.42;
        const grad = ctx.createRadialGradient(p1.x, p1.y - rx * 0.6, 4, p1.x, p1.y, rx * 1.2);
        grad.addColorStop(0, col + "44");
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(p1.x - rx * 0.65, p1.y - rx * 1.4);
        ctx.lineTo(p1.x + rx * 0.65, p1.y - rx * 1.4);
        ctx.lineTo(p1.x + rx, p1.y);
        ctx.lineTo(p1.x - rx, p1.y);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(p1.x, p1.y, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
        break;
      }
      case "trap": {
        const r = Math.max(28, dist || 40);
        ctx.fillStyle = col + "22";
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.setLineDash([6, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
        for (let i = 0; i < 4; i++) {
          const a = (i * Math.PI) / 2 + Math.PI / 4;
          const sx = p1.x + Math.cos(a) * (r + 18), sy = p1.y + Math.sin(a) * (r + 18);
          const ex = p1.x + Math.cos(a) * (r + 3), ey = p1.y + Math.sin(a) * (r + 3);
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(ex, ey);
          ctx.stroke();
          drawArrowHead(ex, ey, a + Math.PI, 9, col);
        }
        break;
      }
      case "cone": {
        const r = Math.max(30, dist), spread = 0.42;
        const grad = ctx.createRadialGradient(p1.x, p1.y, 4, p1.x, p1.y, r);
        grad.addColorStop(0, col + "55");
        grad.addColorStop(1, col + "08");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.arc(p1.x, p1.y, r, ang - spread, ang + spread);
        ctx.closePath();
        ctx.fill();
        break;
      }
      case "offside": {
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.font = "700 10px 'JetBrains Mono', monospace";
        ctx.fillText("OFFSIDE LINE", p1.x + 8, p1.y - 8);
        break;
      }
      case "arrow": {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        if (dist > 8) drawArrowHead(p2.x, p2.y, ang, 13 * p2.scale, col);
        break;
      }
      case "lofted": {
        const cx = (p1.x + p2.x) / 2, cy = (p1.y + p2.y) / 2 - dist * 0.34;
        ctx.setLineDash([6, 5]);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.quadraticCurveTo(cx, cy, p2.x, p2.y);
        ctx.stroke();
        ctx.setLineDash([]);
        if (dist > 8) drawArrowHead(p2.x, p2.y, Math.atan2(p2.y - cy, p2.x - cx), 13 * p2.scale, col);
        break;
      }
      case "carry": {
        const steps = Math.max(6, Math.floor(dist / 8));
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const bx = p1.x + dx * t, by = p1.y + dy * t;
          const perp = Math.sin(t * Math.PI * (dist / 16)) * 6;
          const px = bx - Math.sin(ang) * perp, py = by + Math.cos(ang) * perp;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        if (dist > 8) drawArrowHead(p2.x, p2.y, ang, 13 * p2.scale, col);
        break;
      }
      case "curve": {
        const nx = -Math.sin(ang), ny = Math.cos(ang);
        const cx = (p1.x + p2.x) / 2 + nx * (dist * 0.28), cy = (p1.y + p2.y) / 2 + ny * (dist * 0.28);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.quadraticCurveTo(cx, cy, p2.x, p2.y);
        ctx.stroke();
        if (dist > 8) drawArrowHead(p2.x, p2.y, Math.atan2(p2.y - cy, p2.x - cx), 13 * p2.scale, col);
        break;
      }
      case "onetwo": {
        const nx = -Math.sin(ang), ny = Math.cos(ang);
        const wx = (p1.x + p2.x) / 2 + nx * (dist * 0.35), wy = (p1.y + p2.y) / 2 + ny * (dist * 0.35);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(wx, wy);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(wx, wy, 5, 0, Math.PI * 2);
        ctx.fill();
        if (dist > 8) drawArrowHead(p2.x, p2.y, Math.atan2(p2.y - wy, p2.x - wx), 13, col);
        break;
      }
      case "chain": {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        [p1, p2].forEach((pt) => {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 6.5, 0, Math.PI * 2);
          ctx.fill();
        });
        break;
      }
      case "shield": {
        ctx.lineWidth = 6 * p1.scale;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        break;
      }
      case "zone": {
        const rx = Math.min(p1.x, p2.x), ry = Math.min(p1.y, p2.y);
        const rw = Math.abs(dx), rh = Math.abs(dy);
        ctx.fillStyle = col + "28";
        ctx.fillRect(rx, ry, rw, rh);
        ctx.strokeRect(rx, ry, rw, rh);
        break;
      }
      case "text": {
        const label = item.text || "TACTICAL CALLOUT";
        ctx.font = "700 13px 'Plus Jakarta Sans', sans-serif";
        const tw = ctx.measureText(label).width;
        ctx.fillStyle = "rgba(7, 11, 18, 0.88)";
        ctx.fillRect(p1.x - 8, p1.y - 16, tw + 16, 24);
        ctx.strokeRect(p1.x - 8, p1.y - 16, tw + 16, 24);
        ctx.fillStyle = col;
        ctx.fillText(label, p1.x, p1.y);
        break;
      }
    }
    ctx.restore();
  }

  function render() {
    ctx.clearRect(0, 0, W, H);
    if (state.mode === "2d") {
      drawPitch();
      drawVoronoiOverlay();
      drawTeamHulls();
      state.drawings2D.forEach(renderGraphic);
      if (state.activeDraft) renderGraphic(state.activeDraft);
      drawPlayersAndBall();
    } else {
      ctx.fillStyle = "#060910";
      ctx.fillRect(0, 0, W, H);
      if (state.media.element) {
        ctx.drawImage(state.media.element, 0, 0, W, H);
      } else {
        ctx.fillStyle = "#94a3b8";
        ctx.font = "600 16px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Click '+ Load Video / Frame' in the top bar to analyze match footage", W / 2, H / 2);
      }
      if (state.calibration.points.length > 0 && state.calibration.active) {
        ctx.save();
        ctx.strokeStyle = "#00f5d4";
        ctx.fillStyle = "rgba(0, 245, 212, 0.14)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        state.calibration.points.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
          ctx.fillRect(pt.x - 5, pt.y - 5, 10, 10);
        });
        if (state.calibration.points.length === 4) ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
      state.drawingsTV.forEach(renderGraphic);
      if (state.activeDraft) renderGraphic(state.activeDraft);
    }
    requestAnimationFrame(render);
  }

  function getCanvasCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: ((clientX - rect.left) / rect.width) * W, y: ((clientY - rect.top) / rect.height) * H };
  }

  canvas.addEventListener("pointerdown", (e) => {
    const pos = getCanvasCoords(e);
    if (state.mode === "tv" && state.calibration.active) {
      state.calibration.points.push(pos);
      const step = state.calibration.points.length;
      const banner = document.getElementById("bannerPrompt");
      const labels = ["Top-Left", "Top-Right", "Bottom-Right", "Bottom-Left"];
      if (step < 4) {
        banner.textContent = `Click Turf Corner ${step + 1} of 4: ${labels[step]}`;
      } else {
        state.calibration.matrix = computeHomography(state.calibration.points);
        state.calibration.active = false;
        banner.classList.add("hidden");
        const pill = document.getElementById("calibStatus");
        pill.textContent = "Status: 3D Turf Perspective Locked";
        pill.classList.add("calibrated");
      }
      return;
    }

    if (state.tool === "select") {
      if (state.mode === "2d") {
        if (Math.hypot(pos.x - state.ball.x, pos.y - state.ball.y) <= state.ball.r + 8) {
          state.draggingItem = { kind: "ball", ref: state.ball };
          state.dragOffset = { x: pos.x - state.ball.x, y: pos.y - state.ball.y };
          return;
        }
        const allPlayers = state.home.players.concat(state.showAway ? state.away.players : []);
        for (let i = allPlayers.length - 1; i >= 0; i--) {
          const p = allPlayers[i];
          if (Math.hypot(pos.x - p.x, pos.y - p.y) <= p.r + 5) {
            state.draggingItem = { kind: "player", ref: p };
            state.dragOffset = { x: pos.x - p.x, y: pos.y - p.y };
            return;
          }
        }
      }
      const layer = state.mode === "2d" ? state.drawings2D : state.drawingsTV;
      for (let i = layer.length - 1; i >= 0; i--) {
        const d = layer[i];
        if (Math.hypot(pos.x - d.x1, pos.y - d.y1) <= 26) {
          state.draggingItem = { kind: "drawing", ref: d };
          state.dragOffset = { x: pos.x - d.x1, y: pos.y - d.y1 };
          return;
        }
      }
      return;
    }

    if (state.tool === "text") {
      const msg = prompt("Enter Tactical Callout Text:", "HALF-SPACE OVERLOAD");
      if (msg && msg.trim()) {
        const layer = state.mode === "2d" ? state.drawings2D : state.drawingsTV;
        layer.push({ type: "text", color: state.color, x1: pos.x, y1: pos.y, text: msg.trim().toUpperCase() });
      }
      return;
    }

    state.activeDraft = { type: state.tool, color: state.color, x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y };
  });

  canvas.addEventListener("pointermove", (e) => {
    const pos = getCanvasCoords(e);
    if (state.draggingItem) {
      const { kind, ref } = state.draggingItem;
      if (kind === "player" || kind === "ball") {
        ref.x = Math.max(PAD, Math.min(W - PAD, pos.x - state.dragOffset.x));
        ref.y = Math.max(PAD, Math.min(H - PAD, pos.y - state.dragOffset.y));
        updateCompactnessTelemetry();
      } else if (kind === "drawing") {
        const dx = (ref.x2 ?? ref.x1) - ref.x1, dy = (ref.y2 ?? ref.y1) - ref.y1;
        ref.x1 = pos.x - state.dragOffset.x;
        ref.y1 = pos.y - state.dragOffset.y;
        if (ref.x2 !== undefined) { ref.x2 = ref.x1 + dx; ref.y2 = ref.y1 + dy; }
      }
      return;
    }
    if (state.activeDraft) { state.activeDraft.x2 = pos.x; state.activeDraft.y2 = pos.y; }
  });

  window.addEventListener("pointerup", () => {
    state.draggingItem = null;
    if (state.activeDraft) {
      const layer = state.mode === "2d" ? state.drawings2D : state.drawingsTV;
      layer.push(state.activeDraft);
      state.activeDraft = null;
    }
  });

  function bindUI() {
    const btn2D = document.getElementById("btnMode2D");
    const btnTV = document.getElementById("btnModeTV");
    btn2D.addEventListener("click", () => { state.mode = "2d"; btn2D.classList.add("active"); btnTV.classList.remove("active"); });
    btnTV.addEventListener("click", () => { state.mode = "tv"; btnTV.classList.add("active"); btn2D.classList.remove("active"); });

    document.querySelectorAll(".tool-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".tool-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        state.tool = btn.dataset.tool;
      });
    });

    document.querySelectorAll(".swatch").forEach((sw) => {
      sw.addEventListener("click", () => {
        document.querySelectorAll(".swatch").forEach((s) => s.classList.remove("active"));
        sw.classList.add("active");
        state.color = sw.dataset.color;
      });
    });

    document.getElementById("btnCalibrate").addEventListener("click", () => {
      if (state.mode !== "tv") btnTV.click();
      state.calibration.active = true;
      state.calibration.points = [];
      state.calibration.matrix = null;
      const banner = document.getElementById("bannerPrompt");
      banner.textContent = "Click Turf Corner 1 of 4: Top-Left";
      banner.classList.remove("hidden");
    });

    document.getElementById("btnResetCalib").addEventListener("click", () => {
      state.calibration.active = false;
      state.calibration.points = [];
      state.calibration.matrix = null;
      document.getElementById("bannerPrompt").classList.add("hidden");
      const pill = document.getElementById("calibStatus");
      pill.textContent = "Status: Flat / Uncalibrated";
      pill.classList.remove("calibrated");
    });

    document.getElementById("btnUndo").addEventListener("click", () => {
      const layer = state.mode === "2d" ? state.drawings2D : state.drawingsTV;
      layer.pop();
    });

    document.getElementById("btnClearDrawings").addEventListener("click", () => {
      if (state.mode === "2d") state.drawings2D = [];
      else state.drawingsTV = [];
    });

    const videoControls = document.getElementById("videoControls");
    const btnPlayPause = document.getElementById("btnPlayPause");
    const videoScrubber = document.getElementById("videoScrubber");
    const videoTime = document.getElementById("videoTime");
    const formatTime = (sec) => `${Math.floor(sec / 60).toString().padStart(2, "0")}:${Math.floor(sec % 60).toString().padStart(2, "0")}`;

    document.getElementById("mediaUpload").addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      btnTV.click();
      if (file.type.startsWith("video/")) {
        const vid = document.createElement("video");
        vid.src = url;
        vid.muted = true;
        vid.playsInline = true;
        vid.addEventListener("loadedmetadata", () => {
          state.media = { type: "video", element: vid };
          videoControls.classList.remove("hidden");
          videoTime.textContent = `00:00 / ${formatTime(vid.duration)}`;
          vid.play();
          btnPlayPause.textContent = "Pause";
        });
        vid.addEventListener("timeupdate", () => {
          if (!vid.duration) return;
          videoScrubber.value = (vid.currentTime / vid.duration) * 100;
          videoTime.textContent = `${formatTime(vid.currentTime)} / ${formatTime(vid.duration)}`;
        });
      } else {
        const img = new Image();
        img.onload = () => { state.media = { type: "image", element: img }; videoControls.classList.add("hidden"); };
        img.src = url;
      }
    });

    btnPlayPause.addEventListener("click", () => {
      const vid = state.media.element;
      if (state.media.type !== "video" || !vid) return;
      if (vid.paused) { vid.play(); btnPlayPause.textContent = "Pause"; }
      else { vid.pause(); btnPlayPause.textContent = "Play"; }
    });

    videoScrubber.addEventListener("input", () => {
      const vid = state.media.element;
      if (state.media.type !== "video" || !vid || !vid.duration) return;
      vid.currentTime = (videoScrubber.value / 100) * vid.duration;
    });

    document.getElementById("btnExportPNG").addEventListener("click", () => {
      const link = document.createElement("a");
      link.download = `APEX-Tactical-${state.mode.toUpperCase()}-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });

    document.getElementById("turfPattern").addEventListener("change", (e) => { state.turf = e.target.value; });
    document.getElementById("chkVoronoi").addEventListener("change", (e) => { state.overlays.voronoi = e.target.checked; });
    document.getElementById("chkHull").addEventListener("change", (e) => { state.overlays.hull = e.target.checked; });
    document.getElementById("chkLanes").addEventListener("change", (e) => { state.overlays.lanes = e.target.checked; });
    document.getElementById("chkHalfSpaces").addEventListener("change", (e) => { state.overlays.halfSpaces = e.target.checked; });
    document.getElementById("chkThirds").addEventListener("change", (e) => { state.overlays.thirds = e.target.checked; });
    document.getElementById("chkZones18").addEventListener("change", (e) => { state.overlays.zones18 = e.target.checked; });

    document.querySelectorAll(".seg-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".seg-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        state.displayMode = btn.dataset.display;
      });
    });

    document.getElementById("chkShowAway").addEventListener("change", (e) => { state.showAway = e.target.checked; updateCompactnessTelemetry(); });

    const syncTeamUI = (teamKey) => {
      const nameInput = document.getElementById(`${teamKey}NameInput`);
      const colorInput = document.getElementById(`${teamKey}ColorInput`);
      const formSelect = document.getElementById(`${teamKey}Formation`);
      const labelEl = document.getElementById(`${teamKey}Label`);
      const dotEl = document.querySelector(`.${teamKey}-dot`);
      dotEl.style.background = state[teamKey].color;

      nameInput.addEventListener("input", () => { state[teamKey].name = nameInput.value.trim() || teamKey.toUpperCase(); labelEl.textContent = state[teamKey].name; });
      colorInput.addEventListener("input", () => { state[teamKey].color = colorInput.value; dotEl.style.background = colorInput.value; });
      formSelect.addEventListener("change", () => { state[teamKey].formation = formSelect.value; buildSquad(teamKey, formSelect.value); updateCompactnessTelemetry(); });
    };

    syncTeamUI("home");
    syncTeamUI("away");

    document.querySelectorAll(".kit-presets").forEach((group) => {
      const teamKey = group.dataset.target;
      group.querySelectorAll(".kit-chip").forEach((chip) => {
        chip.addEventListener("click", () => {
          const hex = chip.dataset.kit;
          state[teamKey].color = hex;
          document.getElementById(`${teamKey}ColorInput`).value = hex;
          document.querySelector(`.${teamKey}-dot`).style.background = hex;
        });
      });
    });
  }

  buildSquad("home", state.home.formation);
  buildSquad("away", state.away.formation);
  updateCompactnessTelemetry();
  bindUI();
  requestAnimationFrame(render);

  /* =========================================================
     APEX UNIVERSAL PITCH BRIDGE (POWERS PHASES 2, 3, 4 & 5)
     INSERTED RIGHT ABOVE THE FINAL })(); AT THE END OF engine.js
     ========================================================= */
  window.PitchBridge = {
    canvas,
    state,
    getSnapshot: () => JSON.parse(JSON.stringify({
      homePlayers: state.home.players,
      awayPlayers: state.away.players,
      ball: { x: state.ball.x, y: state.ball.y },
      drawings2D: state.drawings2D,
      drawingsTV: state.drawingsTV,
      mode: state.mode
    })),
    applyFrame: (snap) => {
      if (snap.homePlayers) {
        snap.homePlayers.forEach((sp, i) => {
          if (state.home.players[i]) {
            state.home.players[i].x = sp.x;
            state.home.players[i].y = sp.y;
          }
        });
      }
      if (snap.awayPlayers) {
        snap.awayPlayers.forEach((sp, i) => {
          if (state.away.players[i]) {
            state.away.players[i].x = sp.x;
            state.away.players[i].y = sp.y;
          }
        });
      }
      if (snap.ball) {
        state.ball.x = snap.ball.x;
        state.ball.y = snap.ball.y;
      }
      if (snap.drawings2D) state.drawings2D = JSON.parse(JSON.stringify(snap.drawings2D));
      if (snap.drawingsTV) state.drawingsTV = JSON.parse(JSON.stringify(snap.drawingsTV));
      updateCompactnessTelemetry();
    }
  };

  // Wire drawer/modal toggle buttons from Phase 2-5 dock
  const bindModuleToggles = () => {
    const map = [
      ["btnToggleTagger", "taggerDrawer"],
      ["btnToggleAnalytics", "analyticsModal"],
      ["btnToggleDossier", "dossierModal"]
    ];
    map.forEach(([btnId, targetId]) => {
      const btn = document.getElementById(btnId);
      const target = document.getElementById(targetId);
      if (btn && target) btn.addEventListener("click", () => target.classList.toggle("hidden"));
    });
    document.querySelectorAll(".close-drawer").forEach((btn) => {
      btn.addEventListener("click", () => {
        const el = document.getElementById(btn.dataset.close);
        if (el) el.classList.add("hidden");
      });
    });
  };
  bindModuleToggles();
})();