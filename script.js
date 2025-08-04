function gerarOrcamento() {
    const nome = document.getElementById('nome').value;
    const localizacao = document.getElementById('localizacao').value;
    const servico = document.getElementById('servico').value;
    const btu = document.getElementById('btu').value;
    const quantidade = parseInt(document.getElementById('quantidade').value);

    let valorUnitario = 0;

    if (servico === 'instalacao') {
        if (btu === '9000') valorUnitario = 250;
        else if (btu === '12000') valorUnitario = 280;
        else if (btu === '18000') valorUnitario = 300;
        else if (btu === '24000') valorUnitario = 350;
    } else if (servico === 'limpeza') {
        if (btu === '9000') valorUnitario = 100;
        else if (btu === '12000') valorUnitario = 110;
        else if (btu === '18000') valorUnitario = 130;
        else if (btu === '24000') valorUnitario = 150;
    } else if (servico === 'manutencao') {
        if (btu === '9000') valorUnitario = 120;
        else if (btu === '12000') valorUnitario = 140;
        else if (btu === '18000') valorUnitario = 160;
        else if (btu === '24000') valorUnitario = 180;
    } else if (servico === 'limpezaJanela') {
        valorUnitario = 90;
    }

    const valorTotal = valorUnitario * quantidade;

    const mensagem = `🧊 Orçamento O Esquimó 🧊\n\n👤 Cliente: ${nome}\n📍 Localização: ${localizacao}\n🛠️ Serviço: ${document.getElementById('servico').selectedOptions[0].text}\n❄️ Capacidade: ${btu} BTUs\n🔢 Quantidade: ${quantidade}\n💰 Valor total: R$ ${valorTotal.toFixed(2)}`;

    document.getElementById('resultado').innerText = mensagem;

    const numeroWhatsApp = '5581983259341';
    const mensagemCodificada = encodeURIComponent(mensagem);
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;
    document.getElementById('linkWhatsApp').href = urlWhatsApp;
    document.getElementById('linkWhatsApp').style.display = 'inline-block';
}
