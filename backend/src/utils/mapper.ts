import { Prisma, PrismaClient } from "@prisma/client";
import { ProjectCreateDto } from "../dtos/projectDtos";


export function mapProjectDtoToPrisma(
  dto: ProjectCreateDto
): Prisma.ProjectCreateInput {
  return {
    title: dto.title,
    description: dto.description,
    category: dto.category,
    date: dto.date,
    fullDescription: dto.fullDescription,
    images: dto.images,
    features: dto.features,
    results: dto.results as unknown as Prisma.InputJsonValue,
    tags: dto.tags,
    team: dto.team,
    duration: dto.duration,
    externalLinks: dto.externalLinks as unknown as Prisma.InputJsonValue,
    downloadLinks: dto.downloadLinks as unknown as Prisma.InputJsonValue,
    client: dto.client as unknown as Prisma.InputJsonValue,
  };
}


export function mapPartialProjectDtoToPrisma(
  dto: Partial<ProjectCreateDto>
): Prisma.ProjectUpdateInput {
  const updateData: Prisma.ProjectUpdateInput = {};

  if (dto.title !== undefined) updateData.title = dto.title;
  if (dto.description !== undefined) updateData.description = dto.description;
  if (dto.category !== undefined) updateData.category = dto.category;
  if (dto.date !== undefined) updateData.date = dto.date;
  if (dto.fullDescription !== undefined)
    updateData.fullDescription = dto.fullDescription;
  if (dto.images !== undefined) updateData.images = dto.images;
  if (dto.features !== undefined) updateData.features = dto.features;
  if (dto.results !== undefined)
    updateData.results = dto.results as unknown as Prisma.InputJsonValue;
  if (dto.tags !== undefined) updateData.tags = dto.tags;
  if (dto.team !== undefined) updateData.team = dto.team;
  if (dto.duration !== undefined) updateData.duration = dto.duration;
  if (dto.externalLinks !== undefined)
    updateData.externalLinks = dto.externalLinks as unknown as Prisma.InputJsonValue;
  if (dto.downloadLinks !== undefined)
    updateData.downloadLinks = dto.downloadLinks as unknown as Prisma.InputJsonValue;
  if (dto.client !== undefined)
    updateData.client = dto.client as unknown as Prisma.InputJsonValue;

  return updateData;
}
