import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import cloudinary from "../utils/cloudinary";
import streamifier from "streamifier";

const prisma = new PrismaClient();


const uploadToCloudinary = (fileBuffer: Buffer): Promise<any> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "team",
        resource_type: "image",
        transformation: [{ width: 800, height: 800, crop: "limit" }],
        quality: "auto",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};


export const uploadTeamImage = async (req: Request, res: Response) => {
  try {
    const { name, role, bio, email, linkedin, github } = req.body;

    if (!name || !role) {
      return res.status(400).json({ message: "Name and role are required." });
    }

    let imageUrl: string | null = null;

    if (req.file) {
      if (!req.file.mimetype.startsWith("image/")) {
        return res.status(400).json({ message: "Invalid file type. Only images allowed." });
      }

      if (req.file.size > 3 * 1024 * 1024) {
        return res.status(400).json({ message: "Image too large (max 3MB)." });
      }

      const result: any = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const teamMember = await prisma.team.create({
      data: {
        name,
        role,
        bio: bio ?? null,
        image: imageUrl,
        email: email ?? null,
        linkedin: linkedin ?? null,
        github: github ?? null,
      },
    });

    return res.status(201).json({
      message: " Team member added successfully",
      teamMember,
    });
  } catch (error: any) {
    console.error(" Upload error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const updateTeamMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, role, bio, email, linkedin, github } = req.body;

    const existing = await prisma.team.findUnique({ where: { id: Number(id) } });
    if (!existing) {
      return res.status(404).json({ message: "Team member not found" });
    }

    let newImageUrl = existing.image;

    if (req.file) {
      if (!req.file.mimetype.startsWith("image/")) {
        return res.status(400).json({ message: "Invalid file type. Only images allowed." });
      }

      if (existing.image) {
        const publicId = extractCloudinaryPublicId(existing.image);
        if (publicId) await cloudinary.uploader.destroy(publicId);
      }

      const result: any = await uploadToCloudinary(req.file.buffer);
      newImageUrl = result.secure_url;
    }

    const updated = await prisma.team.update({
      where: { id: Number(id) },
      data: {
        name: name ?? existing.name,
        role: role ?? existing.role,
        bio: bio ?? existing.bio,
        email: email ?? existing.email,
        linkedin: linkedin ?? existing.linkedin,
        github: github ?? existing.github,
        image: newImageUrl,
      },
    });

    return res.status(200).json({
      message: " Team member updated successfully",
      updated,
    });
  } catch (error: any) {
    console.error(" Update error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


export const deleteTeamMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.team.findUnique({ where: { id: Number(id) } });
    if (!existing) {
      return res.status(404).json({ message: "Team member not found" });
    }

    if (existing.image) {
      const publicId = extractCloudinaryPublicId(existing.image);
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }

    await prisma.team.delete({ where: { id: Number(id) } });

    return res.status(200).json({ message: " Team member deleted successfully" });
  } catch (error: any) {
    console.error(" Delete error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


const extractCloudinaryPublicId = (url: string): string | null => {
  try {
    const parts = url.split("/");
    const file = parts[parts.length - 1];
    const [publicId] = file.split(".");
    return `team/${publicId}`;
  } catch {
    return null;
  }
};
