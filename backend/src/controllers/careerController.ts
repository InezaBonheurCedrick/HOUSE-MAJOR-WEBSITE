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
  CareerCreateDto,
  CareerResponseDto,
  ApplicationCreateDto,
  ApplicationResponseDto,
} from "../dtos/careerDtos";

const prisma = new PrismaClient();

@Route("careers")
@Tags("Careers")
export class CareerController extends Controller {

  @Get("/")
  public async getAllCareers(): Promise<CareerResponseDto[]> {
    const careers = await prisma.career.findMany({
      orderBy: { createdAt: "desc" },
      include: { 
        applications: {
          select: {
            id: true
          }
        }
      },
    });
    return careers.map((career) => ({
      ...career,
      salary: career.salary ?? undefined,
      experience: career.experience ?? undefined,
      posted: career.posted ?? undefined,
      applicationCount: career.applications.length,
    }));
  }

  @Get("{id}")
  public async getCareerById(
    @Path() id: number
  ): Promise<CareerResponseDto | { message: string }> {
    const career = await prisma.career.findUnique({ where: { id } });
    if (!career) {
      this.setStatus(404);
      return { message: "Career not found" };
    }
    return {
      ...career,
      salary: career.salary ?? undefined,
      experience: career.experience ?? undefined,
      posted: career.posted ?? undefined,
    };
  }


  @Security("jwt")
  @Post("/")
  public async createCareer(
    @Body() body: CareerCreateDto
  ): Promise<{ message: string; career: CareerResponseDto }> {
    const career = await prisma.career.create({ data: body });
    this.setStatus(201);
    return {
      message: "Career created successfully",
      career: {
        ...career,
        salary: career.salary ?? undefined,
        experience: career.experience ?? undefined,
        posted: career.posted ?? undefined,
      },
    };
  }


  @Security("jwt")
  @Put("{id}")
  public async updateCareer(
    @Path() id: number,
    @Body() body: Partial<CareerCreateDto>
  ): Promise<{ message: string; career?: CareerResponseDto }> {
    const existing = await prisma.career.findUnique({ where: { id } });
    if (!existing) {
      this.setStatus(404);
      return { message: "Career not found" };
    }

    const updated = await prisma.career.update({
      where: { id },
      data: body,
    });

    return {
      message: "Career updated successfully",
      career: {
        ...updated,
        salary: updated.salary ?? undefined,
        experience: updated.experience ?? undefined,
        posted: updated.posted ?? undefined,
      },
    };
  }

  @Security("jwt")
  @Delete("{id}")
  public async deleteCareer(@Path() id: number): Promise<{ message: string }> {
    await prisma.career.delete({ where: { id } });
    return { message: "Career deleted successfully" };
  }
}

@Route("applications")
@Tags("Applications")
export class ApplicationController extends Controller {

@Post("/")
public async submitApplication(
  @Body() body: ApplicationCreateDto
): Promise<{ message: string; application: ApplicationResponseDto }> {
  try {
    let careerConnect = undefined;

    if (body.careerId) {
      const career = await prisma.career.findUnique({ where: { id: body.careerId } });
      if (!career) {
        this.setStatus(404);
        return { message: "Career not found" } as any;
      }
      careerConnect = { connect: { id: body.careerId } };
    }

    const application = await prisma.application.create({
      data: {
        fullName: body.fullName,
        email: body.email,
        phone: body.phone ?? null,
        resumeUrl: body.resumeUrl ?? null,
        coverLetter: body.coverLetter ?? null,
        jobTitle: body.jobTitle ?? null,
        ...(careerConnect ? { career: careerConnect } : {}),
      },
    });

    this.setStatus(201);
    return {
      message: "Application submitted successfully",
      application: {
        ...application,
        phone: application.phone ?? null,
        resumeUrl: application.resumeUrl ?? null,
        coverLetter: application.coverLetter ?? null,
        jobTitle: application.jobTitle ?? null,
        careerId: application.careerId ?? null,
      },
    };
  } catch (err: any) {
    this.setStatus(500);
    return { message: "Internal Server Error: " + err.message } as any;
  }
}


  @Security("jwt")
  @Get("/")
  public async getAllApplications(): Promise<ApplicationResponseDto[]> {
    const apps = await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
    });
    return apps.map((a) => ({
      ...a,
      phone: a.phone ?? null,
      resumeUrl: a.resumeUrl ?? null,
      coverLetter: a.coverLetter ?? null,
      jobTitle: a.jobTitle ?? null,
      careerId: a.careerId ?? null,
    }));

  }

  @Security("jwt")
  @Delete("{id}")
  public async deleteApplication(@Path() id: number): Promise<{ message: string }> {
    await prisma.application.delete({ where: { id } });
    return { message: "Application deleted successfully" };
  }


  @Security("jwt")
  @Put("{id}/accept")
  public async acceptApplication(@Path() id: number): Promise<{ message: string }> {
    const application = await prisma.application.findUnique({ where: { id } });
    if (!application) {
      this.setStatus(404);
      return { message: "Application not found" };
    }
    return { message: "Application accepted successfully" };
  }

  @Security("jwt")
  @Put("{id}/reject")
  public async rejectApplication(@Path() id: number): Promise<{ message: string }> {
    const application = await prisma.application.findUnique({ where: { id } });
    if (!application) {
      this.setStatus(404);
      return { message: "Application not found" };
    }
    return { message: "Application rejected successfully" };
  }
}
