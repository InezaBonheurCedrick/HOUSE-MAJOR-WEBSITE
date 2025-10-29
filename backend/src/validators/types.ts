interface JsonObject {
  [key: string]: any;
}

export interface ProjectInput {
  title: string;
  description: string;
  category: string;
  date: string;
  fullDescription?: string;
  images: string[];
  features: string[];
  results?: JsonObject;
  tags: string[];
  team: string[];
  duration?: string;
  externalLinks?: JsonObject;
  downloadLinks?: JsonObject;
  client?: JsonObject;
}
