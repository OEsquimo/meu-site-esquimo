/ Adiciona funcionalidade para os cards de serviço
document.addEventListener('DOMContentLoaded', function() {
  const serviceCards = document.querySelectorAll('.service-card');
  const tipoInput = document.getElementById('tipo');
  
  serviceCards.forEach(card => {
    card.addEventListener('click', function() {
      // Remove seleção anterior
      serviceCards.forEach(c => c.classList.remove('selected'));
      
      // Adiciona seleção ao card clicado
      this.classList.add('selected');
      
      // Atualiza o campo hidden para manter compatibilidade
      const serviceType = this.getAttribute('data-service');
      tipoInput.value = serviceType;
      
      // Dispara o evento change para manter a lógica existente
      const changeEvent = new Event('change');
      tipoInput.dispatchEvent(changeEvent);
    });
  });
});

// Mantém a lógica original do select, mas agora funciona com o campo hidden
document.getElementById("tipo").addEventListener("change", function() {
  const tipo = this.value;
  document.getElementById("btusDiv").classList.add("hidden");
  document.getElementById("manutencaoDiv").classList.add("hidden");
  document.getElementById("valor").textContent = "";
  // Reseta a seleção de BTUs ao trocar o serviço
  document.getElementById("btus").value = ""; 

  if (tipo === "instalacao" || tipo === "limpeza") {
    document.getElementById("btusDiv").classList.remove("hidden");
    // O valor só aparecerá quando o cliente selecionar os BTUs
  } else if (tipo === "manutencao") {
    document.getElementById("manutencaoDiv").classList.remove("hidden");
    document.getElementById("valor").textContent = "O valor depende do tipo de defeito informado.";
  }
});

document.getElementById("btus").addEventListener("change", atualizarValor);

function atualizarValor() {
  const tipo = document.getElementById("tipo").value;
  const btus = parseInt(document.getElementById("btus").value);
  let texto = "";

  // Só atualiza se um BTU válido for selecionado
  if (!btus) {
    document.getElementById("valor").textContent = "";
    return;
  }

  if (tipo === "instalacao") {
    const valorBase = calcularValorInstalacao(btus);
    texto = 
      `💰 Instalação básica:\nR$${valorBase.toFixed(2)}\n\n⚠️ Disjuntor não incluso.\n` +
      `💰 Valor do disjuntor: R$80,00 (com 2 metros de cabo até a fonte de energia mais próxima).\n` +
      `⚠️ Obs: O valor pode variar conforme a infraestrutura do local.`;
  } else if (tipo === "limpeza") {
    const valorBase = calcularValorLimpeza(btus);
    texto = 
      `🧽 Limpeza de ar-condicionado:\n💰 Valor base: R$${valorBase.toFixed(2)}\n` +
      `⚠️ (obs: pode variar conforme a dificuldade do acesso ao equipamento)`;
  }
  
  document.getElementById("valor").textContent = texto;
}

function calcularValorInstalacao(btus) {
  const tabela = {
    9000: 480,
    12000: 550,
    18000: 650,
    24000: 750,
    30000: 850,
  };
  if (tabela[btus]) return tabela[btus];
  if (btus > 30000) {
    let extra = Math.floor((btus - 30000) / 6000);
    return 850 + extra * 100;
  }
  return 0;
}

// Nova função para calcular o valor da limpeza
function calcularValorLimpeza(btus) {
  const tabela = {
    9000: 180,
    12000: 230, // 180 + 50
    18000: 280, // 230 + 50
    24000: 330, // 280 + 50
    30000: 380, // 330 + 50
  };
  return tabela[btus] || 180; // Retorna 180 se não encontrar
}

document.getElementById("orcamentoForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const endereco = document.getElementById("endereco").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const tipo = document.getElementById("tipo").value;
  const btus = document.getElementById("btus").value;
  const defeito = document.getElementById("descricao").value.trim();

  if (!nome || !endereco || !telefone || !tipo) {
    alert("⚠️ Por favor, preencha todos os campos obrigatórios.");
    return;
  }
  
  // Validação específica para BTUs
  if ((tipo === "instalacao" || tipo === "limpeza") && !btus) {
    alert("⚠️ Por favor, selecione a capacidade em BTUs.");
    return;
  }

  // Formatação melhorada da mensagem com ícones
  let mensagem = `🔧 *ORÇAMENTO - O ESQUIMÓ*\n\n👤 *Cliente:* ${nome}\n📍 *Endereço:* ${endereco}\n📱 *WhatsApp:* ${telefone}\n\n🛠️ *Serviço:* `;

  if (tipo === "instalacao") {
    const valorInst = calcularValorInstalacao(parseInt(btus));
    mensagem += `*Instalação básica*\n❄️ *Capacidade:* ${btus} BTUs\n💰 *Valor:* R$${valorInst.toFixed(2)}\n💰 *Disjuntor:* R$80,00 (2 metros de cabo)\n⚠️ *Obs:* O valor pode variar conforme a infraestrutura do local.`;
  } else if (tipo === "limpeza") {
    const valorLimpeza = calcularValorLimpeza(parseInt(btus));
    mensagem += `*Limpeza de ar-condicionado*\n❄️ *Capacidade:* ${btus} BTUs\n💰 *Valor base:* R$${valorLimpeza.toFixed(2)}\n⚠️ *Obs:* pode variar conforme a dificuldade do acesso ao equipamento`;
  } else if (tipo === "manutencao") {
    mensagem += `*Manutenção*\n🔍 *Descrição do defeito:* ${defeito || "Não informado"}\n💰 *Valor:* depende do tipo de defeito.`;
  }

  const meuNumero = "5581983259341";

  const telefoneCliente = telefone.replace(/\D/g, "");
  const urlCliente = `https://wa.me/55${telefoneCliente}?text=${encodeURIComponent(mensagem)}`;
  const urlEu = `https://wa.me/${meuNumero}?text=${encodeURIComponent("🆕 *Novo orçamento recebido:*\n\n" + mensagem)}`;

  window.open(urlCliente, "_blank");
  window.open(urlEu, "_blank");

  // Limpa os campos após o envio
  document.getElementById("nome").value = "";
  document.getElementById("endereco").value = "";
  document.getElementById("telefone").value = "";
  document.getElementById("tipo").value = "";
  document.getElementById("btus").value = "";
  document.getElementById("descricao").value = "";
  document.getElementById("valor").textContent = "";
  
  // Remove seleção dos cards
  document.querySelectorAll('.service-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  // Esconde divs condicionais
  document.getElementById("btusDiv").classList.add("hidden");
  document.getElementById("manutencaoDiv").classList.add("hidden");
});

// Máscara simples para telefone (formato (81) 91234-5678)
document.getElementById("telefone").addEventListener("input", function(e) {
  let v = e.target.value.replace(/\D/g, "");
  if (v.length > 11) v = v.slice(0, 11);

  if (v.length > 6) {
    e.target.value = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
  } else if (v.length > 2) {
    e.target.value = `(${v.slice(0,2)}) ${v.slice(2)}`;
  } else if (v.length > 0) {
    e.target.value = `(${v}`;
  }
});
