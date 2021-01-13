// offset should be in seconds.
const setTime = (unix_timestamp, offset = 0) => {
	const days = {
		0: 'Sunday',
		1: 'Monday',
		2: 'Tuesday',
		3: 'Wednesday',
		4: 'Thursday',
		5: 'Friday',
		6: 'Saturday',
	};

	const date = new Date((unix_timestamp + offset) * 1000);
	const day = date.getDay();
	const hours = date.getHours();
	const minutes = '0' + date.getMinutes();
	const seconds = '0' + date.getSeconds();
	return {
		day: days[day],
		hours,
		minutes: minutes.substr(-2),
		seconds: seconds.substr(-2),
	};
};

export default setTime;
