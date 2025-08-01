// Máscara simples para telefone brasileiro (xx) xxxxx-xxxx
const inputWhatsapp = document.getElementById("whatsapp");

inputWhatsapp.addEventListener("input", function(e) {
  let v = e.target.value.replace(/\D/g, "");

  if (v.length > 11) v = v.slice(0, 11);

  if (v.length <= 2) {
    e.target.value = "(" + v;
  } else if (v.length <= 7) {
    e.target.value = "(" + v.slice(0,2) + ") " + v.slice(2);
  } else {
    e.target.value = "(" + v.slice(0,2) + ") " + v.slice(2,7) + "-" + v.slice(7);
  }
});

function mostrarOpcoesInstalacao() {
  const servico = document.getElementById("servico").value;
  const selectInstalacao = document.getElementById("tipoInstalacao");
  const textoInstalacao = document.getElementById("descricaoInstalacao");
  const descricaoProblema = document.getElementById("descricao");
  
  // Reset campos
  selectInstalacao.classList.add("hidden");
  textoInstalacao.textContent = "";
  descricaoProblema.classList.add("hidden");
  descricaoProblema.value = "";

  if (servico === "Instalação") {
    selectInstalacao.classList.remove("hidden");
  } else if (servico === "Limpeza") {
    textoInstalacao.textContent = "Valor da limpeza: R$ 180,00, podendo variar conforme a dificuldade para retirada do ar-condicionado.";
  } else if (servico === "Manutenção") {
    textoInstalacao.textContent = "";
    descricaoProblema.classList.remove("hidden");
  }
}

function mostrarDescricaoInstalacao() {
  const tipo = document.getElementById("tipoInstalacao").value;
  const textoInstalacao = document.getElementById("descricaoInstalacao");

  if (tipo === "basica") {
    textoInstalacao.textContent =
      "Material utilizado:\n" +
      "- 2 metros de tubulação\n" +
      "- Cabo PP\n" +
      "- Esponjoso\n" +
      "- Fita PVC\n" +
      "- Suporte\n" +
      "- Buchas e parafusos\n" +
      "Valor da instalação: R$ 480,00";
  } else if (tipo === "manual") {
    textoInstalacao.textContent =
      "Instalação seguindo o manual do fabricante.\n" +
      "Respeitando o tamanho da tubulação e conectores para o cabo PP.\n" +
      "Valor da instalação: R$ 750,00";
  } else {
    textoInstalacao.textContent = "";
  }
}

function gerarOrcamento() {
  const servico = document.getElementById("servico").value;
  const tipoInstalacao = document.getElementById("tipoInstalacao").value;
  const descricaoProblema = document.getElementById("descricao").value.trim();
  const textoInstalacao = document.getElementById("descricaoInstalacao").textContent;
  const responseArea = document.getElementById("responseArea");
  const btnEnviar = document.getElementById("btnEnviar");

  if (!servico) {
    alert("Por favor, selecione um serviço.");
    return;
  }

  let texto = `Orçamento solicitado:\nServiço: ${servico}`;

  if (servico === "Instalação") {
    if (!tipoInstalacao) {
      alert("Por favor, selecione o tipo de instalação.");
      return;
    }
    texto += `\nTipo de instalação: ${tipoInstalacao === "basica" ? "Instalação Básica" : "Instalação segundo o fabricante"}`;
    texto += `\nDetalhes:\n${textoInstalacao}`;
  } else if (servico === "Limpeza") {
    texto += `\nDetalhes:\nValor da limpeza: R$ 180,00 (pode variar conforme a dificuldade para retirada).`;
  } else if (servico === "Manutenção") {
    if (!descricaoProblema) {
      alert("Por favor, descreva o problema do seu ar-condicionado.");
      return;
    }
    texto += `\nDescrição do problema: ${descricaoProblema}`;
    texto += `\nValor estimado: Sob avaliação após vistoria.`;
  }

  responseArea.textContent = texto;
  responseArea.classList.remove("hidden");
  btnEnviar.classList.remove("hidden");
}

function enviarParaWhatsApp() {
  const telefoneInput = document.getElementById("whatsapp").value;
  const telefoneLimpo = telefoneInput.replace(/\D/g, "");

  if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
    alert("Por favor, informe um número de WhatsApp válido com DDD, ex: (81) 99999-9999.");
    return;
  }

  const responseText = document.getElementById("responseArea").textContent;
  const url = `https://wa.me/55${telefoneLimpo}?text=${encodeURIComponent(responseText)}`;
  window.open(url, "_blank");
}
