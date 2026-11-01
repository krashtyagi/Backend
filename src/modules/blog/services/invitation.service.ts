import crypto from "crypto";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import BlogInvitation from "../models/invitation.model.js";
import BlogAuthorProfile from "../models/author.model.js";
import User from "../../auth/auth.model.js";
import slugify from "slugify";

// Helper to create transport
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const generateToken = (userId: any) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_ACCESS_SECRET || "default_secret",
    { expiresIn: "7d" }
  );
};

export const invitationService = {
  createInvitation: async (
    email: string,
    assignedRole: "blog_author" | "blog_editor" | "seo_manager",
    invitedBy: any
  ) => {
    const normalizedEmail = email.toLowerCase().trim();

    // Generate token and hash
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Delete existing pending invitations for this email
    await BlogInvitation.deleteMany({
      email: normalizedEmail,
      acceptedAt: null,
    });

    const invitation = await BlogInvitation.create({
      email: normalizedEmail,
      invitedBy: invitedBy._id,
      assignedRole,
      tokenHash,
      expiresAt,
    });

    // Send invitation email
    const acceptUrl = `${
      process.env.ADMIN_URL || "http://localhost:3002"
    }/accept-invite?token=${rawToken}`;

    try {
      const transporter = createEmailTransporter();
      await transporter.sendMail({
        from: `"Trivllo Platform" <${process.env.EMAIL_USER}>`,
        to: normalizedEmail,
        subject: `You've been invited to write on Trivllo (${assignedRole.replace("_", " ").toUpperCase()})`,
        html: `
          <div style="font-family: sans-serif; max-width: 580px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #111827; margin-bottom: 8px;">Welcome to Trivllo Editorial Team</h2>
            <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
              You have been invited by <strong>${invitedBy.firstName || "Trivllo Admin"}</strong> to contribute as a <strong>${assignedRole.replace("_", " ")}</strong>.
            </p>
            <div style="margin: 28px 0;">
              <a href="${acceptUrl}" style="background-color: #0284c7; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
                Accept Invitation & Activate Account
              </a>
            </div>
            <p style="color: #9ca3af; font-size: 12px;">
              This invitation link expires in 7 days. If you did not expect this invitation, you can safely ignore this email.
            </p>
          </div>
        `,
      });
    } catch (emailErr: any) {
      console.warn("Nodemailer notice, link logged for manual sharing:", emailErr.message);
    }

    return {
      invitationId: invitation._id,
      email: normalizedEmail,
      assignedRole,
      expiresAt,
      inviteUrl: acceptUrl,
    };
  },

  listInvitations: async () => {
    return BlogInvitation.find()
      .populate("invitedBy", "firstName lastName email")
      .sort({ createdAt: -1 });
  },

  verifyInvitation: async (rawToken: string) => {
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const invitation = await BlogInvitation.findOne({
      tokenHash,
      acceptedAt: null,
      expiresAt: { $gt: new Date() },
    }).populate("invitedBy", "firstName lastName email");

    if (!invitation) {
      throw new Error("This invitation link is invalid or has expired.");
    }

    // Check if user already has an existing account
    const existingUser = await User.findOne({ email: invitation.email });

    return {
      valid: true,
      email: invitation.email,
      assignedRole: invitation.assignedRole,
      invitedBy: invitation.invitedBy,
      hasAccount: !!existingUser,
    };
  },

  acceptInvitation: async (
    rawToken: string,
    options: { userId?: string; name?: string; password?: string }
  ) => {
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const invitation = await BlogInvitation.findOne({
      tokenHash,
      acceptedAt: null,
      expiresAt: { $gt: new Date() },
    });

    if (!invitation) {
      throw new Error("Invalid or expired invitation token.");
    }

    // Invitations are bound strictly to the email address in the invitation record
    const targetEmail = invitation.email.toLowerCase().trim();
    let user = await User.findOne({ email: targetEmail });

    if (!user) {
      // Create user account if not existing
      if (!options.password || options.password.length < 8) {
        throw new Error("Password must be at least 8 characters long.");
      }

      // Note: User model pre('save') hook hashes plain password using bcrypt (12 rounds)
      user = await User.create({
        email: targetEmail,
        password: options.password,
        firstName: options.name || "Writer",
        role: invitation.assignedRole,
        isVendor: false,
        isActive: true,
        providers: {
          local: { isVerified: true },
        },
      });
    } else {
      user.role = invitation.assignedRole;
      if (options.password && options.password.length >= 8) {
        // Assign plain password; User model pre('save') hook will hash it once
        user.password = options.password;
      }
      if (options.name) {
        user.firstName = options.name;
      }
      user.providers = user.providers || { local: { isVerified: true } };
      user.providers.local = { isVerified: true };
      await user.save();
    }

    // Mark invitation accepted
    invitation.acceptedAt = new Date();
    await invitation.save();

    // Create or update author profile
    const authorSlug = (slugify as any).default
      ? (slugify as any).default(
          `${user.firstName || "writer"} ${user.lastName || ""}`.trim() ||
            user.email ||
            "writer",
          { lower: true, strict: true }
        )
      : slugify(
          `${user.firstName || "writer"} ${user.lastName || ""}`.trim() ||
            user.email ||
            "writer",
          { lower: true, strict: true }
        );

    let authorProfile = await BlogAuthorProfile.findOne({ userId: user._id });
    if (!authorProfile) {
      authorProfile = await BlogAuthorProfile.create({
        userId: user._id,
        displayName:
          `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
          user.email ||
          "Trivllo Writer",
        slug: `${authorSlug}-${Math.floor(1000 + Math.random() * 9000)}`,
        avatar: user.avatar || "",
        designation:
          invitation.assignedRole === "blog_editor"
            ? "Editorial Manager"
            : "Travel Contributor",
      });
    }

    const token = generateToken(user._id);

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
      },
      assignedRole: invitation.assignedRole,
    };
  },
};
