import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// data should be an object: {dt: 1610133729 (UTC date time), temp, weather}

const weather = {
	Thunderstorm: 'bolt',
	Drizzle: 'cloud-rain',
	Rain: 'cloud-showers-heavy',
	Snow: 'snowflake',
	Clouds: 'cloud',
	Clear: 'sun',
	Mist: 'cloud-rain',
};

const Card = ({ data, title }) => {
	const icon = weather[data.weather];

	return (
		<div className="card p-3 ">
			<h1 className="card-header-title is-centered">{title}</h1>
			<div className="card-image is-flex is-justify-content-center">
				<FontAwesomeIcon
					className="is-size-3-tablet is-size-1-desktop"
					icon={icon}
				/>
			</div>
			<div className="">
				<h1 className="title is-size-5 has-text-centered has-text-dark">
					Temperature:
				</h1>
				<p className="subtitle is-size-5 has-text-centered has-text-dark">
					{`${Math.floor(data.temp)}\u00b0`}
				</p>
				<h3 className="title is-size-5 has-text-centered has-text-dark">
					General Conditions:
				</h3>
				<p className="subtitle is-size-5 has-text-centered has-text-dark">
					{data.weather}
				</p>
			</div>
		</div>
	);
};

export default Card;
