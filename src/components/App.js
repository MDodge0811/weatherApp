import React from 'react';
import openweather from '../api/openweather';

class App extends React.Component {
	state = { city: null, weather: [], errorMessage: null };

	getWeather = async ({ coords }) => {
		const key = 'c0e6273d9c10a2fe23babceaed9559df';

		let { data } = await openweather.get(
			`forecast?lat=${coords.latitude}&lon=${coords.longitude}&units=imperial&appid=${key}`
		);

		const weatherList = [];

		data.list.forEach((time) =>
			weatherList.push({
				temp_max: time.main.temp_max,
				temp_min: time.main.temp_min,
				weather: time.weather[0].main,
			})
		);

		this.setState({ weather: weatherList });
		this.setState({ city: data.city.name });
	};

	componentDidMount = () => {
		window.navigator.geolocation.getCurrentPosition(
			(position) => this.getWeather(position),
			(err) => this.setState({ errorMessage: err.message })
		);
	};

	renderContent = () => {
		if (this.state.city === null) {
			return <div>Loading...</div>;
		} else {
			return (
				<ul>
					{this.state.weather.map((object) => (
						<div>
							<li>
								Max Temp: {Math.floor(object.temp_max)}, Min Temp:{' '}
								{Math.floor(object.temp_min)}, General Conditions:{' '}
								{object.weather}
							</li>
						</div>
					))}
				</ul>
			);
		}
	};

	render() {
		return <div>{this.renderContent()}</div>;
	}
}

//

// const useAsyncHook = () => {
//   const [loading, setLoading] = useState(true)
//   const [location, setLocation] = useState({})

//     navigator.geolocation.getCurrentPosition(({coords}) =>
//       setLocation({'latitude': coords.latitude, 'longitude': coords.longitude})
// 		);

//   return [loading, location]
// }

// const GetWeather = async () => {
//   const [locationInfo, setLocationInfo] = useState([])
//   const [loading, {latitude, longitude}] = useAsyncHook()

// 	const results = await
// 	);

// 	console.log(results);
// 	return results;
// };

export default App;
