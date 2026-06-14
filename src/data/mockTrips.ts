export type Trip = {
  id: string;
  name: string;
  dates: string;
  location: string;
  photoCount: number;
  coverGradient: string;
};

export const mockTrips: Trip[] = [
  {
    id: "goa-2025",
    name: "Goa with friends",
    dates: "12–18 Jan 2025",
    location: "North Goa, India",
    photoCount: 248,
    coverGradient: "linear-gradient(135deg, #ff9a56 0%, #ff6b6b 100%)",
  },
  {
    id: "tokyo-2024",
    name: "Tokyo autumn",
    dates: "3–10 Nov 2024",
    location: "Tokyo, Japan",
    photoCount: 412,
    coverGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    id: "weekend-munnar",
    name: "Munnar weekend",
    dates: "6–8 Sep 2024",
    location: "Kerala, India",
    photoCount: 86,
    coverGradient: "linear-gradient(135deg, #08c225 0%, #069d1e 100%)",
  },
];

export function getTrip(id: string): Trip | undefined {
  return mockTrips.find((t) => t.id === id);
}
