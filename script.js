document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formulario");
  const enviarBtn = document.getElementById("enviarBtn");
  const relatorioDiv = document.getElementById("relatorio");
  
  const seuWhatsApp = "5581983259341"; // << Seu WhatsApp FIXO (mantenha com 55 + DDD)

  // Função para gerar relatório
  function gerarRelatorio() {
    const nome = document.getElementById("nome").value.trim();
    const endereco = document.getElementById("endereco").value.trim();
    const whatsappCliente = document.getElementById("whatsapp").value.trim();
    const servico = document.getElementById("servico").value;
    const btus = document.getElementById("btus").value.trim();
    const valor = document.getElementById("valor").value.trim();

    if (nome && endereco && whatsappCliente && servico && btus && valor) {
      const relatorioTexto = `
        *ORÇAMENTO DETALHADO*
        \n👤 *Nome:* ${nome}
        \n📍 *Endereço:* ${endereco}
        \n📱 *WhatsApp do Cliente:* ${whatsappCliente}
        \n🛠️ *Serviço:* ${servico}
        \n❄️ *BTUs:* ${btus}
        \n💰 *Valor do Orçamento:* R$ ${valor}
      `;

      // Mostra o relatório na tela
      relatorioDiv.innerText = relatorioTexto;
      relatorioDiv.style.whiteSpace = "pre-line";

      // Habilita o botão
      enviarBtn.disabled = false;

      return relatorioTexto;
    } else {
      relatorioDiv.innerText = "";
      enviarBtn.disabled = true;
      return null;
    }
  }

  // Escuta mudanças nos campos
  form.addEventListener("input", gerarRelatorio);

  // Envia o relatório para o WhatsApp
  enviarBtn.addEventListener("click", function () {
    const texto = gerarRelatorio();
    if (texto) {
      const url = `https://wa.me/${seuWhatsApp}?text=${encodeURIComponent(texto)}`;
      window.open(url, "_blank");
    }
  });
});
