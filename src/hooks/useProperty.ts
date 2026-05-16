import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { api } from "~/utils/api";

export function useProperty(id: number) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [form, setForm] = useState({
    title: "", description: "", price: "", bedrooms: "", bathrooms: "", area: "",
    address: "", latitude: "", longitude: "",
  });
  const [images, setImages] = useState<string[]>([]);

  const { data: property, isLoading } = api.property.getById.useQuery(
    { id },
    { enabled: !!id },
  );

  useEffect(() => {
    if (property) {
      setForm({
        title: property.title,
        description: property.description,
        price: String(property.price),
        bedrooms: String(property.bedrooms),
        bathrooms: String(property.bathrooms),
        area: String(property.area),
        address: property.address ?? "",
        latitude: property.latitude ? String(property.latitude) : "",
        longitude: property.longitude ? String(property.longitude) : "",
      });
      setImages(property.images ?? []);
      setActiveImage(0);
    }
  }, [property]);

  const utils = api.useUtils();

  const updateMutation = api.property.update.useMutation({
    onSuccess: async () => {
      await utils.property.getById.invalidate({ id });
      setEditing(false);
    },
  });

  const deleteMutation = api.property.delete.useMutation({
    onSuccess: () => void router.push("/"),
  });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      id,
      title: form.title,
      description: form.description,
      price: Number(form.price),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      area: Number(form.area),
      images,
      address: form.address || undefined,
      latitude: form.latitude ? Number(form.latitude) : undefined,
      longitude: form.longitude ? Number(form.longitude) : undefined,
    });
  };

  return {
    property, isLoading, editing, setEditing,
    confirmDelete, setConfirmDelete, activeImage, setActiveImage,
    form, setForm, images, setImages, handleUpdate,
    updateMutation, deleteMutation,
  };
}
