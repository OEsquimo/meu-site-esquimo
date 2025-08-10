/**
 * @file script.js
 * @description Lógica completa para o sistema de agendamento de serviços O Esquimó.
 * @version 2.0 - Módulo ES6 com Firebase v10
 */

// Importações do Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// =================================================================================
// 1. CONFIGURAÇÃO E INICIALIZAÇÃO
// =================================================================================
const firebaseConfig = {
  apiKey: "AIzaSyCFf5gckKE6rg7MFuBYAO84aV-sNrdY2JQ",
  authDomain: "agendamento-esquimo.firebaseapp.com",
  databaseURL: "https://agendamento-esquimo-default-rtdb.firebaseio.com",
  projectId: "agendamento-esquimo",
  storageBucket: "agendamento-esquimo.appspot.com",
  messagingSenderId: "348946727206",
  appId: "1:348946727206:web:f5989788f13c259be0c1e7",
  measurementId: "G-Z0EMQ3XQ1D"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const agendamentosCollection = collection(db, "agendamentos");
const seuWhatsApp = "5581983259341";

// =================================================================================
// 2. MAPEAMENTO DOS ELEMENTOS DO DOM
// =================================================================================
const form = document.getElementById("formulario");
const servicos = document.querySelectorAll(".servico");
const servicoSelecionadoInput = document.getElementById("servicoSelecionado");

// Seções
const dadosClienteWrapper = document.getElementById("dados-cliente-wrapper");
const orcamentoWrapper = document.getElementById("orcamento-wrapper");
const agendamentoWrapper = document.getElementById("agendamento-wrapper");

// Campos do formulário
const nomeInput = document.getElementById("nome");
const enderecoInput = document.getElementById("endereco");
const whatsappInput = document.getElementById("whatsapp");
const btusSelect = document.getElementById("btus");
const defeitoTextarea = document.getElementById("defeito");
const campoBtusWrapper = document.getElementById("campo-btus-wrapper");
const campoDefeitoWrapper = document.getElementById("campo-defeito-wrapper");
const dataAgendamentoInput = document.getElementById("data_agendamento");
const horarioAgendamentoSelect = document.getElementById("horario_agendamento");
const formaPagamentoSelect = document.getElementById("forma_pagamento");
const obsClienteTextarea = document.getElementById("obs_cliente");

// Elementos de exibição e botões
const relatorioOrcamentoDiv = document.getElementById("relatorio-orcamento");
const btnAgendarServico = document.getElementById("btn_agendar_servico");
const btnAgendarServicoSpan = btnAgendarServico.querySelector('span');

// =================================================================================
// 3. ESTADO DA APLICAÇÃO E VALORES
// =================================================================================
const appState = {
  servico: null,
  valor: 0,
  agendamentosExistentes: []
};

const precos = {
  instalacao: { "9000": 500, "12000": 600, "18000": 700, "24000": 800, "30000": 900 },
  limpeza: { "9000": 180, "12000": 230, "18000": 280, "24000": 330, "30000": 380 },
  reparo: 0 // Orçamento sob análise
};

// =================================================================================
// 4. FUNÇÕES AUXILIARES E DE VALIDAÇÃO
// =================================================================================

// Máscara para o campo WhatsApp
whatsappInput.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "").slice(0, 11);
  if (value.length > 2) value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
  if (value.length > 9) value = `${value.substring(0, 9)}-${value.substring(9)}`;
  e.target.value = value;
});

const toggleInputError = (input, hasError) => input.classList.toggle("input-error", hasError);

const calcularValorOrcamento = () => {
  const servico = servicoSelecionadoInput.value;
  const btus = btusSelect.value;
  if (servico === "Instalação") return precos.instalacao[btus] || 0;
  if (servico === "Limpeza") return precos.limpeza[btus] || 0;
  return 0;
};

// **NOVO: Função para gerar o HTML completo do orçamento**
const gerarHtmlOrcamento = () => {
  const valor = calcularValorOrcamento();
  appState.valor = valor;

  const valorTexto = appState.servico === "Reparo" ? "Sob Análise" : `R$ ${valor.toFixed(2)}`;
  const btusTexto = btusSelect.value ? `${btusSelect.options[btusSelect.selectedIndex].text}` : "N/A";
  const defeitoTexto = defeitoTextarea.value.trim();

  return `
    <div class="orcamento-item"><strong>Nome:</strong><span>${nomeInput.value}</span></div>
    <div class="orcamento-item"><strong>Endereço:</strong><span>${enderecoInput.value}</span></div>
    <div class="orcamento-item"><strong>Contato:</strong><span>${whatsappInput.value}</span></div>
    <div class="orcamento-item"><strong>Serviço:</strong><span>${appState.servico}</span></div>
    ${(appState.servico === "Instalação" || appState.servico === "Limpeza") ? `<div class="orcamento-item"><strong>Capacidade:</strong><span>${btusTexto}</span></div>` : ''}
    ${appState.servico === "Reparo" ? `<div class="orcamento-item"><strong>Problema:</strong><span>${defeitoTexto}</span></div>` : ''}
    <div class="orcamento-total"><strong>Valor Total:</strong><span>${valorTexto}</span></div>
  `;
};

// =================================================================================
// 5. LÓGICA PRINCIPAL E FLUXO DO SISTEMA
// =================================================================================

servicos.forEach(servicoDiv => {
  servicoDiv.addEventListener("click", () => {
    servicos.forEach(s => s.classList.remove("selecionado"));
    servicoDiv.classList.add("selecionado");
    
    const servicoEscolhido = servicoDiv.dataset.servico;
    servicoSelecionadoInput.value = servicoEscolhido;
    appState.servico = servicoEscolhido;

    dadosClienteWrapper.style.display = "block";
    campoBtusWrapper.style.display = (servicoEscolhido === "Instalação" || servicoEscolhido === "Limpeza") ? "block" : "none";
    campoDefeitoWrapper.style.display = servicoEscolhido === "Reparo" ? "block" : "none";
    
    btusSelect.required = (servicoEscolhido === "Instalação" || servicoEscolhido === "Limpeza");
    defeitoTextarea.required = servicoEscolhido === "Reparo";

    nomeInput.scrollIntoView({ behavior: "smooth", block: "center" });
    nomeInput.focus();
    validarFormularioCompleto();
  });
});

form.addEventListener("input", validarFormularioCompleto);

function validarFormularioCompleto() {
  const nomeValido = nomeInput.value.trim().length > 2;
  const enderecoValido = enderecoInput.value.trim().length > 5;
  const whatsappValido = whatsappInput.value.replace(/\D/g, "").length === 11;
  
  let servicoValido = false;
  if (appState.servico === "Instalação" || appState.servico === "Limpeza") {
    servicoValido = btusSelect.value !== "";
  } else if (appState.servico === "Reparo") {
    servicoValido = defeitoTextarea.value.trim().length > 10;
  }

  const dadosClientePreenchidos = nomeValido && enderecoValido && whatsappValido && servicoValido;

  orcamentoWrapper.style.display = dadosClientePreenchidos ? "block" : "none";
  agendamentoWrapper.style.display = dadosClientePreenchidos ? "block" : "none";

  if (dadosClientePreenchidos) {
    relatorioOrcamentoDiv.innerHTML = gerarHtmlOrcamento();
  }

  const dataValida = dataAgendamentoInput.value !== "";
  const horarioValido = horarioAgendamentoSelect.value !== "";
  const pagamentoValido = formaPagamentoSelect.value !== "";

  btnAgendarServico.disabled = !(dadosClientePreenchidos && dataValida && horarioValido && pagamentoValido);
}

// =================================================================================
// 6. LÓGICA DE AGENDAMENTO (CALENDÁRIO E HORÁRIOS)
// =================================================================================

const buscarAgendamentos = async () => {
  try {
    const snapshot = await getDocs(agendamentosCollection);
    appState.agendamentosExistentes = snapshot.docs.map(doc => doc.data().timestamp);
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
  }
};

const calendario = flatpickr(dataAgendamentoInput, {
  locale: "pt",
  minDate: "today",
  dateFormat: "Y-m-d",
  altInput: true,
  altFormat: "d/m/Y",
  disable: [(date) => date.getDay() === 0 || date.getDay() === 6], // Desabilita Sábado e Domingo
  onReady: async () => {
    await buscarAgendamentos();
    calendario.redraw();
  },
  onChange: (selectedDates) => {
    if (selectedDates.length > 0) atualizarHorariosDisponiveis(selectedDates[0]);
  }
});

function atualizarHorariosDisponiveis(dataSelecionada) {
  horarioAgendamentoSelect.disabled = true;
  horarioAgendamentoSelect.innerHTML = '<option value="">Carregando...</option>';

  const horariosBase = ["08:00", "10:00", "13:00", "15:00"]; // Intervalo de 4h entre 08 e 18
  const agendamentosDoDia = appState.agendamentosExistentes
    .filter(timestamp => new Date(timestamp).toISOString().startsWith(dataSelecionada.toISOString().substring(0, 10)))
    .map(timestamp => new Date(timestamp).toTimeString().substring(0, 5));

  const horariosDisponiveis = horariosBase.filter(horario => !agendamentosDoDia.includes(horario));

  if (horariosDisponiveis.length > 0) {
    horarioAgendamentoSelect.innerHTML = '<option value="">Selecione o horário</option>';
    horariosDisponiveis.forEach(h => {
      horarioAgendamentoSelect.innerHTML += `<option value="${h}">${h}</option>`;
    });
    horarioAgendamentoSelect.disabled = false;
  } else {
    horarioAgendamentoSelect.innerHTML = '<option value="">Nenhum horário disponível</option>';
  }
  validarFormularioCompleto();
}

// =================================================================================
// 7. SUBMISSÃO DO FORMULÁRIO
// =================================================================================
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (btnAgendarServico.disabled) return;

  btnAgendarServico.disabled = true;
  btnAgendarServicoSpan.textContent = 'Agendando...';

  const dataHoraAgendamento = new Date(`${dataAgendamentoInput.value}T${horarioAgendamentoSelect.value}`);
  
  const dadosAgendamento = {
    servico: appState.servico,
    valor: appState.valor,
    nomeCliente: nomeInput.value.trim(),
    enderecoCliente: enderecoInput.value.trim(),
    telefoneCliente: whatsappInput.value.trim(),
    btus: btusSelect.value || "N/A",
    defeito: defeitoTextarea.value.trim() || "N/A",
    dataAgendamento: calendario.altInput.value, // Data formatada (dd/mm/yyyy)
    horaAgendamento: horarioAgendamentoSelect.value,
    formaPagamento: formaPagamentoSelect.value,
    observacoes: obsClienteTextarea.value.trim() || "Nenhuma",
    timestamp: dataHoraAgendamento.getTime(),
    status: "Agendado"
  };

  try {
    await addDoc(agendamentosCollection, dadosAgendamento);

    const mensagemWhatsApp = `✅ *Novo Agendamento Confirmado*
-----------------------------------
*Serviço:* ${dadosAgendamento.servico}
*Cliente:* ${dadosAgendamento.nomeCliente}
*Endereço:* ${dadosAgendamento.enderecoCliente}
*Contato:* ${dadosAgendamento.telefoneCliente}
*Valor:* ${appState.valor > 0 ? `R$ ${appState.valor.toFixed(2)}` : 'Sob Análise'}
*Data:* ${dadosAgendamento.dataAgendamento}
*Hora:* ${dadosAgendamento.horaAgendamento}
*Pagamento:* ${dadosAgendamento.formaPagamento}
*Obs:* ${dadosAgendamento.observacoes}`;

    const urlWhatsApp = `https://wa.me/${seuWhatsApp}?text=${encodeURIComponent(mensagemWhatsApp)}`;
    window.open(urlWhatsApp, "_blank");

    alert("Agendamento realizado com sucesso! Você será redirecionado para o WhatsApp para confirmar.");
    form.reset();
    window.location.reload(); // Recarrega a página para um novo agendamento

  } catch (error) {
    console.error("Erro ao salvar agendamento:", error);
    alert("Houve um erro ao tentar agendar. Por favor, tente novamente.");
  } finally {
    btnAgendarServico.disabled = false;
    btnAgendarServicoSpan.textContent = 'Agendar Serviço';
  }
});
