import React from 'react';
import 'bulma';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import {
	faCloud,
	faSun,
	faBolt,
	faCloudRain,
	faCloudShowersHeavy,
	faSnowflake,
} from '@fortawesome/free-solid-svg-icons';
import openweather from '../api/openweather';
import Card from './Card.js';
import setTime from '../helpers/set_time';
import '../css/styles.css';

library.add(
	fas,
	faCloud,
	faSun,
	faBolt,
	faCloudRain,
	faCloudShowersHeavy,
	faSnowflake
);

class App extends React.Component {
	state = {
		timezone: null,
		weather: {
			currentWeather: { dt: null, temp: null, weather: null },
			dailyweather: { dt: null, temp: null, weather: null },
		},
		errorMessage: null,
	};

	getWeather = async ({ coords }) => {
		const key = 'c0e6273d9c10a2fe23babceaed9559df';

		const { data } = await openweather.get(
			`onecall?lat=${coords.latitude}&lon=${coords.longitude}&units=imperial&appid=${key}`
		);
		const weatherList = { currentWeather: {}, dailyWeather: [] };

		weatherList.currentWeather = {
			dt: data.current.dt,
			temp: data.current.temp,
			weather: data.current.weather[0].main,
		};

		const days = 5; // number of days to render (1-7)
		data.daily.forEach((time, index) => {
			if (index < days) {
				weatherList.dailyWeather.push({
					dt: time.dt,
					temp: time.temp.day,
					weather: time.weather[0].main,
				});
			}
		});
		this.setState({ weather: weatherList });
		this.setState({ timezone: data.timezone });
	};

	componentDidMount = () => {
		window.navigator.geolocation.getCurrentPosition(
			(position) => this.getWeather(position),
			(err) => this.setState({ errorMessage: err.message })
		);
	};

	renderComponent = () => {
		return this.state.weather.dailyWeather.map((object) => {
			const { day } = setTime(object.dt);
			return <Card id="fiveday" data={object} title={day} key={object.dt} />;
		});
	};

	render() {
		if (this.state.weather.currentWeather.dt === null) {
			return (
				<React.Fragment>
					<section className="loading is-flex is-align-items-center  is-justify-items-center is-large">
						<progress className="m-6 progress is-primary" max="100">
							15%
						</progress>
					</section>
				</React.Fragment>
			);
		} else {
			return (
				<React.Fragment>
					<section className="is-flex is-justify-content-center">
						<Card
							id="current-weather"
							data={this.state.weather.currentWeather}
							title="Current"
							key={this.state.weather.currentWeather.dt}
							className="is-centered"
						/>
					</section>
					<section className="section">{this.renderComponent()}</section>
				</React.Fragment>
			);
		}
	}
}

export default App;
