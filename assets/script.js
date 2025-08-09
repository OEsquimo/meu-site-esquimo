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

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// ================= VARIÁVEIS GLOBAIS =================
const SEU_WHATSAPP = "5581983259341";
const HORARIOS_NORMAIS = ["08:00", "10:00", "13:00", "15:00", "17:00"];
const HORARIOS_SABADO = ["08:00", "10:00", "13:00"]; // Sábado tem menos horários

let dadosOrcamento = {};
let agendamentosCache = {}; // Armazena agendamentos para verificação rápida

// ================= INICIALIZAÇÃO =================
document.addEventListener("DOMContentLoaded", async function() {
  // Carrega agendamentos ao iniciar
  await carregarAgendamentos();

  // Configura máscara do WhatsApp
  const whatsappInput = document.getElementById("whatsapp");
  whatsappInput.addEventListener("input", formatarWhatsApp);

  // Seleção de serviços
  document.querySelectorAll(".servico").forEach(servico => {
    servico.addEventListener("click", selecionarServico);
  });

  // Botão de orçamento
  document.getElementById("enviarBtn").addEventListener("click", enviarOrcamento);
});

// ================= FUNÇÕES PRINCIPAIS =================
async function carregarAgendamentos() {
  try {
    const snapshot = await database.ref('agendamentos').once('value');
    agendamentosCache = {};
    
    if (snapshot.exists()) {
      snapshot.forEach(childSnapshot => {
        const { data, horario } = childSnapshot.val();
        if (!agendamentosCache[data]) agendamentosCache[data] = [];
        agendamentosCache[data].push(horario);
      });
    }
  } catch (error) {
    console.error("Erro ao carregar agendamentos:", error);
  }
}

function formatarWhatsApp(e) {
  let numeros = e.target.value.replace(/\D/g, "").slice(0, 11);
  e.target.value = numeros.length <= 2 ? `(${numeros}` :
                   numeros.length <= 6 ? `(${numeros.slice(0, 2)}) ${numeros.slice(2)}` :
                   `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
}

function selecionarServico() {
  document.querySelectorAll(".servico").forEach(s => s.classList.remove("selecionado"));
  this.classList.add("selecionado");
  document.getElementById("servicoSelecionado").value = this.getAttribute("data-servico");
  atualizarCamposServico(this.getAttribute("data-servico"));
}

function atualizarCamposServico(servico) {
  const mostraBTUs = ["Instalação", "Limpeza Split"].includes(servico);
  const mostraDefeito = servico === "Manutenção";
  
  document.getElementById("campo-btus-wrapper").style.display = mostraBTUs ? "block" : "none";
  document.getElementById("campo-defeito-wrapper").style.display = mostraDefeito ? "block" : "none";
}

function validarFormulario() {
  const campos = [
    { id: "nome", msg: "Informe seu nome" },
    { id: "endereco", msg: "Informe seu endereço" },
    { id: "whatsapp", validador: v => v.replace(/\D/g, "").length === 11, msg: "WhatsApp inválido" }
  ];

  let valido = true;
  campos.forEach(({ id, validador, msg }) => {
    const input = document.getElementById(id);
    const valor = input.value.trim();
    
    if (!valor || (validador && !validador(valor))) {
      input.classList.add("input-error");
      input.placeholder = msg;
      valido = false;
    } else {
      input.classList.remove("input-error");
    }
  });

  return valido;
}

function calcularValor(servico, btus) {
  const precos = {
    "Instalação": { "9000": 500, "12000": 600, "18000": 700, "24000": 800, "30000": 900 },
    "Limpeza Split": { "9000": 180, "12000": 230, "18000": 280, "24000": 330, "30000": 380 },
    "Manutenção": "Orçamento sob análise"
  };
  return servico === "Manutenção" ? precos[servico] : precos[servico][btus] || "";
}

// ================= AGENDAMENTO =================
function configurarAgendamento() {
  document.getElementById("agendamento").style.display = "block";

  flatpickr("#data_agendamento", {
    minDate: "today",
    dateFormat: "d/m/Y",
    locale: "pt",
    disable: [
      date => date.getDay() === 0 || estaDataLotada(formatarData(date)) // Bloqueia domingos e dias lotados
    ],
    onChange: ([date]) => atualizarHorariosDisponiveis(date)
  });
}

function estaDataLotada(dataStr) {
  const horariosDisponiveis = getHorariosDisponiveis(new Date(dataStr.split('/').reverse().join('-')));
  return agendamentosCache[dataStr]?.length === horariosDisponiveis.length;
}

function atualizarHorariosDisponiveis(date) {
  const dataStr = formatarData(date);
  const select = document.getElementById("horario_agendamento");
  const horariosOcupados = agendamentosCache[dataStr] || [];
  const horariosLivres = getHorariosDisponiveis(date).filter(h => !horariosOcupados.includes(h));

  select.innerHTML = horariosLivres.length ? 
    horariosLivres.map(h => `<option value="${h}">${h}</option>`).join('') :
    '<option value="">Nenhum horário disponível</option>';
  
  select.disabled = !horariosLivres.length;
}

function getHorariosDisponiveis(date) {
  return date.getDay() === 6 ? HORARIOS_SABADO : HORARIOS_NORMAIS;
}

function formatarData(date) {
  return [date.getDate(), date.getMonth() + 1, date.getFullYear()]
    .map(n => String(n).padStart(2, '0')).join('/');
}

// ================= CONFIRMAÇÃO DE AGENDAMENTO =================
async function confirmarAgendamento() {
  const btn = document.getElementById("btn_confirmar_agendamento");
  const btnOriginalHTML = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="loader"></span> Agendando...';

  try {
    const dados = {
      ...dadosOrcamento,
      data: document.getElementById("data_agendamento").value,
      horario: document.getElementById("horario_agendamento").value,
      formaPagamento: document.getElementById("forma_pagamento").value,
      observacoes: document.getElementById("obs_cliente").value,
      timestamp: new Date().toISOString()
    };

    if (!await verificarDisponibilidade(dados.data, dados.horario)) {
      throw new Error("Horário indisponível. Atualize a página e tente novamente.");
    }

    await database.ref('agendamentos').push().set(dados);
    enviarWhatsApp(dados);
    alert("Agendamento confirmado!");
    resetarFormulario();

  } catch (error) {
    console.error("Erro:", error);
    alert(error.message || "Erro ao agendar. Tente novamente.");
  } finally {
    btn.disabled = false;
    btn.innerHTML = btnOriginalHTML;
  }
}

async function verificarDisponibilidade(data, horario) {
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
}

function enviarWhatsApp(dados) {
  const mensagem = `✅ AGENDAMENTO CONFIRMADO ✅\n\n` +
    `🛠️ Serviço: ${dados.servico}\n` +
    `👤 Nome: ${dados.nome}\n` +
    `📍 Endereço: ${dados.endereco}\n` +
    `📱 WhatsApp: ${dados.whatsapp}\n` +
    `💰 Valor: R$ ${dados.valor}\n` +
    `📅 Data: ${dados.data}\n` +
    `⏰ Hora: ${dados.horario}\n` +
    `💳 Pagamento: ${dados.formaPagamento}\n` +
    `📝 Observações: ${dados.observacoes || "Nenhuma"}`;
  
  window.open(`https://wa.me/${SEU_WHATSAPP}?text=${encodeURIComponent(mensagem)}`, "_blank");
}

function resetarFormulario() {
  document.getElementById("formulario").reset();
  document.getElementById("agendamento").style.display = "none";
  document.querySelectorAll(".servico").forEach(s => s.classList.remove("selecionado"));
}
