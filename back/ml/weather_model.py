# back/ml/weather_model.py

import requests
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error
from sklearn.metrics import mean_squared_error as root_mean_squared_error
from datetime import datetime, timedelta
from concurrent.futures import ThreadPoolExecutor

# ==========================================
# 1) Função para baixar dados
# ==========================================
def baixar_dados(start, end, lat=-23.08720429991206, lon=-47.2100151415641):
    BASE_URL = "https://power.larc.nasa.gov/api/temporal/hourly/point"
    params = {
        "parameters": "T2M,RH2M,WS2M,ALLSKY_SFC_SW_DWN,PRECTOTCORR",
        "community": "AG",
        "longitude": lon,
        "latitude": lat,
        "format": "JSON",
        "start": start,
        "end": end
    }
    response = requests.get(BASE_URL, params=params)
    if response.status_code == 200:
        data = response.json()
        parameters = data["properties"]["parameter"]
        df = pd.DataFrame(parameters)
        df.index = pd.to_datetime(df.index, format="%Y%m%d%H")
        df = df.sort_index()
        return df
    else:
        raise ValueError(f"Erro {response.status_code}: {response.text}")

# ==========================================
# 2) Coletar histórico de anos anteriores (paralelo)
# ==========================================
def coletar_historico_anos(data_futura_str, anos=5, janela_dias=7, lat=-23.08720429991206, lon=-47.2100151415641):
    data_futura = pd.to_datetime(data_futura_str)
    df_list = []

    def baixar_ano(i):
        ano = data_futura.year - i
        data_base = data_futura.replace(year=ano)
        start = (data_base - timedelta(days=janela_dias)).strftime("%Y%m%d")
        end   = (data_base + timedelta(days=janela_dias)).strftime("%Y%m%d")
        try:
            return baixar_dados(start, end, lat, lon)
        except Exception as e:
            print(f"Erro ao baixar dados do ano {ano}: {e}")
            return None

    with ThreadPoolExecutor() as executor:
        resultados = executor.map(baixar_ano, range(1, anos+1))

    for r in resultados:
        if r is not None:
            df_list.append(r)

    if not df_list:
        raise ValueError("Nenhum dado histórico foi baixado.")
    df_total = pd.concat(df_list).sort_index()
    return df_total

# ==========================================
# 3) Treinar modelo e prever
# ==========================================
def treinar_e_prever(df_historico, data_futura_str, target="T2M", janela=24):
    # Normaliza os dados
    scaler = StandardScaler()
    df_scaled = pd.DataFrame(scaler.fit_transform(df_historico), index=df_historico.index, columns=df_historico.columns)

    # Cria janelas temporais
    X, y = [], []
    for i in range(len(df_scaled) - janela):
        X.append(df_scaled.iloc[i:i+janela].values.flatten())
        y.append(df_scaled[target].iloc[i+janela])
    X = np.array(X)
    y = np.array(y)

    # Divide treino/teste (80/20)
    split = int(len(X) * 0.8)
    X_train, X_test = X[:split], X[split:]
    y_train, y_test = y[:split], y[split:]

    # Treina RandomForest
    model = RandomForestRegressor(n_estimators=30, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)

    # Métricas
    preds_test = model.predict(X_test)
    target_scaler = StandardScaler()
    target_scaler.fit(df_historico[[target]])
    y_test_real = target_scaler.inverse_transform(y_test.reshape(-1,1)).flatten()
    preds_real = target_scaler.inverse_transform(preds_test.reshape(-1,1)).flatten()
    rmse = root_mean_squared_error(y_test_real, preds_real)
    mae = mean_absolute_error(y_test_real, preds_real)

    # Previsão para a data futura
    ultima_janela = df_scaled.iloc[-janela:].values.flatten().reshape(1, -1)
    pred_futura_scaled = model.predict(ultima_janela)
    pred_futura_real = target_scaler.inverse_transform(pred_futura_scaled.reshape(-1,1))[0,0]

    return pred_futura_real, rmse, mae

# ==========================================
# 4) Função principal
# ==========================================
def prever_data_futura(data_futura_str, anos=5, janela_dias=7, janela_modelo=24,
                                 lat=-23.08720429991206, lon=-47.2100151415641,
                                 alvos=["T2M", "PRECTOTCORR", "RH2M", "WS2M", "ALLSKY_SFC_SW_DWN"]):
    print(f"\n===== Previsão para {data_futura_str} =====\n")
    df_hist = coletar_historico_anos(data_futura_str, anos=anos, janela_dias=janela_dias, lat=lat, lon=lon)
    
    nomes_amigaveis = {
        "T2M": "Temperatura (°C)",
        "PRECTOTCORR": "Precipitação (mm)",
        "RH2M": "Umidade (%)",
        "WS2M": "Vento (m/s)",
        "ALLSKY_SFC_SW_DWN": "Neve / Insolação (MJ/m²)"
    }
    
    resultados = {}
    for alvo in alvos:
        try:
            pred, rmse, mae = treinar_e_prever(df_hist, data_futura_str, target=alvo, janela=janela_modelo)
            resultados[nomes_amigaveis.get(alvo, alvo)] = pred
            print(f"{nomes_amigaveis.get(alvo, alvo)}:")
            print(f"  Previsão: {pred:.2f}")
            print(f"  RMSE teste: {rmse:.2f}, MAE teste: {mae:.2f}\n")
        except Exception as e:
            resultados[nomes_amigaveis.get(alvo, alvo)] = None
            print(f"{nomes_amigaveis.get(alvo, alvo)}: Não foi possível prever ({e})\n")
    
    print("===== Fim da previsão =====\n")
    return resultados

# ==========================================
# 5) Teste local
# ==========================================
if __name__ == "__main__":
    data_teste = "2025-10-04"
    previsoes = prever_data_futura_multialvo(
        data_teste,
        lat=-23.55,
        lon=-46.63,
        alvos=["T2M", "PRECTOTCORR", "RH2M", "WS2M", "ALLSKY_SFC_SW_DWN"]
    )
