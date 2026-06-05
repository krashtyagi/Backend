require("dotenv").config();
const axios = require("axios");
const nodemailer = require("nodemailer");
const logger = require("./logger");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendWhatsAppOTP = async (phone, otp) => {
  try {
    const cleanNumber = phone.replace("+91", "");

    await axios.post(
      "https://api.interakt.ai/v1/public/message/",
      {
        countryCode: "91",
        phoneNumber: cleanNumber,
        type: "Template",
        template: {
          name: "otp_verification_hilexa",
          languageCode: "en",
          bodyValues: [otp],
          buttonValues: {
            0: [otp],
          },
        },
      },
      {
        headers: {
          Authorization: `Basic ${process.env.INTERAKT_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw new Error("Failed to send WhatsApp OTP");
  }
};

const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: `"Helix Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email for Helix – OTP Inside",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Welcome to Helix 🚀</h2>
          <p>Your One-Time Password (OTP) is:</p>
          <h1 style="letter-spacing: 3px;">${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
          <p>If you did not request this, please ignore.</p>
          <br/>
          <p>— Team Helix</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    logger.error("Helix email send failed:", err.message);
    throw err;
  }
};

const sendBookingConfirmationEmail = async (email, details) => {
  try {
    const mailOptions = {
      from: `"Helix Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Booking Confirmed! Reference: ${details.bookingId}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 15px;">
          <h2 style="color: #f97316;">Booking Confirmed! 🥳</h2>
          <p>Hi <strong>${details.customerName}</strong>,</p>
          <p>Pack your bags! Your stay at <strong>${details.hotelName}</strong> has been successfully booked.</p>
          
          <div style="background: #f8fafc; padding: 15px; border-radius: 10px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Booking ID:</strong> ${details.bookingId}</p>
            <p style="margin: 5px 0;"><strong>Room Type:</strong> ${details.roomName}</p>
            <p style="margin: 5px 0;"><strong>Check-in:</strong> ${new Date(details.checkIn).toLocaleDateString()}</p>
            <p style="margin: 5px 0;"><strong>Check-out:</strong> ${new Date(details.checkOut).toLocaleDateString()}</p>
            <p style="margin: 5px 0; color: #16a34a;"><strong>Total Paid:</strong> ₹${details.amount}</p>
          </div>

          <p>If you have any questions, feel free to reply to this email.</p>
          <p>Happy Travels,<br/><strong>Team Helix</strong></p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    logger.error("Helix booking email send failed:", err.message);
    throw err;
  }
};

const sendAdminVendorNotificationEmail = async (vendor, hotel = null) => {
  try {
    const subject = "🚨 New Vendor Submission Received";

    const mailOptions = {
      from: `"Helix Support" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject,
      html: `
        <h2>New Vendor Request 🚀</h2>

        <p><b>Business Name:</b> ${vendor.businessName || "N/A"}</p>
        <p><b>Email:</b> ${vendor.businessEmail || "N/A"}</p>
        <p><b>Phone:</b> ${vendor.businessPhone || "N/A"}</p>
        <p><b>City:</b> ${vendor.city || "N/A"}</p>
        <p><b>Service Type:</b> ${vendor.serviceType}</p>

        ${
          hotel
            ? `
          <hr/>
          <h3>Hotel Info</h3>
          <p><b>Name:</b> ${hotel.name}</p>
          <p><b>City:</b> ${hotel.city}</p>
          <p><b>Address:</b> ${hotel.address}</p>
        `
            : ""
        }

        <br/>
        <p>Please review and take action from admin panel.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    logger.error("Admin vendor email failed:", err.message);
    throw err;
  }
};

const sendVendorSubmissionConfirmationEmail = async (vendor) => {
  try {
    const subject = "Your Request is Under Review ⏳";

    const mailOptions = {
      from: `"Helix Support" <${process.env.EMAIL_USER}>`,
      to: vendor.businessEmail,
      subject,
      html: `
        <h2>Hello ${vendor.businessName || "Vendor"},</h2>

        <p>Thank you for submitting your business on <b>Helix</b> 🚀</p>

        <p>Your request is currently under review by our team.</p>

        <p>⏳ You will be notified once it's approved.</p>

        <br/>

        <p>— Team Helix</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    logger.error("Vendor confirmation email failed:", err.message);
    throw err;
  }
};

const sendVendorApprovalEmail = async (vendor) => {
  try {
    const subject = "🎉 Your Vendor Application is Approved!";

    const mailOptions = {
      from: `"Helix Support" <${process.env.EMAIL_USER}>`,
      to: vendor.businessEmail,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Congratulations ${vendor.businessName || "Vendor"} 🎉</h2>

          <p>Your application has been <b style="color: green;">approved</b> by our team.</p>

          <p>You can now:</p>
          <ul>
            <li>Login to your dashboard</li>
            <li>Add your listings (Hotel, Cab, etc.)</li>
            <li>Start receiving bookings 🚀</li>
          </ul>

          <br/>

          <p>We’re excited to have you onboard!</p>

          <p>— Team Helix</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    logger.error("Vendor approval email failed:", err.message);
    throw err;
  }
};

const sendVendorRejectionEmail = async (vendor) => {
  try {
    const subject = "❌ Your Vendor Application Needs Changes";

    // reasons ko readable list me convert
    let reasonsHtml = "<p>No specific reasons provided.</p>";
    if (
      vendor.rejectionReasons &&
      Object.keys(vendor.rejectionReasons).length
    ) {
      reasonsHtml = "<ul>";
      for (const [step, reason] of Object.entries(vendor.rejectionReasons)) {
        reasonsHtml += `<li><b>Step ${step}:</b> ${reason}</li>`;
      }
      reasonsHtml += "</ul>";
    }

    const mailOptions = {
      from: `"Helix Support" <${process.env.EMAIL_USER}>`,
      to: vendor.businessEmail,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Hello ${vendor.businessName || "Vendor"},</h2>

          <p>Your application has been <b style="color: red;">rejected</b> for now.</p>

          <p><b>Issues to fix:</b></p>
          ${reasonsHtml}

          <p>Please log in, fix the above issues, and resubmit your application.</p>


          <br/>
          <p>— Team Helix</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    logger.error("Vendor rejection email failed:", err.message);
    throw err;
  }
};

const sendAccountDeletionApprovedEmail = async (email, firstName) => {
  try {
    const mailOptions = {
      from: `"Helixa Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Account Deletion Request Approved",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Account Deleted Successfully</h2>

          <p>Hello ${firstName},</p>

          <p>Your account deletion request has been reviewed and approved.</p>

          <p>Your account and associated personal information have been permanently removed from our platform.</p>

          <p>Thank you for being a part of Helix.</p>

          <br />
          <p>— Team Helixa</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    logger.error("Account deletion approved email failed:", err.message);
    throw err;
  }
};

const sendAccountDeletionRejectedEmail = async (email, firstName) => {
  try {
    const mailOptions = {
      from: `"Helixa Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Account Deletion Request Rejected",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Account Deletion Request Update</h2>

          <p>Hello ${firstName},</p>

          <p>We have reviewed your account deletion request.</p>

          <p>Your request could not be approved at this time.</p>

          <p>Your account remains active and accessible.</p>

          <br />
          <p>— Team Helixa</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    logger.error("Account deletion rejected email failed:", err.message);
    throw err;
  }
};

const sendAccountDeletionApprovedWhatsApp = async (phone, firstName) => {
  try {
    const cleanNumber = phone.replace("+91", "");

    await axios.post(
      "https://api.interakt.ai/v1/public/message/",
      {
        countryCode: "91",
        phoneNumber: cleanNumber,
        type: "Template",
        template: {
          name: "account_delete_approved",
          languageCode: "en",
          bodyValues: [firstName],
        },
      },
      {
        headers: {
          Authorization: `Basic ${process.env.INTERAKT_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    logger.error(
      "Account deletion approved WhatsApp failed:",
      error.response?.data || error.message,
    );
  }
};

const sendAccountDeletionRejectedWhatsApp = async (phone, firstName) => {
  try {
    const cleanNumber = phone.replace("+91", "");

    await axios.post(
      "https://api.interakt.ai/v1/public/message/",
      {
        countryCode: "91",
        phoneNumber: cleanNumber,
        type: "Template",
        template: {
          name: "account_delete_rejected",
          languageCode: "en",
          bodyValues: [firstName],
        },
      },
      {
        headers: {
          Authorization: `Basic ${process.env.INTERAKT_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    logger.error(
      "Account deletion rejected WhatsApp failed:",
      error.response?.data || error.message,
    );
  }
};
module.exports = {
  sendWhatsAppOTP,
  sendOTPEmail,
  sendBookingConfirmationEmail,
  sendAdminVendorNotificationEmail,
  sendVendorSubmissionConfirmationEmail,
  sendVendorApprovalEmail,
  sendVendorRejectionEmail,
  sendAccountDeletionApprovedEmail,
  sendAccountDeletionApprovedWhatsApp,
  sendAccountDeletionRejectedEmail,
  sendAccountDeletionRejectedWhatsApp,
};
