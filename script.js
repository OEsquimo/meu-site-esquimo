document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formulario");
  const enviarBtn = document.getElementById("enviarBtn");
  const relatorioDiv = document.getElementById("relatorio");

  const seuWhatsApp = "5581983259341";

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

  const nomeInput = document.getElementById("nome");
  const enderecoInput = document.getElementById("endereco");
  const whatsappInput = document.getElementById("whatsapp");
  const servicoSelect = document.getElementById("servico");
  const btusSelect = document.getElementById("btus");
  const valorInput = document.getElementById("valor");

  // Aplica máscara ao WhatsApp
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

  function validarWhatsApp(tel) {
    const regex = /^\(\d{2}\) \d{5}-\d{4}$/;
    return regex.test(tel);
  }

  function calcularValor(servico, btus) {
    if (servico === "Instalação") return precoInstalacao[btus] ?? "";
    if (servico === "Limpeza Split") return precoLimpezaSplit[btus] ?? "";
    if (servico === "Limpeza Janela") return precoLimpezaJanela;
    return "";
  }

  function gerarRelatorio() {
    const nome = nomeInput.value.trim();
    const endereco = enderecoInput.value.trim();
    const whatsappCliente = whatsappInput.value.trim();
    const servico = servicoSelect.value;
    const btus = btusSelect.value;

    limparErros();

    let valorOrcamento = calcularValor(servico, btus);
    if (servico === "Manutenção") valorOrcamento = "Orçamento sob análise";
    valorInput.value = valorOrcamento;

    const camposValidos =
      nome.length > 0 &&
      endereco.length > 0 &&
      validarWhatsApp(whatsappCliente) &&
      servico.length > 0 &&
      (servico === "Limpeza Janela" || btus.length > 0) &&
      (valorOrcamento !== "" && valorOrcamento !== null);

    if (camposValidos) {
      const texto =
`*ORÇAMENTO DETALHADO*
👤 Nome: ${nome}
📍 Endereço: ${endereco}
📱 WhatsApp do Cliente: ${whatsappCliente}
🛠️ Serviço: ${servico}
❄️ BTUs: ${btus || "N/A"}
💰 Valor do Orçamento: R$ ${valorOrcamento}`;
      relatorioDiv.innerText = texto;
      enviarBtn.disabled = false;
      return texto;
    } else {
      relatorioDiv.innerText = "";
      enviarBtn.disabled = true;
      return null;
    }
  }

  function limparErros() {
    [nomeInput, enderecoInput, whatsappInput].forEach(input => {
      input.classList.remove("erro");
      input.placeholder = input.getAttribute("data-placeholder") || "";
    });
  }

  function validarCamposAntesDoEnvio() {
    const nome = nomeInput.value.trim();
    const endereco = enderecoInput.value.trim();
    const whatsapp = whatsappInput.value.trim();
    const servico = servicoSelect.value;
    const btus = btusSelect.value;

    limparErros();

    if (nome === "") {
      nomeInput.placeholder = "Informe seu nome aqui.";
      nomeInput.classList.add("erro");
      nomeInput.focus();
      return false;
    }

    if (endereco === "") {
      enderecoInput.placeholder = "Preencha seu endereço.";
      enderecoInput.classList.add("erro");
      enderecoInput.focus();
      return false;
    }

    if (!validarWhatsApp(whatsapp)) {
      whatsappInput.value = "";
      whatsappInput.placeholder = "DDD e número do WhatsApp.";
      whatsappInput.classList.add("erro");
      whatsappInput.focus();
      return false;
    }

    if (servico === "") {
      servicoSelect.focus();
      return false;
    }

    if (servico !== "Limpeza Janela" && btus === "") {
      btusSelect.focus();
      return false;
    }

    return true;
  }

  form.addEventListener("input", gerarRelatorio);

  enviarBtn.addEventListener("click", function () {
    if (!validarCamposAntesDoEnvio()) return;

    const mensagem = gerarRelatorio();
    if (mensagem) {
      const url = `https://wa.me/${seuWhatsApp}?text=${encodeURIComponent(mensagem)}`;
      window.open(url, "_blank");
    }
  });
});
