// Textos e valores fixos
const TEXTOS = {
  instalacaoBasica: `Instalação Básica inclui:
- 2 metros de tubulação
- Cabo PP
- Esponjoso
- Fita PVC
- Suporte
- Buchas e parafusos
Valor: R$ 480,00`,

  instalacaoPadrao: `A instalação padrão segue o manual do fabricante, inclui:
- 3 metros de tubulação
- Conectores para cabo TP
Valor: R$ 750,00`,

  limpeza: `Limpeza a partir de R$ 180,00.
Pode variar conforme o grau de dificuldade
para retirada do ar-condicionado.`,

  manutencao: `O valor da manutenção depende do diagnóstico do problema.
Por favor, descreva detalhadamente o que está acontecendo com seu ar-condicionado para que possamos avaliar melhor.`
};

// Elementos
const servicoSelect = document.getElementById("servico");
const tipoInstalacaoDiv = document.getElementById("tipo-instalacao");
const instalacaoSelect = document.getElementById("instalacao");
const descricaoInstalacaoDiv = document.getElementById("descricao-instalacao");
const manutencaoInfoDiv = document.getElementById("manutencao-info");
const descricaoManutencaoTextarea = document.getElementById("descricao-manutencao");
const resumoDiv = document.getElementById("resumo");
const whatsappInput = document.getElementById("whatsapp");
const btnEnviar = document.getElementById("btn-enviar");
const observacoesTextarea = document.getElementById("observacoes");
const labelObservacoes = document.getElementById("label-observacoes");
const labelWhatsapp = document.getElementById("label-whatsapp");
const historicoDiv = document.getElementById("historico");
const listaHistorico = document.getElementById("lista-historico");
const btnLimparHistorico = document.getElementById("btn-limpar-historico");

const MEU_WHATSAPP = "5581983259341"; // Seu número fixo para receber orçamentos

// Inicialização
function resetarFormulario() {
  tipoInstalacaoDiv.classList.add("hidden");
  instalacaoSelect.value = "";
  descricaoInstalacaoDiv.textContent = "";
  manutencaoInfoDiv.classList.add("hidden");
  descricaoManutencaoTextarea.value = "";
  resumoDiv.classList.add("hidden");
  resumoDiv.textContent = "";
  whatsappInput.value = "";
  whatsappInput.classList.add("hidden");
  btnEnviar.classList.add("hidden");
  observacoesTextarea.value = "";
  observacoesTextarea.classList.add("hidden");
  labelObservacoes.classList.add("hidden");
  labelWhatsapp.classList.add("hidden");
}
resetarFormulario();
carregarHistorico();

// Eventos
servicoSelect.addEventListener("change", () => {
  resetarFormulario();
  const servico = servicoSelect.value;

  if (servico === "instalacao") {
    tipoInstalacaoDiv.classList.remove("hidden");
  } else if (servico === "limpeza") {
    resumoDiv.textContent = TEXTOS.limpeza;
    resumoDiv.classList.remove("hidden");
    whatsappInput.classList.remove("hidden");
    btnEnviar.classList.remove("hidden");
    labelWhatsapp.classList.remove("hidden");
    labelObservacoes.classList.remove("hidden");
    observacoesTextarea.classList.remove("hidden");
  } else if (servico === "manutencao") {
    manutencaoInfoDiv.classList.remove("hidden");
    labelObservacoes.classList.remove("hidden");
    observacoesTextarea.classList.remove("hidden");
  }
});

instalacaoSelect.addEventListener("change", () => {
  const tipo = instalacaoSelect.value;
  if (tipo === "basica") {
    descricaoInstalacaoDiv.textContent = TEXTOS.instalacaoBasica;
    resumoDiv.textContent = TEXTOS.instalacaoBasica;
    resumoDiv.classList.remove("hidden");
    whatsappInput.classList.remove("hidden");
    btnEnviar.classList.remove("hidden");
    labelWhatsapp.classList.remove("hidden");
    labelObservacoes.classList.remove("hidden");
    observacoesTextarea.classList.remove("hidden");
  } else if (tipo === "padrao") {
    descricaoInstalacaoDiv.textContent = TEXTOS.instalacaoPadrao;
    resumoDiv.textContent = TEXTOS.instalacaoPadrao;
    resumoDiv.classList.remove("hidden");
    whatsappInput.classList.remove("hidden");
    btnEnviar.classList.remove("hidden");
    labelWhatsapp.classList.remove("hidden");
    labelObservacoes.classList.remove("hidden");
    observacoesTextarea.classList.remove("hidden");
  } else {
    descricaoInstalacaoDiv.textContent = "";
    resumoDiv.classList.add("hidden");
    resumoDiv.textContent = "";
    whatsappInput.classList.add("hidden");
    btnEnviar.classList.add("hidden");
    labelWhatsapp.classList.add("hidden");
    labelObservacoes.classList.add("hidden");
    observacoesTextarea.classList.add("hidden");
  }
});

// Atualiza resumo da manutenção conforme texto digitado
descricaoManutencaoTextarea.addEventListener("input", () => {
  const texto = descricaoManutencaoTextarea.value.trim();
  if (texto.length > 0) {
    resumoDiv.textContent = `${TEXTOS.manutencao}\n\nDescrição do problema:\n${texto}`;
    resumoDiv.classList.remove("hidden");
    whatsappInput.classList.remove("hidden");
    btnEnviar.classList.remove("hidden");
    labelWhatsapp.classList.remove("hidden");
    labelObservacoes.classList.remove("hidden");
    observacoesTextarea.classList.remove("hidden");
  } else {
    resumoDiv.classList.add("hidden");
    resumoDiv.textContent = "";
    whatsappInput.classList.add("hidden");
    btnEnviar.classList.add("hidden");
    labelWhatsapp.classList.add("hidden");
    labelObservacoes.classList.add("hidden");
    observacoesTextarea.classList.add("hidden");
  }
});

// Atualiza resumo incluindo observações extras
observacoesTextarea.addEventListener("input", () => {
  atualizarResumoCompleto();
});

btnEnviar.addEventListener("click", () => {
  const numeroClienteRaw = whatsappInput.value.replace(/\D/g, "");
  if (!validarNumeroWhatsApp(numeroClienteRaw)) {
    alert("Por favor, informe um número de WhatsApp válido (com DDD).");
    whatsappInput.focus();
    return;
  }

  const mensagem = montarMensagem(numeroClienteRaw);
  abrirWhatsApp(mensagem);
  salvarHistorico(mensagem);
});

// Funções auxiliares

function validarNumeroWhatsApp(numero) {
  // Deve ter entre 10 e 13 dígitos (considerando DDI opcional)
  return /^[0-9]{10,13}$/.test(numero);
}

function montarMensagem(numeroCliente) {
  let texto = "Olá, gostaria de solicitar um orçamento:\n\n";

  texto += `Serviço: ${servicoSelect.options[servicoSelect.selectedIndex].text}\n`;

  if (servicoSelect.value === "instalacao") {
    texto += `Tipo de instalação: ${instalacaoSelect.options[instalacaoSelect.selectedIndex].text}\n`;
    texto += descricaoInstalacaoDiv.textContent + "\n";
  } else if (servicoSelect.value === "limpeza") {
    texto += TEXTOS.limpeza + "\n";
  } else if (servicoSelect.value === "manutencao") {
    texto += descricaoManutencaoTextarea.value.trim() + "\n";
  }

  if (observacoesTextarea.value.trim() !== "") {
    texto += `\nObservações adicionais:\n${observacoesTextarea.value.trim()}\n`;
  }

  texto += `\nNúmero do cliente para contato: +${numeroCliente}\n`;

  return texto;
}

function abrirWhatsApp(mensagem) {
  const url = `https://wa.me/${MEU_WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank");
}

function atualizarResumoCompleto() {
  if (servicoSelect.value === "instalacao") {
    resumoDiv.textContent = descricaoInstalacaoDiv.textContent;
  } else if (servicoSelect.value === "limpeza") {
    resumoDiv.textContent = TEXTOS.limpeza;
  } else if (servicoSelect.value === "manutencao") {
    const problema = descricaoManutencaoTextarea.value.trim();
    resumoDiv.textContent = problema
      ? `${TEXTOS.manutencao}\n\nDescrição do problema:\n${problema}`
      : "";
  }

  if (observacoesTextarea.value.trim() !== "") {
    resumoDiv.textContent += `\n\nObservações adicionais:\n${observacoesTextarea.value.trim()}`;
  }

  if (resumoDiv.textContent.trim() === "") {
    resumoDiv.classList.add("hidden");
    whatsappInput.classList.add("hidden");
    btnEnviar.classList.add("hidden");
    labelWhatsapp.classList.add("hidden");
    labelObservacoes.classList.add("hidden");
    observacoesTextarea.classList.add("hidden");
  } else {
    resumoDiv.classList.remove("hidden");
    whatsappInput.classList.remove("hidden");
    btnEnviar.classList.remove("hidden");
    labelWhatsapp.classList.remove("hidden");
    labelObservacoes.classList.remove("hidden");
    observacoesTextarea.classList.remove("hidden");
  }
}

// Máscara simples para o campo WhatsApp
whatsappInput.addEventListener("input", (e) => {
  let v = e.target.value.replace(/\D/g, "");
  if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
  if (v.length > 9) v = `${v.slice(0, 9)}-${v.slice(9, 13)}`;
  e.target.value = v;
});

// Histórico simples no localStorage
function salvarHistorico(mensagem) {
  let historico = JSON.parse(localStorage.getItem("orcamentosEsquimo") || "[]");
  historico.unshift({ mensagem, data: new Date().toLocaleString() });
  if (historico.length > 10) historico.pop(); // Limitar a 10 últimos
  localStorage.setItem("orcamentosEsquimo", JSON.stringify(historico));
  mostrarHistorico();
}

function carregarHistorico() {
  mostrarHistorico();
}

function mostrarHistorico() {
  let historico = JSON.parse(localStorage.getItem("orcamentosEsquimo") || "[]");
  if (historico.length === 0) {
    historicoDiv.classList.add("hidden");
    return;
  }
  listaHistorico.innerHTML = "";
  historico.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `[${item.data}] ${item.mensagem.substring(0, 50)}...`;
    listaHistorico.appendChild(li);
  });
  historicoDiv.classList.remove("hidden");
}

btnLimparHistorico.addEventListener("click", () => {
  if (confirm("Deseja realmente limpar o histórico de orçamentos?")) {
    localStorage.removeItem("orcamentosEsquimo");
    mostrarHistorico();
  }
});
