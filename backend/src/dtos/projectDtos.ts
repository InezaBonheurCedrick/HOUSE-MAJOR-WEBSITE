export interface ProjectClientDto {
  name: string;
  logo: string;
  industry: string;
  location: string;
}

export interface ProjectLinksDto {
  live?: string;
  github?: string;
}

export interface ProjectDownloadsDto {
  ios?: string;
  android?: string;
}

export interface ProjectResultDto {
  metric: string;
  label: string;
}


export interface ProjectCreateDto {
  title: string;
  description: string;
  category: string;
  date: string;
  fullDescription?: string;
  images: string[];
  features: string[];
  results: ProjectResultDto[];
  tags: string[];
  team: string[];
  duration?: string;
  externalLinks: ProjectLinksDto;
  downloadLinks: ProjectDownloadsDto;
  client: ProjectClientDto;
}


export interface ProjectResponseDto extends ProjectCreateDto {
  id: number;
  createdAt: Date;
}
