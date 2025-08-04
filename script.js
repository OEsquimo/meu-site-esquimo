document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formulario");
  const enviarBtn = document.getElementById("enviarBtn");
  const relatorioDiv = document.getElementById("relatorio");

  const seuWhatsApp = "5581983259341"; // Seu WhatsApp fixo

  // Função para aplicar máscara simples no campo WhatsApp do cliente
  const whatsappInput = document.getElementById("whatsapp");
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

  // Função para gerar relatório e validar campos
  function gerarRelatorio() {
    const nome = document.getElementById("nome").value.trim();
    const endereco = document.getElementById("endereco").value.trim();
    const whatsappCliente = document.getElementById("whatsapp").value.trim();
    const servico = document.getElementById("servico").value;
    const btus = document.getElementById("btus").value.trim();

    // Atualiza o valor do orçamento automaticamente
    const valorCampo = document.getElementById("valor");

    let valorOrcamento = calcularValor(servico, btus);

    if (servico === "Manutenção") {
      valorOrcamento = "Orçamento sob análise";
    }

    valorCampo.value = valorOrcamento;

    // Verifica se todos os dados são válidos
    const camposValidos =
      nome.length > 0 &&
      endereco.length > 0 &&
      validarWhatsApp(whatsappCliente) &&
      servico.length > 0 &&
      (servico === "Limpeza Janela" || btus.length > 0) &&
      (valorOrcamento !== "" && valorOrcamento !== null);

    if (camposValidos) {
      const relatorioTexto = 
`*ORÇAMENTO*
👤 Nome: ${nome}
📍 Endereço: ${endereco}
📱 WhatsApp do Cliente: ${whatsappCliente}
🛠️ Serviço: ${servico}
❄️ BTUs: ${btus || "N/A"}
💰 Valor do Orçamento: R$ ${valorOrcamento}`;

      relatorioDiv.innerText = relatorioTexto;
      enviarBtn.disabled = false;
      return relatorioTexto;
    } else {
      relatorioDiv.innerText = "";
      enviarBtn.disabled = true;
      return null;
    }
  }

  form.addEventListener("input", gerarRelatorio);

  enviarBtn.addEventListener("click", function () {
    const mensagem = gerarRelatorio();
    if (mensagem) {
      const url = `https://wa.me/${seuWhatsApp}?text=${encodeURIComponent(mensagem)}`;
      window.open(url, "_blank");
    }
  });
});
