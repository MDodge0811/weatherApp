import React, { useState, useEffect } from 'react';
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
import openWeather from '../api/openweather';
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

function App() {
	const [currentWeather, setCurrentWeather] = useState({
		dt: null,
		temp: null,
		weather: null,
	});
	const [dailyWeather, setDailyWeather] = useState({
		dt: null,
		temp: null,
		weather: null,
	});
	const [errorMessage, setErrorMessage] = useState(null);

	const getWeather = async ({ coords }) => {
		const key = 'c0e6273d9c10a2fe23babceaed9559df';

		const { data } = await openWeather.get(
			`onecall?lat=${coords.latitude}&lon=${coords.longitude}&units=imperial&appid=${key}`
		);

		const dailyList = [];
		const days = 5; // number of days to render (1-7)
		data.daily.forEach((time, index) => {
			if (index < days) {
				dailyList.push({
					dt: time.dt,
					temp: time.temp.day,
					weather: time.weather[0].main,
				});
			}
		});

		setDailyWeather(dailyList);
		setCurrentWeather({
			dt: data.current.dt,
			temp: data.current.temp,
			weather: data.current.weather[0].main,
		});
	};

	useEffect(() => {
		window.navigator.geolocation.getCurrentPosition(
			(position) => getWeather(position),
			(err) => setErrorMessage({ message: err.message })
		);
	}, []);

	const renderComponent = () => {
		return dailyWeather.map((individualDay) => {
			const { day } = setTime(individualDay.dt);
			return (
				<Card
					id="five-day"
					data={individualDay}
					title={day}
					key={individualDay.dt}
				/>
			);
		});
	};

	if (errorMessage) {
		return <div>{errorMessage.message}</div>;
	}
	if (currentWeather.dt === null) {
		return (
			<>
				<section className="loading is-flex is-align-items-center  is-justify-items-center is-large">
					<progress className="m-6 progress is-primary" max="100">
						15%
					</progress>
				</section>
			</>
		);
	} else {
		return (
			<>
				<section className="is-flex flex-wrap is-justify-content-center">
					<Card
						id="current-weather"
						data={currentWeather}
						title="Current"
						key={currentWeather.dt}
						className="is-centered"
					/>
				</section>
				<section className="section is-flex is-flex-wrap-wrap is-justify-content-center">
					{renderComponent()}
				</section>
			</>
		);
	}
}

export default App;
