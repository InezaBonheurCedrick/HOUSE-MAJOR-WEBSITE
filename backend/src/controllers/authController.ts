import { 
  Controller, Post, Body, Route, Tags, Security, Get, Delete, Path, Request 
} from "tsoa";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "secret123";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", 
  port: 465,              
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  }
});

@Route("auth")
@Tags("Authentication")
export class AuthController extends Controller {
  @Post("register")
  public async register(
    @Body() body: { username: string; email: string; password: string }
  ) {
    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) {
      this.setStatus(400);
      return { status: "error", message: "Email already registered" };
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = await prisma.user.create({
      data: { username: body.username, email: body.email, password: hashedPassword },
    });

    this.setStatus(201);
    return {
      status: "success",
      message: "User registered successfully",
      data: { userId: user.id },
    };
  }

  @Post("login")
  public async login(@Body() body: { email: string; password: string }) {
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) {
      this.setStatus(401);
      return { status: "error", message: "Invalid credentials" };
    }

    const isValid = await bcrypt.compare(body.password, user.password);
    if (!isValid) {
      this.setStatus(401);
      return { status: "error", message: "Invalid credentials" };
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    return {
      status: "success",
      message: "Login successful",
      data: { token },
    };
  }

  @Post("logout")
  public async logout() {
    this.setStatus(200);
    return { status: "success", message: "Logged out successfully" };
  }

  @Post("forgot-password")
  public async forgotPassword(@Body() body: { email: string }) {
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) {
      this.setStatus(404);
      return { status: "error", message: "Email not found" };
    }

    const rawToken = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedToken = await bcrypt.hash(rawToken, 10);
    const resetTokenExp = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: { email: body.email },
      data: { resetToken: hashedToken, resetTokenExp },
    });

    const mailOptions = {
      from: `"House Major" <${process.env.SMTP_USER}>`,
      to: body.email,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset</h2>
        <p>Hello ${user.username},</p>
        <p>Use this token to reset your password:</p>
        <h3 style="color: #007bff;">${rawToken}</h3>
        <p>This token expires in 15 minutes.</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      return { status: "success", message: "Reset token sent to your email" };
    } catch (err: any) {
      console.error("Email error:", err);
      this.setStatus(500);
      return { status: "error", message: "Failed to send reset email" };
    }
  }

  @Post("reset-password")
  public async resetPassword(
    @Body() body: { email: string; token: string; newPassword: string }
  ) {
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user || !user.resetToken || !user.resetTokenExp) {
      this.setStatus(400);
      return { status: "error", message: "Invalid or expired token" };
    }

    if (user.resetTokenExp < new Date()) {
      this.setStatus(400);
      return { status: "error", message: "Token expired" };
    }

    const isValidToken = await bcrypt.compare(body.token, user.resetToken);
    if (!isValidToken) {
      this.setStatus(400);
      return { status: "error", message: "Invalid token" };
    }

    const hashedPassword = await bcrypt.hash(body.newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, resetToken: null, resetTokenExp: null },
    });

    return { status: "success", message: "Password reset successfully" };
  }

  @Post("profile")
  @Security("jwt")
  public async updateProfile(
    @Request() request: any,
    @Body()
    body: {
      username?: string;
      email?: string;
      currentPassword?: string;
      newPassword?: string;
    }
  ) {
    const userId = request.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      this.setStatus(404);
      return { status: "error", message: "User not found" };
    }

    const updateData: any = {};

    if (body.username) updateData.username = body.username;

    if (body.email) {
      const existing = await prisma.user.findUnique({ where: { email: body.email } });
      if (existing && existing.id !== userId) {
        this.setStatus(400);
        return { status: "error", message: "Email already registered" };
      }
      updateData.email = body.email;
    }

    if (body.newPassword) {
      if (!body.currentPassword) {
        this.setStatus(400);
        return { status: "error", message: "Current password required" };
      }

      const valid = await bcrypt.compare(body.currentPassword, user.password);
      if (!valid) {
        this.setStatus(400);
        return { status: "error", message: "Current password incorrect" };
      }

      updateData.password = await bcrypt.hash(body.newPassword, 10);
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return {
      status: "success",
      message: "Profile updated successfully",
      data: {
        username: body.username || user.username,
        email: body.email || user.email,
      },
    };
  }

  @Post("admin/users")
  @Security("jwt")
  public async createAdminUser(
    @Body() body: { username: string; email: string; password: string }
  ) {
    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) {
      this.setStatus(400);
      return { status: "error", message: "Email already registered" };
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = await prisma.user.create({
      data: { username: body.username, email: body.email, password: hashedPassword },
    });

    this.setStatus(201);
    return {
      status: "success",
      message: "Admin user created successfully",
      data: { userId: user.id },
    };
  }

  @Get("admin/users")
  @Security("jwt")
  public async getAdminUsers() {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { status: "success", data: { users } };
  }

  @Delete("admin/users/{userId}")
  @Security("jwt")
  public async deleteAdminUser(
    @Path() userId: number,
    @Request() request: any
  ) {
    const currentUserId = request.user.id;

    if (Number(userId) === Number(currentUserId)) {
      this.setStatus(403);
      return { status: "error", message: "You cannot delete your own account" };
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      this.setStatus(404);
      return { status: "error", message: "User not found" };
    }

    await prisma.user.delete({ where: { id: userId } });
    return { status: "success", message: "User deleted successfully" };
  }
}
