import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import cloudinary from "../utils/cloudinary";
import path from "path";

const prisma = new PrismaClient();

export const uploadApplication = async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, jobTitle, coverLetter, careerId } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({
        message: "Full name and email are required.",
      });
    }

    let resumeUrl: string | null = null;

    if (req.file) {
      try {
        const originalName = req.file.originalname || "resume.pdf";
        const extension = path.extname(originalName) || ".pdf";
        const publicId = path.basename(originalName, extension);

        const result = await new Promise<any>((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              folder: "resumes",
              resource_type: "raw", // allow PDFs and non-images
              public_id: publicId,   // keep original name
              format: extension.replace(".", ""), // ensure .pdf
              use_filename: true,
              unique_filename: true,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(req.file!.buffer);
        });

        resumeUrl = result.secure_url;
        console.log("Cloudinary upload successful:", resumeUrl);
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({ message: "Failed to upload resume." });
      }
    } else {
      console.log("No file provided, continuing without resume.");
    }

    let connectCareer = undefined;
    if (careerId) {
      const careerExists = await prisma.career.findUnique({
        where: { id: Number(careerId) },
      });
      if (!careerExists) {
        return res.status(404).json({ message: "Career not found" });
      }
      connectCareer = { connect: { id: Number(careerId) } };
    }

    const application = await prisma.application.create({
      data: {
        fullName,
        email,
        phone: phone ?? null,
        jobTitle: jobTitle ?? null,
        coverLetter: coverLetter ?? null,
        resumeUrl,
        ...(connectCareer ? { career: connectCareer } : {}),
      },
    });

    return res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
