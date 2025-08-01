document.getElementById('servico').addEventListener('change', function () {
  const tipo = this.value;
  const extras = document.getElementById('opcoesExtras');
  const resumo = document.getElementById('resumo');
  extras.innerHTML = '';
  resumo.innerHTML = '';

  if (tipo === 'instalacao') {
    extras.innerHTML = `
      <label for="tipoInstalacao">Tipo de instalação:</label>
      <select id="tipoInstalacao" onchange="gerarResumo()">
        <option value="">-- Escolha --</option>
        <option value="Instalação básica (R$ 480,00)">Instalação básica (2 metros de tubulação, cabo PP, esponjoso, fita PVC, suporte, buchas e parafusos)</option>
        <option value="Instalação padrão (R$ 580,00)">Instalação padrão (até 3 metros, tudo incluso)</option>
      </select>
    `;
  } else if (tipo === 'limpeza') {
    resumo.innerHTML = `<strong>Serviço:</strong> Limpeza<br>
    <strong>Valor:</strong> A partir de R$ 180,00<br>
    <strong>Observação:</strong> Pode variar conforme o grau de dificuldade da retirada do ar-condicionado.`;
  } else if (tipo === 'manutencao') {
    extras.innerHTML = `
      <label for="descricaoProblema">Descreva o problema:</label>
      <textarea id="descricaoProblema" rows="4" placeholder="Ex: Ar-condicionado não liga, faz barulho, etc." oninput="gerarResumo()"></textarea>
    `;
  }
});

function gerarResumo() {
  const servico = document.getElementById('servico').value;
  const resumo = document.getElementById('resumo');
  let texto = '';

  if (servico === 'instalacao') {
    const tipoInstalacao = document.getElementById('tipoInstalacao').value;
    if (tipoInstalacao) {
      texto = `<strong>Serviço:</strong> ${tipoInstalacao}`;
    }
  } else if (servico === 'manutencao') {
    const problema = document.getElementById('descricaoProblema').value;
    texto = `<strong>Serviço:</strong> Manutenção<br>
             <strong>Descrição:</strong> ${problema}<br>
             <strong>Observação:</strong> O valor depende do defeito identificado.`;
  }

  resumo.innerHTML = texto;
}

function enviarWhatsapp() {
  const servico = document.getElementById('servico').value;
  const numero = document.getElementById('numero').value;
  let mensagem = '';

  if (!servico || !numero) {
    alert('Por favor, preencha o serviço e o número do WhatsApp.');
    return;
  }

  if (numero.length < 10 || numero.length > 11) {
    alert('Digite um número válido com DDD.');
    return;
  }

  if (servico === 'instalacao') {
    const tipo = document.getElementById('tipoInstalacao').value;
    if (!tipo) {
      alert('Selecione o tipo de instalação.');
      return;
    }
    mensagem = `Olá! Gostaria de solicitar orçamento para:\n\n${tipo}`;
  } else if (servico === 'limpeza') {
    mensagem = `Olá! Gostaria de solicitar orçamento para:\n\nServiço: Limpeza\nValor: A partir de R$ 180,00\nObservação: Pode variar conforme o grau de dificuldade da retirada.`;
  } else if (servico === 'manutencao') {
    const problema = document.getElementById('descricaoProblema').value;
    if (!problema) {
      alert('Por favor, descreva o problema.');
      return;
    }
    mensagem = `Olá! Gostaria de solicitar orçamento para:\n\nServiço: Manutenção\nDescrição do problema: ${problema}\nObservação: O valor depende do defeito identificado.`;
  }

  const url = `https://wa.me/55${numero}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');
}
