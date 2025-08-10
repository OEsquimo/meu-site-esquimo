/**
 * @file script.js
 * @description Lógica completa para o sistema de agendamento de serviços.
 * @version 1.1
 */

document.addEventListener("DOMContentLoaded", () => {
  // =================================================================================
  // 1. CONFIGURAÇÃO DO FIREBASE
  //    Cole aqui as credenciais do seu projeto Firebase.
  // =================================================================================
  const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_AUTH_DOMAIN",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_STORAGE_BUCKET",
    messagingSenderId: "SEU_MESSAGING_SENDER_ID",
    appId: "SEU_APP_ID"
  };

  // Inicializa o Firebase e o Firestore
  try {
    firebase.initializeApp(firebaseConfig);
  } catch (e) {
    console.error("Erro ao inicializar o Firebase. Verifique suas credenciais.", e);
    alert("Erro de configuração do sistema. Contate o suporte.");
  }
  const db = firebase.firestore();
  const seuWhatsApp = "5581983259341"; // Número para onde a mensagem será enviada

  // =================================================================================
  // 2. MAPEAMENTO DOS ELEMENTOS DO DOM (HTML)
  // =================================================================================
  const form = document.getElementById("formulario");
  const servicos = document.querySelectorAll(".servico");
  const servicoSelecionadoInput = document.getElementById("servicoSelecionado");

  // Seções do formulário
  const dadosClienteSection = document.getElementById("dados-cliente");
  const orcamentoSection = document.getElementById("orcamento-wrapper");
  const agendamentoSection = document.getElementById("agendamento-wrapper");

  // Campos de dados do cliente
  const nomeInput = document.getElementById("nome");
  const enderecoInput = document.getElementById("endereco");
  const whatsappInput = document.getElementById("whatsapp");
  const btusSelect = document.getElementById("btus");
  const defeitoTextarea = document.getElementById("defeito");
  const campoBtusWrapper = document.getElementById("campo-btus-wrapper");
  const campoDefeitoWrapper = document.getElementById("campo-defeito-wrapper");

  // Campos de agendamento
  const dataAgendamentoInput = document.getElementById("data_agendamento");
  const horarioAgendamentoSelect = document.getElementById("horario_agendamento");
  const formaPagamentoSelect = document.getElementById("forma_pagamento");
  const obsClienteTextarea = document.getElementById("obs_cliente");

  // Elementos de exibição e botões
  const relatorioOrcamentoDiv = document.getElementById("relatorio-orcamento");
  const btnAgendarServico = document.getElementById("btn_agendar_servico");

  // =================================================================================
  // 3. ESTADO DA APLICAÇÃO E VALORES
  //    Armazena dados importantes durante o uso do sistema.
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
    if (value.length > 2) {
      value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
    }
    if (value.length > 9) {
      value = `${value.substring(0, 9)}-${value.substring(9)}`;
    }
    e.target.value = value;
  });

  // Função para mostrar/ocultar erros nos campos
  const toggleInputError = (input, hasError) => {
    input.classList.toggle("input-error", hasError);
  };

  // Calcula o valor do orçamento com base no serviço e BTUs
  const calcularValorOrcamento = () => {
    const servico = servicoSelecionadoInput.value;
    const btus = btusSelect.value;

    if (servico === "Instalação") return precos.instalacao[btus] || 0;
    if (servico === "Limpeza Split") return precos.limpeza[btus] || 0;
    if (servico === "Reparo") return precos.reparo;
    return 0;
  };

  // Gera o texto do orçamento para exibição
  const gerarTextoOrcamento = () => {
    const valor = calcularValorOrcamento();
    appState.valor = valor; // Armazena o valor no estado

    if (valor > 0) {
      return `<strong>Valor do Serviço:</strong> R$ ${valor.toFixed(2)}`;
    }
    if (servicoSelecionadoInput.value === "Reparo") {
      return `<strong>Valor do Serviço:</strong> Sob Análise (visita técnica)`;
    }
    return "";
  };

  // =================================================================================
  // 5. LÓGICA PRINCIPAL E FLUXO DO SISTEMA
  // =================================================================================

  // Passo 1: Cliente escolhe o serviço
  servicos.forEach(servicoDiv => {
    servicoDiv.addEventListener("click", () => {
      servicos.forEach(s => s.classList.remove("selecionado"));
      servicoDiv.classList.add("selecionado");

      const servicoEscolhido = servicoDiv.dataset.servico;
      servicoSelecionadoInput.value = servicoEscolhido;
      appState.servico = servicoEscolhido;

      // Mostra os campos de dados do cliente
      dadosClienteSection.style.display = "block";
      
      // Ajusta os campos visíveis conforme o serviço
      campoBtusWrapper.style.display = (servicoEscolhido === "Instalação" || servicoEscolhido === "Limpeza Split") ? "block" : "none";
      campoDefeitoWrapper.style.display = servicoEscolhido === "Reparo" ? "block" : "none";
      
      // Limpa campos não utilizados
      btusSelect.value = (servicoEscolhido !== "Instalação" && servicoEscolhido !== "Limpeza Split") ? "" : btusSelect.value;
      defeitoTextarea.value = servicoEscolhido !== "Reparo" ? "" : defeitoTextarea.value;

      // Rola a tela e foca no primeiro campo
      nomeInput.scrollIntoView({ behavior: "smooth", block: "center" });
      nomeInput.focus();
      
      validarFormularioCompleto();
    });
  });

  // Valida o formulário em tempo real
  form.addEventListener("input", validarFormularioCompleto);

  function validarFormularioCompleto() {
    // Validação dos dados do cliente
    const nomeValido = nomeInput.value.trim().length > 2;
    const enderecoValido = enderecoInput.value.trim().length > 5;
    const whatsappValido = whatsappInput.value.replace(/\D/g, "").length === 11;
    
    toggleInputError(nomeInput, !nomeValido && nomeInput.value.length > 0);
    toggleInputError(enderecoInput, !enderecoValido && enderecoInput.value.length > 0);
    toggleInputError(whatsappInput, !whatsappValido && whatsappInput.value.length > 0);

    let servicoValido = false;
    if (appState.servico === "Instalação" || appState.servico === "Limpeza Split") {
      servicoValido = btusSelect.value !== "";
      toggleInputError(btusSelect, !servicoValido && btusSelect.selectedIndex > 0);
    } else if (appState.servico === "Reparo") {
      servicoValido = defeitoTextarea.value.trim().length > 10;
      toggleInputError(defeitoTextarea, !servicoValido && defeitoTextarea.value.length > 0);
    }

    const dadosClientePreenchidos = nomeValido && enderecoValido && whatsappValido && servicoValido;

    // Exibe/oculta as próximas seções
    orcamentoSection.style.display = dadosClientePreenchidos ? "block" : "none";
    agendamentoSection.style.display = dadosClientePreenchidos ? "block" : "none";

    if (dadosClientePreenchidos) {
      relatorioOrcamentoDiv.innerHTML = gerarTextoOrcamento();
    } else {
      relatorioOrcamentoDiv.innerHTML = "";
    }

    // Validação dos dados de agendamento
    const dataValida = dataAgendamentoInput.value !== "";
    const horarioValido = horarioAgendamentoSelect.value !== "";
    const pagamentoValido = formaPagamentoSelect.value !== "";

    // Habilita o botão final apenas se tudo estiver válido
    const formularioTotalmenteValido = dadosClientePreenchidos && dataValida && horarioValido && pagamentoValido;
    btnAgendarServico.disabled = !formularioTotalmenteValido;
  }

  // =================================================================================
  // 6. LÓGICA DE AGENDAMENTO (CALENDÁRIO E HORÁRIOS)
  // =================================================================================

  // Busca agendamentos existentes no Firebase para bloquear horários
  const buscarAgendamentos = async () => {
    try {
      const snapshot = await db.collection("agendamentos").get();
      appState.agendamentosExistentes = snapshot.docs.map(doc => doc.data().timestamp);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
    }
  };

  // Inicializa o calendário (Flatpickr)
  const calendario = flatpickr(dataAgendamentoInput, {
    locale: "pt",
    minDate: "today",
    dateFormat: "Y-m-d", // Formato padrão para facilitar comparações
    altInput: true,
    altFormat: "d/m/Y", // Formato que o usuário vê
    disable: [
      // Desabilita domingos
      (date) => date.getDay() === 0
    ],
    onReady: () => {
      buscarAgendamentos().then(() => calendario.redraw()); // Busca os dados quando o calendário está pronto
    },
    onChange: (selectedDates) => {
      if (selectedDates.length > 0) {
        atualizarHorariosDisponiveis(selectedDates[0]);
      }
    }
  });

  // Atualiza os horários disponíveis com base na data e regras de negócio
  function atualizarHorariosDisponiveis(dataSelecionada) {
    horarioAgendamentoSelect.disabled = true;
    horarioAgendamentoSelect.innerHTML = '<option value="">Carregando...</option>';

    const horariosBase = ["08:00", "13:00"]; // Horários de início dos turnos
    const agendamentosDoDia = appState.agendamentosExistentes
      .filter(timestamp => {
        const d = new Date(timestamp);
        return d.toISOString().startsWith(dataSelecionada.toISOString().substring(0, 10));
      })
      .map(timestamp => new Date(timestamp).toTimeString().substring(0, 5));

    const horariosDisponiveis = horariosBase.filter(horario => !agendamentosDoDia.includes(horario));

    if (horariosDisponiveis.length > 0) {
      horarioAgendamentoSelect.innerHTML = '<option value="">Selecione o horário</option>';
      horariosDisponiveis.forEach(h => {
        const option = document.createElement("option");
        option.value = h;
        option.textContent = h;
        horarioAgendamentoSelect.appendChild(option);
      });
      horarioAgendamentoSelect.disabled = false;
    } else {
      horarioAgendamentoSelect.innerHTML = '<option value="">Nenhum horário disponível</option>';
    }
    validarFormularioCompleto();
  }

  // =================================================================================
  // 7. SUBMISSÃO DO FORMULÁRIO (SALVAR NO FIREBASE E ENVIAR WHATSAPP)
  // =================================================================================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (btnAgendarServico.disabled) return;

    btnAgendarServico.disabled = true;
    btnAgendarServico.innerHTML = '<img src="assets/imagens/whatsapp-icon.png" alt="WhatsApp Icon" /> Agendando...';

    // Monta o objeto com todos os dados para salvar
    const dataHoraAgendamento = new Date(`${dataAgendamentoInput.value}T${horarioAgendamentoSelect.value}`);
    
    const dadosAgendamento = {
      servico: appState.servico,
      valor: appState.valor,
      nomeCliente: nomeInput.value.trim(),
      enderecoCliente: enderecoInput.value.trim(),
      telefoneCliente: whatsappInput.value.trim(),
      btus: btusSelect.value || "N/A",
      defeito: defeitoTextarea.value.trim() || "N/A",
      dataAgendamento: dataAgendamentoInput.value,
      horaAgendamento: horarioAgendamentoSelect.value,
      formaPagamento: formaPagamentoSelect.value,
      observacoes: obsClienteTextarea.value.trim() || "Nenhuma",
      timestamp: dataHoraAgendamento.getTime(), // Para facilitar consultas e ordenação
      status: "Agendado"
    };

    try {
      // 1. Salva no Firebase
      await db.collection("agendamentos").add(dadosAgendamento);

      // 2. Formata a mensagem para o WhatsApp
      const mensagemWhatsApp = `✅ *Novo Agendamento Confirmado* ✅

*Serviço:* ${dadosAgendamento.servico}
*Nome:* ${dadosAgendamento.nomeCliente}
*Endereço:* ${dadosAgendamento.enderecoCliente}
*Telefone:* ${dadosAgendamento.telefoneCliente}
*Valor:* ${appState.valor > 0 ? `R$ ${appState.valor.toFixed(2)}` : 'Sob Análise'}
*Data:* ${calendario.altInput.value}
*Hora:* ${dadosAgendamento.horaAgendamento}
*Pagamento:* ${dadosAgendamento.formaPagamento}
*Observações:* ${dadosAgendamento.observacoes}`;

      // 3. Redireciona para o WhatsApp
      const urlWhatsApp = `https://wa.me/${seuWhatsApp}?text=${encodeURIComponent(mensagemWhatsApp)}`;
      window.open(urlWhatsApp, "_blank");

      // Limpa o formulário e reseta o estado
      form.reset();
      servicos.forEach(s => s.classList.remove("selecionado"));
      [dadosClienteSection, orcamentoSection, agendamentoSection].forEach(s => s.style.display = 'none');
      alert("Agendamento realizado com sucesso!");

    } catch (error) {
      console.error("Erro ao salvar agendamento:", error);
      alert("Houve um erro ao tentar agendar. Por favor, tente novamente.");
    } finally {
      // Reabilita o botão
      btnAgendarServico.disabled = false;
      btnAgendarServico.innerHTML = '<img src="assets/imagens/whatsapp-icon.png" alt="WhatsApp Icon" /> Agendar Serviço';
      validarFormularioCompleto();
    }
  });
});
