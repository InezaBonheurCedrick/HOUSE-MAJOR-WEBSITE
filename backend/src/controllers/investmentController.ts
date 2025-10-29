import { Controller, Get, Post, Put, Delete, Route, Body, Path, Tags, Security } from "tsoa";
import { PrismaClient } from "../generated/prisma";
import { sendContactEmail } from "../utils/mailer";

const prisma = new PrismaClient();

@Route("investments")
@Tags("Investments")
export class InvestmentController extends Controller {

  @Get("/")
  public async getAll() {
    return prisma.investment.findMany();
  }

  @Get("{id}")
  public async getById(@Path() id: number) {
    return prisma.investment.findUnique({ where: { id } });
  }
  
  @Post("/inquiry")
  public async createInquiry(@Body() body: { email: string; investmentNature: string; message?: string }) {
    if (!body.email || !body.investmentNature) {
      this.setStatus(400);
      return { message: "Email and investment nature are required." };
    }

    const investment = await prisma.investment.create({ 
      data: {
        title: `Investment Inquiry - ${body.investmentNature}`,
        description: body.message || `Investment inquiry from ${body.email}. Investment nature: ${body.investmentNature}`,
        email: body.email
      }
    });

    sendContactEmail({
      name: 'Investment Inquiry',
      email: body.email,
      message: `Investment Nature: ${body.investmentNature}\n\nEmail: ${body.email}\n\nThis is an investment inquiry from a potential investor. Please contact them to discuss investment opportunities.`
    }).catch((err) =>
      console.error("Investment email notification failed:", err)
    );

    this.setStatus(201);
    return {
      message: "Investment inquiry submitted successfully",
      investment: investment,
    };
  }
  
  @Security("jwt")
  @Post("/")
  public async create(@Body() body: { title: string; description: string; image?: string }) {
    return prisma.investment.create({ data: body });
  }
  
  @Security("jwt")
  @Put("{id}")
  public async update(@Path() id: number, @Body() body: { title: string; description: string; image?: string }) {
    return prisma.investment.update({ where: { id }, data: body });
  }
  
  @Security("jwt")
  @Delete("{id}")
  public async delete(@Path() id: number) {

    const investment = await prisma.investment.findUnique({ where: { id } });

    if (!investment) {
      const e = new Error(`Investment with id ${id} not found`);
      (e as any).status = 404;
      throw e;
    }
    await prisma.investment.delete({ where: { id } });
    return { message: "Investment deleted successfully" };
  }
}