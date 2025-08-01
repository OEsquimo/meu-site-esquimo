const detalhesInstalacaoDiv = document.getElementById("detalhes-instalacao");

function handleServicoChange() {
  const servico = document.getElementById("servico").value;
  if (servico === "instalacao") {
    detalhesInstalacaoDiv.style.display = "block";
  } else {
    detalhesInstalacaoDiv.style.display = "none";
  }
}

function enviarWhatsApp() {
  const nome = document.getElementById("nome").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const servico = document.getElementById("servico").value;
  const observacoes = document.getElementById("observacoes").value.trim();

  if (!nome) {
    alert("Por favor, informe seu nome.");
    return;
  }

  if (!telefone || telefone.length < 10) {
    alert("Por favor, informe um telefone válido (WhatsApp).");
    return;
  }

  let mensagem = `*Orçamento solicitado por:* ${nome}%0A`;

  if (servico === "instalacao") {
    const tipoInstalacao = document.getElementById("tipo-instalacao").value;
    if (tipoInstalacao === "basica") {
      mensagem +=
        "*Serviço:* Instalação básica de ar-condicionado.%0A" +
        "Materiais inclusos:%0A- 2 metros de tubulação%0A- Cabo PP%0A- Esponjoso%0A- Fita PVC%0A- Suporte%0A- Buchas e parafusos%0A" +
        "Valor: R$ 480,00.%0A";
    } else {
      mensagem +=
        "*Serviço:* Instalação respeitando o manual do fabricante.%0A" +
        "Inclui 3 metros de tubulação e conectores para cabo TP.%0A" +
        "Valor: R$ 750,00.%0A";
    }
  } else if (servico === "limpeza") {
    mensagem +=
      "*Serviço:* Limpeza de ar-condicionado.%0A" +
      "Valor a partir de R$ 180,00.%0A" +
      "Pode variar conforme a dificuldade para retirada do aparelho.%0A";
  } else if (servico === "manutencao") {
    mensagem +=
      "*Serviço:* Manutenção de ar-condicionado.%0A" +
      "Valor sob avaliação após diagnóstico.%0A" +
      "Por favor, informe detalhes do problema nas observações.%0A";
  }

  if (observacoes) {
    mensagem += `%0A*Observações:* %0A${encodeURIComponent(observacoes)}%0A`;
  }

  const numeroEsquimo = "5581983259341"; // Número do O Esquimó para receber o orçamento
  const url = `https://wa.me/${numeroEsquimo}?text=${mensagem}`;

  window.open(url, "_blank");
}

// Exibir ou esconder o campo de tipo de instalação ao mudar o serviço (no load também)
document.getElementById("servico").addEventListener("change", handleServicoChange);
window.onload = handleServicoChange;
