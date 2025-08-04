document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("orcamentoForm");
  const nomeInput = document.getElementById("nome");
  const enderecoInput = document.getElementById("endereco");
  const whatsappInput = document.getElementById("whatsapp");
  const servicoSelect = document.getElementById("servico");
  const btusSelect = document.getElementById("btus");
  const enviarBtn = document.getElementById("enviar");
  const respostaDiv = document.getElementById("resposta");

  function validarCampos() {
    const nome = nomeInput.value.trim();
    const endereco = enderecoInput.value.trim();
    const whatsapp = whatsappInput.value.trim();
    const servico = servicoSelect.value;
    const btus = btusSelect.value;

    const camposPreenchidos = nome && endereco && whatsapp && servico &&
      (servico === "Limpeza Janela" || btus);

    enviarBtn.disabled = !camposPreenchidos;

    if (camposPreenchidos) {
      gerarOrcamento();
    } else {
      respostaDiv.innerHTML = "";
    }
  }

  function gerarOrcamento() {
    const nome = nomeInput.value.trim();
    const endereco = enderecoInput.value.trim();
    const whatsapp = whatsappInput.value.trim();
    const servico = servicoSelect.value;
    const btus = btusSelect.value;

    let valor = 0;

    if (servico === "Instalação") {
      if (btus === "9000") valor = 250;
      else if (btus === "12000") valor = 280;
      else if (btus === "18000") valor = 300;
      else if (btus === "24000") valor = 350;
    } else if (servico === "Limpeza") {
      if (btus === "9000") valor = 90;
      else if (btus === "12000") valor = 100;
      else if (btus === "18000") valor = 110;
      else if (btus === "24000") valor = 130;
    } else if (servico === "Manutenção") {
      if (btus === "9000") valor = 120;
      else if (btus === "12000") valor = 130;
      else if (btus === "18000") valor = 140;
      else if (btus === "24000") valor = 160;
    } else if (servico === "Limpeza Janela") {
      valor = 80;
    }

    const textoOrcamento =
      `✅ <strong>Orçamento Gerado:</strong><br>` +
      `👤 <strong>Nome:</strong> ${nome}<br>` +
      `🏠 <strong>Endereço:</strong> ${endereco}<br>` +
      `📱 <strong>WhatsApp:</strong> ${whatsapp}<br>` +
      `🛠️ <strong>Serviço:</strong> ${servico}<br>` +
      (servico !== "Limpeza Janela" ? `❄️ <strong>BTUs:</strong> ${btus}<br>` : "") +
      `💰 <strong>Valor:</strong> R$ ${valor.toFixed(2)}`;

    respostaDiv.innerHTML = textoOrcamento;

    const mensagemWhatsApp =
      `Olá, aqui está o orçamento solicitado:%0A` +
      `👤 Nome: ${nome}%0A` +
      `🏠 Endereço: ${endereco}%0A` +
      `📱 WhatsApp: ${whatsapp}%0A` +
      `🛠️ Serviço: ${servico}%0A` +
      (servico !== "Limpeza Janela" ? `❄️ BTUs: ${btus}%0A` : "") +
      `💰 Valor: R$ ${valor.toFixed(2)}`;

    enviarBtn.onclick = function () {
      const link = `https://wa.me/?text=${mensagemWhatsApp}`;
      window.open(link, "_blank");
    };
  }

  form.addEventListener("input", validarCampos);
});
