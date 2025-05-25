const apiKey = "36e844fdd8c3fba9695755645593ffc0"; // <-- ใส่ API Key ของคุณจาก OpenWeatherMap

async function getWeatherByCity() {
  const city = document.getElementById("city-input").value;
  if (!city) return;

  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=th`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=th`;

  try {
    const [weatherRes, forecastRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(forecastUrl),
    ]);

    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();

    updateWeather(weatherData);
    updateForecast(forecastData.list);
    updateBackground(weatherData.weather[0].main);
  } catch (err) {
    alert("ไม่พบข้อมูลเมือง กรุณาลองใหม่");
  }
}

function updateWeather(data) {
  document.getElementById("location").textContent = `📍 ${data.name}, ${data.sys.country}`;
  document.getElementById("temperature").textContent = `🌡️ ${data.main.temp} °C`;
  const icon = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  document.getElementById("description").innerHTML = `<img src="${iconUrl}" width="48" alt=""> ${data.weather[0].description}`;
  document.getElementById("humidity").textContent = `💧 ความชื้น: ${data.main.humidity}%`;
}

function updateForecast(list) {
  const forecastContainer = document.getElementById("forecast-cards");
  forecastContainer.innerHTML = "";

  const daily = list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 5);
  daily.forEach(day => {
    const date = new Date(day.dt * 1000);
    const options = { weekday: "short", month: "short", day: "numeric" };
    const dayName = date.toLocaleDateString("th-TH", options);
    const temp = `${Math.round(day.main.temp)}°C`;
    const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

    forecastContainer.innerHTML += `
      <div class="forecast-card">
        <div>${dayName}</div>
        <img src="${iconUrl}" alt="" width="40">
        <div>${temp}</div>
      </div>
    `;
  });
}

function updateBackground(condition) {
  const body = document.body;
  let bg = "";

  switch (condition.toLowerCase()) {
    case "clear":
      bg = "linear-gradient(135deg, #56CCF2, #2F80ED)";
      break;
    case "clouds":
      bg = "linear-gradient(135deg, #757F9A, #D7DDE8)";
      break;
    case "rain":
    case "drizzle":
      bg = "linear-gradient(135deg, #314755, #26a0da)";
      break;
    case "thunderstorm":
      bg = "linear-gradient(135deg, #141E30, #243B55)";
      break;
    case "snow":
      bg = "linear-gradient(135deg, #83a4d4, #b6fbff)";
      break;
    default:
      bg = "linear-gradient(135deg, #29323c, #485563)";
  }

  body.style.background = bg;
}