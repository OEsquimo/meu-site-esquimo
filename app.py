from flask import Flask, request, jsonify
from flask_cors import CORS
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

@app.route('/')
def home():
    return "Servidor Flask funcionando!"

@app.route('/agendar', methods=['POST'])
def agendar():
    dados = request.json
    # Faça validações aqui...
    return jsonify({"status": "ok", "mensagem": "Agendamento salvo com sucesso"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
