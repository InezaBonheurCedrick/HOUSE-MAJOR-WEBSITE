import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import multer from "multer";
import { RegisterRoutes } from "./routes/routes";
import { ValidateError } from "tsoa";
import { authenticate } from "./middleware/auth";
import { uploadApplication } from "./controllers/uploadApplicationController";
import { uploadTeamImage, updateTeamMember, deleteTeamMember } from "./controllers/uploadTeamImageController";
import { PrismaClient } from "@prisma/client";
import { uploadProject, updateProjectWithImages } from "./controllers/uploadProjectController";



dotenv.config(); 
const app: Application = express();
const prisma = new PrismaClient();

app.use(cors({ origin: "https://house-major-website.vercel.app/", credentials: true }));
app.use(helmet());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use((req, res, next) => {
  req.setTimeout(120000);
  res.setTimeout(120000); 
  next();
});


const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 10,
  },
});

//upload projects images
app.post("/projects/upload", upload.array("images", 10), uploadProject);
//update project image (separate route to avoid conflict with TSOA PUT /projects/:id)
app.put("/projects/:id/upload", upload.array("images", 10), updateProjectWithImages);
//upload resume for applications
app.post("/upload-application", upload.single("resume"), uploadApplication);
//upload team member image
app.post("/team/upload", upload.single("image"), uploadTeamImage);
//update team member image
app.put("/team/:id", upload.single("image"), updateTeamMember);
//delete team member image
app.delete("/team/:id", deleteTeamMember);

app.put("/applications/:id/accept", authenticate, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const application = await prisma.application.findUnique({ where: { id } });
    if (!application) return res.status(404).json({ message: "Application not found" });
    
    await prisma.application.update({
      where: { id },
      data: { status: "Accepted" }
    });
    
    return res.json({ message: "Application accepted successfully" });
  } catch (err: any) {
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

app.put("/applications/:id/reject", authenticate, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const application = await prisma.application.findUnique({ where: { id } });
    if (!application) return res.status(404).json({ message: "Application not found" });
    
    await prisma.application.update({
      where: { id },
      data: { status: "Rejected" }
    });
    
    return res.json({ message: "Application rejected successfully" });
  } catch (err: any) {
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

RegisterRoutes(app);

app.use((err: unknown, req: Request, res: Response, next: any) => {
  if (err instanceof ValidateError) {
    console.warn("Validation Error:", err.fields);
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  }

  if (err instanceof Error) {
    console.error("Error:", err.message);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }

  next();
});

app.use("/docs", swaggerUi.serve, async (_req: Request, res: Response) => {
  const swaggerDocument = await import("../build/swagger.json");
  res.send(swaggerUi.generateHTML(swaggerDocument));
});

app.get("/", (_req: Request, res: Response) => {
  res.send("HOUSE MAJOR backend running with Cloudinary integration ");
});

app.get("/protected", authenticate, (_req: Request, res: Response) => {
  res.json({ message: "You accessed a protected route!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(` Server running on http://localhost:${PORT}`)
);
