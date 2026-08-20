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
    card.addEventListener("click", () => selectRisk(risk, card));
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

function selectRisk(risk, card) {
  document.querySelectorAll(".risk-card").forEach(c => c.classList.remove("selected"));
  card.classList.add("selected");

  const diff = risk.value - exactAverage;
  let relation = "coincide con el promedio consolidado";

  if (Math.abs(diff) >= 0.05) {
    relation = diff > 0
      ? `está ${Math.abs(diff).toFixed(1)} puntos porcentuales por encima del promedio consolidado`
      : `está ${Math.abs(diff).toFixed(1)} puntos porcentuales por debajo del promedio consolidado`;
  }

  document.getElementById("detailIcon").textContent = risk.id.split("-")[1];
  document.getElementById("detailTitle").textContent = risk.id;
  document.getElementById("detailValue").textContent = `${risk.value}%`;
  document.getElementById("detailDescription").textContent =
    `${risk.id} registra un avance de ${risk.value}% y ${relation}.`;
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

setTimeout(() => {
  const first = document.querySelector(".risk-card");
  if (first) first.click();
}, 350);
