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

// Inicialização do Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const SEU_WHATSAPP = "5581983259341";

// ================= VARIÁVEIS GLOBAIS =================
let dadosOrcamento = {};

// ================= FUNÇÕES PRINCIPAIS =================
document.addEventListener("DOMContentLoaded", function() {
  // Elementos do DOM
  const servicos = document.querySelectorAll(".servico");
  const servicoSelecionadoInput = document.getElementById("servicoSelecionado");
  const form = document.getElementById("formulario");
  const enviarBtn = document.getElementById("enviarBtn");
  const relatorioDiv = document.getElementById("relatorio");
  const nomeInput = document.getElementById("nome");
  const enderecoInput = document.getElementById("endereco");
  const whatsappInput = document.getElementById("whatsapp");
  const btusSelect = document.getElementById("btus");
  const defeitoTextarea = document.getElementById("defeito");
  const campoBtusWrapper = document.getElementById("campo-btus-wrapper");
  const campoDefeitoWrapper = document.getElementById("campo-defeito-wrapper");

  // Máscara do WhatsApp
  whatsappInput.addEventListener("input", function() {
    let numeros = this.value.replace(/\D/g, "").slice(0, 11);
    if (numeros.length === 0) {
      this.value = "";
    } else if (numeros.length <= 2) {
      this.value = `(${numeros}`;
    } else if (numeros.length <= 6) {
      this.value = `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    } else {
      this.value = `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
    }
  });

  // Seleção de serviço
  servicos.forEach(servico => {
    servico.addEventListener("click", function() {
      servicos.forEach(s => s.classList.remove("selecionado"));
      this.classList.add("selecionado");
      servicoSelecionadoInput.value = this.getAttribute("data-servico");
      atualizarCamposPorServico(this.getAttribute("data-servico"));
      
      // Foco no campo Nome (CORREÇÃO)
      nomeInput.focus();
      
      // Atualiza orçamento
      gerarRelatorio();
    });
  });

  // Validação em tempo real
  form.addEventListener("input", function() {
    gerarRelatorio();
  });

  // Botão Gerar Orçamento
  enviarBtn.addEventListener("click", function() {
    if (validarFormulario()) {
      const mensagem = gerarRelatorio();
      if (mensagem) {
        window.open(`https://wa.me/${SEU_WHATSAPP}?text=${encodeURIComponent(mensagem)}`, "_blank");
      }
    }
  });

  // Calendário (sem bloqueio de dias)
  flatpickr("#data_agendamento", {
    minDate: "today",
    dateFormat: "d/m/Y",
    locale: "pt"
  });

  // Botão Confirmar Agendamento
  document.getElementById("btn_confirmar_agendamento").addEventListener("click", confirmarAgendamento);
});

function atualizarCamposPorServico(servico) {
  if (servico === "Instalação" || servico === "Limpeza Split") {
    campoBtusWrapper.style.display = "block";
    campoDefeitoWrapper.style.display = "none";
  } else if (servico === "Manutenção") {
    campoBtusWrapper.style.display = "none";
    campoDefeitoWrapper.style.display = "block";
  } else {
    campoBtusWrapper.style.display = "none";
    campoDefeitoWrapper.style.display = "none";
  }
}

function validarFormulario() {
  let isValid = true;
  const servico = document.getElementById("servicoSelecionado").value;

  // Valida campos obrigatórios
  ["nome", "endereco", "whatsapp"].forEach(id => {
    const campo = document.getElementById(id);
    if (!campo.value.trim()) {
      campo.classList.add("input-error");
      isValid = false;
    } else {
      campo.classList.remove("input-error");
    }
  });

  // Validação específica por serviço
  if (servico === "Instalação" || servico === "Limpeza Split") {
    if (!document.getElementById("btus").value) {
      document.getElementById("btus").classList.add("input-error");
      isValid = false;
    }
  } else if (servico === "Manutenção") {
    if (!document.getElementById("defeito").value.trim()) {
      document.getElementById("defeito").classList.add("input-error");
      isValid = false;
    }
  }

  return isValid;
}

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

  // Cálculo do valor
  const precos = {
    "Instalação": { "9000": 500, "12000": 600, "18000": 700, "24000": 800, "30000": 900 },
    "Limpeza Split": { "9000": 180, "12000": 230, "18000": 280, "24000": 330, "30000": 380 }
  };

  let valor = servico === "Manutenção" ? "Orçamento sob análise" : precos[servico][btus] || "";

  // Formata a mensagem
  let texto = `*ORÇAMENTO*\n\n` +
    `👤 Nome: ${nome}\n` +
    `📍 Endereço: ${endereco}\n` +
    `📱 WhatsApp: ${whatsapp}\n` +
    `🛠️ Serviço: ${servico}\n`;

  if (servico !== "Manutenção") {
    texto += `❄️ BTUs: ${btus}\n`;
  }

  texto += `💰 Valor: R$ ${valor}\n`;

  if (servico === "Manutenção") {
    texto += `🔧 Defeito: ${defeito}\n`;
  }

  document.getElementById("relatorio").innerText = texto;
  return texto;
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

    // Salva no Firebase
    await database.ref('agendamentos').push().set(agendamento);
    
    // Envia para WhatsApp
    const mensagem = `✅ AGENDAMENTO CONFIRMADO\n\n` +
      `🛠️ Serviço: ${agendamento.servico}\n` +
      `👤 Nome: ${agendamento.nome}\n` +
      `📍 Endereço: ${agendamento.endereco}\n` +
      `📱 WhatsApp: ${agendamento.whatsapp}\n` +
      `💰 Valor: R$ ${agendamento.valor}\n` +
      `📅 Data: ${agendamento.data}\n` +
      `⏰ Hora: ${agendamento.horario}\n` +
      `💳 Pagamento: ${agendamento.formaPagamento}\n` +
      `📝 Observações: ${agendamento.observacoes || "Nenhuma"}`;

    window.open(`https://wa.me/${SEU_WHATSAPP}?text=${encodeURIComponent(mensagem)}`, "_blank");
    
    // Feedback e reset
    alert("Agendamento confirmado com sucesso!");
    document.getElementById("agendamento").style.display = "none";
    
  } catch (error) {
    console.error("Erro ao agendar:", error);
    alert("Ocorreu um erro ao agendar. Por favor, tente novamente.");
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalHTML;
  }
}
