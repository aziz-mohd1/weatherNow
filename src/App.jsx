import React, { useState, useEffect } from 'react';
import { WiThermometer, WiStrongWind, WiDaySunny } from 'react-icons/wi';
import { FaCity, FaGlobe } from 'react-icons/fa';

// Sample list of countries and their cities
const countries = {
  'United States': [
    'New York',
    'Los Angeles',
    'Chicago',
    'Houston',
    'Phoenix',
    'Philadelphia',
    'San Antonio',
    'San Diego',
    'Dallas',
    'San Jose',
  ],
  'United Kingdom': [
    'London',
    'Manchester',
    'Birmingham',
    'Liverpool',
    'Edinburgh',
    'Bristol',
    'Glasgow',
    'Cardiff',
    'Belfast',
    'Leeds',
  ],
  India: [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Hyderabad',
    'Chennai',
    'Kolkata',
    'Pune',
    'Ahmedabad',
    'Jaipur',
    'Surat',
  ],
  Canada: [
    'Toronto',
    'Vancouver',
    'Montreal',
    'Calgary',
    'Edmonton',
    'Ottawa',
    'Winnipeg',
    'Quebec City',
    'Hamilton',
    'Kitchener',
  ],
  Australia: [
    'Sydney',
    'Melbourne',
    'Brisbane',
    'Perth',
    'Adelaide',
    'Gold Coast',
    'Canberra',
    'Hobart',
    'Darwin',
    'Newcastle',
  ],
  Germany: [
    'Berlin',
    'Munich',
    'Frankfurt',
    'Hamburg',
    'Cologne',
    'Stuttgart',
    'Düsseldorf',
    'Dortmund',
    'Essen',
    'Leipzig',
  ],
  France: [
    'Paris',
    'Marseille',
    'Lyon',
    'Toulouse',
    'Nice',
    'Nantes',
    'Strasbourg',
    'Montpellier',
    'Bordeaux',
    'Lille',
  ],
  Japan: [
    'Tokyo',
    'Osaka',
    'Yokohama',
    'Nagoya',
    'Sapporo',
    'Fukuoka',
    'Kobe',
    'Kyoto',
    'Sendai',
    'Hiroshima',
  ],
  Brazil: [
    'São Paulo',
    'Rio de Janeiro',
    'Brasília',
    'Salvador',
    'Fortaleza',
    'Belo Horizonte',
    'Manaus',
    'Curitiba',
    'Recife',
    'Porto Alegre',
  ],
  'South Africa': [
    'Johannesburg',
    'Cape Town',
    'Durban',
    'Pretoria',
    'Port Elizabeth',
    'Bloemfontein',
    'Nelspruit',
    'Polokwane',
    'Kimberley',
    'East London',
  ],
  China: [
    'Beijing',
    'Shanghai',
    'Shenzhen',
    'Guangzhou',
    'Chengdu',
    'Hangzhou',
    'Wuhan',
    'Tianjin',
    'Chongqing',
    'Nanjing',
  ],
  Italy: [
    'Rome',
    'Milan',
    'Naples',
    'Turin',
    'Palermo',
    'Genoa',
    'Bologna',
    'Florence',
    'Venice',
    'Verona',
  ],
  Russia: [
    'Moscow',
    'Saint Petersburg',
    'Novosibirsk',
    'Yekaterinburg',
    'Kazan',
    'Nizhny Novgorod',
    'Chelyabinsk',
    'Samara',
    'Omsk',
    'Rostov-on-Don',
  ],
};

function App() {
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [cities, setCities] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Update the cities dropdown when the country changes
  useEffect(() => {
    if (country) {
      setCities(countries[country] || []);
      setCity(''); // Reset city when country changes
    }
  }, [country]);

  const fetchCoordinates = async (cityName) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${cityName}`
      );
      const data = await response.json();

      if (data.length === 0 || !data[0].lat || !data[0].lon) {
        throw new Error('Invalid city name. Please try again.');
      }

      return { latitude: data[0].lat, longitude: data[0].lon };
    } catch (error) {
      throw new Error('Failed to fetch coordinates');
    }
  };

  const fetchWeather = async () => {
    if (!country || !city) {
      setError('Please select both a country and a city');
      return;
    }
    setError('');
    setLoading(true);
    setWeatherData(null);

    try {
      const { latitude, longitude } = await fetchCoordinates(city);
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const data = await response.json();
      setWeatherData(data.current_weather);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="w-[100vw] min-h-screen bg-gradient-to-r from-blue-500 to-blue-300 flex flex-col items-center justify-center p-4 text-white">
      <h1 className="text-4xl font-bold mb-6">Weather Now</h1>

      <div className="flex flex-col items-center w-full max-w-md bg-white text-black rounded-lg shadow-lg p-6">
        <div className="flex items-center w-full mb-4">
          <FaGlobe className="text-2xl mr-2" />
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="p-2 border rounded w-full focus:outline-none focus:border-blue-500"
          >
            <option value="">Select Country</option>
            {Object.keys(countries).map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center w-full mb-4">
          <FaCity className="text-2xl mr-2" />
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="p-2 border rounded w-full focus:outline-none focus:border-blue-500"
            disabled={!country}
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={fetchWeather}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors w-full"
        >
          {loading ? 'Loading...' : 'Search'}
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {weatherData && (
          <div className="mt-6 bg-gradient-to-r from-blue-400 to-blue-600 p-4 rounded-lg text-white shadow-md w-full text-center">
            <h2 className="text-2xl font-bold mb-2">
              <WiDaySunny className="inline text-3xl mr-2" />
              Weather in {city}, {country}
            </h2>
            <p className="text-lg flex items-center justify-center">
              <WiThermometer className="text-2xl mr-2" />
              Temperature: {weatherData.temperature}°C
            </p>
            <p className="text-lg flex items-center justify-center">
              <WiStrongWind className="text-2xl mr-2" />
              Wind Speed: {weatherData.windspeed} km/h
            </p>
            <p className="text-lg">Weather Code: {weatherData.weathercode}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
