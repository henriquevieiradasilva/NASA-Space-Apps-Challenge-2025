from flask import Flask, request, jsonify
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'ml')))
from weather_model import prever_data_futura

app = Flask(__name__)

@app.route('/prever', methods=['POST'])
def prever():
    data_json = request.get_json()  
    if not data_json:
        return jsonify({'erro': 'É necessário enviar um JSON.'}), 400

    data = data_json.get('data')
    lat = data_json.get('lat', -23.08720429991206)
    lon = data_json.get('lon', -47.2100151415641)

    if not data:
        return jsonify({'erro': 'Parametro "data" é obrigatório. Use formato YYYY-MM-DD.'}), 400

    try:
        previsao = prever_data_futura(
            data_futura_str=data,
            lat=lat,
            lon=lon,
            alvos=["T2M", "PRECTOTCORR", "RH2M", "WS2M"] 
        )
        resultado = {
            'data': data,
            'lat': lat,
            'lon': lon,
            'temperatura': previsao.get('Temperatura (°C)'),
            'precipitacao': previsao.get('Precipitação (mm)'),
            'umidade': previsao.get('Umidade (%)'),
            'vento': previsao.get('Vento (m/s)')
        }
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
