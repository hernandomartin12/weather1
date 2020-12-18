import React from "react";
import UserLocation from "./components/UserLocation.js";
import Navbar from "./components/Navbar.js";
import "./App.css";
import "./index.css";

import Axios from "axios";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
class App extends React.Component {
  //state
  state = {
    deafult: true,
    isFah: false,
    userPosition: {
      latitude: 35,
      longitude: 139,
    },
    weather: null,
    regionInput: "",
  };

  componentDidMount() {
    //check whether geolocation is supported
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        //get the lat and long of your device

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        //Weather Api call
        Axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=b9dfff4772ea4035c45e4bbc1da13479`
        ).then((res) => {
          console.log(res);
          res.data.main.temp = Math.round(res.data.main.temp - 273);
          this.setState({ ...this.state, weather: res.data, deafult: true });
        });
      });
    }
  }
  convertTemp = () => {
    const currentTemp = this.state.deafult
      ? this.state.weather.main.temp
      : this.state.weather.temperature;

    const fahrenheit = Math.round((currentTemp * 9) / 5 + 32);

    const celcius = Math.round(((currentTemp - 32) * 5) / 9);

    if (!this.state.deafult) {
      this.setState({
        ...this.state,
        weather: {
          ...this.state.weather,
          temperature: this.state.isFah ? celcius : fahrenheit,
        },
        isFah: !this.state.isFah,
      });

      return;
    }

    this.setState({
      ...this.state,
      weather: {
        ...this.state.weather,
        main: {
          ...this.state.weather.main,
          temp: this.state.isFah ? celcius : fahrenheit,
        },
      },
      isFah: !this.state.isFah,
    });
  };

  //update the value of the the input field with state
  changeRegion = (value) => {
    this.setState({ ...this.state, regionInput: value });
  };

  //update the weather depending upon the value user entered
  changeLocation = (e) => {
    e.preventDefault();

    Axios.get(
      `http://api.weatherstack.com/current?access_key=ee2c00a09ba65e4467143d28625d3fa2&query=${this.state.regionInput}`
    ).then((res) => {
      let userWeather = {
        temperature: res.data.current.temperature,
        description: res.data.current.weather_descriptions[0],
        location: res.data.location.name,
        region: res.data.location.region,
        country: res.data.location.country,
        wind_speed: res.data.current.wind_speed,
        pressure: res.data.current.pressure,
        precip: res.data.current.precip,
        humidity: res.data.current.humidity,
        img: res.data.current.weather_icons,
      };

      this.setState({
        ...this.state,
        weather: userWeather,
        deafult: false,
        isFah: false,
      });
    });
  };

  render() {
    return (
      <div className="App">
        <div className="container">
          <Navbar
            changeRegion={this.changeRegion}
            changeLocation={this.changeLocation}
          />
          {this.state.weather ? (
            <UserLocation
              deafult={this.state.deafult}
              weather={this.state.weather}
              isFah={this.state.isFah}
            />
          ) : (
            <p>loading loadinggg</p>
          )}
          <div className="d-flex justify-content-center my-5">
            <Button variant="info" onClick={(e) => this.convertTemp()}>
              Switch to {this.state.isFah ? "Celcius" : "Fahrenheit"}
            </Button>
            <Button variant="primary mx-3">
              <Link to="/pollution" style={{ color: "white" }}>
                Get air pollution info
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

/* Default
function defaults() {
  useEffect (()=> {

async function showPosition(position){
  try {

    const latitude =  position.coords.latitude 
    const longitude = position.coords.longitude

    console.log(latitude,longitude)

      const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api.key}`)
      res.data.main.temp -= 273

      setWeather(res.data);
      console.log(res)
  } catch (error) {
      console.log(error)
  }
}
    function getLocation() {
      if (navigator.geolocation) {
        console.log(navigator.geolocation.getCurrentPosition(showPosition));
      } else {
         alert('Error')
      }
    }

    getLocation()
  }, [])
}*/

export default App;
