script.js

document.addEventListener("DOMContentLoaded", function () {
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

  const seuWhatsApp = "5581983259341";

  // Máscara e bloqueio de letras no campo WhatsApp
  whatsappInput.addEventListener("input", function () {
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

  // Seleção do serviço clicando na imagem
  servicos.forEach(servico => {
    servico.addEventListener("click", function () {
      servicos.forEach(s => s.classList.remove("selecionado"));
      this.classList.add("selecionado");

      const servicoEscolhido = this.getAttribute("data-servico");
      servicoSelecionadoInput.value = servicoEscolhido;

      atualizarCamposPorServico(servicoEscolhido);
      nomeInput.scrollIntoView({ behavior: "smooth", block: "center" });
      nomeInput.focus();

      validarFormulario();
    });
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

  function validarWhatsApp(tel) {
    const somenteNumeros = tel.replace(/\D/g, "");
    return somenteNumeros.length === 11;
  }

  function mostrarErroInput(input, mensagem) {
    input.classList.add("input-error");
    if (!validarWhatsApp(input.value.trim())) {
      input.placeholder = mensagem;
    }
  }

  function limparErroInput(input, placeholder) {
    input.classList.remove("input-error");
    input.placeholder = placeholder;
  }

  const precoInstalacao = { "9000": 500, "12000": 600, "18000": 700, "24000": 800, "30000": 900 };
  const precoLimpezaSplit = { "9000": 180, "12000": 230, "18000": 280, "24000": 330, "30000": 380 };
  const precoLimpezaJanela = 150;

  function calcularValor(servico, btus) {
    if (servico === "Instalação") return precoInstalacao[btus] ?? "";
    if (servico === "Limpeza Split") return precoLimpezaSplit[btus] ?? "";
    if (servico === "Limpeza Janela") return precoLimpezaJanela;
    return "";
  }

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
      limparErroInput(defeitoTextarea, "Descreva o defeito aqui...");
    } else if (servicoSelecionadoInput.value === "Manutenção") {
      if (defeitoTextarea.value.trim() === "") {
        mostrarErroInput(defeitoTextarea, "Descreva o defeito");
        isValid = false;
      } else {
        limparErroInput(defeitoTextarea, "Descreva o defeito aqui...");
      }
      limparErroInput(btusSelect, "");
    } else {
      limparErroInput(btusSelect, "");
      limparErroInput(defeitoTextarea, "Descreva o defeito aqui...");
    }

    enviarBtn.disabled = !isValid;
    return isValid;
  }

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

    let valorOrcamento = calcularValor(servico, btus);

    if (servico === "Manutenção") {
      valorOrcamento = "Orçamento sob análise";
    }

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

    textoRelatorio += `
Obs: Mande esse orçamento para nossa conversa no WhatsApp`;

    relatorioDiv.innerText = textoRelatorio;

    return textoRelatorio;
  }

  form.addEventListener("input", () => {
    gerarRelatorio();
  });

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
