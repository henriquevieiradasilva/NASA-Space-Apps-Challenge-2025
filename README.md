# NASA Space Apps Challenge 2025

## 🌧️ Will it Rain on my Parade?

Imagine a situação:

Você marcou um piquenique com os amigos no parque, vai levar o cachorro para passear ou planejou um evento ao ar livre.

No entanto, surge a dúvida: **será que vai chover?**

O **“Will it Rain on my Parade?”** foi criado para responder exatamente essa pergunta!

Nossa solução oferece previsões climáticas personalizadas para qualquer localidade e data, usando uma interface interativa, visualmente atraente e baseada em dados reais da NASA combinados com inteligência artificial.

---

## O Conceito

Durante o **NASA Space Apps Challenge 2025**, nossa equipe pensou em como aproximar as pessoas da ciência de forma simples e visual.  
Queríamos transformar a experiência de “ver o clima” em algo mais **educativo**, **imersivo** e **divertido**.  

O **Will it Rain on my Parade?** é uma aplicação web que integra:
- Visualização 3D realista da Terra (incluindo rotação e textura).
- Dados reais de observação da NASA POWER API.
- Modelos de aprendizado de máquina (Machine Learning).
- Uma interface intuitiva projetada para todos os usuários.

---

## Como funciona

O funcionamento é uma combinação entre **geolocalização**, **consulta a APIs**, e **modelagem preditiva**.  

1. O usuário digita o nome de uma **cidade** e escolhe uma **data** no futuro.  
2. O sistema consulta a **API Nominatim (OpenStreetMap)** para obter latitude e longitude da cidade.  
3. O backend em Python recebe as coordenadas e faz uma requisição à **NASA POWER API**, coletando dados históricos de clima (temperatura, precipitação, vento, umidade, radiação solar etc.).  
4. Um modelo de **Machine Learning (Random Forest Regressor)** desenvolvido em python usando scikitlearn analisa o histórico e prevê como estarão as condições meteorológicas na data informada.  
5. O resultado é enviado de volta ao frontend e exibido de forma visual:
   - 🌐 Um marcador aparece no globo;
   - 📊 Um painel mostra as variáveis climáticas previstas;
   - 🌡 Por fim, uma mensagem interpretativa resume a previsão (ex.: *Perfect*, *Very wet*, *Very windy*, *Very hot*).

---

## Guia de uso

1. Acesse o site e clique em **“Travel”** para começar.  
2. O globo 3D se aproxima suavemente, e o painel de busca aparece.  
3. Digite o nome de uma **cidade** (ex: *Paris*, *Tokyo*, *São Paulo*).  
4. Escolha uma **data futura** no calendário.  
5. Clique em **“Find 🔍”**.  
6. O planeta gira até o local escolhido e marca o ponto no mapa.  
7. O painel lateral mostra:
   - Temperatura média prevista  
   - Umidade relativa do ar  
   - Velocidade do vento  
   - Precipitação esperada  
8. Uma mensagem resume o clima de forma amigável:
   - “Perfect 😎” – tempo agradável  
   - “Very wet 🌧️” – alta chance de chuva  
   - “Very windy 🌬️” – ventos fortes  
   - “Very hot 🌞” – calor intenso  


---

## Tecnologias utilizadas

### Frontend

| Tecnologia | Função |
|-------------|--------|
| **HTML5 / CSS3 / JavaScript (ES6+)** | Estrutura e comportamento da interface. |
| **Three.js** | Renderização 3D do planeta Terra com texturas e iluminação realista. |
| **Fetch API** | Comunicação com o backend Flask (requisições REST). |
| **OpenStreetMap / Nominatim API** | Conversão de nomes de cidades para coordenadas geográficas. |
| **Custom UI & Animations** | Efeitos de transição, botões animados e alertas personalizados. |

Destaques do frontend:
- O planeta 3D possui **textura de relevo**, **brilho atmosférico** e **campo estelar animado**.
- O movimento da câmera é suave, simulando uma “viagem pelo espaço”.
- A interface é **totalmente responsiva**, adaptando-se a desktop e mobile.

---

### Backend

| Tecnologia | Função |
|-------------|--------|
| **Python 3** | Linguagem principal do backend. |
| **Flask + Flask-CORS** | Criação da API RESTful que conecta o frontend à IA. |
| **scikit-learn** | Implementação do modelo de Machine Learning (Random Forest). |
| **pandas / numpy** | Manipulação e análise de dados meteorológicos. |
| **NASA POWER API** | Fonte de dados históricos de clima (satélite e estação). |

Destaques do backend:
- O modelo treina automaticamente com dados reais dos últimos 5 anos.
- São previstos quatro parâmetros principais:
  - Temperatura (°C)
  - Precipitação (mm/dia)
  - Umidade relativa (%)
  - Velocidade do vento (m/s)
- Retorna os resultados em formato JSON padronizado.

---

## Inteligência Artificial e Previsão

O coração do projeto é a Inteligência Artificial (IA), responsável por transformar dados históricos brutos da NASA em uma previsão climática preditiva e acionável. Nosso modelo não apenas reporta o clima, mas aprende com ele para antecipar as condições futuras com maior precisão para o seu evento.

Nosso modelo de Machine Learning é treinado com dados históricos dos últimos 5 anos fornecidos pela NASA, capturando padrões sazonais e ciclos anuais de:
- Temperatura (T2M)
- Precipitação (PRECTOTCORR)
- Umidade Relativa (RH2M)
- Velocidade do Vento (WS2M)


Para cada data futura solicitada, o pipeline:
- Coleta os dados históricos da janela de anos anteriores.
- Pré-processa os dados para o formato ideal do modelo.
- Prevê os quatro parâmetros principais para a coordenada.

---

## Instalação e Execução

### 1. Clonar o repositório
```bash
git clone https://github.com/seuusuario/NASA-Space-Apps-Challenge-2025.git
cd NASA-Space-Apps-Challenge-2025
```

### 2. Configurar o backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # no Windows: venv\Scripts\activate
pip install -r requirements.txt
python api.py
```

O backend estará disponível em:
```bash
http://127.0.0.1:5000
```

### 3️. Executar o frontend
Digite uma cidade (ex: Lisboa) e uma data.

O sistema exibirá o ponto no globo e o painel de resultados. 🌍💫

## Autores (Team TPM)
- Alisson Moura
- Henrique Vieira
- Lucas Verissimo

## Licença

Distribuído sob a licença **MIT**.

Créditos aos dados da *NASA POWER Project* e *OpenStreetMap*.


