import openWeather, { openWeatherKey } from './openWeather';

export const fetchCity = async (coords) => {
	const { data } = await openWeather.get(
		`forecast?lat=${coords.latitude}&lon=${coords.longitude}&units=imperial&appid=${openWeatherKey}`
	);
	return data.city.name;
};

export const fetchLatLon = async (city, state) => {
	const encodedURI = encodeURI(
		`forecast?q=${city},${state}, us&appid=${openWeatherKey}`
	);
	const { data } = await openWeather.get(encodedURI);
	return {
		latitude: data.city.coord.lat,
		longitude: data.city.coord.lon,
	};
};

export const fetchWeather = async (latitude, longitude) => {
	const { data } = await openWeather.get(
		`onecall?lat=${latitude}&lon=${longitude}&units=imperial&appid=${openWeatherKey}`
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
	return {
		currentWeather: {
			dt: data.current.dt,
			temp: data.current.temp,
			weather: data.current.weather[0].main,
		},
		fiveDay: dailyList,
	};
};
