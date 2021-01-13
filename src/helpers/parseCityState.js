const parseCityState = (string) => {
	const cityAndState = string.split(',');
	const cleanedStrings = [];

	cityAndState.forEach((str) => {
		cleanedStrings.push(str.trim());
	});

	const [city, state] = cleanedStrings;
	return { city, state };
};

export default parseCityState;
