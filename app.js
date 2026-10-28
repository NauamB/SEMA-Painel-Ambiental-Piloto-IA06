
(() => {
  const records = [
    {id:101,name:"Análise de processo demonstrativo",code:"PROC-DEMO-001",theme:"Licenciamento",owner:"Equipe Fictícia A",status:"Em análise",symbol:"⌕"},
    {id:102,name:"Acompanhamento de qualidade da água",code:"PROC-DEMO-002",theme:"Recursos hídricos",owner:"Equipe Fictícia B",status:"Em andamento",symbol:"≈"},
    {id:103,name:"Registro de ação de educação ambiental",code:"PROC-DEMO-003",theme:"Educação ambiental",owner:"Equipe Fictícia C",status:"Concluído",symbol:"♧"},
    {id:104,name:"Verificação de relatório de monitoramento",code:"PROC-DEMO-004",theme:"Monitoramento",owner:"Equipe Fictícia A",status:"Pendente",symbol:"◎"}
  ];

  let nextId = 105;

  const $ = id => document.getElementById(id);
  const tbody = $("process-table-body");
  const search = $("search-input");
  const filter = $("status-filter");
  const dialog = $("process-dialog");
  const form = $("process-form");

  const statuses = [
    {name:"Em análise", className:"chart-bar-analysis"},
    {name:"Em andamento", className:"chart-bar-progress"},
    {name:"Concluído", className:"chart-bar-done"},
    {name:"Pendente", className:"chart-bar-pending"}
  ];

  const escapeHtml = value =>
    String(value).replace(/[&<>"']/g, c => ({
      "&":"&amp;",
      "<":"&lt;",
      ">":"&gt;",
      '"':"&quot;",
      "'":"&#39;"
    }[c]));

  const statusClass = status => ({
    "Em análise":"status-analysis",
    "Em andamento":"status-progress",
    "Concluído":"status-done",
    "Pendente":"status-pending"
  }[status] || "status-analysis");

  const initials = name =>
    name.replace("Equipe Fictícia ","").slice(0,2).toUpperCase();

  function updateMetrics() {
    const total = records.length;
    const analysis = records.filter(r =>
      r.status === "Em análise" || r.status === "Em andamento"
    ).length;
    const done = records.filter(r => r.status === "Concluído").length;
    const pending = records.filter(r => r.status === "Pendente").length;

    $("metric-total").textContent = total;
    $("metric-analysis").textContent = analysis;
    $("metric-done").textContent = done;
    $("metric-pending").textContent = pending;

    const metricCards = document.querySelectorAll(".metric-card");

    const values = [total, analysis, done, pending];

    metricCards.forEach((card, index) => {
      const bar = card.querySelector(".metric-track span");
      if (!bar) return;

      const percentage = total
        ? Math.round((values[index] / total) * 100)
        : 0;

      bar.style.width = `${percentage}%`;
      bar.parentElement.setAttribute("role", "progressbar");
      bar.parentElement.setAttribute("aria-valuemin", "0");
      bar.parentElement.setAttribute("aria-valuemax", "100");
      bar.parentElement.setAttribute("aria-valuenow", String(percentage));
      bar.parentElement.setAttribute(
        "aria-label",
        `${card.querySelector(".metric-top").innerText.trim()}: ${percentage}% dos registros`
      );
    });
  }

  function renderStatusChart() {
    const container = $("status-chart");
    if (!container) return;

    const total = records.length;

    container.innerHTML = statuses.map(status => {
      const count = records.filter(
        record => record.status === status.name
      ).length;

      const percentage = total
        ? Math.round((count / total) * 100)
        : 0;

      return `
        <div class="chart-row">
          <div class="chart-row-top">
            <span class="chart-label">${escapeHtml(status.name)}</span>
            <span class="chart-value">${count} (${percentage}%)</span>
          </div>
          <div
            class="chart-bar-track"
            role="progressbar"
            aria-label="${escapeHtml(status.name)}"
            aria-valuemin="0"
            aria-valuemax="${total}"
            aria-valuenow="${count}"
          >
            <span
              class="chart-bar ${status.className}"
              style="width:${percentage}%"
            ></span>
          </div>
        </div>
      `;
    }).join("") + `
      <p class="chart-footnote">
        ${total} registro(s) fictício(s) no total. Os percentuais são calculados
        com base nos registros cadastrados neste protótipo.
      </p>
    `;
  }

  function renderThemeChart() {
    const container = $("theme-chart");
    if (!container) return;

    const totals = records.reduce((result, record) => {
      result[record.theme] = (result[record.theme] || 0) + 1;
      return result;
    }, {});

    const themes = Object.entries(totals)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "pt-BR"));

    const maxCount = Math.max(1, ...themes.map(item => item[1]));

    if (!themes.length) {
      container.innerHTML = `
        <p class="chart-empty">Nenhum registro disponível.</p>
      `;
      return;
    }

    container.innerHTML = themes.map(([theme, count]) => {
      const percentage = Math.round((count / maxCount) * 100);

      return `
        <div class="chart-row">
          <div class="chart-row-top">
            <span class="chart-label">${escapeHtml(theme)}</span>
            <span class="chart-value">${count} registro(s)</span>
          </div>
          <div
            class="chart-bar-track"
            role="progressbar"
            aria-label="${escapeHtml(theme)}"
            aria-valuemin="0"
            aria-valuemax="${maxCount}"
            aria-valuenow="${count}"
          >
            <span
              class="chart-bar chart-bar-theme"
              style="width:${percentage}%"
            ></span>
          </div>
        </div>
      `;
    }).join("") + `
      <p class="chart-footnote">
        Barras proporcionais à quantidade de registros de cada tema.
        Os temas são identificados pelos registros cadastrados.
      </p>
    `;
  }

  function renderCharts() {
    renderStatusChart();
    renderThemeChart();
  }

  function render() {
    const term = search.value.trim().toLocaleLowerCase("pt-BR");

    const visible = records.filter(record => {
      const matchesStatus =
        filter.value === "Todos" || record.status === filter.value;

      const haystack =
        `${record.name} ${record.code} ${record.theme} ${record.owner} ${record.status}`
          .toLocaleLowerCase("pt-BR");

      return matchesStatus && haystack.includes(term);
    });

    tbody.innerHTML = visible.map(record => `
      <tr data-record-id="${record.id}">
        <td>
          <div class="process-name">
            <span class="process-symbol" aria-hidden="true">${escapeHtml(record.symbol)}</span>
            <span>
              <strong>${escapeHtml(record.name)}</strong>
              <small>${escapeHtml(record.code)}</small>
            </span>
          </div>
        </td>
        <td><span class="theme-label">${escapeHtml(record.theme)}</span></td>
        <td>
          <span class="owner-label">
            <span class="avatar">${escapeHtml(initials(record.owner))}</span>
            ${escapeHtml(record.owner)}
          </span>
        </td>
        <td><span class="status-pill ${statusClass(record.status)}">${escapeHtml(record.status)}</span></td>
        <td>
          <button
            type="button"
            class="row-action"
            data-action="advance"
            data-id="${record.id}"
          >${record.status === "Concluído" ? "Reabrir" : "Atualizar status"}</button>
        </td>
      </tr>
    `).join("");

    $("no-results").hidden = visible.length > 0;
    $("result-count").textContent =
      `Exibindo ${visible.length} de ${records.length} registros fictícios`;

    updateMetrics();
    renderCharts();
  }

  function closeDialog() {
    dialog.close();
    form.reset();
    $("dialog-error").hidden = true;
  }

  $("add-process").addEventListener("click", () => dialog.showModal());
  $("close-dialog").addEventListener("click", closeDialog);
  $("cancel-dialog").addEventListener("click", closeDialog);

  search.addEventListener("input", render);
  filter.addEventListener("change", render);

  form.addEventListener("submit", event => {
    event.preventDefault();

    const name = $("process-name").value.trim();
    const theme = $("process-theme").value;
    const owner = $("process-owner").value.trim();
    const status = $("process-status").value;

    if (!name || !theme || !owner) {
      $("dialog-error").textContent =
        "Preencha os campos obrigatórios.";
      $("dialog-error").hidden = false;
      return;
    }

    records.unshift({
      id: nextId,
      name,
      code: `PROC-DEMO-${String(nextId - 100).padStart(3, "0")}`,
      theme,
      owner,
      status,
      symbol: "＋"
    });

    nextId++;
    search.value = "";
    filter.value = "Todos";

    closeDialog();
    render();
  });

  tbody.addEventListener("click", event => {
    const button = event.target.closest("button[data-action='advance']");
    if (!button) return;

    const record = records.find(
      item => item.id === Number(button.dataset.id)
    );

    if (!record) return;

    const flow = ["Em análise", "Em andamento", "Concluído"];

    if (record.status === "Pendente") {
      record.status = "Em análise";
    } else if (record.status === "Concluído") {
      record.status = "Em análise";
    } else {
      record.status = flow[
        (flow.indexOf(record.status) + 1) % flow.length
      ];
    }

    render();
  });

  const menuToggle = $("menu-toggle");
  const nav = $("main-nav");

  menuToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  nav.addEventListener("click", event => {
    if (event.target.closest("a")) {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  render();
})();
