document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formulario");
  const enviarBtn = document.getElementById("enviarBtn");
  const relatorioDiv = document.getElementById("relatorio");

  const seuWhatsApp = "5581983259341"; // Seu WhatsApp fixo com DDI + DDD

  // Função para validar o WhatsApp (formato básico)
  function validarWhatsApp(tel) {
    const regex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
    return regex.test(tel);
  }

  // Função para gerar relatório e validar todos os campos
  function gerarRelatorio() {
    const nome = document.getElementById("nome").value.trim();
    const endereco = document.getElementById("endereco").value.trim();
    const whatsappCliente = document.getElementById("whatsapp").value.trim();
    const servico = document.getElementById("servico").value;
    const btus = document.getElementById("btus").value.trim();
    const valor = document.getElementById("valor").value.trim();

    // Validação simples dos campos
    if (
      nome.length > 0 &&
      endereco.length > 0 &&
      validarWhatsApp(whatsappCliente) &&
      servico.length > 0 &&
      btus.length > 0 &&
      valor.length > 0
    ) {
      const relatorioTexto = 
`*ORÇAMENTO DETALHADO*
👤 Nome: ${nome}
📍 Endereço: ${endereco}
📱 WhatsApp do Cliente: ${whatsappCliente}
🛠️ Serviço: ${servico}
❄️ BTUs: ${btus}
💰 Valor do Orçamento: R$ ${valor}`;

      relatorioDiv.innerText = relatorioTexto;
      enviarBtn.disabled = false;
      return relatorioTexto;
    } else {
      relatorioDiv.innerText = "";
      enviarBtn.disabled = true;
      return null;
    }
  }

  // Atualiza relatório e botão a cada alteração
  form.addEventListener("input", gerarRelatorio);

  // Ao clicar no botão enviar, abre o WhatsApp com a mensagem pronta
  enviarBtn.addEventListener("click", function () {
    const mensagem = gerarRelatorio();
    if (mensagem) {
      const url = `https://wa.me/${seuWhatsApp}?text=${encodeURIComponent(mensagem)}`;
      window.open(url, "_blank");
    }
  });
});
