import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import cloudinary from "../utils/cloudinary";

const prisma = new PrismaClient();


export const uploadProject = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      category,
      date,
      fullDescription,
      features,
      results,
      tags,
      team,
      duration,
      externalLinks,
      downloadLinks,
      client,
    } = req.body;

    if (!title || !description || !category || !date) {
      return res.status(400).json({ message: "Required fields are missing." });
    }

    let imageUrls: string[] = [];

    if (req.files && Array.isArray(req.files)) {
      const uploadPromises = req.files.map((file: Express.Multer.File) =>
        new Promise<string>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { 
              folder: "projects",
              timeout: 60000, // 60 seconds timeout per upload
              resource_type: "auto"
            },
            (error, result) => {
              if (error) {
                console.error("Cloudinary upload error:", error);
                return reject(error);
              }
              resolve(result!.secure_url);
            }
          );
          stream.end(file.buffer);
        })
      );

      imageUrls = await Promise.all(uploadPromises);
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        category,
        date,
        fullDescription: fullDescription || null,
        images: imageUrls,
        features: features ? JSON.parse(features) : [],
        results: results ? JSON.parse(results) : [],
        tags: tags ? JSON.parse(tags) : [],
        team: team ? JSON.parse(team) : [],
        duration: duration || null,
        externalLinks: externalLinks ? JSON.parse(externalLinks) : {},
        downloadLinks: downloadLinks ? JSON.parse(downloadLinks) : {},
        client: client ? JSON.parse(client) : {},
      },
    });

    return res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


export const updateProjectWithImages = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.project.findUnique({ where: { id: Number(id) } });

    if (!existing) {
      return res.status(404).json({ message: "Project not found" });
    }

    let newImageUrls = existing.images || [];

    if (req.files && Array.isArray(req.files)) {
      // Delete old Cloudinary images first
      for (const imgUrl of existing.images) {
        const publicId = extractCloudinaryPublicId(imgUrl);
        if (publicId) await cloudinary.uploader.destroy(publicId);
      }

      // Upload new images
      const uploadPromises = req.files.map((file: Express.Multer.File) =>
        new Promise<string>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { 
              folder: "projects",
              timeout: 60000, // 60 seconds timeout per upload
              resource_type: "auto"
            },
            (error, result) => {
              if (error) {
                console.error("Cloudinary upload error:", error);
                return reject(error);
              }
              resolve(result!.secure_url);
            }
          );
          stream.end(file.buffer);
        })
      );

      newImageUrls = await Promise.all(uploadPromises);
    }

    // Helper function to safely parse JSON
    const safeJsonParse = (jsonString: string, fallback: any) => {
      try {
        return jsonString ? JSON.parse(jsonString) : fallback;
      } catch (error) {
        console.error('JSON parsing error:', error);
        return fallback;
      }
    };

    const updated = await prisma.project.update({
      where: { id: Number(id) },
      data: {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        date: req.body.date,
        fullDescription: req.body.fullDescription || null,
        duration: req.body.duration || null,
        images: newImageUrls,
        features: safeJsonParse(req.body.features, existing.features),
        results: safeJsonParse(req.body.results, existing.results),
        tags: safeJsonParse(req.body.tags, existing.tags),
        team: safeJsonParse(req.body.team, existing.team),
        externalLinks: safeJsonParse(req.body.externalLinks, existing.externalLinks),
        downloadLinks: safeJsonParse(req.body.downloadLinks, existing.downloadLinks),
        client: safeJsonParse(req.body.client, existing.client),
      },
    });

    return res.status(200).json({
      message: "Project updated successfully",
      project: updated,
    });
  } catch (error: any) {
    console.error("Update error:", error);
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
    return `projects/${publicId}`;
  } catch {
    return null;
  }
};
