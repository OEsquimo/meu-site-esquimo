
const servicoSelect = document.getElementById("servico");
const tipoInstalacaoContainer = document.getElementById("tipo-instalacao-container");
const tipoInstalacaoSelect = document.getElementById("tipo-instalacao");
const descricaoManutencaoContainer = document.getElementById("descricao-manutencao-container");
const descricaoManutencaoTextarea = document.getElementById("descricao-manutencao");
const resumoOrcamento = document.getElementById("resumo-orcamento");
const whatsappLabel = document.getElementById("label-whatsapp");
const whatsappInput = document.getElementById("whatsapp");
const btnEnviar = document.getElementById("btnEnviar");

let orcamentoTexto = "";

function resetAll() {
  tipoInstalacaoContainer.classList.add("hidden");
  tipoInstalacaoSelect.value = "";

  descricaoManutencaoContainer.classList.add("hidden");
  descricaoManutencaoTextarea.value = "";

  resumoOrcamento.classList.add("hidden");
  resumoOrcamento.textContent = "";

  whatsappInput.classList.add("hidden");
  whatsappLabel.classList.add("hidden");
  whatsappInput.value = "";

  btnEnviar.classList.add("hidden");
}

function gerarOrcamento() {
  const servico = servicoSelect.value;
  const tipoInstalacao = tipoInstalacaoSelect.value;
  const manutencaoDescricao = descricaoManutencaoTextarea.value.trim();

  if (!servico) {
    resumoOrcamento.classList.add("hidden");
    btnEnviar.classList.add("hidden");
    whatsappInput.classList.add("hidden");
    whatsappLabel.classList.add("hidden");
    return;
  }

  let texto = "";

  if (servico === "instalacao") {
    if (!tipoInstalacao) {
      resumoOrcamento.classList.add("hidden");
      btnEnviar.classList.add("hidden");
      whatsappInput.classList.add("hidden");
      whatsappLabel.classList.add("hidden");
      return;
    }
    if (tipoInstalacao === "basica") {
      texto +=
        "ORÇAMENTO\n" +
        "Material utilizado:\n" +
        "- 2 metros de tubulação\n" +
        "- Cabo PP\n" +
        "- Esponjoso\n" +
        "- Fita PVC\n" +
        "- Suporte\n" +
        "- Buchas e parafusos\n" +
        "Valor da instalação: R$ 480,00.";
    } else if (tipoInstalacao === "fabricante") {
      texto +=
        "ORÇAMENTO\n" +
        "Instalação seguindo o manual do fabricante.\n" +
        "Respeitando o tamanho da tubulação e conectores para o cabo PP.\n" +
        "Valor da instalação: R$ 750,00.";
    }
  } else if (servico === "limpeza") {
    texto +=
      "ORÇAMENTO\n" +
      "Valor da limpeza: R$ 180,00. Podendo variar conforme o grau de dificuldade de acesso ao equipamento.";
  } else if (servico === "manutencao") {
    if (manutencaoDescricao.length < 5) {
      resumoOrcamento.textContent = "Por favor, descreva o problema do seu ar-condicionado para gerar o orçamento.";
      resumoOrcamento.classList.remove("hidden");
      btnEnviar.classList.add("hidden");
      whatsappInput.classList.add("hidden");
      whatsappLabel.classList.add("hidden");
      return;
    }
    texto +=
      "ORÇAMENTO\n" +
      "Descrição do problema: " + manutencaoDescricao + "\n" +
      "Valor: Sob avaliação após vistoria.";
  }

  orcamentoTexto = texto;

  resumoOrcamento.textContent = texto;
  resumoOrcamento.classList.remove("hidden");
  whatsappInput.classList.remove("hidden");
  whatsappLabel.classList.remove("hidden");
  btnEnviar.classList.remove("hidden");
}

function validarWhatsApp(whatsapp) {
  const regex = /^\(\d{2}\)\s?\d{5}-\d{4}$/;
  return regex.test(whatsapp);
}

function enviarWhatsApp() {
  if (!orcamentoTexto) {
    alert("Por favor, selecione o serviço e gere o orçamento antes de enviar.");
    return;
  }

  const whatsappNumero = whatsappInput.value.replace(/\D/g, "");
  if (!validarWhatsApp(whatsappInput.value)) {
    alert("Por favor, insira um número de WhatsApp válido no formato (XX) XXXXX-XXXX.");
    return;
  }

  const url = `https://wa.me/55${whatsappNumero}?text=${encodeURIComponent(orcamentoTexto)}`;
  window.open(url, "_blank");
}

// Eventos
servicoSelect.addEventListener("change", () => {
  resetAll();

  if (servicoSelect.value === "instalacao") {
    tipoInstalacaoContainer.classList.remove("hidden");
  } else if (servicoSelect.value === "limpeza") {
    gerarOrcamento();
  } else if (servicoSelect.value === "manutencao") {
    descricaoManutencaoContainer.classList.remove("hidden");
  }
});

tipoInstalacaoSelect.addEventListener("change", gerarOrcamento);
descricaoManutencaoTextarea.addEventListener("input", () => {
  if (descricaoManutencaoTextarea.value.trim().length >= 5) {
    gerarOrcamento();
  } else {
    resumoOrcamento.classList.add("hidden");
    btnEnviar.classList.add("hidden");
    whatsappInput.classList.add("hidden");
    whatsappLabel.classList.add("hidden");
  }
});

btnEnviar.addEventListener("click", enviarWhatsApp);

// Máscara para WhatsApp
whatsappInput.addEventListener("input", (e) => {
  let v = e.target.value.replace(/\D/g, "");
  if (v.length > 11) v = v.slice(0, 11);

  if (v.length > 6) {
    e.target.value = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
  } else if (v.length > 2) {
    e.target.value = `(${v.slice(0, 2)}) ${v.slice(2)}`;
  } else if (v.length > 0) {
    e.target.value = `(${v}`;
  }
});
