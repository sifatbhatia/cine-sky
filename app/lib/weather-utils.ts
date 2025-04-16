export const dateBuilder = (d: Date) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const day = days[d.getDay()];
  const date = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
};

export const getWeatherIcon = (weatherMain: string) => {
  switch (weatherMain) {
    case "Haze":
      return "CLEAR_DAY";
    case "Clouds":
      return "CLOUDY";
    case "Rain":
      return "RAIN";
    case "Snow":
      return "SNOW";
    case "Dust":
      return "WIND";
    case "Drizzle":
      return "SLEET";
    case "Fog":
      return "FOG";
    case "Smoke":
      return "FOG";
    case "Tornado":
      return "WIND";
    default:
      return "CLEAR_DAY";
  }
};

export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(((degrees % 360) / 22.5));
  return directions[index % 16];
} 