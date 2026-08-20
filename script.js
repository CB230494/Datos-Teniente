const risks = [
  { id: "DPPP-001-2026", value: 75 },
  { id: "DPPP-002-2026", value: 50 },
  { id: "DPPP-003-2026", value: 67 },
  { id: "DPPP-004-2026", value: 67 },
  { id: "DPPP-005-2026", value: 67 }
];

const exactAverage = risks.reduce((sum, r) => sum + r.value, 0) / risks.length;
const globalAverage = Math.round(exactAverage);

const riskGrid = document.getElementById("riskGrid");
const barChart = document.getElementById("barChart");

function renderRiskCards() {
  riskGrid.innerHTML = "";

  risks.forEach((risk, index) => {
    const card = document.createElement("article");
    card.className = "risk-card";
    card.dataset.id = risk.id;
    card.innerHTML = `
      <span class="risk-number">RIESGO ${String(index + 1).padStart(2, "0")}</span>
      <h3>${risk.id}</h3>
      <div class="risk-value"><strong>${risk.value}%</strong><small>avance</small></div>
      <div class="progress"><span data-width="${risk.value}%"></span></div>
    `;
    riskGrid.appendChild(card);
  });

  requestAnimationFrame(() => {
    document.querySelectorAll(".progress span").forEach(el => {
      el.style.width = el.dataset.width;
    });
  });
}

function renderBars() {
  barChart.innerHTML = "";
  risks.forEach(risk => {
    const row = document.createElement("div");
    row.className = "bar-row";
    row.innerHTML = `
      <div class="bar-label">${risk.id}</div>
      <div class="bar-track"><div class="bar-fill" data-width="${risk.value}%"></div></div>
      <div class="bar-value">${risk.value}%</div>
    `;
    barChart.appendChild(row);
  });

  requestAnimationFrame(() => {
    document.querySelectorAll(".bar-fill").forEach(el => {
      el.style.width = el.dataset.width;
    });
  });
}


function initGlobal() {
  document.getElementById("globalValue").textContent = `${globalAverage}%`;

  const progress = document.getElementById("gaugeProgress");
  const totalLength = 251.2;
  progress.style.strokeDashoffset = totalLength - (totalLength * globalAverage / 100);
}

initGlobal();
renderRiskCards();
renderBars();

