import { useSession, signIn, signOut } from "next-auth/react";
import { api } from "~/utils/api";

export default function Home() {
  const { data: session } = useSession();
  const { data: properties, isLoading } = api.property.getAll.useQuery();

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
        <h1>Plataforma Inmobiliaria</h1>
        <div>
          {session ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span>{session.user?.name || session.user?.email}</span>
              <button onClick={() => signOut()} style={{ padding: "6px 12px" }}>Cerrar sesión</button>
            </div>
          ) : (
            <button onClick={() => signIn()} style={{ padding: "6px 12px" }}>Iniciar sesión</button>
          )}
        </div>
      </div>

      <h2>Propiedades</h2>
      {isLoading && <p>Cargando...</p>}
      {properties && properties.length === 0 && <p>No hay propiedades registradas.</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
        {properties?.map((property) => (
          <div key={property.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
            <h3>{property.title}</h3>
            <p>{property.description}</p>
            <p><strong>Precio:</strong> S/ {property.price.toLocaleString()}</p>
            <p><strong>Dormitorios:</strong> {property.bedrooms} | <strong>Baños:</strong> {property.bathrooms}</p>
            <p><strong>Área:</strong> {property.area} m²</p>
          </div>
        ))}
      </div>
    </div>
  );
}
