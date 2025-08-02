<script>
document.addEventListener("DOMContentLoaded", function () {
  const tipoInput = document.getElementById("tipo");
  const btusDiv = document.getElementById("btusDiv");
  const manutencaoDiv = document.getElementById("manutencaoDiv");
  const valorEl = document.getElementById("valor");
  const btusInput = document.getElementById("btus");
  const descricaoInput = document.getElementById("descricao");
  const nomeInput = document.getElementById("nome");
  const telefoneInput = document.getElementById("telefone");
  const agendarBtn = document.getElementById("agendarBtn");
  const resumoEl = document.getElementById("orcamentoResumo");

  tipoInput.addEventListener("change", function () {
    const tipo = tipoInput.value;
    btusDiv.classList.add("hidden");
    manutencaoDiv.classList.add("hidden");
    valorEl.textContent = "";
    resumoEl.classList.add("hidden");
    agendarBtn.classList.add("hidden");

    if (tipo === "instalacao" || tipo === "limpeza") {
      btusDiv.classList.remove("hidden");
    } else if (tipo === "manutencao") {
      manutencaoDiv.classList.remove("hidden");
    }
  });

  const calcularValor = () => {
    const tipo = tipoInput.value;
    const btus = parseInt(btusInput.value);
    const nome = nomeInput.value.trim();
    const telefone = telefoneInput.value.trim();
    const descricao = descricaoInput.value.trim();

    if (!nome || !telefone || !tipo) {
      return;
    }

    let valor = 0;
    let descricaoServico = "";

    if (tipo === "instalacao" || tipo === "limpeza") {
      if (!btus) return;
      valor = btus >= 24000 ? 300 : 200;
      if (tipo === "limpeza") valor += 50;
      descricaoServico = `${tipo} de ar-condicionado ${btus} BTUs`;
    } else if (tipo === "manutencao") {
      if (!descricao) return;
      valor = 150;
      descricaoServico = `Manutenção: ${descricao}`;
    }

    valorEl.textContent = `Valor estimado: R$ ${valor},00`;

    resumoEl.innerHTML = `
      <h3>Resumo do Orçamento</h3>
      <p><strong>Cliente:</strong> ${nome}</p>
      <p><strong>WhatsApp:</strong> ${telefone}</p>
      <p><strong>Serviço:</strong> ${descricaoServico}</p>
      <p><strong>Valor:</strong> R$ ${valor},00</p>
    `;
    resumoEl.classList.remove("hidden");
    agendarBtn.classList.remove("hidden");
  };

  // A cada mudança relevante, recalcula o orçamento
  [nomeInput, telefoneInput, tipoInput, btusInput, descricaoInput].forEach(input => {
    input.addEventListener("input", calcularValor);
    input.addEventListener("change", calcularValor);
  });

  agendarBtn.addEventListener("click", function () {
    alert("Agendamento iniciado. Você pode completar a data e hora agora.");
    // Aqui você pode abrir outro modal ou formulário com data e hora
  });
});
</script>
