"""
    --------------------------------------------------
    -   ESTRUTURA BÁSICA DE UMA API - Flask, JSON   -
    --------------------------------------------------
"""


"""
    --------------------------------------------------
    -                   IMPORTAÇÕES:                 -
    -                                                -
    -   Bibliotecas que utilizaremos de objetos,     -
    -   funções e outras estruturas já prontas.      -
    -                                                -
"""

# Framework principal para criar API
from flask import Flask

# Objeto para manipular requisições HTTP
from flask import request

# Função para retornar respostas em JSON
from flask import jsonify

# Permite requisições de outras origens (CORS)
from flask_cors import CORS

"""
    --------------------------------------------------
"""


"""
    --------------------------------------------------
    -                       APP                      -
    -                                                -
    -   Instancia do Flask e configuração básica    -
    -   de CORS para permitir testes.               -
"""

# Cria a aplicação Flask
app = Flask(__name__)

# Permite requisições de qualquer origem (útil para testes)
CORS(app)

"""
    --------------------------------------------------
"""


"""
    --------------------------------------------------
    -               MÉTODO GET DA API                -
    -        (requisição com parâmetros na URL)      -
    -                                                -
"""

# Endpoint GET: /api/example?text=...
@app.route('/api/example', methods=['GET'])
def get_example():
    
    # Captura parâmetro 'text' da URL (query params)
    text_example = request.args.get('text')
    
    # Se não houver parâmetro, retorna erro
    if not text_example:
        return jsonify({"error": "Use query param ?text=..." }), 400
    
    # Resposta de exemplo em JSON
    response = {
        "text": text_example,
        "status": "Requisição GET recebida com sucesso!"
    }

    # Retorna JSON com status HTTP 200
    return jsonify(response), 200

"""
    --------------------------------------------------
"""


"""
    --------------------------------------------------
    -               MÉTODO POST DA API               -
    -         (requisição com parâmetros no body)    -
    -                                                -
"""

# Endpoint POST: /api/example
@app.route('/api/example', methods=['POST'])
def post_example():
    
    # Verifica se o request é JSON
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 400
    
    # Pega dados do corpo da requisição
    body = request.get_json()
    
    # Captura campo 'text' do JSON
    text_example = body.get('text')

    # Se não houver campo, retorna erro
    if not text_example:
        return jsonify({"error": "Missing 'text' in request body"}), 400

    # Resposta de exemplo em JSON
    response = {
        "text": text_example,
        "status": "Requisição POST recebida com sucesso!"
    }
    
    # Retorna JSON com status HTTP 200
    return jsonify(response), 200

"""
    --------------------------------------------------
"""


"""
    --------------------------------------------------
    -                       RUN                       -
    -                                                -
    -   Inicia a aplicação Flask quando executado.  -
    -   host='0.0.0.0' permite acesso externo.       -
    -   porta 5000 é padrão de exemplo.             -
"""

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

"""
    --------------------------------------------------
"""
