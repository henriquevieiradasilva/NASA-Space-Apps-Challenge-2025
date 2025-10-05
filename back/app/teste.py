import requests

url = "http://localhost:5000/prever"
dados = {
    "data": "2025-12-15",  # inverno no hemisfério norte
    "lat": 39.1911,
    "lon": -106.8175
}

response = requests.post(url, json=dados)

if response.status_code == 200:
    print("Resposta:")
    print(response.json())
else:
    print(f"Erro {response.status_code}: {response.text}")
