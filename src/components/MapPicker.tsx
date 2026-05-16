import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

type Props = {
  latitude?: number;
  longitude?: number;
  address?: string;
  onChange: (data: { latitude: number; longitude: number; address: string }) => void;
};

export default function MapPicker({ latitude, longitude, address, onChange }: Props) {
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState(address ?? "");
  const [searching, setSearching] = useState(false);
  const [position, setPosition] = useState<[number, number]>([
    latitude ?? -12.0464,
    longitude ?? -77.0428,
  ]);
  const [MapComponents, setMapComponents] = useState<{
    MapContainer: typeof import("react-leaflet")["MapContainer"];
    TileLayer: typeof import("react-leaflet")["TileLayer"];
    Marker: typeof import("react-leaflet")["Marker"];
    useMapEvents: typeof import("react-leaflet")["useMapEvents"];
  } | null>(null);

  useEffect(() => {
    void (async () => {
      const L = await import("leaflet");
      const { fixLeafletIcons } = await import("~/lib/leaflet-fix");
      fixLeafletIcons(L);
      const rl = await import("react-leaflet");
      setMapComponents({
        MapContainer: rl.MapContainer,
        TileLayer: rl.TileLayer,
        Marker: rl.Marker,
        useMapEvents: rl.useMapEvents,
      });
    })();
    setMounted(true);
  }, []);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json() as { display_name?: string };
      const addr = data.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      setSearch(addr);
      onChange({ latitude: lat, longitude: lng, address: addr });
    } catch {
      onChange({ latitude: lat, longitude: lng, address: `${lat.toFixed(5)}, ${lng.toFixed(5)}` });
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(search)}&format=json&limit=1`
      );
      const data = await res.json() as { lat: string; lon: string; display_name: string }[];
      const result = data[0];
      if (!result) return;
      const lat = parseFloat(result.lat);
      const lng = parseFloat(result.lon);
      setPosition([lat, lng]);
      setSearch(result.display_name);
      onChange({ latitude: lat, longitude: lng, address: result.display_name });
    } finally {
      setSearching(false);
    }
  };

  if (!mounted || !MapComponents) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Ubicación</label>
        <div className="w-full h-64 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center">
          <p className="text-sm text-gray-400">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, useMapEvents } = MapComponents;

  function LocationPicker({ onPick }: { onPick: (lat: number, lng: number) => void }) {
    useMapEvents({
      click(e) { onPick(e.latlng.lat, e.latlng.lng); },
    });
    return null;
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700">Ubicación</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void handleSearch(); } }}
          placeholder="Busca una dirección o haz clic en el mapa..."
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 hover:border-gray-300 transition-colors"
        />
        <button
          type="button"
          onClick={() => void handleSearch()}
          disabled={searching}
          className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {searching ? "..." : "Buscar"}
        </button>
      </div>
      <MapContainer
        center={position}
        zoom={latitude ? 15 : 12}
        className="w-full h-64 rounded-xl border border-gray-200 z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={position} />
        <LocationPicker onPick={(lat, lng) => {
          setPosition([lat, lng]);
          void reverseGeocode(lat, lng);
        }} />
      </MapContainer>
      <p className="text-xs text-gray-400">Haz clic en el mapa para ajustar la ubicación</p>
    </div>
  );
}
