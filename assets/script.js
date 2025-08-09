// ================= CONFIGURAÇÃO FIREBASE =================
const firebaseConfig = {
  apiKey: "AIzaSyCFf5gckKE6rg7MFuBYAO84aV-sNrdY2JQ",
  authDomain: "agendamento-esquimo.firebaseapp.com",
  databaseURL: "https://agendamento-esquimo-default-rtdb.firebaseio.com",
  projectId: "agendamento-esquimo",
  storageBucket: "agendamento-esquimo.appspot.com",
  messagingSenderId: "348946727206",
  appId: "1:348946727206:web:f5989788f13c259be0c1e7"
};

// Inicialização segura
try {
  firebase.initializeApp(firebaseConfig);
  console.log("Firebase OK");
} catch (error) {
  console.error("Erro Firebase:", error);
}

const database = firebase.database();
const SEU_WHATSAPP = "5581983259341";
let dadosOrcamento = {};
let agendamentos = {};

// ================= INICIALIZAÇÃO =================
document.addEventListener("DOMContentLoaded", async function() {
  await carregarAgendamentos();
  iniciarEventos();
});

// ================= FUNÇÕES PRINCIPAIS =================
async function carregarAgendamentos() {
  try {
    const snapshot = await database.ref('agendamentos').once('value');
    agendamentos = {};
    if (snapshot.exists()) {
      snapshot.forEach(child => {
        const { data, horario } = child.val();
        if (!agendamentos[data]) agendamentos[data] = [];
        agendamentos[data].push(horario);
      });
    }
  } catch (error) {
    console.error("Erro ao carregar agendamentos:", error);
  }
}

function iniciarEventos() {
  // Máscara WhatsApp
  document.getElementById("whatsapp").addEventListener("input", function(e) {
    let nums = e.target.value.replace(/\D/g, "").slice(0, 11);
    e.target.value = !nums ? "" : 
      nums.length <= 2 ? `(${nums}` :
      nums.length <= 6 ? `(${nums.slice(0,2)}) ${nums.slice(2)}` :
      `(${nums.slice(0,2)}) ${nums.slice(2,7)}-${nums.slice(7)}`;
  });

  // Seleção de serviço - CORREÇÃO DO FOCO
  document.querySelectorAll(".servico").forEach(servico => {
    servico.addEventListener("click", function() {
      document.querySelectorAll(".servico").forEach(s => s.classList.remove("selecionado"));
      this.classList.add("selecionado");
      document.getElementById("servicoSelecionado").value = this.dataset.servico;
      atualizarCamposServico(this.dataset.servico);
      
      // CORREÇÃO: Foco automático no campo Nome
      document.getElementById("nome").focus();
      
      // Atualiza orçamento
      gerarRelatorio();
    });
  });

  // Botão Gerar Orçamento - CORREÇÃO
  document.getElementById("enviarBtn").addEventListener("click", function() {
    if (validarFormulario()) {
      const mensagem = gerarRelatorio();
      if (mensagem) {
        window.open(`https://wa.me/${SEU_WHATSAPP}?text=${encodeURIComponent(mensagem)}`, "_blank");
      }
    }
  });

  // Botão Confirmar Agendamento
  document.getElementById("btn_confirmar_agendamento").addEventListener("click", confirmarAgendamento);

  // Calendário
  flatpickr("#data_agendamento", {
    minDate: "today",
    dateFormat: "d/m/Y",
    locale: "pt",
    disable: [
      date => date.getDay() === 0 || estaLotado(formatarData(date))
    ],
    onChange: ([date]) => atualizarHorarios(date)
  });
}

// ================= FUNÇÕES DE FORMULÁRIO =================
function atualizarCamposServico(servico) {
  const mostraBTU = ["Instalação", "Limpeza Split"].includes(servico);
  const mostraDefeito = servico === "Manutenção";
  
  document.getElementById("campo-btus-wrapper").style.display = mostraBTU ? "block" : "none";
  document.getElementById("campo-defeito-wrapper").style.display = mostraDefeito ? "block" : "none";
}

function validarFormulario() {
  let valido = true;
  const campos = [
    { id: "nome", msg: "Informe seu nome" },
    { id: "endereco", msg: "Informe seu endereço" },
    { id: "whatsapp", validador: v => v.replace(/\D/g, "").length === 11, msg: "WhatsApp inválido" },
    { id: "btus", condicao: () => ["Instalação", "Limpeza Split"].includes(document.getElementById("servicoSelecionado").value), msg: "Selecione BTUs" },
    { id: "defeito", condicao: () => document.getElementById("servicoSelecionado").value === "Manutenção", msg: "Descreva o defeito" }
  ];

  campos.forEach(({ id, condicao, validador, msg }) => {
    const input = document.getElementById(id);
    const valor = input.value.trim();
    
    if ((condicao && condicao()) && !valor) {
      input.classList.add("input-error");
      input.placeholder = msg;
      valido = false;
    } else if (validador && !validador(valor)) {
      input.classList.add("input-error");
      input.placeholder = msg;
      valido = false;
    } else {
      input.classList.remove("input-error");
    }
  });

  return valido;
}

// ================= GERAÇÃO DE ORÇAMENTO (CORRIGIDA) =================
function gerarRelatorio() {
  if (!validarFormulario()) {
    document.getElementById("relatorio").innerText = "";
    return null;
  }

  const nome = document.getElementById("nome").value.trim();
  const endereco = document.getElementById("endereco").value.trim();
  const whatsapp = document.getElementById("whatsapp").value.trim();
  const servico = document.getElementById("servicoSelecionado").value;
  const btus = document.getElementById("btus").value;
  const defeito = document.getElementById("defeito").value.trim();

  let valor = calcularValor(servico, btus);
  if (servico === "Manutenção") valor = "Orçamento sob análise";

  let texto = `*ORÇAMENTO*\n\n` +
    `👤 Nome: ${nome}\n` +
    `📍 Endereço: ${endereco}\n` +
    `📱 WhatsApp: ${whatsapp}\n` +
    `🛠️ Serviço: ${servico}\n` +
    `${servico !== "Manutenção" ? `❄️ BTUs: ${btus}\n` : ""}` +
    `💰 Valor: R$ ${valor}\n` +
    `${servico === "Manutenção" ? `🔧 Defeito: ${defeito}\n` : ""}` +
    `\nEnvie esta mensagem para confirmar.`;

  document.getElementById("relatorio").innerText = texto;
  return texto;
}

function calcularValor(servico, btus) {
  const precos = {
    "Instalação": { "9000": 500, "12000": 600, "18000": 700, "24000": 800, "30000": 900 },
    "Limpeza Split": { "9000": 180, "12000": 230, "18000": 280, "24000": 330, "30000": 380 }
  };
  return servico === "Manutenção" ? "Orçamento sob análise" : precos[servico][btus] || "";
}

// ================= CONTROLE DE AGENDAMENTO =================
function formatarData(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}`;
}

function estaLotado(data) {
  const date = new Date(data.split("/").reverse().join("-"));
  const horarios = date.getDay() === 6 ? ["08:00","10:00","13:00"] : ["08:00","10:00","13:00","15:00","17:00"];
  return agendamentos[data]?.length === horarios.length;
}

function atualizarHorarios(date) {
  const dataStr = formatarData(date);
  const select = document.getElementById("horario_agendamento");
  const horarios = date.getDay() === 6 ? ["08:00","10:00","13:00"] : ["08:00","10:00","13:00","15:00","17:00"];
  const ocupados = agendamentos[dataStr] || [];
  
  select.innerHTML = "";
  horarios.forEach(h => {
    if (!ocupados.includes(h)) {
      select.innerHTML += `<option value="${h}">${h}</option>`;
    }
  });
  
  select.disabled = !select.innerHTML;
}

async function confirmarAgendamento() {
  const btn = document.getElementById("btn_confirmar_agendamento");
  const originalHTML = btn.innerHTML;
  
  try {
    btn.disabled = true;
    btn.innerHTML = '<span class="loader"></span> Agendando...';
    
    const agendamento = {
      ...dadosOrcamento,
      data: document.getElementById("data_agendamento").value,
      horario: document.getElementById("horario_agendamento").value,
      formaPagamento: document.getElementById("forma_pagamento").value,
      observacoes: document.getElementById("obs_cliente").value,
      timestamp: new Date().toISOString()
    };

    // Verificação final
    const disponivel = await verificarDisponibilidade(agendamento.data, agendamento.horario);
    if (!disponivel) throw new Error("Horário indisponível");

    // Salva no Firebase
    await database.ref('agendamentos').push().set(agendamento);
    
    // Atualiza cache
    if (!agendamentos[agendamento.data]) agendamentos[agendamento.data] = [];
    agendamentos[agendamento.data].push(agendamento.horario);
    
    // Envia WhatsApp
    window.open(`https://wa.me/${SEU_WHATSAPP}?text=${encodeURIComponent(formatarMensagem(agendamento))}`, "_blank");
    
    alert("Agendamento confirmado!");
    resetarFormulario();
    
  } catch (error) {
    console.error("Erro:", error);
    alert(error.message || "Erro ao agendar");
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalHTML;
  }
}

async function verificarDisponibilidade(data, horario) {
  try {
    const snapshot = await database.ref('agendamentos')
      .orderByChild('data')
      .equalTo(data)
      .once('value');
    
    if (!snapshot.exists()) return true;
    
    let disponivel = true;
    snapshot.forEach(child => {
      if (child.val().horario === horario) disponivel = false;
    });
    return disponivel;
    
  } catch (error) {
    console.error("Erro verificação:", error);
    return false;
  }
}

function formatarMensagem(dados) {
  return `✅ AGENDAMENTO CONFIRMADO\n\n` +
    `🛠️ Serviço: ${dados.servico}\n` +
    `👤 Nome: ${dados.nome}\n` +
    `📍 Endereço: ${dados.endereco}\n` +
    `📱 WhatsApp: ${dados.whatsapp}\n` +
    `💰 Valor: R$ ${dados.valor}\n` +
    `📅 Data: ${dados.data}\n` +
    `⏰ Hora: ${dados.horario}\n` +
    `💳 Pagamento: ${dados.formaPagamento}\n` +
    `📝 Observações: ${dados.observacoes || "Nenhuma"}`;
}

function resetarFormulario() {
  document.getElementById("formulario").reset();
  document.getElementById("agendamento").style.display = "none";
  document.querySelectorAll(".servico").forEach(s => s.classList.remove("selecionado"));
}
