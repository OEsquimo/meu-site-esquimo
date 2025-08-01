function onServicoChange() {
  const servico = document.getElementById("servico").value;
  const opcoesInstalacao = document.getElementById("opcoesInstalacao");
  const detalhesServico = document.getElementById("detalhesServico");
  const descricaoProblema = document.getElementById("descricaoProblema");
  const resposta = document.getElementById("resposta");
  const btnWhatsapp = document.getElementById("btnWhatsapp");

  // Reset tudo
  detalhesServico.classList.add("hidden");
  descricaoProblema.classList.add("hidden");
  resposta.classList.add("hidden");
  btnWhatsapp.classList.add("hidden");
  detalhesServico.textContent = "";
  resposta.textContent = "";
  document.getElementById("tipoInstalacao").value = "";
  document.getElementById("descricao").value = "";

  if (servico === "instalacao") {
    opcoesInstalacao.classList.remove("hidden");
  } else {
    opcoesInstalacao.classList.add("hidden");
    if (servico === "limpeza") {
      detalhesServico.textContent = "Valor da limpeza: R$ 180,00. Pode variar conforme o grau de dificuldade para retirada do ar-condicionado.";
      detalhesServico.classList.remove("hidden");
    } else if (servico === "manutencao") {
      descricaoProblema.classList.remove("hidden");
      detalhesServico.textContent = "Informe qual o problema que seu ar-condicionado está apresentando.";
      detalhesServico.classList.remove("hidden");
    } else {
      detalhesServico.classList.add("hidden");
    }
  }
}

function onTipoInstalacaoChange() {
  const tipo = document.getElementById("tipoInstalacao").value;
  const detalhesServico = document.getElementById("detalhesServico");
  const resposta = document.getElementById("resposta");
  const btnWhatsapp = document.getElementById("btnWhatsapp");

  resposta.classList.add("hidden");
  btnWhatsapp.classList.add("hidden");
  resposta.textContent = "";

  if (tipo === "basica") {
    detalhesServico.textContent = `Material utilizado:
- 2 metros de tubulação
- Cabo PP
- Esponjoso
- Fita PVC
- Suporte
- Buchas e parafusos
Valor da instalação: R$ 480,00`;
    detalhesServico.classList.remove("hidden");
  } else if (tipo === "fabricante") {
    detalhesServico.textContent = `Instalação seguindo o manual do fabricante.
Respeitando o tamanho da tubulação e conectores para o cabo PP.
Valor da instalação: R$ 750,00`;
    detalhesServico.classList.remove("hidden");
  } else {
    detalhesServico.classList.add("hidden");
  }
}

function gerarOrcamento() {
  const servico = document.getElementById("servico").value;
  const tipoInstalacao = document.getElementById("tipoInstalacao").value;
  const descricao = document.getElementById("descricao").value.trim();
  const whatsapp = document.getElementById("whatsapp").value.trim();
  const resposta = document.getElementById("resposta");
  const btnWhatsapp = document.getElementById("btnWhatsapp");
  const detalhesServico = document.getElementById("detalhesServico");

  if (!servico) {
    alert("Por favor, selecione um serviço.");
    return;
  }

  if (servico === "instalacao" && !tipoInstalacao) {
    alert("Por favor, selecione o tipo de instalação.");
    return;
  }

  if (servico === "manutencao" && descricao.length < 5) {
    alert("Por favor, descreva o problema do seu ar-condicionado para orçamento.");
    return;
  }

  if (!whatsapp || whatsapp.length < 14) {
    alert("Por favor, informe um número de WhatsApp válido no formato (xx) xxxxx-xxxx.");
    return;
  }

  // Gerar texto do orçamento
  let texto = `Orçamento solicitado:\nServiço: ${capitalize(servico)}`;

  if (servico === "instalacao") {
    if (tipoInstalacao === "basica") {
      texto += `\nTipo: Instalação básica\nMaterial utilizado:\n- 2 metros de tubulação\n- Cabo PP\n- Esponjoso\n- Fita PVC\n- Suporte\n- Buchas e parafusos\nValor: R$ 480,00`;
    } else if (tipoInstalacao === "fabricante") {
      texto += `\nTipo: Instalação segundo o fabricante\nInstalação seguindo o manual do fabricante.\nRespeitando o tamanho da tubulação e conectores para o cabo PP.\nValor: R$ 750,00`;
    }
  } else if (servico === "limpeza") {
    texto += `\nValor: R$ 180,00 (pode variar conforme dificuldade para retirada do ar-condicionado)`;
  } else if (servico === "manutencao") {
    texto += `\nDescrição do problema:\n${descricao}`;
    texto += `\nOrçamento: Valor sob avaliação após vistoria técnica.`;
  }

  texto += `\n\nContato para WhatsApp: ${whatsapp}`;

  resposta.textContent = texto;
  resposta.classList.remove("hidden");
  btnWhatsapp.classList.remove("hidden");
}

function enviarParaWhatsapp() {
  const resposta = document.getElementById("resposta").textContent;
  const whatsapp = document.getElementById("whatsapp").value.trim();
  const telefoneLimpo = whatsapp.replace(/\D/g, ""); // remove tudo que não for número

  if (telefoneLimpo.length < 10) {
    alert("Por favor, informe um número de WhatsApp válido.");
    return;
  }

  const url = `https://wa.me/55${telefoneLimpo}?text=${encodeURIComponent(resposta)}`;
  window.open(url, "_blank");
}

function capitalize(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}
