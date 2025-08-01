function exibirCampos() {
  const servico = document.getElementById("servico").value;
  document.getElementById("btusContainer").classList.add("hidden");
  document.getElementById("grauInstalacaoContainer").classList.add("hidden");
  document.getElementById("descricaoDefeitoContainer").classList.add("hidden");
  document.getElementById("resumoContainer").classList.add("hidden");

  if (servico === "instalacao") {
    document.getElementById("btusContainer").classList.remove("hidden");
    document.getElementById("grauInstalacaoContainer").classList.remove("hidden");
  } else if (servico === "manutencao") {
    document.getElementById("descricaoDefeitoContainer").classList.remove("hidden");
  }
}

function gerarOrcamento() {
  const servico = document.getElementById("servico").value;
  const telefone = document.getElementById("telefone").value.trim();
  let resumo = "";
  let valor = 0;

  if (!servico || !telefone) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  if (servico === "limpeza") {
    valor = 180;
    resumo += `Serviço: Limpeza de ar-condicionado\n`;
    resumo += `Valor base: R$ ${valor.toFixed(2)}\n`;
    resumo += "Obs: O valor pode variar de acordo com o grau de dificuldade.";
  } else if (servico === "instalacao") {
    const btus = parseInt(document.getElementById("btus").value);
    const tipoInstalacao = document.getElementById("tipoInstalacao").value;
    valor = calcularValorInstalacao(btus);
    resumo += `Serviço: Instalação de ar-condicionado\n`;
    resumo += `BTUs: ${btus}\n`;
    resumo += `Tipo de instalação: ${tipoInstalacao === "basica" ? "Básica" : "Técnica"}\n`;
    resumo += `Valor: R$ ${valor.toFixed(2)}\n`;
  } else if (servico === "manutencao") {
    const defeito = document.getElementById("descricaoDefeito").value.trim();
    resumo += `Serviço: Manutenção\n`;
    resumo += `Defeito informado: ${defeito || "Não descrito"}\n`;
    resumo += "O valor será informado após análise técnica.";
  }

  document.getElementById("resumo").textContent = resumo;
  document.getElementById("resumoContainer").classList.remove("hidden");

  enviarParaWhatsApp(telefone, resumo);
}

function calcularValorInstalacao(btus) {
  switch (btus) {
    case 9000: return 480;
    case 12000: return 550;
    case 18000: return 650;
    case 24000: return 750;
    default: return 0;
  }
}

function enviarParaWhatsApp(telefoneCliente, mensagem) {
  const telefoneFormatadoCliente = telefoneCliente.replace(/\D/g, "");
  const telefoneProfissional = "5581983259341";

  const urlCliente = `https://wa.me/55${telefoneFormatadoCliente}?text=${encodeURIComponent(mensagem)}`;
  const urlProfissional = `https://wa.me/${telefoneProfissional}?text=${encodeURIComponent("Novo orçamento:\n" + mensagem)}`;

  window.open(urlCliente, "_blank");
  window.open(urlProfissional, "_blank");
}
