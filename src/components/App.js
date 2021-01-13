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
import { fetchCity, fetchLatLon, fetchWeather } from '../api/fetch';
import Card from './Card.js';
import SearchBar from './SearchBar';
import setTime from '../helpers/setTime';
import parseCityState from '../helpers/parseCityState';
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
	const [city, setCity] = useState(null);
	const [latitudeLongitude, setLatitudeLongitude] = useState({
		lat: null,
		lon: null,
	});
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
	const [latLonError, setLatLonError] = useState(false);
	const [searchValue, setSearchValue] = useState('');

	const handleChange = (e) => {
		e.preventDefault();
		const input = e.target.value;
		setSearchValue(input);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const cityAndState = parseCityState(e.target[0].value);
		getLatLon(cityAndState);
	};

	const getCity = async ({ coords }) => {
		try {
			const currentCity = await fetchCity(coords);
			setCity(currentCity);
		} catch {
			console.log('there was an error in getCity');
		}
	};

	const getLatLon = async ({ city, state }) => {
		try {
			const latLon = await fetchLatLon(city, state);
			setLatitudeLongitude(latLon);
			setCity(city);
			setLatLonError(false);
		} catch {
			console.log('there was an error in getLatLon');
			setLatLonError(`Hmm...we couldn't find "${city}"`);
		}
	};

	const getWeather = async ({ latitude, longitude }) => {
		try {
			const weather = await fetchWeather(latitude, longitude);
			setDailyWeather(weather.fiveDay);
			setCurrentWeather(weather.currentWeather);
		} catch {
			console.log('there was an error in getWeather');
		}
	};

	useEffect(() => {
		window.navigator.geolocation.getCurrentPosition(
			(position) => {
				setLatitudeLongitude({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
				});

				getCity(position);
			},
			(err) => setErrorMessage({ message: err.message })
		);
	}, []);

	useEffect(() => {
		if (latitudeLongitude.latitude) {
			getWeather(latitudeLongitude);
		}
	}, [latitudeLongitude]);

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
		return (
			<section className="hero is-fullheight is-danger">
				<div className="hero-body">
					<div className="container">
						<h1 className="column is-full">{errorMessage.message}</h1>
						<p className="column is-full">Please allow location services.</p>
					</div>
				</div>
			</section>
		);
	}
	if (currentWeather.dt == null) {
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
				<section className="hero is-primary is-fullheight is-flex is-flex-wrap-wrap is-justify-content-center">
					{/* hero header */}
					<div className="hero-head">
						<div className="navbar">
							<SearchBar
								city={city}
								value={searchValue}
								onSubmit={(e) => handleSubmit(e)}
								onChange={(e) => handleChange(e)}
								error={latLonError}
							/>
						</div>
					</div>
					{/* hero body */}
					<div className="hero-body">
						<div className="container has-text-centered">
							<h1 className="title">{city}</h1>
							<Card
								id="current-weather"
								data={currentWeather}
								title="Current"
								key={currentWeather.dt}
								className="is-centered"
							/>
						</div>
					</div>
					{/* hero footer */}
					<div className="hero-footer">
						<p className="p-1">Scroll for 5 Day Forecast</p>
					</div>
				</section>
				<section className="section is-flex is-flex-wrap-wrap is-justify-content-center">
					{renderComponent()}
				</section>
			</>
		);
	}
}

export default App;
