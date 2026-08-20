const risks = [
  { id: "DPPP-001-2026", value: 75 },
  { id: "DPPP-002-2026", value: 50 },
  { id: "DPPP-003-2026", value: 67 },
  { id: "DPPP-004-2026", value: 67 },
  { id: "DPPP-005-2026", value: 67 }
];

const exactAverage = risks.reduce((sum, r) => sum + r.value, 0) / risks.length;
const globalAverage = Math.round(exactAverage);

const classify = (value) => {
  if (value >= 80) return { key: "high", label: "Avance alto" };
  if (value >= 60) return { key: "medium", label: "En gestión" };
  return { key: "low", label: "Requiere atención" };
};

const riskGrid = document.getElementById("riskGrid");
const barChart = document.getElementById("barChart");

function renderRiskCards(filter = "all") {
  riskGrid.innerHTML = "";

  risks
    .filter(r => filter === "all" || classify(r.value).key === filter)
    .forEach((risk, index) => {
      const state = classify(risk.value);
      const card = document.createElement("article");
      card.className = `risk-card ${state.key}`;
      card.dataset.id = risk.id;
      card.innerHTML = `
        <span class="risk-number">RIESGO ${String(index + 1).padStart(2, "0")}</span>
        <h3>${risk.id}</h3>
        <div class="risk-value"><strong>${risk.value}%</strong><small>avance</small></div>
        <div class="progress"><span data-width="${risk.value}%"></span></div>
        <div class="risk-state">${state.label}</div>
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

  const diff = risk.value - globalAverage;
  const relation = diff === 0
    ? "se encuentra exactamente en el promedio consolidado"
    : diff > 0
      ? `se encuentra ${diff} puntos porcentuales por encima del promedio consolidado`
      : `se encuentra ${Math.abs(diff)} puntos porcentuales por debajo del promedio consolidado`;

  document.getElementById("detailIcon").textContent = risk.id.split("-")[1];
  document.getElementById("detailTitle").textContent = risk.id;
  document.getElementById("detailValue").textContent = `${risk.value}%`;
  document.getElementById("detailDescription").textContent =
    `${risk.id} presenta un avance de ${risk.value}% y ${relation}.`;
}

document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderRiskCards(btn.dataset.filter);
  });
});

function initGlobal() {
  document.getElementById("globalValue").textContent = `${globalAverage}%`;
  document.getElementById("aboveAvg").textContent = risks.filter(r => r.value >= globalAverage).length;
  document.getElementById("belowAvg").textContent = risks.filter(r => r.value < globalAverage).length;

  const progress = document.getElementById("gaugeProgress");
  const totalLength = 251.2;
  progress.style.strokeDashoffset = totalLength - (totalLength * globalAverage / 100);

  const status = classify(globalAverage);
  document.getElementById("globalStatus").textContent = status.label;

  document.getElementById("executiveText").textContent =
    `El avance consolidado es ${globalAverage}% (${exactAverage.toFixed(1)}% sin redondear). ` +
    `${risks.filter(r => r.value >= globalAverage).length} riesgos están en el promedio o por encima y ` +
    `${risks.filter(r => r.value < globalAverage).length} requiere atención prioritaria.`;
}

initGlobal();
renderRiskCards();
renderBars();

setTimeout(() => {
  const first = document.querySelector(".risk-card");
  if (first) first.click();
}, 350);
