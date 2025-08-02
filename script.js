document.addEventListener('DOMContentLoaded', function () {
  const tipoSelect = document.getElementById('tipo');
  const btusDiv = document.getElementById('btusDiv');
  const manutencaoDiv = document.getElementById('manutencaoDiv');
  const btusSelect = document.getElementById('btus');
  const descricao = document.getElementById('descricao');
  const valorSpan = document.getElementById('valor');
  const agendarBtn = document.getElementById('agendarBtn');
  const formularioAgendamento = document.getElementById('formularioAgendamento');

  // Mostrar campos específicos dependendo do tipo de serviço
  tipoSelect.addEventListener('change', function () {
    const tipo = this.value;
    btusDiv.classList.add('hidden');
    manutencaoDiv.classList.add('hidden');
    valorSpan.textContent = "";
    agendarBtn.classList.add('hidden');
    formularioAgendamento.classList.add('hidden');

    if (tipo === 'instalacao' || tipo === 'limpeza') {
      btusDiv.classList.remove('hidden');
    } else if (tipo === 'manutencao') {
      manutencaoDiv.classList.remove('hidden');
    }
  });

  // Calcular valor automaticamente
  document.getElementById('btus').addEventListener('change', calcularValor);
  document.getElementById('tipo').addEventListener('change', calcularValor);

  function calcularValor() {
    const tipo = tipoSelect.value;
    const btus = btusSelect.value;

    let valor = 0;

    if (tipo === 'instalacao') {
      if (btus === '9000' || btus === '12000') valor = 250;
      else if (btus === '18000') valor = 300;
      else if (btus === '24000') valor = 350;
      else if (btus === '30000') valor = 400;
    }

    if (tipo === 'limpeza') {
      if (btus === '9000' || btus === '12000') valor = 100;
      else if (btus === '18000') valor = 150;
      else if (btus === '24000') valor = 200;
      else if (btus === '30000') valor = 250;
    }

    if (tipo === 'manutencao') {
      valor = 120;
    }

    if (valor > 0) {
      valorSpan.textContent = `Valor estimado: R$ ${valor},00`;
      agendarBtn.classList.remove('hidden');
    } else {
      valorSpan.textContent = "";
      agendarBtn.classList.add('hidden');
    }
  }

  // Preencher e mostrar formulário de agendamento
  agendarBtn.addEventListener('click', function () {
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const endereco = document.getElementById('endereco').value;
    const tipo = tipoSelect.value;
    const btus = btusSelect.value;
    const obs = descricao.value;
    const valorTexto = valorSpan.textContent.replace("Valor estimado: ", "");

    document.getElementById('agNome').value = nome;
    document.getElementById('agTelefone').value = telefone;
    document.getElementById('agEndereco').value = endereco;
    document.getElementById('agServico').value = tipo.charAt(0).toUpperCase() + tipo.slice(1);
    document.getElementById('agBtus').value = btus ? `${btus} BTUs` : '';
    document.getElementById('agObs').value = obs;
    document.getElementById('agValor').value = valorTexto;

    formularioAgendamento.classList.remove('hidden');
    agendarBtn.classList.add('hidden');
  });
});

// Simula confirmação do agendamento
function confirmarAgendamento() {
  const data = document.getElementById('agData').value;
  const hora = document.getElementById('agHora').value;
  const pagamento = document.getElementById('agPagamento').value;

  if (!data || !hora || !pagamento) {
    alert('Preencha data, hora e forma de pagamento!');
    return;
  }

  alert('Agendamento confirmado!');
}
