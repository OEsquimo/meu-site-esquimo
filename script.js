document.addEventListener("DOMContentLoaded", function () {
  // Seleciona os elementos do DOM
  const form = document.getElementById("formulario");
  const enviarBtn = document.getElementById("enviarBtn");
  const relatorioDiv = document.getElementById("relatorio");
  const nomeInput = document.getElementById("nome");
  const enderecoInput = document.getElementById("endereco");
  const whatsappInput = document.getElementById("whatsapp");
  const servicoSelect = document.getElementById("servico");
  const btusSelect = document.getElementById("btus");

  // Elementos para mensagens de erro
  const erroNome = document.getElementById("erro-nome");
  const erroEndereco = document.getElementById("erro-endereco");
  const erroWhatsapp = document.getElementById("erro-whatsapp");
  const erroServico = document.getElementById("erro-servico");
  const erroBtus = document.getElementById("erro-btus");

  const seuWhatsApp = "5581983259341"; // Seu WhatsApp fixo

  // Função para aplicar máscara simples no campo WhatsApp do cliente
  whatsappInput.addEventListener("input", function (e) {
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

  // Preço base para cada serviço e BTU
  const precoInstalacao = {
    "9000": 500,
    "12000": 600,
    "18000": 700,
    "24000": 800,
    "30000": 900,
  };

  const precoLimpezaSplit = {
    "9000": 180,
    "12000": 230,
    "18000": 280,
    "24000": 330,
    "30000": 380,
  };

  const precoLimpezaJanela = 150;

  // Validação do formato WhatsApp
  function validarWhatsApp(tel) {
    const regex = /^\(\d{2}\) \d{5}-\d{4}$/;
    return regex.test(tel);
  }

  // Calcula o valor do orçamento baseado no serviço e BTU
  function calcularValor(servico, btus) {
    if (servico === "Instalação") {
      return precoInstalacao[btus] ?? "";
    }
    if (servico === "Limpeza Split") {
      return precoLimpezaSplit[btus] ?? "";
    }
    if (servico === "Limpeza Janela") {
      return precoLimpezaJanela;
    }
    // Para manutenção não tem valor fixo
    return "";
  }

  // Função para exibir mensagens de erro
  function exibirErro(elementoErro, mensagem) {
    elementoErro.innerText = mensagem;
  }

  // Função para limpar mensagens de erro
  function limparErro(elementoErro) {
    elementoErro.innerText = "";
  }

  // Função para validar todos os campos do formulário
  function validarFormulario() {
    let isValid = true;

    // Validação do campo Nome
    if (nomeInput.value.trim() === "") {
      exibirErro(erroNome, "Informe seu nome aqui.");
      isValid = false;
    } else {
      limparErro(erroNome);
    }

    // Validação do campo Endereço
    if (enderecoInput.value.trim() === "") {
      exibirErro(erroEndereco, "Preencha seu endereço.");
      isValid = false;
    } else {
      limparErro(erroEndereco);
    }

    // Validação do campo WhatsApp
    if (!validarWhatsApp(whatsappInput.value.trim())) {
      exibirErro(erroWhatsapp, "DDD e número do WhatsApp.");
      isValid = false;
    } else {
      limparErro(erroWhatsapp);
    }

    // Validação do campo Tipo de Serviço
    if (servicoSelect.value === "") {
      exibirErro(erroServico, "Selecione o tipo de serviço.");
      isValid = false;
    } else {
      limparErro(erroServico);
    }

    // Validação do campo BTUs (se não for Limpeza Janela)
    if (servicoSelect.value !== "Limpeza Janela" && btusSelect.value === "") {
      exibirErro(erroBtus, "Selecione a capacidade em BTUs.");
      isValid = false;
    } else {
      limparErro(erroBtus);
    }

    return isValid;
  }

  // Função para gerar relatório e validar campos
  function gerarRelatorio() {
    const nome = nomeInput.value.trim();
    const endereco = enderecoInput.value.trim();
    const whatsappCliente = whatsappInput.value.trim();
    const servico = servicoSelect.value;
    const btus = btusSelect.value.trim();

    // Atualiza o valor do orçamento automaticamente
    let valorOrcamento = calcularValor(servico, btus);

    if (servico === "Manutenção") {
      valorOrcamento = "Orçamento sob análise";
    }

    // Verifica se todos os dados são válidos para habilitar o botão e exibir o relatório
    const camposValidosParaRelatorio =
      nome.length > 0 &&
      endereco.length > 0 &&
      validarWhatsApp(whatsappCliente) &&
      servico.length > 0 &&
      (servico === "Limpeza Janela" || btus.length > 0) &&
      (valorOrcamento !== "" && valorOrcamento !== null);

    if (camposValidosParaRelatorio) {
      const relatorioTexto = 
`*ORÇAMENTO DETALHADO*
👤 Nome: ${nome}
📍 Endereço: ${endereco}
📱 WhatsApp do Cliente: ${whatsappCliente}
🛠️ Serviço: ${servico}
❄️ BTUs: ${btus || "N/A"}
💰 Valor do Orçamento: R$ ${valorOrcamento}
   Obs: Mande esse orçamento 
        para nossa conversa 
        no whatsapp`;

      relatorioDiv.innerText = relatorioTexto;
      enviarBtn.disabled = false;
      return relatorioTexto;
    } else {
      relatorioDiv.innerText = ""; // Limpa o relatório se os campos não forem válidos
      enviarBtn.disabled = true;
      return null;
    }
  }

  // Adiciona listeners para os eventos de input para gerar o relatório e habilitar/desabilitar o botão
  form.addEventListener("input", gerarRelatorio);

  // Listener para o clique do botão Enviar Relatório
  enviarBtn.addEventListener("click", function () {
    // Se o formulário não for válido, exibe erros e foca no primeiro campo inválido
    if (!validarFormulario()) {
      if (nomeInput.value.trim() === "") {
        nomeInput.focus();
      } else if (enderecoInput.value.trim() === "") {
        enderecoInput.focus();
      } else if (!validarWhatsApp(whatsappInput.value.trim())) {
        whatsappInput.focus();
      } else if (servicoSelect.value === "") {
        servicoSelect.focus();
      } else if (servicoSelect.value !== "Limpeza Janela" && btusSelect.value === "") {
        btusSelect.focus();
      }
      return; // Impede o envio se a validação falhar
    }

    const mensagem = gerarRelatorio();
    if (mensagem) {
      const url = `https://wa.me/${seuWhatsApp}?text=${encodeURIComponent(mensagem)}`;
      window.open(url, "_blank");
    }
  });
});
