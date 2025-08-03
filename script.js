document.getElementById('servico').addEventListener('change', function () {
  const servico = this.value;
  const btuContainer = document.getElementById('btuContainer');
  if (servico) {
    btuContainer.style.display = 'block';
  } else {
    btuContainer.style.display = 'none';
  }
});

document.getElementById('formulario').addEventListener('submit', function (e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const telefone = document.getElementById('telefone').value;
  const servico = document.getElementById('servico').value;
  const btu = document.getElementById('btu').value;

  let valor = 0;
  if (servico === 'Instalação') {
    if (btu === '9000') valor = 200;
    else if (btu === '12000') valor = 220;
    else if (btu === '18000') valor = 250;
    else if (btu === '24000') valor = 280;
  } else if (servico === 'Limpeza') {
    valor = 100;
  } else if (servico === 'Manutenção') {
    valor = 150;
  }

  const texto = `Olá ${nome}, o valor estimado para o serviço de ${servico}${btu ? ` (${btu} BTUs)` : ''} é R$ ${valor},00.`;
  document.getElementById('textoOrcamento').innerText = texto;
  document.getElementById('resultado').style.display = 'block';

  const mensagemWhats = `Nome: ${nome}%0ATelefone: ${telefone}%0AServiço: ${servico}%0ABTU: ${btu}%0AValor estimado: R$ ${valor},00`;
  const link = `https://wa.me/5583983259341?text=${mensagemWhats}`;
  document.getElementById('linkWhatsapp').href = link;
});
