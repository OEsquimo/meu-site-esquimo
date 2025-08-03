
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime, timedelta

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
    ag
