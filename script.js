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

  // Função para gerar relatório e validar campos (usada para habilitar botão e mostrar relatório)
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
`*ORÇAMENTO DETALHADO*
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

  // Função para validar os campos no clique do botão e mostrar mensagens de erro dentro dos campos
  function validarCamposComMensagem() {
    // Remove mensagens antigas para não acumular
    const campos = [
      { id: "nome", mensagem: "Informe seu nome aqui." },
      { id: "endereco", mensagem: "Preencha seu endereço." },
      { id: "whatsapp", mensagem: "DDD e número do WhatsApp." },
      { id: "servico", mensagem: "Selecione o serviço." },
      { id: "btus", mensagem: "Selecione a capacidade em BTUs." }
    ];

    let primeiroInvalido = null;

    campos.forEach(({ id }) => {
      const campo = document.getElementById(id);
      // Remove o estilo e title antigos (se houver)
      campo.style.borderColor = "";
      campo.title = "";
      // Remove elemento de erro (se existir)
      const erroExistente = campo.parentNode.querySelector(".erro-msg");
      if (erroExistente) erroExistente.remove();
    });

    // Valida cada campo e exibe erro se inválido
    for (const { id, mensagem } of campos) {
      const campo = document.getElementById(id);
      let valor = campo.value.trim();

      // btus só obrigatório se serviço não for Limpeza Janela
      if (id === "btus") {
        const servicoVal = document.getElementById("servico").value;
        if (servicoVal === "Limpeza Janela") {
          valor = "ok"; // ignora btus
        }
      }

      let valido = true;

      if (id === "whatsapp") {
        valido = validarWhatsApp(valor);
      } else {
        valido = valor.length > 0;
      }

      if (!valido) {
        // Cria mensagem de erro abaixo do campo
        const msgErro = document.createElement("div");
        msgErro.className = "erro-msg";
        msgErro.style.color = "red";
        msgErro.style.fontSize = "0.85em";
        msgErro.style.marginTop = "3px";
        msgErro.innerText = mensagem;
        campo.style.borderColor = "red";
        campo.parentNode.appendChild(msgErro);

        if (!primeiroInvalido) {
          primeiroInvalido = campo;
        }
      }
    }

    if (primeiroInvalido) {
      primeiroInvalido.focus();
      return false;
    }
    return true;
  }

  // Evento para atualizar relatório e botão habilitado quando usuário digita ou muda campos
  form.addEventListener("input", gerarRelatorio);

  // Evento clique no botão enviar relatório
  enviarBtn.addEventListener("click", function () {
    // Valida campos com mensagens e foco no primeiro erro
    const tudoValido = validarCamposComMensagem();

    if (!tudoValido) {
      // Não envia se inválido
      return;
    }

    // Se válido, gera relatório e abre o WhatsApp com mensagem
    const mensagem = gerarRelatorio();
    if (mensagem) {
      const url = `https://wa.me/${seuWhatsApp}?text=${encodeURIComponent(mensagem)}`;
      window.open(url, "_blank");
    }
  });
});
