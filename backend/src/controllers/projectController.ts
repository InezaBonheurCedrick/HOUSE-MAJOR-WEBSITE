import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Path,
  Route,
  Tags,
  Security,
} from "tsoa";
import { PrismaClient } from "@prisma/client";
import {
  ProjectCreateDto,
  ProjectResponseDto,
} from "../dtos/projectDtos";
import {
  mapProjectDtoToPrisma,
  mapPartialProjectDtoToPrisma,
} from "../utils/mapper";

const prisma = new PrismaClient();

@Route("projects")
@Tags("Projects")
export class ProjectController extends Controller {
  @Get("/")
  public async getAllProjects(): Promise<ProjectResponseDto[]> {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return projects as unknown as ProjectResponseDto[];
  }

  @Get("{id}")
  public async getProjectById(
    @Path() id: number
  ): Promise<ProjectResponseDto | { message: string }> {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      this.setStatus(404);
      return { message: "Project not found" };
    }
    return project as unknown as ProjectResponseDto;
  }

  @Security("jwt")
  @Post("/")
  public async createProject(
    @Body() body: ProjectCreateDto
  ): Promise<{ message: string; project: ProjectResponseDto }> {
    const project = await prisma.project.create({
      data: mapProjectDtoToPrisma(body),
    });

    this.setStatus(201);
    return {
      message: "Project created successfully",
      project: project as unknown as ProjectResponseDto,
    };
  }

  @Security("jwt")
  @Put("{id}")
  public async updateProject(
    @Path() id: number,
    @Body() body: Partial<ProjectCreateDto>
  ): Promise<{ message: string; project?: ProjectResponseDto }> {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      this.setStatus(404);
      return { message: "Project not found" };
    }

    const updated = await prisma.project.update({
      where: { id },
      data: mapPartialProjectDtoToPrisma(body),
    });

    return {
      message: "Project updated successfully",
      project: updated as unknown as ProjectResponseDto,
    };
  }

  @Security("jwt")
  @Delete("{id}")
  public async deleteProject(@Path() id: number): Promise<{ message: string }> {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      this.setStatus(404);
      return { message: "Project not found" };
    }

    await prisma.project.delete({ where: { id } });
    return { message: "Project deleted successfully" };
  }
}
