import React, { useEffect, useRef, useState } from "react";
import "./Weather.css";

import search_icon from "../assets/icons/search.png";
import clear_icon from "../assets/icons/clear.png";
import cloud_icon from "../assets/icons/cloud.png";
import drizzle_icon from "../assets/icons/drizzle.png";
import rain_icon from "../assets/icons/rain.png";
import snow_icon from "../assets/icons/snow.png";
import wind_icon from "../assets/icons/wind.png";
import humidity_icon from "../assets/icons/humidity.png";

import clearSkyVideo from "../assets/original_videos/clear_video.mp4";
import cloudyVideo from "../assets/original_videos/cloud_video.mp4";
import drizzleVideo from "../assets/original_videos/drizzle_video.mp4";
import snowVideo from "../assets/original_videos/snowy_video.mp4";
import rainVideo from "../assets/original_videos/rainy_video.mp4";

const weather = () => {
  const inputRef = useRef();

  const [weatherData, setWeatherData] = useState(false);

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  const videoMap = {
    "01d": clearSkyVideo,
    "01n": clearSkyVideo,
    "02d": cloudyVideo,
    "02n": cloudyVideo,
    "03d": cloudyVideo,
    "03n": cloudyVideo,
    "04d": drizzleVideo,
    "04n": drizzleVideo,
    "09d": rainVideo,
    "09n": rainVideo,
    "10d": rainVideo,
    "10n": rainVideo,
    "13d": snowVideo,
    "13n": snowVideo,
  };

  const search = async (city) => {
    if (city === "") {
      alert("Oops! Looks like you forgot to enter a city!");
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${
        import.meta.env.VITE_WEATHERAPP_ID
      }`;

      const response = await fetch(url);

      const weatherData = await response.json();

      if (!response.ok) {
        alert("City not found!");
        return;
      }

      console.log("Fetched weather data:", weatherData);
      const { main, wind, weather } = weatherData;
      const icon = allIcons[weather[0].icon] || clear_icon;
      const videoSrc = videoMap[weather[0].icon] || clearSkyVideo;

      setWeatherData({
        humidity: main.humidity,
        windSpeed: wind.speed,
        temperature: Math.floor(main.temp),
        location: weatherData.name,
        icon: icon,
        videoSrc: videoSrc,
      });
    } catch (error) {
      setWeatherData(false);
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    search("Chennai");
  }, []);

  return (
    <div className="weather">
      <div className="weatherContainer">
        <h1 className="app-name">Sky Cast</h1>
        <div className="search-bar">
          <input type="text" placeholder="Search for a city" ref={inputRef} />
          <img
            src={search_icon}
            alt="search-icon"
            onClick={() => search(inputRef.current.value)}
          />
        </div>

        {weatherData ? (
          <>
            <video
              className="weather-background"
              autoPlay
              loop
              muted
              playsInline
              src={weatherData.videoSrc}
            >
              <source src={weatherData.videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <img
              src={weatherData.icon}
              alt="clear-icon"
              className="weather-icon"
            />
            <p className="temperature">{weatherData.temperature}°C</p>
            <p className="location">{weatherData.location}</p>
            <div className="weather-data">
              <div className="col">
                <img src={humidity_icon} alt="humidity-icon" />
                <div>
                  <p>{weatherData.humidity}</p>
                  <span>Humidity</span>
                </div>
              </div>
              <div className="col">
                <img src={wind_icon} alt="wind-icon" />
                <div>
                  <p>{weatherData.windSpeed}</p>
                  <span>Wind Speed</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default weather;
