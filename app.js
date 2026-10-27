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
  const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const statusClass = status => ({
    "Em análise":"status-analysis","Em andamento":"status-progress","Concluído":"status-done","Pendente":"status-pending"
  }[status] || "status-analysis");
  const initials = name => name.replace("Equipe Fictícia ","").slice(0,2).toUpperCase();

  function updateMetrics() {
    $("metric-total").textContent = records.length;
    $("metric-analysis").textContent = records.filter(r => r.status === "Em análise" || r.status === "Em andamento").length;
    $("metric-done").textContent = records.filter(r => r.status === "Concluído").length;
    $("metric-pending").textContent = records.filter(r => r.status === "Pendente").length;
  }
  function render() {
    const term = search.value.trim().toLocaleLowerCase("pt-BR");
    const visible = records.filter(r => {
      const matchesStatus = filter.value === "Todos" || r.status === filter.value;
      const haystack = `${r.name} ${r.code} ${r.theme} ${r.owner} ${r.status}`.toLocaleLowerCase("pt-BR");
      return matchesStatus && haystack.includes(term);
    });
    tbody.innerHTML = visible.map(r => `
      <tr data-record-id="${r.id}">
        <td><div class="process-name"><span class="process-symbol" aria-hidden="true">${escapeHtml(r.symbol)}</span><span><strong>${escapeHtml(r.name)}</strong><small>${escapeHtml(r.code)}</small></span></div></td>
        <td><span class="theme-label">${escapeHtml(r.theme)}</span></td>
        <td><span class="owner-label"><span class="avatar">${escapeHtml(initials(r.owner))}</span>${escapeHtml(r.owner)}</span></td>
        <td><span class="status-pill ${statusClass(r.status)}">${escapeHtml(r.status)}</span></td>
        <td><button type="button" class="row-action" data-action="advance" data-id="${r.id}">${r.status === "Concluído" ? "Reabrir" : "Atualizar status"}</button></td>
      </tr>`).join("");
    $("no-results").hidden = visible.length > 0;
    $("result-count").textContent = `Exibindo ${visible.length} de ${records.length} registros fictícios`;
    updateMetrics();
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
    if (!name || !theme || !owner) {
      $("dialog-error").textContent = "Preencha os campos obrigatórios.";
      $("dialog-error").hidden = false;
      return;
    }
    records.unshift({
      id: nextId++, name, code:`PROC-DEMO-${String(nextId - 101).padStart(3,"0")}`,
      theme, owner, status:$("process-status").value, symbol:"＋"
    });
    search.value = "";
    filter.value = "Todos";
    closeDialog();
    render();
  });
  tbody.addEventListener("click", event => {
    const button = event.target.closest("button[data-action='advance']");
    if (!button) return;
    const record = records.find(r => r.id === Number(button.dataset.id));
    if (!record) return;
    const flow = ["Em análise","Em andamento","Concluído"];
    if (record.status === "Pendente") record.status = "Em análise";
    else if (record.status === "Concluído") record.status = "Em análise";
    else record.status = flow[(flow.indexOf(record.status) + 1) % flow.length];
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
