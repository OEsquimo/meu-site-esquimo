from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import os
import json

app = Flask(__name__)
CORS(app)

ARQUIVO = 'banco.json'

def carregar_agendamentos():
    if not os.path.exists(ARQUIVO):
        return {}
    with open(ARQUIVO, 'r', encoding='utf-8') as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return {}

def salvar_agendamentos(dados):
    with open(ARQUIVO, 'w', encoding='utf-8') as f:
        json.dump(dados, f, ensure_ascii=False, indent=2)

def horario_disponivel(nova_data, nova_hora):
    agendamentos = carregar_agendamentos()
    # Verifica se existe algum agendamento no mesmo dia e hora
    for agendamento in agendamentos.values():
        if agendamento['data'] == nova_data and agendamento['hora'] == nova_hora:
            return False
    return True

@app.route('/')
def home():
    return "Servidor Flask funcionando!"

@app.route('/agendar', methods=['POST'])
def agendar():
    dados = request.json

    # Campos esperados no JSON
    nome = dados.get('nome')
    telefone = dados.get('telefone')
    endereco = dados.get('endereco')
    tipo = dados.get('tipo')
    btus = dados.get('btus')
    obs = dados.get('obs')
    valor = dados.get('valor')
    data = dados.get('data')
    hora = dados.get('hora')
    pagamento = dados.get('pagamento')

    # Validação básica
    campos = [nome, telefone, endereco, tipo, data, hora, pagamento]
    if not all(campos):
        return jsonify({"status": "erro", "mensagem": "Campos obrigatórios faltando"}), 400

    # Verifica se o horário está disponível
    if not horario_disponivel(data, hora):
        return jsonify({"status": "erro", "mensagem": "Horário indisponível"}), 400

    agendamentos = carregar_agendamentos()

    # Usa telefone + data + hora como id único
    id_agendamento = f"{telefone}_{data}_{hora}"
    agendamentos[id_agendamento] = {
        "nome": nome,
        "telefone": telefone,
        "endereco": endereco,
        "tipo": tipo,
        "btus": btus,
        "obs": obs,
        "valor": valor,
        "data": data,
        "hora": hora,
        "pagamento": pagamento
    }

    salvar_agendamentos(agendamentos)

    # Aqui você pode adicionar lógica para enviar mensagem para seu WhatsApp via API externa, se quiser

    return jsonify({"status": "ok", "mensagem": "Agendamento salvo com sucesso"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
