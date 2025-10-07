# NASA Space Apps Challenge 2025

## 🌧️ Will it Rain on my Parade?

Imagine this scenario:

You’ve planned a picnic with friends in the park, want to take your dog for a walk, or organized an outdoor event.

But then the question arises: **will it rain?**

**“Will it Rain on my Parade?”** was created to answer exactly that!

Our solution offers custom weather forecasts for any location and date, through an interactive, visually appealing interface powered by **NASA data and AI**. 🤖🌍

---

## 💡 The Concept

During the **NASA Space Apps Challenge 2025**, our team wanted to bring people closer to science in a **simple and visual way**.  

We aimed to make the experience of "checking the weather" **educational**, **immersive**, and **fun**. 

**Will it Rain on my Parade?** is a web application that integrates:
- Realistic 3D Earth visualization (including rotation and texture)  
- Real NASA POWER API observation data  
- Machine Learning models  
- An intuitive interface designed for all users  

---

## ⚙️ How It Works

The system combines **geolocation**, **API queries**, and **predictive modeling**.

1. The user enters a **city** and selects a **future date**.
2. The system uses the **Nominatim API (OpenStreetMap)** to get the city’s latitude and longitude.  
3. The Python backend fetches historical weather data from the **NASA POWER API** (temperature, precipitation, wind, humidity, solar radiation, etc.).
4. A **Machine Learning model (Random Forest Regressor)** analyzes historical patterns to predict the weather for the selected date.   
5. The results are sent to the frontend and displayed visually:  
   - 🌐 A marker appears on the globe  
   - 📊 A panel shows predicted weather variables  
   - 🌡 A friendly message summarizes the forecast (e.g., *Perfect*, *Very wet*, *Very windy*, *Very hot*)  

---

## 📝 User Guide

1. Access the site and click **“Travel”** to start.  
2. The 3D globe zooms in, and the search panel appears.  
3. Enter a **city name** (e.g., *Paris*, *Tokyo*, *São Paulo*).  
4. Choose a **future date** from the calendar.  
5. Click **“Find 🔍”**.  
6. The globe rotates to the chosen location, marking the point.  
7. The side panel shows:  
   - 🌡 Average predicted temperature  
   - 💧 Relative humidity  
   - 🌬 Wind speed  
   - 🌧 Expected precipitation  
8. A message summarizes the weather:  
   - “Perfect 😎” – pleasant weather  
   - “Very wet 🌧️” – high chance of rain  
   - “Very windy 🌬️” – strong winds  
   - “Very hot 🌞” – intense heat  


---

## 🛠️ Technologies 

### Frontend

| Technology | Purpose |
|------------|---------|
| **HTML5 / CSS3 / JavaScript (ES6+)** | Structure and behavior of the interface |
| **Three.js** | 3D Earth rendering with realistic textures and lighting |
| **Fetch API** | Communication with Python backend via REST requests |
| **OpenStreetMap / Nominatim API** | Converts city names to geographic coordinates |
| **Custom UI & Animations** | Smooth transitions, animated buttons, and alerts |

**Frontend Highlights:**  
- 3D planet with **terrain textures**, **atmospheric glow**, and **animated starfield** ✨  
- Smooth camera movement simulates a “space journey” 
- Fully **responsive design** for desktop and mobile 

---

### Backend

| Technology | Purpose |
|------------|---------|
| **Python 3** | Main backend language |
| **Flask + Flask-CORS** | RESTful API connecting frontend to AI |
| **scikit-learn** | Machine Learning model (Random Forest) |
| **pandas / numpy** | Weather data processing and analysis |
| **NASA POWER API** | Historical weather data from satellite and stations |

**Backend Highlights:**  
- Model trains automatically with the last 5 years of real data  
- Predicts 4 main parameters:  
  - 🌡 Temperature (°C)  
  - 🌧 Precipitation (mm/day)  
  - 💧 Relative humidity (%)  
  - 🌬 Wind speed (m/s)  
- Returns results in standardized JSON format  

---

## 🤖 AI and Forecasting

At the core is **Artificial Intelligence**, which transforms raw NASA data into actionable weather predictions.  
Our ML model **learns from historical patterns** to forecast weather accurately for your planned event.  

The model is trained with the last 5 years of NASA data, capturing **seasonal patterns**:  
- 🌡 Temperature (T2M)  
- 🌧 Precipitation (PRECTOTCORR)  
- 💧 Relative Humidity (RH2M)  
- 🌬 Wind Speed (WS2M)  

For each future date, the pipeline:  
1. Collects historical data from previous years  
2. Preprocesses it for the model  
3. Predicts the four main weather parameters for the given coordinates  

---

## ⚡ Installation & Run

### 1️⃣ Clone the repository
```bash
git clone https://github.com/seuusuario/NASA-Space-Apps-Challenge-2025.git
cd NASA-Space-Apps-Challenge-2025
```

### 2️⃣ Setup the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # no Windows: venv\Scripts\activate
pip install -r requirements.txt
python api.py
```

Backend will be available at:
```bash
http://127.0.0.1:5000
```

### 3️⃣ Run the frontend
Enter a city (e.g., Lisbon) and a date.

The globe will mark the location and display the forecast panel. 🌍💫

## 👥 Authors (Team TPM)
- Alisson Moura
- Henrique Vieira
- Lucas Verissimo

## 📄 License

Distributed under the **MIT License**.

Credits to *NASA POWER Project* and *OpenStreetMap*.


