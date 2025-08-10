/**
 * @file script.js
 * @description Versão com lógica de verificação de horários em tempo real para evitar conflitos.
 * @version 3.3 - Final (Anti-conflito)
 */

// =================================================================================
// 1. IMPORTAÇÕES E CONFIGURAÇÃO DO FIREBASE (Intacto)
// =================================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCFf5gckKE6rg7MFuBYAO84aV-sNrdY2JQ",
  authDomain: "agendamento-esquimo.firebaseapp.com",
  projectId: "agendamento-esquimo",
  storageBucket: "agendamento-esquimo.appspot.com",
  messagingSenderId: "348946727206",
  appId: "1:348946727206:web:f5989788f13c259be0c1e7",
  measurementId: "G-Z0EMQ3XQ1D"
};

let db;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log("✅ Firebase conectado com sucesso!");
} catch (e) {
  console.error("❌ Erro fatal ao inicializar o Firebase:", e);
  alert("Erro de configuração do sistema. A página não funcionará corretamente.");
}

const agendamentosCollection = collection(db, "agendamentos");
const seuWhatsApp = "5581983259341";

// =================================================================================
// 2. MAPEAMENTO DOS ELEMENTOS DO DOM (Intacto)
// =================================================================================
const form = document.getElementById("formulario");
const servicos = document.querySelectorAll(".servico");
const dadosClienteWrapper = document.getElementById("dados-cliente-wrapper");
const orcamentoWrapper = document.getElementById("orcamento-wrapper");
const agendamentoWrapper = document.getElementById("agendamento-wrapper");
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
const relatorioOrcamentoDiv = document.getElementById("relatorio-orcamento");
const btnAgendarServico = document.getElementById("btn_agendar_servico");
const btnAgendarServicoSpan = btnAgendarServico.querySelector('span');

// =================================================================================
// 3. ESTADO GLOBAL DA APLICAÇÃO (Intacto)
// =================================================================================
const appState = {
  servico: null,
  valor: 0,
  agendamentosExistentes: [], // Armazenará todos os agendamentos futuros
  precos: {
    instalacao: { "9000": 500, "12000": 600, "18000": 700, "24000": 800, "30000": 900 },
    limpeza: { "9000": 180, "12000": 230, "18000": 280, "24000": 330, "30000": 380 },
    reparo: 0
  }
};

// =================================================================================
// 4. FUNÇÕES AUXILIARES E DE VALIDAÇÃO (Intacto)
// =================================================================================
whatsappInput.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "").slice(0, 11);
  if (value.length > 2) value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
  if (value.length > 9) value = `${value.substring(0, 9)}-${value.substring(9)}`;
  e.target.value = value;
});

const calcularValorOrcamento = () => {
  const servico = appState.servico;
  const btus = btusSelect.value;
  if (servico === "Instalação") return appState.precos.instalacao[btus] || 0;
  if (servico === "Limpeza") return appState.precos.limpeza[btus] || 0;
  return 0;
};

const gerarHtmlOrcamento = () => {
  appState.valor = calcularValorOrcamento();
  const valorTexto = appState.servico === "Reparo" ? "Sob Análise" : `R$ ${appState.valor.toFixed(2)}`;
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
// 5. LÓGICA PRINCIPAL E FLUXO DO FORMULÁRIO (Intacto)
// =================================================================================
servicos.forEach(servicoDiv => {
  servicoDiv.addEventListener("click", () => {
    servicos.forEach(s => s.classList.remove("selecionado"));
    servicoDiv.classList.add("selecionado");
    appState.servico = servicoDiv.dataset.servico;
    dadosClienteWrapper.style.display = "block";
    campoBtusWrapper.style.display = (appState.servico === "Instalação" || appState.servico === "Limpeza") ? "block" : "none";
    campoDefeitoWrapper.style.display = appState.servico === "Reparo" ? "block" : "none";
    btusSelect.required = (appState.servico === "Instalação" || appState.servico === "Limpeza");
    defeitoTextarea.required = appState.servico === "Reparo";
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
    servicoValido = defeitoTextarea.value.trim().length > 3;
  }
  const dadosClientePreenchidos = nomeValido && enderecoValido && whatsappValido && servicoValido;
  orcamentoWrapper.style.display = dadosClientePreenchidos ? "block" : "none";
  agendamentoWrapper.style.display = dadosClientePreenchidos ? "block" : "none";
  if (dadosClientePreenchidos) {
    relatorioOrcamentoDiv.innerHTML = gerarHtmlOrcamento();
  }
  const dataValida = dataAgendamentoInput.value !== "";
  const horarioValido = horarioAgendamentoSelect.value !== "" && !horarioAgendamentoSelect.disabled;
  const pagamentoValido = formaPagamentoSelect.value !== "";
  btnAgendarServico.disabled = !(dadosClientePreenchidos && dataValida && horarioValido && pagamentoValido);
}

// =================================================================================
// 6. LÓGICA DE AGENDAMENTO (COM A NOVA VALIDAÇÃO ANTI-CONFLITO)
// =================================================================================

// Busca TODOS os agendamentos futuros UMA VEZ e armazena localmente.
const buscarAgendamentos = async () => {
  try {
    const snapshot = await getDocs(agendamentosCollection);
    // Armazena um objeto mais completo para facilitar a filtragem
    appState.agendamentosExistentes = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            data: data.dataAgendamento, // Formato "dd/mm/yyyy"
            hora: data.horaAgendamento  // Formato "HH:MM"
        };
    });
    console.log("Agendamentos existentes carregados:", appState.agendamentosExistentes);
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
  }
};

// Inicializa o calendário (Flatpickr)
const calendario = flatpickr(dataAgendamentoInput, {
  locale: "pt",
  minDate: "today",
  dateFormat: "d/m/Y", // Formato que o usuário vê e que usamos para comparar
  disable: [(date) => date.getDay() === 0 || date.getDay() === 6],
  onReady: async () => {
    // Busca os dados do Firebase assim que o calendário estiver pronto
    await buscarAgendamentos();
  },
  onChange: (selectedDates) => {
    if (selectedDates.length > 0) {
      // A data selecionada já vem no formato "dd/mm/yyyy" graças à configuração
      const dataFormatada = calendario.input.value;
      atualizarHorariosDisponiveis(dataFormatada);
    }
  }
});

// #############################################################################
// ## FUNÇÃO ATUALIZADA PARA VERIFICAR HORÁRIOS EM TEMPO REAL ##
// #############################################################################
function atualizarHorariosDisponiveis(dataSelecionada) {
  horarioAgendamentoSelect.disabled = true;
  horarioAgendamentoSelect.innerHTML = '<option value="">Verificando...</option>';

  // Lista com todos os horários possíveis para um dia
  const horariosBase = ["08:00", "10:00", "13:00", "15:00"];

  // Filtra a lista de agendamentos JÁ CARREGADA para encontrar os do dia selecionado
  const horariosOcupados = appState.agendamentosExistentes
    .filter(agendamento => agendamento.data === dataSelecionada)
    .map(agendamento => agendamento.hora); // Pega apenas a hora (ex: "08:00")

  console.log(`Para o dia ${dataSelecionada}, os horários ocupados são:`, horariosOcupados);

  // Compara a lista de todos os horários com a lista de horários ocupados
  const horariosDisponiveis = horariosBase.filter(horario => !horariosOcupados.includes(horario));

  console.log(`Horários disponíveis:`, horariosDisponiveis);

  // Atualiza o <select> com as opções disponíveis
  if (horariosDisponiveis.length > 0) {
    horarioAgendamentoSelect.innerHTML = '<option value="">Selecione o horário</option>';
    horariosDisponiveis.forEach(h => {
      horarioAgendamentoSelect.innerHTML += `<option value="${h}">${h}</option>`;
    });
    horarioAgendamentoSelect.disabled = false;
  } else {
    horarioAgendamentoSelect.innerHTML = '<option value="">Nenhum horário disponível</option>';
  }
  // Revalida o formulário para habilitar/desabilitar o botão final
  validarFormularioCompleto();
}

// =================================================================================
// 7. SUBMISSÃO FINAL DO FORMULÁRIO (Intacto)
// =================================================================================
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (btnAgendarServico.disabled) return;
  btnAgendarServico.disabled = true;
  btnAgendarServicoSpan.textContent = 'Processando...';
  
  // Usa o valor do input do calendário, que já está no formato "dd/mm/yyyy"
  const dataFormatada = dataAgendamentoInput.value;
  const [dia, mes, ano] = dataFormatada.split('/');
  const dataHoraAgendamento = new Date(`${ano}-${mes}-${dia}T${horarioAgendamentoSelect.value}`);

  const dadosAgendamento = {
    servico: appState.servico,
    valor: appState.valor,
    nomeCliente: nomeInput.value.trim(),
    enderecoCliente: enderecoInput.value.trim(),
    telefoneCliente: whatsappInput.value.trim(),
    btus: btusSelect.value || "N/A",
    defeito: defeitoTextarea.value.trim() || "N/A",
    dataAgendamento: dataFormatada, // Salva no formato "dd/mm/yyyy"
    horaAgendamento: horarioAgendamentoSelect.value,
    formaPagamento: formaPagamentoSelect.value,
    observacoes: obsClienteTextarea.value.trim() || "Nenhuma",
    timestamp: dataHoraAgendamento.getTime(),
    status: "Agendado"
  };
  try {
    const docRef = await addDoc(agendamentosCollection, dadosAgendamento);
    console.log("✅ SUCESSO! Documento salvo no Firebase com o ID:", docRef.id);
    const mensagemWhatsApp = `✅ *Novo Agendamento Confirmado* ✅
-----------------------------------
🛠️ *Serviço:* ${dadosAgendamento.servico}
👤 *Cliente:* ${dadosAgendamento.nomeCliente}
📍 *Endereço:* ${dadosAgendamento.enderecoCliente}
📞 *Contato:* ${dadosAgendamento.telefoneCliente}
💰 *Valor:* ${appState.valor > 0 ? `R$ ${appState.valor.toFixed(2)}` : 'Sob Análise'}
🗓️ *Data:* ${dadosAgendamento.dataAgendamento}
⏰ *Hora:* ${dadosAgendamento.horaAgendamento}
💳 *Pagamento:* ${dadosAgendamento.formaPagamento}
📝 *Observações:* ${dadosAgendamento.observacoes}`;
    const urlWhatsApp = `https://wa.me/${seuWhatsApp}?text=${encodeURIComponent(mensagemWhatsApp)}`;
    alert("Agendamento salvo com sucesso! Você será redirecionado para o WhatsApp para enviar a confirmação.");
    window.open(urlWhatsApp, "_blank");
    setTimeout(() => window.location.reload(), 500);
  } catch (error) {
    console.error("❌ ERRO CRÍTICO AO SALVAR AGENDAMENTO:", error);
    alert("Houve uma falha ao salvar seu agendamento. Por favor, verifique sua conexão com a internet e tente novamente. Se o erro persistir, contate o suporte.");
    btnAgendarServico.disabled = false;
    btnAgendarServicoSpan.textContent = 'Tentar Novamente';
  }
});
