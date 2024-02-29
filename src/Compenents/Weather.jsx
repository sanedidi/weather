import React, { useState, useEffect } from "react";
import "./Weather.scss";
import clear from "../assets/clear.jpg";
import cloud from "../assets/cloud.avif";
import drizzle from "../assets/drizzle.avif";
import humidity1 from "../assets/humidity.png";
import rain from "../assets/rain.avif";
import search__icon from "../assets/search.png";
import snow from "../assets/snow.jpg";
import wind from "../assets/wind.png";

const Weather = () => {
  const [country, setCountry] = useState("");
  const [weatherData, setWeatherData] = useState({
    humidity: null,
    windSpeed: null,
    temperature: null,
    location: "Choose",
    weatherIcon: clear,
  });

  const [uzbekCitiesWeather, setUzbekCitiesWeather] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);

  const API_KEY = "9f2b65c06589e9bcc829867591a46c84";

  useEffect(() => {
    const fetchWeatherData = async (city) => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        if (!response.ok) {
          throw new Error('City not found');
        }
        const data = await response.json();

        setWeatherData({
          humidity: Math.floor(data.main.humidity),
          windSpeed: Math.floor(data.wind.speed),
          temperature: data.main.temp,
          location: data.name,
          weatherIcon: getWeatherIcon(data.weather[0].icon),
        });
      } catch (error) {
        console.error("Error fetching weather data:", error);
        // Установить состояние для отображения сообщения об ошибке
        setWeatherData({
          humidity: null,
          windSpeed: null,
          temperature: null,
          location: "City not found",
          weatherIcon: clear,
        });
      }
    };

    if (selectedCity) {
      fetchWeatherData(selectedCity);
    }
  }, [selectedCity]);

  useEffect(() => {
    const fetchUzbekCitiesWeather = async () => {
      try {
        const uzbekCities = ["Tashkent", "Samarkand", "Bukhara"]; 
        const uzbekCitiesWeatherData = [];

        for (const city of uzbekCities) {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
          const data = await response.json();

          uzbekCitiesWeatherData.push({
            location: data.name,
            temperature: data.main.temp,
          });
        }

        setUzbekCitiesWeather(uzbekCitiesWeatherData);
      } catch (error) {
        console.error("Error fetching Uzbek cities weather:", error);
      }
    };

    fetchUzbekCitiesWeather();
  }, []);

  const getWeatherIcon = (iconCode) => {
    switch (iconCode) {
      case "01d":
      case "01n":
        return clear;
      case "02d":
      case "02n":
        return cloud;
      case "03d":
      case "03n":
        return drizzle;
      case "04d":
      case "04n":
        return drizzle;
      case "09d":
      case "09n":
        return rain;
      case "10d":
      case "10n":
        return rain;
      case "13d":
      case "13n":
        return snow;
      default:
        return clear;
    }
  };

  const handleCityClick = (city) => {
    setSelectedCity(city);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setSelectedCity(country);
    }
  };

  return (
    <section
      className="weather"
      style={{
        backgroundImage: `url(${weatherData.weatherIcon})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <div className="container">
        <div className="weather__wrapper">
          <div className="weather__top">
            <input
              className="weather__input"
              placeholder="Search countries"
              type="text"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              onKeyPress={handleKeyPress} // Добавляем обработчик нажатия клавиши
            />
            <div
              className="weather__icon"
              onClick={() => setSelectedCity(country)}
            >
              <img src={search__icon} alt="" />
            </div>
          </div>
          <div className="weather__cont">
            <div className="weather__left">
              <div className="weather__info">
                <div className="weather__img"></div>
                <div className="weather__temperature">
                  <div className="weather__temp">
                    {weatherData.temperature
                      ? `${weatherData.temperature} °C`
                      : "?"}
                  </div>
                  <div className="weather__loc">{weatherData.location}</div>
                </div>
                <div className="weather__data">
                  <div className="weather__el">
                    <img src={humidity1} alt="humidity" />
                    <div className="weather__item-data">
                      <div className="weather__hum">
                        {weatherData.humidity
                          ? `${weatherData.humidity}%`
                          : "?"}
                      </div>
                      <div className="weather__hum-text">Humidity</div>
                    </div>
                  </div>
                  <div className="weather__el">
                    <img src={wind} alt="wind" />
                    <div className="weather__item-data">
                      <div className="weather__speed">
                        {weatherData.windSpeed
                          ? `${weatherData.windSpeed} km/h`
                          : "?"}
                      </div>
                      <div className="weather__hum-text">Wind Speed</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="weather__right">
              <h2>Uzbekistan Cities Weather</h2>
              <ul>
                {uzbekCitiesWeather.map((cityWeather, index) => (
                  <li
                    key={index}
                    onClick={() => handleCityClick(cityWeather.location)}
                  >
                    <span>{cityWeather.location}: </span>
                    <span>
                      {cityWeather.temperature
                        ? `${cityWeather.temperature} C`
                        : "?"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Weather;
