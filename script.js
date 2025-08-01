document.getElementById('orcamentoForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const endereco = document.getElementById('endereco').value.trim();
  const btus = document.getElementById('btus').value.trim();
  const whatsapp = document.getElementById('whatsapp').value.trim();
  const servico = document.getElementById('servico').value;
  const detalhes = document.getElementById('detalhes').value.trim();

  if (!nome || !endereco || !btus || !whatsapp || !servico) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  let textoOrcamento = `🧊 *O Esquimó - Orçamento Técnico* 🧊\n\n`;
  textoOrcamento += `👤 *Cliente:* ${nome}\n`;
  textoOrcamento += `📍 *Endereço:* ${endereco}\n`;
  textoOrcamento += `❄️ *Capacidade (BTUs):* ${btus}\n`;
  textoOrcamento += `🔧 *Serviço solicitado:* ${servico}\n`;

  if (servico === 'Instalação') {
    textoOrcamento += `\n💰 *Orçamento Básico:*\n`;
    textoOrcamento += `- Instalação padrão: R$ 300,00\n`;
    textoOrcamento += `- Disjuntor não incluso.\n`;
    textoOrcamento += `- Instalação de disjuntor (opcional): R$ 80,00 com até 2 metros de cabo.\n`;
    textoOrcamento += `🔸 *Observação:* O valor pode sofrer alterações conforme a infraestrutura do local.\n`;

    textoOrcamento += `\n📘 *Instalação seguindo o manual técnico:*\n`;
    textoOrcamento += `- 3 metros de tubulação, esponjoso, cabo PP, fita PVC, suporte, buchas e parafusos.\n`;
    textoOrcamento += `- Disjuntor incluso.\n`;
    textoOrcamento += `🔸 *Observação:* O valor pode sofrer alterações conforme a infraestrutura do local.\n`;
  }

  if (detalhes) {
    textoOrcamento += `\n📋 *Observações adicionais:* ${detalhes}\n`;
  }

  textoOrcamento += `\n📅 *Data:* ${new Date().toLocaleDateString()}`;

  // Link para o cliente
  const msgCliente = `https://wa.me/55${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(textoOrcamento)}`;

  // Link para você (Wellington)
  const seuNumero = '5581983259341';
  const msgWellington = `https://wa.me/${seuNumero}?text=${encodeURIComponent(textoOrcamento)}`;

  // Abre duas abas: uma pro cliente, outra pra você
  window.open(msgCliente, '_blank');
  setTimeout(() => {
    window.open(msgWellington, '_blank');
  }, 1500); // delay para não travar popup em alguns navegadores
});
