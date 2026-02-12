// City areas (same for all cities) and cities.

export const CITY_AREAS = [
  {
    id: "metropolis",
    name: "Metropolis",
    description: "A bustling city where opportunity and danger walk hand in hand.",
  },
  {
    id: "suburbs",
    name: "The Suburbs",
    description: "Quiet streets, steady jobs, and a slower pace of life.",
  },
  {
    id: "industrial",
    name: "Industrial District",
    description: "Factories, warehouses, and hard work define this area.",
  },
  {
    id: "downtown",
    name: "Downtown",
    description: "The heart of commerce, law, and high-stakes business.",
  },
];

export const CITIES = [
  {
    id: "los_angeles",
    name: "Los Angeles",
    country: "USA",
    description: "The City of Angels, where dreams are made and broken.",
  },
  {
    id: "chicago",
    name: "Chicago",
    country: "USA",
    description: "The Windy City, a hub of industry and opportunity.",
  },
  {
    id: "new_york",
    name: "New York",
    country: "USA",
    description: "The Big Apple, where ambition meets opportunity.",
  },
  {
    id: "london",
    name: "London",
    country: "UK",
    description: "The capital of the United Kingdom, rich in history and opportunity.",
  },
  {
    id: "moscow",
    name: "Moscow",
    country: "Russia",
    description: "The capital of Russia, where power and opportunity converge.",
  },
  {
    id: "beijing",
    name: "Beijing",
    country: "China",
    description: "The capital of China, a city of ancient tradition and modern ambition.",
  },
];

export const STARTING_LOCATIONS = CITIES.map((city) => ({
  id: city.id,
  name: `${city.name}, ${city.country}`,
  description: city.description,
}));
