document.getElementById("servico").addEventListener("change", function () {
  const servicoSelecionado = this.value;
  const container = document.getElementById("opcoes-servico");

  container.innerHTML = ""; // Limpa antes

  if (servicoSelecionado === "instalacao") {
    const select = document.createElement("select");
    select.id = "detalhes";

    const op1 = document.createElement("option");
    op1.value = "Instalação padrão respeitando o manual do fabricante. Inclui até 3 metros de tubulação, suporte, esponjoso, cabo PP, fita PVC, dreno e fixação.";
    op1.textContent = "Instalação padrão (respeitando o manual)";

    const op2 = document.createElement("option");
    op2.value = "Instalação básica com tubulação em par, sem exigências técnicas específicas do fabricante.";
    op2.textContent = "Instalação básica";

    select.appendChild(op1);
    select.appendChild(op2);
    container.appendChild(select);

  } else if (servicoSelecionado === "limpeza") {
    container.innerHTML = `Limpeza técnica completa a partir de R$ 180,00, dependendo do grau de dificuldade para a retirada do ar-condicionado.`;

  } else if (servicoSelecionado === "manutencao") {
    container.innerHTML = `Manutenção preventiva ou corretiva, com inspeção completa do equipamento.`;

  } else if (servicoSelecionado === "reparo") {
    container.innerHTML = `Análise técnica para identificar defeito e realizar o reparo. Valor sob consulta.`;

  } else if (servicoSelecionado === "reinstalacao") {
    container.innerHTML = `Reinstalação do equipamento em novo local. Inclui revisão da tubulação, suporte e complementos.`;
  }
});

document.getElementById("enviar").addEventListener("click", function () {
  const servico = document.getElementById("servico").value;
  const detalhes = document.getElementById("detalhes")?.value || "";
  const whatsapp = document.getElementById("whatsapp").value;

  if (!servico || !whatsapp || whatsapp.length < 10) {
    alert("Preencha todos os campos corretamente!");
    return;
  }

  const texto = encodeURIComponent(`Orçamento solicitado:\n\nServiço: ${servico.toUpperCase()}\n${detalhes}`);
  window.open(`https://wa.me/55${whatsapp}?text=${texto}`, "_blank");
});
