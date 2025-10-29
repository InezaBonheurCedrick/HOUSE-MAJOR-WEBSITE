import {
  Controller,
  Get,
  Post,
  Delete,
  Route,
  Body,
  Path,
  Tags,
  Security,
} from "tsoa";
import { PrismaClient } from "../generated/prisma";
import { sendContactEmail } from "../utils/mailer";

const prisma = new PrismaClient();

@Route("contacts")
@Tags("Contacts")
export class ContactController extends Controller {
  @Post("/")
  public async create(
    @Body() body: { name: string; email: string; message: string }
  ) {
    if (!body.name || !body.email || !body.message) {
      this.setStatus(400);
      return { message: "Name, email, and message are required." };
    }

    const newContact = await prisma.contact.create({ data: body });

    sendContactEmail(body).catch((err) =>
      console.error("Email notification failed:", err)
    );

    this.setStatus(201);
    return {
      message: "Message sent successfully",
      contact: newContact,
    };
  }

  @Security("jwt")
  @Get("/")
  public async getAll() {
    return prisma.contact.findMany({ orderBy: { createdAt: "desc" } });
  }

  @Security("jwt")
  @Get("{id}")
  public async getById(@Path() id: number) {
    const contact = await prisma.contact.findUnique({ where: { id } });
    if (!contact) {
      this.setStatus(404);
      return { message: "Contact message not found." };
    }
    return contact;
  }

  @Security("jwt")
  @Delete("{id}")
  public async delete(@Path() id: number) {
    const existing = await prisma.contact.findUnique({ where: { id } });
    if (!existing) {
      this.setStatus(404);
      return { message: "Contact not found." };
    }
    await prisma.contact.delete({ where: { id } });
    return { message: "Contact deleted successfully" };
  }
}
