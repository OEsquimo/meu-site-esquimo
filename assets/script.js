// ================= CONFIGURAÇÃO DO FIREBASE =================
const firebaseConfig = {
  apiKey: "AIzaSyCFf5gckKE6rg7MFuBYAO84aV-sNrdY2JQ",
  authDomain: "agendamento-esquimo.firebaseapp.com",
  databaseURL: "https://agendamento-esquimo-default-rtdb.firebaseio.com",
  projectId: "agendamento-esquimo",
  storageBucket: "agendamento-esquimo.appspot.com",
  messagingSenderId: "348946727206",
  appId: "1:348946727206:web:f5989788f13c259be0c1e7"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// ================= VARIÁVEIS GLOBAIS =================
const seuWhatsApp = "5581983259341";
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

  // Máscara para o campo WhatsApp
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

  // Seleção do serviço
  servicos.forEach(servico => {
    servico.addEventListener("click", function() {
      servicos.forEach(s => s.classList.remove("selecionado"));
      this.classList.add("selecionado");

      const servicoEscolhido = this.getAttribute("data-servico");
      servicoSelecionadoInput.value = servicoEscolhido;
      atualizarCamposPorServico(servicoEscolhido);
      nomeInput.focus();
      validarFormulario();
    });
  });

  // Atualiza campos com base no serviço selecionado
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

  // Validação do formulário
  function validarFormulario() {
    let isValid = true;

    if (nomeInput.value.trim() === "") {
      mostrarErroInput(nomeInput, "Informe seu nome");
      isValid = false;
    } else {
      limparErroInput(nomeInput, "Digite seu nome");
    }

    if (enderecoInput.value.trim() === "") {
      mostrarErroInput(enderecoInput, "Informe seu endereço");
      isValid = false;
    } else {
      limparErroInput(enderecoInput, "Digite seu endereço");
    }

    const numeroWhatsApp = whatsappInput.value.replace(/\D/g, "");
    if (!/^\d{11}$/.test(numeroWhatsApp)) {
      mostrarErroInput(whatsappInput, "DDD e número válidos");
      isValid = false;
    } else {
      limparErroInput(whatsappInput, "(xx) xxxxx-xxxx");
    }

    if (servicoSelecionadoInput.value === "") {
      alert("Por favor, selecione um serviço clicando na imagem.");
      isValid = false;
    }

    if (servicoSelecionadoInput.value === "Instalação" || servicoSelecionadoInput.value === "Limpeza Split") {
      if (btusSelect.value === "") {
        mostrarErroInput(btusSelect, "Selecione BTU");
        isValid = false;
      } else {
        limparErroInput(btusSelect, "");
      }
    } else if (servicoSelecionadoInput.value === "Manutenção") {
      if (defeitoTextarea.value.trim() === "") {
        mostrarErroInput(defeitoTextarea, "Descreva o defeito");
        isValid = false;
      } else {
        limparErroInput(defeitoTextarea, "Descreva o defeito aqui...");
      }
    }

    enviarBtn.disabled = !isValid;
    return isValid;
  }

  // Mostra/oculta erros nos inputs
  function mostrarErroInput(input, mensagem) {
    input.classList.add("input-error");
    input.placeholder = mensagem;
  }

  function limparErroInput(input, placeholder) {
    input.classList.remove("input-error");
    input.placeholder = placeholder;
  }

  // Preços dos serviços
  const precoInstalacao = { "9000": 500, "12000": 600, "18000": 700, "24000": 800, "30000": 900 };
  const precoLimpezaSplit = { "9000": 180, "12000": 230, "18000": 280, "24000": 330, "30000": 380 };

  // Cálculo do valor do serviço
  function calcularValor(servico, btus) {
    if (servico === "Instalação") return precoInstalacao[btus] ?? "";
    if (servico === "Limpeza Split") return precoLimpezaSplit[btus] ?? "";
    if (servico === "Manutenção") return "Orçamento sob análise";
    return "";
  }

  // Geração do relatório/orçamento
  function gerarRelatorio() {
    if (!validarFormulario()) {
      relatorioDiv.innerText = "";
      return null;
    }

    const nome = nomeInput.value.trim();
    const endereco = enderecoInput.value.trim();
    const whatsappCliente = whatsappInput.value.trim();
    const servico = servicoSelecionadoInput.value;
    const btus = btusSelect.value.trim();
    const defeito = defeitoTextarea.value.trim();
    const valorOrcamento = calcularValor(servico, btus);

    // Armazena os dados para o agendamento
    dadosOrcamento = {
      nome,
      endereco,
      whatsapp: whatsappCliente,
      servico,
      valor: valorOrcamento,
      defeito: defeito || null
    };

    let textoRelatorio = `*ORÇAMENTO*
👤 Nome: ${nome}
📍 Endereço: ${endereco}
📱 WhatsApp: ${whatsappCliente}
🛠️ Serviço: ${servico}
❄️ BTUs: ${btus || "N/A"}
💰 Valor do Orçamento: R$ ${valorOrcamento}`;

    if (servico === "Manutenção") {
      textoRelatorio += `
🔧 Defeito: ${defeito}`;
    }

    relatorioDiv.innerText = textoRelatorio;
    configurarAgendamento(); // Mostra a seção de agendamento

    return textoRelatorio;
  }

  // Evento de input para atualização em tempo real
  form.addEventListener("input", () => {
    gerarRelatorio();
  });

  // Botão de enviar orçamento
  enviarBtn.addEventListener("click", () => {
    if (!validarFormulario()) {
      if (nomeInput.classList.contains("input-error")) nomeInput.focus();
      else if (enderecoInput.classList.contains("input-error")) enderecoInput.focus();
      else if (whatsappInput.classList.contains("input-error")) whatsappInput.focus();
      else if (btusSelect.classList.contains("input-error")) btusSelect.focus();
      else if (defeitoTextarea.classList.contains("input-error")) defeitoTextarea.focus();
      return;
    }

    const mensagem = gerarRelatorio();
    if (mensagem) {
      const url = `https://wa.me/${seuWhatsApp}?text=${encodeURIComponent(mensagem)}`;
      window.open(url, "_blank");
    }
  });
});

// ================= FUNÇÕES DE AGENDAMENTO CORRIGIDAS =================
function configurarAgendamento() {
  const agendamentoSection = document.getElementById('agendamento');
  agendamentoSection.style.display = 'block';
  
  // Configuração do calendário
  flatpickr("#data_agendamento", {
    minDate: "today",
    dateFormat: "d/m/Y",
    locale: "pt",
    disable: [
      function(date) {
        // Desabilita domingos (0 = domingo, 6 = sábado)
        return (date.getDay() === 0);
      }
    ],
    onChange: function(selectedDates) {
      const date = selectedDates[0];
      const horariosDisponiveis = gerarHorariosDisponiveis(date);
      const select = document.getElementById('horario_agendamento');
      
      select.innerHTML = '';
      select.disabled = false;
      
      if (horariosDisponiveis.length > 0) {
        horariosDisponiveis.forEach(h => {
          select.innerHTML += `<option value="${h}">${h}</option>`;
        });
      } else {
        select.innerHTML = '<option value="">Nenhum horário disponível nesta data</option>';
        select.disabled = true;
      }
    }
  });

  // Botão de confirmação - VERSÃO CORRIGIDA
  const btnAgendamento = document.getElementById('btn_confirmar_agendamento');
  btnAgendamento.addEventListener('click', async function() {
    if (!validarAgendamento()) return;
    
    const btn = this;
    const btnOriginalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="loader"></span> Agendando...';

    try {
      const dadosAgendamento = {
        ...dadosOrcamento,
        data: document.getElementById('data_agendamento').value,
        horario: document.getElementById('horario_agendamento').value,
        formaPagamento: document.getElementById('forma_pagamento').value,
        observacoes: document.getElementById('obs_cliente').value,
        timestamp: new Date().toISOString()
      };

      // 1. Verifica disponibilidade
      const disponivel = await verificarDisponibilidade(dadosAgendamento.data, dadosAgendamento.horario);
      if (!disponivel) {
        throw new Error("Este horário já está reservado. Por favor, escolha outro.");
      }

      // 2. Salva no Firebase
      await database.ref('agendamentos').push().set(dadosAgendamento);
      
      // 3. Envia para WhatsApp
      enviarWhatsApp(dadosAgendamento);
      
      // 4. Feedback e reset
      alert("Agendamento confirmado com sucesso!");
      resetarFormularioAgendamento();

    } catch (error) {
      console.error("Erro no agendamento:", error);
      alert(error.message || "Erro ao confirmar agendamento. Tente novamente.");
    } finally {
      // Restaura o botão independente do resultado
      btn.disabled = false;
      btn.innerHTML = btnOriginalHTML;
    }
  });
}

// Função para resetar o formulário de agendamento
function resetarFormularioAgendamento() {
  document.getElementById('data_agendamento').value = '';
  document.getElementById('horario_agendamento').innerHTML = '<option value="">Selecione primeiro a data</option>';
  document.getElementById('horario_agendamento').disabled = true;
  document.getElementById('forma_pagamento').value = '';
  document.getElementById('obs_cliente').value = '';
  document.getElementById('agendamento').style.display = 'none';
}

// Verifica disponibilidade no Firebase
async function verificarDisponibilidade(data, horario) {
  try {
    const snapshot = await database.ref('agendamentos')
      .orderByChild('data')
      .equalTo(data)
      .once('value');
    
    if (!snapshot.exists()) return true;
    
    const agendamentos = snapshot.val();
    for (const key in agendamentos) {
      if (agendamentos[key].horario === horario) {
        return false;
      }
    }
    return true;
    
  } catch (error) {
    console.error("Erro ao verificar disponibilidade:", error);
    throw new Error("Erro ao verificar horários disponíveis");
  }
}

// Gera horários disponíveis
function gerarHorariosDisponiveis(date) {
  const todosHorarios = ["08:00", "10:00", "13:00", "15:00", "17:00"];
  
  // Limita horários no sábado
  if (date.getDay() === 6) {
    return todosHorarios.slice(0, 3); // Até 13:00 no sábado
  }
  
  return todosHorarios;
}

// Envia mensagem para o WhatsApp
function enviarWhatsApp(dados) {
  const mensagem = `✅ NOVO AGENDAMENTO CONFIRMADO ✅

🛠️ *Serviço:* ${dados.servico}
👤 *Nome:* ${dados.nome}
📍 *Endereço:* ${dados.endereco}
📱 *WhatsApp:* ${dados.whatsapp}
💰 *Valor:* R$ ${dados.valor}
📅 *Data:* ${dados.data}
⏰ *Hora:* ${dados.horario}
💳 *Pagamento:* ${dados.formaPagamento}
📝 *Observações:* ${dados.observacoes || "Nenhuma"}

_Agendamento realizado em ${new Date().toLocaleDateString('pt-BR')}_`;

  const url = `https://wa.me/${seuWhatsApp}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');
}

// Validação do formulário de agendamento
function validarAgendamento() {
  const campos = [
    {id: 'data_agendamento', msg: 'Selecione uma data'},
    {id: 'horario_agendamento', msg: 'Selecione um horário'},
    {id: 'forma_pagamento', msg: 'Selecione a forma de pagamento'}
  ];

  for (const campo of campos) {
    const elemento = document.getElementById(campo.id);
    if (!elemento.value || elemento.value === "") {
      alert(campo.msg);
      elemento.focus();
      return false;
    }
  }
  return true;
}
