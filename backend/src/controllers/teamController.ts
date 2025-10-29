import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Route,
  Body,
  Path,
  Tags,
  Security,
} from "tsoa";
import { PrismaClient } from "@prisma/client";
import cloudinary from "../utils/cloudinary";

const prisma = new PrismaClient();

@Route("team")
@Tags("Team")
export class TeamController extends Controller {

  @Get("/")
  public async getAll() {
    try {
      const members = await prisma.team.findMany({
        orderBy: { createdAt: "desc" },
      });
      return members;
    } catch (error: any) {
      console.error("Error fetching team members:", error);
      this.setStatus(500);
      return { message: "Failed to fetch team members", error: error.message };
    }
  }


  @Get("{id}")
  public async getById(@Path() id: number) {
    try {
      const member = await prisma.team.findUnique({ where: { id } });
      if (!member) {
        this.setStatus(404);
        return { message: "Team member not found" };
      }
      return member;
    } catch (error: any) {
      console.error("Error fetching team member:", error);
      this.setStatus(500);
      return { message: "Failed to fetch team member", error: error.message };
    }
  }

  @Security("jwt")
  @Post("/")
  public async create(
    @Body()
    body: {
      name: string;
      role: string;
      bio?: string;
      image?: string;
      email?: string;
      linkedin?: string;
      github?: string;
    }
  ) {
    try {
      if (!body.name || !body.role) {
        this.setStatus(400);
        return { message: "Name and role are required." };
      }

      const newMember = await prisma.team.create({
        data: {
          name: body.name,
          role: body.role,
          bio: body.bio ?? null,
          image: body.image ?? null,
          email: body.email ?? null,
          linkedin: body.linkedin ?? null,
          github: body.github ?? null,
        },
      });

      this.setStatus(201);
      return {
        message: "Team member created successfully",
        member: newMember,
      };
    } catch (error: any) {
      console.error("Error creating team member:", error);
      this.setStatus(500);
      return { message: "Failed to create team member", error: error.message };
    }
  }

  @Security("jwt")
  @Put("{id}")
  public async update(
    @Path() id: number,
    @Body()
    body: {
      name?: string;
      role?: string;
      bio?: string;
      image?: string;
      email?: string;
      linkedin?: string;
      github?: string;
    }
  ) {
    try {
      const member = await prisma.team.findUnique({ where: { id } });
      if (!member) {
        this.setStatus(404);
        return { message: "Team member not found" };
      }

      if (body.image && member.image && member.image !== body.image) {
        try {
          const publicId = extractCloudinaryPublicId(member.image);
          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
          }
        } catch (err) {
          console.warn("Failed to remove old image:", err);
        }
      }

      const updated = await prisma.team.update({
        where: { id },
        data: {
          name: body.name ?? member.name,
          role: body.role ?? member.role,
          bio: body.bio ?? member.bio,
          image: body.image ?? member.image,
          email: body.email ?? member.email,
          linkedin: body.linkedin ?? member.linkedin,
          github: body.github ?? member.github,
        },
      });

      this.setStatus(200);
      return {
        message: "Team member updated successfully",
        member: updated,
      };
    } catch (error: any) {
      console.error("Error updating team member:", error);
      this.setStatus(500);
      return { message: "Failed to update team member", error: error.message };
    }
  }

  @Security("jwt")
  @Delete("{id}")
  public async delete(@Path() id: number) {
    try {
      const member = await prisma.team.findUnique({ where: { id } });
      if (!member) {
        this.setStatus(404);
        return { message: "Team member not found" };
      }

      if (member.image) {
        const publicId = extractCloudinaryPublicId(member.image);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (err) {
            console.warn("Failed to delete image from Cloudinary:", err);
          }
        }
      }

      await prisma.team.delete({ where: { id } });
      this.setStatus(200);
      return { message: "Team member deleted successfully" };
    } catch (error: any) {
      console.error("Error deleting team member:", error);
      this.setStatus(500);
      return { message: "Failed to delete team member", error: error.message };
    }
  }
}

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
