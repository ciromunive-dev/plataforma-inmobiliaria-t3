import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

type Props = {
  latitude: number;
  longitude: number;
  address?: string;
};

export default function MapView({ latitude, longitude, address }: Props) {
  const [mounted, setMounted] = useState(false);
  const [MapComponents, setMapComponents] = useState<{
    MapContainer: typeof import("react-leaflet")["MapContainer"];
    TileLayer: typeof import("react-leaflet")["TileLayer"];
    Marker: typeof import("react-leaflet")["Marker"];
    Popup: typeof import("react-leaflet")["Popup"];
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
        Popup: rl.Popup,
      });
    })();
    setMounted(true);
  }, []);

  if (!mounted || !MapComponents) {
    return (
      <div className="w-full h-64 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-400">Cargando mapa...</p>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = MapComponents;

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Ubicación</h2>
      {address && (
        <p className="text-sm text-gray-600 flex items-center gap-1.5">
          <svg className="w-4 h-4 text-blue-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {address}
        </p>
      )}
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        className="w-full h-64 rounded-xl border border-gray-200 z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={[latitude, longitude]}>
          {address && <Popup>{address}</Popup>}
        </Marker>
      </MapContainer>
    </div>
  );
}
