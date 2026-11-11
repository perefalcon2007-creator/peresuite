(() => {
  const canvas = document.getElementById("tacticalCanvas");
  const ctx = canvas.getContext("2d");

  // Internal logical resolution (105m x 68m standard FIFA pitch scaled 10x)
  const W = 1050;
  const H = 680;
  canvas.width = W;
  canvas.height = H;

  const PITCH_PAD = 40;
  const PW = W - PITCH_PAD * 2; // 970px = 105m
  const PH = H - PITCH_PAD * 2; // 600px = 68m

  // State
  let mode = "2D"; // "2D" | "TV"
  let activeTool = "select"; // select | spotlight | cone | offside | arrow | lofted | carry | chain | zone
  let activeColor = "#00f5d4";
  let displayMode = "number"; // number | role
  let bgImage = null;

  // 4-Point Perspective Calibration (Normalized pitch box [0..1, 0..1] -> Canvas pixels)
  let isCalibrating = false;
  let calibPoints = [];
  let H_mat = null; // 3x3 Pitch -> Screen
  let H_inv = null; // 3x3 Screen -> Pitch

  // Players & Ball (Coordinates stored in normalized pitch [0..1, 0..1])
  let homeTeam = { name: "HOME", color: "#2563eb", players: [] };
  let awayTeam = { name: "AWAY", color: "#ef4444", players: [] };
  let ball = { nx: 0.5, ny: 0.5 };
  let showAway = true;

  // Drawings array
  let graphics = [];
  let draftGraphic = null;
  let chainPoints = [];
  let draggingTarget = null;

  const FORMATIONS = {
    "4-3-3": [
      { num: 1, role: "GK", nx: 0.05, ny: 0.5 },
      { num: 2, role: "RB", nx: 0.24, ny: 0.86 },
      { num: 4, role: "RCB", nx: 0.21, ny: 0.63 },
      { num: 5, role: "LCB", nx: 0.21, ny: 0.37 },
      { num: 3, role: "LB", nx: 0.24, ny: 0.14 },
      { num: 6, role: "DM", nx: 0.36, ny: 0.5 },
      { num: 8, role: "RCM", nx: 0.47, ny: 0.68 },
      { num: 10, role: "LCM", nx: 0.47, ny: 0.32 },
      { num: 7, role: "RW", nx: 0.68, ny: 0.85 },
      { num: 9, role: "ST", nx: 0.72, ny: 0.5 },
      { num: 11, role: "LW", nx: 0.68, ny: 0.15 }
    ],
    "3-2-5": [
      { num: 1, role: "GK", nx: 0.05, ny: 0.5 },
      { num: 4, role: "RCB", nx: 0.26, ny: 0.74 },
      { num: 5, role: "CCB", nx: 0.24, ny: 0.5 },
      { num: 3, role: "LCB", nx: 0.26, ny: 0.26 },
      { num: 6, role: "RDM", nx: 0.42, ny: 0.62 },
      { num: 8, role: "LDM", nx: 0.42, ny: 0.38 },
      { num: 7, role: "RW", nx: 0.66, ny: 0.91 },
      { num: 2, role: "RHS", nx: 0.63, ny: 0.69 },
      { num: 9, role: "ST", nx: 0.71, ny: 0.5 },
      { num: 10, role: "LHS", nx: 0.63, ny: 0.31 },
      { num: 11, role: "LW", nx: 0.66, ny: 0.09 }
    ],
    "4-2-3-1": [
      { num: 1, role: "GK", nx: 0.05, ny: 0.5 },
      { num: 2, role: "RB", nx: 0.25, ny: 0.86 },
      { num: 4, role: "RCB", nx: 0.22, ny: 0.63 },
      { num: 5, role: "LCB", nx: 0.22, ny: 0.37 },
      { num: 3, role: "LB", nx: 0.25, ny: 0.14 },
      { num: 6, role: "RDM", nx: 0.38, ny: 0.62 },
      { num: 8, role: "LDM", nx: 0.38, ny: 0.38 },
      { num: 7, role: "RW", nx: 0.58, ny: 0.84 },
      { num: 10, role: "CAM", nx: 0.56, ny: 0.5 },
      { num: 11, role: "LW", nx: 0.58, ny: 0.16 },
      { num: 9, role: "ST", nx: 0.73, ny: 0.5 }
    ],
    "4-4-2": [
      { num: 1, role: "GK", nx: 0.05, ny: 0.5 },
      { num: 2, role: "RB", nx: 0.24, ny: 0.85 },
      { num: 4, role: "RCB", nx: 0.22, ny: 0.62 },
      { num: 5, role: "LCB", nx: 0.22, ny: 0.38 },
      { num: 3, role: "LB", nx: 0.24, ny: 0.15 },
      { num: 7, role: "RM", nx: 0.45, ny: 0.84 },
      { num: 6, role: "RCM", nx: 0.43, ny: 0.61 },
      { num: 8, role: "LCM", nx: 0.43, ny: 0.39 },
      { num: 11, role: "LM", nx: 0.45, ny: 0.16 },
      { num: 9, role: "RST", nx: 0.65, ny: 0.6 },
      { num: 10, role: "LST", nx: 0.65, ny: 0.4 }
    ],
    "3-5-2": [
      { num: 1, role: "GK", nx: 0.05, ny: 0.5 },
      { num: 4, role: "RCB", nx: 0.23, ny: 0.72 },
      { num: 5, role: "CCB", nx: 0.21, ny: 0.5 },
      { num: 3, role: "LCB", nx: 0.23, ny: 0.28 },
      { num: 2, role: "RWB", nx: 0.46, ny: 0.9 },
      { num: 6, role: "DM", nx: 0.38, ny: 0.5 },
      { num: 8, role: "RCM", nx: 0.48, ny: 0.66 },
      { num: 10, role: "LCM", nx: 0.48, ny: 0.34 },
      { num: 11, role: "LWB", nx: 0.46, ny: 0.1 },
      { num: 9, role: "RST", nx: 0.68, ny: 0.6 },
      { num: 7, role: "LST", nx: 0.68, ny: 0.4 }
    ],
    "5-4-1": [
      { num: 1, role: "GK", nx: 0.05, ny: 0.5 },
      { num: 2, role: "RWB", nx: 0.25, ny: 0.88 },
      { num: 4, role: "RCB", nx: 0.21, ny: 0.68 },
      { num: 5, role: "CCB", nx: 0.2, ny: 0.5 },
      { num: 6, role: "LCB", nx: 0.21, ny: 0.32 },
      { num: 3, role: "LWB", nx: 0.25, ny: 0.12 },
      { num: 7, role: "RM", nx: 0.41, ny: 0.8 },
      { num: 8, role: "RCM", nx: 0.39, ny: 0.59 },
      { num: 10, role: "LCM", nx: 0.39, ny: 0.41 },
      { num: 11, role: "LM", nx: 0.41, ny: 0.2 },
      { num: 9, role: "ST", nx: 0.6, ny: 0.5 }
    ]
  };

  function applyFormation(teamObj, formName, mirror = false) {
    const template = FORMATIONS[formName] || FORMATIONS["4-3-3"];
    teamObj.players = template.map(p => ({
      num: p.num,
      role: p.role,
      nx: mirror ? 1 - p.nx : p.nx,
      ny: mirror ? 1 - p.ny : p.ny
    }));
  }

  applyFormation(homeTeam, "4-3-3", false);
  applyFormation(awayTeam, "4-4-2", true);

  // ==========================================
  // PROJECTIVE HOMOGRAPHY MATH (3D TV WARP)
  // ==========================================
  function solveHomography(src, dst) {
    const A = [];
    const b = [];
    for (let i = 0; i < 4; i++) {
      const [x, y] = src[i];
      const [u, v] = dst[i];
      A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
      b.push(u);
      A.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
      b.push(v);
    }
    const h = gaussianElimination(A, b);
    if (!h) return null;
    return [
      [h[0], h[1], h[2]],
      [h[3], h[4], h[5]],
      [h[6], h[7], 1]
    ];
  }

  function gaussianElimination(A, b) {
    const n = b.length;
    const M = A.map((row, i) => [...row, b[i]]);
    for (let i = 0; i < n; i++) {
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) maxRow = k;
      }
      [M[i], M[maxRow]] = [M[maxRow], M[i]];
      if (Math.abs(M[i][i]) < 1e-10) return null;
      for (let k = i + 1; k < n; k++) {
        const factor = M[k][i] / M[i][i];
        for (let j = i; j <= n; j++) M[k][j] -= factor * M[i][j];
      }
    }
    const x = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let sum = M[i][n];
      for (let j = i + 1; j < n; j++) sum -= M[i][j] * x[j];
      x[i] = sum / M[i][i];
    }
    return x;
  }

  function invert3x3(m) {
    const [a, b, c] = m[0];
    const [d, e, f] = m[1];
    const [g, h, i] = m[2];
    const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
    if (Math.abs(det) < 1e-12) return null;
    const invDet = 1 / det;
    return [
      [(e * i - f * h) * invDet, (c * h - b * i) * invDet, (b * f - c * e) * invDet],
      [(f * g - d * i) * invDet, (a * i - c * g) * invDet, (c * d - a * f) * invDet],
      [(d * h - e * g) * invDet, (b * g - a * h) * invDet, (a * e - b * d) * invDet]
    ];
  }

  function applyH(M, x, y) {
    const w = M[2][0] * x + M[2][1] * y + M[2][2];
    return {
      x: (M[0][0] * x + M[0][1] * y + M[0][2]) / w,
      y: (M[1][0] * x + M[1][1] * y + M[1][2]) / w
    };
  }

  // Convert normalized pitch coords (nx, ny) <-> Canvas screen coords (sx, sy)
  function pitchToScreen(nx, ny) {
    if (mode === "TV" && H_mat) {
      return applyH(H_mat, nx, ny);
    }
    return {
      x: PITCH_PAD + nx * PW,
      y: PITCH_PAD + ny * PH
    };
  }

  function screenToPitch(sx, sy) {
    if (mode === "TV" && H_inv) {
      return applyH(H_inv, sx, sy);
    }
    return {
      x: (sx - PITCH_PAD) / PW,
      y: (sy - PITCH_PAD) / PH
    };
  }

  // ==========================================
  // COMPUTATIONAL GEOMETRY: CONVEX HULL & VORONOI
  // ==========================================
  function computeConvexHull(points) {
    if (points.length < 3) return points;
    const pts = [...points].sort((a, b) => (a.x === b.x ? a.y - b.y : a.x - b.x));
    const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
    const lower = [];
    for (const p of pts) {
      while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
        lower.pop();
      }
      lower.push(p);
    }
    const upper = [];
    for (let i = pts.length - 1; i >= 0; i--) {
      const p = pts[i];
      while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
        upper.pop();
      }
      upper.push(p);
    }
    lower.pop();
    upper.pop();
    return lower.concat(upper);
  }

  function polygonAreaMeters(hullMeters) {
    if (hullMeters.length < 3) return 0;
    let area = 0;
    for (let i = 0; i < hullMeters.length; i++) {
      const j = (i + 1) % hullMeters.length;
      area += hullMeters[i].x * hullMeters[j].y;
      area -= hullMeters[j].x * hullMeters[i].y;
    }
    return Math.abs(area) / 2;
  }

  function updateTelemetry() {
    const calc = (team, active) => {
      if (!active) return { w: "--", d: "--", a: "--" };
      const outfield = team.players.filter(p => p.role !== "GK");
      const xs = outfield.map(p => p.nx * 105);
      const ys = outfield.map(p => p.ny * 68);
      const depth = (Math.max(...xs) - Math.min(...xs)).toFixed(1);
      const width = (Math.max(...ys) - Math.min(...ys)).toFixed(1);
      const hull = computeConvexHull(outfield.map(p => ({ x: p.nx * 105, y: p.ny * 68 })));
      const area = Math.round(polygonAreaMeters(hull));
      return { w: width, d: depth, a: area };
    };

    const hStats = calc(homeTeam, true);
    document.getElementById("homeLabel").textContent = homeTeam.name;
    document.querySelector(".home-dot").style.background = homeTeam.color;
    document.getElementById("homeWidth").textContent = hStats.w;
    document.getElementById("homeDepth").textContent = hStats.d;
    document.getElementById("homeArea").textContent = hStats.a;

    const aStats = calc(awayTeam, showAway);
    document.getElementById("awayLabel").textContent = awayTeam.name;
    document.querySelector(".away-dot").style.background = awayTeam.color;
    document.getElementById("awayWidth").textContent = aStats.w;
    document.getElementById("awayDepth").textContent = aStats.d;
    document.getElementById("awayArea").textContent = aStats.a;
  }

  // ==========================================
  // RENDER ENGINE
  // ==========================================
  function drawPitch2D() {
    const stripes = 14;
    const stripeW = PW / stripes;
    for (let i = 0; i < stripes; i++) {
      ctx.fillStyle = i % 2 === 0 ? "#123524" : "#153e2b";
      ctx.fillRect(PITCH_PAD + i * stripeW, PITCH_PAD, stripeW, PH);
    }

    ctx.strokeStyle = "rgba(255,255,255,0.68)";
    ctx.lineWidth = 2;
    ctx.strokeRect(PITCH_PAD, PITCH_PAD, PW, PH);

    const midX = PITCH_PAD + PW / 2;
    const midY = PITCH_PAD + PH / 2;
    ctx.beginPath();
    ctx.moveTo(midX, PITCH_PAD);
    ctx.lineTo(midX, PITCH_PAD + PH);
    ctx.stroke();

    const rCenter = (9.15 / 105) * PW;
    ctx.beginPath();
    ctx.arc(midX, midY, rCenter, 0, Math.PI * 2);
    ctx.stroke();

    const boxW = (16.5 / 105) * PW;
    const boxH = (40.32 / 68) * PH;
    const boxY = midY - boxH / 2;
    ctx.strokeRect(PITCH_PAD, boxY, boxW, boxH);
    ctx.strokeRect(PITCH_PAD + PW - boxW, boxY, boxW, boxH);

    const sixW = (5.5 / 105) * PW;
    const sixH = (18.32 / 68) * PH;
    const sixY = midY - sixH / 2;
    ctx.strokeRect(PITCH_PAD, sixY, sixW, sixH);
    ctx.strokeRect(PITCH_PAD + PW - sixW, sixY, sixW, sixH);
  }

  function drawVoronoiLayer() {
    if (!document.getElementById("chkVoronoi").checked || mode !== "2D") return;
    const allPlayers = [
      ...homeTeam.players.map(p => ({ ...p, color: homeTeam.color })),
      ...(showAway ? awayTeam.players.map(p => ({ ...p, color: awayTeam.color })) : [])
    ];
    const step = 10;
    for (let x = PITCH_PAD; x < PITCH_PAD + PW; x += step) {
      for (let y = PITCH_PAD; y < PITCH_PAD + PH; y += step) {
        let minDist = Infinity;
        let owner = null;
        for (const p of allPlayers) {
          const px = PITCH_PAD + p.nx * PW;
          const py = PITCH_PAD + p.ny * PH;
          const d = (x - px) * (x - px) + (y - py) * (y - py);
          if (d < minDist) {
            minDist = d;
            owner = p;
          }
        }
        if (owner) {
          ctx.fillStyle = hexToRgba(owner.color, 0.24);
          ctx.fillRect(x, y, step, step);
        }
      }
    }
  }

  function drawPitchOverlays() {
    if (mode !== "2D") return;
    const showLanes = document.getElementById("chkLanes").checked;
    const showHS = document.getElementById("chkHalfSpaces").checked;
    const showThirds = document.getElementById("chkThirds").checked;
    const showZones18 = document.getElementById("chkZones18").checked;

    const laneBounds = [0, 0.18, 0.37, 0.63, 0.82, 1.0];
    if (showLanes || showHS) {
      for (let i = 0; i < 5; i++) {
        const y1 = PITCH_PAD + laneBounds[i] * PH;
        const y2 = PITCH_PAD + laneBounds[i + 1] * PH;
        const isHalfSpace = i === 1 || i === 3;

        if (showHS && isHalfSpace) {
          ctx.fillStyle = "rgba(254, 228, 64, 0.13)";
          ctx.fillRect(PITCH_PAD, y1, PW, y2 - y1);
        }
        if (showLanes) {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
          ctx.setLineDash([6, 6]);
          ctx.beginPath();
          ctx.moveTo(PITCH_PAD, y1);
          ctx.lineTo(PITCH_PAD + PW, y1);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    }

    if (showHS) {
      for (let i = 0; i < 5; i++) {
        const count = homeTeam.players.filter(
          p => p.role !== "GK" && p.ny >= laneBounds[i] && p.ny < laneBounds[i + 1]
        ).length;
        if (count > 2) {
          const yMid = PITCH_PAD + ((laneBounds[i] + laneBounds[i + 1]) / 2) * PH;
          ctx.fillStyle = "rgba(255, 42, 109, 0.88)";
          ctx.fillRect(PITCH_PAD + 10, yMid - 11, 165, 22);
          ctx.fillStyle = "#fff";
          ctx.font = "bold 11px sans-serif";
          ctx.fillText(`CROWD ALERT: ${count} IN LANE`, PITCH_PAD + 18, yMid + 4);
        }
      }
    }

    if (showThirds) {
      ctx.strokeStyle = "rgba(0, 245, 212, 0.4)";
      ctx.lineWidth = 1.5;
      [1 / 3, 2 / 3].forEach(t => {
        const x = PITCH_PAD + t * PW;
        ctx.beginPath();
        ctx.moveTo(x, PITCH_PAD);
        ctx.lineTo(x, PITCH_PAD + PH);
        ctx.stroke();
      });
    }

    if (showZones18) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
      ctx.lineWidth = 1;
      for (let c = 1; c < 6; c++) {
        const x = PITCH_PAD + (c / 6) * PW;
        ctx.beginPath();
        ctx.moveTo(x, PITCH_PAD);
        ctx.lineTo(x, PITCH_PAD + PH);
        ctx.stroke();
      }
      for (let r = 1; r < 3; r++) {
        const y = PITCH_PAD + (r / 3) * PH;
        ctx.beginPath();
        ctx.moveTo(PITCH_PAD, y);
        ctx.lineTo(PITCH_PAD + PW, y);
        ctx.stroke();
      }
    }
  }

  function drawConvexHulls() {
    if (!document.getElementById("chkHull").checked || mode !== "2D") return;
    const renderHull = (team) => {
      const outfield = team.players.filter(p => p.role !== "GK");
      const screenPts = outfield.map(p => pitchToScreen(p.nx, p.ny));
      const hull = computeConvexHull(screenPts);
      if (hull.length < 3) return;
      ctx.beginPath();
      ctx.moveTo(hull[0].x, hull[0].y);
      for (let i = 1; i < hull.length; i++) ctx.lineTo(hull[i].x, hull[i].y);
      ctx.closePath();
      ctx.fillStyle = hexToRgba(team.color, 0.16);
      ctx.fill();
      ctx.strokeStyle = hexToRgba(team.color, 0.85);
      ctx.lineWidth = 2;
      ctx.stroke();
    };
    renderHull(homeTeam);
    if (showAway) renderHull(awayTeam);
  }

  function renderGraphic(g) {
    ctx.save();
    ctx.strokeStyle = g.color;
    ctx.fillStyle = g.color;
    ctx.shadowColor = g.color;
    ctx.shadowBlur = 10;

    if (g.type === "spotlight") {
      const steps = 36;
      const rx = 0.026;
      const ry = 0.04;
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const a = (i / steps) * Math.PI * 2;
        const pt = pitchToScreen(g.x1 + Math.cos(a) * rx, g.y1 + Math.sin(a) * ry);
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
      ctx.fillStyle = hexToRgba(g.color, 0.22);
      ctx.fill();
    } else if (g.type === "cone") {
      const p1 = pitchToScreen(g.x1, g.y1);
      const angle = Math.atan2(g.y2 - g.y1, g.x2 - g.x1);
      const dist = Math.hypot(g.x2 - g.x1, g.y2 - g.y1) || 0.12;
      const spread = 0.38;
      const left = pitchToScreen(
        g.x1 + Math.cos(angle - spread) * dist,
        g.y1 + Math.sin(angle - spread) * dist
      );
      const right = pitchToScreen(
        g.x1 + Math.cos(angle + spread) * dist,
        g.y1 + Math.sin(angle + spread) * dist
      );
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(left.x, left.y);
      ctx.lineTo(right.x, right.y);
      ctx.closePath();
      ctx.fillStyle = hexToRgba(g.color, 0.28);
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.stroke();
    } else if (g.type === "offside") {
      const dx = g.x2 - g.x1;
      const dy = g.y2 - g.y1;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len;
      const uy = dy / len;
      const start = pitchToScreen(g.x1 - ux * 1.5, g.y1 - uy * 1.5);
      const end = pitchToScreen(g.x1 + ux * 1.5, g.y1 + uy * 1.5);
      ctx.setLineDash([8, 6]);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (g.type === "arrow") {
      const p1 = pitchToScreen(g.x1, g.y1);
      const p2 = pitchToScreen(g.x2, g.y2);
      drawArrowHeadLine(p1.x, p1.y, p2.x, p2.y, false);
    } else if (g.type === "lofted") {
      const p1 = pitchToScreen(g.x1, g.y1);
      const p2 = pitchToScreen(g.x2, g.y2);
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2 - Math.hypot(p2.x - p1.x, p2.y - p1.y) * 0.25;
      ctx.setLineDash([6, 5]);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.quadraticCurveTo(midX, midY, p2.x, p2.y);
      ctx.stroke();
      ctx.setLineDash([]);
      drawArrowTip(midX, midY, p2.x, p2.y);
    } else if (g.type === "carry") {
      const p1 = pitchToScreen(g.x1, g.y1);
      const p2 = pitchToScreen(g.x2, g.y2);
      drawWavyArrow(p1.x, p1.y, p2.x, p2.y);
    } else if (g.type === "chain" && g.points && g.points.length > 1) {
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      g.points.forEach((pt, idx) => {
        const sp = pitchToScreen(pt.x, pt.y);
        if (idx === 0) ctx.moveTo(sp.x, sp.y);
        else ctx.lineTo(sp.x, sp.y);
      });
      ctx.stroke();
      g.points.forEach(pt => {
        const sp = pitchToScreen(pt.x, pt.y);
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 6, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (g.type === "zone") {
      const c1 = pitchToScreen(g.x1, g.y1);
      const c2 = pitchToScreen(g.x2, g.y1);
      const c3 = pitchToScreen(g.x2, g.y2);
      const c4 = pitchToScreen(g.x1, g.y2);
      ctx.beginPath();
      ctx.moveTo(c1.x, c1.y);
      ctx.lineTo(c2.x, c2.y);
      ctx.lineTo(c3.x, c3.y);
      ctx.lineTo(c4.x, c4.y);
      ctx.closePath();
      ctx.fillStyle = hexToRgba(g.color, 0.22);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawArrowHeadLine(x1, y1, x2, y2, dashed) {
    ctx.lineWidth = 3;
    if (dashed) ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.setLineDash([]);
    drawArrowTip(x1, y1, x2, y2);
  }

  function drawArrowTip(fromX, fromY, toX, toY) {
    const angle = Math.atan2(toY - fromY, toX - fromX);
    const head = 13;
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - head * Math.cos(angle - Math.PI / 6), toY - head * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - head * Math.cos(angle + Math.PI / 6), toY - head * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
  }

  function drawWavyArrow(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.hypot(dx, dy);
    if (dist < 5) return;
    const angle = Math.atan2(dy, dx);
    const steps = Math.floor(dist / 6);
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const baseX = x1 + dx * t;
      const baseY = y1 + dy * t;
      const wave = Math.sin(t * dist * 0.22) * 4 * (1 - Math.pow(t, 4));
      const px = baseX - Math.sin(angle) * wave;
      const py = baseY + Math.cos(angle) * wave;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    drawArrowTip(x1, y1, x2, y2);
  }

  function drawPlayersAndBall() {
    if (mode !== "2D") return;

    const renderSquad = (team) => {
      team.players.forEach(p => {
        const pos = pitchToScreen(p.nx, p.ny);
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.65)";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 16, 0, Math.PI * 2);
        ctx.fillStyle = team.color;
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(displayMode === "number" ? p.num : p.role, pos.x, pos.y);
      });
    };

    renderSquad(homeTeam);
    if (showAway) renderSquad(awayTeam);

    const bPos = pitchToScreen(ball.nx, ball.ny);
    ctx.beginPath();
    ctx.arc(bPos.x, bPos.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = "#fee440";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#090d16";
    ctx.stroke();
  }

  function drawCalibrationPoints() {
    if (calibPoints.length === 0 || mode !== "TV") return;
    ctx.save();
    ctx.strokeStyle = "#00f5d4";
    ctx.fillStyle = "#00f5d4";
    ctx.lineWidth = 2;
    ctx.beginPath();
    calibPoints.forEach((pt, idx) => {
      if (idx === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    if (calibPoints.length === 4) ctx.closePath();
    ctx.stroke();

    calibPoints.forEach((pt, idx) => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText(`P${idx + 1}`, pt.x + 9, pt.y - 6);
    });
    ctx.restore();
  }

  function render() {
    ctx.clearRect(0, 0, W, H);

    if (mode === "2D") {
      drawPitch2D();
      drawVoronoiLayer();
      drawPitchOverlays();
      drawConvexHulls();
    } else {
      ctx.fillStyle = "#080b12";
      ctx.fillRect(0, 0, W, H);
      if (bgImage) {
        const scale = Math.min(W / bgImage.width, H / bgImage.height);
        const iw = bgImage.width * scale;
        const ih = bgImage.height * scale;
        ctx.drawImage(bgImage, (W - iw) / 2, (H - ih) / 2, iw, ih);
      } else {
        ctx.fillStyle = "#9ca3af";
        ctx.font = "600 16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Click '+ Load Match Frame' in the top right to drop a match screenshot", W / 2, H / 2);
      }
      drawCalibrationPoints();
    }

    graphics.forEach(renderGraphic);
    if (draftGraphic) renderGraphic(draftGraphic);
    if (chainPoints.length > 0) {
      renderGraphic({ type: "chain", color: activeColor, points: chainPoints });
    }

    drawPlayersAndBall();
    updateTelemetry();
  }

  // ==========================================
  // INTERACTION HANDLERS (MOUSE & TOUCH)
  // ==========================================
  function getCanvasCoords(evt) {
    const rect = canvas.getBoundingClientRect();
    const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
    const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * W,
      y: ((clientY - rect.top) / rect.height) * H
    };
  }

  function setBanner(msg) {
    const el = document.getElementById("bannerPrompt");
    if (!msg) {
      el.classList.add("hidden");
      return;
    }
    el.textContent = msg;
    el.classList.remove("hidden");
  }

  canvas.addEventListener("pointerdown", (e) => {
    const sc = getCanvasCoords(e);

    if (isCalibrating && mode === "TV") {
      calibPoints.push(sc);
      if (calibPoints.length < 4) {
        setBanner(`Click corner ${calibPoints.length + 1} of 4 (Order: Top-Left -> Top-Right -> Bottom-Right -> Bottom-Left)`);
      } else {
        const src = [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1]
        ];
        const dst = calibPoints.map(p => [p.x, p.y]);
        H_mat = solveHomography(src, dst);
        H_inv = H_mat ? invert3x3(H_mat) : null;
        isCalibrating = false;
        setBanner(null);
        const pill = document.getElementById("calibStatus");
        pill.textContent = H_mat ? "Status: 3D Perspective Locked" : "Status: Calibration Error";
        pill.classList.toggle("calibrated", !!H_mat);
      }
      render();
      return;
    }

    const pt = screenToPitch(sc.x, sc.y);

    if (activeTool === "select") {
      if (mode === "2D") {
        const bSc = pitchToScreen(ball.nx, ball.ny);
        if (Math.hypot(sc.x - bSc.x, sc.y - bSc.y) < 16) {
          draggingTarget = { type: "ball", obj: ball };
          return;
        }
        const squads = showAway ? [homeTeam.players, awayTeam.players] : [homeTeam.players];
        for (const list of squads) {
          for (const p of list) {
            const pSc = pitchToScreen(p.nx, p.ny);
            if (Math.hypot(sc.x - pSc.x, sc.y - pSc.y) < 20) {
              draggingTarget = { type: "player", obj: p };
              return;
            }
          }
        }
      }
      return;
    }

    if (activeTool === "chain") {
      chainPoints.push(pt);
      setBanner("Click next player/point to extend chain - Double-click or switch tool to finish");
      render();
      return;
    }

    if (activeTool === "spotlight") {
      graphics.push({ type: "spotlight", color: activeColor, x1: pt.x, y1: pt.y });
      render();
      return;
    }

    draftGraphic = {
      type: activeTool,
      color: activeColor,
      x1: pt.x,
      y1: pt.y,
      x2: pt.x,
      y2: pt.y
    };
  });

  canvas.addEventListener("pointermove", (e) => {
    const sc = getCanvasCoords(e);
    if (draggingTarget) {
      const pt = screenToPitch(sc.x, sc.y);
      draggingTarget.obj.nx = Math.max(0, Math.min(1, pt.x));
      draggingTarget.obj.ny = Math.max(0, Math.min(1, pt.y));
      render();
      return;
    }
    if (draftGraphic) {
      const pt = screenToPitch(sc.x, sc.y);
      draftGraphic.x2 = pt.x;
      draftGraphic.y2 = pt.y;
      render();
    }
  });

  canvas.addEventListener("pointerup", () => {
    if (draggingTarget) {
      draggingTarget = null;
      render();
      return;
    }
    if (draftGraphic) {
      if (Math.hypot(draftGraphic.x2 - draftGraphic.x1, draftGraphic.y2 - draftGraphic.y1) > 0.008) {
        graphics.push(draftGraphic);
      }
      draftGraphic = null;
      render();
    }
  });

  canvas.addEventListener("dblclick", () => {
    if (activeTool === "chain" && chainPoints.length > 1) {
      graphics.push({ type: "chain", color: activeColor, points: [...chainPoints] });
      chainPoints = [];
      setBanner(null);
      render();
    }
  });

  // ==========================================
  // UI WIRING
  // ==========================================
  document.querySelectorAll(".tool-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (chainPoints.length > 1) {
        graphics.push({ type: "chain", color: activeColor, points: [...chainPoints] });
      }
      chainPoints = [];
      setBanner(null);
      document.querySelectorAll(".tool-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeTool = btn.dataset.tool;
      render();
    });
  });

  document.querySelectorAll(".swatch").forEach(sw => {
    sw.addEventListener("click", () => {
      document.querySelectorAll(".swatch").forEach(s => s.classList.remove("active"));
      sw.classList.add("active");
      activeColor = sw.dataset.color;
    });
  });

  document.getElementById("btnMode2D").addEventListener("click", () => {
    mode = "2D";
    isCalibrating = false;
    setBanner(null);
    document.getElementById("btnMode2D").classList.add("active");
    document.getElementById("btnModeTV").classList.remove("active");
    render();
  });

  document.getElementById("btnModeTV").addEventListener("click", () => {
    mode = "TV";
    document.getElementById("btnModeTV").classList.add("active");
    document.getElementById("btnMode2D").classList.remove("active");
    render();
  });

  document.getElementById("bgUpload").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        bgImage = img;
        mode = "TV";
        document.getElementById("btnModeTV").classList.add("active");
        document.getElementById("btnMode2D").classList.remove("active");
        render();
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });

  document.getElementById("btnCalibrate").addEventListener("click", () => {
    if (mode !== "TV") {
      mode = "TV";
      document.getElementById("btnModeTV").classList.add("active");
      document.getElementById("btnMode2D").classList.remove("active");
    }
    calibPoints = [];
    isCalibrating = true;
    setBanner("Click corner 1 of 4 on the grass (Top-Left -> Top-Right -> Bottom-Right -> Bottom-Left)");
    render();
  });

  document.getElementById("btnResetCalib").addEventListener("click", () => {
    calibPoints = [];
    H_mat = null;
    H_inv = null;
    isCalibrating = false;
    setBanner(null);
    const pill = document.getElementById("calibStatus");
    pill.textContent = "Status: Flat / Uncalibrated";
    pill.classList.remove("calibrated");
    render();
  });

  document.getElementById("btnUndo").addEventListener("click", () => {
    graphics.pop();
    render();
  });

  document.getElementById("btnClearDrawings").addEventListener("click", () => {
    graphics = [];
    chainPoints = [];
    render();
  });

  document.getElementById("btnExportPNG").addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `APEX_Tactical_${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  });

  ["chkVoronoi", "chkHull", "chkLanes", "chkHalfSpaces", "chkThirds", "chkZones18"].forEach(id => {
    document.getElementById(id).addEventListener("change", render);
  });

  document.getElementById("chkShowAway").addEventListener("change", (e) => {
    showAway = e.target.checked;
    render();
  });

  document.querySelectorAll(".seg-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".seg-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      displayMode = btn.dataset.display;
      render();
    });
  });

  document.getElementById("homeNameInput").addEventListener("input", (e) => {
    homeTeam.name = e.target.value || "HOME";
    render();
  });
  document.getElementById("homeColorInput").addEventListener("input", (e) => {
    homeTeam.color = e.target.value;
    render();
  });
  document.getElementById("homeFormation").addEventListener("change", (e) => {
    applyFormation(homeTeam, e.target.value, false);
    render();
  });

  document.getElementById("awayNameInput").addEventListener("input", (e) => {
    awayTeam.name = e.target.value || "AWAY";
    render();
  });
  document.getElementById("awayColorInput").addEventListener("input", (e) => {
    awayTeam.color = e.target.value;
    render();
  });
  document.getElementById("awayFormation").addEventListener("change", (e) => {
    applyFormation(awayTeam, e.target.value, true);
    render();
  });

  function hexToRgba(hex, alpha) {
    const clean = hex.replace("#", "");
    const num = parseInt(clean, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // Initial draw
  render();
})();
