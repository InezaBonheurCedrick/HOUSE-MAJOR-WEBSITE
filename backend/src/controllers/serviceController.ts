import { Controller, Get, Post, Put, Delete, Body, Path, Route, Tags, Security } from "tsoa";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

@Route("services")
@Tags("Services")
export class ServiceController extends Controller {

  @Get("frontend/all")
  public async getAllServicesForFrontend() {
    const services = await prisma.service.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        icon: true,
      },
      orderBy: { id: "asc" },
    });
    return services;
  }


  @Security("jwt")
  @Get("/")
  public async getAllServices() {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: "desc" },
    });
    return services;
  }


  @Security("jwt")
  @Get("{id}")
  public async getServiceById(@Path() id: number) {
    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      this.setStatus(404);
      return { message: "Service not found" };
    }

    return service;
  }


  @Security("jwt")
  @Post("/")
  public async createService(
    @Body()
    body: {
      title: string;
      description: string;
      icon: string;
      image?: string;
    }
  ) {
    const service = await prisma.service.create({
      data: {
        title: body.title,
        description: body.description,
        icon: body.icon,
        image: body.image,
      },
    });

    this.setStatus(201);
    return { message: "Service created successfully", service };
  }


  @Security("jwt")
  @Put("{id}")
  public async updateService(
    @Path() id: number,
    @Body()
    body: {
      title?: string;
      description?: string;
      icon?: string;
      image?: string;
    }
  ) {
    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) {
      this.setStatus(404);
      return { message: "Service not found" };
    }

    const updated = await prisma.service.update({
      where: { id },
      data: {
        title: body.title ?? existing.title,
        description: body.description ?? existing.description,
        icon: body.icon ?? existing.icon,
        image: body.image ?? existing.image,
      },
    });

    return { message: "Service updated successfully", service: updated };
  }


  @Security("jwt")
  @Delete("{id}")
  public async deleteService(@Path() id: number) {
    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) {
      this.setStatus(404);
      return { message: "Service not found" };
    }

    await prisma.service.delete({ where: { id } });
    return { message: "Service deleted successfully" };
  }
}
