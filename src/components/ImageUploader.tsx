import { useRef, useState } from "react";

type Props = {
  images: string[];
  onChange: (images: string[]) => void;
  folder: string;
};

export default function ImageUploader({ images, onChange, folder }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remaining = 6 - images.length;
    if (remaining <= 0) {
      setError("Máximo 6 imágenes por propiedad.");
      return;
    }

    // Validar tamaño máximo 5MB por archivo
    const oversized = Array.from(files).find((f) => f.size > 5 * 1024 * 1024);
    if (oversized) {
      setError("Cada imagen debe pesar menos de 5MB.");
      return;
    }

    const selected = Array.from(files).slice(0, remaining);
    setUploading(true);
    setError("");

    try {
      const uploaded: string[] = [];

      for (const file of selected) {
        const base64 = await toBase64(file);
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: base64, folder }),
        });

        if (!res.ok) throw new Error("Error al subir imagen");
        const json = await res.json() as { url: string };
        uploaded.push(json.url);
      }

      onChange([...images, ...uploaded]);
    } catch {
      setError("Error al subir una o más imágenes. Intenta de nuevo.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Imágenes <span className="text-gray-400 font-normal">({images.length}/6)</span>
      </label>

      {/* Zona de drop / botón */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); void handleFiles(e.dataTransfer.files); }}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          uploading
            ? "border-blue-300 bg-blue-50"
            : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
        } ${images.length >= 6 ? "opacity-40 pointer-events-none" : ""}`}
      >
        {uploading ? (
          <p className="text-sm text-blue-600 font-medium">Subiendo imágenes...</p>
        ) : (
          <>
            <p className="text-sm text-gray-500">
              Arrastra fotos aquí o <span className="text-blue-600 font-medium">selecciona archivos</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — máx. 6 fotos</p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => void handleFiles(e.target.files)}
      />

      {error && (
        <p className="text-red-600 text-xs mt-2">{error}</p>
      )}

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {images.map((url, i) => (
            <div key={i} className="relative group aspect-video">
              <img
                src={url}
                alt={`Imagen ${i + 1}`}
                className="w-full h-full object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                  Principal
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
