document.getElementById("tipo").addEventListener("change", function() {
  const tipo = this.value;
  document.getElementById("btusDiv").classList.add("hidden");
  document.getElementById("manutencaoDiv").classList.add("hidden");
  document.getElementById("valor").textContent = "";
  // Reseta a seleção de BTUs ao trocar o serviço
  document.getElementById("btus").value = ""; 

  document.getElementById("agendarBtn").classList.add("hidden"); // Esconde o botão ao mudar tipo

  if (tipo === "instalacao" || tipo === "limpeza") {
    document.getElementById("btusDiv").classList.remove("hidden");
    // O valor só aparecerá quando o cliente selecionar os BTUs
  } else if (tipo === "manutencao") {
    document.getElementById("manutencaoDiv").classList.remove("hidden");
    document.getElementById("valor").textContent = "O valor depende do tipo de defeito informado.";
  }
});

document.getElementById("btus").addEventListener("change", atualizarValor);

// Atualiza o valor do orçamento e mostra o botão agendar
function atualizarValor() {
  const tipo = document.getElementById("tipo").value;
  const btus = parseInt(document.getElementById("btus").value);
  let texto = "";

  document.getElementById("agendarBtn").classList.add("hidden"); // Esconde o botão antes de atualizar

  // Só atualiza se um BTU válido for selecionado
  if (!btus) {
    document.getElementById("valor").textContent = "";
    return;
  }

  if (tipo === "instalacao") {
    const valorBase = calcularValorInstalacao(btus);
    texto = 
      `Instalação básica:\nR$${valorBase.toFixed(2)}\n\nDisjuntor não incluso.\n` +
      `Valor do disjuntor: R$80,00 (com 2 metros de cabo até a fonte de energia mais próxima).\n` +
      `Obs: O valor pode variar conforme a infraestrutura do local.`;
  } else if (tipo === "limpeza") {
    const valorBase = calcularValorLimpeza(btus);
    texto = 
      `Limpeza de ar-condicionado:\nValor base: R$${valorBase.toFixed(2)}\n` +
      `(obs: pode variar conforme a dificuldade do acesso ao equipamento)`;
  }

  document.getElementById("valor").textContent = texto;
  document.getElementById("agendarBtn").classList.remove("hidden"); // Mostra o botão agendar após atualizar valor
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
    12000: 230,
    18000: 280,
    24000: 330,
    30000: 380,
  };
  return tabela[btus] || 180;
}

// Manutenção exibe orçamento ao preencher o defeito e tipo
document.getElementById("descricao").addEventListener("input", function() {
  const defeito = this.value.trim();
  const tipo = document.getElementById("tipo").value;

  if (tipo === "manutencao") {
    if (defeito.length > 2) {
      document.getElementById("valor").textContent = 
        `Manutenção\nDescrição do defeito: ${defeito}\nValor depende do tipo de defeito.`;
      document.getElementById("agendarBtn").classList.remove("hidden");
    } else {
      document.getElementById("valor").textContent = "O valor depende do tipo de defeito informado.";
      document.getElementById("agendarBtn").classList.add("hidden");
    }
  }
});

// Esconde o botão agendar se mudar o formulário (resetar)
document.getElementById("orcamentoForm").addEventListener("reset", function() {
  document.getElementById("agendarBtn").classList.add("hidden");
  document.getElementById("valor").textContent = "";
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

// Aqui você pode adicionar o evento para o botão "Agendar"
document.getElementById("agendarBtn").addEventListener("click", function() {
  alert("Aqui você pode abrir o formulário de agendamento com os dados já preenchidos.");
  // Ou qualquer ação que desejar para o agendamento
});
