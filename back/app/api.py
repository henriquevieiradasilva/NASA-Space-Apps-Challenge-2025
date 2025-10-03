# API Flask para previsão usando weather_model.py
from flask import Flask, request, jsonify
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'ml')))
from weather_model import prever_data_futura_anos

app = Flask(__name__)


@app.route('/prever', methods=['GET'])
def prever():
    data = request.args.get('data')   
    lat = request.args.get('lat', default=-23.08720429991206, type=float)
    lon = request.args.get('lon', default=-47.2100151415641, type=float)

    if not data:
        return jsonify({'erro': 'Parametro "data" é obrigatorio. Use formato YYYY-MM-DD.'}), 400
    try:
        previsao = prever_data_futura_anos(data, lat=lat, lon=lon)
        return jsonify({
            'data': data,
            'lat': lat,
            'lon': lon,
            'previsao': previsao
        })
    except Exception as e:
        return jsonify({'erro': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
