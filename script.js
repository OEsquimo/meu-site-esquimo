document.getElementById('tipo').addEventListener('change', function () {
  const tipo = this.value;
  const detalhes = document.getElementById('detalhesServico');
  const instalacao = document.getElementById('instalacao-opcoes');
  const limpeza = document.getElementById('limpeza-opcoes');
  const manutencao = document.getElementById('manutencao-opcoes');
  const resumo = document.getElementById('resumo');
  const textoResumo = document.getElementById('textoResumo');

  detalhes.classList.remove('hidden');
  instalacao.classList.add('hidden');
  limpeza.classList.add('hidden');
  manutencao.classList.add('hidden');
  resumo.classList.add('hidden');
  textoResumo.textContent = '';

  if (tipo === 'instalacao') {
    instalacao.classList.remove('hidden');
  } else if (tipo === 'limpeza') {
    limpeza.classList.remove('hidden');
    textoResumo.textContent = "Serviço de limpeza a partir de R$ 180,00 (dependendo do grau de dificuldade para retirada do ar-condicionado).";
    resumo.classList.remove('hidden');
  } else if (tipo === 'manutencao') {
    manutencao.classList.remove('hidden');
    textoResumo.textContent = "Serviço de manutenção sujeito à análise no local. Valor sob consulta.";
    resumo.classList.remove('hidden');
  }
});

document.getElementById('opcaoInstalacao').addEventListener('change', function () {
  const textoResumo = document.getElementById('textoResumo');
  const resumo = document.getElementById('resumo');
  if (this.value) {
    textoResumo.textContent = this.value;
    resumo.classList.remove('hidden');
  } else {
    textoResumo.textContent = '';
    resumo.classList.add('hidden');
  }
});

document.getElementById('enviarWhatsapp').addEventListener('click', function () {
  const numero = document.getElementById('numeroWhatsapp').value;
  const texto = document.getElementById('textoResumo').textContent;

  if (numero.length < 10 || numero.length > 11) {
    alert("Digite um número de WhatsApp válido com DDD.");
    return;
  }

  const mensagem = encodeURIComponent(`Olá! Gostaria de solicitar esse serviço:\n\n${texto}`);
  const link = `https://wa.me/55${numero}?text=${mensagem}`;

  window.open(link, '_blank');
});
