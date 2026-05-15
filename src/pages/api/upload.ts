import type { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";

export const config = {
  api: { bodyParser: { sizeLimit: "10mb" } },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "No autorizado" });

  const { data, folder } = req.body as { data: string; folder: string };
  if (!data) return res.status(400).json({ error: "No se recibió imagen" });

  const result = await cloudinary.uploader.upload(data, {
    folder: `properties/${folder}`,
    resource_type: "image",
    transformation: [{ width: 1200, height: 800, crop: "limit", quality: "auto" }],
  });

  return res.status(200).json({ url: result.secure_url, publicId: result.public_id });
}
