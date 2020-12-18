import React, { useEffect, useState } from "react";

import axios from "axios";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Pollution = (props) => {
  const [pollutionData, setPollutionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("");
  const setAqiColor = (aqi) => {
    console.log(aqi);
    let color = "#14ea14";
    switch (true) {
      case aqi > 7 && aqi <= 10:
        color = "#14ea14";

        break;
      case aqi >= 4 && aqi <= 7:
        color = "#ead014";
        break;
      case aqi >= 0:
        color = "#ea6314";
        break;
      default:
        break;
    }

    return color;
  };

  const loadPollutionData = async (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    setLoading(true);
    //console.log(latitude, longitude);
    try {
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=b9dfff4772ea4035c45e4bbc1da13479`
      );
      const res = await axios.get(
        `http://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=b9dfff4772ea4035c45e4bbc1da13479`
      );

      console.log(res.data);
      console.log(weatherRes.data);
      setPollutionData({
        name: weatherRes.data.name,
        country: weatherRes.data.sys.country,
        aqi: res.data.list[0].main.aqi,
        pm2_5: res.data.list[0].components.pm2_5,
        pm10: res.data.list[0].components.pm10,
        aqiColor: setAqiColor(res.data.list[0].main.aqi),
      });

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(loadPollutionData);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const weatherRes = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=b9dfff4772ea4035c45e4bbc1da13479`
      );

      const { lat, lon } = weatherRes.data.coord;
      const res = await axios.get(
        `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=b9dfff4772ea4035c45e4bbc1da13479`
      );

      setPollutionData({
        name: weatherRes.data.name,
        country: weatherRes.data.sys.country,
        aqi: res.data.list[0].main.aqi,
        pm2_5: res.data.list[0].components.pm2_5,
        pm10: res.data.list[0].components.pm10,
        aqiColor: setAqiColor(res.data.list[0].main.aqi),
      });

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div style={{ height: "100vh" }}>
      {!loading && pollutionData ? (
        <div className="container" style={{ height: "100%" }}>
          <div className="row">
            <div className="col" style={{ paddingTop: "50px" }}>
              <form
                class="region"
                style={{ textAlign: "center" }}
                onSubmit={(e) => handleSubmit(e)}
              >
                <input
                  type="text"
                  class="regioninput"
                  placeholder="Select your region"
                  onChange={(e) => setLocation(e.target.value)}
                />
              </form>
              <h3 className="text-center display-4">
                {pollutionData.name} , {pollutionData.country}
              </h3>
              <div className="pollution mt-5">
                <div className="pollutionInner">
                  <div
                    className="aqi"
                    style={{ background: pollutionData.aqiColor }}
                  >
                    <h4 className="text-center ">Air quality Index</h4>
                    <h2 className="aqiIndex">{pollutionData.aqi * 10}</h2>
                  </div>
                  <div className="pmCont">
                    <p>PM 2.5:</p>
                    <h4> {pollutionData.pm2_5}</h4>
                    <p>PM 10:</p>
                    <h4> {pollutionData.pm10}</h4>
                  </div>
                </div>
              </div>
              <div className="btnCont">
                <Button variant="info">
                  <Link to="/" style={{ color: "white" }}>
                    Go back to home
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <h1 className="text-center">Loading...</h1>
      )}
    </div>
  );
};

Pollution.propTypes = {};

export default Pollution;
