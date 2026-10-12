"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key2 of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key2) && key2 !== except)
        __defProp(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/modules/availability/availability.model.ts
var availability_model_exports = {};
__export(availability_model_exports, {
  Availability: () => Availability,
  default: () => availability_model_default
});
var import_mongoose10, availabilitySchema, Availability, availability_model_default;
var init_availability_model = __esm({
  "src/modules/availability/availability.model.ts"() {
    "use strict";
    import_mongoose10 = __toESM(require("mongoose"), 1);
    availabilitySchema = new import_mongoose10.Schema(
      {
        roomTypeId: {
          type: import_mongoose10.Schema.Types.ObjectId,
          ref: "RoomType",
          required: true
        },
        date: {
          type: Date,
          required: true,
          index: true
        },
        bookedRooms: {
          type: Number,
          default: 0,
          min: 0
        },
        blockedRooms: {
          type: Number,
          default: 0,
          min: 0
        },
        priceOverride: {
          type: Number,
          min: 0
        }
      },
      { timestamps: true }
    );
    availabilitySchema.index({ roomTypeId: 1, date: 1 }, { unique: true });
    Availability = import_mongoose10.default.model("Availability", availabilitySchema);
    availability_model_default = Availability;
  }
});

// src/modules/cab/service/cabService.model.ts
var cabService_model_exports = {};
__export(cabService_model_exports, {
  CabService: () => CabService,
  default: () => cabService_model_default
});
var import_mongoose23, cabServiceSchema, CabService, cabService_model_default;
var init_cabService_model = __esm({
  "src/modules/cab/service/cabService.model.ts"() {
    "use strict";
    import_mongoose23 = __toESM(require("mongoose"), 1);
    cabServiceSchema = new import_mongoose23.Schema(
      {
        cab: {
          type: import_mongoose23.Schema.Types.ObjectId,
          ref: "CabCompany",
          required: true
        },
        title: {
          type: String,
          required: true,
          trim: true
        },
        pickupLocation: {
          type: String,
          required: true,
          trim: true
        },
        dropLocation: {
          type: String,
          required: true,
          trim: true
        },
        carName: {
          type: String,
          required: true,
          trim: true
        },
        cabType: {
          type: String,
          enum: ["hatchback", "sedan", "suv", "luxury"],
          required: true
        },
        capacity: {
          type: Number,
          required: true,
          min: 1
        },
        carNumber: String,
        images: [
          {
            url: String,
            public_id: String,
            resource_type: String
          }
        ],
        description: String,
        features: [String],
        basePrice: {
          type: Number,
          required: true,
          min: 0
        },
        discountPrice: {
          type: Number,
          default: 0,
          min: 0,
          validate: {
            validator: function(value) {
              return value <= this.basePrice;
            },
            message: "Discount price cannot be greater than base price"
          }
        },
        //in vendor side use 3rd party api to calculate distance and duration
        meta: {
          distance: String,
          // in km
          duration: String
          // in hours
        },
        isActive: {
          type: Boolean,
          default: true
        }
      },
      { timestamps: true }
    );
    cabServiceSchema.index({
      pickupLocation: 1,
      dropLocation: 1,
      isActive: 1,
      cabType: 1,
      basePrice: 1
    });
    cabServiceSchema.index({ cab: 1, isActive: 1 });
    cabServiceSchema.index({ title: "text", description: "text" });
    CabService = import_mongoose23.default.model("CabService", cabServiceSchema);
    cabService_model_default = CabService;
  }
});

// src/modules/bike/service/bikeService.model.ts
var bikeService_model_exports = {};
__export(bikeService_model_exports, {
  BikeService: () => BikeService,
  default: () => bikeService_model_default
});
var import_mongoose24, bikeServiceSchema, BikeService, bikeService_model_default;
var init_bikeService_model = __esm({
  "src/modules/bike/service/bikeService.model.ts"() {
    "use strict";
    import_mongoose24 = __toESM(require("mongoose"), 1);
    bikeServiceSchema = new import_mongoose24.Schema(
      {
        bike: {
          type: import_mongoose24.Schema.Types.ObjectId,
          ref: "BikeCompany",
          required: true
        },
        title: {
          type: String,
          required: true,
          trim: true
        },
        bikeName: {
          type: String,
          required: true,
          trim: true
        },
        bikeType: {
          type: String,
          enum: ["scooter", "cruiser", "sports", "standard"],
          required: true
        },
        engineCC: Number,
        fuelType: {
          type: String,
          enum: ["petrol", "electric"],
          default: "petrol"
        },
        pricePerDay: {
          type: Number,
          required: true,
          min: 0
        },
        discountPrice: {
          type: Number,
          default: 0,
          min: 0
        },
        maxDurationDays: {
          type: Number,
          default: 7
        },
        description: {
          type: String,
          trim: true
        },
        features: [String],
        images: [
          {
            url: String,
            public_id: String,
            resource_type: String
          }
        ],
        meta: {
          mileage: String,
          gearType: String
        },
        isActive: {
          type: Boolean,
          default: true
        }
      },
      { timestamps: true }
    );
    bikeServiceSchema.index({ bike: 1, isActive: 1 });
    bikeServiceSchema.index({ bikeType: 1, pricePerDay: 1 });
    BikeService = import_mongoose24.default.model("BikeService", bikeServiceSchema);
    bikeService_model_default = BikeService;
  }
});

// src/modules/adventure/service/service.model.ts
var service_model_exports = {};
__export(service_model_exports, {
  Service: () => Service,
  default: () => service_model_default
});
var import_mongoose25, itinerarySchema, serviceSchema, Service, service_model_default;
var init_service_model = __esm({
  "src/modules/adventure/service/service.model.ts"() {
    "use strict";
    import_mongoose25 = __toESM(require("mongoose"), 1);
    itinerarySchema = new import_mongoose25.Schema(
      {
        day: {
          type: Number,
          required: true
        },
        title: {
          type: String,
          trim: true
        },
        description: {
          type: String,
          trim: true
        }
      },
      { _id: false }
    );
    serviceSchema = new import_mongoose25.Schema(
      {
        adventure: {
          type: import_mongoose25.Schema.Types.ObjectId,
          ref: "Adventure",
          required: true,
          index: true
        },
        title: {
          type: String,
          required: true,
          trim: true
        },
        type: {
          type: String,
          required: true,
          enum: ["distance", "time", "fixed", "package"],
          index: true
        },
        basePrice: {
          type: Number,
          required: true,
          min: 0
        },
        discountPrice: {
          type: Number,
          default: 0,
          min: 0,
          validate: {
            validator: function(value) {
              return value <= this.basePrice;
            },
            message: "Discount price cannot be greater than base price"
          }
        },
        meta: {
          distance: { type: String },
          // "6KM"
          duration: { type: String },
          // "15 min"
          days: { type: Number },
          nights: { type: Number }
        },
        features: [
          {
            type: String,
            trim: true
          }
        ],
        images: [
          {
            url: String,
            public_id: String,
            resource_type: String
          }
        ],
        itinerary: [itinerarySchema],
        //only for trekking
        isActive: {
          type: Boolean,
          default: true,
          index: true
        }
      },
      { timestamps: true }
    );
    serviceSchema.index({ adventure: 1, type: 1 });
    serviceSchema.index({ adventure: 1, basePrice: 1 });
    serviceSchema.index({ adventure: 1, discountPrice: 1 });
    Service = import_mongoose25.default.model("Service", serviceSchema);
    service_model_default = Service;
  }
});

// src/modules/tour/service/tourService.model.ts
var tourService_model_exports = {};
__export(tourService_model_exports, {
  TourService: () => TourService,
  default: () => tourService_model_default
});
var import_mongoose26, itinerarySchema2, tourServiceSchema, TourService, tourService_model_default;
var init_tourService_model = __esm({
  "src/modules/tour/service/tourService.model.ts"() {
    "use strict";
    import_mongoose26 = __toESM(require("mongoose"), 1);
    itinerarySchema2 = new import_mongoose26.Schema(
      {
        day: {
          type: Number,
          required: true
        },
        title: {
          type: String,
          trim: true
        },
        description: {
          type: String,
          trim: true
        },
        highlights: [
          {
            type: String,
            trim: true
          }
        ]
      },
      { _id: false }
    );
    tourServiceSchema = new import_mongoose26.Schema(
      {
        tour: {
          type: import_mongoose26.Schema.Types.ObjectId,
          ref: "TourCompany",
          required: true,
          index: true
        },
        title: {
          type: String,
          required: true,
          trim: true,
          index: true
        },
        destinations: [
          {
            type: String,
            trim: true
          }
        ],
        duration: {
          days: {
            type: Number,
            required: true
          },
          nights: {
            type: Number,
            required: true
          }
        },
        basePrice: {
          type: Number,
          required: true,
          min: 0
        },
        discountPrice: {
          type: Number,
          default: 0,
          min: 0
        },
        features: [
          {
            type: String,
            trim: true
          }
        ],
        tourType: [
          {
            type: String,
            trim: true
          }
        ],
        amenities: [
          {
            type: String,
            trim: true
          }
        ],
        images: [
          {
            url: String,
            public_id: String,
            resource_type: String
          }
        ],
        description: {
          type: String,
          trim: true
        },
        itinerary: [itinerarySchema2],
        //OPTIONAL META
        meta: {
          hotelType: { type: String },
          // 3 star / 4 star
          transport: { type: String },
          // cab / bus
          mealPlan: { type: String }
          // MAP / AP
        },
        maxPeople: {
          type: Number,
          default: 10
        },
        isActive: {
          type: Boolean,
          default: true,
          index: true
        }
      },
      { timestamps: true }
    );
    tourServiceSchema.index({ tour: 1 });
    tourServiceSchema.index({ title: "text", description: "text" });
    tourServiceSchema.index({ basePrice: 1 });
    tourServiceSchema.index({ isActive: 1 });
    TourService = import_mongoose26.default.model("TourService", tourServiceSchema);
    tourService_model_default = TourService;
  }
});

// src/serverless.ts
var serverless_exports = {};
__export(serverless_exports, {
  default: () => handler
});
module.exports = __toCommonJS(serverless_exports);

// src/shared/config/db.ts
var import_mongoose = __toESM(require("mongoose"), 1);

// src/shared/utils/logger.ts
var import_winston = __toESM(require("winston"), 1);
var transports = [
  new import_winston.default.transports.Console({
    format: process.env.NODE_ENV === "production" ? import_winston.default.format.json() : import_winston.default.format.simple()
  })
];
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  try {
    transports.push(
      new import_winston.default.transports.File({
        filename: "logs/error.log",
        level: "error"
      }),
      new import_winston.default.transports.File({
        filename: "logs/combined.log"
      })
    );
  } catch (err) {
  }
}
var logger = import_winston.default.createLogger({
  level: "info",
  format: import_winston.default.format.combine(
    import_winston.default.format.timestamp(),
    import_winston.default.format.json()
  ),
  transports
});
var logger_default = logger;

// src/shared/config/db.ts
var isConnected = false;
var connectDB = async () => {
  if (isConnected) {
    return;
  }
  try {
    const conn = await import_mongoose.default.connect(process.env.MONGO_URI, {
      bufferCommands: false
    });
    isConnected = conn.connections[0].readyState === 1;
    logger_default.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    const err = error;
    logger_default.error(`Error: ${err.message}`);
    throw err;
  }
};
var db_default = connectDB;

// src/app.ts
var import_config = require("dotenv/config");
var import_express40 = __toESM(require("express"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_helmet = __toESM(require("helmet"), 1);
var import_morgan = __toESM(require("morgan"), 1);
var import_express_rate_limit2 = __toESM(require("express-rate-limit"), 1);
var import_passport3 = __toESM(require("passport"), 1);

// src/modules/auth/auth.routes.ts
var import_express = require("express");

// src/modules/auth/auth.model.ts
var import_mongoose2 = __toESM(require("mongoose"), 1);
var import_bcryptjs = __toESM(require("bcryptjs"), 1);
var userSchema = new import_mongoose2.Schema(
  {
    email: {
      type: String,
      // required: [true, "Email is required"],
      // unique: true,
      sparse: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      select: false,
      minlength: [8, "Password must be at least 8 characters"]
    },
    role: {
      type: String,
      enum: ["user", "vendor", "admin"],
      default: "user"
    },
    isVendor: {
      type: Boolean,
      default: false
    },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    phoneNumber: { type: String, unique: true, trim: true },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other"
    },
    dob: { type: Date },
    country: { type: String, default: "India" },
    avatar: { type: String },
    address: { type: String, trim: true },
    zipcCode: { type: String, trim: true },
    providers: {
      local: {
        isVerified: { type: Boolean, default: false }
      },
      google: { id: String, email: String },
      facebook: { id: String, email: String },
      apple: { id: String, email: String }
    },
    otp: { type: String, select: false },
    otpExpires: { type: Date, select: false },
    otpAttempts: {
      type: Number,
      default: 0,
      select: false
    },
    signupExpires: {
      type: Date,
      select: false
    },
    deleteRequest: {
      status: {
        type: String,
        enum: ["none", "pending"],
        default: "none"
      },
      requestedAt: Date,
      reason: {
        type: String,
        trim: true
      }
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);
userSchema.pre("save", async function() {
  if (!this.isModified("password") || !this.password) return;
  try {
    this.password = await import_bcryptjs.default.hash(this.password, 12);
  } catch (error) {
    throw error;
  }
});
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await import_bcryptjs.default.compare(candidatePassword, this.password);
};
var User = import_mongoose2.default.models.User || import_mongoose2.default.model("User", userSchema);
var auth_model_default = User;

// src/modules/vendors/vendor.model.ts
var import_mongoose3 = __toESM(require("mongoose"), 1);
var vendorSchema = new import_mongoose3.Schema(
  {
    userId: {
      type: import_mongoose3.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Vendor must be linked to a User account"],
      index: true
    },
    // Unique 6-digit ID assigned at admin approval
    propertyId: {
      type: String,
      unique: true,
      sparse: true,
      index: true
    },
    linkedGroupId: {
      type: import_mongoose3.Schema.Types.ObjectId,
      ref: "VendorAccountGroup",
      default: null,
      index: true
    },
    serviceType: {
      type: String,
      enum: ["hotel", "adventure", "cab", "bike", "tour"],
      default: null,
      index: true
    },
    businessName: {
      type: String,
      trim: true,
      index: true
    },
    logo: {
      url: String,
      public_id: String,
      resource_type: { type: String, default: "image" }
    },
    businessEmail: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
      unique: true
    },
    businessPhone: {
      type: String,
      trim: true,
      index: true
    },
    businessAddress: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true,
      index: true
    },
    state: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      default: "India"
    },
    panNumber: {
      type: String,
      trim: true,
      uppercase: true
    },
    aadhaarNumber: {
      type: String,
      trim: true
    },
    // KYC Documents
    verificationDocs: [
      {
        docName: { type: String },
        // aadhaarFront, aadhaarBack, panCard etc
        docUrl: { type: String },
        isVerified: { type: Boolean, default: false }
      }
    ],
    // Vendor approval flow
    status: {
      type: String,
      enum: [
        "draft",
        "pending",
        "under_review",
        "approved",
        "rejected",
        "blocked"
      ],
      default: "draft",
      index: true
    },
    // registration progress
    registrationStep: {
      type: Number,
      default: 1
    },
    currentStep: {
      type: Number,
      default: 1
    },
    rejectedSteps: {
      type: [Number],
      // multiple steps
      default: []
    },
    rejectionReasons: {
      type: Object,
      default: {}
    },
    //timestamps for tracking
    submittedAt: Date,
    approvedAt: Date,
    rejectedAt: Date,
    blockedAt: Date,
    reviewedAt: Date,
    reviewedBy: {
      type: import_mongoose3.Schema.Types.ObjectId,
      ref: "User"
    },
    isSubmitted: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    isBlocked: {
      type: Boolean,
      default: false,
      index: true
    },
    blockReason: {
      type: String,
      trim: true
    },
    blockedBy: {
      type: import_mongoose3.Schema.Types.ObjectId,
      ref: "User"
    },
    approvedBy: {
      type: import_mongoose3.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
vendorSchema.index({ status: 1 });
vendorSchema.index({ serviceType: 1 });
vendorSchema.index({ city: 1 });
vendorSchema.index({ userId: 1 });
vendorSchema.index({ propertyId: 1 }, { sparse: true });
var Vendor = import_mongoose3.default.model("Vendor", vendorSchema);
var vendor_model_default = Vendor;

// src/modules/auth/auth.service.ts
var import_crypto = __toESM(require("crypto"), 1);
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);

// src/shared/utils/sendEmail.ts
var import_nodemailer = __toESM(require("nodemailer"), 1);
var import_axios = __toESM(require("axios"), 1);
var trivlloData = {
  company_name: "Trivllo"
};
var transporter = import_nodemailer.default.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
var sendWhatsAppOTP = async (phone, otp) => {
  try {
    const cleanNumber = phone.replace("+91", "");
    await import_axios.default.post(
      "https://api.interakt.ai/v1/public/message/",
      {
        countryCode: "91",
        phoneNumber: cleanNumber,
        type: "Template",
        template: {
          name: "otp_verification_trivllo",
          languageCode: "en",
          bodyValues: [otp],
          buttonValues: {
            0: [otp]
          }
        }
      },
      {
        headers: {
          Authorization: `Basic ${process.env.INTERAKT_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    const err = error;
    logger_default.error(err.response?.data || err.message);
    throw new Error("Failed to send WhatsApp OTP");
  }
};
var sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: `"${trivlloData.company_name} Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Verify Your Email for ${trivlloData.company_name} \u2013 OTP Inside`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Welcome to ${trivlloData.company_name} \u{1F680}</h2>
          <p>Your One-Time Password (OTP) is:</p>
          <h1 style="letter-spacing: 3px;">${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
          <p>If you did not request this, please ignore.</p>
          <br/>
          <p>\u2014 Team ${trivlloData.company_name}</p>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
  } catch (err) {
    const error = err;
    logger_default.error(
      `${trivlloData.company_name} email send failed:`,
      error.message
    );
    throw error;
  }
};
var sendBookingConfirmationEmail = async (email, details) => {
  try {
    const mailOptions = {
      from: `"${trivlloData.company_name} Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Booking Confirmed! Reference: ${details.bookingId}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 15px;">
          <h2 style="color: #f97316;">Booking Confirmed! \u{1F973}</h2>
          <p>Hi <strong>${details.customerName}</strong>,</p>
          <p>Pack your bags! Your stay at <strong>${details.hotelName}</strong> has been successfully booked.</p>
          
          <div style="background: #f8fafc; padding: 15px; border-radius: 10px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Booking ID:</strong> ${details.bookingId}</p>
            <p style="margin: 5px 0;"><strong>Room Type:</strong> ${details.roomName}</p>
            <p style="margin: 5px 0;"><strong>Check-in:</strong> ${new Date(details.checkIn).toLocaleDateString()}</p>
            <p style="margin: 5px 0;"><strong>Check-out:</strong> ${new Date(details.checkOut).toLocaleDateString()}</p>
            <p style="margin: 5px 0; color: #16a34a;"><strong>Total Paid:</strong> \u20B9${details.amount}</p>
          </div>

          <p>If you have any questions, feel free to reply to this email.</p>
          <p>Happy Travels,<br/><strong>Team ${trivlloData.company_name}</strong></p>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
  } catch (err) {
    const error = err;
    logger_default.error(
      `${trivlloData.company_name} booking email send failed:`,
      error.message
    );
    throw error;
  }
};
var sendAdminVendorNotificationEmail = async (vendor, hotel = null) => {
  try {
    const subject = "\u{1F6A8} New Vendor Submission Received";
    let hotelAddressStr = "";
    if (hotel) {
      if (typeof hotel.address === "object" && hotel.address !== null) {
        hotelAddressStr = hotel.address.formattedAddress || hotel.address.streetAddress || hotel.city || "";
      } else {
        hotelAddressStr = hotel.address || "";
      }
    }
    const mailOptions = {
      from: `"${trivlloData.company_name} Support" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject,
      html: `
        <h2>New Vendor Request \u{1F680}</h2>

        <p><b>Business Name:</b> ${vendor.businessName || "N/A"}</p>
        <p><b>Email:</b> ${vendor.businessEmail || "N/A"}</p>
        <p><b>Phone:</b> ${vendor.businessPhone || "N/A"}</p>
        <p><b>City:</b> ${vendor.city || "N/A"}</p>
        <p><b>Service Type:</b> ${vendor.serviceType}</p>

        ${hotel ? `
          <hr/>
          <h3>Hotel Info</h3>
          <p><b>Name:</b> ${hotel.name}</p>
          <p><b>City:</b> ${hotel.city}</p>
          <p><b>Address:</b> ${hotelAddressStr}</p>
        ` : ""}

        <br/>
        <p>Please review and take action from admin panel.</p>
      `
    };
    await transporter.sendMail(mailOptions);
  } catch (err) {
    const error = err;
    logger_default.error("Admin vendor email failed:", error.message);
    throw error;
  }
};
var sendVendorSubmissionConfirmationEmail = async (vendor) => {
  try {
    const subject = "Your Request is Under Review \u23F3";
    const mailOptions = {
      from: `"${trivlloData.company_name} Support" <${process.env.EMAIL_USER}>`,
      to: vendor.businessEmail,
      subject,
      html: `
        <h2>Hello ${vendor.businessName || "Vendor"},</h2>

        <p>Thank you for submitting your business on <b>${trivlloData.company_name}</b> \u{1F680}</p>

        <p>Your request is currently under review by our team.</p>

        <p>\u23F3 You will be notified once it's approved.</p>

        <br/>

        <p>\u2014 Team ${trivlloData.company_name}</p>
      `
    };
    await transporter.sendMail(mailOptions);
  } catch (err) {
    const error = err;
    logger_default.error(
      `${trivlloData.company_name} confirmation email failed:`,
      error.message
    );
    throw error;
  }
};
var sendVendorApprovalEmail = async (vendor) => {
  try {
    const subject = "\u{1F389} Your Vendor Application is Approved!";
    const mailOptions = {
      from: `"${trivlloData.company_name} Support" <${process.env.EMAIL_USER}>`,
      to: vendor.businessEmail,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Congratulations ${vendor.businessName || "Vendor"} \u{1F389}</h2>

          <p>Your application has been <b style="color: green;">approved</b> by our team.</p>

          <p>You can now:</p>
          <ul>
            <li>Login to your dashboard</li>
            <li>Add your listings (Hotel, Cab, etc.)</li>
            <li>Start receiving bookings \u{1F680}</li>
          </ul>

          <br/>

          <p>We\u2019re excited to have you onboard!</p>

          <p>\u2014 Team ${trivlloData.company_name}</p>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
  } catch (err) {
    const error = err;
    logger_default.error(
      `${trivlloData.company_name} approval email failed:`,
      error.message
    );
    throw error;
  }
};
var sendVendorRejectionEmail = async (vendor) => {
  try {
    const subject = "\u274C Your Vendor Application Needs Changes";
    let reasonsHtml = "<p>No specific reasons provided.</p>";
    if (vendor.rejectionReasons && Object.keys(vendor.rejectionReasons).length) {
      reasonsHtml = "<ul>";
      for (const [step, reason] of Object.entries(vendor.rejectionReasons)) {
        reasonsHtml += `<li><b>Step ${step}:</b> ${reason}</li>`;
      }
      reasonsHtml += "</ul>";
    }
    const mailOptions = {
      from: `"${trivlloData.company_name} Support" <${process.env.EMAIL_USER}>`,
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
          <p>\u2014 Team ${trivlloData.company_name}</p>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
  } catch (err) {
    const error = err;
    logger_default.error(
      `${trivlloData.company_name} rejection email failed:`,
      error.message
    );
    throw error;
  }
};
var sendAccountDeletionApprovedEmail = async (email, firstName) => {
  try {
    const mailOptions = {
      from: `"${trivlloData.company_name} Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Account Deletion Request Approved",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Account Deleted Successfully</h2>

          <p>Hello ${firstName},</p>

          <p>Your account deletion request has been reviewed and approved.</p>

          <p>Your account and associated personal information have been permanently removed from our platform.</p>

          <p>Thank you for being a part of ${trivlloData.company_name}.</p>

          <br />
          <p>\u2014 Team ${trivlloData.company_name}</p>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
  } catch (err) {
    const error = err;
    logger_default.error(
      `${trivlloData.company_name} account deletion approved email failed:`,
      error.message
    );
    throw error;
  }
};
var sendAccountDeletionRejectedEmail = async (email, firstName) => {
  try {
    const mailOptions = {
      from: `"${trivlloData.company_name} Support" <${process.env.EMAIL_USER}>`,
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
          <p>\u2014 Team ${trivlloData.company_name}</p>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
  } catch (err) {
    const error = err;
    logger_default.error(
      `${trivlloData.company_name} account deletion rejected email failed:`,
      error.message
    );
    throw error;
  }
};
var sendAccountDeletionApprovedWhatsApp = async (phone, firstName) => {
  try {
    const cleanNumber = phone.replace("+91", "");
    await import_axios.default.post(
      "https://api.interakt.ai/v1/public/message/",
      {
        countryCode: "91",
        phoneNumber: cleanNumber,
        type: "Template",
        template: {
          name: "account_delete_approved",
          languageCode: "en",
          bodyValues: [firstName]
        }
      },
      {
        headers: {
          Authorization: `Basic ${process.env.INTERAKT_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    const err = error;
    logger_default.error(
      "Account deletion approved WhatsApp failed:",
      err.response?.data || err.message
    );
  }
};
var sendAccountDeletionRejectedWhatsApp = async (phone, firstName) => {
  try {
    const cleanNumber = phone.replace("+91", "");
    await import_axios.default.post(
      "https://api.interakt.ai/v1/public/message/",
      {
        countryCode: "91",
        phoneNumber: cleanNumber,
        type: "Template",
        template: {
          name: "account_delete_rejected",
          languageCode: "en",
          bodyValues: [firstName]
        }
      },
      {
        headers: {
          Authorization: `Basic ${process.env.INTERAKT_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    const err = error;
    logger_default.error(
      "Account deletion rejected WhatsApp failed:",
      err.response?.data || err.message
    );
  }
};
var sendVendorBookingNotificationEmail = async (emails, details) => {
  try {
    const recipientEmails = Array.isArray(emails) ? emails.filter(
      (email) => email && typeof email === "string" && email.trim() !== ""
    ) : typeof emails === "string" ? [emails] : [];
    if (recipientEmails.length === 0) {
      logger_default.warn(
        "No valid recipient emails provided for vendor booking notification."
      );
      return;
    }
    const mailOptions = {
      from: `"${trivlloData.company_name} Support" <${process.env.EMAIL_USER}>`,
      to: recipientEmails.join(", "),
      subject: `\u{1F6A8} New Booking Alert! Reference: ${details.bookingReference}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 15px;">
          <h2 style="color: #f97316; margin-top: 0;">New Booking Received! \u{1F680}</h2>
          <p>Hello,</p>
          <p>Congratulations! You have received a new booking for your service on <strong>${trivlloData.company_name}</strong>.</p>
          
          <div style="background: #f8fafc; padding: 15px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #f97316;">
            <h3 style="margin-top: 0; color: #1e293b;">Service details</h3>
            <p style="margin: 5px 0;"><strong>Service Type:</strong> ${details.serviceType.toUpperCase()}</p>
            <p style="margin: 5px 0;"><strong>Service Name:</strong> ${details.serviceName}</p>
            <p style="margin: 5px 0;"><strong>Booking Reference:</strong> ${details.bookingReference}</p>
            <p style="margin: 5px 0;"><strong>Booking Date:</strong> ${details.bookingDate}</p>
            ${details.extraDetails ? `<p style="margin: 5px 0;"><strong>Details:</strong> ${details.extraDetails}</p>` : ""}
            <p style="margin: 5px 0; color: #16a34a;"><strong>Earnings / Paid:</strong> \u20B9${details.totalAmount}</p>
          </div>

          <div style="background: #f8fafc; padding: 15px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            <h3 style="margin-top: 0; color: #1e293b;">Customer Details</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${details.customerName}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${details.customerEmail}</p>
            <p style="margin: 5px 0;"><strong>Phone Number:</strong> ${details.customerPhone}</p>
          </div>

          <p>Please check your vendor dashboard for full details and updates.</p>
          <p>Best Regards,<br/><strong>Team ${trivlloData.company_name}</strong></p>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
  } catch (err) {
    const error = err;
    logger_default.error(
      `${trivlloData.company_name} vendor booking notification email send failed:`,
      error.message
    );
    throw error;
  }
};

// src/modules/auth/auth.service.ts
var generateOTP = async () => {
  const otp = import_crypto.default.randomInt(1e3, 9999).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1e3);
  return { otp, otpExpires };
};
var normalizePhone = (phone) => {
  if (!phone) throw new Error("Phone number is required");
  phone = phone.replace(/\D/g, "");
  if (phone.length === 10) {
    return `+91${phone}`;
  }
  if (phone.length === 12 && phone.startsWith("91")) {
    return `+${phone}`;
  }
  if (phone.length > 10 && !phone.startsWith("91")) {
    throw new Error("Invalid phone number format");
  }
  throw new Error("Invalid phone number");
};
var whatsappSignup = async (phone, password) => {
  try {
    if (!phone) throw new Error("Phone number is required");
    const phoneNumber = normalizePhone(phone);
    let user = await auth_model_default.findOne({ phoneNumber });
    if (user && user.providers.local.isVerified) {
      throw new Error("User already exists. Please login.");
    }
    const { otp, otpExpires } = await generateOTP();
    if (!user) {
      user = new auth_model_default({
        phoneNumber,
        password,
        role: "user",
        otp,
        otpExpires,
        providers: {
          local: { isVerified: false }
        }
      });
    } else {
      if (password) user.password = password;
      user.otp = otp;
      user.otpExpires = otpExpires;
      user.providers.local.isVerified = false;
    }
    await user.save();
    await sendWhatsAppOTP(phoneNumber, otp);
    return {
      message: "OTP sent on WhatsApp"
    };
  } catch (error) {
    throw error;
  }
};
var whatsappVerify = async (phone, inputOTP) => {
  try {
    if (!phone) throw new Error("Phone number is required");
    const phoneNumber = normalizePhone(phone);
    const user = await auth_model_default.findOne({ phoneNumber }).select("+otp +otpExpires");
    if (!user) throw new Error("User not found");
    if (!user.otpExpires || Date.now() > new Date(user.otpExpires).getTime()) {
      throw new Error("OTP expired. Please try again.");
    }
    if (String(inputOTP) !== String(user.otp)) {
      throw new Error("Invalid OTP");
    }
    user.providers.local.isVerified = true;
    user.otp = void 0;
    user.otpExpires = void 0;
    await user.save();
    return {
      message: "Verification successful",
      user
    };
  } catch (error) {
    throw error;
  }
};
var whatsappLogin = async (phone, password) => {
  try {
    if (!phone) throw new Error("Phone number is required");
    const phoneNumber = normalizePhone(phone);
    const user = await auth_model_default.findOne({ phoneNumber }).select("+password");
    if (!user) {
      throw new Error("User not found");
    }
    if (!user.password) {
      throw new Error("Please set a password first");
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
    if (!user.providers.local.isVerified) {
      throw new Error("Account not verified. Please verify OTP first.");
    }
    return {
      user,
      message: "Login successful"
    };
  } catch (error) {
    throw error;
  }
};
var forgotPasswordWhatsapp = async (phone) => {
  try {
    if (!phone) throw new Error("Phone number is required");
    const phoneNumber = normalizePhone(phone);
    const user = await auth_model_default.findOne({ phoneNumber });
    if (!user) {
      throw new Error("User not found");
    }
    const { otp, otpExpires } = await generateOTP();
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();
    await sendWhatsAppOTP(phoneNumber, otp);
    return {
      message: "OTP sent on WhatsApp"
    };
  } catch (error) {
    throw error;
  }
};
var verifyForgotPasswordOtp = async (phone, inputOTP) => {
  try {
    if (!phone) throw new Error("Phone number is required");
    const phoneNumber = normalizePhone(phone);
    const user = await auth_model_default.findOne({ phoneNumber }).select("+otp +otpExpires");
    if (!user) {
      throw new Error("User not found");
    }
    if (!user.otpExpires || Date.now() > new Date(user.otpExpires).getTime()) {
      throw new Error("OTP expired");
    }
    if (String(inputOTP) !== String(user.otp)) {
      throw new Error("Invalid OTP");
    }
    return {
      message: "OTP verified successfully"
    };
  } catch (error) {
    throw error;
  }
};
var resetPasswordWhatsapp = async (phone, inputOTP, newPassword) => {
  try {
    if (!phone) throw new Error("Phone number is required");
    const phoneNumber = normalizePhone(phone);
    const user = await auth_model_default.findOne({ phoneNumber }).select(
      "+otp +otpExpires +password"
    );
    if (!user) {
      throw new Error("User not found");
    }
    if (!user.otpExpires || Date.now() > new Date(user.otpExpires).getTime()) {
      throw new Error("OTP expired");
    }
    if (String(inputOTP) !== String(user.otp)) {
      throw new Error("Invalid OTP");
    }
    user.password = newPassword;
    user.otp = void 0;
    user.otpExpires = void 0;
    await user.save();
    return {
      message: "Password reset successfully"
    };
  } catch (error) {
    throw error;
  }
};
var signup = async (email, password, role, firstName, lastName, phoneNumber) => {
  try {
    const allowedRoles = ["user", "vendor", "admin"];
    if (role && !allowedRoles.includes(role)) {
      throw new Error("Invalid role");
    }
    await auth_model_default.deleteOne({
      email,
      "providers.local.isVerified": false
    });
    let user = await auth_model_default.findOne({ email });
    if (user && user.providers.local.isVerified) {
      throw new Error("Email already registered. Please login.");
    }
    const { otp, otpExpires } = await generateOTP();
    const signupExpires = new Date(Date.now() + 5 * 60 * 1e3);
    if (!user) {
      user = new auth_model_default({
        email,
        password,
        role: role || "user",
        firstName,
        lastName,
        phoneNumber,
        otp,
        otpExpires,
        signupExpires,
        otpAttempts: 0,
        isVendor: role === "vendor",
        providers: {
          local: { isVerified: false }
        }
      });
    } else {
      if (password) user.password = password;
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.phoneNumber = phoneNumber || user.phoneNumber;
      user.otp = otp;
      user.otpExpires = otpExpires;
      user.signupExpires = signupExpires;
      user.otpAttempts = 0;
      user.providers.local.isVerified = false;
    }
    await user.save();
    await sendOTPEmail(email, otp);
    return {
      message: "OTP sent to your email for verification"
    };
  } catch (error) {
    logger_default.error("Service Error: signup", error);
    throw error;
  }
};
var login = async (email, password) => {
  try {
    const user = await auth_model_default.findOne({ email }).select("+password");
    if (!user) throw new Error("Invalid credentials");
    if (!user.password) throw new Error("Please use social login");
    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error("Invalid credentials");
    if (!user.providers.local.isVerified) {
      throw new Error("Account not verified. Please verify your OTP.");
    }
    return { user, message: "Login successful" };
  } catch (error) {
    throw error;
  }
};
var resendOTP = async (email) => {
  try {
    const { otp, otpExpires } = await generateOTP();
    const user = await auth_model_default.findOneAndUpdate(
      { email },
      { otp, otpExpires },
      { new: true }
    );
    if (!user) throw new Error("User not found");
    await sendOTPEmail(email, otp);
    return { message: "OTP sent successfully" };
  } catch (error) {
    throw error;
  }
};
var verifyOTP = async (email, inputOTP) => {
  try {
    const user = await auth_model_default.findOne({ email }).select(
      "+otp +otpExpires +otpAttempts +signupExpires"
    );
    if (!user) throw new Error("User not found");
    if (!user.signupExpires || Date.now() > new Date(user.signupExpires).getTime()) {
      await auth_model_default.deleteOne({ _id: user._id });
      throw new Error("Signup expired. Please signup again.");
    }
    if (!user.otpExpires || Date.now() > new Date(user.otpExpires).getTime()) {
      await auth_model_default.deleteOne({ _id: user._id });
      throw new Error("OTP expired. Please signup again.");
    }
    if (user.otpAttempts >= 3) {
      await auth_model_default.deleteOne({ _id: user._id });
      throw new Error("Too many attempts. Please signup again.");
    }
    if (String(inputOTP) !== String(user.otp)) {
      user.otpAttempts += 1;
      if (user.otpAttempts >= 3) {
        await auth_model_default.deleteOne({ _id: user._id });
        throw new Error("Too many incorrect attempts. Please signup again.");
      }
      await user.save();
      throw new Error(`Invalid OTP. Attempts left: ${3 - user.otpAttempts}`);
    }
    user.providers.local.isVerified = true;
    user.otp = void 0;
    user.otpExpires = void 0;
    user.otpAttempts = 0;
    user.signupExpires = void 0;
    await user.save();
    let vendor = null;
    if (user.role === "vendor") {
      vendor = await vendor_model_default.findOne({ userId: user._id });
      if (!vendor) {
        vendor = await vendor_model_default.create({
          userId: user._id,
          serviceType: void 0,
          status: "draft",
          currentStep: 1,
          registrationStep: 1
        });
      }
    }
    return {
      user,
      vendor,
      message: "Verification successful"
    };
  } catch (error) {
    throw error;
  }
};
var findUserByEmailOrPhoneWithSelect = async (emailOrPhone, selectFields = "") => {
  if (!emailOrPhone) throw new Error("Email or Phone number is required");
  const isEmail = emailOrPhone.includes("@");
  const target = isEmail ? emailOrPhone : normalizePhone(emailOrPhone);
  const filter = isEmail ? { email: target } : { phoneNumber: target };
  const query = auth_model_default.findOne(filter);
  if (selectFields) {
    query.select(selectFields);
  }
  const user = await query;
  if (!user) throw new Error("User not found");
  return { user, isEmail, target };
};
var forgotPassword = async (emailOrPhone) => {
  try {
    const { user, isEmail, target } = await findUserByEmailOrPhoneWithSelect(
      emailOrPhone,
      ""
    );
    const { otp, otpExpires } = await generateOTP();
    user.otp = otp;
    user.otpExpires = otpExpires;
    user.otpAttempts = 0;
    await user.save();
    if (isEmail) {
      await sendOTPEmail(target, otp);
    } else {
      await sendWhatsAppOTP(target, otp);
    }
    return {
      message: isEmail ? "OTP sent to your email for password reset" : "OTP sent to your WhatsApp for password reset"
    };
  } catch (error) {
    throw error;
  }
};
var otpVerify = async (emailOrPhone, inputOTP) => {
  try {
    const { user } = await findUserByEmailOrPhoneWithSelect(
      emailOrPhone,
      "+otp +otpExpires +otpAttempts"
    );
    if (!user.otpExpires || Date.now() > new Date(user.otpExpires).getTime()) {
      throw new Error("OTP expired");
    }
    if (String(inputOTP) !== String(user.otp)) {
      throw new Error("Invalid OTP");
    }
    return { message: "OTP verified successfully" };
  } catch (error) {
    throw error;
  }
};
var resetPassword = async (emailOrPhone, otp, newPassword) => {
  try {
    const { user } = await findUserByEmailOrPhoneWithSelect(
      emailOrPhone,
      "+otp +otpExpires +otpAttempts +password"
    );
    if (!user.otpExpires || Date.now() > new Date(user.otpExpires).getTime()) {
      throw new Error("OTP expired");
    }
    if (String(otp) !== String(user.otp)) {
      throw new Error("Invalid OTP");
    }
    user.password = newPassword;
    user.otp = void 0;
    user.otpExpires = void 0;
    user.otpAttempts = 0;
    await user.save();
    return {
      message: "Password reset successful"
    };
  } catch (error) {
    throw error;
  }
};
var changePassword = async (userId, oldPassword, newPassword) => {
  try {
    const user = await auth_model_default.findById(userId).select("+password");
    if (!user) throw new Error("User not found");
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) throw new Error("Old password is incorrect");
    user.password = newPassword;
    await user.save();
    return { message: "Password changed successfully" };
  } catch (error) {
    throw error;
  }
};
var generateToken = (userId) => {
  return import_jsonwebtoken.default.sign(
    { id: userId },
    process.env.JWT_ACCESS_SECRET || "",
    { expiresIn: "7d" }
  );
};
var emailSignup = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }
  const existingUser = await auth_model_default.findOne({ email });
  if (existingUser && existingUser.providers?.local?.isVerified) {
    throw new Error("User already exists");
  }
  const { otp, otpExpires } = await generateOTP();
  const signupExpires = new Date(Date.now() + 10 * 60 * 1e3);
  let user = existingUser;
  if (!user) {
    user = await auth_model_default.create({
      email,
      password,
      otp,
      otpExpires,
      signupExpires
    });
  } else {
    user.password = password;
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();
  }
  await sendOTPEmail(email, otp);
  return {
    message: "OTP sent successfully"
  };
};
var emailVerifySignupOTP = async ({ email, otp }) => {
  if (!email || !otp) {
    throw new Error("Email and OTP are required");
  }
  const user = await auth_model_default.findOne({ email }).select(
    "+otp +otpExpires"
  );
  if (!user) {
    throw new Error("User not found");
  }
  if (user.otp !== otp) {
    throw new Error("Invalid OTP");
  }
  if (user.otpExpires && new Date(user.otpExpires).getTime() < Date.now()) {
    throw new Error("OTP expired");
  }
  user.providers.local.isVerified = true;
  user.otp = void 0;
  user.otpExpires = void 0;
  await user.save();
  const accessToken = generateToken(user._id);
  return {
    message: "Otp verification successful",
    accessToken,
    data: {
      user
    }
  };
};
var emailResendOTP = async (email) => {
  if (!email) {
    throw new Error("Email is required");
  }
  const user = await auth_model_default.findOne({ email }).select(
    "+otp +otpExpires"
  );
  if (!user) {
    throw new Error("User not found");
  }
  const { otp, otpExpires } = await generateOTP();
  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save();
  await sendOTPEmail(email, otp);
  return {
    message: "OTP resent successfully"
  };
};
var emailLogin = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  const user = await auth_model_default.findOne({ email }).select("+password");
  if (!user) {
    throw new Error("Invalid credentials");
  }
  if (!user.providers.local.isVerified) {
    throw new Error("Please verify your account");
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }
  const accessToken = generateToken(user._id);
  return {
    message: "Login successful",
    accessToken,
    data: {
      user
    }
  };
};
var AuthService = class {
  async whatsappSignup(phone, password) {
    return whatsappSignup(phone, password);
  }
  async whatsappVerify(phone, inputOTP) {
    return whatsappVerify(phone, inputOTP);
  }
  async whatsappLogin(phone, password) {
    return whatsappLogin(phone, password);
  }
  async forgotPasswordWhatsapp(phone) {
    return forgotPasswordWhatsapp(phone);
  }
  async verifyForgotPasswordOtp(phone, inputOTP) {
    return verifyForgotPasswordOtp(phone, inputOTP);
  }
  async resetPasswordWhatsapp(phone, inputOTP, newPassword) {
    return resetPasswordWhatsapp(phone, inputOTP, newPassword);
  }
  async signup(email, password, role, firstName, lastName, phoneNumber) {
    return signup(email, password, role, firstName, lastName, phoneNumber);
  }
  async login(email, password) {
    return login(email, password);
  }
  async resendOTP(email) {
    return resendOTP(email);
  }
  async verifyOTP(email, inputOTP) {
    return verifyOTP(email, inputOTP);
  }
  async forgotPassword(emailOrPhone) {
    return forgotPassword(emailOrPhone);
  }
  async otpVerify(emailOrPhone, inputOTP) {
    return otpVerify(emailOrPhone, inputOTP);
  }
  async resetPassword(emailOrPhone, otp, newPassword) {
    return resetPassword(emailOrPhone, otp, newPassword);
  }
  async changePassword(userId, oldPassword, newPassword) {
    return changePassword(userId, oldPassword, newPassword);
  }
  async emailSignup(payload) {
    return emailSignup(payload);
  }
  async emailVerifySignupOTP(payload) {
    return emailVerifySignupOTP(payload);
  }
  async emailResendOTP(email) {
    return emailResendOTP(email);
  }
  async emailLogin(payload) {
    return emailLogin(payload);
  }
};
var authService = new AuthService();
var auth_service_default = authService;

// src/modules/hotels/hotel.model.ts
var import_mongoose4 = __toESM(require("mongoose"), 1);
var addressSchema = new import_mongoose4.Schema(
  {
    // 1. Street & Door Level Details
    buildingName: { type: String, trim: true, default: "" },
    doorNumber: { type: String, trim: true, default: "" },
    streetAddress: { type: String, trim: true, default: "" },
    areaName: { type: String, trim: true, index: true, default: "" },
    // Town / locality / neighborhood
    // 2. City & Administrative Hierarchy
    city: { type: String, required: true, trim: true, index: true },
    district: { type: String, trim: true, default: "" },
    state: { type: String, trim: true, index: true, default: "" },
    postalCode: { type: String, trim: true, index: true, default: "" },
    country: { type: String, trim: true, default: "India", index: true },
    countryCode: { type: String, uppercase: true, trim: true, maxlength: 2, default: "IN" },
    // 3. Navigation & Local Context
    landmark: { type: String, trim: true, default: "" },
    directions: { type: String, trim: true, default: "" },
    // 4. Pre-Formatted Address
    formattedAddress: { type: String, trim: true, default: "" },
    // 5. Native GeoJSON Location
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number],
        default: [72.8777, 19.076]
        // Default [lng, lat]
      }
    },
    // 6. External Geocoding Provider References
    placeId: { type: String, trim: true, default: "" },
    timeZone: { type: String, trim: true, default: "" }
  },
  { _id: false }
);
var hotelSchema = new import_mongoose4.Schema(
  {
    vendorId: {
      type: import_mongoose4.default.Schema.ObjectId,
      ref: "Vendor",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      index: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    // Embedded Powerful Address Schema
    address: {
      type: addressSchema,
      required: true
    },
    // Top-level city kept in sync for direct access & backward compatibility
    city: {
      type: String,
      required: true,
      index: true,
      trim: true
    },
    // Top-level GeoJSON location kept in sync for 2dsphere indexing & queries
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    locationHistory: [
      {
        address: { type: import_mongoose4.default.Schema.Types.Mixed },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        country: { type: String, trim: true },
        coordinates: [Number],
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: import_mongoose4.default.Schema.Types.ObjectId, ref: "User" }
      }
    ],
    images: [
      {
        url: String,
        public_id: String,
        resource_type: String
      }
    ],
    advertisementImage: {
      url: String,
      public_id: String,
      resource_type: { type: String, default: "image" }
    },
    documents: [
      {
        docName: String,
        docUrl: String,
        public_id: String,
        resource_type: String,
        isVerified: { type: Boolean, default: false }
      }
    ],
    amenities: {
      type: [String],
      default: []
    },
    accessibility: {
      wheelchairAccessible: {
        type: Boolean,
        default: false
      },
      grabBars: {
        type: Boolean,
        default: false
      },
      hearingSupport: {
        type: Boolean,
        default: false
      },
      elevator: {
        type: Boolean,
        default: false
      }
    },
    distanceFromCenter: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    numReviews: {
      type: Number,
      default: 0
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
      index: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    rank: {
      type: String,
      enum: ["A", "B", "C", null],
      default: null,
      index: true
    },
    createdBy: {
      type: import_mongoose4.default.Schema.Types.ObjectId,
      ref: "User"
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);
hotelSchema.pre("validate", function(next) {
  const self = this;
  if (typeof self.address === "string") {
    const rawAddress = self.address;
    self.address = {
      streetAddress: rawAddress,
      city: this.city || "Default City",
      formattedAddress: rawAddress,
      location: this.location || { type: "Point", coordinates: [72.8777, 19.076] }
    };
  } else if (!self.address && this.city) {
    self.address = {
      streetAddress: "",
      city: this.city,
      formattedAddress: this.city,
      location: this.location || { type: "Point", coordinates: [72.8777, 19.076] }
    };
  }
  if (this.address?.city && !this.city) {
    this.city = this.address.city;
  }
  if (this.city && this.address && !this.address.city) {
    this.address.city = this.city;
  }
  if (this.address?.location?.coordinates?.length && (!this.location || !this.location.coordinates?.length)) {
    this.location = this.address.location;
  }
  if (this.location?.coordinates?.length && this.address && (!this.address.location || !this.address.location.coordinates?.length)) {
    this.address.location = this.location;
  }
  if (this.address && !this.address.formattedAddress) {
    const parts = [
      this.address.doorNumber,
      this.address.buildingName,
      this.address.streetAddress,
      this.address.areaName,
      this.address.landmark,
      this.address.city,
      this.address.district,
      this.address.state,
      this.address.postalCode,
      this.address.country
    ].filter(Boolean);
    this.address.formattedAddress = parts.join(", ");
  }
  if (typeof next === "function") {
    next();
  }
});
hotelSchema.index({ "address.location": "2dsphere" });
hotelSchema.index({ location: "2dsphere" });
hotelSchema.index({ "address.city": 1, "address.state": 1, "address.country": 1 });
hotelSchema.index({ city: 1 });
hotelSchema.index(
  {
    name: "text",
    city: "text",
    "address.city": "text",
    "address.areaName": "text",
    "address.district": "text",
    "address.streetAddress": "text",
    "address.landmark": "text",
    "address.formattedAddress": "text",
    description: "text"
  },
  {
    weights: {
      name: 5,
      "address.city": 4,
      city: 4,
      "address.areaName": 4,
      "address.district": 3,
      "address.streetAddress": 2,
      "address.landmark": 2,
      description: 1
    }
  }
);
var Hotel = import_mongoose4.default.model("Hotel", hotelSchema);
var hotel_model_default = Hotel;

// src/modules/cab/company/cab.model.ts
var import_mongoose5 = __toESM(require("mongoose"), 1);
var cabCompanySchema = new import_mongoose5.Schema(
  {
    vendorId: {
      type: import_mongoose5.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      city: {
        type: String,
        required: true
      },
      state: String,
      country: {
        type: String,
        default: "India"
      }
    },
    address: {
      type: import_mongoose5.Schema.Types.Mixed
    },
    coordinates: {
      lat: Number,
      lng: Number
    },
    locationHistory: [
      {
        address: { type: import_mongoose5.Schema.Types.Mixed },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        country: { type: String, trim: true },
        coordinates: {
          lat: Number,
          lng: Number
        },
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: import_mongoose5.Schema.Types.ObjectId, ref: "User" }
      }
    ],
    images: [
      {
        url: String,
        public_id: String,
        resource_type: String
      }
    ],
    advertisementImage: {
      url: String,
      public_id: String,
      resource_type: { type: String, default: "image" }
    },
    documents: [
      {
        docName: String,
        docUrl: String,
        public_id: String,
        resource_type: String,
        isVerified: { type: Boolean, default: false }
      }
    ],
    description: String,
    features: [String],
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 }
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
      index: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    rank: {
      type: String,
      enum: ["A", "B", "C", null],
      default: null,
      index: true
    },
    createdBy: {
      type: import_mongoose5.Schema.Types.ObjectId,
      ref: "User"
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);
cabCompanySchema.index({ name: "text", description: "text" });
cabCompanySchema.index({ "location.city": 1, isActive: 1 });
cabCompanySchema.index({ vendorId: 1, createdAt: -1 });
var CabCompany = import_mongoose5.default.model("CabCompany", cabCompanySchema);
var cab_model_default = CabCompany;

// src/modules/bike/company/bike.model.ts
var import_mongoose6 = __toESM(require("mongoose"), 1);
var bikeCompanySchema = new import_mongoose6.Schema(
  {
    vendorId: {
      type: import_mongoose6.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: [true, "Bike company name is required"],
      trim: true
    },
    location: {
      city: {
        type: String,
        required: true
      },
      state: { type: String },
      country: {
        type: String,
        default: "India"
      }
    },
    address: {
      type: import_mongoose6.Schema.Types.Mixed
    },
    coordinates: {
      lat: Number,
      lng: Number
    },
    locationHistory: [
      {
        address: { type: import_mongoose6.Schema.Types.Mixed },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        country: { type: String, trim: true },
        coordinates: {
          lat: Number,
          lng: Number
        },
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: import_mongoose6.Schema.Types.ObjectId, ref: "User" }
      }
    ],
    images: [
      {
        url: String,
        public_id: String,
        resource_type: String
      }
    ],
    advertisementImage: {
      url: String,
      public_id: String,
      resource_type: { type: String, default: "image" }
    },
    documents: [
      {
        docName: String,
        docUrl: String,
        public_id: String,
        resource_type: String,
        isVerified: { type: Boolean, default: false }
      }
    ],
    description: {
      type: String,
      trim: true
    },
    features: [String],
    rentalPolicies: {
      helmetIncluded: { type: Boolean, default: false },
      fuelPolicy: { type: String, trim: true },
      securityDeposit: { type: Number, default: 0 },
      licenseRequired: { type: Boolean, default: true }
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      count: {
        type: Number,
        default: 0
      }
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
      index: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    rank: {
      type: String,
      enum: ["A", "B", "C", null],
      default: null,
      index: true
    },
    createdBy: {
      type: import_mongoose6.Schema.Types.ObjectId,
      ref: "User"
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  { timestamps: true }
);
bikeCompanySchema.index({ "location.city": 1, isActive: 1 });
bikeCompanySchema.index({ vendorId: 1, createdAt: -1 });
var BikeCompany = import_mongoose6.default.model("BikeCompany", bikeCompanySchema);
var bike_model_default = BikeCompany;

// src/modules/tour/company/tour.model.ts
var import_mongoose7 = __toESM(require("mongoose"), 1);
var addressSchema2 = new import_mongoose7.Schema(
  {
    buildingName: { type: String, trim: true, default: "" },
    doorNumber: { type: String, trim: true, default: "" },
    streetAddress: { type: String, trim: true, default: "" },
    areaName: { type: String, trim: true, index: true, default: "" },
    // Town / locality / neighborhood
    city: { type: String, required: true, trim: true, index: true },
    district: { type: String, trim: true, default: "" },
    state: { type: String, trim: true, index: true, default: "" },
    postalCode: { type: String, trim: true, index: true, default: "" },
    country: { type: String, trim: true, default: "India", index: true },
    countryCode: { type: String, uppercase: true, trim: true, maxlength: 2, default: "IN" },
    landmark: { type: String, trim: true, default: "" },
    directions: { type: String, trim: true, default: "" },
    formattedAddress: { type: String, trim: true, default: "" },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number],
        default: [72.8777, 19.076]
        // [lng, lat]
      }
    },
    placeId: { type: String, trim: true, default: "" },
    timeZone: { type: String, trim: true, default: "" }
  },
  { _id: false }
);
var tourCompanySchema = new import_mongoose7.Schema(
  {
    vendorId: {
      type: import_mongoose7.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: [true, "Tour company name is required"],
      trim: true,
      index: true
    },
    location: {
      city: {
        type: String,
        required: true,
        index: true,
        trim: true
      },
      state: { type: String, trim: true },
      country: {
        type: String,
        default: "India",
        trim: true
      }
    },
    // Embedded Powerful Address Schema (or string for legacy compatibility)
    address: {
      type: import_mongoose7.Schema.Types.Mixed
    },
    coordinates: {
      lat: Number,
      lng: Number
    },
    locationHistory: [
      {
        address: { type: import_mongoose7.Schema.Types.Mixed },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        country: { type: String, trim: true },
        coordinates: {
          lat: Number,
          lng: Number
        },
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: import_mongoose7.Schema.Types.ObjectId, ref: "User" }
      }
    ],
    logo: {
      url: String,
      public_id: String,
      resource_type: { type: String, default: "image" }
    },
    images: [
      {
        url: String,
        public_id: String,
        resource_type: String
      }
    ],
    advertisementImage: {
      url: String,
      public_id: String,
      resource_type: { type: String, default: "image" }
    },
    documents: [
      {
        docName: String,
        docUrl: String,
        public_id: String,
        resource_type: String,
        isVerified: { type: Boolean, default: false }
      }
    ],
    description: {
      type: String,
      trim: true
    },
    features: [
      {
        type: String,
        trim: true
      }
    ],
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      count: {
        type: Number,
        default: 0
      }
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
      index: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    rank: {
      type: String,
      enum: ["A", "B", "C", null],
      default: null,
      index: true
    },
    createdBy: {
      type: import_mongoose7.Schema.Types.ObjectId,
      ref: "User"
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  { timestamps: true }
);
tourCompanySchema.pre("validate", function(next) {
  const self = this;
  if (typeof self.address === "string") {
    const raw = self.address;
    self.address = {
      streetAddress: raw,
      city: self.location?.city || "India",
      state: self.location?.state || "",
      country: self.location?.country || "India",
      formattedAddress: raw,
      location: {
        type: "Point",
        coordinates: [self.coordinates?.lng || 72.8777, self.coordinates?.lat || 19.076]
      }
    };
  } else if (!self.address && self.location?.city) {
    self.address = {
      streetAddress: "",
      city: self.location.city,
      state: self.location.state || "",
      country: self.location.country || "India",
      formattedAddress: self.location.city,
      location: {
        type: "Point",
        coordinates: [self.coordinates?.lng || 72.8777, self.coordinates?.lat || 19.076]
      }
    };
  }
  if (self.address?.city && (!self.location || !self.location.city)) {
    if (!self.location) self.location = {};
    self.location.city = self.address.city;
  }
  if (self.location?.city && self.address && !self.address.city) {
    self.address.city = self.location.city;
  }
  if (self.address?.state && (!self.location || !self.location.state)) {
    if (!self.location) self.location = {};
    self.location.state = self.address.state;
  }
  if (self.address?.country && (!self.location || !self.location.country)) {
    if (!self.location) self.location = {};
    self.location.country = self.address.country;
  }
  if (self.coordinates?.lat && self.coordinates?.lng) {
    if (self.address && (!self.address.location || !self.address.location.coordinates?.length)) {
      self.address.location = {
        type: "Point",
        coordinates: [self.coordinates.lng, self.coordinates.lat]
      };
    }
  } else if (self.address?.location?.coordinates?.length === 2) {
    self.coordinates = {
      lat: self.address.location.coordinates[1],
      lng: self.address.location.coordinates[0]
    };
  }
  if (typeof next === "function") {
    next();
  }
});
tourCompanySchema.index({ "location.city": 1, isActive: 1 });
tourCompanySchema.index({ "address.city": 1, "address.areaName": 1, isActive: 1 });
tourCompanySchema.index({ vendorId: 1, createdAt: -1 });
tourCompanySchema.index({
  name: "text",
  description: "text",
  "location.city": "text",
  "address.city": "text",
  "address.areaName": "text",
  "address.district": "text",
  "address.streetAddress": "text"
});
var TourCompany = import_mongoose7.default.model("TourCompany", tourCompanySchema);
var tour_model_default = TourCompany;

// src/modules/adventure/category/adventure.model.ts
var import_mongoose8 = __toESM(require("mongoose"), 1);
var adventureSchema = new import_mongoose8.Schema(
  {
    vendorId: {
      type: import_mongoose8.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: [true, "Adventure name is required"],
      trim: true,
      index: true
    },
    category: {
      type: String,
      required: true,
      enum: ["rafting", "paragliding", "bungee", "trekking"],
      index: true
    },
    location: {
      city: {
        type: String,
        index: true
      },
      state: { type: String },
      country: { type: String, default: "India" }
    },
    address: {
      type: import_mongoose8.Schema.Types.Mixed
    },
    coordinates: {
      lat: Number,
      lng: Number
    },
    locationHistory: [
      {
        address: { type: import_mongoose8.Schema.Types.Mixed },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        country: { type: String, trim: true },
        coordinates: {
          lat: Number,
          lng: Number
        },
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: import_mongoose8.Schema.Types.ObjectId, ref: "User" }
      }
    ],
    images: [
      {
        url: String,
        public_id: String,
        resource_type: String
      }
    ],
    advertisementImage: {
      url: String,
      public_id: String,
      resource_type: { type: String, default: "image" }
    },
    documents: [
      {
        docName: String,
        docUrl: String,
        public_id: String,
        resource_type: String,
        isVerified: { type: Boolean, default: false }
      }
    ],
    description: {
      type: String,
      trim: true
    },
    features: [
      {
        type: String,
        trim: true
      }
    ],
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      count: {
        type: Number,
        default: 0
      }
    },
    priceRange: {
      min: Number,
      max: Number
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
      index: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    rank: {
      type: String,
      enum: ["A", "B", "C", null],
      default: null,
      index: true
    },
    createdBy: {
      type: import_mongoose8.Schema.Types.ObjectId,
      ref: "User"
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  { timestamps: true }
);
adventureSchema.index({ category: 1, "location.city": 1 });
adventureSchema.index({ vendorId: 1, createdAt: -1 });
var Adventure = import_mongoose8.default.model("Adventure", adventureSchema);
var adventure_model_default = Adventure;

// src/shared/utils/jwt.ts
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"), 1);
var generateTokens = (userId, vendorId = null) => {
  const accessToken = import_jsonwebtoken2.default.sign(
    {
      id: userId,
      vendorId
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "1d"
    }
  );
  const refreshToken = import_jsonwebtoken2.default.sign(
    {
      id: userId,
      vendorId
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d"
    }
  );
  return {
    accessToken,
    refreshToken
  };
};

// src/modules/auth/auth.controller.ts
var AuthController = class {
  // Helper function to set refresh token cookie
  setTokenCookie(res, refreshToken) {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1e3
    });
  }
  // Helper to filter user data (Strictly avoid sending password/otp)
  filterUserData(user) {
    return {
      id: user._id,
      email: user.email,
      role: user.role,
      isVerified: user.providers?.local?.isVerified || false,
      firstName: user.firstName,
      lastName: user.lastName
    };
  }
  // Unified Error Handler for Controllers
  handleError(res, error, status = 400) {
    logger_default.error(`Auth Error: ${error.message}`);
    return res.status(status).json({ success: false, message: error.message });
  }
  socialAuthSuccess = async (req, res) => {
    try {
      const userId = (req.user?._id || req.user?.id)?.toString();
      const { accessToken, refreshToken } = generateTokens(userId);
      this.setTokenCookie(res, refreshToken);
      res.redirect(
        `${process.env.FRONTEND_URL}/auth-callback?token=${accessToken}`
      );
    } catch (error) {
      logger_default.error("Social Auth Success Error:", error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }
  };
  signup = async (req, res) => {
    try {
      const { email, password, role, firstName, lastName, phoneNumber } = req.body;
      const result = await auth_service_default.signup(
        email,
        password,
        role,
        firstName,
        lastName,
        phoneNumber
      );
      return res.status(201).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const { user, message } = await auth_service_default.login(email, password);
      let vendorId = null;
      let extraData = {};
      if (user.role === "vendor") {
        const vendor = await vendor_model_default.findOne({
          userId: user._id
        });
        if (vendor) {
          vendorId = vendor._id;
          extraData.vendor = {
            status: vendor.status,
            currentStep: vendor.currentStep,
            rejectedSteps: vendor.rejectedSteps || [],
            rejectionReasons: vendor.rejectionReasons || {},
            serviceType: vendor.serviceType
          };
          let business = null;
          switch (vendor.serviceType) {
            case "hotel":
              business = await hotel_model_default.findOne({
                vendorId: vendor._id
              }).select("_id name");
              break;
            case "cab":
              business = await cab_model_default.findOne({
                vendorId: vendor._id
              }).select("_id name");
              break;
            case "bike":
              business = await bike_model_default.findOne({
                vendorId: vendor._id
              }).select("_id name");
              break;
            case "tour":
              business = await tour_model_default.findOne({
                vendorId: vendor._id
              }).select("_id name");
              break;
            case "adventure":
              business = await adventure_model_default.findOne({
                vendorId: vendor._id
              }).select("_id name category");
              break;
            default:
              business = null;
          }
          if (vendor.status === "approved") {
            extraData.business = business;
          }
        }
      }
      const { accessToken, refreshToken } = generateTokens(
        user._id.toString(),
        vendorId ? vendorId.toString() : null
      );
      this.setTokenCookie(res, refreshToken);
      return res.status(200).json({
        success: true,
        message,
        accessToken,
        data: {
          user: this.filterUserData(user),
          ...extraData
        }
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }
  };
  resendOTP = async (req, res) => {
    try {
      const result = await auth_service_default.resendOTP(req.body.email);
      return res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  };
  verifyOTP = async (req, res) => {
    try {
      const { email, otp } = req.body;
      const { user, vendor, message } = await auth_service_default.verifyOTP(email, otp);
      const { accessToken, refreshToken } = generateTokens(user._id.toString());
      this.setTokenCookie(res, refreshToken);
      return res.status(200).json({
        success: true,
        message,
        accessToken,
        data: {
          user: this.filterUserData(user),
          vendor: vendor ? {
            currentStep: vendor.currentStep,
            registrationStep: vendor.registrationStep,
            status: vendor.status,
            rejectedSteps: vendor.rejectedSteps || [],
            rejectionReasons: vendor.rejectionReasons || {}
          } : null
        }
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
  forgotPassword = async (req, res) => {
    try {
      const { phone, email } = req.body;
      const result = await auth_service_default.forgotPassword(phone || email);
      return res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
  otpVerify = async (req, res) => {
    try {
      const { phone, email, otp } = req.body;
      const result = await auth_service_default.otpVerify(phone || email, otp);
      return res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
  resetPassword = async (req, res) => {
    try {
      const { phone, email, otp, newPassword } = req.body;
      const result = await auth_service_default.resetPassword(
        phone || email,
        otp,
        newPassword
      );
      return res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
  changePassword = async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.user?.id || req.user?._id;
      const result = await auth_service_default.changePassword(
        userId,
        oldPassword,
        newPassword
      );
      return res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  };
  // WhatsApp auth
  whatsappSignup = async (req, res) => {
    try {
      const { phone, password } = req.body;
      const result = await auth_service_default.whatsappSignup(phone, password);
      return res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  whatsappVerify = async (req, res) => {
    try {
      const { phone, otp } = req.body;
      const { user, message } = await auth_service_default.whatsappVerify(phone, otp);
      const { accessToken, refreshToken } = generateTokens(user._id.toString());
      this.setTokenCookie(res, refreshToken);
      return res.status(200).json({
        success: true,
        message,
        accessToken,
        data: {
          user: this.filterUserData(user)
        }
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
  whatsappLogin = async (req, res) => {
    try {
      const { phone, password } = req.body;
      const { user, message } = await auth_service_default.whatsappLogin(phone, password);
      const { accessToken, refreshToken } = generateTokens(user._id.toString());
      this.setTokenCookie(res, refreshToken);
      return res.status(200).json({
        success: true,
        message,
        accessToken,
        data: {
          user: this.filterUserData(user)
        }
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }
  };
  forgotPasswordWhatsapp = async (req, res) => {
    try {
      const { phone } = req.body;
      const result = await auth_service_default.forgotPasswordWhatsapp(phone);
      return res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  verifyForgotPasswordOtp = async (req, res) => {
    try {
      const { phone, otp } = req.body;
      const result = await auth_service_default.verifyForgotPasswordOtp(phone, otp);
      return res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  resetPasswordWhatsapp = async (req, res) => {
    try {
      const { phone, otp, newPassword } = req.body;
      const result = await auth_service_default.resetPasswordWhatsapp(
        phone,
        otp,
        newPassword
      );
      return res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  emailSignup = async (req, res) => {
    try {
      const result = await auth_service_default.emailSignup(req.body);
      return res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  emailVerifySignupOTP = async (req, res) => {
    try {
      const result = await auth_service_default.emailVerifySignupOTP(req.body);
      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
        accessToken: result.accessToken
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  emailResendOTP = async (req, res) => {
    try {
      const result = await auth_service_default.emailResendOTP(req.body.email);
      return res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  emailLogin = async (req, res) => {
    try {
      const result = await auth_service_default.emailLogin(req.body);
      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
        accessToken: result.accessToken
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
};

// src/shared/middlewares/verifyToken.ts
var import_jsonwebtoken3 = __toESM(require("jsonwebtoken"), 1);
var protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token provided"
      });
    }
    const decoded = import_jsonwebtoken3.default.verify(token, process.env.JWT_ACCESS_SECRET);
    const currentUser = await auth_model_default.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "The user belonging to this token no longer exists"
      });
    }
    req.user = currentUser;
    req.vendorId = decoded.vendorId || null;
    next();
  } catch (error) {
    logger_default.error("Auth Middleware Error:", error.message);
    const message = error.name === "TokenExpiredError" ? "Token expired, please login again" : "Invalid token, authorization denied";
    return res.status(401).json({
      success: false,
      message
    });
  }
};
var optionalProtect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next();
    }
    const decoded = import_jsonwebtoken3.default.verify(token, process.env.JWT_ACCESS_SECRET);
    const currentUser = await auth_model_default.findById(decoded.id);
    if (currentUser) {
      req.user = currentUser;
    }
    next();
  } catch (error) {
    next();
  }
};

// src/shared/config/passport.ts
var import_fs = __toESM(require("fs"), 1);
var import_passport = __toESM(require("passport"), 1);
var import_passport_google_oauth20 = require("passport-google-oauth20");
var import_passport_facebook = require("passport-facebook");
var import_passport_apple = __toESM(require("passport-apple"), 1);
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  try {
    import_passport.default.use(
      new import_passport_google_oauth20.Strategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/v1/auth/google/callback"
        },
        async (_accessToken, _refreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value;
            if (!email)
              return done(new Error("Email not found from Google"), false);
            let user = await auth_model_default.findOne({ email });
            if (!user) {
              user = await auth_model_default.create({
                email,
                firstName: profile.name?.givenName,
                lastName: profile.name?.familyName,
                avatar: profile.photos?.[0]?.value,
                providers: {
                  google: { id: profile.id, email },
                  local: { isVerified: true }
                }
              });
            }
            return done(null, user);
          } catch (err) {
            logger_default.error(err);
            return done(err, false);
          }
        }
      )
    );
  } catch (err) {
    logger_default.warn("Could not initialize Google OAuth strategy:", err);
  }
}
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET && process.env.FACEBOOK_APP_ID !== "your_facebook_app_id") {
  try {
    import_passport.default.use(
      new import_passport_facebook.Strategy(
        {
          clientID: process.env.FACEBOOK_APP_ID,
          clientSecret: process.env.FACEBOOK_APP_SECRET,
          callbackURL: process.env.FACEBOOK_CALLBACK_URL || "/api/v1/auth/facebook/callback",
          profileFields: ["id", "emails", "name", "photos"]
        },
        async (_accessToken, _refreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value;
            if (!email)
              return done(new Error("Email not found from Facebook"), false);
            let user = await auth_model_default.findOne({ email });
            if (!user) {
              user = await auth_model_default.create({
                email,
                firstName: profile.name?.givenName,
                lastName: profile.name?.familyName,
                providers: {
                  facebook: { id: profile.id, email },
                  local: { isVerified: true }
                }
              });
            }
            return done(null, user);
          } catch (err) {
            logger_default.error(err);
            return done(err, false);
          }
        }
      )
    );
  } catch (err) {
    logger_default.warn("Could not initialize Facebook OAuth strategy:", err);
  }
}
if (process.env.APPLE_CLIENT_ID && process.env.APPLE_CLIENT_ID !== "your_apple_service_id" && process.env.APPLE_PRIVATE_KEY_PATH && import_fs.default.existsSync(process.env.APPLE_PRIVATE_KEY_PATH)) {
  try {
    import_passport.default.use(
      new import_passport_apple.default(
        {
          clientID: process.env.APPLE_CLIENT_ID,
          teamID: process.env.APPLE_TEAM_ID || "",
          keyID: process.env.APPLE_KEY_ID || "",
          privateKeyLocation: process.env.APPLE_PRIVATE_KEY_PATH,
          callbackURL: process.env.APPLE_CALLBACK_URL || "/api/v1/auth/apple/callback",
          passReqToCallback: true
        },
        async (req, _accessToken, _refreshToken, _idToken, profile, done) => {
          try {
            const email = profile?.email || req.body?.email;
            if (!email) {
              return done(new Error("Email not provided by Apple"), false);
            }
            let user = await auth_model_default.findOne({ email });
            if (!user) {
              user = await auth_model_default.create({
                email,
                providers: {
                  apple: { id: profile?.sub || profile?.user, email },
                  local: { isVerified: true }
                }
              });
            }
            return done(null, user);
          } catch (err) {
            logger_default.error(err);
            return done(err, false);
          }
        }
      )
    );
  } catch (err) {
    logger_default.warn("Could not initialize Apple OAuth strategy:", err);
  }
}
var passport_default = import_passport.default;

// src/modules/auth/auth.routes.ts
var import_express_rate_limit = __toESM(require("express-rate-limit"), 1);
var router = (0, import_express.Router)();
var authController = new AuthController();
var authLimiter = (0, import_express_rate_limit.default)({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: 10,
  // Limit each IP to 10 requests per window
  message: {
    success: false,
    message: "Too many attempts from this IP, please try again after 15 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false
});
var otpLimiter = (0, import_express_rate_limit.default)({
  windowMs: 60 * 60 * 1e3,
  // 1 hour
  max: 5,
  // Limit each IP to 5 OTP requests per hour
  message: {
    success: false,
    message: "OTP limit exceeded, please try again after an hour"
  }
});
router.post("/whatsapp-signup", authLimiter, authController.whatsappSignup);
router.post("/whatsapp-verify", authLimiter, authController.whatsappVerify);
router.post("/whatsapp-login", authLimiter, authController.whatsappLogin);
router.post(
  "/forgot-password-whatsapp",
  authLimiter,
  authController.forgotPasswordWhatsapp
);
router.post(
  "/verify-forgot-password-otp",
  authLimiter,
  authController.verifyForgotPasswordOtp
);
router.post(
  "/reset-password-whatsapp",
  authLimiter,
  authController.resetPasswordWhatsapp
);
router.post("/resend-otp", otpLimiter, authController.resendOTP);
router.post("/verify-otp", authLimiter, authController.verifyOTP);
router.post("/signup", authLimiter, authController.signup);
router.post("/login", authLimiter, authController.login);
router.post("/forgot-password", otpLimiter, authController.forgotPassword);
router.post("/otp-verify", otpLimiter, authController.otpVerify);
router.patch("/reset-password", authLimiter, authController.resetPassword);
router.patch("/change-password", protect, authController.changePassword);
router.post("/email-signup", authController.emailSignup);
router.post("/email-verify-otp", authController.emailVerifySignupOTP);
router.post("/email-resend-otp", authController.emailResendOTP);
router.post("/email-login", authController.emailLogin);
router.get(
  "/google",
  passport_default.authenticate("google", {
    scope: ["profile", "email"],
    session: false
  })
);
router.get(
  "/google/callback",
  passport_default.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false
  }),
  authController.socialAuthSuccess
);
router.get(
  "/facebook",
  passport_default.authenticate("facebook", {
    scope: ["email"],
    session: false
  })
);
router.get(
  "/facebook/callback",
  passport_default.authenticate("facebook", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false
  }),
  authController.socialAuthSuccess
);
router.get("/apple", passport_default.authenticate("apple", { session: false }));
router.post(
  "/apple/callback",
  passport_default.authenticate("apple", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false
  }),
  authController.socialAuthSuccess
);
var auth_routes_default = router;

// src/modules/users/user.routes.ts
var import_express2 = require("express");

// src/shared/config/cloudinary.ts
var import_cloudinary = require("cloudinary");
import_cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
var cloudinary_default = import_cloudinary.v2;

// src/modules/upload/upload.service.ts
var uploadFiles = async (files, folder = "general") => {
  try {
    const results = await Promise.all(
      files.map((file) => {
        const isImage = file.mimetype?.startsWith("image");
        return new Promise((resolve, reject) => {
          const stream = cloudinary_default.uploader.upload_stream(
            {
              folder,
              resource_type: "auto",
              ...isImage && {
                format: "webp",
                // force webp
                quality: "auto"
              }
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(file.buffer);
        });
      })
    );
    return results.map((file) => ({
      url: file.secure_url,
      public_id: file.public_id,
      resource_type: file.resource_type,
      format: file.format
    }));
  } catch (error) {
    throw error;
  }
};
var deleteFile = async (publicId, resourceType = "image") => {
  if (!publicId) return { result: "ok" };
  try {
    const resType = resourceType === "raw" || resourceType === "video" ? resourceType : "image";
    let res = await cloudinary_default.uploader.destroy(publicId, {
      resource_type: resType
    });
    if (res.result === "not found") {
      const fallbackType = resType === "image" ? "raw" : "image";
      res = await cloudinary_default.uploader.destroy(publicId, {
        resource_type: fallbackType
      });
    }
    return res;
  } catch (error) {
    console.error("Cloudinary deleteFile error for", publicId, error);
    return { result: "error", error: error.message };
  }
};
var deleteMultipleFiles = async (publicIds = [], resourceType = "image") => {
  if (!Array.isArray(publicIds) || publicIds.length === 0) {
    return { success: true, count: 0 };
  }
  const results = await Promise.allSettled(
    publicIds.filter(Boolean).map((id) => deleteFile(id, resourceType))
  );
  return {
    success: true,
    count: results.length,
    results
  };
};
var UploadService = class {
  async uploadFiles(files, folder = "general") {
    return uploadFiles(files, folder);
  }
  async deleteFile(publicId, resourceType = "image") {
    return deleteFile(publicId, resourceType);
  }
  async deleteMultipleFiles(publicIds = [], resourceType = "image") {
    return deleteMultipleFiles(publicIds, resourceType);
  }
};
var uploadService = new UploadService();
var upload_service_default = uploadService;

// src/modules/users/user.service.ts
function getCloudinaryPublicId(url) {
  if (!url || typeof url !== "string" || !url.includes("cloudinary.com")) return null;
  const parts = url.split("/upload/");
  if (parts.length < 2) return null;
  const afterUpload = parts[1];
  const withoutVersion = afterUpload.replace(/^v\d+\//, "");
  const publicId = withoutVersion.replace(/\.[^/.]+$/, "");
  return publicId || null;
}
var getUserProfile = async (userId) => {
  return await auth_model_default.findById(userId).select("-otp -otpExpires");
};
var updateUserProfile = async (userId, updateData) => {
  if (updateData.email) {
    throw new Error("Email cannot be updated");
  }
  const existingUser = await auth_model_default.findById(userId);
  if (!existingUser) {
    throw new Error("User not found");
  }
  const oldAvatar = existingUser.avatar;
  const newAvatar = updateData.avatar;
  const updatedUser = await auth_model_default.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select("-otp -otpExpires");
  if (newAvatar !== void 0 && oldAvatar && oldAvatar !== newAvatar) {
    const oldPublicId = getCloudinaryPublicId(oldAvatar);
    if (oldPublicId) {
      deleteFile(oldPublicId, "image").catch((err) => {
        logger_default.error("Failed to delete previous user avatar from Cloudinary:", err);
      });
    }
  }
  return updatedUser;
};
var deleteAccountRequest = async (userId, body) => {
  try {
    const { reason } = body;
    const user = await auth_model_default.findOne({
      _id: userId,
      role: "user"
    });
    if (!user) {
      throw new Error("User not found");
    }
    if (user.deleteRequest?.status === "pending") {
      throw new Error("Account deletion request already submitted");
    }
    user.deleteRequest = {
      status: "pending",
      requestedAt: /* @__PURE__ */ new Date(),
      reason: reason || ""
    };
    await user.save();
    return {
      success: true,
      message: "Account deletion request submitted successfully"
    };
  } catch (error) {
    logger_default.error("Service Error: deleteAccountRequest", error);
    throw error;
  }
};
var UserService = class {
  async getUserProfile(userId) {
    return getUserProfile(userId);
  }
  async updateUserProfile(userId, updateData) {
    return updateUserProfile(userId, updateData);
  }
  async deleteAccountRequest(userId, body) {
    return deleteAccountRequest(userId, body);
  }
};
var userService = new UserService();
var user_service_default = userService;

// src/modules/users/user.controller.ts
var UserController = class {
  async getMe(req, res) {
    try {
      const userId = req.user?.id;
      const user = await user_service_default.getUserProfile(userId);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }
  async updateMe(req, res) {
    try {
      const userId = req.user?.id;
      const user = await user_service_default.updateUserProfile(userId, req.body);
      if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }
      logger_default.info(`Profile updated for user: ${user.email}`);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
  async deleteAccountRequest(req, res, next) {
    try {
      const userId = req.user?.id;
      const result = await user_service_default.deleteAccountRequest(userId, req.body);
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      logger_default.error("Controller Error: deleteAccountRequest", error);
      next(error);
    }
  }
};

// src/modules/users/user.routes.ts
var router2 = (0, import_express2.Router)();
var userController = new UserController();
router2.use(protect);
router2.get("/me", userController.getMe);
router2.patch("/update-me", userController.updateMe);
router2.post(
  "/delete-account-request",
  protect,
  userController.deleteAccountRequest
);
var user_routes_default = router2;

// src/modules/hotels/hotel.routes.ts
var import_express3 = require("express");

// src/modules/rooms/roomType.model.ts
var import_mongoose9 = __toESM(require("mongoose"), 1);
var roomTypeSchema = new import_mongoose9.Schema(
  {
    hotelId: {
      type: import_mongoose9.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: function(value) {
          return value <= this.basePrice;
        },
        message: "Discount price cannot be greater than base price"
      }
    },
    capacity: {
      adults: {
        type: Number,
        default: 2,
        min: 0
      },
      children: {
        type: Number,
        default: 0,
        min: 0
      }
    },
    beds: {
      type: [
        {
          type: {
            type: String,
            enum: ["single", "double", "king", "queen", "sofa"],
            required: true
          },
          quantity: {
            type: Number,
            required: true,
            min: 1
          }
        }
      ],
      validate: {
        validator: function(value) {
          return value && value.length > 0;
        },
        message: "At least one bed configuration is required"
      }
    },
    roomSizeSqm: {
      type: Number,
      min: 0
    },
    viewType: {
      type: String,
      enum: ["city", "sea", "garden", "mountain", "lake", "none"],
      default: "none"
    },
    amenities: [String],
    images: [
      {
        url: String,
        public_id: String,
        resource_type: String
      }
    ],
    totalRooms: {
      type: Number,
      required: true,
      min: 1
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);
var RoomType = import_mongoose9.default.model("RoomType", roomTypeSchema);
var roomType_model_default = RoomType;

// src/modules/hotels/hotel.service.ts
init_availability_model();

// src/modules/admin/tax/tax.model.ts
var import_mongoose11 = __toESM(require("mongoose"), 1);
var taxSchema = new import_mongoose11.Schema(
  {
    taxPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: import_mongoose11.Schema.Types.ObjectId,
      ref: "User"
      // superadmin
    },
    updatedBy: {
      type: import_mongoose11.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);
taxSchema.index({ isActive: 1 });
var Tax = import_mongoose11.default.model("Tax", taxSchema);
var tax_model_default = Tax;

// src/modules/favorites/favorite.model.ts
var import_mongoose12 = __toESM(require("mongoose"), 1);
var favoriteSchema = new import_mongoose12.Schema(
  {
    user: {
      type: import_mongoose12.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    itemId: {
      type: import_mongoose12.Schema.Types.ObjectId,
      required: true,
      index: true
    },
    itemType: {
      type: String,
      enum: ["hotel", "cab", "bike", "tour", "adventure"],
      required: true
    }
  },
  { timestamps: true }
);
favoriteSchema.index({ user: 1, itemId: 1, itemType: 1 }, { unique: true });
var Favorite = import_mongoose12.default.model("Favorite", favoriteSchema);
var favorite_model_default = Favorite;

// src/modules/hotels/hotel.service.ts
var attachFavoriteFlag = async (hotels, userId) => {
  if (!userId || hotels.length === 0) {
    hotels.forEach((hotel) => hotel.isFavorite = false);
    return hotels;
  }
  const hotelIds = hotels.map((h) => h._id);
  const favorites = await favorite_model_default.find({
    user: userId,
    itemType: "hotel",
    itemId: { $in: hotelIds }
  }).select("itemId");
  const favoriteSet = new Set(favorites.map((fav) => fav.itemId.toString()));
  hotels.forEach((hotel) => {
    hotel.isFavorite = favoriteSet.has(hotel._id.toString());
  });
  return hotels;
};
var createHotel = async (vendor, hotelData) => {
  try {
    if (vendor.isSubmitted && vendor.status !== "rejected") {
      throw new Error("Already submitted. Cannot edit.");
    }
    if (vendor.currentStep !== 3 && vendor.status !== "rejected") {
      throw new Error("Invalid step flow");
    }
    if (vendor.status === "rejected" && vendor.rejectedStep !== 4) {
      throw new Error("Fix required step first");
    }
    const city = (hotelData.city || hotelData.hotelCity || "").trim();
    const location = hotelData.location || {
      type: "Point",
      coordinates: [72.8777, 19.076]
    };
    let addressObj;
    if (typeof hotelData.address === "object" && hotelData.address !== null) {
      addressObj = {
        buildingName: hotelData.address.buildingName || hotelData.buildingName || "",
        doorNumber: hotelData.address.doorNumber || hotelData.doorNumber || "",
        streetAddress: hotelData.address.streetAddress || hotelData.address.address || hotelData.hotelAddress || "",
        areaName: hotelData.address.areaName || hotelData.areaName || "",
        city: hotelData.address.city || city || "Default City",
        district: hotelData.address.district || hotelData.district || "",
        state: hotelData.address.state || hotelData.state || "",
        postalCode: hotelData.address.postalCode || hotelData.postalCode || "",
        country: hotelData.address.country || hotelData.country || "India",
        countryCode: hotelData.address.countryCode || hotelData.countryCode || "IN",
        landmark: hotelData.address.landmark || hotelData.landmark || "",
        directions: hotelData.address.directions || hotelData.directions || "",
        formattedAddress: hotelData.address.formattedAddress || hotelData.formattedAddress || "",
        location: hotelData.address.location || location,
        placeId: hotelData.address.placeId || "",
        timeZone: hotelData.address.timeZone || ""
      };
    } else {
      const rawAddr = (hotelData.address || hotelData.hotelAddress || "").trim();
      addressObj = {
        buildingName: hotelData.buildingName || "",
        doorNumber: hotelData.doorNumber || "",
        streetAddress: rawAddr,
        areaName: hotelData.areaName || "",
        city: city || "Default City",
        district: hotelData.district || "",
        state: hotelData.state || "",
        postalCode: hotelData.postalCode || "",
        country: hotelData.country || "India",
        countryCode: "IN",
        landmark: hotelData.landmark || "",
        directions: hotelData.directions || "",
        formattedAddress: rawAddr || city,
        location
      };
    }
    if (!addressObj.formattedAddress) {
      const parts = [
        addressObj.doorNumber,
        addressObj.buildingName,
        addressObj.streetAddress,
        addressObj.areaName,
        addressObj.landmark,
        addressObj.city,
        addressObj.district,
        addressObj.state,
        addressObj.postalCode,
        addressObj.country
      ].filter(Boolean);
      addressObj.formattedAddress = parts.join(", ");
    }
    const cleanedPayload = {
      ...hotelData,
      address: addressObj,
      city: addressObj.city || city,
      location: addressObj.location || location
    };
    let hotel = await hotel_model_default.findOne({ vendorId: vendor._id });
    if (hotel) {
      Object.assign(hotel, cleanedPayload);
      hotel.verificationStatus = "pending";
      await hotel.save();
    } else {
      hotel = await hotel_model_default.create({
        ...cleanedPayload,
        vendorId: vendor._id,
        verificationStatus: "pending",
        isActive: false
      });
    }
    vendor.currentStep = 4;
    vendor.registrationStep = Math.max(vendor.registrationStep, 4);
    if (vendor.status === "rejected") {
      vendor.status = "draft";
      vendor.rejectedStep = null;
      vendor.adminRemark = null;
    }
    await vendor.save();
    return hotel;
  } catch (error) {
    logger_default.error("Service Error: createHotel", error);
    throw error;
  }
};
var getAllHotels = async (query = {}, userId = null) => {
  try {
    const {
      city,
      checkIn,
      checkOut,
      minRating,
      minPrice,
      maxPrice,
      amenities,
      minSize,
      maxSize,
      adults,
      children,
      lat,
      lng,
      maxDistance,
      page = 1,
      limit = 10
    } = query;
    if (!city) throw new Error("City is required");
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    const amenityArray = amenities ? Array.isArray(amenities) ? amenities : amenities.split(",") : null;
    let startDate = null;
    let endDate = null;
    let nights = 1;
    if (checkIn && checkOut) {
      startDate = new Date(checkIn);
      endDate = new Date(checkOut);
      startDate.setUTCHours(0, 0, 0, 0);
      endDate.setUTCHours(0, 0, 0, 0);
      nights = Math.max(
        1,
        Math.ceil((endDate.getTime() - startDate.getTime()) / (1e3 * 60 * 60 * 24))
      );
    }
    const cityRegex = { $regex: city.trim(), $options: "i" };
    const locationMatch = {
      $or: [
        { "address.city": cityRegex },
        { "address.areaName": cityRegex },
        { "address.district": cityRegex },
        { "address.streetAddress": cityRegex },
        { "address.landmark": cityRegex },
        { "address.formattedAddress": cityRegex },
        { city: cityRegex }
      ]
    };
    if (startDate && endDate) {
      const basePipeline2 = [
        {
          $match: {
            isActive: true,
            verificationStatus: "verified",
            ...locationMatch,
            ...minRating && { rating: { $gte: Number(minRating) } }
          }
        },
        ...lat && lng ? [
          {
            $match: {
              location: {
                $near: {
                  $geometry: {
                    type: "Point",
                    coordinates: [Number(lng), Number(lat)]
                  },
                  $maxDistance: maxDistance ? Number(maxDistance) * 1e3 : 1e5
                }
              }
            }
          }
        ] : [],
        {
          $lookup: {
            from: "roomtypes",
            localField: "_id",
            foreignField: "hotelId",
            as: "roomTypes"
          }
        },
        { $unwind: "$roomTypes" },
        {
          $match: {
            "roomTypes.isActive": true,
            ...adults && {
              "roomTypes.capacity.adults": { $gte: Number(adults) }
            },
            ...children && {
              "roomTypes.capacity.children": { $gte: Number(children) }
            },
            ...amenityArray && {
              $and: amenityArray.map((amenity) => ({
                $or: [
                  { amenities: amenity },
                  { "roomTypes.amenities": amenity }
                ]
              }))
            },
            ...minSize || maxSize ? {
              "roomTypes.roomSizeSqm": {
                ...minSize && { $gte: Number(minSize) },
                ...maxSize && { $lte: Number(maxSize) }
              }
            } : {}
          }
        },
        {
          $lookup: {
            from: "availabilities",
            let: { roomTypeId: "$roomTypes._id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$roomTypeId", "$$roomTypeId"] },
                  date: { $gte: startDate, $lt: endDate }
                }
              }
            ],
            as: "availabilityData"
          }
        },
        {
          $addFields: {
            minAvailableRooms: {
              $cond: [
                { $gt: [{ $size: "$availabilityData" }, 0] },
                {
                  $min: {
                    $map: {
                      input: "$availabilityData",
                      as: "a",
                      in: {
                        $subtract: [
                          "$roomTypes.totalRooms",
                          {
                            $add: [
                              { $ifNull: ["$$a.bookedRooms", 0] },
                              { $ifNull: ["$$a.blockedRooms", 0] }
                            ]
                          }
                        ]
                      }
                    }
                  }
                },
                "$roomTypes.totalRooms"
              ]
            }
          }
        },
        { $match: { minAvailableRooms: { $gt: 0 } } },
        {
          $addFields: {
            effectivePrice: {
              $cond: [
                { $gt: ["$roomTypes.discountPrice", 0] },
                "$roomTypes.discountPrice",
                "$roomTypes.basePrice"
              ]
            }
          }
        },
        ...minPrice || maxPrice ? [
          {
            $match: {
              effectivePrice: {
                ...minPrice && { $gte: Number(minPrice) },
                ...maxPrice && { $lte: Number(maxPrice) }
              }
            }
          }
        ] : [],
        {
          $group: {
            _id: "$_id",
            name: { $first: "$name" },
            city: { $first: { $ifNull: ["$address.city", "$city"] } },
            address: { $first: "$address" },
            rating: { $first: "$rating" },
            numReviews: { $first: "$numReviews" },
            isFeatured: { $first: "$isFeatured" },
            description: { $first: "$description" },
            amenities: { $first: "$amenities" },
            images: { $first: "$images" },
            rank: { $first: "$rank" },
            startingPrice: { $min: "$effectivePrice" },
            availableRooms: { $min: "$minAvailableRooms" }
          }
        },
        {
          $addFields: {
            rank: { $ifNull: ["$rank", "C"] }
          }
        },
        {
          $addFields: {
            totalNights: nights,
            totalPrice: { $multiply: ["$startingPrice", nights] },
            thumbnail: { $arrayElemAt: ["$images.url", 0] },
            hotelImages: "$images"
          }
        },
        { $project: { images: 0 } },
        {
          $sort: {
            rank: 1,
            isFeatured: -1,
            rating: -1,
            startingPrice: 1
          }
        }
      ];
      const allMatched2 = await hotel_model_default.aggregate(basePipeline2);
      const total2 = allMatched2.length;
      const paginatedPipeline2 = [
        ...basePipeline2,
        { $skip: skip },
        { $limit: limitNum }
      ];
      const hotels2 = await hotel_model_default.aggregate(paginatedPipeline2);
      const updatedHotels2 = await attachFavoriteFlag(hotels2, userId);
      return { hotels: updatedHotels2, total: total2 };
    }
    const basePipeline = [
      {
        $match: {
          isActive: true,
          verificationStatus: "verified",
          ...locationMatch,
          ...minRating && { rating: { $gte: Number(minRating) } }
        }
      },
      ...lat && lng ? [
        {
          $match: {
            location: {
              $near: {
                $geometry: {
                  type: "Point",
                  coordinates: [Number(lng), Number(lat)]
                },
                $maxDistance: maxDistance ? Number(maxDistance) * 1e3 : 1e5
              }
            }
          }
        }
      ] : [],
      {
        $lookup: {
          from: "roomtypes",
          localField: "_id",
          foreignField: "hotelId",
          as: "roomTypes"
        }
      },
      { $unwind: "$roomTypes" },
      {
        $match: {
          "roomTypes.isActive": true,
          ...adults && {
            "roomTypes.capacity.adults": { $gte: Number(adults) }
          },
          ...children && {
            "roomTypes.capacity.children": { $gte: Number(children) }
          },
          ...minSize || maxSize ? {
            "roomTypes.roomSizeSqm": {
              ...minSize && { $gte: Number(minSize) },
              ...maxSize && { $lte: Number(maxSize) }
            }
          } : {},
          ...minPrice || maxPrice ? {
            $or: [
              {
                "roomTypes.discountPrice": {
                  $gt: 0,
                  ...minPrice && { $gte: Number(minPrice) },
                  ...maxPrice && { $lte: Number(maxPrice) }
                }
              },
              {
                "roomTypes.discountPrice": 0,
                "roomTypes.basePrice": {
                  ...minPrice && { $gte: Number(minPrice) },
                  ...maxPrice && { $lte: Number(maxPrice) }
                }
              }
            ]
          } : {},
          ...amenityArray && {
            $and: amenityArray.map((amenity) => ({
              $or: [
                { amenities: amenity },
                { "roomTypes.amenities": amenity }
              ]
            }))
          }
        }
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          city: { $first: { $ifNull: ["$address.city", "$city"] } },
          address: { $first: "$address" },
          rating: { $first: "$rating" },
          numReviews: { $first: "$numReviews" },
          isFeatured: { $first: "$isFeatured" },
          description: { $first: "$description" },
          amenities: { $first: "$amenities" },
          images: { $first: "$images" },
          rank: { $first: "$rank" }
        }
      },
      {
        $addFields: {
          rank: { $ifNull: ["$rank", "C"] },
          thumbnail: { $arrayElemAt: ["$images.url", 0] },
          hotelImages: "$images",
          startingPrice: null,
          availableRooms: null,
          totalNights: 1,
          totalPrice: null
        }
      },
      { $project: { images: 0 } },
      {
        $sort: {
          rank: 1,
          isFeatured: -1,
          rating: -1
        }
      }
    ];
    const allMatched = await hotel_model_default.aggregate(basePipeline);
    const total = allMatched.length;
    const paginatedPipeline = [
      ...basePipeline,
      { $skip: skip },
      { $limit: limitNum }
    ];
    const hotels = await hotel_model_default.aggregate(paginatedPipeline);
    const updatedHotels = await attachFavoriteFlag(hotels, userId);
    return { hotels: updatedHotels, total };
  } catch (error) {
    throw error;
  }
};
var getHomeHotels = async (query = {}, userId = null) => {
  try {
    const { city } = query;
    const filter = {
      isActive: true,
      verificationStatus: "verified"
    };
    if (city && city.trim()) {
      const cityRegex = { $regex: city.trim(), $options: "i" };
      filter.$or = [
        { "address.city": cityRegex },
        { "address.areaName": cityRegex },
        { "address.district": cityRegex },
        { "address.streetAddress": cityRegex },
        { "address.landmark": cityRegex },
        { "address.formattedAddress": cityRegex },
        { city: cityRegex }
      ];
    }
    const hotels = await hotel_model_default.find(filter).select("name city address images rating numReviews isFeatured rank").sort({ isFeatured: -1, rank: 1, rating: -1, createdAt: -1 }).lean();
    const hotelIds = hotels.map((h) => h._id);
    const priceAgg = await roomType_model_default.aggregate([
      {
        $match: {
          hotelId: { $in: hotelIds },
          isActive: true
        }
      },
      {
        $group: {
          _id: "$hotelId",
          minPrice: {
            $min: {
              $cond: [
                { $gt: ["$discountPrice", 0] },
                "$discountPrice",
                "$basePrice"
              ]
            }
          }
        }
      }
    ]);
    const priceMap = {};
    priceAgg.forEach((p) => {
      priceMap[p._id.toString()] = p.minPrice;
    });
    const formattedHotels = hotels.map((hotel) => ({
      _id: hotel._id,
      name: hotel.name,
      city: hotel.address?.city || hotel.city,
      address: hotel.address,
      rating: hotel.rating,
      numReviews: hotel.numReviews,
      image: hotel.images?.[0]?.url || null,
      rank: hotel?.rank || "C",
      isFeatured: hotel.isFeatured || false,
      startingPrice: priceMap[hotel._id.toString()] || null
    }));
    return formattedHotels;
  } catch (error) {
    throw error;
  }
};
var getHotelDetails = async (hotelId, userId = null) => {
  const hotel = await hotel_model_default.findOne({
    _id: hotelId,
    isActive: true,
    verificationStatus: "verified"
  }).lean();
  if (!hotel) throw new Error("Hotel not found");
  const roomTypes = await roomType_model_default.find({
    hotelId,
    isActive: true
  }).lean();
  let isFavorite = false;
  if (userId) {
    const favorite = await favorite_model_default.findOne({
      user: userId,
      itemType: "hotel",
      itemId: hotel._id
    }).select("_id");
    isFavorite = !!favorite;
  }
  return {
    ...hotel,
    isFavorite,
    roomTypes: roomTypes.map((room) => ({
      ...room,
      displayPrice: room.discountPrice && room.discountPrice > 0 ? room.discountPrice : room.basePrice
    }))
  };
};
var getHotelAvailability = async (hotelId, checkIn, checkOut, adults, children) => {
  if (!checkIn || !checkOut) throw new Error("Check-in and check-out required");
  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);
  startDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(0, 0, 0, 0);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error("Invalid date format");
  }
  if (startDate >= endDate) throw new Error("Invalid date range");
  const nights = (endDate.getTime() - startDate.getTime()) / (1e3 * 60 * 60 * 24);
  const hotel = await hotel_model_default.findOne({
    _id: hotelId,
    isActive: true
  }).lean();
  if (!hotel) throw new Error("Hotel not found");
  const roomTypes = await roomType_model_default.find({
    hotelId,
    isActive: true
  }).lean();
  if (!roomTypes.length) {
    return { roomTypes: [] };
  }
  const taxDoc = await tax_model_default.findOne({ isActive: true }).lean();
  const taxPercentage = taxDoc?.taxPercentage || 0;
  const roomTypeIds = roomTypes.map((r) => r._id);
  const availabilityDocs = await availability_model_default.find({
    roomTypeId: { $in: roomTypeIds },
    date: { $gte: startDate, $lt: endDate }
  }).lean();
  const availabilityMap = /* @__PURE__ */ new Map();
  for (const doc of availabilityDocs) {
    const utcDate = new Date(doc.date);
    utcDate.setUTCHours(0, 0, 0, 0);
    const dateStr = utcDate.toISOString().slice(0, 10);
    const mapKey = `${doc.roomTypeId.toString()}_${dateStr}`;
    availabilityMap.set(mapKey, doc);
  }
  const results = [];
  for (const room of roomTypes) {
    if (adults || children) {
      if (room.capacity.adults < adults || room.capacity.children < (children || 0)) {
        continue;
      }
    }
    let minAvailable = room.totalRooms;
    let totalPrice = 0;
    let isAvailable = true;
    for (let i = 0; i < nights; i++) {
      const currentDate = new Date(startDate.getTime() + i * 864e5);
      const dateStr = currentDate.toISOString().slice(0, 10);
      const key2 = `${room._id.toString()}_${dateStr}`;
      const dayDoc = availabilityMap.get(key2);
      const booked = dayDoc?.bookedRooms || 0;
      const blocked = dayDoc?.blockedRooms || 0;
      const available = room.totalRooms - booked - blocked;
      if (available < 1) {
        isAvailable = false;
        break;
      }
      minAvailable = Math.min(minAvailable, available);
      const price = dayDoc?.priceOverride ?? (room.discountPrice && room.discountPrice > 0 ? room.discountPrice : room.basePrice);
      totalPrice += price;
    }
    if (!isAvailable) continue;
    const totalTax = Number((totalPrice * taxPercentage / 100).toFixed(2));
    const totalPriceWithTax = Number((totalPrice + totalTax).toFixed(2));
    results.push({
      ...room,
      availableRooms: minAvailable,
      nights,
      totalPrice,
      taxPercentage,
      totalTax,
      totalPriceWithTax
    });
  }
  return {
    roomTypes: results
  };
};
var updateHotel = async (hotelId, vendorId, updateData) => {
  try {
    const existingHotel = await hotel_model_default.findOne({
      _id: hotelId,
      vendorId
    });
    if (!existingHotel) throw new Error("Hotel not found or unauthorized");
    if (updateData.images && Array.isArray(updateData.images)) {
      if (existingHotel.images && existingHotel.images.length > 0) {
        const remainingPublicIds = new Set(
          updateData.images.map((img) => img?.public_id).filter(Boolean)
        );
        for (const img of existingHotel.images) {
          if (img?.public_id && !remainingPublicIds.has(img.public_id)) {
            try {
              await cloudinary_default.uploader.destroy(img.public_id, {
                resource_type: img.resource_type || "image"
              });
            } catch (destroyErr) {
              logger_default.warn("Could not delete removed hotel image", destroyErr);
            }
          }
        }
      }
    }
    const updatedHotel = await hotel_model_default.findOneAndUpdate(
      { _id: hotelId, vendorId },
      updateData,
      { new: true, runValidators: true }
    );
    return updatedHotel;
  } catch (error) {
    logger_default.error("Service Error: updateHotel", error);
    throw error;
  }
};
var findNearbyHotels = async (lng, lat, maxDistance = 5e3) => {
  try {
    return await hotel_model_default.find({
      isActive: true,
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: maxDistance
        }
      }
    }).limit(50).lean();
  } catch (error) {
    logger_default.error("Service Error: findNearbyHotels", error);
    throw error;
  }
};
var getSuggestions = async (query) => {
  if (!query || query.trim().length < 2) {
    return [];
  }
  const cleanQuery = query.trim();
  const reg = { $regex: cleanQuery, $options: "i" };
  const results = await hotel_model_default.find(
    {
      isActive: true,
      verificationStatus: "verified",
      $or: [
        { name: reg },
        { "address.city": reg },
        { "address.areaName": reg },
        { "address.district": reg },
        { "address.streetAddress": reg },
        { "address.landmark": reg },
        { "address.formattedAddress": reg },
        { "address.state": reg },
        { city: reg }
      ]
    },
    {
      name: 1,
      city: 1,
      address: 1
    }
  ).limit(30).lean();
  const locationMap = /* @__PURE__ */ new Map();
  for (const hotel of results) {
    const city = hotel.address?.city || hotel.city || "";
    const area = hotel.address?.areaName || "";
    const district = hotel.address?.district || "";
    const state = hotel.address?.state || "";
    const landmark = hotel.address?.landmark || "";
    if (city) {
      const key2 = `city:${city.toLowerCase()}`;
      if (!locationMap.has(key2)) {
        locationMap.set(key2, {
          type: "city",
          value: city,
          label: [city, state].filter(Boolean).join(", "),
          state,
          count: 0
        });
      }
      locationMap.get(key2).count++;
    }
    if (area && reg.$regex && new RegExp(cleanQuery, "i").test(area)) {
      const key2 = `town:${area.toLowerCase()}`;
      if (!locationMap.has(key2)) {
        locationMap.set(key2, {
          type: "town",
          value: area,
          label: [area, city, state].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(", "),
          city,
          state,
          count: 0
        });
      }
      locationMap.get(key2).count++;
    }
    if (district && new RegExp(cleanQuery, "i").test(district)) {
      const key2 = `district:${district.toLowerCase()}`;
      if (!locationMap.has(key2)) {
        locationMap.set(key2, {
          type: "district",
          value: district,
          label: [district, state].filter(Boolean).join(", "),
          state,
          count: 0
        });
      }
      locationMap.get(key2).count++;
    }
    if (landmark && new RegExp(cleanQuery, "i").test(landmark)) {
      const key2 = `landmark:${landmark.toLowerCase()}`;
      if (!locationMap.has(key2)) {
        locationMap.set(key2, {
          type: "landmark",
          value: landmark,
          label: [landmark, city, state].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(", "),
          city,
          state,
          count: 0
        });
      }
      locationMap.get(key2).count++;
    }
  }
  const locationSuggestions = [...locationMap.values()].sort((a, b) => {
    const aStarts = a.value.toLowerCase().startsWith(cleanQuery.toLowerCase()) ? 0 : 1;
    const bStarts = b.value.toLowerCase().startsWith(cleanQuery.toLowerCase()) ? 0 : 1;
    if (aStarts !== bStarts) return aStarts - bStarts;
    return b.count - a.count;
  }).slice(0, 6);
  const hotelSuggestions = results.filter((h) => new RegExp(cleanQuery, "i").test(h.name)).slice(0, 3).map((hotel) => ({
    type: "hotel",
    id: hotel._id,
    value: hotel.name,
    label: hotel.address?.city || hotel.city || "",
    city: hotel.address?.city || hotel.city
  }));
  return [...locationSuggestions, ...hotelSuggestions];
};
var searchHotels = async (query = {}, userId = null) => {
  const {
    destination,
    checkIn,
    checkOut,
    adults = 1,
    children = 0,
    page = 1,
    limit = 10
  } = query;
  if (!destination) {
    throw new Error("Destination (city) is required");
  }
  const skip = (Number(page) - 1) * Number(limit);
  let startDate = null;
  let endDate = null;
  let nights = 1;
  if (checkIn && checkOut) {
    startDate = new Date(checkIn);
    endDate = new Date(checkOut);
    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(0, 0, 0, 0);
    nights = Math.max(
      1,
      Math.ceil((endDate.getTime() - startDate.getTime()) / (1e3 * 60 * 60 * 24))
    );
  }
  const pipeline = [
    //HOTEL FILTER
    {
      $match: {
        isActive: true,
        verificationStatus: "verified",
        $or: [
          { "address.city": { $regex: destination.trim(), $options: "i" } },
          { "address.areaName": { $regex: destination.trim(), $options: "i" } },
          { "address.district": { $regex: destination.trim(), $options: "i" } },
          { "address.streetAddress": { $regex: destination.trim(), $options: "i" } },
          { "address.landmark": { $regex: destination.trim(), $options: "i" } },
          { "address.formattedAddress": { $regex: destination.trim(), $options: "i" } },
          { city: { $regex: destination.trim(), $options: "i" } }
        ]
      }
    },
    //ROOM TYPES
    {
      $lookup: {
        from: "roomtypes",
        localField: "_id",
        foreignField: "hotelId",
        as: "roomTypes"
      }
    },
    { $unwind: "$roomTypes" },
    {
      $match: {
        "roomTypes.capacity.adults": { $gte: Number(adults) },
        "roomTypes.capacity.children": { $gte: Number(children) },
        "roomTypes.isActive": true
      }
    },
    //AVAILABILITY (ONLY IF DATES PROVIDED)
    ...startDate && endDate ? [
      {
        $lookup: {
          from: "availabilities",
          let: { roomTypeId: "$roomTypes._id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$roomTypeId", "$$roomTypeId"] },
                date: { $gte: startDate, $lt: endDate }
              }
            }
          ],
          as: "availabilityData"
        }
      },
      {
        $addFields: {
          minAvailableRooms: {
            $cond: [
              { $gt: [{ $size: "$availabilityData" }, 0] },
              {
                $min: {
                  $map: {
                    input: "$availabilityData",
                    as: "a",
                    in: {
                      $subtract: [
                        "$roomTypes.totalRooms",
                        {
                          $add: [
                            { $ifNull: ["$$a.bookedRooms", 0] },
                            { $ifNull: ["$$a.blockedRooms", 0] }
                          ]
                        }
                      ]
                    }
                  }
                }
              },
              "$roomTypes.totalRooms"
            ]
          }
        }
      },
      {
        $match: {
          minAvailableRooms: { $gt: 0 }
        }
      }
    ] : [
      //NO DATE → assume available
      {
        $addFields: {
          minAvailableRooms: "$roomTypes.totalRooms"
        }
      }
    ],
    // PRICE
    {
      $addFields: {
        effectivePrice: {
          $cond: [
            { $gt: ["$roomTypes.discountPrice", 0] },
            "$roomTypes.discountPrice",
            "$roomTypes.basePrice"
          ]
        }
      }
    },
    //GROUP
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        city: { $first: { $ifNull: ["$address.city", "$city"] } },
        address: { $first: "$address" },
        rating: { $first: "$rating" },
        numReviews: { $first: "$numReviews" },
        isFeatured: { $first: "$isFeatured" },
        images: { $first: "$images" },
        startingPrice: { $min: "$effectivePrice" },
        availableRooms: { $min: "$minAvailableRooms" }
      }
    },
    {
      $addFields: {
        totalNights: nights,
        totalPrice: { $multiply: ["$startingPrice", nights] },
        thumbnail: { $arrayElemAt: ["$images.url", 0] }
      }
    },
    {
      $project: {
        images: 0
      }
    },
    { $sort: { isFeatured: -1, rating: -1 } },
    { $skip: skip },
    { $limit: Number(limit) }
  ];
  const hotels = await hotel_model_default.aggregate(pipeline);
  const updatedHotels = await attachFavoriteFlag(hotels, userId);
  return updatedHotels;
};
var getRankedHotels = async (rank, page = 1, limit = 10) => {
  try {
    if (!rank || !["A", "B", "C"].includes(rank)) {
      return { items: [], total: 0, page: 1, limit: 10, hasMore: false };
    }
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Number(limit) || 10);
    const skip = (pageNum - 1) * limitNum;
    const filter = {
      rank,
      isActive: true,
      verificationStatus: "verified"
    };
    const total = await hotel_model_default.countDocuments(filter);
    if (total === 0) {
      return { items: [], total: 0, page: pageNum, limit: limitNum, hasMore: false };
    }
    const hotels = await hotel_model_default.find(filter).select("name city address images advertisementImage rating numReviews isFeatured").sort({ isFeatured: -1, rating: -1, createdAt: -1 }).skip(skip).limit(limitNum).lean();
    const items = hotels.map((hotel) => ({
      _id: hotel._id,
      name: hotel.name,
      city: hotel.address?.city || hotel.city,
      rating: hotel.rating,
      numReviews: hotel.numReviews,
      image: hotel.advertisementImage?.url || hotel.images?.[0]?.url || null
    }));
    return {
      items,
      total,
      page: pageNum,
      limit: limitNum,
      hasMore: skip + limitNum < total
    };
  } catch (error) {
    logger_default.error("Service Error: getRankedHotels", error);
    throw error;
  }
};
var HotelService = class {
  async createHotel(vendor, hotelData) {
    return createHotel(vendor, hotelData);
  }
  async getAllHotels(query = {}, userId = null) {
    return getAllHotels(query, userId);
  }
  async getHomeHotels(query = {}, userId = null) {
    return getHomeHotels(query, userId);
  }
  async getHotelDetails(hotelId, userId = null) {
    return getHotelDetails(hotelId, userId);
  }
  async getHotelAvailability(hotelId, checkIn, checkOut, adults, children) {
    return getHotelAvailability(hotelId, checkIn, checkOut, adults, children);
  }
  async updateHotel(hotelId, vendorId, updateData) {
    return updateHotel(hotelId, vendorId, updateData);
  }
  async findNearbyHotels(lng, lat, maxDistance = 5e3) {
    return findNearbyHotels(lng, lat, maxDistance);
  }
  async getSuggestions(query) {
    return getSuggestions(query);
  }
  async searchHotels(query = {}, userId = null) {
    return searchHotels(query, userId);
  }
  async getRankedHotels(rank, page = 1, limit = 10) {
    return getRankedHotels(rank, page, limit);
  }
};
var hotelService = new HotelService();
var hotel_service_default = hotelService;

// src/modules/hotels/hotel.controller.ts
var HotelController = class {
  /**
   * Create or update hotel details for vendor onboarding step 4
   */
  async createHotel(req, res, next) {
    try {
      const userId = req.user?._id;
      const vendor = await vendor_model_default.findOne({ userId });
      if (!vendor) {
        throw new Error("Vendor profile not found");
      }
      const hotel = await hotel_service_default.createHotel(vendor, req.body);
      res.status(200).json({
        success: true,
        message: "Step 4 completed successfully",
        data: {
          currentStep: vendor.currentStep,
          registrationStep: vendor.registrationStep,
          status: vendor.status,
          hotel
        }
      });
    } catch (error) {
      logger_default.error("Controller Error: createHotel", error);
      next(error);
    }
  }
  /**
   * Get all hotels with filtering and pagination support
   */
  async getHotels(req, res, next) {
    try {
      const userId = req.user?._id || null;
      const { hotels, total } = await hotel_service_default.getAllHotels(
        req.query,
        userId
      );
      res.status(200).json({
        success: true,
        count: hotels.length,
        total,
        data: hotels
      });
    } catch (error) {
      logger_default.error("Controller Error: getHotels", error);
      next(error);
    }
  }
  /**
   * Get a single hotel by ID for the details page
   */
  async getHotelDetails(req, res, next) {
    try {
      const userId = req.user?._id || null;
      const hotel = await hotel_service_default.getHotelDetails(
        req.params.id,
        userId
      );
      res.status(200).json({
        success: true,
        data: hotel
      });
    } catch (error) {
      next(error);
    }
  }
  /**
   * Check room availability and calculate prices with taxes
   */
  async getHotelAvailability(req, res, next) {
    try {
      const { checkIn, checkOut, adults, children } = req.query;
      const data = await hotel_service_default.getHotelAvailability(
        req.params.id,
        checkIn,
        checkOut,
        adults ? Number(adults) : void 0,
        children ? Number(children) : void 0
      );
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }
  /**
   * Update hotel details (owner vendor only)
   */
  async updateHotel(req, res, next) {
    try {
      const vendor = await vendor_model_default.findOne({ userId: req.user?._id });
      if (!vendor) throw new Error("Vendor profile not found");
      const hotel = await hotel_service_default.updateHotel(
        req.params.id,
        vendor._id,
        req.body
      );
      res.status(200).json({
        success: true,
        message: "Hotel updated successfully",
        data: hotel
      });
    } catch (error) {
      logger_default.error("Controller Error: updateHotel", error);
      next(error);
    }
  }
  /**
   * Search nearby hotels based on coordinates (Geospatial API)
   */
  async getNearbyHotels(req, res, next) {
    try {
      const { lng, lat, distance } = req.query;
      if (!lng || !lat) {
        throw new Error("Please provide longitude and latitude");
      }
      const userId = req.user?._id;
      const hotels = await hotel_service_default.findNearbyHotels(
        Number(lng),
        Number(lat),
        Number(distance) || 5e3
        // Default 5km
      );
      res.status(200).json({
        success: true,
        count: hotels.length,
        data: hotels
      });
    } catch (error) {
      logger_default.error("Controller Error: getNearbyHotels", error);
      next(error);
    }
  }
  /**
   * Get hotels for home screen
   */
  async getHomeHotels(req, res, next) {
    try {
      const userId = req.user?._id || null;
      const hotels = await hotel_service_default.getHomeHotels(req.query, userId);
      res.status(200).json({
        success: true,
        count: hotels.length,
        data: hotels
      });
    } catch (error) {
      logger_default.error("Controller Error: getHomeHotels", error);
      next(error);
    }
  }
  /**
   * Get auto-suggestions for search
   */
  async getSuggestions(req, res, next) {
    try {
      const { q } = req.query;
      const suggestions = await hotel_service_default.getSuggestions(q);
      res.status(200).json({
        success: true,
        count: suggestions.length,
        data: suggestions
      });
    } catch (error) {
      logger_default.error("Controller Error: getSuggestions", error);
      next(error);
    }
  }
  /**
   * Search hotels in destination
   */
  async searchHotels(req, res, next) {
    try {
      const userId = req.user?._id || null;
      const hotels = await hotel_service_default.searchHotels(req.query, userId);
      res.status(200).json({
        success: true,
        count: hotels.length,
        data: hotels
      });
    } catch (err) {
      next(err);
    }
  }
  /**
   * Get ranked hotels for banner slideshows
   */
  async getRankedHotels(req, res, next) {
    try {
      const { rank, page, limit } = req.query;
      const result = await hotel_service_default.getRankedHotels(
        rank,
        page ? Number(page) : 1,
        limit ? Number(limit) : 10
      );
      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      logger_default.error("Controller Error: getRankedHotels", error);
      next(error);
    }
  }
};
var hotelController = new HotelController();
var createHotel2 = hotelController.createHotel.bind(hotelController);
var getHotels = hotelController.getHotels.bind(hotelController);
var getHotelDetails2 = hotelController.getHotelDetails.bind(hotelController);
var getHotelAvailability2 = hotelController.getHotelAvailability.bind(hotelController);
var updateHotel2 = hotelController.updateHotel.bind(hotelController);
var getNearbyHotels = hotelController.getNearbyHotels.bind(hotelController);
var getHomeHotels2 = hotelController.getHomeHotels.bind(hotelController);
var getSuggestions2 = hotelController.getSuggestions.bind(hotelController);
var searchHotels2 = hotelController.searchHotels.bind(hotelController);
var getRankedHotels2 = hotelController.getRankedHotels.bind(hotelController);

// src/modules/hotels/hotel.routes.ts
var router3 = (0, import_express3.Router)();
var hotelController2 = new HotelController();
router3.get("/", optionalProtect, hotelController2.getHotels);
router3.get("/home", optionalProtect, hotelController2.getHomeHotels);
router3.get("/suggestions", hotelController2.getSuggestions);
router3.get("/search", optionalProtect, hotelController2.searchHotels);
router3.get("/nearby", hotelController2.getNearbyHotels);
router3.get("/ranked", hotelController2.getRankedHotels);
router3.get("/:id", optionalProtect, hotelController2.getHotelDetails);
router3.get("/:id/availability", hotelController2.getHotelAvailability);
var hotel_routes_default = router3;

// src/modules/rooms/room.routes.ts
var import_express4 = require("express");

// src/modules/rooms/room.model.ts
var import_mongoose13 = __toESM(require("mongoose"), 1);
var roomSchema = new import_mongoose13.Schema(
  {
    hotelId: {
      type: import_mongoose13.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true
    },
    roomTypeId: {
      type: import_mongoose13.Schema.Types.ObjectId,
      ref: "RoomType",
      required: true
    },
    roomNumber: {
      type: String,
      required: true
    },
    floor: Number,
    status: {
      type: String,
      enum: ["available", "occupied", "maintenance"],
      default: "available"
    },
    accessibility: {
      wheelchairAccessible: Boolean,
      grabBars: Boolean
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);
var Room = import_mongoose13.default.model("Room", roomSchema);
var room_model_default = Room;

// src/modules/rooms/room.service.ts
var import_mongoose14 = __toESM(require("mongoose"), 1);
var createRoom = async (roomData) => {
  try {
    return await room_model_default.create(roomData);
  } catch (error) {
    logger_default.error("Service Error: createRoom", error);
    throw error;
  }
};
var getRoomsByHotel = async (hotelId) => {
  if (!import_mongoose14.default.Types.ObjectId.isValid(hotelId)) {
    throw new Error("Invalid hotel id");
  }
  try {
    return await room_model_default.find({ hotelId, isActive: true }).populate("roomTypeId", "name").lean();
  } catch (error) {
    logger_default.error("Service Error: getRoomsByHotel", error);
    throw error;
  }
};
var getRoomById = async (id) => {
  try {
    const room = await room_model_default.findById(id).lean();
    if (!room) throw new Error("Room not found");
    return room;
  } catch (error) {
    logger_default.error("Service Error: getRoomById", error);
    throw error;
  }
};
var updateRoomStatus = async (roomId, updateData) => {
  try {
    const room = await room_model_default.findByIdAndUpdate(roomId, updateData, {
      new: true,
      runValidators: true
    });
    if (!room) throw new Error("Room not found");
    return room;
  } catch (error) {
    logger_default.error("Service Error: updateRoomStatus", error);
    throw error;
  }
};
var RoomService = class {
  async createRoom(roomData) {
    return createRoom(roomData);
  }
  async getRoomsByHotel(hotelId) {
    return getRoomsByHotel(hotelId);
  }
  async getRoomById(id) {
    return getRoomById(id);
  }
  async updateRoomStatus(roomId, updateData) {
    return updateRoomStatus(roomId, updateData);
  }
};
var roomService = new RoomService();
var room_service_default = roomService;

// src/modules/rooms/room.controller.ts
var RoomController = class {
  async createRoom(req, res, next) {
    try {
      const vendor = await vendor_model_default.findOne({ userId: req.user._id });
      if (!vendor) throw new Error("Vendor profile not found");
      const hotel = await hotel_model_default.findOne({
        _id: req.body.hotelId,
        vendorId: vendor._id
      });
      if (!hotel) throw new Error("Unauthorized hotel access");
      const room = await room_service_default.createRoom(req.body);
      res.status(201).json({
        success: true,
        message: "Room created successfully",
        data: room
      });
    } catch (error) {
      logger_default.error("Controller Error: createRoom", error);
      next(error);
    }
  }
  async getRoomsByHotel(req, res, next) {
    try {
      const rooms = await room_service_default.getRoomsByHotel(req.params.hotelId);
      res.status(200).json({
        success: true,
        count: rooms.length,
        data: rooms
      });
    } catch (error) {
      logger_default.error("Controller Error: getRoomsByHotel", error);
      next(error);
    }
  }
  async updateRoomStatus(req, res, next) {
    try {
      const room = await room_service_default.updateRoomStatus(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: "Room updated successfully",
        data: room
      });
    } catch (error) {
      logger_default.error("Controller Error: updateRoomStatus", error);
      next(error);
    }
  }
};

// src/shared/middlewares/roleMiddleware.ts
var authorize = (...roles) => {
  return (req, res, next) => {
    const authReq = req;
    const userRole = authReq.user?.role;
    if (!userRole || !roles.includes(userRole)) {
      res.status(403).json({
        message: `Role (${userRole || "unknown"}) is not allowed to access this resource`
      });
      return;
    }
    next();
  };
};

// src/modules/rooms/room.routes.ts
var router4 = (0, import_express4.Router)();
var roomController = new RoomController();
router4.use(protect);
router4.post("/", authorize("vendor"), roomController.createRoom);
router4.get(
  "/hotel/:hotelId",
  authorize("vendor"),
  roomController.getRoomsByHotel
);
router4.patch("/:id", authorize("vendor"), roomController.updateRoomStatus);
var room_routes_default = router4;

// src/modules/rooms/roomType.routes.ts
var import_express5 = require("express");

// src/modules/rooms/roomType.controller.ts
var import_mongoose17 = __toESM(require("mongoose"), 1);

// src/modules/rooms/roomType.service.ts
var import_mongoose16 = __toESM(require("mongoose"), 1);

// src/modules/bookings/booking.model.ts
var import_mongoose15 = __toESM(require("mongoose"), 1);
var bookingSchema = new import_mongoose15.Schema(
  {
    userId: {
      type: import_mongoose15.Schema.Types.ObjectId,
      ref: "User"
    },
    hotelId: {
      type: import_mongoose15.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true
    },
    roomTypeId: {
      type: import_mongoose15.Schema.Types.ObjectId,
      ref: "RoomType",
      required: true
    },
    bookingReference: {
      type: String,
      unique: true,
      required: true
    },
    checkIn: {
      type: Date,
      required: true
    },
    checkOut: {
      type: Date,
      required: true
    },
    nights: {
      type: Number,
      required: true
    },
    primaryGuest: {
      firstName: {
        type: String,
        required: true,
        trim: true
      },
      lastName: {
        type: String,
        required: true,
        trim: true
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
      },
      phoneNumber: {
        type: String,
        required: true,
        trim: true
      }
    },
    additionalGuests: {
      type: [
        {
          firstName: {
            type: String,
            required: true,
            trim: true
          },
          lastName: {
            type: String,
            required: true,
            trim: true
          }
        }
      ],
      default: []
    },
    guests: {
      adults: { type: Number, required: true },
      children: { type: Number, default: 0 }
    },
    roomsBooked: {
      type: Number,
      default: 1
    },
    pricePerNight: {
      type: Number,
      required: true
    },
    taxAmount: {
      type: Number,
      default: 0
    },
    cleaningFee: {
      type: Number,
      default: 0
    },
    discountAmount: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "checked_in",
        "staying",
        "checked_out",
        "completed",
        "cancellation_requested",
        "cancelled"
      ],
      default: "pending",
      index: true
    },
    roomNumber: {
      type: String,
      default: ""
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending"
    },
    paymentId: {
      type: import_mongoose15.Schema.Types.ObjectId,
      ref: "Payment"
    },
    refundPercentage: {
      type: Number,
      default: 0
    },
    refundAmount: {
      type: Number,
      default: 0
    },
    refundStatus: {
      type: String,
      enum: [
        "none",
        "pending",
        //waiting for admin approval
        "approved",
        "rejected",
        "processed"
      ],
      default: "none"
    },
    refundRequestedAt: Date,
    refundProcessedAt: Date,
    cancelledAt: Date,
    cancellationReason: {
      type: String,
      trim: true
    },
    actualCheckInAt: Date,
    actualCheckOutAt: Date,
    specialRequest: {
      type: String,
      trim: true
    },
    expiresAt: {
      type: Date,
      index: { expires: "0s" }
    }
  },
  { timestamps: true }
);
bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ hotelId: 1, checkIn: 1 });
bookingSchema.index({
  roomTypeId: 1,
  checkIn: 1,
  checkOut: 1,
  status: 1
});
var Booking = import_mongoose15.default.model("Booking", bookingSchema);
var booking_model_default = Booking;

// src/modules/rooms/roomType.service.ts
init_availability_model();
var createRoomType = async (data) => {
  try {
    return await roomType_model_default.create(data);
  } catch (error) {
    logger_default.error("Service Error: createRoomType", error);
    throw error;
  }
};
var getRoomTypesByHotel = async (hotelId) => {
  if (!import_mongoose16.default.Types.ObjectId.isValid(hotelId)) {
    throw new Error("Invalid hotel id");
  }
  try {
    return await roomType_model_default.find({
      hotelId,
      isActive: true
    }).lean();
  } catch (error) {
    logger_default.error("Service Error: getRoomTypesByHotel", error);
    throw error;
  }
};
var updateRoomType = async (roomTypeId, hotelId, updateData) => {
  try {
    const existingRoomType = await roomType_model_default.findOne({
      _id: roomTypeId,
      hotelId
    });
    if (!existingRoomType)
      throw new Error("Room type not found or unauthorized");
    if (updateData.images && Array.isArray(updateData.images)) {
      if (existingRoomType.images && existingRoomType.images.length > 0) {
        const remainingPublicIds = new Set(
          updateData.images.map((img) => img.public_id).filter(Boolean)
        );
        for (const img of existingRoomType.images) {
          if (img.public_id && !remainingPublicIds.has(img.public_id)) {
            try {
              await cloudinary_default.uploader.destroy(img.public_id, {
                resource_type: img.resource_type || "image"
              });
            } catch (destroyErr) {
              logger_default.warn("Could not delete removed room image", destroyErr);
            }
          }
        }
      }
    }
    const updatedRoomType = await roomType_model_default.findOneAndUpdate(
      { _id: roomTypeId, hotelId },
      updateData,
      { new: true, runValidators: true }
    );
    return updatedRoomType;
  } catch (error) {
    logger_default.error("Service Error: updateRoomType", error);
    throw error;
  }
};
var getVendorBookingDetail = async (bookingId, vendorId) => {
  if (!import_mongoose16.default.Types.ObjectId.isValid(bookingId)) {
    throw new Error("Invalid booking id");
  }
  const hotels = await hotel_model_default.find({ vendorId }, "_id").lean();
  const hotelIds = hotels.map((h) => h._id);
  const booking = await booking_model_default.findOne({
    _id: bookingId,
    hotelId: { $in: hotelIds }
  }).select(
    `
      bookingReference
      primaryGuest
      guests
      roomTypeId
      roomNumber
      checkIn
      checkOut
      nights
      specialRequest
      status
      pricePerNight
      taxAmount
      cleaningFee
      discountAmount
      totalAmount
      paymentStatus
      `
  ).populate("roomTypeId", "name images").lean();
  if (!booking) {
    throw new Error("Booking not found or unauthorized");
  }
  const populatedRoomType = booking.roomTypeId;
  return {
    bookingReference: booking.bookingReference,
    status: booking.status,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    nights: booking.nights,
    guests: booking.guests,
    specialRequest: booking.specialRequest || null,
    primaryGuest: {
      firstName: booking.primaryGuest?.firstName,
      lastName: booking.primaryGuest?.lastName,
      email: booking.primaryGuest?.email,
      phoneNumber: booking.primaryGuest?.phoneNumber
    },
    room: {
      roomType: populatedRoomType?.name || null,
      roomNumber: booking.roomNumber,
      image: populatedRoomType?.images?.[0]?.url || null
    },
    priceSummary: {
      pricePerNight: booking.pricePerNight,
      taxAmount: booking.taxAmount,
      cleaningFee: booking.cleaningFee,
      discountAmount: booking.discountAmount,
      totalAmount: booking.totalAmount,
      paymentStatus: booking.paymentStatus
    }
  };
};
var getVendorRoomTypes = async (vendorId, queryParams = {}) => {
  const {
    hotelId,
    page = 1,
    limit = 10,
    search
  } = queryParams;
  if (!hotelId || !import_mongoose16.default.Types.ObjectId.isValid(hotelId)) {
    throw new Error("Valid hotelId is required");
  }
  const hotel = await hotel_model_default.findOne({ _id: hotelId, vendorId }).lean();
  if (!hotel) {
    throw new Error("Unauthorized hotel access");
  }
  const skip = (Number(page) - 1) * Number(limit);
  const filter = { hotelId };
  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }
  const roomTypes = await roomType_model_default.find(filter).select(
    "name basePrice discountPrice capacity roomSizeSqm beds totalRooms images amenities description viewType isActive"
  ).sort("-createdAt").skip(skip).limit(Number(limit)).lean();
  const total = await roomType_model_default.countDocuments(filter);
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  const availabilityData = await availability_model_default.aggregate([
    {
      $match: {
        roomTypeId: { $in: roomTypes.map((r) => r._id) },
        date: today
      }
    },
    {
      $group: {
        _id: "$roomTypeId",
        booked: { $sum: "$bookedRooms" },
        blocked: { $sum: "$blockedRooms" }
      }
    }
  ]);
  const availabilityMap = {};
  availabilityData.forEach((a) => {
    availabilityMap[a._id.toString()] = a;
  });
  const formatted = roomTypes.map((rt) => {
    const availability = availabilityMap[rt._id.toString()];
    const booked = availability?.booked || 0;
    const blocked = availability?.blocked || 0;
    const available = rt.totalRooms - booked - blocked;
    const discountPrice = rt.discountPrice || 0;
    const basePrice = rt.basePrice || 0;
    return {
      id: rt._id,
      name: rt.name,
      description: rt.description || "",
      basePrice,
      discountPrice,
      effectivePrice: discountPrice > 0 ? discountPrice : basePrice,
      price: discountPrice > 0 ? discountPrice : basePrice,
      capacity: rt.capacity,
      roomSizeSqm: rt.roomSizeSqm,
      beds: rt.beds || [],
      totalRooms: rt.totalRooms,
      availableRooms: available,
      status: available > 0 ? "available" : "occupied",
      isActive: rt.isActive !== false,
      viewType: rt.viewType || "none",
      amenities: rt.amenities || [],
      images: rt.images || [],
      image: rt.images?.[0]?.url || null
    };
  });
  return {
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    count: formatted.length,
    data: formatted
  };
};
var getVendorRoomTypeDetail = async (roomTypeId, vendorId) => {
  if (!import_mongoose16.default.Types.ObjectId.isValid(roomTypeId)) {
    throw new Error("Invalid roomType id");
  }
  const roomType = await roomType_model_default.findById(roomTypeId).select(
    `
      hotelId
      name
      description
      basePrice
      discountPrice
      capacity
      beds
      roomSizeSqm
      amenities
      images
      totalRooms
      `
  ).lean();
  if (!roomType) {
    throw new Error("Room type not found");
  }
  const hotel = await hotel_model_default.findOne({
    _id: roomType.hotelId,
    vendorId
  }).lean();
  if (!hotel) {
    throw new Error("Unauthorized access");
  }
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  const availability = await availability_model_default.findOne({
    roomTypeId,
    date: today
  }).lean();
  const booked = availability?.bookedRooms || 0;
  const blocked = availability?.blockedRooms || 0;
  const available = roomType.totalRooms - booked - blocked;
  const discountPrice = roomType.discountPrice || 0;
  const basePrice = roomType.basePrice || 0;
  return {
    id: roomType._id,
    name: roomType.name,
    description: roomType.description,
    price: discountPrice > 0 ? discountPrice : basePrice,
    basePrice,
    discountPrice,
    capacity: roomType.capacity,
    beds: roomType.beds,
    roomSizeSqm: roomType.roomSizeSqm,
    totalRooms: roomType.totalRooms,
    availableRooms: available,
    occupiedRooms: booked,
    status: available > 0 ? "available" : "occupied",
    amenities: roomType.amenities,
    images: roomType.images || []
  };
};
var deleteRoomType = async (roomTypeId, vendorId) => {
  const roomType = await roomType_model_default.findById(roomTypeId);
  if (!roomType) throw new Error("Room type not found");
  const hotel = await hotel_model_default.findOne({ _id: roomType.hotelId, vendorId });
  if (!hotel) throw new Error("Unauthorized room type access");
  if (roomType.images && roomType.images.length > 0) {
    for (const img of roomType.images) {
      if (img.public_id) {
        await cloudinary_default.uploader.destroy(img.public_id, {
          resource_type: img.resource_type || "image"
        });
      }
    }
  }
  await room_model_default.deleteMany({ roomTypeId });
  await availability_model_default.deleteMany({ roomTypeId });
  await roomType_model_default.findByIdAndDelete(roomTypeId);
};
var RoomTypeService = class {
  async createRoomType(data) {
    return createRoomType(data);
  }
  async getRoomTypesByHotel(hotelId) {
    return getRoomTypesByHotel(hotelId);
  }
  async updateRoomType(roomTypeId, hotelId, updateData) {
    return updateRoomType(roomTypeId, hotelId, updateData);
  }
  async getVendorBookingDetail(bookingId, vendorId) {
    return getVendorBookingDetail(bookingId, vendorId);
  }
  async getVendorRoomTypes(vendorId, queryParams = {}) {
    return getVendorRoomTypes(vendorId, queryParams);
  }
  async getVendorRoomTypeDetail(roomTypeId, vendorId) {
    return getVendorRoomTypeDetail(roomTypeId, vendorId);
  }
  async deleteRoomType(roomTypeId, vendorId) {
    return deleteRoomType(roomTypeId, vendorId);
  }
};
var roomTypeService = new RoomTypeService();
var roomType_service_default = roomTypeService;

// src/modules/rooms/roomType.controller.ts
var RoomTypeController = class {
  async createRoomType(req, res, next) {
    try {
      const vendor = await vendor_model_default.findOne({ userId: req.user._id });
      if (!vendor) throw new Error("Vendor profile not found");
      const hotel = await hotel_model_default.findOne({
        _id: req.body.hotelId,
        vendorId: vendor._id
      });
      if (!hotel) throw new Error("Unauthorized hotel access");
      const roomType = await roomType_service_default.createRoomType(req.body);
      res.status(201).json({
        success: true,
        message: "Room type created successfully",
        data: roomType
      });
    } catch (error) {
      logger_default.error("Controller Error: createRoomType", error);
      next(error);
    }
  }
  //roomtype create also rooms create
  async createRoomTypeWithAutoRooms(req, res, next) {
    const session = await import_mongoose17.default.startSession();
    session.startTransaction();
    try {
      const vendor = await vendor_model_default.findOne({ userId: req.user._id });
      if (!vendor) throw new Error("Vendor profile not found");
      const hotel = await hotel_model_default.findOne({
        _id: req.body.hotelId,
        vendorId: vendor._id
      });
      if (!hotel) throw new Error("Unauthorized hotel access");
      const { totalRooms, ...roomTypeData } = req.body;
      if (!totalRooms || totalRooms < 1) {
        throw new Error("totalRooms must be at least 1");
      }
      roomTypeData.totalRooms = totalRooms;
      const roomType = new roomType_model_default(roomTypeData);
      await roomType.save({ session });
      const rooms = [];
      for (let i = 1; i <= totalRooms; i++) {
        rooms.push({
          hotelId: roomTypeData.hotelId,
          roomTypeId: roomType._id,
          roomNumber: (100 + i).toString(),
          floor: Math.ceil(i / 10)
        });
      }
      await room_model_default.insertMany(rooms, { session });
      await hotel_model_default.findByIdAndUpdate(
        hotel._id,
        {
          isActive: true,
          isFeatured: true
        },
        { session, new: true }
      );
      await session.commitTransaction();
      session.endSession();
      res.status(201).json({
        success: true,
        message: "RoomType + Auto Rooms created successfully",
        data: {
          roomType,
          roomsCreated: rooms.length
        }
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  }
  async getRoomTypesByHotel(req, res, next) {
    try {
      const roomTypes = await roomType_service_default.getRoomTypesByHotel(
        req.params.hotelId
      );
      res.status(200).json({
        success: true,
        count: roomTypes.length,
        data: roomTypes
      });
    } catch (error) {
      logger_default.error("Controller Error: getRoomTypesByHotel", error);
      next(error);
    }
  }
  async updateRoomType(req, res, next) {
    try {
      const vendor = await vendor_model_default.findOne({ userId: req.user._id });
      if (!vendor) throw new Error("Vendor profile not found");
      const roomType = await roomType_service_default.updateRoomType(
        req.params.id,
        req.body.hotelId,
        req.body
      );
      res.status(200).json({
        success: true,
        message: "Room type updated successfully",
        data: roomType
      });
    } catch (error) {
      logger_default.error("Controller Error: updateRoomType", error);
      next(error);
    }
  }
  async deleteRoomType(req, res, next) {
    try {
      const vendor = await vendor_model_default.findOne({ userId: req.user._id });
      if (!vendor) throw new Error("Vendor profile not found");
      await roomType_service_default.deleteRoomType(req.params.id, vendor._id);
      res.status(200).json({
        success: true,
        message: "Room type deleted successfully"
      });
    } catch (error) {
      logger_default.error("Controller Error: deleteRoomType", error);
      next(error);
    }
  }
};

// src/modules/rooms/roomType.routes.ts
var router5 = (0, import_express5.Router)();
var controller = new RoomTypeController();
router5.use(protect);
router5.post("/", authorize("vendor"), controller.createRoomType);
router5.post(
  "/auto",
  authorize("vendor"),
  controller.createRoomTypeWithAutoRooms
);
router5.patch("/:id", authorize("vendor"), controller.updateRoomType);
router5.delete("/:id", authorize("vendor"), controller.deleteRoomType);
var roomType_routes_default = router5;

// src/modules/availability/availability.routes.ts
var import_express6 = require("express");

// src/modules/availability/availability.service.ts
var import_mongoose18 = __toESM(require("mongoose"), 1);
init_availability_model();
var upsertAvailability = async (data) => {
  try {
    const { roomTypeId, date, availableRooms, priceOverride } = data;
    return await availability_model_default.findOneAndUpdate(
      { roomTypeId, date },
      {
        $set: {
          availableRooms,
          ...priceOverride !== void 0 && { priceOverride }
        }
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );
  } catch (error) {
    logger_default.error("Service Error: upsertAvailability", error);
    throw error;
  }
};
var getAvailabilityForRange = async (roomTypeId, startDate, endDate) => {
  if (!import_mongoose18.default.Types.ObjectId.isValid(roomTypeId)) {
    throw new Error("Invalid roomType id");
  }
  try {
    return await availability_model_default.find({
      roomTypeId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).lean();
  } catch (error) {
    logger_default.error("Service Error: getAvailabilityForRange", error);
    throw error;
  }
};
var decreaseAvailability = async (roomTypeId, date, qty = 1) => {
  try {
    const result = await availability_model_default.findOneAndUpdate(
      {
        roomTypeId,
        date,
        availableRooms: { $gte: qty }
      },
      {
        $inc: { availableRooms: -qty }
      },
      { new: true }
    );
    if (!result) {
      throw new Error("Rooms not available for selected date");
    }
    return result;
  } catch (error) {
    logger_default.error("Service Error: decreaseAvailability", error);
    throw error;
  }
};
var getVendorRoomTypes2 = async (userId, hotelId) => {
  try {
    if (!import_mongoose18.default.Types.ObjectId.isValid(hotelId)) {
      throw new Error("Invalid hotel ID");
    }
    const vendor = await vendor_model_default.findOne({ userId }).lean();
    if (!vendor) {
      throw new Error("Vendor not found");
    }
    const hotel = await hotel_model_default.findOne({
      _id: hotelId,
      vendorId: vendor._id,
      isActive: true
    }).lean();
    if (!hotel) {
      throw new Error("Hotel not found or not authorized");
    }
    const roomTypes = await roomType_model_default.find({
      hotelId,
      isActive: true
    }).select("_id name basePrice discountPrice totalRooms").sort({ createdAt: 1 }).lean();
    return roomTypes;
  } catch (error) {
    logger_default.error("Service Error: getVendorRoomTypes", error);
    throw error;
  }
};
var getRoomTypeCalendar = async (userId, roomTypeId, month, year) => {
  try {
    if (!import_mongoose18.default.Types.ObjectId.isValid(roomTypeId)) {
      throw new Error("Invalid room type ID");
    }
    if (!month || !year) {
      throw new Error("Month and year are required");
    }
    const vendor = await vendor_model_default.findOne({ userId }).lean();
    if (!vendor) {
      throw new Error("Vendor not found");
    }
    const roomType = await roomType_model_default.findById(roomTypeId).lean();
    if (!roomType || !roomType.isActive) {
      throw new Error("Room type not found");
    }
    const hotel = await hotel_model_default.findOne({
      _id: roomType.hotelId,
      vendorId: vendor._id,
      isActive: true
    }).lean();
    if (!hotel) {
      throw new Error("Not authorized");
    }
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 1));
    const availabilityDocs = await availability_model_default.find({
      roomTypeId,
      date: { $gte: startDate, $lt: endDate }
    }).lean();
    const availabilityMap = {};
    for (const doc of availabilityDocs) {
      const d = new Date(doc.date);
      const dateStr = d.toISOString().split("T")[0];
      availabilityMap[dateStr] = doc;
    }
    const daysInMonth = new Date(year, month, 0).getDate();
    const calendar = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(Date.UTC(year, month - 1, day));
      const dateStr = currentDate.toISOString().split("T")[0];
      const dayData = availabilityMap[dateStr];
      const bookedRooms = dayData?.bookedRooms || 0;
      const blockedRooms = dayData?.blockedRooms || 0;
      const availableRooms = roomType.totalRooms - bookedRooms - blockedRooms;
      const price = dayData?.priceOverride ?? (roomType.discountPrice && roomType.discountPrice > 0 ? roomType.discountPrice : roomType.basePrice);
      calendar.push({
        date: dateStr,
        availableRooms: Math.max(availableRooms, 0),
        bookedRooms,
        blockedRooms,
        price
      });
    }
    return {
      roomTypeId,
      roomName: roomType.name,
      totalRooms: roomType.totalRooms,
      calendar
    };
  } catch (error) {
    logger_default.error("Service Error: getRoomTypeCalendar", error);
    throw error;
  }
};
var updateRoomTypeCalendar = async (userId, roomTypeId, date, blockedRooms, priceOverride) => {
  try {
    if (!import_mongoose18.default.Types.ObjectId.isValid(roomTypeId)) {
      throw new Error("Invalid room type ID");
    }
    if (!date) throw new Error("Date is required");
    const vendor = await vendor_model_default.findOne({ userId });
    if (!vendor) {
      throw new Error("Vendor not found");
    }
    const roomType = await roomType_model_default.findById(roomTypeId);
    if (!roomType || !roomType.isActive) {
      throw new Error("Room type not found");
    }
    const hotel = await hotel_model_default.findOne({
      _id: roomType.hotelId,
      vendorId: vendor._id,
      isActive: true
    });
    if (!hotel) {
      throw new Error("Not authorized");
    }
    const parsedDate = new Date(date);
    const start = new Date(
      Date.UTC(
        parsedDate.getFullYear(),
        parsedDate.getMonth(),
        parsedDate.getDate(),
        0,
        0,
        0,
        0
      )
    );
    const end = new Date(
      Date.UTC(
        parsedDate.getFullYear(),
        parsedDate.getMonth(),
        parsedDate.getDate(),
        23,
        59,
        59,
        999
      )
    );
    if (isNaN(start.getTime())) {
      throw new Error("Invalid date");
    }
    if (blockedRooms !== void 0) {
      if (blockedRooms < 0 || blockedRooms > roomType.totalRooms) {
        throw new Error("Invalid blocked rooms value");
      }
    }
    const updateData = {};
    if (blockedRooms !== void 0) {
      updateData.blockedRooms = blockedRooms;
    }
    if (priceOverride !== void 0) {
      updateData.priceOverride = priceOverride;
    }
    const availability = await availability_model_default.findOneAndUpdate(
      {
        roomTypeId,
        date: { $gte: start, $lte: end }
      },
      {
        $set: updateData,
        $setOnInsert: {
          roomTypeId,
          date: start,
          bookedRooms: 0
        }
      },
      {
        new: true,
        upsert: true
      }
    );
    const availableRooms = roomType.totalRooms - (availability.bookedRooms || 0) - (availability.blockedRooms || 0);
    const price = availability.priceOverride ?? (roomType.discountPrice && roomType.discountPrice > 0 ? roomType.discountPrice : roomType.basePrice);
    return {
      date: start.toISOString().split("T")[0],
      availableRooms: Math.max(availableRooms, 0),
      bookedRooms: availability.bookedRooms || 0,
      blockedRooms: availability.blockedRooms || 0,
      price
    };
  } catch (error) {
    logger_default.error("Service Error: updateRoomTypeCalendar", error);
    throw error;
  }
};
var resetRoomTypeCalendar = async (vendorId, roomTypeId, date) => {
  try {
    if (!date) {
      throw new Error("Date is required");
    }
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    if (isNaN(targetDate.getTime())) {
      throw new Error("Invalid date");
    }
    const roomType = await roomType_model_default.findById(roomTypeId);
    if (!roomType || !roomType.isActive) {
      throw new Error("Room type not found");
    }
    const hotel = await hotel_model_default.findOne({
      _id: roomType.hotelId,
      vendorId,
      isActive: true
    });
    if (!hotel) {
      throw new Error("Not authorized");
    }
    await availability_model_default.deleteOne({
      roomTypeId,
      date: targetDate
    });
    const price = roomType.discountPrice && roomType.discountPrice > 0 ? roomType.discountPrice : roomType.basePrice;
    return {
      date: targetDate.toISOString().split("T")[0],
      availableRooms: roomType.totalRooms,
      bookedRooms: 0,
      blockedRooms: 0,
      price
    };
  } catch (error) {
    logger_default.error("Service Error: resetRoomTypeCalendar", error);
    throw error;
  }
};
var AvailabilityService = class {
  async upsertAvailability(data) {
    return upsertAvailability(data);
  }
  async getAvailabilityForRange(roomTypeId, startDate, endDate) {
    return getAvailabilityForRange(roomTypeId, startDate, endDate);
  }
  async decreaseAvailability(roomTypeId, date, qty = 1) {
    return decreaseAvailability(roomTypeId, date, qty);
  }
  async getVendorRoomTypes(userId, hotelId) {
    return getVendorRoomTypes2(userId, hotelId);
  }
  async getRoomTypeCalendar(userId, roomTypeId, month, year) {
    return getRoomTypeCalendar(userId, roomTypeId, month, year);
  }
  async updateRoomTypeCalendar(userId, roomTypeId, date, blockedRooms, priceOverride) {
    return updateRoomTypeCalendar(
      userId,
      roomTypeId,
      date,
      blockedRooms,
      priceOverride
    );
  }
  async resetRoomTypeCalendar(vendorId, roomTypeId, date) {
    return resetRoomTypeCalendar(vendorId, roomTypeId, date);
  }
};
var availabilityService = new AvailabilityService();
var availability_service_default = availabilityService;

// src/modules/availability/availability.controller.ts
var AvailabilityController = class {
  //Vendor: Set availability for a date
  async setAvailability(req, res, next) {
    try {
      const vendor = await vendor_model_default.findOne({ userId: req.user._id });
      if (!vendor) throw new Error("Vendor profile not found");
      const roomType = await roomType_model_default.findById(req.body.roomTypeId);
      if (!roomType) throw new Error("Room type not found");
      const hotel = await hotel_model_default.findOne({
        _id: roomType.hotelId,
        vendorId: vendor._id
      });
      if (!hotel) throw new Error("Unauthorized hotel access");
      const availability = await availability_service_default.upsertAvailability(req.body);
      res.status(200).json({
        success: true,
        message: "Availability updated",
        data: availability
      });
    } catch (error) {
      logger_default.error("Controller Error: setAvailability", error);
      next(error);
    }
  }
  //User: Get availability calendar
  async getAvailability(req, res, next) {
    try {
      const { roomTypeId, startDate, endDate } = req.query;
      if (!roomTypeId || !startDate || !endDate) {
        throw new Error("roomTypeId, startDate and endDate are required");
      }
      const availability = await availability_service_default.getAvailabilityForRange(
        roomTypeId,
        startDate,
        endDate
      );
      res.status(200).json({
        success: true,
        count: availability.length,
        data: availability
      });
    } catch (error) {
      logger_default.error("Controller Error: getAvailability", error);
      next(error);
    }
  }
  //Get vendor room types
  async getVendorRoomTypes(req, res, next) {
    try {
      const userId = req.user._id;
      const { hotelId } = req.params;
      const roomTypes = await availability_service_default.getVendorRoomTypes(
        userId,
        hotelId
      );
      res.status(200).json({
        success: true,
        count: roomTypes.length,
        data: roomTypes
      });
    } catch (error) {
      logger_default.error("Controller Error: getVendorRoomTypes", error);
      next(error);
    }
  }
  //room tpye calender data return
  async getRoomTypeCalendar(req, res, next) {
    try {
      const userId = req.user._id;
      const { roomTypeId } = req.params;
      const { month, year } = req.query;
      const now = /* @__PURE__ */ new Date();
      const targetMonth = month ? Number(month) : now.getMonth() + 1;
      const targetYear = year ? Number(year) : now.getFullYear();
      const calendar = await availability_service_default.getRoomTypeCalendar(
        userId,
        roomTypeId,
        targetMonth,
        targetYear
      );
      res.status(200).json({
        success: true,
        data: calendar
      });
    } catch (error) {
      logger_default.error("Controller Error: getRoomTypeCalendar", error);
      next(error);
    }
  }
  //date and price over-ride for perticular date
  async updateRoomTypeCalendar(req, res, next) {
    try {
      const userId = req.user._id;
      const { roomTypeId } = req.params;
      const { date, blockedRooms, priceOverride } = req.body;
      const result = await availability_service_default.updateRoomTypeCalendar(
        userId,
        roomTypeId,
        date,
        blockedRooms,
        priceOverride
      );
      res.status(200).json({
        success: true,
        message: "Calendar updated successfully",
        data: result
      });
    } catch (error) {
      logger_default.error("Controller Error: updateRoomTypeCalendar", error);
      next(error);
    }
  }
  async resetRoomTypeCalendar(req, res, next) {
    try {
      const vendorId = req.user._id;
      const { roomTypeId } = req.params;
      const { date } = req.body;
      const result = await availability_service_default.resetRoomTypeCalendar(
        vendorId,
        roomTypeId,
        date
      );
      res.status(200).json({
        success: true,
        message: "Calendar override removed",
        data: result
      });
    } catch (error) {
      logger_default.error("Controller Error: resetRoomTypeCalendar", error);
      next(error);
    }
  }
};

// src/modules/availability/availability.routes.ts
var router6 = (0, import_express6.Router)();
var availabilityController = new AvailabilityController();
router6.get("/", availabilityController.getAvailability);
router6.use(protect);
router6.post("/", authorize("vendor"), availabilityController.setAvailability);
router6.get(
  "/:hotelId/room-types",
  protect,
  authorize("vendor"),
  availabilityController.getVendorRoomTypes
);
router6.get(
  "/:roomTypeId/calendar",
  protect,
  authorize("vendor"),
  availabilityController.getRoomTypeCalendar
);
router6.patch(
  "/:roomTypeId/calendar",
  protect,
  authorize("vendor"),
  availabilityController.updateRoomTypeCalendar
);
router6.delete(
  "/:roomTypeId/calendar",
  protect,
  authorize("vendor"),
  availabilityController.resetRoomTypeCalendar
);
var availability_routes_default = router6;

// src/modules/vendors/vendor.routes.ts
var import_express7 = require("express");

// src/modules/bookings/booking.service.ts
init_availability_model();
var import_mongoose21 = __toESM(require("mongoose"), 1);

// trivllo.json
var trivllo_default = {
  company_name: "Trivllo",
  founded: 2026,
  headquarters: {
    city: "Gwalior",
    state: "Madhya Pradesh",
    country: "India"
  },
  industry: "LEHK Technology",
  services: [
    "Custom Software Engineering",
    "Cloud Architecture",
    "API Integration",
    "Performance Optimization"
  ],
  employee_count: 10,
  active_projects: true,
  contact: {
    email: "krashtyagi24@gmail.com",
    website: "https://trivllo.com"
  }
};

// src/modules/payments/payment.model.ts
var import_mongoose19 = __toESM(require("mongoose"), 1);
var paymentSchema = new import_mongoose19.Schema(
  {
    bookingId: {
      type: import_mongoose19.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true
    },
    userId: {
      type: import_mongoose19.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    razorpayOrderId: {
      type: String,
      required: true
    },
    razorpayPaymentId: {
      type: String
    },
    razorpaySignature: {
      type: String
    },
    amountPaid: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: "INR"
    },
    paymentMethod: {
      type: String,
      enum: ["card", "upi", "netbanking", "wallet", "unknown"],
      default: "unknown"
    },
    status: {
      type: String,
      enum: [
        "created",
        "authorized",
        "captured",
        "failed",
        "refunded",
        "partially_refunded"
      ],
      default: "created",
      index: true
    },
    refundAmount: {
      type: Number,
      default: 0
    },
    razorpayRefundId: {
      type: String
    },
    refundStatus: {
      type: String,
      enum: ["none", "initiated", "pending", "processed", "failed"],
      default: "none"
    },
    refundedAt: Date,
    isVerified: {
      type: Boolean,
      default: false
    },
    metadata: {
      type: Object
    },
    expiresAt: {
      type: Date,
      index: { expires: "0s" }
    }
  },
  { timestamps: true }
);
paymentSchema.index({ razorpayPaymentId: 1 });
paymentSchema.index({ razorpayOrderId: 1 });
paymentSchema.index({ bookingId: 1, status: 1 });
var Payment = import_mongoose19.default.model("Payment", paymentSchema);
var payment_model_default = Payment;

// src/shared/config/razorpay.ts
var import_razorpay = __toESM(require("razorpay"), 1);
var razorpay = new import_razorpay.default({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});
var razorpay_default = razorpay;

// src/modules/bookings/booking.service.ts
var import_crypto2 = __toESM(require("crypto"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs2 = __toESM(require("fs"), 1);
var import_pdfkit = __toESM(require("pdfkit"), 1);

// src/modules/multiServiceBookings/booking.model.ts
var import_mongoose20 = __toESM(require("mongoose"), 1);
var participantSchema = new import_mongoose20.Schema(
  {
    name: { type: String, trim: true },
    age: { type: Number },
    gender: {
      type: String,
      enum: ["male", "female", "other"]
    },
    weight: { type: Number }
    // optional (adventure use)
  },
  { _id: false }
);
var bookingSchema2 = new import_mongoose20.Schema(
  {
    userId: {
      type: import_mongoose20.Schema.Types.ObjectId,
      ref: "User",
      index: true
    },
    vendorId: {
      type: import_mongoose20.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true
    },
    serviceType: {
      type: String,
      enum: ["adventure", "cab", "tour", "bike"],
      required: true,
      index: true
    },
    serviceId: {
      type: import_mongoose20.Schema.Types.ObjectId,
      required: true,
      index: true
    },
    bookingReference: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    bookingDate: {
      type: Date,
      required: true,
      index: true
    },
    timeSlot: {
      type: String
      //adventure specific
    },
    // bike & tour specific
    duration: {
      startDate: Date,
      endDate: Date,
      totalDays: Number
    },
    primaryCustomer: {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, trim: true },
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
      },
      phoneNumber: { type: String, required: true, trim: true }
    },
    //Participants (Dynamic)
    participants: {
      type: [participantSchema],
      default: []
    },
    //Dynamic Data
    meta: {
      type: Object,
      default: {}
    },
    extraInfo: {
      type: Object,
      default: {}
    },
    //Pricing Snapshot
    pricing: {
      baseAmount: { type: Number, required: true },
      taxAmount: { type: Number, default: 0 },
      taxPercentage: { type: Number, default: 0 },
      discountAmount: { type: Number, default: 0 },
      totalAmount: { type: Number, required: true }
    },
    serviceSnapshot: {
      title: { type: String },
      type: { type: String },
      price: { type: Number },
      vendorId: { type: import_mongoose20.Schema.Types.ObjectId },
      extra: {
        type: Object,
        default: {}
      }
    },
    // quantity meaning:
    // adventure → participants
    // bike → days
    // tour → people
    // cab → 1
    quantity: {
      type: Number,
      default: 1
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
      index: true
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true
    },
    paymentId: {
      type: import_mongoose20.Schema.Types.ObjectId,
      ref: "Payment"
    },
    refundAmount: {
      type: Number,
      default: 0
    },
    refundStatus: {
      type: String,
      enum: ["none", "pending", "processed", "failed"],
      default: "none"
    },
    specialRequest: {
      type: String,
      trim: true
    },
    cancelledAt: Date,
    cancellationReason: { type: String, trim: true },
    expiresAt: {
      type: Date,
      index: { expires: "0s" }
    }
  },
  { timestamps: true }
);
bookingSchema2.index({ userId: 1, createdAt: -1 });
bookingSchema2.index({ vendorId: 1, createdAt: -1 });
bookingSchema2.index({ serviceId: 1, serviceType: 1 });
bookingSchema2.index({ bookingDate: 1, status: 1 });
bookingSchema2.index({ paymentStatus: 1, status: 1 });
bookingSchema2.index({ bookingReference: 1 });
var GenericBooking = import_mongoose20.default.model("GenericBooking", bookingSchema2);
var booking_model_default2 = GenericBooking;

// src/modules/bookings/booking.service.ts
async function restoreAvailability(booking, session) {
  const currentDate = new Date(booking.checkIn);
  while (currentDate < booking.checkOut) {
    await availability_model_default.findOneAndUpdate(
      {
        roomTypeId: booking.roomTypeId,
        date: new Date(currentDate)
      },
      { $inc: { availableRooms: booking.roomsBooked } },
      { session }
    );
    currentDate.setDate(currentDate.getDate() + 1);
  }
}
async function processRefund(booking, session) {
  const payment = await payment_model_default.findById(booking.paymentId).session(session);
  if (!payment || payment.status !== "captured" || !payment.razorpayPaymentId)
    throw new Error("Payment not eligible for refund");
  const refund = await razorpay_default.payments.refund(payment.razorpayPaymentId, {
    amount: booking.refundAmount * 100
    // Razorpay expects paise
  });
  payment.status = "refunded";
  payment.refundStatus = "processed";
  payment.refundAmount = booking.refundAmount;
  payment.razorpayRefundId = refund.id;
  payment.refundedAt = /* @__PURE__ */ new Date();
  await payment.save({ session });
}
var createBooking = async (data, userId) => {
  const session = await import_mongoose21.default.startSession();
  session.startTransaction();
  try {
    const {
      hotelId,
      roomTypeId,
      checkIn,
      checkOut,
      guests,
      roomsBooked,
      primaryGuest,
      additionalGuests = []
    } = data;
    if (!checkIn || !checkOut)
      throw new Error("Check-in and Check-out dates are required");
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    if (startDate >= endDate)
      throw new Error("Invalid check-in/check-out dates");
    const nights = (endDate.getTime() - startDate.getTime()) / (1e3 * 60 * 60 * 24);
    if (nights <= 0) throw new Error("Invalid booking duration");
    const rooms = roomsBooked && roomsBooked > 0 ? roomsBooked : 1;
    if (!guests?.adults || guests.adults <= 0)
      throw new Error("At least one adult guest is required");
    const safeAdditionalGuests = Array.isArray(additionalGuests) ? additionalGuests : [];
    const userDoc = await auth_model_default.findById(userId).session(session);
    const safePrimaryGuest = {
      firstName: (primaryGuest?.firstName || "").trim() || userDoc?.firstName || "Guest",
      lastName: (primaryGuest?.lastName || "").trim() || userDoc?.lastName || "User",
      email: (primaryGuest?.email || "").trim() || userDoc?.email || "guest@trivllo.com",
      phoneNumber: (primaryGuest?.phoneNumber || "").trim() || userDoc?.phoneNumber || "9999999999"
    };
    const hotel = await hotel_model_default.findById(hotelId).session(session);
    if (!hotel || !hotel.isActive) throw new Error("Hotel not available");
    const roomType = await roomType_model_default.findById(roomTypeId).session(session);
    if (!roomType || !roomType.isActive)
      throw new Error("Room type not available");
    const maxAdults = (roomType.capacity?.adults ?? 2) * rooms;
    if (guests.adults > maxAdults) {
      throw new Error(`Guest count (${guests.adults} adults) exceeds room capacity (${maxAdults} adults)`);
    }
    const taxDoc = await tax_model_default.findOne({ isActive: true }).lean();
    const taxPercentage = taxDoc?.taxPercentage || 0;
    const availabilityDocs = await availability_model_default.find({
      roomTypeId,
      date: { $gte: startDate, $lt: endDate }
    }).session(session);
    const availabilityMap = {};
    for (const doc of availabilityDocs) {
      const dateStr = doc.date.toISOString().split("T")[0];
      availabilityMap[dateStr] = doc;
    }
    let totalBasePrice = 0;
    let firstDayPrice = 0;
    for (let i = 0; i < nights; i++) {
      const currentDate = new Date(startDate.getTime() + i * 864e5);
      const dateStr = currentDate.toISOString().split("T")[0];
      const dayDoc = availabilityMap[dateStr];
      const booked = dayDoc?.bookedRooms || 0;
      const blocked = dayDoc?.blockedRooms || 0;
      const available = roomType.totalRooms - booked - blocked;
      if (available < rooms) {
        throw new Error(
          `Insufficient availability on ${currentDate.toDateString()}`
        );
      }
      const price = dayDoc?.priceOverride ?? ((roomType.discountPrice ?? 0) > 0 ? roomType.discountPrice : roomType.basePrice);
      if (i === 0) firstDayPrice = price;
      totalBasePrice += price * rooms;
    }
    const totalTax = Number(
      (totalBasePrice * taxPercentage / 100).toFixed(2)
    );
    const finalTotalAmount = Number((totalBasePrice + totalTax).toFixed(2));
    const bookingReference = "BK-" + import_crypto2.default.randomBytes(6).toString("hex").toUpperCase();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1e3);
    const [booking] = await booking_model_default.create(
      [
        {
          userId,
          hotelId,
          roomTypeId,
          bookingReference,
          checkIn: startDate,
          checkOut: endDate,
          nights,
          guests,
          roomsBooked: rooms,
          primaryGuest: safePrimaryGuest,
          additionalGuests: safeAdditionalGuests,
          pricePerNight: firstDayPrice,
          taxAmount: totalTax,
          totalAmount: finalTotalAmount,
          status: "pending",
          paymentStatus: "pending",
          expiresAt
        }
      ],
      { session }
    );
    const razorpayOrder = await razorpay_default.orders.create({
      amount: Math.round(finalTotalAmount * 100),
      currency: "INR",
      receipt: bookingReference
    });
    const [payment] = await payment_model_default.create(
      [
        {
          bookingId: booking._id,
          userId,
          razorpayOrderId: razorpayOrder.id,
          amountPaid: finalTotalAmount,
          status: "created",
          expiresAt
        }
      ],
      { session }
    );
    booking.paymentId = payment._id;
    await booking.save({ session });
    await session.commitTransaction();
    session.endSession();
    return {
      booking,
      razorpayOrder
    };
  } catch (err) {
    try {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
    } catch (abortErr) {
      logger_default.error("Error aborting transaction:", abortErr);
    } finally {
      session.endSession();
    }
    logger_default.error("Service Error: createBooking", err);
    throw err;
  }
};
var getUserBookings = async (userId) => {
  try {
    const [hotelBookings, genericBookings] = await Promise.all([
      booking_model_default.find({ userId }).populate({
        path: "hotelId",
        select: "name images"
      }).lean(),
      booking_model_default2.find({ userId }).lean()
    ]);
    const adventureIds = [];
    const bikeIds = [];
    const cabIds = [];
    const tourIds = [];
    genericBookings.forEach((booking) => {
      switch (booking.serviceType) {
        case "adventure":
          adventureIds.push(booking.serviceId);
          break;
        case "bike":
          bikeIds.push(booking.serviceId);
          break;
        case "cab":
          cabIds.push(booking.serviceId);
          break;
        case "tour":
          tourIds.push(booking.serviceId);
          break;
      }
    });
    const [adventureServices, bikeServices, cabServices, tourServices] = await Promise.all([
      adventureIds.length ? adventure_model_default.find({
        _id: { $in: adventureIds }
      }).select("title images").lean() : [],
      bikeIds.length ? bike_model_default.find({
        _id: { $in: bikeIds }
      }).select("title images bikeName").lean() : [],
      cabIds.length ? cab_model_default.find({
        _id: { $in: cabIds }
      }).select("title images carName pickupLocation dropLocation").lean() : [],
      tourIds.length ? tour_model_default.find({
        _id: { $in: tourIds }
      }).select("title images destinations").lean() : []
    ]);
    const adventureMap = new Map(
      adventureServices.map((item) => [item._id.toString(), item])
    );
    const bikeMap = new Map(
      bikeServices.map((item) => [item._id.toString(), item])
    );
    const cabMap = new Map(
      cabServices.map((item) => [item._id.toString(), item])
    );
    const tourMap = new Map(
      tourServices.map((item) => [item._id.toString(), item])
    );
    const formattedGenericBookings = genericBookings.map((booking) => {
      let service = null;
      switch (booking.serviceType) {
        case "adventure":
          service = adventureMap.get(booking.serviceId.toString());
          break;
        case "bike":
          service = bikeMap.get(booking.serviceId.toString());
          break;
        case "cab":
          service = cabMap.get(booking.serviceId.toString());
          break;
        case "tour":
          service = tourMap.get(booking.serviceId.toString());
          break;
      }
      return {
        _id: booking._id,
        bookingReference: booking.bookingReference,
        bookingType: booking.serviceType,
        title: service?.title || booking.serviceSnapshot?.title || "Service",
        thumbnail: service?.images?.[0]?.url || null,
        bookingDate: booking.duration?.startDate || booking.bookingDate,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        totalAmount: booking.pricing?.totalAmount || 0,
        createdAt: booking.createdAt
      };
    });
    const formattedHotelBookings = hotelBookings.map((booking) => ({
      _id: booking._id,
      bookingReference: booking.bookingReference,
      bookingType: "hotel",
      title: booking.hotelId?.name || "Hotel",
      thumbnail: booking.hotelId?.images?.[0]?.url || null,
      bookingDate: booking.checkIn,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      totalAmount: booking.totalAmount,
      createdAt: booking.createdAt
    }));
    return [...formattedHotelBookings, ...formattedGenericBookings].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    logger_default.error("Service Error: getUserBookings", error);
    throw error;
  }
};
var getBookingDetail = async (bookingId, userId) => {
  try {
    const hotelBooking = await booking_model_default.findOne({
      _id: bookingId,
      userId
    }).populate("hotelId", "name description address location images").populate("roomTypeId", "name amenities bedType roomSizeSqm").lean();
    if (hotelBooking) {
      return {
        bookingType: "hotel",
        bookingReference: hotelBooking.bookingReference,
        status: hotelBooking.status,
        paymentStatus: hotelBooking.paymentStatus,
        hotel: {
          hotelId: hotelBooking.hotelId?._id,
          name: hotelBooking.hotelId?.name,
          address: hotelBooking.hotelId?.address,
          coordinates: hotelBooking.hotelId?.location?.coordinates,
          thumbnail: hotelBooking.hotelId?.images?.[0]?.url || null
        },
        room: {
          name: hotelBooking.roomTypeId?.name,
          amenities: hotelBooking.roomTypeId?.amenities || [],
          bedType: hotelBooking.roomTypeId?.bedType,
          roomSizeSqm: hotelBooking.roomTypeId?.roomSizeSqm
        },
        checkIn: hotelBooking.checkIn,
        checkOut: hotelBooking.checkOut,
        nights: hotelBooking.nights,
        guests: hotelBooking.guests,
        roomsBooked: hotelBooking.roomsBooked,
        priceBreakdown: {
          pricePerNight: hotelBooking.pricePerNight,
          taxAmount: hotelBooking.taxAmount,
          cleaningFee: hotelBooking.cleaningFee,
          discountAmount: hotelBooking.discountAmount,
          totalAmount: hotelBooking.totalAmount
        },
        createdAt: hotelBooking.createdAt
      };
    }
    const booking = await booking_model_default2.findOne({
      _id: bookingId,
      userId
    }).lean();
    if (!booking) {
      throw new Error("Booking not found");
    }
    let service = null;
    switch (booking.serviceType) {
      case "adventure":
        service = await adventure_model_default.findById(booking.serviceId).select("title images features description category").lean();
        break;
      case "bike":
        service = await bike_model_default.findById(booking.serviceId).select("title bikeName bikeType images features description").lean();
        break;
      case "cab":
        service = await cab_model_default.findById(booking.serviceId).select(
          "title carName cabType pickupLocation dropLocation images features"
        ).lean();
        break;
      case "tour":
        service = await tour_model_default.findById(booking.serviceId).select(
          "title images destinations duration itinerary features description"
        ).lean();
        break;
    }
    return {
      bookingType: booking.serviceType,
      bookingReference: booking.bookingReference,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      service: {
        serviceId: booking.serviceId,
        title: service?.title || booking.serviceSnapshot?.title,
        thumbnail: service?.images?.[0]?.url || null,
        description: service?.description || "",
        features: service?.features || [],
        details: service || {}
      },
      bookingInfo: {
        bookingDate: booking.bookingDate,
        duration: booking.duration,
        participants: booking.participants,
        quantity: booking.quantity,
        specialRequest: booking.specialRequest || ""
      },
      customer: booking.primaryCustomer,
      pricing: {
        baseAmount: booking.pricing?.baseAmount || 0,
        taxAmount: booking.pricing?.taxAmount || 0,
        discountAmount: booking.pricing?.discountAmount || 0,
        totalAmount: booking.pricing?.totalAmount || 0
      },
      createdAt: booking.createdAt
    };
  } catch (error) {
    logger_default.error("Service Error: getBookingDetail", error);
    throw error;
  }
};
var userInvoiceDownload = async (booking, res) => {
  const hotel = await hotel_model_default.findById(booking.hotelId).lean();
  if (!hotel) throw new Error("Hotel not found");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${booking.bookingReference}.pdf`
  );
  res.setHeader("Content-Type", "application/pdf");
  const doc = new import_pdfkit.default({ margin: 50, size: "A4" });
  doc.pipe(res);
  const brandColor = "#2563EB";
  const brandDark = "#1E293B";
  const textMuted = "#64748B";
  const borderLight = "#E2E8F0";
  const brandRed = "#EF4444";
  const bgLight = "#F8FAFC";
  const companyName = typeof trivllo_default !== "undefined" && trivllo_default.company_name ? trivllo_default.company_name : "Trivllo";
  const logoCandidates = [
    import_path.default.join(__dirname, "../../assets/logo.png"),
    import_path.default.join(__dirname, "../../../assets/logo.png"),
    import_path.default.join(__dirname, "../../../public/logo.png"),
    import_path.default.join(process.cwd(), "src/assets/logo.png"),
    import_path.default.join(process.cwd(), "public/logo.png"),
    import_path.default.join(process.cwd(), "../frontend/public/logo.png"),
    import_path.default.join(process.cwd(), "../vendor/public/logo.png"),
    import_path.default.join(process.cwd(), "../admin/public/logo.png")
  ];
  const logoPath = logoCandidates.find((p) => import_fs2.default.existsSync(p));
  if (logoPath) {
    try {
      doc.image(logoPath, 50, 48, { fit: [140, 50] });
    } catch (err) {
      logger_default.error("Error loading logo image into invoice PDF:", err);
      doc.circle(70, 70, 20).fill(brandColor);
      doc.fillColor("#FFFFFF").fontSize(20).font("Helvetica-Bold").text(companyName.charAt(0).toUpperCase(), 60, 62, { width: 20, align: "center" });
      doc.fillColor(brandDark).fontSize(24).font("Helvetica-Bold").text(companyName, 100, 60);
    }
  } else {
    doc.circle(70, 70, 20).fill(brandColor);
    doc.fillColor("#FFFFFF").fontSize(20).font("Helvetica-Bold").text(companyName.charAt(0).toUpperCase(), 60, 62, { width: 20, align: "center" });
    doc.fillColor(brandDark).fontSize(24).font("Helvetica-Bold").text(companyName, 100, 60);
  }
  doc.fillColor(brandColor).fontSize(28).font("Helvetica-Bold").text("INVOICE", 50, 55, { align: "right" });
  doc.fillColor(textMuted).fontSize(10).font("Helvetica").text(`Booking Ref: ${booking.bookingReference}`, 50, 85, { align: "right" }).text(`Date: ${(/* @__PURE__ */ new Date()).toLocaleDateString()}`, 50, 100, { align: "right" });
  doc.moveTo(50, 130).lineTo(545, 130).strokeColor(borderLight).lineWidth(1).stroke();
  doc.moveDown(2);
  const statusY = 150;
  doc.roundedRect(50, statusY, 495, 40, 6).fill(bgLight);
  doc.fillColor(textMuted).fontSize(10).font("Helvetica-Bold").text("BOOKING STATUS", 70, statusY + 14);
  const statusColor = booking.status === "confirmed" ? "#10B981" : "#F59E0B";
  doc.fillColor(statusColor).fontSize(12).font("Helvetica-Bold").text(booking.status?.toUpperCase() || "PENDING", 180, statusY + 13);
  doc.fillColor(textMuted).fontSize(10).font("Helvetica-Bold").text("PAYMENT STATUS", 320, statusY + 14);
  const paymentColor = booking.paymentStatus === "paid" ? "#10B981" : "#F59E0B";
  doc.fillColor(paymentColor).fontSize(12).font("Helvetica-Bold").text(booking.paymentStatus?.toUpperCase() || "PENDING", 430, statusY + 13);
  const infoY = 220;
  doc.fillColor(textMuted).fontSize(10).font("Helvetica-Bold").text("BILLED TO:", 50, infoY);
  doc.fillColor(brandDark).fontSize(12).font("Helvetica-Bold").text(`${booking.primaryGuest?.firstName || ""} ${booking.primaryGuest?.lastName || ""}`.trim() || "Guest", 50, infoY + 15);
  doc.fillColor(textMuted).fontSize(10).font("Helvetica").text(booking.primaryGuest?.email || "", 50, infoY + 30);
  doc.text(booking.primaryGuest?.phoneNumber || "", 50, infoY + 45);
  doc.fillColor(textMuted).fontSize(10).font("Helvetica-Bold").text("HOTEL DETAILS:", 300, infoY);
  const hotelAddrStr = typeof hotel.address === "object" && hotel.address !== null ? hotel.address.formattedAddress || hotel.address.streetAddress || hotel.address.city || "" : hotel.address || "";
  doc.fillColor(textMuted).fontSize(10).font("Helvetica").text(`${hotelAddrStr ? `${hotelAddrStr}, ` : ""}${hotel.city || ""}`, 300, infoY + 30);
  const stayY = 300;
  doc.roundedRect(50, stayY, 495, 60, 6).strokeColor(borderLight).stroke();
  doc.moveTo(297, stayY).lineTo(297, stayY + 60).strokeColor(borderLight).stroke();
  doc.fillColor(textMuted).fontSize(10).font("Helvetica-Bold").text("CHECK-IN", 70, stayY + 15);
  doc.fillColor(brandDark).fontSize(12).font("Helvetica-Bold").text(new Date(booking.checkIn).toDateString(), 70, stayY + 30);
  doc.fillColor(textMuted).fontSize(10).font("Helvetica-Bold").text("CHECK-OUT", 320, stayY + 15);
  doc.fillColor(brandDark).fontSize(12).font("Helvetica-Bold").text(new Date(booking.checkOut).toDateString(), 320, stayY + 30);
  const tableTop = 400;
  doc.roundedRect(50, tableTop, 495, 25, 4).fill(brandDark);
  doc.fillColor("#FFFFFF").fontSize(10).font("Helvetica-Bold").text("ROOM DETAILS", 60, tableTop + 8).text("NIGHTS", 250, tableTop + 8).text("GUESTS", 350, tableTop + 8).text("TOTAL", 450, tableTop + 8, { width: 85, align: "right" });
  const rowY = tableTop + 40;
  const rt = booking.roomTypeId || {};
  const bedInfo = rt.beds?.map((b) => `${b.quantity} ${b.type}`).join(", ") || "";
  doc.fillColor(brandDark).fontSize(11).font("Helvetica-Bold").text(rt.name || "Standard Room", 60, rowY);
  doc.fillColor(textMuted).fontSize(9).font("Helvetica").text(`${bedInfo}${bedInfo && rt.roomSizeSqm ? " | " : ""}${rt.roomSizeSqm ? rt.roomSizeSqm + " m\xB2" : ""}`, 60, rowY + 15).text(rt.amenities?.slice(0, 4).join(" \u2022 ") || "", 60, rowY + 28);
  doc.fillColor(brandDark).fontSize(10).font("Helvetica").text(`${booking.nights || 1}`, 250, rowY);
  const adultCount = booking.guests?.adults || 0;
  const childCount = booking.guests?.children || 0;
  doc.text(`${adultCount}A, ${childCount}C`, 350, rowY);
  doc.fontSize(11).font("Helvetica-Bold").text(`Rs. ${(booking.totalAmount || 0).toFixed(2)}`, 450, rowY, { width: 85, align: "right" });
  const rowBottom = rowY + 50;
  doc.moveTo(50, rowBottom).lineTo(545, rowBottom).strokeColor(borderLight).stroke();
  const calcX = 350;
  const valueX = 450;
  const widthV = 85;
  let currentY = rowBottom + 25;
  const nights = booking.nights || 1;
  const basePrice = rt.basePrice || booking.pricePerNight || 0;
  const baseTotal = basePrice * nights;
  let discountAmt = 0;
  if (booking.discountAmount !== void 0) {
    discountAmt = booking.discountAmount;
  } else if (rt.discountPrice && rt.basePrice) {
    discountAmt = (rt.basePrice - rt.discountPrice) * nights;
  }
  const drawRow = (label, value, isBold = false, isRed = false) => {
    doc.fillColor(isRed ? brandRed : brandDark).fontSize(isBold ? 12 : 10).font(isBold ? "Helvetica-Bold" : "Helvetica");
    doc.text(label, calcX, currentY);
    doc.text(value, valueX, currentY, { width: widthV, align: "right" });
    currentY += 20;
  };
  drawRow("Base Price", `Rs. ${baseTotal.toFixed(2)}`);
  if (discountAmt > 0) {
    const discountPercent = baseTotal > 0 ? Math.round(discountAmt / baseTotal * 100) : 0;
    drawRow(`Discount (${discountPercent}%)`, `- Rs. ${discountAmt.toFixed(2)}`, false, true);
  }
  const taxes = booking.taxAmount || booking.totalTax || 0;
  drawRow("Taxes & Fees", `Rs. ${taxes.toFixed(2)}`);
  if (booking.cleaningFee) {
    drawRow("Cleaning Fee", `Rs. ${booking.cleaningFee.toFixed(2)}`);
  }
  currentY += 5;
  doc.moveTo(calcX, currentY - 5).lineTo(535, currentY - 5).strokeColor(borderLight).stroke();
  currentY += 5;
  drawRow("GRAND TOTAL", `Rs. ${(booking.totalAmount || 0).toFixed(2)}`, true);
  const footerY = 780;
  doc.moveTo(50, footerY).lineTo(545, footerY).strokeColor(borderLight).stroke();
  doc.fillColor(textMuted).fontSize(9).font("Helvetica").text(`Thank you for choosing ${companyName}! For support, please contact us.`, 50, footerY + 15, { align: "center" });
  doc.end();
};
var getRefundPreview = async (bookingId, userId) => {
  try {
    const booking = await booking_model_default.findOne({
      _id: bookingId,
      userId
    });
    if (!booking) throw new Error("Booking not found");
    if (booking.status !== "confirmed") {
      throw new Error("Only confirmed bookings are eligible for cancellation");
    }
    const now = /* @__PURE__ */ new Date();
    if (booking.checkIn <= now) {
      throw new Error("Cannot cancel past or ongoing bookings");
    }
    const daysBeforeCheckIn = Math.ceil(
      (new Date(booking.checkIn).getTime() - now.getTime()) / (1e3 * 60 * 60 * 24)
    );
    let refundPercentage = 0;
    let policyApplied = "";
    const isWithin24Hours = now.getTime() - new Date(booking.createdAt).getTime() <= 24 * 60 * 60 * 1e3;
    if (isWithin24Hours) {
      refundPercentage = 100;
      policyApplied = "Free cancellation within 24 hours";
    } else if (daysBeforeCheckIn >= 30) {
      refundPercentage = 100;
      policyApplied = "30+ days before check-in";
    } else if (daysBeforeCheckIn >= 15) {
      refundPercentage = 50;
      policyApplied = "15-30 days before check-in";
    } else {
      refundPercentage = 0;
      policyApplied = "Less than 15 days before check-in";
    }
    const refundAmount = Math.round(
      booking.totalAmount * refundPercentage / 100
    );
    return {
      bookingId: booking._id,
      totalAmount: booking.totalAmount,
      refundPercentage,
      refundAmount,
      policyApplied,
      daysBeforeCheckIn
    };
  } catch (error) {
    throw error;
  }
};
var cancelBooking = async (bookingId, userId, reason) => {
  const session = await import_mongoose21.default.startSession();
  session.startTransaction();
  try {
    const booking = await booking_model_default.findOne({
      _id: bookingId,
      userId
    }).session(session);
    if (!booking) throw new Error("Booking not found");
    if (booking.status !== "confirmed") {
      throw new Error("Only confirmed bookings can be cancelled");
    }
    if (booking.status === "cancellation_requested") {
      throw new Error("Cancellation already requested");
    }
    const now = /* @__PURE__ */ new Date();
    if (new Date(booking.checkIn) <= now) {
      throw new Error("Cannot cancel past or ongoing bookings");
    }
    if (!reason || reason.trim() === "") {
      throw new Error("Cancellation reason is required");
    }
    const daysBeforeCheckIn = Math.ceil(
      (new Date(booking.checkIn).getTime() - now.getTime()) / (1e3 * 60 * 60 * 24)
    );
    const isWithin24Hours = now.getTime() - new Date(booking.createdAt).getTime() <= 24 * 60 * 60 * 1e3;
    let refundPercentage = 0;
    let policyApplied = "";
    if (isWithin24Hours) {
      refundPercentage = 100;
      policyApplied = "Free cancellation within 24 hours";
    } else if (daysBeforeCheckIn >= 30) {
      refundPercentage = 100;
      policyApplied = "30+ days before check-in";
    } else if (daysBeforeCheckIn >= 15) {
      refundPercentage = 50;
      policyApplied = "15-30 days before check-in";
    } else {
      refundPercentage = 0;
      policyApplied = "Less than 15 days before check-in";
    }
    const refundAmount = Math.round(
      booking.totalAmount * refundPercentage / 100
    );
    booking.status = "cancellation_requested";
    booking.refundStatus = refundPercentage > 0 ? "pending" : "none";
    booking.refundPercentage = refundPercentage;
    booking.refundAmount = refundAmount;
    booking.refundRequestedAt = now;
    booking.cancellationReason = reason.trim();
    booking.policyApplied = policyApplied;
    await booking.save({ session });
    await session.commitTransaction();
    session.endSession();
    return {
      message: "Cancellation request submitted successfully",
      bookingId: booking._id,
      refundPercentage,
      refundAmount,
      policyApplied,
      daysBeforeCheckIn
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};
var adminHandleRefund = async (bookingId, action) => {
  const session = await import_mongoose21.default.startSession();
  session.startTransaction();
  try {
    const booking = await booking_model_default.findById(bookingId).session(session);
    if (!booking) throw new Error("Booking not found");
    if (booking.status !== "cancellation_requested")
      throw new Error("No cancellation pending");
    if (action === "approve") {
      await restoreAvailability(booking, session);
      booking.status = "cancelled";
      booking.refundStatus = "approved";
      booking.cancelledAt = /* @__PURE__ */ new Date();
      await processRefund(booking, session);
      booking.paymentStatus = "refunded";
      booking.refundProcessedAt = /* @__PURE__ */ new Date();
    }
    if (action === "reject") {
      booking.status = "confirmed";
      booking.refundStatus = "rejected";
    }
    await booking.save({ session });
    await session.commitTransaction();
    session.endSession();
    return booking;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    logger_default.error("Service Error: adminHandleRefund", err);
    throw err;
  }
};
var getVendorBookings = async (vendorId, queryParams) => {
  const {
    page = 1,
    limit = 10,
    status,
    search,
    startDate,
    endDate,
    sort = "-createdAt"
  } = queryParams;
  const skip = (page - 1) * limit;
  const hotels = await hotel_model_default.find({ vendorId }, "_id").lean();
  const hotelIds = hotels.map((h) => h._id);
  const filter = {
    hotelId: { $in: hotelIds }
  };
  if (status) {
    filter.status = status;
  }
  if (startDate && endDate) {
    filter.checkIn = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }
  if (search) {
    filter.$or = [
      { bookingReference: { $regex: search, $options: "i" } },
      { "primaryGuest.firstName": { $regex: search, $options: "i" } },
      { "primaryGuest.lastName": { $regex: search, $options: "i" } }
    ];
  }
  const bookings = await booking_model_default.find(filter).select(
    "bookingReference primaryGuest roomTypeId roomNumber checkIn checkOut nights status specialRequest"
  ).populate("roomTypeId", "name").sort(sort).skip(skip).limit(Number(limit)).lean();
  const total = await booking_model_default.countDocuments(filter);
  const formatted = bookings.map((b) => ({
    bookingId: b._id,
    bookingReference: b.bookingReference,
    guestName: `${b.primaryGuest.firstName} ${b.primaryGuest.lastName}`,
    roomLabel: `${b.roomTypeId?.name || ""} ${b.roomNumber || ""}`,
    specialRequest: b.specialRequest || null,
    nights: b.nights,
    checkIn: b.checkIn,
    checkOut: b.checkOut,
    status: b.status
  }));
  return {
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    count: formatted.length,
    data: formatted
  };
};
var getVendorInvoices = async (vendorId, queryParams) => {
  const {
    page = 1,
    limit = 10,
    status,
    search,
    startDate,
    endDate,
    sort = "-createdAt"
  } = queryParams;
  const skip = (page - 1) * limit;
  const hotels = await hotel_model_default.find({ vendorId }, "_id").lean();
  const hotelIds = hotels.map((h) => h._id);
  const filter = {
    hotelId: { $in: hotelIds }
  };
  if (status) {
    filter.paymentStatus = status;
  }
  if (startDate && endDate) {
    filter.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }
  if (search) {
    filter.$or = [
      { bookingReference: { $regex: search, $options: "i" } },
      { "primaryGuest.firstName": { $regex: search, $options: "i" } },
      { "primaryGuest.lastName": { $regex: search, $options: "i" } },
      { roomNumber: { $regex: search, $options: "i" } }
    ];
  }
  const bookings = await booking_model_default.find(filter).select(
    `
      bookingReference
      primaryGuest
      roomTypeId
      roomNumber
      pricePerNight
      nights
      totalAmount
      paymentStatus
    `
  ).populate("roomTypeId", "name").sort(sort).skip(skip).limit(Number(limit)).lean();
  const total = await booking_model_default.countDocuments(filter);
  const data = bookings.map((b) => ({
    bookingId: b._id,
    bookingReference: b.bookingReference,
    guestName: `${b.primaryGuest.firstName} ${b.primaryGuest.lastName}`,
    room: `${b.roomTypeId?.name || ""} ${b.roomNumber || ""}`,
    pricePerNight: b.pricePerNight,
    nights: b.nights,
    totalAmount: b.totalAmount,
    paymentStatus: b.paymentStatus
  }));
  return {
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    count: data.length,
    data
  };
};
var generateInvoicePdf = async (bookingId, vendorId, res) => {
  if (!import_mongoose21.default.Types.ObjectId.isValid(bookingId)) {
    throw new Error("Invalid booking id");
  }
  const booking = await booking_model_default.findById(bookingId).populate({
    path: "roomTypeId",
    select: "name basePrice discountPrice roomSizeSqm beds amenities"
  }).lean();
  if (!booking) throw new Error("Booking not found");
  const hotel = await hotel_model_default.findOne({
    _id: booking.hotelId,
    vendorId
  }).lean();
  if (!hotel) throw new Error("Unauthorized access");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${booking.bookingReference}.pdf`
  );
  res.setHeader("Content-Type", "application/pdf");
  const doc = new import_pdfkit.default({ margin: 40, size: "A4" });
  doc.pipe(res);
  const primaryBlue = "#1a73e8";
  const brandRed = "#ff3838";
  const lightBg = "#f8f9fa";
  const textColor = "#333333";
  const borderColor = "#eeeeee";
  doc.circle(65, 60, 20).fill(brandRed);
  doc.fillColor("#000").fontSize(20).font("Helvetica-BoldOblique").text(trivllo_default.company_name, 50, 52);
  doc.fillColor(textColor).fontSize(20).font("Helvetica-Bold").text("Hotelier Voucher", 380, 40, { align: "right" });
  doc.fontSize(10).fillColor("gray").font("Helvetica").text(`BOOKING ID: ${booking.bookingReference}`, 380, 65, {
    align: "right"
  });
  doc.moveDown(2);
  const statusX = 40;
  const statusY = 110;
  doc.roundedRect(statusX, statusY, 515, 35, 3).fill(lightBg);
  doc.fillColor(primaryBlue).fontSize(10).font("Helvetica-Bold").text("BOOKING STATUS:", statusX + 15, statusY + 12).fillColor(booking.status === "confirmed" ? "#f5a623" : "orange").text(booking.status.toUpperCase(), statusX + 115, statusY + 12);
  doc.fillColor(primaryBlue).text("PAYMENT:", statusX + 280, statusY + 12).fillColor(textColor).text(booking.paymentStatus.toUpperCase(), statusX + 340, statusY + 12);
  doc.moveDown(3.5);
  const gridY = doc.y;
  doc.fillColor(primaryBlue).fontSize(12).font("Helvetica-Bold").text(hotel.name, 40, gridY);
  const invoiceHotelAddr = typeof hotel.address === "object" && hotel.address !== null ? hotel.address.formattedAddress || hotel.address.streetAddress || hotel.address.city || "" : hotel.address || "";
  doc.fillColor("#666").fontSize(9).font("Helvetica").text(`${invoiceHotelAddr ? `${invoiceHotelAddr}, ` : ""}${hotel.city || ""}`, 40, gridY + 15, { width: 220 });
  doc.fillColor(primaryBlue).fontSize(12).font("Helvetica-Bold").text("PRIMARY GUEST", 320, gridY);
  doc.fillColor(textColor).fontSize(10).font("Helvetica").text(
    `${booking.primaryGuest.firstName} ${booking.primaryGuest.lastName}`,
    320,
    gridY + 15
  ).fillColor("#666").fontSize(9).text(booking.primaryGuest.email).text(booking.primaryGuest.phoneNumber);
  doc.moveDown(5);
  const boxY = doc.y;
  doc.roundedRect(40, boxY, 515, 65, 3).stroke(borderColor);
  doc.moveTo(297, boxY).lineTo(297, boxY + 65).stroke(borderColor);
  doc.fillColor("gray").fontSize(8).text("CHECK-IN", 55, boxY + 10);
  doc.fillColor(textColor).fontSize(11).font("Helvetica-Bold").text(booking.checkIn.toDateString(), 55, boxY + 25);
  doc.fontSize(9).font("Helvetica").text("03:00 PM", 55, boxY + 45);
  doc.fillColor("gray").fontSize(8).text("CHECK-OUT", 312, boxY + 10);
  doc.fillColor(textColor).fontSize(11).font("Helvetica-Bold").text(booking.checkOut.toDateString(), 312, boxY + 25);
  doc.fontSize(9).font("Helvetica").text("11:00 AM", 312, boxY + 45);
  doc.moveDown(6);
  const tableTop = doc.y;
  doc.fillColor(primaryBlue).fontSize(12).font("Helvetica-Bold").text("ROOM DETAILS", 40, tableTop);
  const headerY = tableTop + 20;
  doc.rect(40, headerY, 515, 20).fill(lightBg);
  doc.fillColor(textColor).fontSize(9).font("Helvetica-Bold").text("ROOM TYPE & SPECS", 50, headerY + 6).text("CAPACITY", 250, headerY + 6).text("TOTAL", 480, headerY + 6, { align: "right" });
  const rt = booking.roomTypeId;
  const rowY = headerY + 25;
  doc.fillColor(textColor).font("Helvetica-Bold").fontSize(11).text(rt.name || "Room", 50, rowY);
  const bedInfo = (rt.beds || []).map((b) => `${b.quantity} ${b.type}`).join(", ");
  doc.fillColor("#666").fontSize(9).font("Helvetica").text(`${bedInfo} | ${rt.roomSizeSqm || ""} m\xB2`, 50, rowY + 15);
  const amenitiesTxt = (rt.amenities || []).slice(0, 4).join(" \u2022 ");
  doc.fillColor(primaryBlue).fontSize(8).text(amenitiesTxt, 50, rowY + 30);
  doc.fillColor(textColor).fontSize(10).text(`${booking.guests.adults}A + ${booking.guests.children}C`, 250, rowY);
  doc.fontSize(11).font("Helvetica-Bold").text(`Rs. ${booking.totalAmount}`, 480, rowY, { align: "right" });
  doc.moveTo(40, rowY + 45).lineTo(555, rowY + 45).stroke(borderColor);
  doc.moveDown(4.5);
  const calcX = 350;
  const valueX = 555;
  const baseTotal = (rt.basePrice || 0) * booking.nights;
  const discountAmt = ((rt.basePrice || 0) - (rt.discountPrice || 0)) * booking.nights;
  const discountPercent = (rt.basePrice || 0) > 0 ? Math.round(
    ((rt.basePrice || 0) - (rt.discountPrice || 0)) / rt.basePrice * 100
  ) : 0;
  const drawPriceRow = (label, value, isTotal = false, isDisc = false) => {
    const currentY = doc.y;
    doc.font(isTotal ? "Helvetica-Bold" : "Helvetica").fontSize(isTotal ? 12 : 10).fillColor(isDisc ? brandRed : isTotal ? primaryBlue : textColor);
    doc.text(label, calcX, currentY);
    doc.text(`Rs. ${value}`, calcX, currentY, {
      width: valueX - calcX,
      align: "right"
    });
    doc.moveDown(1.2);
  };
  drawPriceRow("Base Price (Original)", baseTotal.toFixed(2));
  if (discountAmt > 0) {
    drawPriceRow(
      `Discount (${discountPercent}% OFF)`,
      `-${discountAmt.toFixed(2)}`,
      false,
      true
    );
  }
  drawPriceRow(
    "Taxes & Fees",
    (booking.totalTax || booking.taxAmount).toFixed(2)
  );
  doc.moveTo(calcX, doc.y).lineTo(valueX, doc.y).stroke(borderColor);
  doc.moveDown(0.5);
  drawPriceRow("GRAND TOTAL", booking.totalAmount.toFixed(2), true);
  doc.fontSize(8).fillColor("gray").text(`Thank you for booking with ${trivllo_default.company_name}! Have a great stay.`, 40, 760, {
    align: "center"
  }).text("Carry a valid Govt. ID (Aadhar/Passport) for check-in.", {
    align: "center"
  });
  doc.end();
};
var getVendorDashboard = async (vendorId, reservationDays = 7, revenueMonths = 6) => {
  const hotels = await hotel_model_default.find({ vendorId }, "_id").lean();
  const hotelIds = hotels.map((h) => h._id);
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDays = new Date(today);
  lastDays.setDate(today.getDate() - (reservationDays - 1));
  const lastMonths = new Date(
    today.getFullYear(),
    today.getMonth() - (revenueMonths - 1),
    1
  );
  const [
    newBookings,
    todayCheckIns,
    todayCheckOuts,
    totalRevenueAgg,
    totalRooms,
    occupiedRooms,
    revenueAgg,
    reservationAgg,
    recentBookings
  ] = await Promise.all([
    booking_model_default.countDocuments({
      hotelId: { $in: hotelIds },
      createdAt: { $gte: today }
    }),
    booking_model_default.countDocuments({
      hotelId: { $in: hotelIds },
      checkIn: { $gte: today, $lt: tomorrow }
    }),
    booking_model_default.countDocuments({
      hotelId: { $in: hotelIds },
      checkOut: { $gte: today, $lt: tomorrow }
    }),
    booking_model_default.aggregate([
      {
        $match: {
          hotelId: { $in: hotelIds },
          paymentStatus: "paid",
          createdAt: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" }
        }
      }
    ]),
    room_model_default.countDocuments({
      hotelId: { $in: hotelIds }
    }),
    booking_model_default.countDocuments({
      hotelId: { $in: hotelIds },
      status: { $in: ["checked_in", "staying"] }
    }),
    booking_model_default.aggregate([
      {
        $match: {
          hotelId: { $in: hotelIds },
          paymentStatus: "paid",
          createdAt: { $gte: lastMonths }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          revenue: { $sum: "$totalAmount" }
        }
      }
    ]),
    booking_model_default.aggregate([
      {
        $match: {
          hotelId: { $in: hotelIds },
          createdAt: { $gte: lastDays }
        }
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt"
              }
            }
          },
          booked: {
            $sum: {
              $cond: [{ $ne: ["$status", "cancelled"] }, 1, 0]
            }
          },
          cancelled: {
            $sum: {
              $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0]
            }
          }
        }
      }
    ]),
    booking_model_default.find({
      hotelId: { $in: hotelIds },
      checkIn: { $lte: today },
      checkOut: { $gte: today },
      status: { $in: ["confirmed", "checked_in", "staying"] }
    }).select(
      "bookingReference primaryGuest roomTypeId roomNumber checkIn checkOut status"
    ).populate("roomTypeId", "name").sort({ checkIn: 1 }).limit(10).lean()
  ]);
  const totalRevenue = totalRevenueAgg[0]?.total || 0;
  const availableRooms = totalRooms - occupiedRooms;
  const revenueMap = /* @__PURE__ */ new Map();
  revenueAgg.forEach((r) => {
    revenueMap.set(`${r._id.year}-${r._id.month}`, r.revenue);
  });
  const revenueChart = [];
  for (let i = 0; i < revenueMonths; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const key2 = `${d.getFullYear()}-${d.getMonth() + 1}`;
    revenueChart.unshift({
      month: d.toLocaleString("default", { month: "short" }),
      revenue: revenueMap.get(key2) || 0
    });
  }
  const reservationMap = /* @__PURE__ */ new Map();
  reservationAgg.forEach((r) => {
    reservationMap.set(r._id.date, r);
  });
  const reservationChart = [];
  for (let i = 0; i < reservationDays; i++) {
    const d = new Date(lastDays);
    d.setDate(lastDays.getDate() + i);
    const key2 = d.toISOString().split("T")[0];
    const found = reservationMap.get(key2);
    reservationChart.push({
      date: d.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
      booked: found ? found.booked : 0,
      cancelled: found ? found.cancelled : 0
    });
  }
  const formattedRecent = recentBookings.map((b) => ({
    bookingReference: b.bookingReference,
    guestName: `${b.primaryGuest.firstName} ${b.primaryGuest.lastName}`,
    room: `${b.roomTypeId?.name || ""} ${b.roomNumber || ""}`,
    checkIn: b.checkIn,
    checkOut: b.checkOut,
    status: b.status
  }));
  return {
    stats: {
      newBookings,
      todayCheckIns,
      todayCheckOuts,
      totalRevenue
    },
    roomSummary: {
      totalRooms,
      occupiedRooms,
      availableRooms
    },
    revenueChart,
    reservationChart,
    recentBookings: formattedRecent
  };
};
var validateOwnership = async (bookingId, vendorId) => {
  if (!import_mongoose21.default.Types.ObjectId.isValid(bookingId)) {
    throw new Error("Invalid booking id");
  }
  const booking = await booking_model_default.findById(bookingId);
  if (!booking) throw new Error("Booking not found");
  const hotel = await hotel_model_default.findOne({
    _id: booking.hotelId,
    vendorId
  });
  if (!hotel) throw new Error("Unauthorized access");
  return booking;
};
var checkInBooking = async (bookingId, vendorId) => {
  const booking = await validateOwnership(bookingId, vendorId);
  if (booking.status !== "confirmed") {
    throw new Error("Only confirmed bookings can be checked in");
  }
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  if (booking.checkIn > today) {
    throw new Error("Cannot check in before check-in date");
  }
  booking.status = "checked_in";
  booking.actualCheckInAt = /* @__PURE__ */ new Date();
  await booking.save();
  return booking;
};
var markBookingStaying = async (bookingId, vendorId) => {
  const booking = await validateOwnership(bookingId, vendorId);
  if (booking.status !== "checked_in") {
    throw new Error("Guest must be checked in first");
  }
  booking.status = "staying";
  await booking.save();
  return booking;
};
var checkOutBooking = async (bookingId, vendorId) => {
  const booking = await validateOwnership(bookingId, vendorId);
  if (!["checked_in", "staying"].includes(booking.status)) {
    throw new Error("Booking not eligible for checkout");
  }
  booking.status = "checked_out";
  booking.actualCheckOutAt = /* @__PURE__ */ new Date();
  await booking.save();
  return booking;
};
var booking_service = {
  createBooking,
  getUserBookings,
  getBookingDetail,
  userInvoiceDownload,
  getRefundPreview,
  cancelBooking,
  adminHandleRefund,
  getVendorBookings,
  getVendorInvoices,
  generateInvoicePdf,
  getVendorDashboard,
  checkInBooking,
  markBookingStaying,
  checkOutBooking
};
var booking_service_default = booking_service;

// src/modules/vendorBank/bank.model.ts
var import_mongoose22 = __toESM(require("mongoose"), 1);

// src/shared/utils/encryption.ts
var import_crypto3 = __toESM(require("crypto"), 1);
var algorithm = "aes-256-cbc";
var key = import_crypto3.default.createHash("sha256").update(process.env.BANK_ENCRYPTION_KEY).digest();
var iv = Buffer.alloc(16, 0);
var encrypt = (text) => {
  const cipher = import_crypto3.default.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};
var decrypt = (text) => {
  const decipher = import_crypto3.default.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(text, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

// src/modules/vendorBank/bank.model.ts
var vendorBankSchema = new import_mongoose22.Schema(
  {
    vendorId: {
      type: import_mongoose22.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      unique: false
    },
    accountHolderName: {
      type: String,
      required: true,
      trim: true
    },
    bankName: {
      type: String,
      required: true,
      trim: true
    },
    accountNumber: {
      type: String,
      required: true,
      trim: true,
      select: false
    },
    ifscCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      select: false
    },
    branchName: {
      type: String,
      trim: true
    },
    upiId: {
      type: String,
      trim: true,
      select: false
    },
    bankProof: {
      url: String,
      public_id: String,
      resource_type: String
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
      index: true
    },
    adminRemark: {
      type: String,
      trim: true
    },
    isPrimary: {
      type: Boolean,
      default: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);
vendorBankSchema.pre("save", function() {
  if (this.isModified("accountNumber") && this.accountNumber) {
    this.accountNumber = encrypt(this.accountNumber);
  }
  if (this.isModified("ifscCode") && this.ifscCode) {
    this.ifscCode = encrypt(this.ifscCode);
  }
  if (this.isModified("upiId") && this.upiId) {
    this.upiId = encrypt(this.upiId);
  }
});
vendorBankSchema.post("findOne", function(doc) {
  if (!doc) return;
  if (doc.accountNumber) {
    doc.accountNumber = decrypt(doc.accountNumber);
  }
  if (doc.ifscCode) {
    doc.ifscCode = decrypt(doc.ifscCode);
  }
  if (doc.upiId) {
    doc.upiId = decrypt(doc.upiId);
  }
});
vendorBankSchema.post("find", function(docs) {
  docs.forEach((doc) => {
    if (doc.accountNumber) {
      doc.accountNumber = decrypt(doc.accountNumber);
    }
    if (doc.ifscCode) {
      doc.ifscCode = decrypt(doc.ifscCode);
    }
    if (doc.upiId) {
      doc.upiId = decrypt(doc.upiId);
    }
  });
});
var VendorBank = import_mongoose22.default.model("VendorBank", vendorBankSchema);
var bank_model_default = VendorBank;

// src/modules/vendors/vendor.service.ts
init_cabService_model();
init_bikeService_model();
init_service_model();
init_tourService_model();

// src/modules/admin/promotion/promotion.model.ts
var import_mongoose27 = __toESM(require("mongoose"), 1);
var promotionSchema = new import_mongoose27.Schema(
  {
    vendorId: {
      type: import_mongoose27.Schema.Types.ObjectId,
      ref: "Vendor",
      required: [true, "Promotion must be linked to a Vendor"],
      index: true
    },
    serviceType: {
      type: String,
      enum: ["hotel", "cab", "bike", "tour", "adventure"],
      required: true,
      index: true
    },
    serviceId: {
      type: import_mongoose27.Schema.Types.ObjectId,
      required: true,
      index: true
    },
    plan: {
      type: String,
      enum: ["Boost", "Premium", "Elite", "Admin", "Direct"],
      default: "Admin"
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true
    },
    rankAssigned: {
      type: String,
      enum: ["A", "B", "C"],
      default: null
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date
    },
    approvedAt: {
      type: Date
    },
    approvedBy: {
      type: import_mongoose27.Schema.Types.ObjectId,
      ref: "User"
    },
    rejectedAt: {
      type: Date
    },
    rejectionReason: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);
promotionSchema.index({ vendorId: 1, status: 1 });
promotionSchema.index({ serviceId: 1, status: 1 });
var Promotion = import_mongoose27.default.model("Promotion", promotionSchema);
var promotion_model_default = Promotion;

// src/modules/vendors/vendor.service.ts
var SERVICE_MODELS = {
  hotel: hotel_model_default,
  cab: cab_model_default,
  bike: bike_model_default,
  tour: tour_model_default,
  adventure: adventure_model_default
};
var getVendorMe = async (userId) => {
  try {
    const user = await auth_model_default.findById(userId).select("firstName lastName email");
    if (!user) {
      throw new Error("User not found");
    }
    const vendor = await vendor_model_default.findOne({ userId });
    if (!vendor) {
      throw new Error("Vendor not found");
    }
    const bank = await bank_model_default.findOne({
      vendorId: vendor._id,
      isActive: true
    }).select("+accountNumber +ifscCode +upiId");
    const ServiceModel = vendor.serviceType ? SERVICE_MODELS[vendor.serviceType] : null;
    let serviceData = null;
    if (ServiceModel) {
      serviceData = await ServiceModel.findOne({
        vendorId: vendor._id,
        isActive: true
      });
    }
    let serviceDetails = null;
    if (serviceData) {
      switch (vendor.serviceType) {
        // HOTEL
        case "hotel":
          serviceDetails = {
            serviceType: "hotel",
            id: serviceData._id,
            name: serviceData.name,
            description: serviceData.description,
            address: serviceData.address,
            city: serviceData.city,
            images: serviceData.images || [],
            documents: serviceData.documents || [],
            amenities: serviceData.amenities || [],
            accessibility: serviceData.accessibility || {},
            rating: serviceData.rating || 0,
            numReviews: serviceData.numReviews || 0,
            verificationStatus: serviceData.verificationStatus,
            rank: serviceData.rank,
            isFeatured: serviceData.isFeatured
          };
          break;
        // CAB
        case "cab":
          serviceDetails = {
            serviceType: "cab",
            id: serviceData._id,
            name: serviceData.name,
            description: serviceData.description,
            location: serviceData.location || {},
            address: serviceData.address,
            coordinates: serviceData.coordinates || {},
            images: serviceData.images || [],
            documents: serviceData.documents || [],
            features: serviceData.features || [],
            rating: serviceData.rating || {},
            verificationStatus: serviceData.verificationStatus,
            rank: serviceData.rank,
            isFeatured: serviceData.isFeatured
          };
          break;
        // BIKE
        case "bike":
          serviceDetails = {
            serviceType: "bike",
            id: serviceData._id,
            name: serviceData.name,
            description: serviceData.description,
            location: serviceData.location || {},
            address: serviceData.address,
            coordinates: serviceData.coordinates || {},
            images: serviceData.images || [],
            documents: serviceData.documents || [],
            features: serviceData.features || [],
            rentalPolicies: serviceData.rentalPolicies || {},
            rating: serviceData.rating || {},
            verificationStatus: serviceData.verificationStatus,
            rank: serviceData.rank,
            isFeatured: serviceData.isFeatured
          };
          break;
        // TOUR
        case "tour":
          serviceDetails = {
            serviceType: "tour",
            id: serviceData._id,
            name: serviceData.name,
            description: serviceData.description,
            location: serviceData.location || {},
            address: serviceData.address,
            coordinates: serviceData.coordinates || {},
            // images: serviceData.images || [],
            // documents: serviceData.documents || [],
            features: serviceData.features || [],
            tags: serviceData.tags || [],
            rating: serviceData.rating || {},
            verificationStatus: serviceData.verificationStatus,
            rank: serviceData.rank,
            isFeatured: serviceData.isFeatured
          };
          break;
        // ADVENTURE
        case "adventure":
          serviceDetails = {
            serviceType: "adventure",
            id: serviceData._id,
            name: serviceData.name,
            description: serviceData.description,
            category: serviceData.category,
            location: serviceData.location || {},
            address: serviceData.address,
            coordinates: serviceData.coordinates || {},
            images: serviceData.images || [],
            documents: serviceData.documents || [],
            features: serviceData.features || [],
            priceRange: serviceData.priceRange || {},
            rating: serviceData.rating || {},
            verificationStatus: serviceData.verificationStatus,
            rank: serviceData.rank,
            isFeatured: serviceData.isFeatured
          };
          break;
        default:
          serviceDetails = null;
      }
    }
    const response = {
      vendor: {
        vendorId: vendor._id,
        propertyId: vendor.propertyId || null,
        status: vendor.status,
        currentStep: vendor.currentStep,
        registrationStep: vendor.registrationStep,
        rejectedSteps: vendor.rejectedSteps || [],
        rejectionReasons: vendor.rejectionReasons || {},
        isSubmitted: vendor.isSubmitted,
        logo: vendor.logo?.url || (typeof vendor.logo === "string" ? vendor.logo : user.avatar || null),
        serviceType: vendor.serviceType
      },
      businessDetails: {
        businessName: vendor.businessName,
        businessEmail: vendor.businessEmail,
        businessPhone: vendor.businessPhone,
        logo: vendor.logo?.url || (typeof vendor.logo === "string" ? vendor.logo : user.avatar || null),
        address: vendor.businessAddress,
        city: vendor.city,
        state: vendor.state,
        country: vendor.country
      },
      // documents: vendor.verificationDocs || [],
      // bankDetails: bank
      //   ? {
      //       accountHolderName: bank.accountHolderName,
      //       bankName: bank.bankName,
      //       accountNumber: bank.accountNumber,
      //       ifscCode: bank.ifscCode,
      //       branchName: bank.branchName,
      //       upiId: bank.upiId,
      //       verificationStatus: bank.verificationStatus,
      //     }
      //   : null,
      serviceDetails
    };
    if (vendor.status === "approved") {
      response.approvedData = {
        vendorName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        vendorEmail: user.email,
        propertyId: vendor.propertyId || null,
        businessName: vendor.businessName,
        businessEmail: vendor.businessEmail,
        logo: vendor.logo?.url || (typeof vendor.logo === "string" ? vendor.logo : user.avatar || null),
        serviceType: vendor.serviceType,
        companyId: serviceData?._id || null,
        hotelId: serviceData?._id || null,
        cabId: serviceData?._id || null,
        bikeId: serviceData?._id || null,
        tourId: serviceData?._id || null,
        adventureId: serviceData?._id || null,
        serviceName: serviceData?.name || null
      };
    }
    return response;
  } catch (error) {
    throw error;
  }
};
var createVendorProfile = async (userId, vendorData) => {
  try {
    const vendor = await vendor_model_default.findOne({ userId });
    if (!vendor) {
      throw new Error("Vendor not found. Please verify OTP first.");
    }
    if (vendor.isSubmitted && vendor.status !== "rejected") {
      throw new Error("Already submitted. Cannot edit.");
    }
    if (vendor.currentStep !== 1 && vendor.status !== "rejected") {
      throw new Error("Invalid step flow");
    }
    if (vendor.status === "rejected" && !vendor.rejectedSteps.includes(2)) {
      throw new Error("Fix required step first");
    }
    Object.assign(vendor, {
      serviceType: vendorData.serviceType,
      businessName: vendorData.businessName,
      businessEmail: vendorData.businessEmail,
      businessPhone: vendorData.businessPhone,
      businessAddress: vendorData.businessAddress,
      city: vendorData.city,
      state: vendorData.state,
      country: vendorData.country,
      panNumber: vendorData.panNumber,
      aadhaarNumber: vendorData.aadhaarNumber,
      verificationDocs: vendorData.verificationDocs
    });
    vendor.currentStep = 2;
    vendor.registrationStep = Math.max(vendor.registrationStep, 2);
    if (vendor.rejectedSteps?.includes(2)) {
      vendor.rejectedSteps = vendor.rejectedSteps.filter((s) => s !== 2);
    }
    if (vendor.rejectionReasons) {
      delete vendor.rejectionReasons["2"];
    }
    if (!vendor.rejectedSteps || vendor.rejectedSteps.length === 0) {
      vendor.status = "draft";
    }
    await vendor.save();
    return vendor;
  } catch (error) {
    logger_default.error("Service Error: createVendorProfile", error);
    throw error;
  }
};
var submitVendor = async (vendor) => {
  try {
    if (vendor.isSubmitted) {
      throw new Error("Already submitted");
    }
    if (vendor.currentStep !== 4) {
      throw new Error("Please complete all steps before submitting");
    }
    if (vendor.rejectedSteps && vendor.rejectedSteps.length > 0) {
      throw new Error("Please fix all issues before submitting");
    }
    if (!vendor.serviceType || !vendor.businessName) {
      throw new Error("Incomplete vendor profile");
    }
    vendor.status = "pending";
    vendor.isSubmitted = true;
    vendor.submittedAt = /* @__PURE__ */ new Date();
    await vendor.save();
    let hotel = null;
    if (vendor.serviceType === "hotel") {
      hotel = await hotel_model_default.findOne({ vendorId: vendor._id });
    }
    Promise.all([
      sendAdminVendorNotificationEmail(vendor, hotel),
      sendVendorSubmissionConfirmationEmail(vendor)
    ]).catch((err) => {
      console.error("Email sending failed:", err.message);
    });
    return vendor;
  } catch (error) {
    logger_default.error("Service Error: submitVendor", error);
    throw error;
  }
};
var getVendorByUserId = async (userId) => {
  try {
    return await vendor_model_default.findOne({ userId }).lean();
  } catch (error) {
    logger_default.error("Service Error: getVendorByUserId", error);
    throw error;
  }
};
var getVendorMyListing = async (userId) => {
  try {
    const user = await auth_model_default.findById(userId).select("firstName lastName email");
    if (!user) {
      throw new Error("User not found");
    }
    const vendor = await vendor_model_default.findOne({ userId });
    if (!vendor) {
      throw new Error("Vendor not found");
    }
    const bank = await bank_model_default.findOne({
      vendorId: vendor._id,
      isActive: true
    }).select("+accountNumber +ifscCode +upiId");
    const ServiceModel = vendor.serviceType ? SERVICE_MODELS[vendor.serviceType] : null;
    let serviceData = null;
    if (ServiceModel) {
      serviceData = await ServiceModel.findOne({
        vendorId: vendor._id,
        isActive: true
      });
    }
    let subServices = [];
    if (serviceData) {
      switch (vendor.serviceType) {
        case "hotel":
          const roomTypes = await roomType_model_default.find({
            hotelId: serviceData._id,
            isActive: true
          }).select("name basePrice discountPrice capacity isActive");
          subServices = roomTypes.map((rt) => ({
            id: rt._id,
            name: rt.name,
            basePrice: rt.basePrice,
            discountPrice: rt.discountPrice,
            capacity: rt.capacity,
            isActive: rt.isActive
          }));
          break;
        case "cab":
          const cabServices = await cabService_model_default.find({
            cab: serviceData._id,
            isActive: true
          }).select("title carName cabType capacity basePrice isActive");
          subServices = cabServices.map((cs) => ({
            id: cs._id,
            name: cs.title,
            carName: cs.carName,
            cabType: cs.cabType,
            capacity: cs.capacity,
            basePrice: cs.basePrice,
            isActive: cs.isActive
          }));
          break;
        case "bike":
          const bikeServices = await bikeService_model_default.find({
            bike: serviceData._id,
            isActive: true
          }).select("title bikeName bikeType pricePerDay isActive");
          subServices = bikeServices.map((bs) => ({
            id: bs._id,
            name: bs.title,
            bikeName: bs.bikeName,
            bikeType: bs.bikeType,
            pricePerDay: bs.pricePerDay,
            isActive: bs.isActive
          }));
          break;
        case "adventure":
          const adventureServices = await service_model_default.find({
            adventure: serviceData._id,
            isActive: true
          }).select("title type basePrice isActive");
          subServices = adventureServices.map((asItem) => ({
            id: asItem._id,
            name: asItem.title,
            type: asItem.type,
            basePrice: asItem.basePrice,
            isActive: asItem.isActive
          }));
          break;
        case "tour":
          const tourServices = await tourService_model_default.find({
            tour: serviceData._id,
            isActive: true
          }).select("title duration basePrice isActive");
          subServices = tourServices.map((ts) => ({
            id: ts._id,
            name: ts.title,
            duration: ts.duration,
            basePrice: ts.basePrice,
            isActive: ts.isActive
          }));
          break;
        default:
          subServices = [];
      }
    }
    return {
      vendor: {
        vendorId: vendor._id,
        propertyId: vendor.propertyId || null,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        email: user.email,
        businessName: vendor.businessName,
        serviceType: vendor.serviceType,
        status: vendor.status
      },
      bankDetails: bank ? {
        accountHolderName: bank.accountHolderName,
        bankName: bank.bankName,
        accountNumber: bank.accountNumber,
        ifscCode: bank.ifscCode,
        branchName: bank.branchName,
        upiId: bank.upiId,
        verificationStatus: bank.verificationStatus
      } : null,
      serviceDetails: serviceData ? {
        id: serviceData._id,
        name: serviceData.name,
        description: serviceData.description,
        address: serviceData.address,
        city: serviceData.city || (serviceData.location ? serviceData.location.city : null),
        rating: typeof serviceData.rating === "number" ? serviceData.rating : serviceData.rating ? serviceData.rating.average : 0,
        verificationStatus: serviceData.verificationStatus,
        isActive: serviceData.isActive,
        advertisementImage: serviceData.advertisementImage || null,
        images: serviceData.images || []
      } : null,
      subServices
    };
  } catch (error) {
    logger_default.error("Service Error: getVendorMyListing", error);
    throw error;
  }
};
var applyForPromotion = async (userId, plan) => {
  try {
    const vendor = await vendor_model_default.findOne({ userId });
    if (!vendor) {
      throw new Error("Vendor profile not found");
    }
    if (vendor.status !== "approved") {
      throw new Error("Only approved vendors can apply for promotion");
    }
    const ServiceModel = vendor.serviceType ? SERVICE_MODELS[vendor.serviceType] : null;
    if (!ServiceModel) {
      throw new Error("Invalid vendor service type");
    }
    const serviceData = await ServiceModel.findOne({
      vendorId: vendor._id,
      isActive: true
    });
    if (!serviceData) {
      throw new Error("No active listing found to promote");
    }
    const existingPending = await promotion_model_default.findOne({
      vendorId: vendor._id,
      serviceId: serviceData._id,
      status: "pending"
    });
    if (existingPending) {
      throw new Error(
        "You already have a pending promotion request under review"
      );
    }
    const existingApproved = await promotion_model_default.findOne({
      vendorId: vendor._id,
      serviceId: serviceData._id,
      plan,
      status: "approved"
    });
    if (existingApproved) {
      throw new Error(`This listing is already active on the ${plan} plan`);
    }
    const promotion = await promotion_model_default.create({
      vendorId: vendor._id,
      serviceType: vendor.serviceType,
      serviceId: serviceData._id,
      plan,
      status: "pending"
    });
    return promotion;
  } catch (error) {
    logger_default.error("Service Error: applyForPromotion", error);
    throw error;
  }
};
var getMyPromotionRequests = async (userId) => {
  try {
    const vendor = await vendor_model_default.findOne({ userId });
    if (!vendor) {
      throw new Error("Vendor profile not found");
    }
    const requests = await promotion_model_default.find({ vendorId: vendor._id }).sort({ createdAt: -1 }).lean();
    return requests;
  } catch (error) {
    logger_default.error("Service Error: getMyPromotionRequests", error);
    throw error;
  }
};
var getPropertySettings = async (userId) => {
  try {
    const vendor = await vendor_model_default.findOne({ userId });
    if (!vendor) {
      throw new Error("Vendor profile not found");
    }
    const ServiceModel = vendor.serviceType ? SERVICE_MODELS[vendor.serviceType] : null;
    if (!ServiceModel) {
      throw new Error(`Unsupported service type: ${vendor.serviceType}`);
    }
    const serviceData = await ServiceModel.findOne({
      vendorId: vendor._id,
      isActive: true
    });
    if (!serviceData) {
      throw new Error("Property listing not found for this vendor");
    }
    const addr = serviceData.address;
    const addrString = typeof addr === "string" ? addr : addr?.formattedAddress || addr?.streetAddress || "";
    return {
      serviceType: vendor.serviceType,
      propertyId: serviceData._id,
      name: serviceData.name,
      description: serviceData.description || "",
      address: addrString,
      addressDetails: typeof addr === "object" ? addr : null,
      city: addr?.city || serviceData.city || serviceData.location?.city || "",
      areaName: addr?.areaName || "",
      district: addr?.district || "",
      state: addr?.state || serviceData.location?.state || "",
      postalCode: addr?.postalCode || "",
      country: addr?.country || serviceData.location?.country || "India",
      landmark: addr?.landmark || "",
      buildingName: addr?.buildingName || "",
      doorNumber: addr?.doorNumber || "",
      directions: addr?.directions || "",
      formattedAddress: addr?.formattedAddress || addrString || "",
      coordinates: serviceData.coordinates || serviceData.location?.coordinates || addr?.location?.coordinates || null,
      images: serviceData.images || [],
      amenities: serviceData.amenities || serviceData.features || [],
      locationHistory: serviceData.locationHistory || [],
      advertisementImage: serviceData.advertisementImage || null
    };
  } catch (error) {
    logger_default.error("Service Error: getPropertySettings", error);
    throw error;
  }
};
var updatePropertySettings = async (userId, payload) => {
  try {
    const vendor = await vendor_model_default.findOne({ userId });
    if (!vendor) {
      throw new Error("Vendor profile not found");
    }
    const ServiceModel = vendor.serviceType ? SERVICE_MODELS[vendor.serviceType] : null;
    if (!ServiceModel) {
      throw new Error(`Unsupported service type: ${vendor.serviceType}`);
    }
    const serviceData = await ServiceModel.findOne({
      vendorId: vendor._id,
      isActive: true
    });
    if (!serviceData) {
      throw new Error("Property listing not found for this vendor");
    }
    const {
      description,
      images,
      amenities,
      features,
      address,
      city,
      state,
      country,
      areaName,
      district,
      postalCode,
      landmark,
      buildingName,
      doorNumber,
      directions,
      formattedAddress,
      coordinates,
      lat,
      lng
    } = payload;
    const currentAddrObj = typeof serviceData.address === "object" && serviceData.address !== null ? serviceData.address : null;
    const currentAddress = (currentAddrObj?.formattedAddress || currentAddrObj?.streetAddress || serviceData.address || "").trim();
    const currentCity = (currentAddrObj?.city || serviceData.city || serviceData.location?.city || "").trim();
    const newAddress = address !== void 0 ? address.trim() : currentAddress;
    const newCity = city !== void 0 ? city.trim() : currentCity;
    const locationChanged = address !== void 0 && newAddress !== currentAddress || city !== void 0 && newCity.toLowerCase() !== currentCity.toLowerCase() || areaName !== void 0 || lat !== void 0 || lng !== void 0;
    if (locationChanged) {
      if (!serviceData.locationHistory) {
        serviceData.locationHistory = [];
      }
      serviceData.locationHistory.unshift({
        address: currentAddrObj || currentAddress,
        city: currentCity,
        state: serviceData.location?.state || currentAddrObj?.state || "",
        country: serviceData.location?.country || currentAddrObj?.country || "India",
        coordinates: serviceData.coordinates || serviceData.location?.coordinates || currentAddrObj?.location?.coordinates || null,
        changedAt: /* @__PURE__ */ new Date()
      });
    }
    if (description !== void 0) serviceData.description = description.trim();
    if (images !== void 0 && Array.isArray(images)) {
      if (serviceData.images && Array.isArray(serviceData.images) && serviceData.images.length > 0) {
        const remainingPublicIds = new Set(
          images.map((img) => img?.public_id).filter(Boolean)
        );
        for (const img of serviceData.images) {
          if (img?.public_id && !remainingPublicIds.has(img.public_id)) {
            try {
              await cloudinary_default.uploader.destroy(img.public_id, {
                resource_type: img.resource_type || "image"
              });
            } catch (destroyErr) {
              logger_default.warn(
                "Could not delete removed property image from Cloudinary",
                destroyErr
              );
            }
          }
        }
      }
      serviceData.images = images;
    }
    if (amenities !== void 0) serviceData.amenities = amenities;
    if (features !== void 0) serviceData.features = features;
    let resolvedLng = 72.8777;
    let resolvedLat = 19.076;
    if (coordinates && Array.isArray(coordinates) && coordinates.length >= 2) {
      resolvedLng = Number(coordinates[0]) || 72.8777;
      resolvedLat = Number(coordinates[1]) || 19.076;
    } else if (lat !== void 0 && lng !== void 0) {
      resolvedLat = Number(lat) || 19.076;
      resolvedLng = Number(lng) || 72.8777;
    } else if (serviceData.location?.coordinates?.length >= 2) {
      resolvedLng = serviceData.location.coordinates[0];
      resolvedLat = serviceData.location.coordinates[1];
    } else if (serviceData.coordinates?.lat && serviceData.coordinates?.lng) {
      resolvedLat = serviceData.coordinates.lat;
      resolvedLng = serviceData.coordinates.lng;
    }
    const updatedAddrObj = {
      buildingName: buildingName !== void 0 ? buildingName : currentAddrObj?.buildingName || "",
      doorNumber: doorNumber !== void 0 ? doorNumber : currentAddrObj?.doorNumber || "",
      streetAddress: address !== void 0 ? address : currentAddrObj?.streetAddress || currentAddress,
      areaName: areaName !== void 0 ? areaName : currentAddrObj?.areaName || "",
      city: newCity || currentCity,
      district: district !== void 0 ? district : currentAddrObj?.district || "",
      state: state !== void 0 ? state : currentAddrObj?.state || serviceData.location?.state || "",
      postalCode: postalCode !== void 0 ? postalCode : currentAddrObj?.postalCode || "",
      country: country !== void 0 ? country : currentAddrObj?.country || serviceData.location?.country || "India",
      countryCode: "IN",
      landmark: landmark !== void 0 ? landmark : currentAddrObj?.landmark || "",
      directions: directions !== void 0 ? directions : currentAddrObj?.directions || "",
      formattedAddress: formattedAddress !== void 0 ? formattedAddress : address || currentAddress || newCity,
      location: {
        type: "Point",
        coordinates: [resolvedLng, resolvedLat]
      }
    };
    if (!updatedAddrObj.formattedAddress) {
      const parts = [
        updatedAddrObj.doorNumber,
        updatedAddrObj.buildingName,
        updatedAddrObj.streetAddress,
        updatedAddrObj.areaName,
        updatedAddrObj.landmark,
        updatedAddrObj.city,
        updatedAddrObj.district,
        updatedAddrObj.state,
        updatedAddrObj.postalCode,
        updatedAddrObj.country
      ].filter(Boolean);
      updatedAddrObj.formattedAddress = parts.join(", ");
    }
    serviceData.address = updatedAddrObj;
    if (vendor.serviceType === "hotel") {
      serviceData.city = newCity;
      serviceData.location = {
        type: "Point",
        coordinates: [resolvedLng, resolvedLat]
      };
    } else {
      if (!serviceData.location) serviceData.location = {};
      serviceData.location.city = newCity;
      if (state !== void 0) serviceData.location.state = state.trim();
      if (country !== void 0) serviceData.location.country = country.trim();
      serviceData.coordinates = {
        lat: resolvedLat,
        lng: resolvedLng
      };
    }
    await serviceData.save();
    return {
      serviceType: vendor.serviceType,
      propertyId: serviceData._id,
      name: serviceData.name,
      description: serviceData.description,
      address: updatedAddrObj.streetAddress || updatedAddrObj.formattedAddress,
      addressDetails: updatedAddrObj,
      city: newCity,
      areaName: updatedAddrObj.areaName,
      district: updatedAddrObj.district,
      state: serviceData.location?.state || updatedAddrObj.state,
      postalCode: updatedAddrObj.postalCode,
      country: serviceData.location?.country || updatedAddrObj.country,
      coordinates: serviceData.coordinates || serviceData.location?.coordinates || [resolvedLng, resolvedLat],
      images: serviceData.images,
      amenities: serviceData.amenities || serviceData.features || [],
      locationHistory: serviceData.locationHistory || []
    };
  } catch (error) {
    logger_default.error("Service Error: updatePropertySettings", error);
    throw error;
  }
};
var VendorService = class {
  async getVendorMe(userId) {
    return getVendorMe(userId);
  }
  async createVendorProfile(userId, vendorData) {
    return createVendorProfile(userId, vendorData);
  }
  async submitVendor(vendor) {
    return submitVendor(vendor);
  }
  async getVendorByUserId(userId) {
    return getVendorByUserId(userId);
  }
  async getVendorMyListing(userId) {
    return getVendorMyListing(userId);
  }
  async applyForPromotion(userId, plan) {
    return applyForPromotion(userId, plan);
  }
  async getMyPromotionRequests(userId) {
    return getMyPromotionRequests(userId);
  }
  async getPropertySettings(userId) {
    return getPropertySettings(userId);
  }
  async updatePropertySettings(userId, payload) {
    return updatePropertySettings(userId, payload);
  }
};
var vendorService = new VendorService();
var vendor_service_default = vendorService;

// src/modules/vendors/vendor.controller.ts
var SERVICE_MODELS2 = {
  hotel: hotel_model_default,
  tour: tour_model_default,
  cab: cab_model_default,
  bike: bike_model_default,
  adventure: adventure_model_default
};
var VendorController = class {
  // get me help for prefilling data
  async getVendorMe(req, res, next) {
    try {
      const userId = req.user._id;
      const data = await vendor_service_default.getVendorMe(userId);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      logger_default.error("Controller Error: getVendorMe", error);
      next(error);
    }
  }
  // vendor profile create step-2
  async createVendorProfile(req, res, next) {
    try {
      const userId = req.user._id;
      const vendor = await vendor_service_default.createVendorProfile(userId, req.body);
      res.status(200).json({
        success: true,
        message: "Step 2 saved successfully",
        data: {
          currentStep: vendor.currentStep,
          registrationStep: vendor.registrationStep,
          status: vendor.status
        }
      });
    } catch (error) {
      logger_default.error("Controller Error: createVendorProfile", error);
      next(error);
    }
  }
  // final step of registration step-5
  async submitVendor(req, res, next) {
    try {
      const userId = req.user._id;
      const vendor = await vendor_model_default.findOne({ userId });
      if (!vendor) {
        throw new Error("Vendor profile not found");
      }
      const updatedVendor = await vendor_service_default.submitVendor(vendor);
      res.status(200).json({
        success: true,
        message: "Submitted successfully. Waiting for admin approval.",
        data: {
          status: updatedVendor.status,
          currentStep: updatedVendor.currentStep
        }
      });
    } catch (error) {
      logger_default.error("Controller Error: submitVendor", error);
      next(error);
    }
  }
  // get booking list in dashboard-vendor
  async getVendorBookings(req, res, next) {
    try {
      const vendor = await vendor_model_default.findOne({ userId: req.user._id });
      if (!vendor || vendor.status !== "approved") {
        res.status(403).json({
          success: false,
          message: "Vendor not approved or not found"
        });
        return;
      }
      const result = await booking_service_default.getVendorBookings(
        vendor._id,
        req.query
      );
      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      logger_default.error("Vendor Booking List Error:", error);
      next(error);
    }
  }
  // get booking detail in dashboard-vendor
  async getVendorBookingDetail(req, res, next) {
    try {
      const vendor = await vendor_model_default.findOne({ userId: req.user._id });
      if (!vendor || vendor.status !== "approved") {
        res.status(403).json({
          success: false,
          message: "Vendor not approved or not found"
        });
        return;
      }
      const booking = await roomType_service_default.getVendorBookingDetail(
        req.params.id,
        vendor._id
      );
      res.status(200).json({
        success: true,
        data: booking
      });
    } catch (error) {
      logger_default.error("Vendor Booking Detail Error:", error);
      next(error);
    }
  }
  // get in dashboard room type controller
  async getVendorRoomTypes(req, res, next) {
    try {
      const vendor = await vendor_model_default.findOne({ userId: req.user._id });
      if (!vendor || vendor.status !== "approved") {
        res.status(403).json({
          success: false,
          message: "Vendor not approved or not found"
        });
        return;
      }
      const result = await roomType_service_default.getVendorRoomTypes(
        vendor._id,
        req.query
      );
      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      logger_default.error("Vendor RoomType List Error:", error);
      next(error);
    }
  }
  // get room type detail in dashboard-vendor
  async getVendorRoomTypeDetail(req, res, next) {
    try {
      const vendor = await vendor_model_default.findOne({ userId: req.user._id });
      if (!vendor || vendor.status !== "approved") {
        res.status(403).json({
          success: false,
          message: "Vendor not approved or not found"
        });
        return;
      }
      const result = await roomType_service_default.getVendorRoomTypeDetail(
        req.params.id,
        vendor._id
      );
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger_default.error("Vendor RoomType Detail Error:", error);
      next(error);
    }
  }
  // invoice
  async getVendorInvoices(req, res, next) {
    try {
      const vendor = await vendor_model_default.findOne({ userId: req.user._id });
      if (!vendor || vendor.status !== "approved") {
        res.status(403).json({
          success: false,
          message: "Vendor not approved or not found"
        });
        return;
      }
      const result = await booking_service_default.getVendorInvoices(
        vendor._id,
        req.query
      );
      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      logger_default.error("Vendor Invoice List Error:", error);
      next(error);
    }
  }
  // invoice download vendor
  async downloadInvoicePdf(req, res, next) {
    try {
      const vendor = await vendor_model_default.findOne({ userId: req.user._id });
      if (!vendor || vendor.status !== "approved") {
        res.status(403).json({
          success: false,
          message: "Vendor not authorized"
        });
        return;
      }
      await booking_service_default.generateInvoicePdf(
        req.params.bookingId,
        vendor._id,
        res
      );
    } catch (error) {
      logger_default.error("Download Invoice Error:", error);
      next(error);
    }
  }
  // vendor dashboard
  async getVendorDashboard(req, res, next) {
    try {
      const vendor = await vendor_model_default.findOne({ userId: req.user._id }).select("_id status").lean();
      if (!vendor || vendor.status !== "approved") {
        res.status(403).json({
          success: false,
          message: "Vendor not authorized"
        });
        return;
      }
      const reservationDays = parseInt(req.query.reservationDays) || 7;
      const revenueMonths = parseInt(req.query.revenueMonths) || 6;
      const data = await booking_service_default.getVendorDashboard(
        vendor._id,
        reservationDays,
        revenueMonths
      );
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      logger_default.error("Dashboard Error:", error);
      next(error);
    }
  }
  // user check-in
  async checkInBooking(req, res, next) {
    try {
      const vendor = await vendor_model_default.findOne({ userId: req.user._id });
      if (!vendor || vendor.status !== "approved") {
        res.status(403).json({ message: "Unauthorized vendor" });
        return;
      }
      const result = await booking_service_default.checkInBooking(
        req.params.id,
        vendor._id
      );
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      logger_default.error("Check-in Error:", err);
      next(err);
    }
  }
  // user staying
  async markBookingStaying(req, res, next) {
    try {
      const vendor = await vendor_model_default.findOne({ userId: req.user._id });
      if (!vendor || vendor.status !== "approved") {
        res.status(403).json({ message: "Unauthorized vendor" });
        return;
      }
      const result = await booking_service_default.markBookingStaying(
        req.params.id,
        vendor._id
      );
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      logger_default.error("Staying Error:", err);
      next(err);
    }
  }
  // user check-out
  async checkOutBooking(req, res, next) {
    try {
      const vendor = await vendor_model_default.findOne({ userId: req.user._id });
      if (!vendor || vendor.status !== "approved") {
        res.status(403).json({ message: "Unauthorized vendor" });
        return;
      }
      const result = await booking_service_default.checkOutBooking(
        req.params.id,
        vendor._id
      );
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      logger_default.error("Check-out Error:", err);
      next(err);
    }
  }
  // Get vendor's my listing data
  async getVendorMyListing(req, res, next) {
    try {
      const userId = req.user._id;
      const data = await vendor_service_default.getVendorMyListing(userId);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      logger_default.error("Controller Error: getVendorMyListing", error);
      next(error);
    }
  }
  async applyForPromotion(req, res, next) {
    try {
      const userId = req.user._id;
      const { plan } = req.body;
      if (!plan) {
        res.status(400).json({
          success: false,
          message: "Plan name is required"
        });
        return;
      }
      const validPlans = ["Boost", "Premium", "Elite"];
      if (!validPlans.includes(plan)) {
        res.status(400).json({
          success: false,
          message: "Invalid plan. Choose between Boost, Premium, or Elite"
        });
        return;
      }
      const data = await vendor_service_default.applyForPromotion(userId, plan);
      res.status(201).json({
        success: true,
        message: "Promotion request submitted successfully",
        data
      });
    } catch (error) {
      logger_default.error("Controller Error: applyForPromotion", error);
      next(error);
    }
  }
  async getMyPromotionRequests(req, res, next) {
    try {
      const userId = req.user._id;
      const data = await vendor_service_default.getMyPromotionRequests(userId);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      logger_default.error("Controller Error: getMyPromotionRequests", error);
      next(error);
    }
  }
  async updateVendorLogo(req, res, next) {
    try {
      const userId = req.user._id;
      const { logo } = req.body;
      const vendor = await vendor_model_default.findOne({ userId });
      if (!vendor) {
        res.status(404).json({
          success: false,
          message: "Vendor profile not found"
        });
        return;
      }
      const oldPublicId = vendor.logo?.public_id;
      const newPublicId = typeof logo === "object" ? logo?.public_id : null;
      if (typeof logo === "string") {
        vendor.logo = { url: logo, public_id: "", resource_type: "image" };
      } else if (logo && logo.url) {
        vendor.logo = logo;
      } else if (logo === null || logo === "") {
        vendor.logo = void 0;
      }
      await vendor.save();
      if (oldPublicId && oldPublicId !== newPublicId) {
        upload_service_default.deleteFile(oldPublicId, "image").catch((err) => {
          logger_default.error("Failed to delete previous vendor logo from Cloudinary:", err);
        });
      }
      if (vendor.logo?.url) {
        await auth_model_default.findByIdAndUpdate(userId, { avatar: vendor.logo.url });
      }
      res.status(200).json({
        success: true,
        message: "Company logo updated successfully",
        data: { logo: vendor.logo }
      });
    } catch (error) {
      logger_default.error("Controller Error: updateVendorLogo", error);
      next(error);
    }
  }
  async updateAdvertisementImage(req, res, next) {
    try {
      const userId = req.user._id;
      const { advertisementImage } = req.body;
      const vendor = await vendor_model_default.findOne({ userId });
      if (!vendor) {
        res.status(404).json({
          success: false,
          message: "Vendor profile not found"
        });
        return;
      }
      const ServiceModel = vendor.serviceType ? SERVICE_MODELS2[vendor.serviceType] : null;
      if (!ServiceModel) {
        res.status(400).json({
          success: false,
          message: `Unsupported service type: ${vendor.serviceType}`
        });
        return;
      }
      const serviceData = await ServiceModel.findOne({
        vendorId: vendor._id,
        isActive: true
      });
      if (!serviceData) {
        res.status(404).json({
          success: false,
          message: "Property listing not found for this vendor"
        });
        return;
      }
      const oldPublicId = serviceData.advertisementImage?.public_id;
      const newPublicId = typeof advertisementImage === "object" ? advertisementImage?.public_id : null;
      if (typeof advertisementImage === "string") {
        serviceData.advertisementImage = {
          url: advertisementImage,
          public_id: "",
          resource_type: "image"
        };
      } else if (advertisementImage && advertisementImage.url) {
        serviceData.advertisementImage = advertisementImage;
      } else if (advertisementImage === null || advertisementImage === "") {
        serviceData.advertisementImage = void 0;
      }
      await serviceData.save();
      if (oldPublicId && oldPublicId !== newPublicId) {
        try {
          upload_service_default.deleteFile(oldPublicId, "image").catch((err) => {
            logger_default.error("Failed to delete previous advertisement image from Cloudinary:", err);
          });
        } catch (err) {
        }
      }
      res.status(200).json({
        success: true,
        message: "Advertisement banner image updated successfully",
        data: { advertisementImage: serviceData.advertisementImage || null }
      });
    } catch (error) {
      logger_default.error("Controller Error: updateAdvertisementImage", error);
      next(error);
    }
  }
  async getPropertySettings(req, res, next) {
    try {
      const userId = req.user._id;
      const data = await vendor_service_default.getPropertySettings(userId);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      logger_default.error("Controller Error: getPropertySettings", error);
      next(error);
    }
  }
  async updatePropertySettings(req, res, next) {
    try {
      const userId = req.user._id;
      const data = await vendor_service_default.updatePropertySettings(userId, req.body);
      res.status(200).json({
        success: true,
        message: "Property settings updated successfully",
        data
      });
    } catch (error) {
      logger_default.error("Controller Error: updatePropertySettings", error);
      next(error);
    }
  }
};
var vendorController = new VendorController();
var getVendorMe2 = vendorController.getVendorMe.bind(vendorController);
var createVendorProfile2 = vendorController.createVendorProfile.bind(vendorController);
var submitVendor2 = vendorController.submitVendor.bind(vendorController);
var getVendorBookings2 = vendorController.getVendorBookings.bind(vendorController);
var getVendorBookingDetail2 = vendorController.getVendorBookingDetail.bind(vendorController);
var getVendorRoomTypes3 = vendorController.getVendorRoomTypes.bind(vendorController);
var getVendorRoomTypeDetail2 = vendorController.getVendorRoomTypeDetail.bind(vendorController);
var getVendorInvoices2 = vendorController.getVendorInvoices.bind(vendorController);
var downloadInvoicePdf = vendorController.downloadInvoicePdf.bind(vendorController);
var getVendorDashboard2 = vendorController.getVendorDashboard.bind(vendorController);
var checkInBooking2 = vendorController.checkInBooking.bind(vendorController);
var markBookingStaying2 = vendorController.markBookingStaying.bind(vendorController);
var checkOutBooking2 = vendorController.checkOutBooking.bind(vendorController);
var getVendorMyListing2 = vendorController.getVendorMyListing.bind(vendorController);
var applyForPromotion2 = vendorController.applyForPromotion.bind(vendorController);
var getMyPromotionRequests2 = vendorController.getMyPromotionRequests.bind(vendorController);
var updateVendorLogo = vendorController.updateVendorLogo.bind(vendorController);
var updateAdvertisementImage = vendorController.updateAdvertisementImage.bind(vendorController);
var getPropertySettings2 = vendorController.getPropertySettings.bind(vendorController);
var updatePropertySettings2 = vendorController.updatePropertySettings.bind(vendorController);

// src/modules/bookings/booking.controller.ts
var BookingController = class {
  //Create Booking
  async createBooking(req, res, next) {
    try {
      const booking = await booking_service_default.createBooking(
        req.body,
        req.user._id
      );
      res.status(201).json({
        success: true,
        message: "Booking Created Payment Pending",
        data: booking
      });
    } catch (error) {
      logger_default.error("Controller Error: createBooking", error);
      next(error);
    }
  }
  //Get logged-in user's bookings
  async getMyBookings(req, res, next) {
    try {
      const bookings = await booking_service_default.getUserBookings(
        req.user._id
      );
      res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings
      });
    } catch (err) {
      logger_default.error("Controller Error: getMyBookings", err);
      next(err);
    }
  }
  // user booking invoice download
  async downloadMyInvoice(req, res, next) {
    try {
      const booking = await booking_model_default.findOne({
        _id: req.params.bookingId,
        userId: req.user._id
      }).populate({
        path: "roomTypeId",
        select: "name basePrice discountPrice roomSizeSqm beds amenities"
      }).lean();
      if (!booking) {
        res.status(404).json({
          success: false,
          message: "Booking not found or you are not authorized to view this invoice"
        });
        return;
      }
      await booking_service_default.userInvoiceDownload(booking, res);
    } catch (error) {
      logger_default.error("User Invoice Download Error:", error);
      next(error);
    }
  }
  //get booking detail by id
  async getBookingById(req, res, next) {
    try {
      const booking = await booking_service_default.getBookingDetail(
        req.params.id,
        req.user._id
      );
      res.status(200).json({
        success: true,
        data: booking
      });
    } catch (err) {
      next(err);
    }
  }
  // Get refund preview before cancellation
  async getRefundPreview(req, res, next) {
    try {
      const result = await booking_service_default.getRefundPreview(
        req.params.id,
        req.user._id
      );
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger_default.error("Controller Error: getRefundPreview", error);
      next(error);
    }
  }
  // Cancel booking ( refund request)
  async cancelBooking(req, res, next) {
    try {
      const booking = await booking_service_default.cancelBooking(
        req.params.id,
        req.user._id,
        req.body.reason
      );
      res.status(200).json({
        success: true,
        message: "Cancellation request submitted",
        data: booking
      });
    } catch (err) {
      logger_default.error("Controller Error: cancelBooking", err);
      next(err);
    }
  }
  //Admin approve/reject refund request
  async handleRefund(req, res, next) {
    try {
      const booking = await booking_service_default.adminHandleRefund(
        req.params.id,
        req.body.action
        //approve | reject
      );
      res.status(200).json({
        success: true,
        data: booking
      });
    } catch (err) {
      next(err);
    }
  }
};

// src/modules/task/task.model.ts
var import_mongoose28 = __toESM(require("mongoose"), 1);
var taskSchema = new import_mongoose28.Schema(
  {
    vendorId: {
      type: import_mongoose28.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    dueDate: {
      type: Date
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
      index: true
    }
  },
  { timestamps: true }
);
taskSchema.index({ vendorId: 1, status: 1 });
var Task = import_mongoose28.default.model("Task", taskSchema);
var task_model_default = Task;

// src/modules/task/task.service.ts
var import_mongoose29 = __toESM(require("mongoose"), 1);
var getTasks = async (vendorId, query = {}) => {
  const { page = 1, limit = 10, status } = query;
  const filter = { vendorId };
  if (status) filter.status = status;
  const skip = (Number(page) - 1) * Number(limit);
  const tasks = await task_model_default.find(filter).sort("-createdAt").skip(skip).limit(Number(limit)).lean();
  const total = await task_model_default.countDocuments(filter);
  return {
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    data: tasks
  };
};
var createTask = async (vendorId, data) => {
  return await task_model_default.create({ ...data, vendorId });
};
var updateTask = async (taskId, vendorId, data) => {
  if (!import_mongoose29.default.Types.ObjectId.isValid(taskId)) {
    throw new Error("Invalid task id");
  }
  const task = await task_model_default.findOneAndUpdate({ _id: taskId, vendorId }, data, {
    new: true
  });
  if (!task) throw new Error("Task not found");
  return task;
};
var deleteTask = async (taskId, vendorId) => {
  const task = await task_model_default.findOneAndDelete({ _id: taskId, vendorId });
  if (!task) throw new Error("Task not found");
  return task;
};
var TaskService = class {
  async getTasks(vendorId, query = {}) {
    return getTasks(vendorId, query);
  }
  async createTask(vendorId, data) {
    return createTask(vendorId, data);
  }
  async updateTask(taskId, vendorId, data) {
    return updateTask(taskId, vendorId, data);
  }
  async deleteTask(taskId, vendorId) {
    return deleteTask(taskId, vendorId);
  }
};
var taskService = new TaskService();
var task_service_default = taskService;

// src/modules/task/task.controller.ts
var TaskController = class {
  async getTasks(req, res, next) {
    try {
      const vendor = await vendor_model_default.findOne({ userId: req.user._id });
      if (!vendor) {
        res.status(404).json({ success: false, message: "Vendor profile not found" });
        return;
      }
      const result = await task_service_default.getTasks(vendor._id, req.query);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }
  async createTask(req, res, next) {
    try {
      const vendor = await vendor_model_default.findOne({ userId: req.user._id });
      if (!vendor) {
        res.status(404).json({ success: false, message: "Vendor profile not found" });
        return;
      }
      const task = await task_service_default.createTask(vendor._id, req.body);
      res.status(201).json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  }
  async updateTask(req, res, next) {
    try {
      const vendor = await vendor_model_default.findOne({ userId: req.user._id });
      if (!vendor) {
        res.status(404).json({ success: false, message: "Vendor profile not found" });
        return;
      }
      const task = await task_service_default.updateTask(
        req.params.id,
        vendor._id,
        req.body
      );
      res.status(200).json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  }
  async deleteTask(req, res, next) {
    try {
      const vendor = await vendor_model_default.findOne({ userId: req.user._id });
      if (!vendor) {
        res.status(404).json({ success: false, message: "Vendor profile not found" });
        return;
      }
      await task_service_default.deleteTask(req.params.id, vendor._id);
      res.status(200).json({ success: true, message: "Task deleted" });
    } catch (error) {
      next(error);
    }
  }
};

// src/modules/vendors/vendor.routes.ts
var router7 = (0, import_express7.Router)();
var vendorController2 = new VendorController();
var bookingController = new BookingController();
var hotelController3 = new HotelController();
var taskController = new TaskController();
router7.post(
  "/register",
  protect,
  authorize("vendor"),
  vendorController2.createVendorProfile
);
router7.get("/me", protect, authorize("vendor"), vendorController2.getVendorMe);
router7.patch(
  "/logo",
  protect,
  authorize("vendor"),
  vendorController2.updateVendorLogo
);
router7.patch(
  "/advertisement-image",
  protect,
  authorize("vendor"),
  vendorController2.updateAdvertisementImage
);
router7.get(
  "/property-settings",
  protect,
  authorize("vendor"),
  vendorController2.getPropertySettings
);
router7.patch(
  "/property-settings",
  protect,
  authorize("vendor"),
  vendorController2.updatePropertySettings
);
router7.get(
  "/my-listing",
  protect,
  authorize("vendor"),
  vendorController2.getVendorMyListing
);
router7.get(
  "/bookings",
  protect,
  authorize("vendor"),
  vendorController2.getVendorBookings
);
router7.get(
  "/bookings/:id",
  protect,
  authorize("vendor"),
  vendorController2.getVendorBookingDetail
);
router7.patch(
  "/bookings/:id/refund",
  protect,
  authorize("admin"),
  bookingController.handleRefund
);
router7.get(
  "/room-types",
  protect,
  authorize("vendor"),
  vendorController2.getVendorRoomTypes
);
router7.get(
  "/room-types/:id",
  protect,
  authorize("vendor"),
  vendorController2.getVendorRoomTypeDetail
);
router7.post(
  "/hotels",
  protect,
  authorize("vendor"),
  hotelController3.createHotel
);
router7.post(
  "/submit",
  protect,
  authorize("vendor"),
  vendorController2.submitVendor
);
router7.patch(
  "/hotels/:id",
  protect,
  authorize("vendor"),
  hotelController3.updateHotel
);
router7.get(
  "/invoices",
  protect,
  authorize("vendor"),
  vendorController2.getVendorInvoices
);
router7.get(
  "/invoices/:bookingId/download",
  protect,
  authorize("vendor"),
  vendorController2.downloadInvoicePdf
);
router7.get(
  "/dashboard",
  protect,
  authorize("vendor"),
  vendorController2.getVendorDashboard
);
router7.patch(
  "/bookings/:id/check-in",
  protect,
  authorize("vendor"),
  vendorController2.checkInBooking
);
router7.patch(
  "/bookings/:id/staying",
  protect,
  authorize("vendor"),
  vendorController2.markBookingStaying
);
router7.patch(
  "/bookings/:id/check-out",
  protect,
  authorize("vendor"),
  vendorController2.checkOutBooking
);
router7.get("/tasks", protect, authorize("vendor"), taskController.getTasks);
router7.post("/tasks", protect, authorize("vendor"), taskController.createTask);
router7.patch(
  "/tasks/:id",
  protect,
  authorize("vendor"),
  taskController.updateTask
);
router7.delete(
  "/tasks/:id",
  protect,
  authorize("vendor"),
  taskController.deleteTask
);
router7.post(
  "/promotions/apply",
  protect,
  authorize("vendor"),
  vendorController2.applyForPromotion
);
router7.get(
  "/promotions/my-requests",
  protect,
  authorize("vendor"),
  vendorController2.getMyPromotionRequests
);
var vendor_routes_default = router7;

// src/modules/policies/policy.routes.ts
var import_express8 = require("express");

// src/modules/policies/policy.model.ts
var import_mongoose30 = __toESM(require("mongoose"), 1);
var policySchema = new import_mongoose30.Schema(
  {
    hotelId: {
      type: import_mongoose30.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      unique: true
    },
    checkInTime: String,
    checkOutTime: String,
    cancellationPolicy: String,
    prepaymentRequired: Boolean,
    childrenAllowed: Boolean,
    extraBedPolicy: String,
    ageRestriction: String,
    smokingAllowed: Boolean,
    petsAllowed: Boolean,
    quietHours: String
  },
  { timestamps: true }
);
var HotelPolicy = import_mongoose30.default.model("HotelPolicy", policySchema);
var policy_model_default = HotelPolicy;

// src/modules/policies/policy.service.ts
var upsertPolicy = async (hotelId, data) => {
  try {
    return await policy_model_default.findOneAndUpdate(
      { hotelId },
      { $set: data },
      { new: true, upsert: true, runValidators: true }
    );
  } catch (error) {
    logger_default.error("Service Error: upsertPolicy", error);
    throw error;
  }
};
var getPolicyByHotel = async (hotelId) => {
  try {
    const policy = await policy_model_default.findOne({ hotelId }).lean();
    return policy || {};
  } catch (error) {
    logger_default.error("Service Error: getPolicyByHotel", error);
    throw error;
  }
};
var PolicyService = class {
  async upsertPolicy(hotelId, data) {
    return upsertPolicy(hotelId, data);
  }
  async getPolicyByHotel(hotelId) {
    return getPolicyByHotel(hotelId);
  }
};
var policyService = new PolicyService();
var policy_service_default = policyService;

// src/modules/policies/policy.controller.ts
var PolicyController = class {
  //Vendor: set policy
  async setPolicy(req, res, next) {
    try {
      const vendor = await vendor_model_default.findOne({ userId: req.user._id });
      if (!vendor) throw new Error("Vendor profile not found");
      const hotel = await hotel_model_default.findOne({
        _id: req.body.hotelId,
        vendorId: vendor._id
      });
      if (!hotel) throw new Error("Unauthorized hotel access");
      const policy = await policy_service_default.upsertPolicy(req.body.hotelId, req.body);
      res.status(200).json({
        success: true,
        message: "Hotel policy updated",
        data: policy
      });
    } catch (error) {
      logger_default.error("Controller Error: setPolicy", error);
      next(error);
    }
  }
  //User: get policy
  async getPolicy(req, res, next) {
    try {
      const policy = await policy_service_default.getPolicyByHotel(req.params.hotelId);
      res.status(200).json({
        success: true,
        data: policy
      });
    } catch (error) {
      logger_default.error("Controller Error: getPolicy", error);
      next(error);
    }
  }
};

// src/modules/policies/policy.routes.ts
var router8 = (0, import_express8.Router)();
var controller2 = new PolicyController();
router8.get("/hotel/:hotelId", controller2.getPolicy);
router8.use(protect);
router8.post("/", authorize("vendor"), controller2.setPolicy);
var policy_routes_default = router8;

// src/modules/bookings/booking.routes.ts
var import_express9 = require("express");
var router9 = (0, import_express9.Router)();
var bookingController2 = new BookingController();
router9.use(protect, authorize("user"));
router9.post("/", bookingController2.createBooking);
router9.get("/my-bookings", bookingController2.getMyBookings);
router9.get("/my-bookings/:bookingId/download", bookingController2.downloadMyInvoice);
router9.patch("/:id/cancel", bookingController2.cancelBooking);
router9.get("/:id/refund-preview", bookingController2.getRefundPreview);
router9.get("/:id", bookingController2.getBookingById);
var booking_routes_default = router9;

// src/modules/payments/payment.routes.ts
var import_express10 = require("express");

// src/modules/payments/payment.service.ts
var import_mongoose31 = __toESM(require("mongoose"), 1);
var import_crypto4 = __toESM(require("crypto"), 1);
init_availability_model();
var verifyPayment = async (data) => {
  const session = await import_mongoose31.default.startSession();
  session.startTransaction();
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new Error("Missing payment verification data");
    }
    const payment = await payment_model_default.findOne({
      razorpayOrderId: razorpay_order_id
    }).session(session);
    if (!payment) throw new Error("Payment record not found");
    if (payment.isVerified && payment.status === "captured") {
      const existingBooking = await booking_model_default.findById(payment.bookingId).session(
        session
      );
      await session.commitTransaction();
      session.endSession();
      return existingBooking;
    }
    if (payment.status !== "created") {
      throw new Error("Invalid payment state");
    }
    if (payment.expiresAt && payment.expiresAt < /* @__PURE__ */ new Date()) {
      throw new Error("Payment session expired");
    }
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = import_crypto4.default.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "").update(body).digest("hex");
    if (expectedSignature !== razorpay_signature) {
      throw new Error("Invalid payment signature");
    }
    const razorpayPayment = await razorpay_default.payments.fetch(razorpay_payment_id);
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = "captured";
    payment.isVerified = true;
    payment.paymentMethod = razorpayPayment.method || "unknown";
    payment.expiresAt = void 0;
    await payment.save({ session });
    const booking = await booking_model_default.findById(payment.bookingId).session(session);
    if (!booking) throw new Error("Booking not found");
    if (booking.expiresAt && booking.expiresAt < /* @__PURE__ */ new Date()) {
      throw new Error("Booking expired. Please create a new booking.");
    }
    if (booking.status !== "pending") {
      throw new Error("Invalid booking state");
    }
    if (payment.amountPaid !== booking.totalAmount) {
      throw new Error("Payment amount mismatch");
    }
    const hotel = await hotel_model_default.findById(booking.hotelId).session(session);
    if (!hotel || !hotel.isActive) {
      throw new Error("Hotel no longer available");
    }
    const roomTypeData = await roomType_model_default.findById(booking.roomTypeId).session(
      session
    );
    if (!roomTypeData) {
      throw new Error("Room type not found");
    }
    const startDate = new Date(booking.checkIn);
    for (let i = 0; i < booking.nights; i++) {
      const currentDate = new Date(startDate.getTime() + i * 864e5);
      currentDate.setHours(0, 0, 0, 0);
      const existingDoc = await availability_model_default.findOne({
        roomTypeId: booking.roomTypeId,
        date: currentDate
      }).session(session);
      if (existingDoc) {
        const available = roomTypeData.totalRooms - existingDoc.bookedRooms - existingDoc.blockedRooms;
        if (available < booking.roomsBooked) {
          throw new Error(
            `Rooms just sold out for ${currentDate.toDateString()}`
          );
        }
        await availability_model_default.updateOne(
          { _id: existingDoc._id },
          { $inc: { bookedRooms: booking.roomsBooked } },
          { session }
        );
      } else {
        if (booking.roomsBooked > roomTypeData.totalRooms) {
          throw new Error(
            `Rooms just sold out for ${currentDate.toDateString()}`
          );
        }
        await availability_model_default.create(
          [
            {
              roomTypeId: booking.roomTypeId,
              date: currentDate,
              bookedRooms: booking.roomsBooked,
              blockedRooms: 0
            }
          ],
          { session }
        );
      }
    }
    booking.status = "confirmed";
    booking.paymentStatus = "paid";
    booking.expiresAt = void 0;
    await booking.save({ session });
    await session.commitTransaction();
    session.endSession();
    try {
      await sendBookingConfirmationEmail(booking.primaryGuest.email, {
        customerName: booking.primaryGuest.firstName,
        bookingId: booking.bookingReference,
        hotelName: hotel.name,
        roomName: roomTypeData.name,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        amount: booking.totalAmount
      });
    } catch (mailErr) {
      logger_default.error("Booking Confirmation Email failed:", mailErr);
    }
    try {
      const vendor = await vendor_model_default.findById(hotel.vendorId);
      if (vendor) {
        const vendorUser = await auth_model_default.findById(vendor.userId);
        const recipientEmails = [vendor.businessEmail, vendorUser?.email].filter(Boolean);
        await sendVendorBookingNotificationEmail(recipientEmails, {
          serviceType: "hotel",
          serviceName: hotel.name,
          bookingReference: booking.bookingReference,
          bookingDate: new Date(booking.checkIn).toLocaleDateString(),
          extraDetails: `Room Type: ${roomTypeData.name}, Nights: ${booking.nights}, Rooms Booked: ${booking.roomsBooked}`,
          totalAmount: booking.totalAmount,
          customerName: `${booking.primaryGuest.firstName} ${booking.primaryGuest.lastName}`,
          customerEmail: booking.primaryGuest.email,
          customerPhone: booking.primaryGuest.phoneNumber
        });
      }
    } catch (vendorMailErr) {
      logger_default.error("Vendor Booking Notification Email failed:", vendorMailErr);
    }
    return booking;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    logger_default.error("Service Error: verifyPayment", err);
    throw err;
  }
};
var PaymentService = class {
  async verifyPayment(data) {
    return verifyPayment(data);
  }
};
var paymentService = new PaymentService();
var payment_service_default = paymentService;

// src/modules/payments/payment.controller.ts
var PaymentController = class {
  async verifyPayment(req, res, next) {
    try {
      const booking = await payment_service_default.verifyPayment(req.body);
      res.status(200).json({
        success: true,
        data: booking
      });
    } catch (err) {
      next(err);
    }
  }
};

// src/modules/payments/payment.routes.ts
var router10 = (0, import_express10.Router)();
var paymentController = new PaymentController();
router10.post("/verify", protect, paymentController.verifyPayment);
var payment_routes_default = router10;

// src/modules/reviews/review.routes.ts
var import_express11 = require("express");

// src/modules/reviews/review.service.ts
var import_mongoose33 = __toESM(require("mongoose"), 1);

// src/modules/reviews/review.model.ts
var import_mongoose32 = __toESM(require("mongoose"), 1);
var reviewSchema = new import_mongoose32.Schema(
  {
    userId: {
      type: import_mongoose32.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    bookingId: {
      type: import_mongoose32.Schema.Types.ObjectId,
      required: true,
      unique: true
    },
    companyId: {
      type: import_mongoose32.Schema.Types.ObjectId,
      required: true
    },
    companyName: {
      type: String,
      required: true,
      trim: true
    },
    companyType: {
      type: String,
      enum: ["hotel", "adventure", "tour", "cab", "bike"],
      required: true
    },
    vendorId: {
      type: import_mongoose32.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 1e3
    },
    vendorReply: {
      message: {
        type: String,
        trim: true,
        maxlength: 1e3
      },
      repliedAt: Date
    },
    isFlagged: {
      type: Boolean,
      default: false
    },
    flagReason: {
      type: String,
      default: "",
      trim: true
    }
  },
  {
    timestamps: true
  }
);
reviewSchema.index({ bookingId: 1 }, { unique: true });
reviewSchema.index({
  companyType: 1,
  companyId: 1
});
var Review = import_mongoose32.default.model("Review", reviewSchema);
var review_model_default = Review;

// src/modules/reviews/review.service.ts
init_service_model();
init_bikeService_model();
init_cabService_model();
init_tourService_model();

// src/modules/reviews/helpers/updateCompanyRating.ts
var updateCompanyRating = async (companyType, companyId) => {
  try {
    const stats = await review_model_default.aggregate([
      {
        $match: {
          companyType,
          companyId
        }
      },
      {
        $group: {
          _id: null,
          averageRating: {
            $avg: "$rating"
          },
          totalReviews: {
            $sum: 1
          }
        }
      }
    ]);
    const averageRating = stats[0]?.averageRating || 0;
    const totalReviews = stats[0]?.totalReviews || 0;
    switch (companyType) {
      case "hotel":
        await hotel_model_default.findByIdAndUpdate(companyId, {
          rating: Number(averageRating.toFixed(1)),
          numReviews: totalReviews
        });
        break;
      case "adventure":
        await adventure_model_default.findByIdAndUpdate(companyId, {
          rating: {
            average: Number(averageRating.toFixed(1)),
            count: totalReviews
          }
        });
        break;
      case "bike":
        await bike_model_default.findByIdAndUpdate(companyId, {
          rating: {
            average: Number(averageRating.toFixed(1)),
            count: totalReviews
          }
        });
        break;
      case "cab":
        await cab_model_default.findByIdAndUpdate(companyId, {
          rating: {
            average: Number(averageRating.toFixed(1)),
            count: totalReviews
          }
        });
        break;
      case "tour":
        await tour_model_default.findByIdAndUpdate(companyId, {
          rating: {
            average: Number(averageRating.toFixed(1)),
            count: totalReviews
          }
        });
        break;
      default:
        throw new Error("Invalid company type");
    }
  } catch (error) {
    throw error;
  }
};

// src/modules/reviews/review.service.ts
var getCompanyReviews = async (companyType, companyId, query = {}) => {
  try {
    const allowedTypes = ["hotel", "adventure", "tour", "cab", "bike"];
    if (!allowedTypes.includes(companyType)) {
      throw new Error("Invalid company type");
    }
    if (!import_mongoose33.default.Types.ObjectId.isValid(companyId)) {
      throw new Error("Invalid company id");
    }
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const [reviews, total, stats] = await Promise.all([
      review_model_default.find({
        companyType,
        companyId
      }).populate("userId", "firstName lastName avatar").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      review_model_default.countDocuments({
        companyType,
        companyId
      }),
      review_model_default.aggregate([
        {
          $match: {
            companyType,
            companyId: new import_mongoose33.default.Types.ObjectId(companyId)
          }
        },
        {
          $group: {
            _id: null,
            averageRating: {
              $avg: "$rating"
            },
            totalReviews: {
              $sum: 1
            }
          }
        }
      ])
    ]);
    return {
      reviews,
      summary: {
        averageRating: stats[0]?.averageRating?.toFixed(1) || 0,
        totalReviews: stats[0]?.totalReviews || 0
      },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    throw error;
  }
};
var getUserReviews = async (userId) => {
  try {
    const submittedReviews = await review_model_default.find({
      userId
    }).sort({ createdAt: -1 }).lean();
    const reviewedBookingIds = submittedReviews.map(
      (review) => review.bookingId.toString()
    );
    const hotelBookings = await booking_model_default.find({
      userId,
      status: "completed"
    }).populate("hotelId", "name images rating").lean();
    const genericBookings = await booking_model_default2.find({
      userId,
      status: "completed"
    }).lean();
    const pendingHotelReviews = hotelBookings.filter((booking) => !reviewedBookingIds.includes(booking._id.toString())).map((booking) => ({
      bookingId: booking._id,
      companyId: booking.hotelId?._id,
      companyType: "hotel",
      companyName: booking.hotelId?.name || "",
      bookingReference: booking.bookingReference,
      bookingDate: booking.createdAt
    }));
    const pendingGenericReviews = genericBookings.filter((booking) => !reviewedBookingIds.includes(booking._id.toString())).map((booking) => ({
      bookingId: booking._id,
      companyId: booking.serviceId,
      companyType: booking.serviceType,
      bookingReference: booking.bookingReference,
      bookingDate: booking.bookingDate
    }));
    return {
      pendingReviews: [...pendingHotelReviews, ...pendingGenericReviews],
      submittedReviews
    };
  } catch (error) {
    logger_default.error("Service Error: getUserReviews", error);
    throw error;
  }
};
var createReview = async (userId, body) => {
  try {
    const { bookingId, rating, comment } = body;
    if (!bookingId) {
      throw new Error("Booking ID is required");
    }
    if (!rating || rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }
    if (!comment?.trim()) {
      throw new Error("Comment is required");
    }
    const existingReview = await review_model_default.findOne({
      bookingId
    });
    if (existingReview) {
      throw new Error("Review already submitted");
    }
    const hotelBooking = await booking_model_default.findOne({
      _id: bookingId,
      userId,
      status: "completed"
    });
    if (hotelBooking) {
      const hotel = await hotel_model_default.findById(hotelBooking.hotelId);
      if (!hotel) {
        throw new Error("Hotel not found");
      }
      const review2 = await review_model_default.create({
        userId,
        bookingId,
        companyId: hotel._id,
        companyName: hotel.name,
        companyType: "hotel",
        vendorId: hotel.vendorId,
        rating,
        comment
      });
      await updateCompanyRating("hotel", hotel._id);
      return {
        message: "Review submitted successfully",
        review: review2
      };
    }
    const booking = await booking_model_default2.findOne({
      _id: bookingId,
      userId,
      status: "completed"
    });
    if (!booking) {
      throw new Error("Completed booking not found");
    }
    let companyId;
    let vendorId;
    let companyName;
    switch (booking.serviceType) {
      case "adventure": {
        const service = await service_model_default.findById(booking.serviceId);
        if (!service) {
          throw new Error("Adventure service not found");
        }
        const adventure = await adventure_model_default.findById(service.adventure);
        if (!adventure) {
          throw new Error("Adventure company not found");
        }
        companyId = adventure._id;
        companyName = adventure.name;
        vendorId = adventure.vendorId;
        break;
      }
      case "bike": {
        const service = await bikeService_model_default.findById(booking.serviceId);
        if (!service) {
          throw new Error("Bike service not found");
        }
        const bike = await bike_model_default.findById(service.bike);
        if (!bike) {
          throw new Error("Bike company not found");
        }
        companyId = bike._id;
        companyName = bike.name;
        vendorId = bike.vendorId;
        break;
      }
      case "cab": {
        const service = await cabService_model_default.findById(booking.serviceId);
        if (!service) {
          throw new Error("Cab service not found");
        }
        const cab = await cab_model_default.findById(service.cab);
        if (!cab) {
          throw new Error("Cab company not found");
        }
        companyId = cab._id;
        companyName = cab.name;
        vendorId = cab.vendorId;
        break;
      }
      case "tour": {
        const service = await tourService_model_default.findById(booking.serviceId);
        if (!service) {
          throw new Error("Tour service not found");
        }
        const tour = await tour_model_default.findById(service.tour);
        if (!tour) {
          throw new Error("Tour company not found");
        }
        companyId = tour._id;
        companyName = tour.name;
        vendorId = tour.vendorId;
        break;
      }
      default:
        throw new Error("Invalid service type");
    }
    const review = await review_model_default.create({
      userId,
      bookingId,
      companyId,
      companyName,
      companyType: booking.serviceType,
      vendorId,
      rating,
      comment
    });
    await updateCompanyRating(booking.serviceType, companyId);
    return {
      message: "Review submitted successfully",
      review
    };
  } catch (error) {
    logger_default.error("Service Error: createReview", error);
    throw error;
  }
};
var updateReview = async (userId, reviewId, body) => {
  try {
    const { rating, comment } = body;
    const review = await review_model_default.findOne({
      _id: reviewId,
      userId
    });
    if (!review) {
      throw new Error("Review not found");
    }
    if (review.vendorReply?.message) {
      throw new Error("Review cannot be updated after vendor reply");
    }
    if (rating !== void 0 && (rating < 1 || rating > 5)) {
      throw new Error("Rating must be between 1 and 5");
    }
    if (comment !== void 0 && (!comment || !comment.trim())) {
      throw new Error("Comment cannot be empty");
    }
    if (rating) {
      review.rating = rating;
    }
    if (comment !== void 0) {
      review.comment = comment;
    }
    await review.save();
    await updateCompanyRating(review.companyType, review.companyId);
    return {
      message: "Review updated successfully",
      review
    };
  } catch (error) {
    logger_default.error("Service Error: updateReview", error);
    throw error;
  }
};
var getVendorReviews = async (vendorId, query = {}) => {
  try {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const [reviews, total, stats] = await Promise.all([
      review_model_default.find({
        vendorId
      }).populate("userId", "firstName lastName avatar").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      review_model_default.countDocuments({
        vendorId
      }),
      review_model_default.aggregate([
        {
          $match: {
            vendorId
          }
        },
        {
          $group: {
            _id: null,
            averageRating: {
              $avg: "$rating"
            },
            totalReviews: {
              $sum: 1
            }
          }
        }
      ])
    ]);
    return {
      summary: {
        totalReviews: stats[0]?.totalReviews || 0,
        averageRating: Number((stats[0]?.averageRating || 0).toFixed(1))
      },
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger_default.error("Service Error: getVendorReviews", error);
    throw error;
  }
};
var vendorReply = async (vendorId, reviewId, body) => {
  try {
    const { message } = body;
    if (!message?.trim()) {
      throw new Error("Reply message is required");
    }
    const review = await review_model_default.findOne({
      _id: reviewId,
      vendorId
    });
    if (!review) {
      throw new Error("Review not found");
    }
    if (review.vendorReply?.message) {
      throw new Error("Reply already submitted");
    }
    review.vendorReply = {
      message: message.trim(),
      repliedAt: /* @__PURE__ */ new Date()
    };
    await review.save();
    return {
      message: "Reply submitted successfully",
      review
    };
  } catch (error) {
    logger_default.error("Service Error: vendorReply", error);
    throw error;
  }
};
var ReviewService = class {
  async getCompanyReviews(companyType, companyId, query = {}) {
    return getCompanyReviews(companyType, companyId, query);
  }
  async getUserReviews(userId) {
    return getUserReviews(userId);
  }
  async createReview(userId, body) {
    return createReview(userId, body);
  }
  async updateReview(userId, reviewId, body) {
    return updateReview(userId, reviewId, body);
  }
  async getVendorReviews(vendorId, query = {}) {
    return getVendorReviews(vendorId, query);
  }
  async vendorReply(vendorId, reviewId, body) {
    return vendorReply(vendorId, reviewId, body);
  }
};
var reviewService = new ReviewService();
var review_service_default = reviewService;

// src/modules/reviews/review.controller.ts
var ReviewController = class {
  // Public
  async getCompanyReviews(req, res, next) {
    try {
      const result = await review_service_default.getCompanyReviews(
        req.params.companyType,
        req.params.companyId,
        req.query
      );
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger_default.error("Controller Error: getCompanyReviews", error);
      next(error);
    }
  }
  //user side
  async getUserReviews(req, res, next) {
    try {
      const userId = req.user._id;
      const result = await review_service_default.getUserReviews(userId);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger_default.error("Controller Error: getUserReviews", error);
      next(error);
    }
  }
  async createReview(req, res, next) {
    try {
      const result = await review_service_default.createReview(
        req.user._id,
        req.body
      );
      res.status(201).json({
        success: true,
        message: result.message,
        data: result.review
      });
    } catch (error) {
      logger_default.error("Controller Error: createReview", error);
      next(error);
    }
  }
  async updateReview(req, res, next) {
    try {
      const result = await review_service_default.updateReview(
        req.user._id,
        req.params.reviewId,
        req.body
      );
      res.status(200).json({
        success: true,
        message: result.message,
        data: result.review
      });
    } catch (error) {
      logger_default.error("Controller Error: updateReview", error);
      next(error);
    }
  }
  //vendor side
  async getVendorReviews(req, res, next) {
    try {
      const result = await review_service_default.getVendorReviews(
        req.vendorId,
        req.query
      );
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger_default.error("Controller Error: getVendorReviews", error);
      next(error);
    }
  }
  async vendorReply(req, res, next) {
    try {
      const result = await review_service_default.vendorReply(
        req.vendorId,
        req.params.reviewId,
        req.body
      );
      res.status(200).json({
        success: true,
        message: result.message,
        data: result.review
      });
    } catch (error) {
      logger_default.error("Controller Error: vendorReply", error);
      next(error);
    }
  }
};

// src/modules/reviews/review.routes.ts
var router11 = (0, import_express11.Router)();
var controller3 = new ReviewController();
router11.get("/:companyType/:companyId", controller3.getCompanyReviews);
router11.get("/", protect, controller3.getUserReviews);
router11.post("/", protect, controller3.createReview);
router11.put("/:reviewId", protect, controller3.updateReview);
router11.get(
  "/vendor",
  protect,
  authorize("vendor"),
  controller3.getVendorReviews
);
router11.post(
  "/vendor/reply/:reviewId",
  protect,
  authorize("vendor"),
  controller3.vendorReply
);
var review_routes_default = router11;

// src/modules/upload/upload.routes.ts
var import_express12 = require("express");

// src/modules/upload/upload.controller.ts
var UploadController = class {
  async uploadMultiple(req, res, next) {
    try {
      if (!req.files || req.files.length === 0) {
        res.status(400).json({ message: "No files uploaded" });
        return;
      }
      const folder = req.body.folder || "general";
      const uploadedFiles = await upload_service_default.uploadFiles(req.files, folder);
      res.status(200).json({
        success: true,
        files: uploadedFiles
      });
    } catch (error) {
      next(error);
    }
  }
  async deleteFile(req, res, next) {
    try {
      const public_id = req.body.public_id || req.query.public_id || req.params.public_id || req.params[0];
      const public_ids = req.body.public_ids;
      const resource_type = req.body.resource_type || req.query.resource_type || "image";
      if (Array.isArray(public_ids) && public_ids.length > 0) {
        const result2 = await upload_service_default.deleteMultipleFiles(
          public_ids,
          resource_type
        );
        res.status(200).json({
          success: true,
          message: "Files deleted successfully",
          data: result2
        });
        return;
      }
      if (!public_id) {
        res.status(400).json({
          success: false,
          message: "public_id is required"
        });
        return;
      }
      const result = await upload_service_default.deleteFile(public_id, resource_type);
      res.status(200).json({
        success: true,
        message: "File deleted successfully",
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
};

// src/shared/utils/multer.ts
var import_multer = __toESM(require("multer"), 1);
var storage = import_multer.default.memoryStorage();
var upload = (0, import_multer.default)({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024
    // 10MB
  }
});
var multer_default = upload;

// src/modules/upload/upload.routes.ts
var router12 = (0, import_express12.Router)();
var uploadController = new UploadController();
router12.post(
  "/",
  multer_default.array("files", 10),
  uploadController.uploadMultiple
);
router12.delete("/", uploadController.deleteFile);
router12.delete("/:public_id", uploadController.deleteFile);
var upload_routes_default = router12;

// src/modules/favorites/favorite.routes.ts
var import_express13 = require("express");

// src/modules/favorites/favorite.service.ts
var SERVICE_MODELS3 = {
  hotel: hotel_model_default,
  cab: cab_model_default,
  bike: bike_model_default,
  tour: tour_model_default,
  adventure: adventure_model_default
};
var getThumbnail = (item, itemType) => {
  if (!item?.images?.length) return null;
  if (itemType === "hotel") {
    return item.images?.[0]?.url || null;
  }
  return item.images?.[0] || null;
};
var toggleFavorite = async (userId, itemId, itemType = "hotel") => {
  const existing = await favorite_model_default.findOne({
    user: userId,
    itemId,
    itemType
  });
  if (existing) {
    await existing.deleteOne();
    return {
      isFavorite: false
    };
  }
  await favorite_model_default.create({
    user: userId,
    itemId,
    itemType
  });
  return {
    isFavorite: true
  };
};
var getUserFavorites = async (userId, itemType) => {
  const filter = {
    user: userId
  };
  if (itemType) {
    filter.itemType = itemType;
  }
  return await favorite_model_default.find(filter).select("itemId itemType").lean();
};
var getFavoritesSummary = async (userId) => {
  const favorites = await favorite_model_default.find({
    user: userId
  }).limit(20).lean();
  const totalSaved = favorites.length;
  if (totalSaved === 0) {
    return {
      name: "My Favorites",
      totalSaved: 0,
      coverImages: []
    };
  }
  const coverImages = [];
  for (const fav of favorites) {
    const Model29 = SERVICE_MODELS3[fav.itemType];
    if (!Model29) continue;
    const item = await Model29.findById(fav.itemId).select("images").lean();
    if (!item) continue;
    const thumbnail = getThumbnail(item, fav.itemType);
    if (thumbnail) {
      coverImages.push(thumbnail);
    }
    if (coverImages.length >= 4) {
      break;
    }
  }
  return {
    name: "My Favorites",
    totalSaved,
    coverImages
  };
};
var getMyTripFavorites = async (userId, page = 1, limit = 10) => {
  const skip = (Number(page) - 1) * Number(limit);
  const favorites = await favorite_model_default.find({
    user: userId
  }).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean();
  const results = [];
  for (const fav of favorites) {
    const Model29 = SERVICE_MODELS3[fav.itemType];
    if (!Model29) continue;
    const item = await Model29.findOne({
      _id: fav.itemId,
      isActive: true
    }).lean();
    if (!item) continue;
    if (fav.itemType === "hotel") {
      results.push({
        _id: item._id,
        itemType: "hotel",
        name: item.name,
        city: item.city,
        rating: item.rating,
        numReviews: item.numReviews,
        thumbnail: getThumbnail(item, "hotel"),
        isFavorite: true
      });
      continue;
    }
    results.push({
      _id: item._id,
      itemType: fav.itemType,
      name: item.name,
      location: item.location || {},
      rating: item.rating || {},
      thumbnail: getThumbnail(item, fav.itemType),
      isFavorite: true
    });
  }
  return results;
};
var FavoriteService = class {
  async toggleFavorite(userId, itemId, itemType = "hotel") {
    return toggleFavorite(userId, itemId, itemType);
  }
  async getUserFavorites(userId, itemType) {
    return getUserFavorites(userId, itemType);
  }
  async getFavoritesSummary(userId) {
    return getFavoritesSummary(userId);
  }
  async getMyTripFavorites(userId, page = 1, limit = 10) {
    return getMyTripFavorites(userId, page, limit);
  }
};
var favoriteService = new FavoriteService();
var favorite_service_default = favoriteService;

// src/modules/favorites/favorite.controller.ts
var FavoriteController = class {
  async toggleFavorite(req, res, next) {
    try {
      const { itemId, serviceType } = req.params;
      const userId = req.user._id;
      const result = await favorite_service_default.toggleFavorite(
        userId,
        itemId,
        serviceType
      );
      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      logger_default.error("Controller Error: toggleFavorite", error);
      next(error);
    }
  }
  //Get current user's favorites
  async getMyFavorites(req, res, next) {
    try {
      const userId = req.user._id;
      const favorites = await favorite_service_default.getUserFavorites(userId);
      res.status(200).json({
        success: true,
        count: favorites.length,
        data: favorites
      });
    } catch (error) {
      logger_default.error("Controller Error: getMyFavorites", error);
      next(error);
    }
  }
  //Get favorites summary images
  async getFavoritesSummary(req, res, next) {
    try {
      const userId = req.user._id;
      const data = await favorite_service_default.getFavoritesSummary(userId);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }
  //Get my trip favorites
  async getMyTripFavorites(req, res, next) {
    try {
      const userId = req.user._id;
      const { page = 1, limit = 10 } = req.query;
      const hotels = await favorite_service_default.getMyTripFavorites(
        userId,
        page,
        limit
      );
      res.status(200).json({
        success: true,
        count: hotels.length,
        data: hotels
      });
    } catch (error) {
      next(error);
    }
  }
};

// src/modules/favorites/favorite.routes.ts
var router13 = (0, import_express13.Router)();
var favoriteController = new FavoriteController();
router13.use(protect);
router13.post("/toggle/:serviceType/:itemId", favoriteController.toggleFavorite);
router13.get("/me", favoriteController.getMyFavorites);
router13.get("/summary", favoriteController.getFavoritesSummary);
router13.get("/my-trip", favoriteController.getMyTripFavorites);
var favorite_routes_default = router13;

// src/modules/vendorBank/bank.routes.ts
var import_express14 = require("express");

// src/modules/vendorBank/bank.service.ts
var createBankDetails = async (vendor, bankData) => {
  try {
    if (vendor.isSubmitted && vendor.status !== "rejected") {
      throw new Error("Already submitted. Cannot edit.");
    }
    if (vendor.currentStep !== 2 && vendor.status !== "rejected") {
      throw new Error("Invalid step flow");
    }
    if (vendor.status === "rejected" && !vendor.rejectedSteps.includes(3)) {
      throw new Error("Fix required step first");
    }
    let bank = await bank_model_default.findOne({ vendorId: vendor._id });
    if (bank) {
      Object.assign(bank, bankData);
      bank.verificationStatus = "pending";
      await bank.save();
    } else {
      bank = await bank_model_default.create({
        vendorId: vendor._id,
        ...bankData,
        verificationStatus: "pending"
      });
    }
    vendor.currentStep = 3;
    vendor.registrationStep = Math.max(vendor.registrationStep, 3);
    if (vendor.rejectedSteps?.includes(3)) {
      vendor.rejectedSteps = vendor.rejectedSteps.filter(
        (s) => s !== 3
      );
    }
    if (vendor.rejectionReasons) {
      delete vendor.rejectionReasons["3"];
    }
    if (!vendor.rejectedSteps || vendor.rejectedSteps.length === 0) {
      vendor.status = "draft";
    }
    await vendor.save();
    return bank;
  } catch (error) {
    logger_default.error("Service Error: createBankDetails", error);
    throw error;
  }
};
var bank_service = {
  createBankDetails
};
var bank_service_default = bank_service;

// src/modules/vendorBank/bank.controller.ts
var BankController = class {
  //Create vendor bank details
  async createBankDetails(req, res, next) {
    try {
      const userId = req.user._id;
      const vendor = await vendor_model_default.findOne({ userId });
      if (!vendor) {
        throw new Error("Vendor profile not found");
      }
      const bank = await bank_service_default.createBankDetails(vendor, req.body);
      res.status(200).json({
        success: true,
        message: "Step 3 saved successfully",
        data: {
          currentStep: vendor.currentStep,
          registrationStep: vendor.registrationStep,
          status: vendor.status
        }
      });
    } catch (error) {
      logger_default.error("Controller Error: createBankDetails", error);
      next(error);
    }
  }
};

// src/modules/vendorBank/bank.routes.ts
var router14 = (0, import_express14.Router)();
var bankController = new BankController();
router14.post(
  "/",
  protect,
  authorize("vendor"),
  bankController.createBankDetails
);
var bank_routes_default = router14;

// src/modules/support/support.routes.ts
var import_express15 = require("express");

// src/modules/support/support.model.ts
var import_mongoose34 = __toESM(require("mongoose"), 1);
var messageSchema = new import_mongoose34.Schema(
  {
    sender: {
      type: String,
      enum: ["user", "admin"],
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    attachments: [
      {
        url: String,
        public_id: String
      }
    ]
  },
  { timestamps: true }
);
var supportSchema = new import_mongoose34.Schema(
  {
    userId: {
      type: import_mongoose34.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phoneNumber: {
      type: String,
      trim: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    bookingReference: {
      type: String,
      trim: true,
      index: true
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
      index: true
    },
    //Chat messages
    messages: [messageSchema],
    closedAt: Date,
    lastMessageAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);
supportSchema.index({ status: 1, createdAt: -1 });
var Support = import_mongoose34.default.model("Support", supportSchema);
var support_model_default = Support;

// src/modules/support/support.service.ts
var createTicket = async (data, userId) => {
  try {
    const { name, email, phoneNumber, subject, description, bookingReference } = data;
    if (!name || !email || !subject || !description) {
      throw new Error("Required fields are missing");
    }
    const ticket = await support_model_default.create({
      userId,
      name,
      email,
      phoneNumber,
      subject,
      description,
      bookingReference,
      // first message
      messages: [
        {
          sender: "user",
          message: description
        }
      ]
    });
    return ticket;
  } catch (error) {
    throw error;
  }
};
var getMyTickets = async (userId, query = {}) => {
  try {
    const { page = 1, limit = 10, status } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const filter = {
      userId
    };
    if (status) {
      filter.status = status;
    }
    const tickets = await support_model_default.find(filter).select("subject status createdAt lastMessageAt").sort({ lastMessageAt: -1 }).skip(skip).limit(Number(limit)).lean();
    const total = await support_model_default.countDocuments(filter);
    return {
      tickets,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total
      }
    };
  } catch (error) {
    throw error;
  }
};
var getTicketDetail = async (ticketId, userId) => {
  try {
    const ticket = await support_model_default.findOne({
      _id: ticketId,
      userId
    }).lean();
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    return {
      _id: ticket._id,
      subject: ticket.subject,
      status: ticket.status,
      bookingReference: ticket.bookingReference,
      createdAt: ticket.createdAt,
      // full chat
      messages: ticket.messages?.map((msg) => ({
        sender: msg.sender,
        message: msg.message,
        createdAt: msg.createdAt
      })) || []
    };
  } catch (error) {
    throw error;
  }
};
var replyToTicket = async (ticketId, userId, message) => {
  try {
    if (!message) {
      throw new Error("Message is required");
    }
    const ticket = await support_model_default.findOne({
      _id: ticketId,
      userId
    });
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    if (ticket.status === "closed") {
      throw new Error("Ticket is closed");
    }
    ticket.messages.push({
      sender: "user",
      message
    });
    ticket.lastMessageAt = /* @__PURE__ */ new Date();
    if (ticket.status === "resolved") {
      ticket.status = "in_progress";
    }
    await ticket.save();
    return ticket;
  } catch (error) {
    throw error;
  }
};
var SupportService = class {
  async createTicket(data, userId) {
    return createTicket(data, userId);
  }
  async getMyTickets(userId, query = {}) {
    return getMyTickets(userId, query);
  }
  async getTicketDetail(ticketId, userId) {
    return getTicketDetail(ticketId, userId);
  }
  async replyToTicket(ticketId, userId, message) {
    return replyToTicket(ticketId, userId, message);
  }
};
var supportService = new SupportService();
var support_service_default = supportService;

// src/modules/support/support.controller.ts
var SupportController = class {
  // Create ticket
  async createTicket(req, res, next) {
    try {
      const ticket = await support_service_default.createTicket(
        req.body,
        req.user._id
      );
      res.status(201).json({
        success: true,
        message: "Ticket created successfully",
        data: ticket
      });
    } catch (error) {
      logger_default.error("Controller Error: createTicket", error);
      next(error);
    }
  }
  // Get my tickets
  async getMyTickets(req, res, next) {
    try {
      const result = await support_service_default.getMyTickets(
        req.user._id,
        req.query
      );
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger_default.error("Controller Error: getMyTickets", error);
      next(error);
    }
  }
  // Get ticket detail
  async getTicketDetail(req, res, next) {
    try {
      const ticket = await support_service_default.getTicketDetail(
        req.params.ticketId,
        req.user._id
      );
      res.status(200).json({
        success: true,
        data: ticket
      });
    } catch (error) {
      logger_default.error("Controller Error: getTicketDetail", error);
      next(error);
    }
  }
  // Reply to ticket
  async replyToTicket(req, res, next) {
    try {
      const ticket = await support_service_default.replyToTicket(
        req.params.ticketId,
        req.user._id,
        req.body.message
      );
      res.status(200).json({
        success: true,
        message: "Reply sent successfully",
        data: ticket
      });
    } catch (error) {
      logger_default.error("Controller Error: replyToTicket", error);
      next(error);
    }
  }
};

// src/modules/support/support.routes.ts
var router15 = (0, import_express15.Router)();
var supportController = new SupportController();
router15.get("/", protect, supportController.getMyTickets);
router15.post("/", protect, supportController.createTicket);
router15.get("/:ticketId", protect, supportController.getTicketDetail);
router15.post("/:ticketId/reply", protect, supportController.replyToTicket);
var support_routes_default = router15;

// src/modules/adventure/category/adventure.routes.ts
var import_express16 = require("express");

// src/modules/adventure/category/adventure.service.ts
var import_mongoose35 = __toESM(require("mongoose"), 1);
init_service_model();
var attachFavoriteFlag2 = async (items, userId, itemType) => {
  if (!userId || items.length === 0) {
    items.forEach((item) => item.isFavorite = false);
    return items;
  }
  const itemIds = items.map((i) => i._id);
  const favorites = await favorite_model_default.find({
    user: userId,
    itemType,
    itemId: { $in: itemIds }
  }).select("itemId");
  const favoriteSet = new Set(favorites.map((f) => f.itemId.toString()));
  items.forEach((item) => {
    item.isFavorite = favoriteSet.has(item._id.toString());
  });
  return items;
};
var checkIsFavorite = async (itemId, userId, itemType) => {
  if (!userId || !itemId) return false;
  const fav = await favorite_model_default.findOne({
    user: userId,
    itemType,
    itemId
  }).select("_id");
  return !!fav;
};
var searchAdventures = async (query = {}, userId = null) => {
  try {
    const { city } = query;
    if (!city) {
      throw new Error("City is required");
    }
    const adventures = await adventure_model_default.find({
      "location.city": city,
      isActive: true
    }).select("_id category").lean();
    if (!adventures.length) return [];
    const categoryMap = {};
    adventures.forEach((adv) => {
      if (!categoryMap[adv.category]) {
        categoryMap[adv.category] = [];
      }
      categoryMap[adv.category].push(adv._id);
    });
    const categoryConfig = {
      rafting: "River Rafting",
      paragliding: "Paragliding",
      bungee: "Bungee Jumping",
      trekking: "Trekking"
    };
    const results = await Promise.all(
      Object.keys(categoryMap).map(async (category) => {
        const adventureIds = categoryMap[category];
        const minService = await service_model_default.find({
          adventure: { $in: adventureIds },
          isActive: true
        }).sort({ basePrice: 1 }).select("basePrice").limit(1).lean();
        const startingPrice = minService[0]?.basePrice || null;
        return {
          category,
          title: categoryConfig[category] || category,
          startingPrice,
          serviceType: "adventure"
        };
      })
    );
    return results;
  } catch (error) {
    throw error;
  }
};
var getAdventures = async (query = {}, userId = null) => {
  try {
    const { category, city } = query;
    if (!category || !city) {
      throw new Error("Category and city are required");
    }
    const adventures = await adventure_model_default.aggregate([
      {
        $match: {
          category,
          "location.city": city,
          isActive: true
        }
      },
      {
        $lookup: {
          from: "services",
          localField: "_id",
          foreignField: "adventure",
          as: "services"
        }
      },
      {
        $match: {
          "services.0": { $exists: true }
        }
      },
      {
        $addFields: {
          priceStart: {
            $min: "$services.basePrice"
          }
        }
      },
      {
        $project: {
          name: 1,
          category: 1,
          city: "$location.city",
          description: 1,
          features: { $slice: ["$features", 3] },
          rating: "$rating.average",
          reviews: "$rating.count",
          image: { $arrayElemAt: ["$images", 0] },
          priceStart: 1
        }
      },
      {
        $sort: {
          priceStart: 1
        }
      }
    ]);
    const formattedAdventures = adventures.map((adv) => ({
      ...adv,
      serviceType: "adventure"
    }));
    return await attachFavoriteFlag2(formattedAdventures, userId, "adventure");
  } catch (error) {
    throw error;
  }
};
var getAdventureDetails = async (id, userId = null) => {
  try {
    if (!import_mongoose35.default.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid adventure id");
    }
    const adventure = await adventure_model_default.findOne({
      _id: id,
      isActive: true
    }).select("name category location description images rating").lean();
    if (!adventure) {
      throw new Error("Adventure not found");
    }
    const services = await service_model_default.find({
      adventure: id,
      isActive: true
    }).select("title type basePrice discountPrice meta features itinerary").sort({ basePrice: 1 }).lean();
    const taxDoc = await tax_model_default.findOne({ isActive: true }).lean();
    const taxPercentage = taxDoc?.taxPercentage || 0;
    const formattedServices = services.map((service) => {
      const effectivePrice = (service.discountPrice ?? 0) > 0 ? service.discountPrice : service.basePrice;
      const totalTax = Number(
        (effectivePrice * taxPercentage / 100).toFixed(2)
      );
      const totalPriceWithTax = Number((effectivePrice + totalTax).toFixed(2));
      return {
        ...service,
        serviceType: "adventure",
        taxPercentage,
        totalTax,
        totalPriceWithTax
      };
    });
    const isFavorite = await checkIsFavorite(adventure._id, userId, "adventure");
    const formattedAdventure = {
      _id: adventure._id,
      serviceType: "adventure",
      isFavorite,
      name: adventure.name,
      category: adventure.category,
      city: adventure.location?.city,
      description: adventure.description,
      rating: adventure.rating?.average || 0,
      reviews: adventure.rating?.count || 0,
      images: adventure.images || []
    };
    return {
      adventure: formattedAdventure,
      services: formattedServices,
      isFavorite
    };
  } catch (error) {
    throw error;
  }
};
var createAdventure = async (data, vendor) => {
  try {
    if (vendor.isSubmitted && vendor.status !== "rejected") {
      throw new Error("Already submitted. Cannot edit.");
    }
    if (vendor.currentStep !== 3 && vendor.status !== "rejected") {
      throw new Error("Invalid step flow");
    }
    if (vendor.status === "rejected" && vendor.rejectedStep !== 4) {
      throw new Error("Fix required step first");
    }
    const {
      name,
      category,
      city,
      state,
      country,
      address,
      description,
      images = [],
      documents = [],
      features = [],
      coordinates
    } = data;
    if (!name || !name.trim()) {
      throw new Error("Adventure name is required");
    }
    if (!category) {
      throw new Error("Adventure category is required");
    }
    if (!city) {
      throw new Error("City is required");
    }
    let addressValue;
    if (typeof address === "object" && address !== null) {
      addressValue = address;
    } else {
      addressValue = typeof address === "string" ? address.trim() : "";
    }
    let adventure = await adventure_model_default.findOne({
      vendorId: vendor._id
    });
    if (adventure) {
      Object.assign(adventure, {
        name: name.trim(),
        category,
        location: {
          city: city.trim(),
          state: state || "",
          country: country || "India"
        },
        address: addressValue,
        coordinates: {
          lat: coordinates?.lat || null,
          lng: coordinates?.lng || null
        },
        description: description?.trim() || "",
        images,
        documents,
        features,
        verificationStatus: "pending"
      });
      await adventure.save();
    } else {
      adventure = await adventure_model_default.create({
        name: name.trim(),
        category,
        location: {
          city: city.trim(),
          state: state || "",
          country: country || "India"
        },
        address: addressValue,
        coordinates: {
          lat: coordinates?.lat || null,
          lng: coordinates?.lng || null
        },
        description: description?.trim() || "",
        images,
        documents,
        features,
        vendorId: vendor._id,
        verificationStatus: "pending",
        isActive: false
      });
    }
    vendor.currentStep = 4;
    vendor.registrationStep = Math.max(vendor.registrationStep, 4);
    if (vendor.status === "rejected") {
      vendor.status = "draft";
      vendor.rejectedStep = null;
      vendor.adminRemark = null;
    }
    await vendor.save();
    return {
      _id: adventure._id,
      name: adventure.name,
      category: adventure.category,
      city: adventure.location?.city
    };
  } catch (error) {
    throw error;
  }
};
var getVendorAdventures = async (vendorId) => {
  try {
    const adventures = await adventure_model_default.aggregate([
      {
        $match: {
          vendorId,
          isActive: true
        }
      },
      {
        $lookup: {
          from: "services",
          localField: "_id",
          foreignField: "adventure",
          as: "services"
        }
      },
      {
        $addFields: {
          priceStart: {
            $min: "$services.basePrice"
          }
        }
      },
      {
        $project: {
          name: 1,
          category: 1,
          city: "$location.city",
          image: {
            $arrayElemAt: ["$images.url", 0]
          },
          priceStart: 1,
          createdAt: 1
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);
    return adventures;
  } catch (error) {
    throw error;
  }
};
var getVendorAdventureDetails = async (id, vendorId) => {
  try {
    if (!import_mongoose35.default.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid adventure id");
    }
    const adventure = await adventure_model_default.findOne({
      _id: id,
      vendorId,
      isActive: true
    }).select("name category location address description images features").lean();
    if (!adventure) {
      throw new Error("Adventure not found or unauthorized");
    }
    const services = await service_model_default.find({
      adventure: id,
      isActive: true
    }).select("title type basePrice discountPrice meta features itinerary").sort({ createdAt: -1 }).lean();
    const taxDoc = await tax_model_default.findOne({ isActive: true }).lean();
    const taxPercentage = taxDoc?.taxPercentage || 0;
    const formattedServices = services.map((service) => {
      const effectivePrice = (service.discountPrice ?? 0) > 0 ? service.discountPrice : service.basePrice;
      const totalTax = Number(
        (effectivePrice * taxPercentage / 100).toFixed(2)
      );
      const totalPriceWithTax = Number((effectivePrice + totalTax).toFixed(2));
      return {
        ...service,
        taxPercentage,
        totalTax,
        totalPriceWithTax
      };
    });
    const formattedAdventure = {
      _id: adventure._id,
      name: adventure.name,
      category: adventure.category,
      city: adventure.location?.city,
      state: adventure.location?.state,
      country: adventure.location?.country,
      address: adventure.address,
      description: adventure.description,
      images: adventure.images || [],
      features: adventure.features || []
    };
    return {
      adventure: formattedAdventure,
      services: formattedServices
    };
  } catch (error) {
    throw error;
  }
};
var updateAdventure = async (id, data, vendorId) => {
  try {
    if (!import_mongoose35.default.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid adventure id");
    }
    const adventure = await adventure_model_default.findOne({
      _id: id,
      vendorId,
      isActive: true
    });
    if (!adventure) {
      throw new Error("Adventure not found or unauthorized");
    }
    const {
      name,
      category,
      city,
      state,
      country,
      address,
      description,
      images,
      features
    } = data;
    if (name !== void 0) adventure.name = name;
    if (category !== void 0) adventure.category = category;
    if (city || state || country) {
      adventure.location = {
        city: city || adventure.location?.city,
        state: state || adventure.location?.state,
        country: country || adventure.location?.country
      };
    }
    if (address !== void 0) adventure.address = address;
    if (description !== void 0) adventure.description = description;
    if (images !== void 0) adventure.images = images;
    if (features !== void 0) adventure.features = features;
    await adventure.save();
    return {
      _id: adventure._id,
      name: adventure.name,
      category: adventure.category,
      city: adventure.location?.city,
      updatedAt: adventure.updatedAt
    };
  } catch (error) {
    throw error;
  }
};
var deleteAdventure = async (id, vendorId) => {
  try {
    if (!import_mongoose35.default.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid adventure id");
    }
    const adventure = await adventure_model_default.findOne({
      _id: id,
      vendorId,
      isActive: true
    });
    if (!adventure) {
      throw new Error("Adventure not found or unauthorized");
    }
    await service_model_default.updateMany({ adventure: id }, { isActive: false });
    adventure.isActive = false;
    await adventure.save();
    return true;
  } catch (error) {
    throw error;
  }
};
var adventure_service = {
  searchAdventures,
  getAdventures,
  getAdventureDetails,
  createAdventure,
  getVendorAdventures,
  getVendorAdventureDetails,
  updateAdventure,
  deleteAdventure
};
var adventure_service_default = adventure_service;

// src/modules/adventure/category/adventure.controller.ts
var AdventureController = class {
  async searchAdventures(req, res, next) {
    try {
      const userId = req.user?._id || null;
      const categories = await adventure_service_default.searchAdventures(
        req.query,
        userId
      );
      res.status(200).json({
        success: true,
        count: categories.length,
        data: categories
      });
    } catch (error) {
      logger_default.error("Controller Error: searchAdventures", error);
      next(error);
    }
  }
  async getAdventures(req, res, next) {
    try {
      const userId = req.user?._id || null;
      const adventures = await adventure_service_default.getAdventures(req.query, userId);
      res.status(200).json({
        success: true,
        count: adventures.length,
        data: adventures
      });
    } catch (error) {
      logger_default.error("Controller Error: getAdventures", error);
      next(error);
    }
  }
  async getAdventureDetails(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user?._id || null;
      const data = await adventure_service_default.getAdventureDetails(id, userId);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      logger_default.error("Controller Error: getAdventureDetails", error);
      next(error);
    }
  }
  ///vendor
  async createAdventure(req, res, next) {
    try {
      const userId = req.user._id;
      const vendor = await vendor_model_default.findOne({ userId });
      if (!vendor) {
        throw new Error("Vendor profile not found");
      }
      const adventure = await adventure_service_default.createAdventure(req.body, vendor);
      res.status(200).json({
        success: true,
        message: "Step 4 completed successfully",
        data: {
          currentStep: vendor.currentStep,
          registrationStep: vendor.registrationStep,
          status: vendor.status
        }
      });
    } catch (error) {
      logger_default.error("Controller Error: createAdventure", error);
      next(error);
    }
  }
  async getVendorAdventures(req, res, next) {
    try {
      const userId = req.user._id;
      const vendor = await vendor_model_default.findOne({ userId });
      if (!vendor) {
        throw new Error("Vendor profile not found");
      }
      const adventures = await adventure_service_default.getVendorAdventures(vendor._id);
      res.status(200).json({
        success: true,
        count: adventures.length,
        data: adventures
      });
    } catch (error) {
      logger_default.error("Controller Error: getVendorAdventures", error);
      next(error);
    }
  }
  async getVendorAdventureDetails(req, res, next) {
    try {
      const userId = req.user._id;
      const { id } = req.params;
      const vendor = await vendor_model_default.findOne({ userId });
      if (!vendor) {
        throw new Error("Vendor profile not found");
      }
      const data = await adventure_service_default.getVendorAdventureDetails(
        id,
        vendor._id
      );
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      logger_default.error("Controller Error: getVendorAdventureDetails", error);
      next(error);
    }
  }
  async updateAdventure(req, res, next) {
    try {
      const userId = req.user._id;
      const { id } = req.params;
      const vendor = await vendor_model_default.findOne({ userId });
      if (!vendor) {
        throw new Error("Vendor profile not found");
      }
      const adventure = await adventure_service_default.updateAdventure(
        id,
        req.body,
        vendor._id
      );
      res.status(200).json({
        success: true,
        data: adventure
      });
    } catch (error) {
      logger_default.error("Controller Error: updateAdventure", error);
      next(error);
    }
  }
  async deleteAdventure(req, res, next) {
    try {
      const userId = req.user._id;
      const { id } = req.params;
      const vendor = await vendor_model_default.findOne({ userId });
      if (!vendor) {
        throw new Error("Vendor profile not found");
      }
      await adventure_service_default.deleteAdventure(id, vendor._id);
      res.status(200).json({
        success: true,
        message: "Adventure deleted successfully"
      });
    } catch (error) {
      logger_default.error("Controller Error: deleteAdventure", error);
      next(error);
    }
  }
};

// src/modules/adventure/category/adventure.routes.ts
var router16 = (0, import_express16.Router)();
var adventureController = new AdventureController();
router16.get("/search", optionalProtect, adventureController.searchAdventures);
router16.get("/", optionalProtect, adventureController.getAdventures);
router16.get("/:id", optionalProtect, adventureController.getAdventureDetails);
router16.post(
  "/vendor/adventures",
  protect,
  authorize("vendor"),
  adventureController.createAdventure
);
router16.get(
  "/vendor/adventures",
  protect,
  authorize("vendor"),
  adventureController.getVendorAdventures
);
router16.get(
  "/vendor/adventures/:id",
  protect,
  authorize("vendor"),
  adventureController.getVendorAdventureDetails
);
router16.put(
  "/vendor/adventures/:id",
  protect,
  authorize("vendor"),
  adventureController.updateAdventure
);
router16.delete(
  "/vendor/adventures/:id",
  protect,
  authorize("vendor"),
  adventureController.deleteAdventure
);
var adventure_routes_default = router16;

// src/modules/adventure/service/service.routes.ts
var import_express17 = require("express");

// src/modules/adventure/service/service.service.ts
init_service_model();
var import_mongoose36 = __toESM(require("mongoose"), 1);
var checkIsFavorite2 = async (itemId, userId, itemType) => {
  if (!userId || !itemId) return false;
  const fav = await favorite_model_default.findOne({
    user: userId,
    itemType,
    itemId
  }).select("_id");
  return !!fav;
};
var getServiceDetails = async (id, userId = null) => {
  try {
    if (!import_mongoose36.default.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid service id");
    }
    const service = await service_model_default.findOne({
      _id: id,
      isActive: true
    }).populate({
      path: "adventure",
      select: `
          name
          category
          location
          images
        `
    }).lean();
    if (!service) {
      throw new Error("Service not found");
    }
    const taxDoc = await tax_model_default.findOne({
      isActive: true
    }).lean();
    const taxPercentage = taxDoc?.taxPercentage || 0;
    const effectivePrice = service.discountPrice > 0 ? service.discountPrice : service.basePrice;
    const discountAmount = service.basePrice - effectivePrice;
    const discountPercentage = service.discountPrice > 0 ? Math.round(discountAmount / service.basePrice * 100) : 0;
    const taxAmount = Number(
      (effectivePrice * taxPercentage / 100).toFixed(2)
    );
    const finalPrice = Number((effectivePrice + taxAmount).toFixed(2));
    const isFavorite = await checkIsFavorite2(
      service.adventure?._id,
      userId,
      "adventure"
    );
    return {
      isFavorite,
      adventure: {
        _id: service.adventure?._id,
        serviceType: "adventure",
        isFavorite,
        name: service.adventure?.name,
        category: service.adventure?.category,
        city: service.adventure?.location?.city,
        image: service.adventure?.images?.[0] || null
      },
      service: {
        _id: service._id,
        serviceType: "adventure",
        isFavorite,
        title: service.title,
        type: service.type,
        pricing: {
          basePrice: service.basePrice,
          discountPrice: service.discountPrice,
          effectivePrice,
          discountAmount,
          discountPercentage,
          taxPercentage,
          taxAmount,
          finalPrice
        },
        meta: {
          distance: service.meta?.distance || null,
          duration: service.meta?.duration || null,
          days: service.meta?.days || null,
          nights: service.meta?.nights || null
        },
        features: service.features || [],
        totalFeatures: service.features?.length || 0,
        itinerary: service.itinerary || [],
        hasItinerary: service.itinerary?.length > 0,
        createdAt: service.createdAt
      }
    };
  } catch (error) {
    throw error;
  }
};
var getVendorServices = async (vendorId) => {
  try {
    const services = await service_model_default.find({
      isActive: true
    }).populate({
      path: "adventure",
      match: {
        vendorId,
        isActive: true
      },
      select: "name category"
    }).sort({ createdAt: -1 }).lean();
    const filteredServices = services.filter((service) => service.adventure);
    return filteredServices.map((service) => ({
      id: service._id,
      adventure: {
        id: service.adventure._id,
        name: service.adventure.name,
        category: service.adventure.category
      },
      title: service.title,
      type: service.type,
      pricing: {
        basePrice: service.basePrice,
        discountPrice: service.discountPrice
      },
      meta: service.meta || {},
      isActive: service.isActive,
      createdAt: service.createdAt
    }));
  } catch (error) {
    throw error;
  }
};
var getVendorServiceById = async (serviceId, vendorId) => {
  try {
    if (!import_mongoose36.default.Types.ObjectId.isValid(serviceId)) {
      throw new Error("Invalid service id");
    }
    const service = await service_model_default.findById(serviceId).populate({
      path: "adventure",
      select: "name category vendorId"
    }).lean();
    if (!service) {
      throw new Error("Service not found");
    }
    if (!service.adventure || service.adventure.vendorId.toString() !== vendorId.toString()) {
      throw new Error("Unauthorized access");
    }
    return {
      id: service._id,
      adventure: {
        id: service.adventure._id,
        name: service.adventure.name,
        category: service.adventure.category
      },
      title: service.title,
      type: service.type,
      pricing: {
        basePrice: service.basePrice,
        discountPrice: service.discountPrice
      },
      meta: service.meta || {},
      features: service.features || [],
      images: service.images || [],
      itinerary: service.itinerary || [],
      isActive: service.isActive,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt
    };
  } catch (error) {
    throw error;
  }
};
var createService = async (data, vendorId) => {
  try {
    const {
      adventureId,
      title,
      type,
      basePrice,
      discountPrice,
      meta,
      features,
      images,
      itinerary
    } = data;
    if (!adventureId || !title || !type || !basePrice) {
      throw new Error("Adventure, title, type and basePrice are required");
    }
    const adventure = await adventure_model_default.findOne({
      _id: adventureId,
      vendorId,
      isActive: true
    });
    if (!adventure) {
      throw new Error("Adventure not found or unauthorized");
    }
    if (type === "distance") {
      if (!meta?.distance) {
        throw new Error("Distance is required for distance type");
      }
    }
    if (type === "time") {
      if (!meta?.duration) {
        throw new Error("Duration is required for time type");
      }
    }
    if (type === "package") {
      if (!meta?.days || !meta?.nights) {
        throw new Error("Days and nights are required for package");
      }
      if (!itinerary || !itinerary.length) {
        throw new Error("Itinerary is required for package");
      }
    }
    const service = await service_model_default.create({
      adventure: adventureId,
      title,
      type,
      basePrice,
      discountPrice,
      meta,
      features,
      images,
      itinerary
    });
    return service;
  } catch (error) {
    throw error;
  }
};
var updateService = async (id, data, vendorId) => {
  try {
    if (!import_mongoose36.default.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid service id");
    }
    const service = await service_model_default.findById(id);
    if (!service) {
      throw new Error("Service not found");
    }
    const adventure = await adventure_model_default.findOne({
      _id: service.adventure,
      vendorId,
      isActive: true
    });
    if (!adventure) {
      throw new Error("Unauthorized access");
    }
    const {
      title,
      type,
      basePrice,
      discountPrice,
      meta,
      features,
      images,
      itinerary
    } = data;
    if (type === "distance") {
      if (!meta?.distance) {
        throw new Error("Distance is required");
      }
    }
    if (type === "time") {
      if (!meta?.duration) {
        throw new Error("Duration is required");
      }
    }
    if (type === "package") {
      if (!meta?.days || !meta?.nights) {
        throw new Error("Days and nights required");
      }
      if (!itinerary || !itinerary.length) {
        throw new Error("Itinerary required");
      }
    }
    if (title !== void 0) service.title = title;
    if (type !== void 0) service.type = type;
    if (basePrice !== void 0) service.basePrice = basePrice;
    if (discountPrice !== void 0) service.discountPrice = discountPrice;
    if (meta !== void 0) service.meta = meta;
    if (features !== void 0) service.features = features;
    if (images !== void 0) service.images = images;
    if (itinerary !== void 0) service.itinerary = itinerary;
    await service.save();
    return service;
  } catch (error) {
    throw error;
  }
};
var deleteService = async (id, vendorId) => {
  try {
    if (!import_mongoose36.default.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid service id");
    }
    const service = await service_model_default.findById(id);
    if (!service) {
      throw new Error("Service not found");
    }
    const adventure = await adventure_model_default.findOne({
      _id: service.adventure,
      vendorId,
      isActive: true
    });
    if (!adventure) {
      throw new Error("Unauthorized access");
    }
    service.isActive = false;
    await service.save();
    return true;
  } catch (error) {
    throw error;
  }
};
var service_service = {
  getServiceDetails,
  getVendorServices,
  getVendorServiceById,
  createService,
  updateService,
  deleteService
};
var service_service_default = service_service;

// src/modules/adventure/service/service.controller.ts
var ServiceController = class {
  async getServiceDetails(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user._id || null;
      const data = await service_service_default.getServiceDetails(id, userId);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      logger_default.error("Controller Error: getServiceDetails", error);
      next(error);
    }
  }
  async getVendorServices(req, res, next) {
    try {
      const userId = req.user._id;
      const vendor = await vendor_model_default.findOne({ userId });
      if (!vendor) {
        throw new Error("Vendor profile not found");
      }
      const services = await service_service_default.getVendorServices(vendor._id);
      res.status(200).json({
        success: true,
        count: services.length,
        data: services
      });
    } catch (error) {
      logger_default.error("Controller Error: getVendorServices", error);
      next(error);
    }
  }
  async getVendorServiceById(req, res, next) {
    try {
      const userId = req.user._id;
      const serviceId = req.params.id;
      const vendor = await vendor_model_default.findOne({ userId });
      if (!vendor) {
        throw new Error("Vendor profile not found");
      }
      const service = await service_service_default.getVendorServiceById(
        serviceId,
        vendor._id
      );
      res.status(200).json({
        success: true,
        data: service
      });
    } catch (error) {
      logger_default.error("Controller Error: getVendorServiceById", error);
      next(error);
    }
  }
  async createService(req, res, next) {
    try {
      const userId = req.user._id;
      const vendor = await vendor_model_default.findOne({
        userId
      });
      if (!vendor) {
        throw new Error("Vendor profile not found");
      }
      const service = await service_service_default.createService(req.body, vendor._id);
      res.status(201).json({
        success: true,
        data: service
      });
    } catch (error) {
      logger_default.error("Controller Error: createService", error);
      next(error);
    }
  }
  async updateService(req, res, next) {
    try {
      const userId = req.user._id;
      const serviceId = req.params.id;
      const vendor = await vendor_model_default.findOne({
        userId
      });
      if (!vendor) {
        throw new Error("Vendor profile not found");
      }
      const service = await service_service_default.updateService(
        serviceId,
        req.body,
        vendor._id
      );
      res.status(200).json({
        success: true,
        data: service
      });
    } catch (error) {
      logger_default.error("Controller Error: updateService", error);
      next(error);
    }
  }
  async deleteService(req, res, next) {
    try {
      const userId = req.user._id;
      const serviceId = req.params.id;
      const vendor = await vendor_model_default.findOne({
        userId
      });
      if (!vendor) {
        throw new Error("Vendor profile not found");
      }
      await service_service_default.deleteService(serviceId, vendor._id);
      res.status(200).json({
        success: true,
        message: "Service deleted successfully"
      });
    } catch (error) {
      logger_default.error("Controller Error: deleteService", error);
      next(error);
    }
  }
};

// src/modules/adventure/service/service.routes.ts
var router17 = (0, import_express17.Router)();
var serviceController = new ServiceController();
router17.get("/:id", optionalProtect, serviceController.getServiceDetails);
router17.post(
  "/vendor/services",
  protect,
  authorize("vendor"),
  serviceController.createService
);
router17.get(
  "/vendor/services",
  protect,
  authorize("vendor"),
  serviceController.getVendorServices
);
router17.get(
  "/vendor/services/:id",
  protect,
  authorize("vendor"),
  serviceController.getVendorServiceById
);
router17.put(
  "/vendor/services/:id",
  protect,
  authorize("vendor"),
  serviceController.updateService
);
router17.delete(
  "/vendor/services/:id",
  protect,
  authorize("vendor"),
  serviceController.deleteService
);
var service_routes_default = router17;

// src/modules/cab/company/cab.routes.ts
var import_express18 = require("express");

// src/modules/cab/company/cab.service.ts
var createCabCompany = async (vendor, data) => {
  try {
    if (vendor.isSubmitted && vendor.status !== "rejected") {
      throw new Error("Already submitted. Cannot edit.");
    }
    if (vendor.currentStep !== 3 && vendor.status !== "rejected") {
      throw new Error("Invalid step flow");
    }
    if (vendor.status === "rejected" && vendor.rejectedStep !== 4) {
      throw new Error("Fix required step first");
    }
    const {
      name,
      location,
      description,
      images = [],
      features = [],
      documents = [],
      address,
      coordinates
    } = data;
    if (!name || !name.trim()) {
      throw new Error("Cab company name is required");
    }
    if (!location || !location.city) {
      throw new Error("Location city is required");
    }
    let addressValue;
    if (typeof address === "object" && address !== null) {
      addressValue = address;
    } else {
      addressValue = typeof address === "string" ? address.trim() : "";
    }
    let cab = await cab_model_default.findOne({
      vendorId: vendor._id
    });
    if (cab) {
      Object.assign(cab, {
        name: name.trim(),
        location: {
          city: location.city.trim(),
          state: location.state || "",
          country: location.country || "India"
        },
        address: addressValue,
        coordinates: {
          lat: coordinates?.lat || null,
          lng: coordinates?.lng || null
        },
        description: description?.trim() || "",
        images,
        features,
        documents,
        verificationStatus: "pending"
      });
      await cab.save();
    } else {
      cab = await cab_model_default.create({
        name: name.trim(),
        location: {
          city: location.city.trim(),
          state: location.state || "",
          country: location.country || "India"
        },
        address: addressValue,
        coordinates: {
          lat: coordinates?.lat || null,
          lng: coordinates?.lng || null
        },
        description: description?.trim() || "",
        images,
        features,
        documents,
        vendorId: vendor._id,
        verificationStatus: "pending",
        isActive: false
      });
    }
    vendor.currentStep = 4;
    vendor.registrationStep = Math.max(vendor.registrationStep, 4);
    if (vendor.status === "rejected") {
      vendor.status = "draft";
      vendor.rejectedStep = null;
      vendor.adminRemark = null;
    }
    await vendor.save();
    return cab;
  } catch (error) {
    logger_default.error("Service Error: createCabCompany", error);
    throw error;
  }
};
var CabCompanyService = class {
  async createCabCompany(vendor, data) {
    return createCabCompany(vendor, data);
  }
};
var cabCompanyService = new CabCompanyService();
var cab_service_default = cabCompanyService;

// src/modules/cab/company/cab.controller.ts
var CabController = class {
  async createCabCompany(req, res, next) {
    try {
      const userId = req.user._id;
      const vendor = await vendor_model_default.findOne({ userId });
      if (!vendor) {
        throw new Error("Vendor profile not found");
      }
      const cab = await cab_service_default.createCabCompany(vendor, req.body);
      res.status(200).json({
        success: true,
        message: "Step 4 completed successfully",
        data: {
          currentStep: vendor.currentStep,
          registrationStep: vendor.registrationStep,
          status: vendor.status
        }
      });
    } catch (error) {
      logger_default.error("Controller Error: createCabCompany", error);
      next(error);
    }
  }
};

// src/modules/cab/company/cab.routes.ts
var router18 = (0, import_express18.Router)();
var cabController = new CabController();
router18.post(
  "/vendor/cabs",
  protect,
  authorize("vendor"),
  cabController.createCabCompany
);
var cab_routes_default = router18;

// src/modules/cab/service/cabService.routes.ts
var import_express19 = require("express");

// src/modules/cab/service/cabService.service.ts
var import_mongoose37 = __toESM(require("mongoose"), 1);
init_cabService_model();
var attachFavoriteFlag3 = async (items, userId, itemType) => {
  if (!userId || items.length === 0) {
    items.forEach((item) => item.isFavorite = false);
    return items;
  }
  const itemIds = items.map((i) => i.company?.companyId || i.companyId || i.serviceId || i._id);
  const favorites = await favorite_model_default.find({
    user: userId,
    itemType,
    itemId: { $in: itemIds }
  }).select("itemId");
  const favoriteSet = new Set(favorites.map((f) => f.itemId.toString()));
  items.forEach((item) => {
    const id = item.company?.companyId || item.companyId || item.serviceId || item._id;
    item.isFavorite = favoriteSet.has(id.toString());
  });
  return items;
};
var checkIsFavorite3 = async (itemId, userId, itemType) => {
  if (!userId || !itemId) return false;
  const fav = await favorite_model_default.findOne({
    user: userId,
    itemType,
    itemId
  }).select("_id");
  return !!fav;
};
var getCabs = async (query, userId = null) => {
  try {
    const { pickup = "", drop = "", page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const matchStage = {
      isActive: true,
      pickupLocation: { $regex: pickup, $options: "i" },
      dropLocation: { $regex: drop, $options: "i" }
    };
    const cabs = await cabService_model_default.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "cabcompanies",
          localField: "cab",
          foreignField: "_id",
          as: "company"
        }
      },
      { $unwind: "$company" },
      {
        $match: {
          "company.isActive": true,
          "company.verificationStatus": "verified"
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          carName: 1,
          cabType: 1,
          capacity: 1,
          images: 1,
          basePrice: 1,
          discountPrice: 1,
          meta: 1,
          "company._id": 1,
          "company.name": 1,
          "company.rating": 1,
          "company.location": 1
        }
      },
      { $sort: { basePrice: 1 } },
      { $skip: Number(skip) },
      { $limit: Number(limit) }
    ]);
    const taxDoc = await tax_model_default.findOne({ isActive: true }).lean();
    const taxPercentage = taxDoc?.taxPercentage || 0;
    const formattedCabs = cabs.map((cab) => {
      const effectivePrice = cab.discountPrice && cab.discountPrice > 0 ? cab.discountPrice : cab.basePrice;
      const totalTax = Number(
        (effectivePrice * taxPercentage / 100).toFixed(2)
      );
      const totalPriceWithTax = Number((effectivePrice + totalTax).toFixed(2));
      return {
        serviceId: cab._id,
        serviceType: "cab",
        title: cab.title,
        carName: cab.carName,
        cabType: cab.cabType,
        capacity: cab.capacity,
        image: cab.images?.[0]?.url || null,
        price: effectivePrice,
        totalPrice: effectivePrice,
        totalTax,
        totalPriceWithTax,
        taxPercentage,
        meta: cab.meta || {},
        company: {
          companyId: cab.company._id,
          name: cab.company.name,
          rating: cab.company.rating?.average || 0,
          reviews: cab.company.rating?.count || 0,
          location: cab.company.location?.city || ""
        }
      };
    });
    const updatedCabs = await attachFavoriteFlag3(formattedCabs, userId, "cab");
    return {
      cabs: updatedCabs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        count: updatedCabs.length
      }
    };
  } catch (error) {
    throw error;
  }
};
var getCabCompanyDetails = async (id, userId = null) => {
  try {
    if (!import_mongoose37.default.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid company id");
    }
    const company = await cab_model_default.findOne({
      _id: id,
      isActive: true,
      verificationStatus: "verified"
    }).select("name location description images rating features").lean();
    if (!company) {
      throw new Error("Cab company not found");
    }
    const services = await cabService_model_default.find({
      cab: id,
      isActive: true
    }).select(
      "title carName cabType capacity basePrice discountPrice images meta features pickupLocation dropLocation"
    ).sort({ basePrice: 1 }).lean();
    const taxDoc = await tax_model_default.findOne({ isActive: true }).lean();
    const taxPercentage = taxDoc?.taxPercentage || 0;
    const formattedServices = services.map((service) => {
      const effectivePrice = service.discountPrice && service.discountPrice > 0 ? service.discountPrice : service.basePrice;
      const totalTax = Number(
        (effectivePrice * taxPercentage / 100).toFixed(2)
      );
      const totalPriceWithTax = Number((effectivePrice + totalTax).toFixed(2));
      return {
        serviceId: service._id,
        serviceType: "cab",
        title: service.title,
        carName: service.carName,
        cabType: service.cabType,
        capacity: service.capacity,
        route: {
          pickup: service.pickupLocation,
          drop: service.dropLocation
        },
        price: effectivePrice,
        totalPrice: effectivePrice,
        totalTax,
        totalPriceWithTax,
        taxPercentage,
        images: service.images || [],
        features: service.features || [],
        meta: service.meta || {}
      };
    });
    const isFavorite = await checkIsFavorite3(company._id, userId, "cab");
    return {
      companyId: company._id,
      name: company.name,
      location: company.location,
      description: company.description,
      rating: company.rating?.average || 0,
      reviews: company.rating?.count || 0,
      images: company.images || [],
      features: company.features || [],
      services: formattedServices,
      isFavorite
    };
  } catch (error) {
    throw error;
  }
};
var getCabServiceDetails = async (id, userId = null) => {
  try {
    if (!import_mongoose37.default.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid service id");
    }
    const service = await cabService_model_default.findOne({
      _id: id,
      isActive: true
    }).lean();
    if (!service) {
      throw new Error("Cab service not found");
    }
    const company = await cab_model_default.findOne({
      _id: service.cab,
      isActive: true
    }).select("name location rating images description").lean();
    const taxDoc = await tax_model_default.findOne({ isActive: true }).lean();
    const taxPercentage = taxDoc?.taxPercentage || 0;
    const effectivePrice = service.discountPrice && service.discountPrice > 0 ? service.discountPrice : service.basePrice;
    const totalTax = Number(
      (effectivePrice * taxPercentage / 100).toFixed(2)
    );
    const totalPriceWithTax = Number((effectivePrice + totalTax).toFixed(2));
    const isFavorite = await checkIsFavorite3(company?._id, userId, "cab");
    const formattedService = {
      serviceId: service._id,
      serviceType: "cab",
      isFavorite,
      title: service.title,
      description: service.description,
      carName: service.carName,
      cabType: service.cabType,
      capacity: service.capacity,
      route: {
        pickup: service.pickupLocation,
        drop: service.dropLocation
      },
      price: effectivePrice,
      totalPrice: effectivePrice,
      totalTax,
      totalPriceWithTax,
      taxPercentage,
      images: service.images || [],
      features: service.features || [],
      meta: service.meta || {}
    };
    const formattedCompany = {
      companyId: company?._id,
      name: company?.name,
      location: company?.location,
      rating: company?.rating?.average || 0,
      reviews: company?.rating?.count || 0,
      image: company?.images?.[0] || null,
      description: company?.description
    };
    return {
      service: formattedService,
      company: formattedCompany
    };
  } catch (error) {
    throw error;
  }
};
var createCabService = async (data, vendorId) => {
  try {
    const {
      cabId,
      title,
      pickupLocation,
      dropLocation,
      carName,
      cabType,
      capacity,
      carNumber,
      basePrice,
      discountPrice = 0,
      meta = {},
      description,
      features = [],
      images = []
    } = data;
    if (!cabId || !import_mongoose37.default.Types.ObjectId.isValid(cabId)) {
      throw new Error("Valid cabId is required");
    }
    if (!title) throw new Error("Title is required");
    if (!pickupLocation || !dropLocation) {
      throw new Error("Pickup and Drop locations are required");
    }
    if (!carName) throw new Error("Car name is required");
    if (!cabType) throw new Error("Cab type is required");
    if (!capacity || capacity <= 0) {
      throw new Error("Valid capacity is required");
    }
    if (!basePrice || basePrice < 0) {
      throw new Error("Valid base price is required");
    }
    if (discountPrice > basePrice) {
      throw new Error("Discount price cannot exceed base price");
    }
    const cab = await cab_model_default.findOne({
      _id: cabId,
      vendorId,
      isActive: true
    });
    if (!cab) {
      throw new Error("Cab company not found or unauthorized");
    }
    const service = await cabService_model_default.create({
      cab: cabId,
      title: title.trim(),
      pickupLocation: pickupLocation.trim(),
      dropLocation: dropLocation.trim(),
      carName: carName.trim(),
      cabType,
      capacity,
      carNumber: carNumber?.trim(),
      basePrice,
      discountPrice,
      meta,
      description: description?.trim() || "",
      features,
      images,
      isActive: true
    });
    return service;
  } catch (error) {
    throw error;
  }
};
var getVendorCabServices = async (query = {}, vendorId) => {
  try {
    const { cabId, search, cabType, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const vendorCabs = await cab_model_default.find({ vendorId }).select("_id").lean();
    const cabIds = vendorCabs.map((c) => c._id);
    const filter = {
      cab: { $in: cabIds }
    };
    if (cabId) {
      filter.cab = cabId;
    }
    if (cabType) {
      filter.cabType = cabType;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { pickupLocation: { $regex: search, $options: "i" } },
        { dropLocation: { $regex: search, $options: "i" } }
      ];
    }
    const services = await cabService_model_default.find(filter).populate("cab", "name").sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean();
    const total = await cabService_model_default.countDocuments(filter);
    const formatted = services.map((s) => ({
      id: s._id,
      title: s.title,
      cabCompany: s.cab?.name || null,
      route: {
        pickup: s.pickupLocation,
        drop: s.dropLocation
      },
      car: {
        name: s.carName,
        type: s.cabType,
        capacity: s.capacity
      },
      pricing: {
        basePrice: s.basePrice,
        discountPrice: s.discountPrice
      },
      isActive: s.isActive
    }));
    return {
      count: formatted.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: formatted
    };
  } catch (error) {
    throw error;
  }
};
var getVendorCabServiceById = async (serviceId, vendorId) => {
  try {
    if (!import_mongoose37.default.Types.ObjectId.isValid(serviceId)) {
      throw new Error("Invalid service id");
    }
    const service = await cabService_model_default.findById(serviceId).populate("cab", "name vendorId").lean();
    if (!service) {
      throw new Error("Cab service not found");
    }
    if (service.cab.vendorId.toString() !== vendorId.toString()) {
      throw new Error("Unauthorized access");
    }
    const formatted = {
      id: service._id,
      cabCompany: {
        id: service.cab._id,
        name: service.cab.name
      },
      title: service.title,
      route: {
        pickup: service.pickupLocation,
        drop: service.dropLocation
      },
      car: {
        name: service.carName,
        type: service.cabType,
        capacity: service.capacity,
        number: service.carNumber
      },
      pricing: {
        basePrice: service.basePrice,
        discountPrice: service.discountPrice
      },
      meta: service.meta || {},
      description: service.description || "",
      features: service.features || [],
      images: service.images || [],
      isActive: service.isActive,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt
    };
    return formatted;
  } catch (error) {
    throw error;
  }
};
var updateVendorCabService = async (serviceId, vendorId, data) => {
  try {
    if (!import_mongoose37.default.Types.ObjectId.isValid(serviceId)) {
      throw new Error("Invalid service id");
    }
    const service = await cabService_model_default.findById(serviceId).populate(
      "cab",
      "vendorId"
    );
    if (!service) {
      throw new Error("Cab service not found");
    }
    if (service.cab.vendorId.toString() !== vendorId.toString()) {
      throw new Error("Unauthorized access");
    }
    if (data.basePrice !== void 0 && data.basePrice < 0) {
      throw new Error("Base price must be valid");
    }
    const finalBasePrice = data.basePrice ?? service.basePrice;
    const finalDiscountPrice = data.discountPrice ?? service.discountPrice;
    if (finalDiscountPrice > finalBasePrice) {
      throw new Error("Discount cannot exceed base price");
    }
    const allowedFields = [
      "title",
      "pickupLocation",
      "dropLocation",
      "carName",
      "cabType",
      "capacity",
      "carNumber",
      "basePrice",
      "discountPrice",
      "meta",
      "description",
      "features",
      "images",
      "isActive"
    ];
    allowedFields.forEach((field) => {
      if (data[field] !== void 0) {
        service[field] = typeof data[field] === "string" ? data[field].trim() : data[field];
      }
    });
    await service.save();
    return service;
  } catch (error) {
    throw error;
  }
};
var deleteVendorCabService = async (serviceId, vendorId) => {
  try {
    if (!import_mongoose37.default.Types.ObjectId.isValid(serviceId)) {
      throw new Error("Invalid service id");
    }
    const service = await cabService_model_default.findById(serviceId).populate(
      "cab",
      "vendorId"
    );
    if (!service) {
      throw new Error("Cab service not found");
    }
    if (service.cab.vendorId.toString() !== vendorId.toString()) {
      throw new Error("Unauthorized access");
    }
    service.isActive = false;
    await service.save();
    return;
  } catch (error) {
    throw error;
  }
};
var CabServiceService = class {
  async getCabs(query, userId = null) {
    return getCabs(query, userId);
  }
  async getCabCompanyDetails(id, userId = null) {
    return getCabCompanyDetails(id, userId);
  }
  async getCabServiceDetails(id, userId = null) {
    return getCabServiceDetails(id, userId);
  }
  async createCabService(data, vendorId) {
    return createCabService(data, vendorId);
  }
  async getVendorCabServices(query = {}, vendorId) {
    return getVendorCabServices(query, vendorId);
  }
  async getVendorCabServiceById(serviceId, vendorId) {
    return getVendorCabServiceById(serviceId, vendorId);
  }
  async updateVendorCabService(serviceId, vendorId, data) {
    return updateVendorCabService(serviceId, vendorId, data);
  }
  async deleteVendorCabService(serviceId, vendorId) {
    return deleteVendorCabService(serviceId, vendorId);
  }
};
var cabServiceService = new CabServiceService();
var cabService_service_default = cabServiceService;

// src/modules/cab/service/cabService.controller.ts
var CabServiceController = class {
  //user side...
  async getCabs(req, res, next) {
    try {
      const userId = req.user._id || null;
      const data = await cabService_service_default.getCabs(req.query, userId);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      logger_default.error("Controller Error: getCabs", error);
      next(error);
    }
  }
  async getCabCompanyDetails(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user._id || null;
      const data = await cabService_service_default.getCabCompanyDetails(id, userId);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      logger_default.error("Controller Error: getCabCompanyDetails", error);
      next(error);
    }
  }
  async getCabServiceDetails(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user._id || null;
      const data = await cabService_service_default.getCabServiceDetails(id, userId);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      logger_default.error("Controller Error: getCabServiceDetails", error);
      next(error);
    }
  }
  //vendor side....
  async createCabService(req, res, next) {
    try {
      const userId = req.user._id;
      const vendor = await vendor_model_default.findOne({ userId });
      if (!vendor) {
        throw new Error("Vendor profile not found");
      }
      const service = await cabService_service_default.createCabService(req.body, vendor._id);
      res.status(201).json({
        success: true,
        message: "Cab service created successfully",
        data: service
      });
    } catch (error) {
      logger_default.error("Controller Error: createCabService", error);
      next(error);
    }
  }
  async getVendorCabServices(req, res, next) {
    try {
      const userId = req.user._id;
      const vendor = await vendor_model_default.findOne({ userId });
      if (!vendor) {
        throw new Error("Vendor profile not found");
      }
      const result = await cabService_service_default.getVendorCabServices(req.query, vendor._id);
      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      logger_default.error("Controller Error: getVendorCabServices", error);
      next(error);
    }
  }
  async getVendorCabServiceById(req, res, next) {
    try {
      const userId = req.user._id;
      const serviceId = req.params.id;
      const vendor = await vendor_model_default.findOne({ userId });
      if (!vendor) {
        throw new Error("Vendor profile not found");
      }
      const service = await cabService_service_default.getVendorCabServiceById(
        serviceId,
        vendor._id
      );
      res.status(200).json({
        success: true,
        data: service
      });
    } catch (error) {
      logger_default.error("Controller Error: getVendorCabServiceById", error);
      next(error);
    }
  }
  async updateVendorCabService(req, res, next) {
    try {
      const userId = req.user._id;
      const serviceId = req.params.id;
      const vendor = await vendor_model_default.findOne({ userId });
      if (!vendor) {
        throw new Error("Vendor profile not found");
      }
      const updated = await cabService_service_default.updateVendorCabService(
        serviceId,
        vendor._id,
        req.body
      );
      res.status(200).json({
        success: true,
        message: "Cab service updated successfully",
        data: updated
      });
    } catch (error) {
      logger_default.error("Controller Error: updateCabService", error);
      next(error);
    }
  }
  async deleteVendorCabService(req, res, next) {
    try {
      const userId = req.user._id;
      const serviceId = req.params.id;
      const vendor = await vendor_model_default.findOne({ userId });
      if (!vendor) {
        throw new Error("Vendor profile not found");
      }
      await cabService_service_default.deleteVendorCabService(serviceId, vendor._id);
      res.status(200).json({
        success: true,
        message: "Cab service deleted successfully"
      });
    } catch (error) {
      logger_default.error("Controller Error: deleteCabService", error);
      next(error);
    }
  }
};

// src/modules/cab/service/cabService.routes.ts
var router19 = (0, import_express19.Router)();
var cabServiceController = new CabServiceController();
router19.get("/", optionalProtect, cabServiceController.getCabs);
router19.get("/:id", optionalProtect, cabServiceController.getCabServiceDetails);
router19.get(
  "/company/:id",
  optionalProtect,
  cabServiceController.getCabCompanyDetails
);
router19.post(
  "/vendor/cab-services",
  protect,
  authorize("vendor"),
  cabServiceController.createCabService
);
router19.get(
  "/vendor/cab-services",
  protect,
  authorize("vendor"),
  cabServiceController.getVendorCabServices
);
router19.get(
  "/vendor/cab-services/:id",
  protect,
  authorize("vendor"),
  cabServiceController.getVendorCabServiceById
);
router19.put(
  "/vendor/cab-services/:id",
  protect,
  authorize("vendor"),
  cabServiceController.updateVendorCabService
);
router19.delete(
  "/vendor/cab-services/:id",
  protect,
  authorize("vendor"),
  cabServiceController.deleteVendorCabService
);
var cabService_routes_default = router19;

// src/modules/bike/company/bike.routes.ts
var import_express20 = require("express");

// src/modules/bike/company/bike.service.ts
var createBikeCompany = async (data, vendor) => {
  try {
    if (vendor.isSubmitted && vendor.status !== "rejected") {
      throw new Error("Already submitted. Cannot edit.");
    }
    if (vendor.currentStep !== 3 && vendor.status !== "rejected") {
      throw new Error("Invalid step flow");
    }
    if (vendor.status === "rejected" && vendor.rejectedStep !== 4) {
      throw new Error("Fix required step first");
    }
    const {
      name,
      location,
      address,
      images = [],
      description,
      features = [],
      documents = [],
      coordinates,
      rentalPolicies = {}
    } = data;
    if (!name || !name.trim()) {
      throw new Error("Bike company name is required");
    }
    if (!location || !location.city) {
      throw new Error("Location city is required");
    }
    let addressValue;
    if (typeof address === "object" && address !== null) {
      addressValue = address;
    } else {
      addressValue = typeof address === "string" ? address.trim() : "";
    }
    let bikeCompany = await bike_model_default.findOne({
      vendorId: vendor._id
    });
    if (bikeCompany) {
      Object.assign(bikeCompany, {
        name: name.trim(),
        location: {
          city: location.city.trim(),
          state: location.state || "",
          country: location.country || "India"
        },
        address: addressValue,
        coordinates: {
          lat: coordinates?.lat || null,
          lng: coordinates?.lng || null
        },
        images,
        documents,
        description: description?.trim() || "",
        features,
        rentalPolicies,
        verificationStatus: "pending"
      });
      await bikeCompany.save();
    } else {
      bikeCompany = await bike_model_default.create({
        name: name.trim(),
        location: {
          city: location.city.trim(),
          state: location.state || "",
          country: location.country || "India"
        },
        address: addressValue,
        coordinates: {
          lat: coordinates?.lat || null,
          lng: coordinates?.lng || null
        },
        images,
        documents,
        description: description?.trim() || "",
        features,
        rentalPolicies,
        vendorId: vendor._id,
        verificationStatus: "pending",
        isActive: false
      });
    }
    vendor.currentStep = 4;
    vendor.registrationStep = Math.max(vendor.registrationStep, 4);
    if (vendor.status === "rejected") {
      vendor.status = "draft";
      vendor.rejectedStep = null;
      vendor.adminRemark = null;
    }
    await vendor.save();
    return bikeCompany;
  } catch (error) {
    logger_default.error("Service Error: createCabCompany", error);
    throw error;
  }
};
var bike_service = {
  createBikeCompany
};
var bike_service_default = bike_service;

// src/modules/bike/company/bike.controller.ts
var BikeController = class {
  async createBikeCompany(req, res, next) {
    try {
      const userId = req.user._id;
      const vendor = await vendor_model_default.findOne({ userId });
      if (!vendor) {
        throw new Error("Vendor profile not found");
      }
      const bike = await bike_service_default.createBikeCompany(req.body, vendor);
      res.status(200).json({
        success: true,
        message: "Step 4 completed successfully",
        data: {
          currentStep: vendor.currentStep,
          registrationStep: vendor.registrationStep,
          status: vendor.status
        }
      });
    } catch (error) {
      logger_default.error("Controller Error: createBikeCompany", error);
      next(error);
    }
  }
};

// src/modules/bike/company/bike.routes.ts
var router20 = (0, import_express20.Router)();
var bikeController = new BikeController();
router20.post(
  "/vendor/bikes",
  protect,
  authorize("vendor"),
  bikeController.createBikeCompany
);
var bike_routes_default = router20;

// src/modules/bike/service/bikeService.routes.ts
var import_express21 = require("express");

// src/modules/bike/service/bikeService.service.ts
var import_mongoose38 = __toESM(require("mongoose"), 1);
init_bikeService_model();
var attachFavoriteFlag4 = async (items, userId, itemType) => {
  if (!userId || items.length === 0) {
    items.forEach((item) => item.isFavorite = false);
    return items;
  }
  const itemIds = items.map((i) => i.company?.companyId || i.companyId || i.serviceId || i._id);
  const favorites = await favorite_model_default.find({
    user: userId,
    itemType,
    itemId: { $in: itemIds }
  }).select("itemId");
  const favoriteSet = new Set(favorites.map((f) => f.itemId.toString()));
  items.forEach((item) => {
    const id = item.company?.companyId || item.companyId || item.serviceId || item._id;
    item.isFavorite = favoriteSet.has(id.toString());
  });
  return items;
};
var checkIsFavorite4 = async (itemId, userId, itemType) => {
  if (!userId || !itemId) return false;
  const fav = await favorite_model_default.findOne({
    user: userId,
    itemType,
    itemId
  }).select("_id");
  return !!fav;
};
var getBikes = async (query, userId = null) => {
  try {
    const { city = "", page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const matchStage = {
      isActive: true
    };
    const bikes = await bikeService_model_default.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "bikecompanies",
          localField: "bike",
          foreignField: "_id",
          as: "company"
        }
      },
      { $unwind: "$company" },
      {
        $match: {
          "company.isActive": true,
          "company.location.city": {
            $regex: city,
            $options: "i"
          },
          "company.verificationStatus": "verified"
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          bikeName: 1,
          bikeType: 1,
          pricePerDay: 1,
          discountPrice: 1,
          images: 1,
          "company._id": 1,
          "company.name": 1,
          "company.rating": 1,
          "company.location": 1
        }
      },
      { $sort: { pricePerDay: 1 } },
      { $skip: Number(skip) },
      { $limit: Number(limit) }
    ]);
    const taxDoc = await tax_model_default.findOne({ isActive: true }).lean();
    const taxPercentage = taxDoc?.taxPercentage || 0;
    const formattedBikes = bikes.map((bike) => {
      const effectivePrice = bike.discountPrice > 0 ? bike.discountPrice : bike.pricePerDay;
      const totalTax = Number(
        (effectivePrice * taxPercentage / 100).toFixed(2)
      );
      const totalPriceWithTax = Number((effectivePrice + totalTax).toFixed(2));
      return {
        serviceId: bike._id,
        serviceType: "bike",
        bikeName: bike.bikeName,
        bikeType: bike.bikeType,
        pricePerDay: effectivePrice,
        totalPriceWithTax,
        taxPercentage,
        thumbnail: bike.images?.[0] || null,
        company: {
          companyId: bike.company._id,
          serviceType: "bike",
          name: bike.company.name,
          city: bike.company.location?.city,
          rating: bike.company.rating?.average || 0
        }
      };
    });
    const updatedBikes = await attachFavoriteFlag4(formattedBikes, userId, "bike");
    return {
      bikes: updatedBikes,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        count: updatedBikes.length
      }
    };
  } catch (error) {
    throw error;
  }
};
var getBikeCompanyDetails = async (id, userId = null) => {
  try {
    if (!import_mongoose38.default.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid company id");
    }
    const company = await bike_model_default.findOne({
      _id: id,
      isActive: true,
      verificationStatus: "verified"
    }).select("name location description images rating features rentalPolicies").lean();
    if (!company) {
      throw new Error("Bike company not found");
    }
    const services = await bikeService_model_default.find({
      bike: id,
      isActive: true
    }).select(
      "title bikeName bikeType pricePerDay discountPrice images features meta"
    ).sort({ pricePerDay: 1 }).lean();
    const taxDoc = await tax_model_default.findOne({ isActive: true }).lean();
    const taxPercentage = taxDoc?.taxPercentage || 0;
    const formattedServices = services.map((service) => {
      const effectivePrice = service.discountPrice > 0 ? service.discountPrice : service.pricePerDay;
      const totalTax = Number(
        (effectivePrice * taxPercentage / 100).toFixed(2)
      );
      const totalPriceWithTax = Number((effectivePrice + totalTax).toFixed(2));
      return {
        serviceId: service._id,
        serviceType: "bike",
        bikeName: service.bikeName,
        bikeType: service.bikeType,
        mileage: service.meta?.mileage,
        gearType: service.meta?.gearType,
        pricePerDay: effectivePrice,
        totalPriceWithTax,
        taxPercentage,
        thumbnail: service.images?.[0] || null,
        features: service.features || []
      };
    });
    const isFavorite = await checkIsFavorite4(company._id, userId, "bike");
    const formattedCompany = {
      companyId: company._id,
      serviceType: "bike",
      isFavorite,
      name: company.name,
      description: company.description,
      city: company.location?.city,
      state: company.location?.state,
      rating: company.rating?.average || 0,
      reviews: company.rating?.count || 0,
      images: company.images || [],
      features: company.features || [],
      //IMPORTANT FOR BIKE RENTAL
      rentalPolicies: {
        helmetIncluded: company.rentalPolicies?.helmetIncluded,
        fuelPolicy: company.rentalPolicies?.fuelPolicy,
        securityDeposit: company.rentalPolicies?.securityDeposit,
        licenseRequired: company.rentalPolicies?.licenseRequired
      }
    };
    return {
      company: formattedCompany,
      services: formattedServices,
      isFavorite
    };
  } catch (error) {
    throw error;
  }
};
var getBikeServiceDetails = async (id, userId = null) => {
  try {
    if (!import_mongoose38.default.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid service id");
    }
    const service = await bikeService_model_default.findOne({
      _id: id,
      isActive: true
    }).lean();
    if (!service) {
      throw new Error("Bike service not found");
    }
    const company = await bike_model_default.findOne({
      _id: service.bike,
      isActive: true
    }).select("name location rating images description rentalPolicies").lean();
    const taxDoc = await tax_model_default.findOne({ isActive: true }).lean();
    const taxPercentage = taxDoc?.taxPercentage || 0;
    const effectivePrice = service.discountPrice > 0 ? service.discountPrice : service.pricePerDay;
    const totalTax = Number(
      (effectivePrice * taxPercentage / 100).toFixed(2)
    );
    const totalPriceWithTax = Number((effectivePrice + totalTax).toFixed(2));
    const isFavorite = await checkIsFavorite4(company?._id, userId, "bike");
    const formattedService = {
      serviceId: service._id,
      serviceType: "bike",
      isFavorite,
      title: service.title,
      description: service.description,
      bikeName: service.bikeName,
      bikeType: service.bikeType,
      engineCC: service.engineCC,
      fuelType: service.fuelType,
      mileage: service.meta?.mileage,
      gearType: service.meta?.gearType,
      pricePerDay: effectivePrice,
      totalPriceWithTax,
      taxPercentage,
      maxDurationDays: service.maxDurationDays,
      images: service.images || [],
      features: service.features || []
    };
    const formattedCompany = {
      companyId: company?._id,
      serviceType: "bike",
      isFavorite,
      name: company?.name,
      city: company?.location?.city,
      rating: company?.rating?.average || 0,
      images: company?.images || [],
      description: company?.description,
      rentalPolicies: company?.rentalPolicies || {}
    };
    return {
      company: formattedCompany,
      service: formattedService,
      isFavorite
    };
  } catch (error) {
    throw error;
  }
};
var calculateBikePrice = async (body) => {
  try {
    const { serviceId, startDate, endDate } = body;
    if (!import_mongoose38.default.Types.ObjectId.isValid(serviceId)) {
      throw new Error("Invalid service id");
    }
    if (!startDate || !endDate) {
      throw new Error("Start date and end date are required");
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      throw new Error("End date must be greater than start date");
    }
    const diffTime = end.getTime() - start.getTime();
    const totalDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
    const service = await bikeService_model_default.findOne({
      _id: serviceId,
      isActive: true
    }).lean();
    if (!service) {
      throw new Error("Bike service not found");
    }
    if (totalDays > service.maxDurationDays) {
      throw new Error(
        `Maximum rental duration is ${service.maxDurationDays} days`
      );
    }
    const pricePerDay = service.discountPrice > 0 ? service.discountPrice : service.pricePerDay;
    const totalBasePrice = pricePerDay * totalDays;
    const taxDoc = await tax_model_default.findOne({ isActive: true }).lean();
    const taxPercentage = taxDoc?.taxPercentage || 0;
    const totalTax = Number(
      (totalBasePrice * taxPercentage / 100).toFixed(2)
    );
    const finalAmount = Number((totalBasePrice + totalTax).toFixed(2));
    return {
      serviceId,
      pricePerDay,
      totalDays,
      totalBasePrice,
      taxPercentage,
      totalTax,
      finalAmount
    };
  } catch (error) {
    throw error;
  }
};
var createBikeService = async (data, vendorId) => {
  try {
    const {
      bikeId,
      title,
      bikeName,
      bikeType,
      engineCC,
      fuelType = "petrol",
      pricePerDay,
      discountPrice = 0,
      maxDurationDays = 7,
      description,
      features = [],
      meta = {},
      images = []
    } = data;
    if (!bikeId || !import_mongoose38.default.Types.ObjectId.isValid(bikeId)) {
      throw new Error("Valid bikeId is required");
    }
    if (!title) throw new Error("Title is required");
    if (!bikeName) throw new Error("Bike name is required");
    if (!bikeType) throw new Error("Bike type is required");
    if (!pricePerDay || pricePerDay < 0) {
      throw new Error("Valid price per day is required");
    }
    if (discountPrice > pricePerDay) {
      throw new Error("Discount price cannot exceed price per day");
    }
    const bikeCompany = await bike_model_default.findOne({
      _id: bikeId,
      vendorId,
      isActive: true
    });
    if (!bikeCompany) {
      throw new Error("Bike company not found or unauthorized");
    }
    const service = await bikeService_model_default.create({
      bike: bikeId,
      title: title.trim(),
      bikeName: bikeName.trim(),
      bikeType,
      engineCC,
      fuelType,
      pricePerDay,
      discountPrice,
      maxDurationDays,
      description: description?.trim() || "",
      features,
      meta,
      images,
      isActive: true
    });
    return service;
  } catch (error) {
    throw error;
  }
};
var getVendorBikeServices = async (query = {}, vendorId) => {
  try {
    const { bikeId, search, bikeType, page = 1, limit = 10 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const companies = await bike_model_default.find({ vendorId }).select("_id").lean();
    const bikeIds = companies.map((c) => c._id);
    const filter = {
      bike: { $in: bikeIds }
    };
    if (bikeId) {
      filter.bike = bikeId;
    }
    if (bikeType) {
      filter.bikeType = bikeType;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { bikeName: { $regex: search, $options: "i" } }
      ];
    }
    const services = await bikeService_model_default.find(filter).populate("bike", "name").sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean();
    const total = await bikeService_model_default.countDocuments(filter);
    const formatted = services.map((s) => ({
      id: s._id,
      title: s.title,
      company: s.bike?.name || null,
      bike: {
        name: s.bikeName,
        type: s.bikeType,
        engine: s.engineCC
      },
      pricing: {
        pricePerDay: s.pricePerDay,
        discountPrice: s.discountPrice
      },
      isActive: s.isActive
    }));
    return {
      count: formatted.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: formatted
    };
  } catch (error) {
    throw error;
  }
};
var getVendorBikeServiceById = async (serviceId, vendorId) => {
  try {
    if (!import_mongoose38.default.Types.ObjectId.isValid(serviceId)) {
      throw new Error("Invalid service id");
    }
    const service = await bikeService_model_default.findById(serviceId).populate("bike", "name vendorId").lean();
    if (!service) {
      throw new Error("Bike service not found");
    }
    if (service.bike.vendorId.toString() !== vendorId.toString()) {
      throw new Error("Unauthorized access");
    }
    const formatted = {
      id: service._id,
      company: {
        id: service.bike._id,
        name: service.bike.name
      },
      title: service.title,
      bike: {
        name: service.bikeName,
        type: service.bikeType,
        engine: service.engineCC,
        fuel: service.fuelType
      },
      pricing: {
        pricePerDay: service.pricePerDay,
        discountPrice: service.discountPrice
      },
      maxDurationDays: service.maxDurationDays,
      meta: service.meta || {},
      description: service.description || "",
      features: service.features || [],
      images: service.images || [],
      isActive: service.isActive,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt
    };
    return formatted;
  } catch (error) {
    throw error;
  }
};
var updateVendorBikeService = async (serviceId, vendorId, data) => {
  try {
    if (!import_mongoose38.default.Types.ObjectId.isValid(serviceId)) {
      throw new Error("Invalid service id");
    }
    const service = await bikeService_model_default.findById(serviceId).populate(
      "bike",
      "vendorId"
    );
    if (!service) {
      throw new Error("Bike service not found");
    }
    if (service.bike.vendorId.toString() !== vendorId.toString()) {
      throw new Error("Unauthorized access");
    }
    if (data.pricePerDay !== void 0 && data.pricePerDay < 0) {
      throw new Error("Invalid price per day");
    }
    if (data.discountPrice !== void 0 && data.pricePerDay !== void 0 && data.discountPrice > data.pricePerDay) {
      throw new Error("Discount cannot exceed price");
    }
    const allowedFields = [
      "title",
      "bikeName",
      "bikeType",
      "engineCC",
      "fuelType",
      "pricePerDay",
      "discountPrice",
      "maxDurationDays",
      "meta",
      "description",
      "features",
      "images",
      "isActive"
    ];
    allowedFields.forEach((field) => {
      if (data[field] !== void 0) {
        service[field] = typeof data[field] === "string" ? data[field].trim() : data[field];
      }
    });
    await service.save();
    return service;
  } catch (error) {
    throw error;
  }
};
var deleteVendorBikeService = async (serviceId, vendorId) => {
  try {
    if (!import_mongoose38.default.Types.ObjectId.isValid(serviceId)) {
      throw new Error("Invalid service id");
    }
    const service = await bikeService_model_default.findById(serviceId).populate(
      "bike",
      "vendorId"
    );
    if (!service) {
      throw new Error("Bike service not found");
    }
    if (service.bike.vendorId.toString() !== vendorId.toString()) {
      throw new Error("Unauthorized access");
    }
    service.isActive = false;
    await service.save();
    return;
  } catch (error) {
    throw error;
  }
};
var bikeService_service = {
  getBikes,
  getBikeCompanyDetails,
  getBikeServiceDetails,
  calculateBikePrice,
  createBikeService,
  getVendorBikeServices,
  getVendorBikeServiceById,
  updateVendorBikeService,
  deleteVendorBikeService
};
var bikeService_service_default = bikeService_service;

// src/modules/bike/service/bikeService.controller.ts
var BikeServiceController = class {
  //user side
  async getBikes(req, res, next) {
    try {
      const userId = req.user._id || null;
      const data = await bikeService_service_default.getBikes(req.query, userId);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      logger_default.error("Controller Error: getBikes", error);
      next(error);
    }
  }
  async getBikeCompanyDetails(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user._id || null;
      const data = await bikeService_service_default.getBikeCompanyDetails(id, userId);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      logger_default.error("Controller Error: getBikeCompanyDetails", error);
      next(error);
    }
  }
  async getBikeServiceDetails(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user._id || null;
      const data = await bikeService_service_default.getBikeServiceDetails(id, userId);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      logger_default.error("Controller Error: getBikeServiceDetails", error);
      next(error);
    }
  }
  async calculateBikePrice(req, res, next) {
    try {
      const data = await bikeService_service_default.calculateBikePrice(req.body);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      logger_default.error("Controller Error: calculateBikePrice", error);
      next(error);
    }
  }
  //vendor side
  async createBikeService(req, res, next) {
    try {
      const userId = req.user._id;
      const vendor = await vendor_model_default.findOne({
        userId
      });
      if (!vendor) {
        throw new Error("Vendor profile not found");
      }
      const service = await bikeService_service_default.createBikeService(req.body, vendor._id);
      res.status(201).json({
        success: true,
        message: "Bike service created successfully",
        data: service
      });
    } catch (error) {
      logger_default.error("Controller Error: createBikeService", error);
      next(error);
    }
  }
  async getVendorBikeServices(req, res, next) {
    try {
      const userId = req.user._id;
      const vendor = await vendor_model_default.findOne({
        userId
      });
      if (!vendor) {
        throw new Error("Vendor profile not found");
      }
      const result = await bikeService_service_default.getVendorBikeServices(
        req.query,
        vendor._id
      );
      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      logger_default.error("Controller Error: getVendorBikeServices", error);
      next(error);
    }
  }
  async getVendorBikeServiceById(req, res, next) {
    try {
      const userId = req.user._id;
      const serviceId = req.params.id;
      const vendor = await vendor_model_default.findOne({
        userId
      });
      if (!vendor) {
        throw new Error("Vendor profile not found");
      }
      const service = await bikeService_service_default.getVendorBikeServiceById(
        serviceId,
        vendor._id
      );
      res.status(200).json({
        success: true,
        data: service
      });
    } catch (error) {
      logger_default.error("Controller Error: getVendorBikeServiceById", error);
      next(error);
    }
  }
  async updateVendorBikeService(req, res, next) {
    try {
      const userId = req.user._id;
      const serviceId = req.params.id;
      const vendor = await vendor_model_default.findOne({
        userId
      });
      if (!vendor) {
        throw new Error("Vendor profile not found");
      }
      const updated = await bikeService_service_default.updateVendorBikeService(
        serviceId,
        vendor._id,
        req.body
      );
      res.status(200).json({
        success: true,
        message: "Bike service updated successfully",
        data: updated
      });
    } catch (error) {
      logger_default.error("Controller Error: updateBikeService", error);
      next(error);
    }
  }
  async deleteVendorBikeService(req, res, next) {
    try {
      const userId = req.user._id;
      const serviceId = req.params.id;
      const vendor = await vendor_model_default.findOne({
        userId
      });
      if (!vendor) {
        throw new Error("Vendor profile not found");
      }
      await bikeService_service_default.deleteVendorBikeService(serviceId, vendor._id);
      res.status(200).json({
        success: true,
        message: "Bike service deleted successfully"
      });
    } catch (error) {
      logger_default.error("Controller Error: deleteBikeService", error);
      next(error);
    }
  }
};

// src/modules/bike/service/bikeService.routes.ts
var router21 = (0, import_express21.Router)();
var bikeServiceController = new BikeServiceController();
router21.get("/", optionalProtect, bikeServiceController.getBikes);
router21.get(
  "/:id",
  optionalProtect,
  bikeServiceController.getBikeServiceDetails
);
router21.get(
  "/company/:id",
  optionalProtect,
  bikeServiceController.getBikeCompanyDetails
);
router21.post(
  "/vendor/bike-services",
  protect,
  authorize("vendor"),
  bikeServiceController.createBikeService
);
router21.get(
  "/vendor/bike-services",
  protect,
  authorize("vendor"),
  bikeServiceController.getVendorBikeServices
);
router21.get(
  "/vendor/bike-services/:id",
  protect,
  authorize("vendor"),
  bikeServiceController.getVendorBikeServiceById
);
router21.put(
  "/vendor/bike-services/:id",
  protect,
  authorize("vendor"),
  bikeServiceController.updateVendorBikeService
);
router21.delete(
  "/vendor/bike-services/:id",
  protect,
  authorize("vendor"),
  bikeServiceController.deleteVendorBikeService
);
var bikeService_routes_default = router21;

// src/modules/tour/company/tour.routes.ts
var import_express22 = require("express");

// src/modules/tour/company/tour.service.ts
var createTourCompany = async (data, vendor) => {
  try {
    if (vendor.isSubmitted && vendor.status !== "rejected") {
      throw new Error("Already submitted. Cannot edit.");
    }
    if (vendor.currentStep !== 3 && vendor.status !== "rejected") {
      throw new Error("Invalid step flow");
    }
    if (vendor.status === "rejected" && vendor.rejectedStep !== 4) {
      throw new Error("Fix required step first");
    }
    const {
      name,
      location,
      address,
      coordinates,
      images = [],
      documents = [],
      description,
      features = [],
      tags = []
    } = data;
    const city = (location?.city || data.city || data.hotelCity || "").trim();
    if (!name || !name.trim()) {
      throw new Error("Tour company name is required");
    }
    if (!city) {
      throw new Error("Location city is required");
    }
    const state = (location?.state || data.state || "").trim();
    const country = (location?.country || data.country || "India").trim();
    const coords = {
      lat: coordinates?.lat || data.lat || null,
      lng: coordinates?.lng || data.lng || null
    };
    let addressObj;
    if (typeof address === "object" && address !== null) {
      addressObj = {
        buildingName: address.buildingName || data.buildingName || "",
        doorNumber: address.doorNumber || data.doorNumber || "",
        streetAddress: address.streetAddress || address.address || data.hotelAddress || "",
        areaName: address.areaName || data.areaName || "",
        city: address.city || city || "Default City",
        district: address.district || data.district || "",
        state: address.state || state || "",
        postalCode: address.postalCode || data.postalCode || "",
        country: address.country || country || "India",
        countryCode: address.countryCode || "IN",
        landmark: address.landmark || data.landmark || "",
        directions: address.directions || data.directions || "",
        formattedAddress: address.formattedAddress || "",
        location: {
          type: "Point",
          coordinates: [coords.lng || 72.8777, coords.lat || 19.076]
        }
      };
    } else {
      const rawAddr = (address || data.hotelAddress || "").trim();
      addressObj = {
        buildingName: data.buildingName || "",
        doorNumber: data.doorNumber || "",
        streetAddress: rawAddr,
        areaName: data.areaName || "",
        city: city || "Default City",
        district: data.district || "",
        state: state || "",
        postalCode: data.postalCode || "",
        country: country || "India",
        countryCode: "IN",
        landmark: data.landmark || "",
        directions: data.directions || "",
        formattedAddress: rawAddr || city,
        location: {
          type: "Point",
          coordinates: [coords.lng || 72.8777, coords.lat || 19.076]
        }
      };
    }
    if (!addressObj.formattedAddress) {
      const parts = [
        addressObj.doorNumber,
        addressObj.buildingName,
        addressObj.streetAddress,
        addressObj.areaName,
        addressObj.landmark,
        addressObj.city,
        addressObj.district,
        addressObj.state,
        addressObj.postalCode,
        addressObj.country
      ].filter(Boolean);
      addressObj.formattedAddress = parts.join(", ");
    }
    let tourCompany = await tour_model_default.findOne({
      vendorId: vendor._id
    });
    if (tourCompany) {
      Object.assign(tourCompany, {
        name: name.trim(),
        location: {
          city: addressObj.city || city,
          state: addressObj.state || state,
          country: addressObj.country || country
        },
        address: addressObj,
        coordinates: coords,
        images,
        documents,
        description: description?.trim() || "",
        features,
        tags,
        verificationStatus: "pending"
      });
      await tourCompany.save();
    } else {
      tourCompany = await tour_model_default.create({
        name: name.trim(),
        location: {
          city: addressObj.city || city,
          state: addressObj.state || state,
          country: addressObj.country || country
        },
        address: addressObj,
        coordinates: coords,
        images,
        documents,
        description: description?.trim() || "",
        features,
        tags,
        vendorId: vendor._id,
        verificationStatus: "pending",
        isActive: false
      });
    }
    vendor.currentStep = 4;
    vendor.registrationStep = Math.max(vendor.registrationStep, 4);
    if (vendor.status === "rejected") {
      vendor.status = "draft";
      vendor.rejectedStep = null;
      vendor.adminRemark = null;
    }
    await vendor.save();
    return tourCompany;
  } catch (error) {
    throw error;
  }
};
var getAllTourCompanies = async (query = {}) => {
  try {
    const TourService2 = (await Promise.resolve().then(() => (init_tourService_model(), tourService_model_exports))).default;
    const { city, search, featured, rank, page = 1, limit = 50 } = query;
    const companiesWithActiveTours = await TourService2.distinct("tour", {
      isActive: true
    });
    if (!companiesWithActiveTours || companiesWithActiveTours.length === 0) {
      return {
        companies: [],
        total: 0,
        page: Math.max(1, Number(page) || 1),
        limit: Math.max(1, Number(limit) || 50)
      };
    }
    const filter = {
      _id: { $in: companiesWithActiveTours },
      verificationStatus: "verified",
      isActive: true
    };
    if (city && city.trim()) {
      const cityRegex = { $regex: new RegExp(city.trim(), "i") };
      filter.$or = [
        { "location.city": cityRegex },
        { "address.city": cityRegex },
        { "address.areaName": cityRegex },
        { "address.district": cityRegex },
        { "address.streetAddress": cityRegex },
        { "address.landmark": cityRegex },
        { "address.formattedAddress": cityRegex },
        { "address.state": cityRegex }
      ];
    }
    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: "i" };
      const searchMatch = [
        { name: searchRegex },
        { "location.city": searchRegex },
        { "address.city": searchRegex },
        { "address.areaName": searchRegex },
        { description: searchRegex }
      ];
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchMatch }];
        delete filter.$or;
      } else {
        filter.$or = searchMatch;
      }
    }
    if (featured !== void 0) {
      filter.isFeatured = featured === "true" || featured === true;
    }
    if (rank) {
      filter.rank = rank;
    }
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Number(limit) || 50);
    const skip = (pageNum - 1) * limitNum;
    const total = await tour_model_default.countDocuments(filter);
    const companies = await tour_model_default.find(filter).populate({
      path: "vendorId",
      select: "businessName businessEmail logo currentStep status"
    }).sort({ isFeatured: -1, createdAt: -1 }).skip(skip).limit(limitNum).lean();
    const companyIds = companies.map((c) => c._id);
    let minPrices = [];
    if (companyIds.length > 0) {
      minPrices = await TourService2.aggregate([
        { $match: { tour: { $in: companyIds }, isActive: true } },
        {
          $group: {
            _id: "$tour",
            minPrice: {
              $min: {
                $cond: [
                  { $gt: ["$discountPrice", 0] },
                  "$discountPrice",
                  "$basePrice"
                ]
              }
            },
            tourCount: { $sum: 1 }
          }
        }
      ]);
    }
    const priceMap = {};
    const countMap = {};
    minPrices.forEach((p) => {
      priceMap[p._id.toString()] = p.minPrice;
      countMap[p._id.toString()] = p.tourCount;
    });
    const formattedCompanies = companies.map((company) => {
      const companyIdStr = company._id.toString();
      const resolvedLogo = company.logo?.url || company.vendorId?.logo?.url || company.images?.[0]?.url || `https://api.dicebear.com/10.x/initials/svg?seed=${encodeURIComponent(company.name)}`;
      return {
        ...company,
        logo: resolvedLogo,
        startingPrice: priceMap[companyIdStr] || 999,
        totalTours: countMap[companyIdStr] || 0,
        city: company.location?.city || "India"
      };
    });
    return {
      companies: formattedCompanies,
      total,
      page: pageNum,
      limit: limitNum
    };
  } catch (error) {
    logger_default.error("Service Error: getAllTourCompanies", error);
    throw error;
  }
};
var getTourCompanyById = async (id) => {
  try {
    const TourService2 = (await Promise.resolve().then(() => (init_tourService_model(), tourService_model_exports))).default;
    const company = await tour_model_default.findOne({
      _id: id,
      isActive: true,
      verificationStatus: "verified"
    }).populate({
      path: "vendorId",
      select: "businessName businessEmail logo currentStep status"
    }).lean();
    if (!company) {
      throw new Error("Tour company not found");
    }
    const tours = await TourService2.find({ tour: id, isActive: true }).lean();
    const resolvedLogo = company.logo?.url || company.vendorId?.logo?.url || company.images?.[0]?.url || `https://api.dicebear.com/10.x/initials/svg?seed=${encodeURIComponent(company.name)}`;
    return {
      ...company,
      logo: resolvedLogo,
      tours
    };
  } catch (error) {
    logger_default.error("Service Error: getTourCompanyById", error);
    throw error;
  }
};
var getTourCompaniesGroupedByCity = async () => {
  try {
    const { companies } = await getAllTourCompanies({ limit: 100 });
    const grouped = {};
    companies.forEach((company) => {
      const city = company.city?.trim() || "Others";
      if (!grouped[city]) {
        grouped[city] = [];
      }
      grouped[city].push(company);
    });
    return grouped;
  } catch (error) {
    logger_default.error("Service Error: getTourCompaniesGroupedByCity", error);
    throw error;
  }
};
var getRankedTourCompanies = async (rank, page = 1, limit = 10) => {
  try {
    const TourService2 = (await Promise.resolve().then(() => (init_tourService_model(), tourService_model_exports))).default;
    if (!rank || !["A", "B", "C"].includes(rank)) {
      return { items: [], total: 0, page: 1, limit: 10, hasMore: false };
    }
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Number(limit) || 10);
    const skip = (pageNum - 1) * limitNum;
    const companiesWithActiveTours = await TourService2.distinct("tour", {
      isActive: true
    });
    if (!companiesWithActiveTours || companiesWithActiveTours.length === 0) {
      return { items: [], total: 0, page: pageNum, limit: limitNum, hasMore: false };
    }
    const filter = {
      _id: { $in: companiesWithActiveTours },
      rank,
      isActive: true,
      verificationStatus: "verified"
    };
    const total = await tour_model_default.countDocuments(filter);
    if (total === 0) {
      return { items: [], total: 0, page: pageNum, limit: limitNum, hasMore: false };
    }
    const companies = await tour_model_default.find(filter).populate({
      path: "vendorId",
      select: "businessName logo"
    }).sort({ isFeatured: -1, createdAt: -1 }).skip(skip).limit(limitNum).lean();
    const items = companies.map((company) => {
      const bannerImg = company.advertisementImage?.url || company.images?.[0]?.url || company.logo?.url || company.vendorId?.logo?.url || `https://api.dicebear.com/10.x/initials/svg?seed=${encodeURIComponent(company.name)}`;
      return {
        _id: company._id,
        name: company.name,
        city: company.location?.city || "India",
        image: bannerImg
      };
    });
    return {
      items,
      total,
      page: pageNum,
      limit: limitNum,
      hasMore: skip + limitNum < total
    };
  } catch (error) {
    logger_default.error("Service Error: getRankedTourCompanies", error);
    throw error;
  }
};
var TourCompanyService = class {
  async createTourCompany(data, vendor) {
    return createTourCompany(data, vendor);
  }
  async getAllTourCompanies(query = {}) {
    return getAllTourCompanies(query);
  }
  async getTourCompanyById(id) {
    return getTourCompanyById(id);
  }
  async getTourCompaniesGroupedByCity() {
    return getTourCompaniesGroupedByCity();
  }
  async getRankedTourCompanies(rank, page = 1, limit = 10) {
    return getRankedTourCompanies(rank, page, limit);
  }
};
var tourCompanyService = new TourCompanyService();
var tour_service_default = tourCompanyService;

// src/modules/tour/company/tour.controller.ts
var TourController = class {
  async createTourCompany(req, res, next) {
    try {
      const userId = req.user._id;
      const vendor = await vendor_model_default.findOne({ userId });
      if (!vendor) {
        throw new Error("Vendor profile not found");
      }
      const tour = await tour_service_default.createTourCompany(req.body, vendor);
      res.status(200).json({
        success: true,
        message: "Step 4 completed successfully",
        data: {
          currentStep: vendor.currentStep,
          registrationStep: vendor.registrationStep,
          status: vendor.status
        }
      });
    } catch (error) {
      logger_default.error("Controller Error: createTourCompany", error);
      next(error);
    }
  }
  async getTourCompanies(req, res, next) {
    try {
      const result = await tour_service_default.getAllTourCompanies(req.query);
      res.status(200).json({
        success: true,
        count: result.companies.length,
        total: result.total,
        data: result.companies,
        page: result.page,
        limit: result.limit
      });
    } catch (error) {
      logger_default.error("Controller Error: getTourCompanies", error);
      next(error);
    }
  }
  async getTourCompanyById(req, res, next) {
    try {
      const data = await tour_service_default.getTourCompanyById(req.params.id);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      logger_default.error("Controller Error: getTourCompanyById", error);
      next(error);
    }
  }
  async getTourCompaniesGroupedByCity(req, res, next) {
    try {
      const data = await tour_service_default.getTourCompaniesGroupedByCity();
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      logger_default.error("Controller Error: getTourCompaniesGroupedByCity", error);
      next(error);
    }
  }
  // Get ranked tour companies for banner slideshows
  async getRankedTourCompanies(req, res, next) {
    try {
      const { rank, page, limit } = req.query;
      const result = await tour_service_default.getRankedTourCompanies(rank, page, limit);
      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      logger_default.error("Controller Error: getRankedTourCompanies", error);
      next(error);
    }
  }
};

// src/modules/tour/company/tour.routes.ts
var router22 = (0, import_express22.Router)();
var tourController = new TourController();
router22.get("/", tourController.getTourCompanies);
router22.get("/companies", tourController.getTourCompanies);
router22.get("/grouped-by-city", tourController.getTourCompaniesGroupedByCity);
router22.get("/companies/:id", tourController.getTourCompanyById);
router22.get("/ranked", tourController.getRankedTourCompanies);
router22.get("/:id", tourController.getTourCompanyById);
router22.post(
  "/vendor/tours",
  protect,
  authorize("vendor"),
  tourController.createTourCompany
);
var tour_routes_default = router22;

// src/modules/tour/service/tourService.routes.ts
var import_express23 = require("express");

// src/modules/tour/service/tourService.service.ts
var import_mongoose39 = __toESM(require("mongoose"), 1);
init_tourService_model();
var attachFavoriteFlag5 = async (items, userId, itemType) => {
  if (!userId || items.length === 0) {
    items.forEach((item) => item.isFavorite = false);
    return items;
  }
  const itemIds = items.map((i) => i.company?.companyId || i.companyId || i.serviceId || i._id);
  const favorites = await favorite_model_default.find({
    user: userId,
    itemType,
    itemId: { $in: itemIds }
  }).select("itemId");
  const favoriteSet = new Set(favorites.map((f) => f.itemId.toString()));
  items.forEach((item) => {
    const id = item.company?.companyId || item.companyId || item.serviceId || item._id;
    item.isFavorite = favoriteSet.has(id.toString());
  });
  return items;
};
var checkIsFavorite5 = async (itemId, userId, itemType) => {
  if (!userId || !itemId) return false;
  const fav = await favorite_model_default.findOne({
    user: userId,
    itemType,
    itemId
  }).select("_id");
  return !!fav;
};
var buildFlexibleRegex = (term) => {
  if (!term || typeof term !== "string") return null;
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = escaped.replace(/[_\s-]+/g, "[_\\s-]+");
  return new RegExp(pattern, "i");
};
var getTours = async (query, userId = null) => {
  try {
    const {
      search = "",
      city = "",
      minPrice,
      maxPrice,
      minRating,
      score,
      features,
      tourType,
      amenities,
      adults,
      children,
      page = 1,
      limit = 10
    } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const matchStage = {
      isActive: true
    };
    const totalGuests = (Number(adults) || 0) + (Number(children) || 0);
    if (totalGuests > 0) {
      matchStage.maxPeople = { $gte: totalGuests };
    }
    if (search && search.trim()) {
      matchStage.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { destinations: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } }
      ];
    }
    const pMin = minPrice !== void 0 && Number(minPrice) > 0 ? Number(minPrice) : null;
    const pMax = maxPrice !== void 0 && Number(maxPrice) > 0 ? Number(maxPrice) : null;
    if (pMin !== null || pMax !== null) {
      const priceCond = {};
      if (pMin !== null) priceCond.$gte = pMin;
      if (pMax !== null) priceCond.$lte = pMax;
      const priceOr = [
        { discountPrice: { $gt: 0, ...priceCond } },
        {
          $and: [
            { $or: [{ discountPrice: 0 }, { discountPrice: null }, { discountPrice: { $exists: false } }] },
            { basePrice: priceCond }
          ]
        }
      ];
      if (matchStage.$or) {
        matchStage.$and = [{ $or: matchStage.$or }, { $or: priceOr }];
        delete matchStage.$or;
      } else {
        matchStage.$or = priceOr;
      }
    }
    const featureTerms = [];
    if (features) {
      const arr = Array.isArray(features) ? features : [features];
      featureTerms.push(...arr);
    }
    if (tourType) {
      const arr = Array.isArray(tourType) ? tourType : [tourType];
      featureTerms.push(...arr);
    }
    if (featureTerms.length > 0) {
      const regexes = featureTerms.map(buildFlexibleRegex).filter(Boolean);
      const featureConditions = [
        { features: { $in: regexes } },
        { tourType: { $in: regexes } }
      ];
      if (matchStage.$and) {
        matchStage.$and.push({ $or: featureConditions });
      } else if (matchStage.$or) {
        matchStage.$and = [{ $or: matchStage.$or }, { $or: featureConditions }];
        delete matchStage.$or;
      } else {
        matchStage.$or = featureConditions;
      }
    }
    if (amenities) {
      const amenityTerms = Array.isArray(amenities) ? amenities : [amenities];
      if (amenityTerms.length > 0) {
        const regexes = amenityTerms.map(buildFlexibleRegex).filter(Boolean);
        matchStage.amenities = { $in: regexes };
      }
    }
    const companyMatch = {
      "company.isActive": true,
      "company.verificationStatus": "verified"
    };
    if (city && city.trim()) {
      const cityRegex = { $regex: city.trim(), $options: "i" };
      companyMatch.$or = [
        { "company.location.city": cityRegex },
        { "company.address.city": cityRegex },
        { "company.address.areaName": cityRegex },
        { "company.address.district": cityRegex },
        { destinations: cityRegex }
      ];
    }
    const effectiveMinRating = minRating !== void 0 ? Number(minRating) : score !== void 0 ? Number(score) : null;
    if (effectiveMinRating !== null && !isNaN(effectiveMinRating) && effectiveMinRating > 0) {
      companyMatch["company.rating.average"] = { $gte: effectiveMinRating };
    }
    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: "tourcompanies",
          localField: "tour",
          foreignField: "_id",
          as: "company"
        }
      },
      { $unwind: "$company" },
      { $match: companyMatch },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [
            {
              $project: {
                _id: 1,
                title: 1,
                destinations: 1,
                basePrice: 1,
                discountPrice: 1,
                images: 1,
                duration: 1,
                features: 1,
                tourType: 1,
                amenities: 1,
                "company._id": 1,
                "company.name": 1,
                "company.rating": 1,
                "company.location": 1
              }
            },
            { $sort: { basePrice: 1 } },
            { $skip: Number(skip) },
            { $limit: Number(limit) }
          ]
        }
      }
    ];
    const results = await tourService_model_default.aggregate(pipeline);
    const total = results[0]?.metadata[0]?.total || 0;
    const tours = results[0]?.data || [];
    const taxDoc = await tax_model_default.findOne({ isActive: true }).lean();
    const taxPercentage = taxDoc?.taxPercentage || 0;
    const formattedTours = tours.map((tour) => {
      const effectivePrice = tour.discountPrice > 0 ? tour.discountPrice : tour.basePrice;
      const totalTax = Number(
        (effectivePrice * taxPercentage / 100).toFixed(2)
      );
      const totalPriceWithTax = Number((effectivePrice + totalTax).toFixed(2));
      return {
        serviceId: tour._id,
        serviceType: "tour",
        title: tour.title,
        destinations: tour.destinations || [],
        duration: tour.duration ? `${tour.duration.days}D/${tour.duration.nights}N` : "1D/0N",
        price: effectivePrice,
        totalPrice: effectivePrice,
        totalTax,
        totalPriceWithTax,
        taxPercentage,
        thumbnail: tour.images?.[0] || null,
        thumbnails: tour.images || [],
        features: tour.features || [],
        tourType: tour.tourType || [],
        amenities: tour.amenities || [],
        company: {
          companyId: tour.company._id,
          serviceType: "tour",
          name: tour.company.name,
          city: tour.company.location?.city,
          rating: tour.company.rating?.average || 0
        }
      };
    });
    const updatedTours = await attachFavoriteFlag5(formattedTours, userId, "tour");
    return {
      tours: updatedTours,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        count: updatedTours.length,
        total
      }
    };
  } catch (error) {
    throw error;
  }
};
var getCompanyDetails = async (id, userId = null) => {
  try {
    if (!import_mongoose39.default.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid company id");
    }
    const company = await tour_model_default.findOne({
      _id: id,
      isActive: true,
      verificationStatus: "verified"
    }).select("name location description images rating features").lean();
    if (!company) {
      throw new Error("Tour company not found");
    }
    const services = await tourService_model_default.find({
      tour: id,
      isActive: true
    }).select("title basePrice discountPrice duration images features").sort({ basePrice: 1 }).lean();
    const taxDoc = await tax_model_default.findOne({ isActive: true }).lean();
    const taxPercentage = taxDoc?.taxPercentage || 0;
    const formattedServices = services.map((service) => {
      const effectivePrice = service.discountPrice && service.discountPrice > 0 ? service.discountPrice : service.basePrice || 0;
      const totalTax = Number(
        (effectivePrice * taxPercentage / 100).toFixed(2)
      );
      const totalPriceWithTax = Number((effectivePrice + totalTax).toFixed(2));
      return {
        serviceId: service._id,
        serviceType: "tour",
        title: service.title,
        duration: `${service.duration.days}D/${service.duration.nights}N`,
        price: effectivePrice,
        totalPrice: effectivePrice,
        totalTax,
        totalPriceWithTax,
        taxPercentage,
        thumbnail: service.images?.[0] || null,
        thumbnails: service.images || [],
        features: service.features || []
      };
    });
    const isFavorite = await checkIsFavorite5(company._id, userId, "tour");
    const formattedCompany = {
      companyId: company._id,
      serviceType: "tour",
      isFavorite,
      name: company.name,
      description: company.description,
      city: company.location?.city,
      state: company.location?.state,
      rating: company.rating?.average || 0,
      reviews: company.rating?.count || 0,
      images: company.images || [],
      features: company.features || []
    };
    return {
      company: formattedCompany,
      services: formattedServices,
      isFavorite
    };
  } catch (error) {
    throw error;
  }
};
var getTourServiceDetails = async (id, userId = null) => {
  try {
    if (!import_mongoose39.default.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid service id");
    }
    const service = await tourService_model_default.findOne({
      _id: id,
      isActive: true
    }).lean();
    if (!service) {
      throw new Error("Tour service not found");
    }
    const company = await tour_model_default.findOne({
      _id: service.tour,
      isActive: true,
      verificationStatus: "verified"
    }).select("name location rating images description").lean();
    if (!company) {
      throw new Error("Tour company not found");
    }
    const taxDoc = await tax_model_default.findOne({ isActive: true }).lean();
    const taxPercentage = taxDoc?.taxPercentage || 0;
    const effectivePrice = service.discountPrice && service.discountPrice > 0 ? service.discountPrice : service.basePrice || 0;
    const totalTax = Number(
      (effectivePrice * taxPercentage / 100).toFixed(2)
    );
    const totalPriceWithTax = Number((effectivePrice + totalTax).toFixed(2));
    const isFavorite = await checkIsFavorite5(company?._id, userId, "tour");
    const formattedService = {
      serviceId: service._id,
      serviceType: "tour",
      isFavorite,
      title: service.title,
      description: service.description,
      destinations: service.destinations,
      duration: `${service.duration.days}D/${service.duration.nights}N`,
      price: effectivePrice,
      totalPrice: effectivePrice,
      totalTax,
      totalPriceWithTax,
      taxPercentage,
      images: service.images || [],
      features: service.features || [],
      tourType: service.tourType || [],
      amenities: service.amenities || [],
      maxPeople: service.maxPeople,
      meta: service.meta || {},
      itinerary: service.itinerary || []
    };
    const formattedCompany = {
      companyId: company?._id,
      serviceType: "tour",
      isFavorite,
      name: company?.name,
      city: company?.location?.city,
      rating: company?.rating?.average || 0,
      images: company?.images || [],
      description: company?.description
    };
    return {
      company: formattedCompany,
      service: formattedService,
      isFavorite
    };
  } catch (error) {
    throw error;
  }
};
var createTourService = async (data, vendorId) => {
  try {
    const {
      tourId,
      title,
      destinations = [],
      duration,
      basePrice,
      discountPrice = 0,
      description,
      features = [],
      tourType = [],
      amenities = [],
      images = [],
      itinerary = [],
      meta = {},
      maxPeople = 10
    } = data;
    let targetTourId = tourId;
    if (!targetTourId || !import_mongoose39.default.Types.ObjectId.isValid(targetTourId)) {
      const company = await tour_model_default.findOne({
        vendorId,
        isActive: true
      });
      if (company) {
        targetTourId = company._id;
      }
    }
    if (!targetTourId || !import_mongoose39.default.Types.ObjectId.isValid(targetTourId)) {
      throw new Error("Valid tourId is required");
    }
    if (!title) throw new Error("Title is required");
    if (!duration?.days || !duration?.nights) {
      throw new Error("Duration (days & nights) is required");
    }
    if (!basePrice || basePrice < 0) {
      throw new Error("Valid base price is required");
    }
    if (discountPrice > basePrice) {
      throw new Error("Discount cannot exceed base price");
    }
    const tourCompany = await tour_model_default.findOne({
      _id: targetTourId,
      vendorId,
      isActive: true
    });
    if (!tourCompany) {
      throw new Error("Tour company not found or unauthorized");
    }
    if (!Array.isArray(itinerary) || itinerary.length === 0) {
      throw new Error("Itinerary is required");
    }
    if (itinerary.length !== duration.days) {
      throw new Error("Itinerary days must match duration days");
    }
    itinerary.forEach((day, index) => {
      if (!day.day || day.day !== index + 1) {
        throw new Error("Invalid itinerary day sequence");
      }
    });
    const service = await tourService_model_default.create({
      tour: tourId,
      title: title.trim(),
      destinations,
      duration,
      basePrice,
      discountPrice,
      description: description?.trim() || "",
      features,
      tourType,
      amenities,
      images,
      itinerary,
      meta,
      maxPeople,
      isActive: true
    });
    return service;
  } catch (error) {
    throw error;
  }
};
var getVendorTourServices = async (query = {}, vendorId) => {
  try {
    const { tourId, search, page = 1, limit = 10 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const companies = await tour_model_default.find({
      vendorId
    }).select("_id").lean();
    const tourIds = companies.map((c) => c._id);
    const filter = {
      tour: { $in: tourIds }
    };
    if (tourId) {
      filter.tour = tourId;
    }
    if (search) {
      filter.$or = [
        {
          title: { $regex: search, $options: "i" }
        },
        {
          description: { $regex: search, $options: "i" }
        }
      ];
    }
    const services = await tourService_model_default.find(filter).populate("tour", "name").sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean();
    const total = await tourService_model_default.countDocuments(filter);
    const formatted = services.map((s) => ({
      id: s._id,
      title: s.title,
      company: s.tour?.name || null,
      destinations: s.destinations,
      images: s.images,
      duration: `${s.duration.days}D / ${s.duration.nights}N`,
      pricing: {
        basePrice: s.basePrice,
        discountPrice: s.discountPrice
      },
      isActive: s.isActive
    }));
    return {
      count: formatted.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: formatted
    };
  } catch (error) {
    throw error;
  }
};
var getVendorTourServiceById = async (serviceId, vendorId) => {
  try {
    if (!import_mongoose39.default.Types.ObjectId.isValid(serviceId)) {
      throw new Error("Invalid service id");
    }
    const service = await tourService_model_default.findById(serviceId).populate("tour", "name vendorId").lean();
    if (!service) {
      throw new Error("Tour service not found");
    }
    if (service.tour?.vendorId?.toString() !== vendorId.toString()) {
      throw new Error("Unauthorized access");
    }
    const formatted = {
      id: service._id,
      company: {
        id: service.tour?._id,
        name: service.tour?.name
      },
      title: service.title,
      destinations: service.destinations || [],
      duration: service.duration,
      pricing: {
        basePrice: service.basePrice,
        discountPrice: service.discountPrice
      },
      description: service.description || "",
      features: service.features || [],
      tourType: service.tourType || [],
      amenities: service.amenities || [],
      images: service.images || [],
      itinerary: service.itinerary || [],
      meta: service.meta || {},
      maxPeople: service.maxPeople,
      isActive: service.isActive,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt
    };
    return formatted;
  } catch (error) {
    throw error;
  }
};
var updateVendorTourService = async (serviceId, vendorId, data) => {
  try {
    if (!import_mongoose39.default.Types.ObjectId.isValid(serviceId)) {
      throw new Error("Invalid service id");
    }
    const service = await tourService_model_default.findById(serviceId).populate(
      "tour",
      "vendorId"
    );
    if (!service) {
      throw new Error("Tour service not found");
    }
    if (service.tour?.vendorId?.toString() !== vendorId.toString()) {
      throw new Error("Unauthorized access");
    }
    if (data.basePrice !== void 0 && data.basePrice < 0) {
      throw new Error("Invalid base price");
    }
    if (data.discountPrice !== void 0 && data.basePrice !== void 0 && data.discountPrice > data.basePrice) {
      throw new Error("Discount cannot exceed base price");
    }
    if (data.itinerary || data.duration) {
      const finalDays = data.duration?.days || service.duration?.days;
      const itinerary = data.itinerary || service.itinerary;
      if (itinerary.length !== finalDays) {
        throw new Error("Itinerary days must match duration days");
      }
      itinerary.forEach((day, index) => {
        if (!day.day || day.day !== index + 1) {
          throw new Error("Invalid itinerary sequence");
        }
      });
      service.itinerary = itinerary;
      service.duration = data.duration || service.duration;
    }
    const allowedFields = [
      "title",
      "destinations",
      "basePrice",
      "discountPrice",
      "description",
      "features",
      "tourType",
      "amenities",
      "images",
      "meta",
      "maxPeople",
      "isActive"
    ];
    allowedFields.forEach((field) => {
      if (data[field] !== void 0) {
        service[field] = typeof data[field] === "string" ? data[field].trim() : data[field];
      }
    });
    await service.save();
    return service;
  } catch (error) {
    throw error;
  }
};
var deleteVendorTourService = async (serviceId, vendorId) => {
  try {
    if (!import_mongoose39.default.Types.ObjectId.isValid(serviceId)) {
      throw new Error("Invalid service id");
    }
    const service = await tourService_model_default.findById(serviceId).populate(
      "tour",
      "vendorId"
    );
    if (!service) {
      throw new Error("Tour service not found");
    }
    if (service.tour?.vendorId?.toString() !== vendorId.toString()) {
      throw new Error("Unauthorized access");
    }
    service.isActive = false;
    await service.save();
    return;
  } catch (error) {
    throw error;
  }
};
var TourServiceService = class {
  async getTours(query, userId = null) {
    return getTours(query, userId);
  }
  async getCompanyDetails(id, userId = null) {
    return getCompanyDetails(id, userId);
  }
  async getTourServiceDetails(id, userId = null) {
    return getTourServiceDetails(id, userId);
  }
  async createTourService(data, vendorId) {
    return createTourService(data, vendorId);
  }
  async getVendorTourServices(query = {}, vendorId) {
    return getVendorTourServices(query, vendorId);
  }
  async getVendorTourServiceById(serviceId, vendorId) {
    return getVendorTourServiceById(serviceId, vendorId);
  }
  async updateVendorTourService(serviceId, vendorId, data) {
    return updateVendorTourService(serviceId, vendorId, data);
  }
  async deleteVendorTourService(serviceId, vendorId) {
    return deleteVendorTourService(serviceId, vendorId);
  }
};
var tourServiceService = new TourServiceService();
var tourService_service_default = tourServiceService;

// src/modules/tour/service/tourService.controller.ts
var TourServiceController = class {
  //user side
  async getTours(req, res, next) {
    try {
      const userId = req.user._id || null;
      const data = await tourService_service_default.getTours(req.query, userId);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      logger_default.error("Controller Error: getTours", error);
      next(error);
    }
  }
  async getCompanyDetails(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user._id || null;
      const data = await tourService_service_default.getCompanyDetails(id, userId);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      logger_default.error("Controller Error: getCompanyDetails", error);
      next(error);
    }
  }
  async getTourServiceDetails(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user._id || null;
      const data = await tourService_service_default.getTourServiceDetails(id, userId);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      logger_default.error("Controller Error: getTourServiceDetails", error);
      next(error);
    }
  }
  //vendor side
  async createTourService(req, res, next) {
    try {
      const userId = req.user._id;
      const vendor = await vendor_model_default.findOne({
        userId
      });
      if (!vendor) {
        throw new Error("Vendor profile not found");
      }
      const service = await tourService_service_default.createTourService(req.body, vendor._id);
      res.status(201).json({
        success: true,
        message: "Tour service created successfully",
        data: service
      });
    } catch (error) {
      logger_default.error("Controller Error: createTourService", error);
      next(error);
    }
  }
  async getVendorTourServices(req, res, next) {
    try {
      const userId = req.user._id;
      const vendor = await vendor_model_default.findOne({
        userId
      });
      if (!vendor) {
        throw new Error("Vendor profile not found");
      }
      const result = await tourService_service_default.getVendorTourServices(
        req.query,
        vendor._id
      );
      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      logger_default.error("Controller Error: getVendorTourServices", error);
      next(error);
    }
  }
  async getVendorTourServiceById(req, res, next) {
    try {
      const userId = req.user._id;
      const serviceId = req.params.id;
      const vendor = await vendor_model_default.findOne({
        userId
      });
      if (!vendor) {
        throw new Error("Vendor profile not found");
      }
      const service = await tourService_service_default.getVendorTourServiceById(
        serviceId,
        vendor._id
      );
      res.status(200).json({
        success: true,
        data: service
      });
    } catch (error) {
      logger_default.error("Controller Error: getVendorTourServiceById", error);
      next(error);
    }
  }
  async updateVendorTourService(req, res, next) {
    try {
      const userId = req.user._id;
      const serviceId = req.params.id;
      const vendor = await vendor_model_default.findOne({
        userId
      });
      if (!vendor) {
        throw new Error("Vendor profile not found");
      }
      const updated = await tourService_service_default.updateVendorTourService(
        serviceId,
        vendor._id,
        req.body
      );
      res.status(200).json({
        success: true,
        message: "Tour service updated successfully",
        data: updated
      });
    } catch (error) {
      logger_default.error("Controller Error: updateTourService", error);
      next(error);
    }
  }
  async deleteVendorTourService(req, res, next) {
    try {
      const userId = req.user._id;
      const serviceId = req.params.id;
      const vendor = await vendor_model_default.findOne({
        userId
      });
      if (!vendor) {
        throw new Error("Vendor profile not found");
      }
      await tourService_service_default.deleteVendorTourService(serviceId, vendor._id);
      res.status(200).json({
        success: true,
        message: "Tour service deleted successfully"
      });
    } catch (error) {
      logger_default.error("Controller Error: deleteTourService", error);
      next(error);
    }
  }
};

// src/modules/tour/service/tourService.routes.ts
var router23 = (0, import_express23.Router)();
var tourServiceController = new TourServiceController();
router23.get("/", optionalProtect, tourServiceController.getTours);
router23.get(
  "/:id",
  optionalProtect,
  tourServiceController.getTourServiceDetails
);
router23.get(
  "/company/:id",
  optionalProtect,
  tourServiceController.getCompanyDetails
);
router23.post(
  "/vendor/tour-services",
  protect,
  authorize("vendor"),
  tourServiceController.createTourService
);
router23.get(
  "/vendor/tour-services",
  protect,
  authorize("vendor"),
  tourServiceController.getVendorTourServices
);
router23.get(
  "/vendor/tour-services/:id",
  protect,
  authorize("vendor"),
  tourServiceController.getVendorTourServiceById
);
router23.put(
  "/vendor/tour-services/:id",
  protect,
  authorize("vendor"),
  tourServiceController.updateVendorTourService
);
router23.delete(
  "/vendor/tour-services/:id",
  protect,
  authorize("vendor"),
  tourServiceController.deleteVendorTourService
);
var tourService_routes_default = router23;

// src/modules/multiServiceBookings/booking.routes.ts
var import_express24 = require("express");

// src/modules/multiServiceBookings/booking.service.ts
var import_mongoose41 = __toESM(require("mongoose"), 1);
var import_crypto5 = __toESM(require("crypto"), 1);

// src/modules/multiServiceBookings/payment.model.ts
var import_mongoose40 = __toESM(require("mongoose"), 1);
var paymentSchema2 = new import_mongoose40.Schema(
  {
    bookingId: {
      type: import_mongoose40.Schema.Types.ObjectId,
      ref: "Booking",
      required: true
    },
    userId: {
      type: import_mongoose40.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    gateway: {
      type: String,
      enum: ["razorpay"],
      default: "razorpay"
    },
    gatewayOrderId: {
      type: String,
      required: true,
      unique: true
    },
    gatewayPaymentId: {
      type: String,
      index: true
    },
    gatewaySignature: {
      type: String
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: "INR"
    },
    status: {
      type: String,
      enum: ["created", "authorized", "captured", "failed", "refunded"],
      default: "created"
    },
    paymentMethod: {
      type: String,
      enum: ["card", "upi", "netbanking", "wallet", "unknown"],
      default: "unknown"
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    refundAmount: {
      type: Number,
      default: 0
    },
    refundStatus: {
      type: String,
      enum: ["none", "pending", "processed", "failed"],
      default: "none"
    },
    refundedAt: Date,
    metadata: {
      serviceType: String,
      bookingReference: String,
      extra: {
        type: Object,
        default: {}
      }
    },
    expiresAt: {
      type: Date,
      index: { expires: "0s" }
    }
  },
  { timestamps: true }
);
paymentSchema2.index({ bookingId: 1, status: 1 });
paymentSchema2.index({ userId: 1, createdAt: -1 });
var GenericPayment = import_mongoose40.default.model("GenericPayment", paymentSchema2);
var payment_model_default2 = GenericPayment;

// src/modules/multiServiceBookings/booking.service.ts
init_service_model();
init_cabService_model();
init_bikeService_model();
init_tourService_model();
var createBooking2 = async (data, userId) => {
  const session = await import_mongoose41.default.startSession();
  session.startTransaction();
  try {
    const {
      serviceType,
      serviceId,
      bookingDate,
      timeSlot,
      primaryCustomer,
      participants = [],
      meta = {}
    } = data;
    if (!serviceType || !serviceId || !bookingDate) {
      throw new Error("serviceType, serviceId and bookingDate are required");
    }
    let service;
    let vendorId;
    if (serviceType === "adventure") {
      service = await service_model_default.findById(serviceId).populate("adventure", "vendorId").lean();
      vendorId = service?.adventure?.vendorId;
    } else if (serviceType === "cab") {
      service = await cabService_model_default.findById(serviceId).populate("cab", "vendorId").lean();
      vendorId = service?.cab?.vendorId;
    } else if (serviceType === "bike") {
      service = await bikeService_model_default.findById(serviceId).populate("bike", "vendorId").lean();
      vendorId = service?.bike?.vendorId;
    } else if (serviceType === "tour") {
      service = await tourService_model_default.findById(serviceId).populate("tour", "vendorId").lean();
      vendorId = service?.tour?.vendorId;
    } else {
      throw new Error("Invalid service type");
    }
    if (!service || !service.isActive) {
      throw new Error("Service not available");
    }
    if (!vendorId) {
      throw new Error("Vendor not found");
    }
    const taxDoc = await tax_model_default.findOne({ isActive: true }).lean();
    const taxPercentage = taxDoc?.taxPercentage || 0;
    let effectivePrice = 0;
    if (serviceType === "bike") {
      effectivePrice = service.discountPrice > 0 ? service.discountPrice : service.pricePerDay;
    } else {
      effectivePrice = service.discountPrice > 0 ? service.discountPrice : service.basePrice;
    }
    let quantity = 1;
    let baseAmount = 0;
    let duration = {};
    let extraInfo = {};
    if (serviceType === "adventure") {
      quantity = participants.length || 1;
      baseAmount = effectivePrice * quantity;
      extraInfo = {
        label: "Type",
        value: service.type
      };
    }
    if (serviceType === "cab") {
      if (!meta.pickup || !meta.drop) {
        throw new Error("Pickup and Drop are required");
      }
      quantity = 1;
      baseAmount = effectivePrice;
      extraInfo = {
        label: "Route",
        value: `${meta.pickup} \u2192 ${meta.drop}`
      };
    }
    if (serviceType === "bike") {
      if (!meta.startDate || !meta.endDate) {
        throw new Error("Start and End date required");
      }
      const start = new Date(meta.startDate);
      const end = new Date(meta.endDate);
      if (start >= end) {
        throw new Error("Invalid date range");
      }
      const days = Math.ceil((end - start) / (1e3 * 60 * 60 * 24));
      quantity = days;
      duration = {
        startDate: meta.startDate,
        endDate: meta.endDate,
        totalDays: days
      };
      baseAmount = effectivePrice * days;
      extraInfo = {
        label: "Duration",
        value: `${days} Days`
      };
    }
    if (serviceType === "tour") {
      if (!meta.startDate) {
        throw new Error("Tour start date required");
      }
      quantity = participants.length || 1;
      if (service.maxPeople && quantity > service.maxPeople) {
        throw new Error(
          `Maximum ${service.maxPeople} participants allowed for this tour package (requested: ${quantity})`
        );
      }
      duration = {
        startDate: meta.startDate,
        totalDays: service.duration.days
      };
      baseAmount = effectivePrice * quantity;
      extraInfo = {
        label: "Package",
        value: `${service.duration.days}D / ${service.duration.nights}N`
      };
    }
    const taxAmount = Number((baseAmount * taxPercentage / 100).toFixed(2));
    const totalAmount = Number((baseAmount + taxAmount).toFixed(2));
    const bookingReference = "BK-" + import_crypto5.default.randomBytes(6).toString("hex").toUpperCase();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1e3);
    const [booking] = await booking_model_default2.create(
      [
        {
          userId,
          vendorId,
          serviceType,
          serviceId,
          bookingReference,
          bookingDate,
          timeSlot,
          duration,
          primaryCustomer,
          participants,
          meta,
          extraInfo,
          quantity,
          pricing: {
            baseAmount,
            taxAmount,
            taxPercentage,
            totalAmount
          },
          serviceSnapshot: {
            title: service.title,
            type: serviceType,
            price: effectivePrice,
            vendorId,
            extra: extraInfo
          },
          status: "pending",
          paymentStatus: "pending",
          expiresAt
        }
      ],
      { session }
    );
    let razorpayOrder;
    try {
      razorpayOrder = await razorpay_default.orders.create({
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        receipt: bookingReference
      });
    } catch (rzpErr) {
      const msg = rzpErr.error?.description || rzpErr.message || "Razorpay order creation failed";
      throw new Error(`Payment Gateway Error: ${msg}`);
    }
    const [payment] = await payment_model_default2.create(
      [
        {
          bookingId: booking._id,
          userId,
          gatewayOrderId: razorpayOrder.id,
          amount: totalAmount,
          status: "created",
          metadata: {
            serviceType,
            bookingReference
          },
          expiresAt
        }
      ],
      { session }
    );
    booking.paymentId = payment._id;
    await booking.save({ session });
    await session.commitTransaction();
    session.endSession();
    return {
      booking,
      razorpayOrder
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
var verifyPayment2 = async (data) => {
  const session = await import_mongoose41.default.startSession();
  session.startTransaction();
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new Error("Missing payment verification data");
    }
    const payment = await payment_model_default2.findOne({
      gatewayOrderId: razorpay_order_id
    }).session(session);
    if (!payment) {
      throw new Error("Payment record not found");
    }
    if (payment.status === "captured") {
      const existingBooking = await booking_model_default2.findById(payment.bookingId).lean().session(session);
      await session.commitTransaction();
      session.endSession();
      return {
        booking: existingBooking,
        alreadyVerified: true
      };
    }
    if (!["created", "authorized"].includes(payment.status)) {
      throw new Error("Invalid payment state");
    }
    if (payment.expiresAt && payment.expiresAt < /* @__PURE__ */ new Date()) {
      throw new Error("Payment session expired");
    }
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = import_crypto5.default.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "").update(body).digest("hex");
    if (expectedSignature !== razorpay_signature) {
      throw new Error("Invalid payment signature");
    }
    const razorpayPayment = await razorpay_default.payments.fetch(razorpay_payment_id);
    if (razorpayPayment.status !== "captured") {
      throw new Error("Payment not captured");
    }
    if (razorpayPayment.order_id !== razorpay_order_id) {
      throw new Error("Order mismatch");
    }
    if (razorpayPayment.amount / 100 !== payment.amount) {
      throw new Error("Amount mismatch from gateway");
    }
    payment.gatewayPaymentId = razorpay_payment_id;
    payment.gatewaySignature = razorpay_signature;
    payment.status = "captured";
    payment.isVerified = true;
    payment.paymentMethod = razorpayPayment.method || "unknown";
    payment.currency = razorpayPayment.currency || "INR";
    payment.expiresAt = void 0;
    await payment.save({ session });
    const booking = await booking_model_default2.findById(payment.bookingId).session(session);
    if (!booking) {
      throw new Error("Booking not found");
    }
    if (booking.expiresAt && booking.expiresAt < /* @__PURE__ */ new Date()) {
      throw new Error("Booking expired. Please create a new booking.");
    }
    if (booking.status !== "pending") {
      throw new Error("Invalid booking state");
    }
    if (Number(payment.amount.toFixed(2)) !== Number(booking.pricing.totalAmount.toFixed(2))) {
      throw new Error("Payment amount mismatch");
    }
    const updatedBooking = await booking_model_default2.findOneAndUpdate(
      {
        _id: booking._id,
        status: "pending",
        paymentStatus: "pending",
        expiresAt: { $gt: /* @__PURE__ */ new Date() }
      },
      {
        status: "confirmed",
        paymentStatus: "paid",
        $unset: { expiresAt: 1 }
      },
      { new: true, session }
    );
    if (!updatedBooking) {
      throw new Error("Booking expired or already processed");
    }
    await session.commitTransaction();
    session.endSession();
    try {
      const vendor = await vendor_model_default.findById(updatedBooking.vendorId);
      if (vendor) {
        const vendorUser = await auth_model_default.findById(vendor.userId);
        const recipientEmails = [vendor.businessEmail, vendorUser?.email].filter(Boolean);
        let bookingDateStr = updatedBooking.bookingDate ? new Date(updatedBooking.bookingDate).toLocaleDateString() : "N/A";
        let extraDetails = "";
        if (updatedBooking.serviceType === "cab") {
          extraDetails = `Route: ${updatedBooking.meta?.pickup || "N/A"} \u2192 ${updatedBooking.meta?.drop || "N/A"}`;
        } else if (updatedBooking.serviceType === "bike") {
          const startDate = updatedBooking.duration?.startDate ? new Date(updatedBooking.duration.startDate).toLocaleDateString() : "N/A";
          const endDate = updatedBooking.duration?.endDate ? new Date(updatedBooking.duration.endDate).toLocaleDateString() : "N/A";
          extraDetails = `Duration: ${startDate} to ${endDate} (${updatedBooking.duration?.totalDays || 0} Days)`;
        } else if (updatedBooking.serviceType === "tour") {
          const startDate = updatedBooking.duration?.startDate ? new Date(updatedBooking.duration.startDate).toLocaleDateString() : "N/A";
          extraDetails = `Start Date: ${startDate}, Duration: ${updatedBooking.duration?.totalDays || 0} Days`;
        } else if (updatedBooking.serviceType === "adventure") {
          extraDetails = `Slot: ${updatedBooking.timeSlot || "N/A"}, Participants: ${updatedBooking.participants?.length || 0}`;
        }
        await sendVendorBookingNotificationEmail(recipientEmails, {
          serviceType: updatedBooking.serviceType,
          serviceName: updatedBooking.serviceSnapshot?.title || updatedBooking.serviceType,
          bookingReference: updatedBooking.bookingReference,
          bookingDate: bookingDateStr,
          extraDetails,
          totalAmount: updatedBooking.pricing?.totalAmount,
          customerName: `${updatedBooking.primaryCustomer.firstName} ${updatedBooking.primaryCustomer.lastName || ""}`.trim(),
          customerEmail: updatedBooking.primaryCustomer.email,
          customerPhone: updatedBooking.primaryCustomer.phoneNumber
        });
      }
    } catch (vendorMailErr) {
      logger_default.error("Vendor Booking Notification Email failed:", vendorMailErr);
    }
    return {
      booking: updatedBooking,
      alreadyVerified: false
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    logger_default.error("Service Error: verifyPayment", {
      message: error?.message,
      orderId: data?.razorpay_order_id
    });
    throw error;
  }
};
var MultiServiceBookingService = class {
  async createBooking(data, userId) {
    return createBooking2(data, userId);
  }
  async verifyPayment(data) {
    return verifyPayment2(data);
  }
};
var multiServiceBookingService = new MultiServiceBookingService();
var booking_service_default2 = multiServiceBookingService;

// src/modules/multiServiceBookings/booking.controller.ts
var MultiServiceBookingController = class {
  async createBooking(req, res, next) {
    try {
      const userId = req.user._id;
      const result = await booking_service_default2.createBooking(req.body, userId);
      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger_default.error("Controller Error: createBooking", error);
      next(error);
    }
  }
  async verifyPayment(req, res, next) {
    try {
      const booking = await booking_service_default2.verifyPayment(req.body);
      res.status(200).json({
        success: true,
        data: booking
      });
    } catch (error) {
      logger_default.error("Controller Error: verifyPayment", error);
      next(error);
    }
  }
};

// src/modules/multiServiceBookings/booking.routes.ts
var router24 = (0, import_express24.Router)();
var bookingController3 = new MultiServiceBookingController();
router24.use(protect);
router24.post("/booking", authorize("user"), bookingController3.createBooking);
router24.post(
  "/verify-payment",
  authorize("user"),
  bookingController3.verifyPayment
);
var booking_routes_default2 = router24;

// src/modules/multiServiceVendor/vendor.routes.ts
var import_express28 = require("express");

// src/modules/multiServiceVendor/dashboard/dashboard.routes.ts
var import_express25 = require("express");

// src/modules/multiServiceVendor/dashboard/dashboard.service.ts
var getDashboardStats = async (query = {}, vendor) => {
  try {
    const baseFilter = {
      vendorId: vendor._id,
      serviceType: vendor.serviceType
    };
    const activeFilter = {
      ...baseFilter,
      status: { $ne: "cancelled" }
    };
    const totalBookingsPromise = booking_model_default2.countDocuments(activeFilter);
    const todayStart = /* @__PURE__ */ new Date();
    todayStart.setHours(0, 0, 0, 0);
    const newBookingsPromise = booking_model_default2.countDocuments({
      ...activeFilter,
      createdAt: { $gte: todayStart }
    });
    const cancelledBookingsPromise = booking_model_default2.countDocuments({
      ...baseFilter,
      status: "cancelled"
    });
    const revenuePromise = booking_model_default2.aggregate([
      {
        $match: {
          ...activeFilter,
          paymentStatus: "paid"
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$pricing.totalAmount" }
        }
      }
    ]);
    const [totalBookings, newBookings, cancelledBookings, revenueResult] = await Promise.all([
      totalBookingsPromise,
      newBookingsPromise,
      cancelledBookingsPromise,
      revenuePromise
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;
    return {
      totalRevenue,
      totalBookings,
      newBookings,
      cancelledBookings
    };
  } catch (error) {
    throw error;
  }
};
var getDashboardAnalytics = async (query = {}, vendor) => {
  try {
    const { revenueRange = "6m", bookingRange = "7d" } = query;
    const now = /* @__PURE__ */ new Date();
    const baseFilter = {
      vendorId: vendor._id,
      serviceType: vendor.serviceType
    };
    let months = 6;
    if (revenueRange === "3m") months = 3;
    if (revenueRange === "12m") months = 12;
    const revenueStartDate = /* @__PURE__ */ new Date();
    revenueStartDate.setMonth(now.getMonth() - months);
    const revenueData = await booking_model_default2.aggregate([
      {
        $match: {
          ...baseFilter,
          paymentStatus: "paid",
          status: { $ne: "cancelled" },
          createdAt: { $gte: revenueStartDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalRevenue: { $sum: "$pricing.totalAmount" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);
    const formattedRevenue = revenueData.map((item) => ({
      month: `${item._id.month}-${item._id.year}`,
      revenue: item.totalRevenue
    }));
    let days = 7;
    if (bookingRange === "15d") days = 15;
    if (bookingRange === "30d") days = 30;
    const bookingStartDate = /* @__PURE__ */ new Date();
    bookingStartDate.setDate(now.getDate() - days);
    const bookingData = await booking_model_default2.aggregate([
      {
        $match: {
          ...baseFilter,
          status: { $ne: "cancelled" },
          createdAt: { $gte: bookingStartDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          totalBookings: { $sum: 1 }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
          "_id.day": 1
        }
      }
    ]);
    const formattedBookings = bookingData.map((item) => ({
      date: `${item._id.day}-${item._id.month}`,
      bookings: item.totalBookings
    }));
    return {
      revenue: formattedRevenue,
      bookings: formattedBookings
    };
  } catch (error) {
    throw error;
  }
};
var getRecentBookings = async (query = {}, vendor) => {
  try {
    const { status, page = 1, limit = 10 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const filter = {
      vendorId: vendor._id,
      serviceType: vendor.serviceType
    };
    if (status) {
      filter.status = status;
    }
    const bookings = await booking_model_default2.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).select(
      "bookingReference serviceType bookingDate pricing.totalAmount status paymentStatus primaryCustomer serviceSnapshot duration extraInfo quantity"
    ).lean();
    const total = await booking_model_default2.countDocuments(filter);
    const formattedBookings = bookings.map((b) => {
      let serviceDetails = "";
      if (b.serviceType === "adventure") {
        serviceDetails = `${b.quantity} Person`;
      }
      if (b.serviceType === "cab") {
        serviceDetails = b.extraInfo?.value || "Route N/A";
      }
      if (b.serviceType === "bike") {
        serviceDetails = `${b.duration?.totalDays || 0} Days`;
      }
      if (b.serviceType === "tour") {
        serviceDetails = `${b.quantity} Person \u2022 ${b.duration?.totalDays || 0} Days`;
      }
      return {
        id: b._id,
        bookingReference: b.bookingReference,
        customerName: `${b.primaryCustomer?.firstName || ""} ${b.primaryCustomer?.lastName || ""}`.trim(),
        serviceTitle: b.serviceSnapshot?.title || "N/A",
        serviceType: b.serviceType,
        serviceDetails,
        bookingDate: b.bookingDate,
        amount: b.pricing?.totalAmount || 0,
        status: b.status,
        paymentStatus: b.paymentStatus
      };
    });
    return {
      count: formattedBookings.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: formattedBookings
    };
  } catch (error) {
    throw error;
  }
};
var MultiServiceVendorDashboardService = class {
  async getDashboardStats(query = {}, vendor) {
    return getDashboardStats(query, vendor);
  }
  async getDashboardAnalytics(query = {}, vendor) {
    return getDashboardAnalytics(query, vendor);
  }
  async getRecentBookings(query = {}, vendor) {
    return getRecentBookings(query, vendor);
  }
};
var multiServiceVendorDashboardService = new MultiServiceVendorDashboardService();
var dashboard_service_default = multiServiceVendorDashboardService;

// src/modules/multiServiceVendor/dashboard/dashboard.controller.ts
var MSVDashboardController = class {
  async getDashboardStats(req, res, next) {
    try {
      const vendor = await vendor_model_default.findOne({ userId: req.user._id });
      if (!vendor) {
        throw new Error("Vendor not found");
      }
      const stats = await dashboard_service_default.getDashboardStats(req.query, vendor);
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      logger_default.error("Controller Error: getDashboardStats", error);
      next(error);
    }
  }
  async getDashboardAnalytics(req, res, next) {
    try {
      const vendor = await vendor_model_default.findOne({ userId: req.user._id });
      if (!vendor) {
        throw new Error("Vendor not found");
      }
      const data = await dashboard_service_default.getDashboardAnalytics(
        req.query,
        vendor
      );
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      logger_default.error("Controller Error: getDashboardAnalytics", error);
      next(error);
    }
  }
  async getRecentBookings(req, res, next) {
    try {
      const vendor = await vendor_model_default.findOne({ userId: req.user._id });
      if (!vendor) {
        throw new Error("Vendor not found");
      }
      const result = await dashboard_service_default.getRecentBookings(req.query, vendor);
      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      logger_default.error("Controller Error: getRecentBookings", error);
      next(error);
    }
  }
};

// src/modules/multiServiceVendor/dashboard/dashboard.routes.ts
var router25 = (0, import_express25.Router)();
var dashboardController = new MSVDashboardController();
router25.use(protect);
router25.get(
  "/stats",
  protect,
  authorize("vendor"),
  dashboardController.getDashboardStats
);
router25.get(
  "/analytics",
  protect,
  authorize("vendor"),
  dashboardController.getDashboardAnalytics
);
router25.get(
  "/recent-bookings",
  protect,
  authorize("vendor"),
  dashboardController.getRecentBookings
);
var dashboard_routes_default = router25;

// src/modules/multiServiceVendor/booking/booking.routes.ts
var import_express26 = require("express");

// src/modules/multiServiceVendor/booking/booking.service.ts
var import_mongoose42 = __toESM(require("mongoose"), 1);
var getVendorBookings3 = async (query = {}, vendor) => {
  try {
    const { status, search, page = 1, limit = 10 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const filter = {
      vendorId: vendor._id,
      serviceType: vendor.serviceType
    };
    if (status) {
      filter.status = status;
    }
    if (search) {
      filter.$or = [
        { bookingReference: { $regex: search, $options: "i" } },
        { "primaryCustomer.firstName": { $regex: search, $options: "i" } },
        { "primaryCustomer.lastName": { $regex: search, $options: "i" } }
      ];
    }
    const bookings = await booking_model_default2.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).select(
      "bookingReference serviceType bookingDate extraInfo pricing.totalAmount status paymentStatus primaryCustomer serviceSnapshot duration quantity"
    ).lean();
    const total = await booking_model_default2.countDocuments(filter);
    const formattedBookings = bookings.map((b) => {
      let serviceDetails = "";
      if (b.serviceType === "adventure") {
        serviceDetails = `${b.quantity} Person`;
      }
      if (b.serviceType === "cab") {
        serviceDetails = b.extraInfo?.value || "Route N/A";
      }
      if (b.serviceType === "bike") {
        serviceDetails = `${b.duration?.totalDays || 0} Days`;
      }
      if (b.serviceType === "tour") {
        serviceDetails = `${b.quantity} Person \u2022 ${b.duration?.totalDays || 0} Days`;
      }
      return {
        id: b._id,
        bookingReference: b.bookingReference,
        customerName: `${b.primaryCustomer?.firstName || ""} ${b.primaryCustomer?.lastName || ""}`.trim(),
        serviceTitle: b.serviceSnapshot?.title || "N/A",
        serviceType: b.serviceType,
        serviceDetails,
        bookingDate: b.bookingDate,
        amount: b.pricing?.totalAmount || 0,
        status: b.status,
        paymentStatus: b.paymentStatus
      };
    });
    return {
      count: formattedBookings.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: formattedBookings
    };
  } catch (error) {
    throw error;
  }
};
var getVendorBookingById = async (bookingId, vendor) => {
  try {
    if (!import_mongoose42.default.Types.ObjectId.isValid(bookingId)) {
      throw new Error("Invalid booking id");
    }
    const booking = await booking_model_default2.findOne({
      _id: bookingId,
      vendorId: vendor._id,
      serviceType: vendor.serviceType
    }).select(
      "bookingReference serviceType serviceSnapshot bookingDate timeSlot primaryCustomer participants meta extraInfo duration quantity pricing status paymentStatus createdAt"
    ).lean();
    if (!booking) {
      throw new Error("Booking not found");
    }
    let serviceDetails = {};
    if (booking.serviceType === "adventure") {
      serviceDetails = {
        persons: booking.quantity,
        info: booking.extraInfo
      };
    }
    if (booking.serviceType === "cab") {
      serviceDetails = {
        route: booking.extraInfo?.value || "N/A"
      };
    }
    if (booking.serviceType === "bike") {
      serviceDetails = {
        days: booking.duration?.totalDays || 1,
        startDate: booking.duration?.startDate,
        endDate: booking.duration?.endDate
      };
    }
    if (booking.serviceType === "tour") {
      serviceDetails = {
        persons: booking.quantity,
        days: booking.duration?.totalDays || 0,
        startDate: booking.duration?.startDate
      };
    }
    const formattedBooking = {
      id: booking._id,
      bookingReference: booking.bookingReference,
      service: {
        title: booking.serviceSnapshot?.title || "N/A",
        type: booking.serviceType,
        subType: booking.serviceSnapshot?.type || null,
        details: serviceDetails
      },
      customer: {
        name: `${booking.primaryCustomer?.firstName || ""} ${booking.primaryCustomer?.lastName || ""}`.trim(),
        email: booking.primaryCustomer?.email,
        phone: booking.primaryCustomer?.phoneNumber
      },
      bookingDate: booking.bookingDate,
      timeSlot: booking.timeSlot || null,
      participants: booking.participants || [],
      meta: booking.meta || {},
      extraInfo: booking.extraInfo || {},
      pricing: {
        baseAmount: booking.pricing?.baseAmount || 0,
        taxAmount: booking.pricing?.taxAmount || 0,
        taxPercentage: booking.pricing?.taxPercentage || 0,
        totalAmount: booking.pricing?.totalAmount || 0
      },
      quantity: booking.quantity,
      duration: booking.duration || null,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      createdAt: booking.createdAt
    };
    return formattedBooking;
  } catch (error) {
    throw error;
  }
};
var MultiServiceVendorBookingService = class {
  async getVendorBookings(query = {}, vendor) {
    return getVendorBookings3(query, vendor);
  }
  async getVendorBookingById(bookingId, vendor) {
    return getVendorBookingById(bookingId, vendor);
  }
};
var multiServiceVendorBookingService = new MultiServiceVendorBookingService();
var booking_service_default3 = multiServiceVendorBookingService;

// src/modules/multiServiceVendor/booking/booking.controller.ts
var MSVBookingController = class {
  async getVendorBookings(req, res, next) {
    try {
      const vendor = await vendor_model_default.findOne({ userId: req.user._id });
      if (!vendor) {
        throw new Error("Vendor not found");
      }
      const result = await booking_service_default3.getVendorBookings(req.query, vendor);
      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      logger_default.error("Controller Error: getVendorBookings", error);
      next(error);
    }
  }
  async getVendorBookingById(req, res, next) {
    try {
      const vendor = await vendor_model_default.findOne({ userId: req.user._id });
      if (!vendor) {
        throw new Error("Vendor not found");
      }
      const bookingId = req.params.id;
      const booking = await booking_service_default3.getVendorBookingById(
        bookingId,
        vendor
      );
      res.status(200).json({
        success: true,
        data: booking
      });
    } catch (error) {
      logger_default.error("Controller Error: getVendorBookingDetail", error);
      next(error);
    }
  }
};

// src/modules/multiServiceVendor/booking/booking.routes.ts
var router26 = (0, import_express26.Router)();
var bookingController4 = new MSVBookingController();
router26.use(protect);
router26.get(
  "/",
  protect,
  authorize("vendor"),
  bookingController4.getVendorBookings
);
router26.get(
  "/:id",
  protect,
  authorize("vendor"),
  bookingController4.getVendorBookingById
);
var booking_routes_default3 = router26;

// src/modules/multiServiceVendor/invoice/invoice.routes.ts
var import_express27 = require("express");

// src/modules/multiServiceVendor/invoice/invoice.service.ts
var import_pdfkit2 = __toESM(require("pdfkit"), 1);
var getVendorInvoiceList = async (query = {}, vendor) => {
  try {
    const {
      status,
      // paymentStatus
      search,
      fromDate,
      toDate,
      page = 1,
      limit = 10
    } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const filter = {
      vendorId: vendor._id,
      serviceType: vendor.serviceType,
      paymentStatus: { $in: ["paid", "refunded"] }
    };
    if (status) {
      filter.paymentStatus = status;
    }
    if (fromDate || toDate) {
      filter.bookingDate = {};
      if (fromDate) {
        filter.bookingDate.$gte = new Date(fromDate);
      }
      if (toDate) {
        filter.bookingDate.$lte = new Date(toDate);
      }
    }
    if (search) {
      filter.$or = [
        { bookingReference: { $regex: search, $options: "i" } },
        { "primaryCustomer.firstName": { $regex: search, $options: "i" } },
        { "primaryCustomer.lastName": { $regex: search, $options: "i" } }
      ];
    }
    const invoices = await booking_model_default2.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).select(
      "bookingReference serviceType bookingDate extraInfo pricing.totalAmount paymentStatus primaryCustomer serviceSnapshot duration quantity"
    ).lean();
    const total = await booking_model_default2.countDocuments(filter);
    const formatted = invoices.map((b) => {
      let serviceDetails = "";
      if (b.serviceType === "adventure") {
        serviceDetails = `${b.quantity} Person`;
      }
      if (b.serviceType === "cab") {
        serviceDetails = b.extraInfo?.value || "Route N/A";
      }
      if (b.serviceType === "bike") {
        serviceDetails = `${b.duration?.totalDays || 1} Days`;
      }
      if (b.serviceType === "tour") {
        serviceDetails = `${b.quantity} Person \u2022 ${b.duration?.totalDays || 0} Days`;
      }
      return {
        bookingId: b._id,
        bookingReference: b.bookingReference,
        customerName: `${b.primaryCustomer?.firstName || ""} ${b.primaryCustomer?.lastName || ""}`.trim(),
        serviceTitle: b.serviceSnapshot?.title || "N/A",
        serviceType: b.serviceType,
        serviceDetails,
        amount: b.pricing?.totalAmount || 0,
        paymentStatus: b.paymentStatus,
        bookingDate: b.bookingDate
      };
    });
    return {
      count: formatted.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: formatted
    };
  } catch (error) {
    throw error;
  }
};
var generateInvoicePdf2 = async (bookingId, vendor, res) => {
  try {
    const booking = await booking_model_default2.findById(bookingId).lean();
    if (!booking || booking.vendorId.toString() !== vendor._id.toString()) {
      throw new Error("Unauthorized access");
    }
    const doc = new import_pdfkit2.default({ margin: 40 });
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${booking.bookingReference}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);
    doc.fontSize(20).text("INVOICE", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).text(`Booking ID: ${booking.bookingReference}`);
    doc.text(`Date: ${new Date(booking.createdAt).toDateString()}`);
    doc.moveDown();
    doc.fontSize(14).text("Customer Details", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10).text(
      `${booking.primaryCustomer?.firstName || ""} ${booking.primaryCustomer?.lastName || ""}`.trim()
    );
    doc.text(booking.primaryCustomer?.email);
    doc.text(booking.primaryCustomer?.phoneNumber);
    doc.moveDown();
    doc.fontSize(14).text("Service Details", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10).text(`Service: ${booking.serviceSnapshot?.title}`);
    doc.text(`Type: ${booking.serviceType}`);
    if (booking.serviceType === "adventure") {
      doc.text(`Participants: ${booking.quantity}`);
      if (booking.timeSlot) doc.text(`Time Slot: ${booking.timeSlot}`);
    }
    if (booking.serviceType === "cab") {
      doc.text(`Route: ${booking.extraInfo?.value || "N/A"}`);
    }
    if (booking.serviceType === "bike") {
      doc.text(`Duration: ${booking.duration?.totalDays || 1} Days`);
      doc.text(`From: ${new Date(booking.duration?.startDate).toDateString()}`);
      doc.text(`To: ${new Date(booking.duration?.endDate).toDateString()}`);
    }
    if (booking.serviceType === "tour") {
      doc.text(`People: ${booking.quantity}`);
      doc.text(`Duration: ${booking.duration?.totalDays || 0} Days`);
    }
    doc.text(`Booking Date: ${new Date(booking.bookingDate).toDateString()}`);
    if (booking.meta && Object.keys(booking.meta).length > 0) {
      doc.moveDown(0.5);
      Object.entries(booking.meta).forEach(([key2, value]) => {
        doc.text(`${key2}: ${value}`);
      });
    }
    doc.moveDown();
    if (booking.participants && booking.participants.length > 0) {
      doc.fontSize(14).text("Participants", { underline: true });
      doc.moveDown(0.5);
      booking.participants.forEach((p, i) => {
        doc.fontSize(10).text(`${i + 1}. ${p.name || "N/A"}`);
        if (p.age) doc.text(`   Age: ${p.age}`);
        if (p.gender) doc.text(`   Gender: ${p.gender}`);
      });
      doc.moveDown();
    }
    doc.fontSize(14).text("Pricing", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10).text(`Base Amount: \u20B9${booking.pricing?.baseAmount}`);
    doc.text(
      `Tax (${booking.pricing?.taxPercentage}%): \u20B9${booking.pricing?.taxAmount}`
    );
    doc.text(`Total Amount: \u20B9${booking.pricing?.totalAmount}`);
    doc.moveDown();
    doc.fontSize(14).text("Payment Details", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10).text(`Payment Status: ${booking.paymentStatus}`);
    doc.text(`Payment ID: ${booking.paymentId || "N/A"}`);
    doc.moveDown();
    if (booking.refundStatus !== "none") {
      doc.fontSize(14).text("Refund Details", { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10).text(`Refund Status: ${booking.refundStatus}`);
      doc.text(`Refund Amount: \u20B9${booking.refundAmount || 0}`);
      doc.moveDown();
    }
    doc.moveDown(2);
    doc.fontSize(10).text("Thank you for your booking!", { align: "center" });
    doc.end();
  } catch (error) {
    throw error;
  }
};
var MultiServiceVendorInvoiceService = class {
  async getVendorInvoiceList(query = {}, vendor) {
    return getVendorInvoiceList(query, vendor);
  }
  async generateInvoicePdf(bookingId, vendor, res) {
    return generateInvoicePdf2(bookingId, vendor, res);
  }
};
var multiServiceVendorInvoiceService = new MultiServiceVendorInvoiceService();
var invoice_service_default = multiServiceVendorInvoiceService;

// src/modules/multiServiceVendor/invoice/invoice.controller.ts
var MSVInvoiceController = class {
  async getVendorInvoiceList(req, res, next) {
    try {
      const vendor = await vendor_model_default.findOne({ userId: req.user._id });
      if (!vendor) {
        throw new Error("Vendor not found");
      }
      const result = await invoice_service_default.getVendorInvoiceList(req.query, vendor);
      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      logger_default.error("Controller Error: getVendorInvoices", error);
      next(error);
    }
  }
  async downloadInvoicePdf(req, res, next) {
    try {
      const vendor = await vendor_model_default.findOne({ userId: req.user._id });
      if (!vendor || vendor.status !== "approved") {
        res.status(403).json({
          success: false,
          message: "Vendor not authorized"
        });
        return;
      }
      await invoice_service_default.generateInvoicePdf(req.params.bookingId, vendor, res);
    } catch (error) {
      logger_default.error("Download Invoice Error:", error);
      next(error);
    }
  }
};

// src/modules/multiServiceVendor/invoice/invoice.routes.ts
var router27 = (0, import_express27.Router)();
var invoiceController = new MSVInvoiceController();
router27.get(
  "/",
  protect,
  authorize("vendor"),
  invoiceController.getVendorInvoiceList
);
router27.get(
  "/:bookingId/download",
  protect,
  authorize("vendor"),
  invoiceController.downloadInvoicePdf
);
var invoice_routes_default = router27;

// src/modules/multiServiceVendor/vendor.routes.ts
var router28 = (0, import_express28.Router)();
router28.use("/dashboard", dashboard_routes_default);
router28.use("/bookings", booking_routes_default3);
router28.use("/invoices", invoice_routes_default);
var vendor_routes_default2 = router28;

// src/modules/vendorAccountGroup/accountGroup.routes.ts
var import_express29 = require("express");

// src/modules/vendorAccountGroup/accountGroup.service.ts
var import_bcryptjs2 = __toESM(require("bcryptjs"), 1);
var import_jsonwebtoken4 = __toESM(require("jsonwebtoken"), 1);

// src/modules/vendorAccountGroup/accountGroup.model.ts
var import_mongoose43 = __toESM(require("mongoose"), 1);
var vendorAccountGroupSchema = new import_mongoose43.Schema(
  {
    accounts: [
      {
        vendorId: {
          type: import_mongoose43.Schema.Types.ObjectId,
          ref: "Vendor",
          required: true
        },
        serviceType: {
          type: String,
          enum: ["hotel", "adventure", "cab", "bike", "tour"]
        },
        linkedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    primaryVendorId: {
      type: import_mongoose43.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true
    }
  },
  {
    timestamps: true
  }
);
vendorAccountGroupSchema.index({
  "accounts.vendorId": 1
});
var VendorAccountGroup = import_mongoose43.default.model("VendorAccountGroup", vendorAccountGroupSchema);
var accountGroup_model_default = VendorAccountGroup;

// src/modules/vendorAccountGroup/accountGroup.service.ts
var connectVendorAccounts = async (currentVendorId, email, password) => {
  const currentVendor = await vendor_model_default.findById(currentVendorId);
  if (!currentVendor) {
    throw new Error("Current vendor not found");
  }
  if (currentVendor.status !== "approved") {
    throw new Error("Your vendor account is not approved yet");
  }
  if (!currentVendor.isActive) {
    throw new Error("Inactive vendor accounts cannot be linked");
  }
  const targetUser = await auth_model_default.findOne({
    email
  }).select("+password");
  if (!targetUser) {
    throw new Error("Account not found");
  }
  const isMatch = await import_bcryptjs2.default.compare(password, targetUser.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }
  const targetVendor = await vendor_model_default.findOne({
    userId: targetUser._id
  });
  if (!targetVendor) {
    throw new Error("Vendor account not found");
  }
  if (targetVendor.status !== "approved") {
    throw new Error("Target vendor account is not approved");
  }
  if (!targetVendor.isActive) {
    throw new Error("Inactive vendor accounts cannot be linked");
  }
  if (currentVendor._id.toString() === targetVendor._id.toString()) {
    throw new Error("Cannot connect same account");
  }
  if (currentVendor.linkedGroupId && targetVendor.linkedGroupId && currentVendor.linkedGroupId.toString() === targetVendor.linkedGroupId.toString()) {
    throw new Error("Accounts already linked");
  }
  let group;
  if (!currentVendor.linkedGroupId && !targetVendor.linkedGroupId) {
    group = await accountGroup_model_default.create({
      primaryVendorId: currentVendor._id,
      accounts: [
        {
          vendorId: currentVendor._id,
          serviceType: currentVendor.serviceType
        },
        {
          vendorId: targetVendor._id,
          serviceType: targetVendor.serviceType
        }
      ]
    });
    currentVendor.linkedGroupId = group._id;
    targetVendor.linkedGroupId = group._id;
    await currentVendor.save();
    await targetVendor.save();
  } else if (currentVendor.linkedGroupId && !targetVendor.linkedGroupId) {
    group = await accountGroup_model_default.findById(currentVendor.linkedGroupId);
    if (!group) {
      throw new Error("Linked group not found");
    }
    const alreadyExists = group.accounts.some(
      (acc) => acc.vendorId.toString() === targetVendor._id.toString()
    );
    if (alreadyExists) {
      throw new Error("Accounts already linked");
    }
    group.accounts.push({
      vendorId: targetVendor._id,
      serviceType: targetVendor.serviceType
    });
    await group.save();
    targetVendor.linkedGroupId = group._id;
    await targetVendor.save();
  } else if (!currentVendor.linkedGroupId && targetVendor.linkedGroupId) {
    group = await accountGroup_model_default.findById(targetVendor.linkedGroupId);
    if (!group) {
      throw new Error("Linked group not found");
    }
    const alreadyExists = group.accounts.some(
      (acc) => acc.vendorId.toString() === currentVendor._id.toString()
    );
    if (alreadyExists) {
      throw new Error("Accounts already linked");
    }
    group.accounts.push({
      vendorId: currentVendor._id,
      serviceType: currentVendor.serviceType
    });
    await group.save();
    currentVendor.linkedGroupId = group._id;
    await currentVendor.save();
  }
  return {
    success: true,
    message: "Accounts linked successfully"
  };
};
var getConnectedAccounts = async (currentVendorId) => {
  const currentVendor = await vendor_model_default.findById(currentVendorId);
  if (!currentVendor) {
    throw new Error("Vendor not found");
  }
  if (!currentVendor.linkedGroupId) {
    return [];
  }
  const group = await accountGroup_model_default.findById(
    currentVendor.linkedGroupId
  ).populate({
    path: "accounts.vendorId",
    select: "businessName serviceType status isActive userId"
  });
  if (!group) {
    return [];
  }
  const formattedAccounts = group.accounts.filter(
    (acc) => acc.vendorId && acc.vendorId._id.toString() !== currentVendorId.toString() && acc.vendorId.status === "approved" && acc.vendorId.isActive
  ).map((acc) => ({
    vendorId: acc.vendorId._id,
    businessName: acc.vendorId.businessName,
    serviceType: acc.vendorId.serviceType,
    status: acc.vendorId.status
  }));
  return formattedAccounts;
};
var switchVendorAccount = async (currentVendorId, targetVendorId) => {
  const currentVendor = await vendor_model_default.findById(currentVendorId);
  if (!currentVendor) {
    throw new Error("Current vendor not found");
  }
  const targetVendor = await vendor_model_default.findById(targetVendorId);
  if (!targetVendor) {
    throw new Error("Target vendor not found");
  }
  if (targetVendor.status !== "approved") {
    throw new Error("Only approved accounts can be accessed");
  }
  if (!targetVendor.isActive) {
    throw new Error("Vendor account is inactive");
  }
  if (!currentVendor.linkedGroupId || !targetVendor.linkedGroupId) {
    throw new Error("Accounts are not linked");
  }
  if (currentVendor.linkedGroupId.toString() !== targetVendor.linkedGroupId.toString()) {
    throw new Error("Unauthorized account switch");
  }
  const targetUser = await auth_model_default.findById(targetVendor.userId);
  if (!targetUser) {
    throw new Error("User not found");
  }
  const accessToken = import_jsonwebtoken4.default.sign(
    {
      id: targetUser._id,
      vendorId: targetVendor._id
    },
    process.env.JWT_ACCESS_SECRET || "access_secret",
    {
      expiresIn: "1d"
    }
  );
  return {
    accessToken,
    vendor: {
      _id: targetVendor._id,
      businessName: targetVendor.businessName,
      serviceType: targetVendor.serviceType,
      status: targetVendor.status
    }
  };
};
var AccountGroupService = class {
  async connectVendorAccounts(currentVendorId, email, password) {
    return connectVendorAccounts(currentVendorId, email, password);
  }
  async getConnectedAccounts(currentVendorId) {
    return getConnectedAccounts(currentVendorId);
  }
  async switchVendorAccount(currentVendorId, targetVendorId) {
    return switchVendorAccount(currentVendorId, targetVendorId);
  }
};
var accountGroupService = new AccountGroupService();

// src/modules/vendorAccountGroup/accountGroup.controller.ts
var VendorAccountGroupController = class {
  async connectVendorAccounts(req, res) {
    try {
      const currentVendorId = req.vendorId;
      const { email, password } = req.body;
      const result = await connectVendorAccounts(
        currentVendorId,
        email,
        password
      );
      return res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async getConnectedAccounts(req, res) {
    try {
      const currentVendorId = req.vendorId;
      const accounts = await getConnectedAccounts(currentVendorId);
      return res.status(200).json({
        success: true,
        data: accounts
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  async switchVendorAccount(req, res) {
    try {
      const currentVendorId = req.vendorId;
      const { targetVendorId } = req.body;
      const result = await switchVendorAccount(
        currentVendorId,
        targetVendorId
      );
      return res.status(200).json({
        success: true,
        message: "Account switched successfully",
        accessToken: result.accessToken,
        vendor: result.vendor
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
};

// src/modules/vendorAccountGroup/accountGroup.routes.ts
var router29 = (0, import_express29.Router)();
var vendorAccountController = new VendorAccountGroupController();
router29.post(
  "/connect-account",
  protect,
  authorize("vendor"),
  vendorAccountController.connectVendorAccounts
);
router29.get(
  "/connected-accounts",
  protect,
  authorize("vendor"),
  vendorAccountController.getConnectedAccounts
);
router29.post(
  "/switch-account",
  protect,
  authorize("vendor"),
  vendorAccountController.switchVendorAccount
);
var accountGroup_routes_default = router29;

// src/modules/admin/property/property.routes.ts
var import_express30 = require("express");

// src/modules/admin/property/property.service.ts
var import_mongoose45 = __toESM(require("mongoose"), 1);
var import_crypto6 = __toESM(require("crypto"), 1);
init_tourService_model();

// src/modules/admin/property/deletedProperty.model.ts
var import_mongoose44 = __toESM(require("mongoose"), 1);
var deletedPropertySchema = new import_mongoose44.Schema(
  {
    originalVendorId: {
      type: import_mongoose44.Schema.Types.ObjectId,
      index: true
    },
    propertyId: {
      type: String,
      default: "",
      index: true
    },
    propertyName: {
      type: String,
      default: "Unnamed Property",
      trim: true
    },
    businessName: {
      type: String,
      default: "N/A",
      trim: true
    },
    vendorName: {
      type: String,
      default: "N/A",
      trim: true
    },
    vendorEmail: {
      type: String,
      default: "",
      trim: true
    },
    vendorPhone: {
      type: String,
      default: "",
      trim: true
    },
    serviceType: {
      type: String,
      enum: ["hotel", "tour", "cab", "bike", "adventure", "other"],
      default: "hotel",
      index: true
    },
    city: {
      type: String,
      default: "N/A",
      trim: true
    },
    reason: {
      type: String,
      default: "Deleted by administrator",
      trim: true
    },
    deletedBy: {
      type: import_mongoose44.Schema.Types.ObjectId,
      ref: "User"
    },
    deletedAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);
deletedPropertySchema.index({ deletedAt: -1 });
var DeletedProperty = import_mongoose44.default.model("DeletedProperty", deletedPropertySchema);
var deletedProperty_model_default = DeletedProperty;

// src/modules/admin/property/property.service.ts
var serviceModelMap = {
  hotel: hotel_model_default,
  cab: cab_model_default,
  bike: bike_model_default,
  tour: tour_model_default,
  adventure: adventure_model_default
};
var getAllProperties = async (query) => {
  try {
    const { page = 1, limit = 10, status, search, serviceType } = query;
    const skip = (page - 1) * limit;
    const matchStage = {};
    if (status && status !== "all") {
      if (status === "active") {
        matchStage.status = { $ne: "blocked" };
      } else {
        matchStage.status = status;
      }
    }
    if (serviceType) {
      matchStage.serviceType = serviceType;
    }
    const serviceCollectionMap = {
      hotel: "hotels",
      cab: "cabcompanies",
      bike: "bikecompanies",
      tour: "tourcompanies",
      adventure: "adventures"
    };
    const lookupCollection = serviceCollectionMap[serviceType] || "hotels";
    const pipeline = [
      {
        $match: matchStage
      },
      // USER JOIN
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "hotels",
          localField: "_id",
          foreignField: "vendorId",
          as: "hotelDoc"
        }
      },
      {
        $lookup: {
          from: "cabcompanies",
          localField: "_id",
          foreignField: "vendorId",
          as: "cabDoc"
        }
      },
      {
        $lookup: {
          from: "bikecompanies",
          localField: "_id",
          foreignField: "vendorId",
          as: "bikeDoc"
        }
      },
      {
        $lookup: {
          from: "tourcompanies",
          localField: "_id",
          foreignField: "vendorId",
          as: "tourDoc"
        }
      },
      {
        $lookup: {
          from: "adventures",
          localField: "_id",
          foreignField: "vendorId",
          as: "adventureDoc"
        }
      },
      {
        $addFields: {
          business: {
            $switch: {
              branches: [
                {
                  case: { $eq: ["$serviceType", "hotel"] },
                  then: { $arrayElemAt: ["$hotelDoc", 0] }
                },
                {
                  case: { $eq: ["$serviceType", "cab"] },
                  then: { $arrayElemAt: ["$cabDoc", 0] }
                },
                {
                  case: { $eq: ["$serviceType", "bike"] },
                  then: { $arrayElemAt: ["$bikeDoc", 0] }
                },
                {
                  case: { $eq: ["$serviceType", "tour"] },
                  then: { $arrayElemAt: ["$tourDoc", 0] }
                },
                {
                  case: { $eq: ["$serviceType", "adventure"] },
                  then: { $arrayElemAt: ["$adventureDoc", 0] }
                }
              ],
              default: null
            }
          }
        }
      },
      // SEARCH
      ...search ? [
        {
          $match: {
            $or: [
              {
                "business.name": {
                  $regex: search,
                  $options: "i"
                }
              },
              {
                "business.city": {
                  $regex: search,
                  $options: "i"
                }
              },
              {
                "business.location.city": {
                  $regex: search,
                  $options: "i"
                }
              },
              {
                "user.firstName": {
                  $regex: search,
                  $options: "i"
                }
              },
              {
                "user.lastName": {
                  $regex: search,
                  $options: "i"
                }
              },
              // SEARCH BY PROPERTY ID
              {
                propertyId: {
                  $regex: search,
                  $options: "i"
                }
              }
            ]
          }
        }
      ] : [],
      {
        $project: {
          _id: 1,
          propertyId: 1,
          serviceType: 1,
          businessName: {
            $ifNull: ["$business.name", "N/A"]
          },
          city: {
            $ifNull: ["$business.city", "$business.location.city"]
          },
          vendorName: {
            $trim: {
              input: {
                $concat: [
                  {
                    $ifNull: ["$user.firstName", ""]
                  },
                  " ",
                  {
                    $ifNull: ["$user.lastName", ""]
                  }
                ]
              }
            }
          },
          status: 1,
          submittedAt: 1,
          rank: {
            $ifNull: ["$business.rank", "C"]
          },
          verificationStatus: "$business.verificationStatus",
          canAssignRank: {
            $cond: [
              {
                $eq: ["$business.verificationStatus", "verified"]
              },
              true,
              false
            ]
          }
        }
      },
      {
        $sort: {
          submittedAt: -1
        }
      },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: Number(limit) }],
          totalCount: [
            {
              $count: "count"
            }
          ]
        }
      }
    ];
    const result = await vendor_model_default.aggregate(pipeline);
    const properties = result[0].data;
    const total = result[0].totalCount[0]?.count || 0;
    return {
      properties,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total
      }
    };
  } catch (error) {
    throw error;
  }
};
var getPropertyDetail = async (vendorId) => {
  try {
    if (!import_mongoose45.default.Types.ObjectId.isValid(vendorId)) {
      throw new Error("Invalid vendor ID");
    }
    const vendor = await vendor_model_default.findById(vendorId);
    if (!vendor) {
      throw new Error("Vendor not found");
    }
    const user = await auth_model_default.findById(vendor.userId);
    const bank = await bank_model_default.findOne({
      vendorId
    }).select("+accountNumber +ifscCode +upiId");
    let business = null;
    switch (vendor.serviceType) {
      case "hotel":
        business = await hotel_model_default.findOne({
          vendorId
        });
        break;
      case "cab":
        business = await cab_model_default.findOne({
          vendorId
        });
        break;
      case "bike":
        business = await bike_model_default.findOne({
          vendorId
        });
        break;
      case "tour":
        business = await tour_model_default.findOne({
          vendorId
        });
        break;
      case "adventure":
        business = await adventure_model_default.findOne({
          vendorId
        });
        break;
      default:
        business = null;
    }
    let promotion = null;
    if (business?._id) {
      const activePromo = await promotion_model_default.findOne({
        serviceId: business._id,
        status: "approved"
      }).sort({ updatedAt: -1 }).lean();
      if (activePromo) {
        promotion = {
          id: activePromo._id,
          rank: activePromo.rankAssigned,
          startDate: activePromo.startDate,
          endDate: activePromo.endDate,
          status: activePromo.status,
          plan: activePromo.plan
        };
      }
    }
    return {
      businessId: business?._id || null,
      vendor: {
        _id: vendor._id,
        propertyId: vendor.propertyId || null,
        status: vendor.status,
        submittedAt: vendor.submittedAt,
        serviceType: vendor.serviceType,
        rejectedSteps: vendor.rejectedSteps || [],
        rejectionReasons: vendor.rejectionReasons || {}
      },
      user: {
        name: user ? `${user.firstName} ${user.lastName}` : "",
        email: user?.email || "",
        phone: user?.phoneNumber || ""
      },
      businessDetails: {
        businessName: vendor.businessName,
        businessEmail: vendor.businessEmail,
        businessPhone: vendor.businessPhone,
        address: vendor.businessAddress,
        city: vendor.city,
        state: vendor.state,
        country: vendor.country,
        panNumber: vendor.panNumber,
        aadhaarNumber: vendor.aadhaarNumber
      },
      documents: vendor.verificationDocs || [],
      bankDetails: bank ? {
        accountHolderName: bank.accountHolderName,
        bankName: bank.bankName,
        accountNumber: bank.accountNumber,
        ifscCode: bank.ifscCode,
        branchName: bank.branchName,
        upiId: bank.upiId,
        proof: bank.bankProof,
        verificationStatus: bank.verificationStatus
      } : null,
      propertyDetails: business ? {
        _id: business._id,
        name: business.name,
        description: business.description,
        address: business.address,
        city: business.city || business?.location?.city,
        images: business.images,
        documents: business.documents || [],
        features: business.features || [],
        amenities: business.amenities || [],
        accessibility: business.accessibility || {},
        verificationStatus: business.verificationStatus,
        rank: business.rank,
        isFeatured: business.isFeatured
      } : null,
      promotion
    };
  } catch (error) {
    throw error;
  }
};
var approveVendor = async (vendorId, adminId) => {
  try {
    if (!import_mongoose45.default.Types.ObjectId.isValid(vendorId)) {
      throw new Error("Invalid vendor ID");
    }
    const vendor = await vendor_model_default.findById(vendorId);
    if (!vendor) {
      throw new Error("Vendor not found");
    }
    if (!vendor.isSubmitted) {
      throw new Error("Vendor has not submitted onboarding");
    }
    if (vendor.verificationDocs && vendor.verificationDocs.length > 0) {
      vendor.verificationDocs = vendor.verificationDocs.map((doc) => ({
        ...doc.toObject(),
        isVerified: true
      }));
    }
    await bank_model_default.findOneAndUpdate(
      { vendorId },
      {
        verificationStatus: "verified"
      }
    );
    let business = null;
    switch (vendor.serviceType) {
      case "hotel":
        business = await hotel_model_default.findOne({
          vendorId
        });
        break;
      case "cab":
        business = await cab_model_default.findOne({
          vendorId
        });
        break;
      case "bike":
        business = await bike_model_default.findOne({
          vendorId
        });
        break;
      case "tour":
        business = await tour_model_default.findOne({
          vendorId
        });
        break;
      case "adventure":
        business = await adventure_model_default.findOne({
          vendorId
        });
        break;
      default:
        business = null;
    }
    if (business) {
      business.verificationStatus = "verified";
      business.isActive = true;
      if (business.documents && business.documents.length > 0) {
        business.documents = business.documents.map((doc) => ({
          ...doc.toObject(),
          isVerified: true
        }));
      }
      await business.save();
    }
    if (!vendor.propertyId) {
      let uniqueId;
      let isUnique = false;
      while (!isUnique) {
        uniqueId = String(Math.floor(1e5 + import_crypto6.default.randomInt(9e5)));
        const existing = await vendor_model_default.findOne({ propertyId: uniqueId });
        if (!existing) isUnique = true;
      }
      vendor.propertyId = uniqueId;
    }
    vendor.rejectedSteps = [];
    vendor.rejectionReasons = {};
    vendor.status = "approved";
    vendor.approvedAt = /* @__PURE__ */ new Date();
    vendor.approvedBy = adminId;
    sendVendorApprovalEmail(vendor).catch((err) => {
      console.error("Approval email failed:", err.message);
    });
    await vendor.save();
    return vendor;
  } catch (error) {
    throw error;
  }
};
var updateBusinessRank = async (serviceType, businessId, rank) => {
  try {
    const validRanks = ["A", "B", "C"];
    if (!validRanks.includes(rank)) {
      throw new Error("Invalid rank value");
    }
    if (!import_mongoose45.default.Types.ObjectId.isValid(businessId)) {
      throw new Error("Invalid business ID");
    }
    const BusinessModel = serviceModelMap[serviceType];
    if (!BusinessModel) {
      throw new Error("Invalid service type");
    }
    const business = await BusinessModel.findById(businessId);
    if (!business) {
      throw new Error("Business not found");
    }
    if (business.verificationStatus !== "verified") {
      throw new Error("Only verified businesses can be ranked");
    }
    if (business.rank === rank) {
      return business;
    }
    business.rank = rank;
    await business.save();
    return business;
  } catch (error) {
    throw error;
  }
};
var markIssue = async (vendorId, step, reason, adminId) => {
  try {
    if (!import_mongoose45.default.Types.ObjectId.isValid(vendorId)) {
      throw new Error("Invalid vendor ID");
    }
    if (![2, 3, 4].includes(step)) {
      throw new Error("Invalid step");
    }
    if (!reason || !reason.trim()) {
      throw new Error("Reason is required");
    }
    const vendor = await vendor_model_default.findById(vendorId);
    if (!vendor) {
      throw new Error("Vendor not found");
    }
    if (!vendor.rejectedSteps) {
      vendor.rejectedSteps = [];
    }
    if (!vendor.rejectionReasons) {
      vendor.rejectionReasons = {};
    }
    if (!vendor.rejectedSteps.includes(step)) {
      vendor.rejectedSteps.push(step);
    }
    vendor.rejectionReasons = {
      ...vendor.rejectionReasons || {},
      [step]: reason.trim()
    };
    vendor.status = "under_review";
    vendor.reviewedBy = adminId;
    vendor.reviewedAt = /* @__PURE__ */ new Date();
    await vendor.save();
    return vendor;
  } catch (error) {
    throw error;
  }
};
var verifySection = async (vendorId, step, adminId) => {
  try {
    if (!import_mongoose45.default.Types.ObjectId.isValid(vendorId)) {
      throw new Error("Invalid vendor ID");
    }
    if (![2, 3, 4].includes(step)) {
      throw new Error("Invalid step");
    }
    const vendor = await vendor_model_default.findById(vendorId);
    if (!vendor) {
      throw new Error("Vendor not found");
    }
    if (vendor.rejectedSteps?.includes(step)) {
      vendor.rejectedSteps = vendor.rejectedSteps.filter((s) => s !== step);
      if (vendor.rejectionReasons) {
        delete vendor.rejectionReasons[step];
      }
    }
    if (step === 2) {
      if (vendor.verificationDocs && vendor.verificationDocs.length > 0) {
        vendor.verificationDocs = vendor.verificationDocs.map((doc) => ({
          ...doc.toObject(),
          isVerified: true
        }));
      }
    }
    if (step === 3) {
      await bank_model_default.findOneAndUpdate(
        {
          vendorId
        },
        {
          verificationStatus: "verified"
        }
      );
    }
    if (step === 4 && vendor.serviceType) {
      const BusinessModel = serviceModelMap[vendor.serviceType];
      if (BusinessModel) {
        const business = await BusinessModel.findOne({
          vendorId
        });
        if (business) {
          business.verificationStatus = "verified";
          business.isActive = true;
          if (business.documents && business.documents.length > 0) {
            business.documents = business.documents.map((doc) => ({
              ...doc.toObject(),
              isVerified: true
            }));
          }
          await business.save();
        }
      }
    }
    if (!vendor.rejectedSteps || vendor.rejectedSteps.length === 0) {
      vendor.status = "pending";
    }
    vendor.reviewedAt = /* @__PURE__ */ new Date();
    await vendor.save();
    return vendor;
  } catch (error) {
    throw error;
  }
};
var rejectVendor = async (vendorId, body, adminId) => {
  try {
    if (!import_mongoose45.default.Types.ObjectId.isValid(vendorId)) {
      throw new Error("Invalid vendor ID");
    }
    const vendor = await vendor_model_default.findById(vendorId);
    if (!vendor) {
      throw new Error("Vendor not found");
    }
    if (body.rejectedSteps && body.reasons) {
      vendor.rejectedSteps = body.rejectedSteps;
      vendor.rejectionReasons = body.reasons;
    }
    if (!vendor.rejectedSteps || vendor.rejectedSteps.length === 0) {
      throw new Error("No issues found to reject");
    }
    vendor.status = "rejected";
    vendor.rejectedAt = /* @__PURE__ */ new Date();
    vendor.reviewedAt = /* @__PURE__ */ new Date();
    const BusinessModel = vendor.serviceType ? serviceModelMap[vendor.serviceType] : null;
    if (BusinessModel) {
      const business = await BusinessModel.findOne({
        vendorId
      });
      if (business) {
        business.isActive = false;
        business.verificationStatus = "rejected";
        await business.save();
      }
    }
    if (vendor.businessEmail) {
      sendVendorRejectionEmail(vendor).catch((err) => {
        console.error("Rejection email failed:", err.message);
      });
    }
    await vendor.save();
    return vendor;
  } catch (error) {
    throw error;
  }
};
var getPropertyListings = async (vendorId) => {
  try {
    if (!import_mongoose45.default.Types.ObjectId.isValid(vendorId)) {
      throw new Error("Invalid vendor ID");
    }
    const vendor = await vendor_model_default.findById(vendorId);
    if (!vendor) {
      throw new Error("Vendor not found");
    }
    const { serviceType } = vendor;
    const BusinessModel = serviceType ? serviceModelMap[serviceType] : null;
    if (!BusinessModel) {
      return {
        serviceType,
        businessId: null,
        businessName: null,
        listings: [],
        count: 0
      };
    }
    const business = await BusinessModel.findOne({ vendorId }).lean();
    if (!business) {
      return {
        serviceType,
        businessId: null,
        businessName: null,
        listings: [],
        count: 0
      };
    }
    let listings = [];
    if (serviceType === "hotel") {
      const rooms = await roomType_model_default.find({ hotelId: business._id }).sort({ createdAt: -1 }).lean();
      listings = rooms.map((room) => ({
        id: room._id,
        name: room.name,
        description: room.description || "",
        basePrice: room.basePrice,
        discountPrice: room.discountPrice || 0,
        effectivePrice: room.discountPrice > 0 ? room.discountPrice : room.basePrice,
        capacity: room.capacity || { adults: 2, children: 0 },
        beds: room.beds || [],
        roomSizeSqm: room.roomSizeSqm || null,
        viewType: room.viewType || "none",
        amenities: room.amenities || [],
        totalRooms: room.totalRooms || 0,
        isActive: room.isActive !== false,
        images: (room.images || []).map((img) => ({
          url: img.url,
          public_id: img.public_id
        })),
        createdAt: room.createdAt
      }));
    } else if (serviceType === "tour") {
      const packages = await tourService_model_default.find({ tour: business._id }).sort({ createdAt: -1 }).lean();
      listings = packages.map((pkg) => ({
        id: pkg._id,
        title: pkg.title,
        description: pkg.description || "",
        destinations: pkg.destinations || [],
        duration: pkg.duration ? `${pkg.duration.days}D/${pkg.duration.nights}N` : "N/A",
        durationRaw: pkg.duration || { days: 0, nights: 0 },
        basePrice: pkg.basePrice,
        discountPrice: pkg.discountPrice || 0,
        effectivePrice: pkg.discountPrice > 0 ? pkg.discountPrice : pkg.basePrice,
        features: pkg.features || [],
        tourType: pkg.tourType || [],
        amenities: pkg.amenities || [],
        maxPeople: pkg.maxPeople || 10,
        isActive: pkg.isActive !== false,
        images: (pkg.images || []).map((img) => ({
          url: img.url,
          public_id: img.public_id
        })),
        itinerary: pkg.itinerary || [],
        meta: pkg.meta || {},
        createdAt: pkg.createdAt
      }));
    }
    return {
      serviceType,
      businessId: business._id,
      businessName: business.name,
      listings,
      count: listings.length
    };
  } catch (error) {
    throw error;
  }
};
var blockVendor = async (vendorId, adminId, reason = "") => {
  try {
    if (!import_mongoose45.default.Types.ObjectId.isValid(vendorId)) {
      throw new Error("Invalid vendor ID");
    }
    const vendor = await vendor_model_default.findById(vendorId);
    if (!vendor) {
      throw new Error("Vendor not found");
    }
    vendor.status = "blocked";
    vendor.isBlocked = true;
    vendor.isActive = false;
    vendor.blockedAt = /* @__PURE__ */ new Date();
    vendor.blockedBy = adminId;
    vendor.blockReason = reason || "Blocked by administrator";
    await vendor.save();
    switch (vendor.serviceType) {
      case "hotel": {
        const hotel = await hotel_model_default.findOne({ vendorId });
        if (hotel) {
          hotel.isActive = false;
          await hotel.save();
          await roomType_model_default.updateMany(
            { hotelId: hotel._id },
            { isActive: false }
          );
        }
        break;
      }
      case "tour": {
        const tour = await tour_model_default.findOne({ vendorId });
        if (tour) {
          tour.isActive = false;
          await tour.save();
          await tourService_model_default.updateMany({ tour: tour._id }, { isActive: false });
        }
        break;
      }
      case "cab": {
        const cab = await cab_model_default.findOne({ vendorId });
        if (cab) {
          cab.isActive = false;
          await cab.save();
          const CabService2 = (await Promise.resolve().then(() => (init_cabService_model(), cabService_model_exports))).default;
          await CabService2.updateMany(
            { companyId: cab._id },
            { isActive: false }
          );
        }
        break;
      }
      case "bike": {
        const bike = await bike_model_default.findOne({ vendorId });
        if (bike) {
          bike.isActive = false;
          await bike.save();
          const BikeService2 = (await Promise.resolve().then(() => (init_bikeService_model(), bikeService_model_exports))).default;
          await BikeService2.updateMany(
            { companyId: bike._id },
            { isActive: false }
          );
        }
        break;
      }
      case "adventure": {
        const adv = await adventure_model_default.findOne({ vendorId });
        if (adv) {
          adv.isActive = false;
          await adv.save();
          const AdventureService = (await Promise.resolve().then(() => (init_service_model(), service_model_exports))).default;
          await AdventureService.updateMany(
            { adventureId: adv._id },
            { isActive: false }
          );
        }
        break;
      }
    }
    await promotion_model_default.updateMany({ vendorId }, { isActive: false });
    return vendor;
  } catch (error) {
    throw error;
  }
};
var unblockVendor = async (vendorId, adminId) => {
  try {
    if (!import_mongoose45.default.Types.ObjectId.isValid(vendorId)) {
      throw new Error("Invalid vendor ID");
    }
    const vendor = await vendor_model_default.findById(vendorId);
    if (!vendor) {
      throw new Error("Vendor not found");
    }
    vendor.status = "approved";
    vendor.isBlocked = false;
    vendor.isActive = true;
    vendor.blockedAt = void 0;
    vendor.blockedBy = void 0;
    vendor.blockReason = void 0;
    await vendor.save();
    switch (vendor.serviceType) {
      case "hotel": {
        const hotel = await hotel_model_default.findOne({ vendorId });
        if (hotel) {
          hotel.isActive = true;
          await hotel.save();
          await roomType_model_default.updateMany({ hotelId: hotel._id }, { isActive: true });
        }
        break;
      }
      case "tour": {
        const tour = await tour_model_default.findOne({ vendorId });
        if (tour) {
          tour.isActive = true;
          await tour.save();
          await tourService_model_default.updateMany({ tour: tour._id }, { isActive: true });
        }
        break;
      }
      case "cab": {
        const cab = await cab_model_default.findOne({ vendorId });
        if (cab) {
          cab.isActive = true;
          await cab.save();
          const CabService2 = (await Promise.resolve().then(() => (init_cabService_model(), cabService_model_exports))).default;
          await CabService2.updateMany(
            { companyId: cab._id },
            { isActive: true }
          );
        }
        break;
      }
      case "bike": {
        const bike = await bike_model_default.findOne({ vendorId });
        if (bike) {
          bike.isActive = true;
          await bike.save();
          const BikeService2 = (await Promise.resolve().then(() => (init_bikeService_model(), bikeService_model_exports))).default;
          await BikeService2.updateMany(
            { companyId: bike._id },
            { isActive: true }
          );
        }
        break;
      }
      case "adventure": {
        const adv = await adventure_model_default.findOne({ vendorId });
        if (adv) {
          adv.isActive = true;
          await adv.save();
          const AdventureService = (await Promise.resolve().then(() => (init_service_model(), service_model_exports))).default;
          await AdventureService.updateMany(
            { adventureId: adv._id },
            { isActive: true }
          );
        }
        break;
      }
    }
    return vendor;
  } catch (error) {
    throw error;
  }
};
var deleteProperty = async (vendorId, adminId = null, reason = "") => {
  try {
    if (!import_mongoose45.default.Types.ObjectId.isValid(vendorId)) {
      throw new Error("Invalid vendor ID");
    }
    const vendor = await vendor_model_default.findById(vendorId);
    if (!vendor) {
      throw new Error("Vendor not found");
    }
    const user = await auth_model_default.findById(vendor.userId).select(
      "firstName lastName email phoneNumber"
    );
    let businessDoc = null;
    switch (vendor.serviceType) {
      case "hotel": {
        const hotel = await hotel_model_default.findOne({ vendorId });
        if (hotel) {
          businessDoc = hotel;
          await roomType_model_default.deleteMany({ hotelId: hotel._id });
          const Availability2 = (await Promise.resolve().then(() => (init_availability_model(), availability_model_exports))).default;
          await Availability2.deleteMany({ hotelId: hotel._id });
          await hotel_model_default.findByIdAndDelete(hotel._id);
        }
        break;
      }
      case "tour": {
        const tour = await tour_model_default.findOne({ vendorId });
        if (tour) {
          businessDoc = tour;
          await tourService_model_default.deleteMany({ tour: tour._id });
          await tour_model_default.findByIdAndDelete(tour._id);
        }
        break;
      }
      case "cab": {
        const cab = await cab_model_default.findOne({ vendorId });
        if (cab) {
          businessDoc = cab;
          const CabService2 = (await Promise.resolve().then(() => (init_cabService_model(), cabService_model_exports))).default;
          await CabService2.deleteMany({ companyId: cab._id });
          await cab_model_default.findByIdAndDelete(cab._id);
        }
        break;
      }
      case "bike": {
        const bike = await bike_model_default.findOne({ vendorId });
        if (bike) {
          businessDoc = bike;
          const BikeService2 = (await Promise.resolve().then(() => (init_bikeService_model(), bikeService_model_exports))).default;
          await BikeService2.deleteMany({ companyId: bike._id });
          await bike_model_default.findByIdAndDelete(bike._id);
        }
        break;
      }
      case "adventure": {
        const adv = await adventure_model_default.findOne({ vendorId });
        if (adv) {
          businessDoc = adv;
          const AdventureService = (await Promise.resolve().then(() => (init_service_model(), service_model_exports))).default;
          await AdventureService.deleteMany({ adventureId: adv._id });
          await adventure_model_default.findByIdAndDelete(adv._id);
        }
        break;
      }
    }
    const vendorFullName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : vendor.businessName || "N/A";
    await deletedProperty_model_default.create({
      originalVendorId: vendor._id,
      propertyId: vendor.propertyId || "",
      propertyName: businessDoc?.name || vendor.businessName || "Unnamed Property",
      businessName: vendor.businessName || businessDoc?.name || "N/A",
      vendorName: vendorFullName || "N/A",
      vendorEmail: user?.email || vendor.businessEmail || "",
      vendorPhone: user?.phoneNumber || vendor.businessPhone || "",
      serviceType: vendor.serviceType || "hotel",
      city: vendor.city || businessDoc?.city || businessDoc?.location?.city || "N/A",
      reason: reason || "Deleted by administrator",
      deletedBy: adminId,
      deletedAt: /* @__PURE__ */ new Date()
    });
    await bank_model_default.deleteMany({ vendorId });
    await promotion_model_default.deleteMany({ vendorId });
    await vendor_model_default.findByIdAndDelete(vendorId);
    return {
      success: true,
      message: "Property and vendor deleted successfully"
    };
  } catch (error) {
    throw error;
  }
};
var getDeletedProperties = async (query = {}) => {
  try {
    const { page = 1, limit = 10, search, serviceType } = query;
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Number(limit) || 10);
    const skip = (pageNum - 1) * limitNum;
    const filter = {};
    if (serviceType && serviceType !== "all") {
      filter.serviceType = serviceType;
    }
    if (search && search.trim()) {
      const reg = { $regex: search.trim(), $options: "i" };
      filter.$or = [
        { propertyName: reg },
        { businessName: reg },
        { vendorName: reg },
        { city: reg },
        { propertyId: reg }
      ];
    }
    const [items, total] = await Promise.all([
      deletedProperty_model_default.find(filter).sort({ deletedAt: -1 }).skip(skip).limit(limitNum).lean(),
      deletedProperty_model_default.countDocuments(filter)
    ]);
    return {
      items,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1
    };
  } catch (error) {
    throw error;
  }
};
var cleanAllDeletedProperties = async () => {
  try {
    const result = await deletedProperty_model_default.deleteMany({});
    return {
      success: true,
      deletedCount: result.deletedCount || 0,
      message: `Cleaned ${result.deletedCount || 0} deleted records`
    };
  } catch (error) {
    throw error;
  }
};
var deleteDeletedPropertyRecord = async (id) => {
  try {
    if (!import_mongoose45.default.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid record ID");
    }
    await deletedProperty_model_default.findByIdAndDelete(id);
    return {
      success: true,
      message: "Record permanently removed from trash"
    };
  } catch (error) {
    throw error;
  }
};
var PropertyService = class {
  getAllProperties = getAllProperties;
  getPropertyDetail = getPropertyDetail;
  approveVendor = approveVendor;
  updateBusinessRank = updateBusinessRank;
  markIssue = markIssue;
  verifySection = verifySection;
  rejectVendor = rejectVendor;
  getPropertyListings = getPropertyListings;
  blockVendor = blockVendor;
  unblockVendor = unblockVendor;
  deleteProperty = deleteProperty;
  getDeletedProperties = getDeletedProperties;
  cleanAllDeletedProperties = cleanAllDeletedProperties;
  deleteDeletedPropertyRecord = deleteDeletedPropertyRecord;
};
var propertyService = new PropertyService();
var property_service = {
  getAllProperties,
  getPropertyDetail,
  approveVendor,
  updateBusinessRank,
  markIssue,
  verifySection,
  rejectVendor,
  getPropertyListings,
  blockVendor,
  unblockVendor,
  deleteProperty,
  getDeletedProperties,
  cleanAllDeletedProperties,
  deleteDeletedPropertyRecord
};
var property_service_default = property_service;

// src/modules/admin/property/property.controller.ts
var PropertyController = class {
  //all vendor property list
  async getAllProperties(req, res, next) {
    try {
      const result = await property_service_default.getAllProperties(req.query);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger_default.error("Controller Error: getAllProperties", error);
      next(error);
    }
  }
  async updateBusinessRank(req, res, next) {
    try {
      const { rank, serviceType = "hotel" } = req.body;
      const { id } = req.params;
      if (!rank) {
        res.status(400).json({
          success: false,
          message: "Rank is required"
        });
        return;
      }
      const updatedHotel = await property_service_default.updateBusinessRank(
        serviceType,
        id,
        rank
      );
      res.status(200).json({
        success: true,
        message: "Business rank updated successfully",
        data: updatedHotel
      });
    } catch (error) {
      logger_default.error("Controller Error: updateBusinessRank", error);
      next(error);
    }
  }
  //vendor property detail
  async getPropertyDetail(req, res, next) {
    try {
      const { vendorId } = req.params;
      const data = await property_service_default.getPropertyDetail(vendorId);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      logger_default.error("Controller Error: getPropertyDetail", error);
      next(error);
    }
  }
  //mark issue
  async markIssue(req, res, next) {
    try {
      const { vendorId } = req.params;
      const { step, reason } = req.body;
      const vendor = await property_service_default.markIssue(
        vendorId,
        step,
        reason,
        req.user._id
      );
      res.status(200).json({
        success: true,
        message: "Issue marked successfully",
        data: {
          rejectedSteps: vendor.rejectedSteps,
          rejectionReasons: vendor.rejectionReasons,
          status: vendor.status
        }
      });
    } catch (error) {
      logger_default.error("Controller Error: markIssue", error);
      next(error);
    }
  }
  //verfiy the steps
  async verifySection(req, res, next) {
    try {
      const { vendorId } = req.params;
      const { step } = req.body;
      const vendor = await property_service_default.verifySection(
        vendorId,
        step,
        req.user._id
      );
      res.status(200).json({
        success: true,
        message: "Section verified successfully",
        data: {
          rejectedSteps: vendor.rejectedSteps,
          rejectionReasons: vendor.rejectionReasons,
          status: vendor.status
        }
      });
    } catch (error) {
      logger_default.error("Controller Error: verifySection", error);
      next(error);
    }
  }
  //reject the steps
  async rejectVendor(req, res, next) {
    try {
      const { vendorId } = req.params;
      const vendor = await property_service_default.rejectVendor(
        vendorId,
        req.body,
        req.user._id
      );
      res.status(200).json({
        success: true,
        message: "Vendor rejected successfully",
        data: {
          status: vendor.status,
          rejectedSteps: vendor.rejectedSteps,
          rejectionReasons: vendor.rejectionReasons
        }
      });
    } catch (error) {
      logger_default.error("Controller Error: rejectVendor", error);
      next(error);
    }
  }
  //approve the vendor
  async approveVendor(req, res, next) {
    try {
      const { vendorId } = req.params;
      const vendor = await property_service_default.approveVendor(
        vendorId,
        req.user._id
      );
      res.status(200).json({
        success: true,
        message: "Vendor approved successfully",
        data: {
          status: vendor.status
        }
      });
    } catch (error) {
      logger_default.error("Controller Error: approveVendor", error);
      next(error);
    }
  }
  //get property listings (rooms for hotel, packages for tour)
  async getPropertyListings(req, res, next) {
    try {
      const { vendorId } = req.params;
      const data = await property_service_default.getPropertyListings(vendorId);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      logger_default.error("Controller Error: getPropertyListings", error);
      next(error);
    }
  }
  //block vendor / property
  async blockVendor(req, res, next) {
    try {
      const { vendorId } = req.params;
      const { reason } = req.body || {};
      const vendor = await property_service_default.blockVendor(
        vendorId,
        req.user._id,
        reason
      );
      res.status(200).json({
        success: true,
        message: "Vendor blocked successfully",
        data: {
          status: vendor.status,
          isBlocked: vendor.isBlocked
        }
      });
    } catch (error) {
      logger_default.error("Controller Error: blockVendor", error);
      next(error);
    }
  }
  //unblock vendor / property
  async unblockVendor(req, res, next) {
    try {
      const { vendorId } = req.params;
      const vendor = await property_service_default.unblockVendor(
        vendorId,
        req.user._id
      );
      res.status(200).json({
        success: true,
        message: "Vendor unblocked successfully",
        data: {
          status: vendor.status,
          isBlocked: vendor.isBlocked
        }
      });
    } catch (error) {
      logger_default.error("Controller Error: unblockVendor", error);
      next(error);
    }
  }
  //delete property / vendor
  async deleteProperty(req, res, next) {
    try {
      const { vendorId } = req.params;
      const { reason } = req.body || {};
      const result = await property_service_default.deleteProperty(
        vendorId,
        req.user?._id,
        reason
      );
      res.status(200).json({
        success: true,
        message: result.message || "Property deleted successfully"
      });
    } catch (error) {
      logger_default.error("Controller Error: deleteProperty", error);
      next(error);
    }
  }
  //get deleted properties list
  async getDeletedProperties(req, res, next) {
    try {
      const data = await property_service_default.getDeletedProperties(req.query);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      logger_default.error("Controller Error: getDeletedProperties", error);
      next(error);
    }
  }
  //clean all deleted records (trash empty)
  async cleanAllDeletedProperties(req, res, next) {
    try {
      const result = await property_service_default.cleanAllDeletedProperties();
      res.status(200).json({
        success: true,
        data: result,
        message: result.message
      });
    } catch (error) {
      logger_default.error("Controller Error: cleanAllDeletedProperties", error);
      next(error);
    }
  }
  //delete single deleted record permanently
  async deleteDeletedPropertyRecord(req, res, next) {
    try {
      const { id } = req.params;
      const result = await property_service_default.deleteDeletedPropertyRecord(id);
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      logger_default.error("Controller Error: deleteDeletedPropertyRecord", error);
      next(error);
    }
  }
};

// src/modules/admin/property/property.routes.ts
var router30 = (0, import_express30.Router)();
var propertyController = new PropertyController();
router30.get(
  "/",
  protect,
  authorize("admin"),
  propertyController.getAllProperties
);
router30.patch(
  "/:id/rank",
  protect,
  authorize("admin"),
  propertyController.updateBusinessRank
);
router30.get(
  "/:vendorId/listings",
  protect,
  authorize("admin"),
  propertyController.getPropertyListings
);
router30.get(
  "/deleted",
  protect,
  authorize("admin"),
  propertyController.getDeletedProperties
);
router30.delete(
  "/deleted/clean-all",
  protect,
  authorize("admin"),
  propertyController.cleanAllDeletedProperties
);
router30.delete(
  "/deleted/:id",
  protect,
  authorize("admin"),
  propertyController.deleteDeletedPropertyRecord
);
router30.get(
  "/:vendorId",
  protect,
  authorize("admin"),
  propertyController.getPropertyDetail
);
router30.patch(
  "/:vendorId/mark-issue",
  protect,
  authorize("admin"),
  propertyController.markIssue
);
router30.patch(
  "/:vendorId/verify",
  protect,
  authorize("admin"),
  propertyController.verifySection
);
router30.patch(
  "/:vendorId/reject",
  protect,
  authorize("admin"),
  propertyController.rejectVendor
);
router30.patch(
  "/:vendorId/approve",
  protect,
  authorize("admin"),
  propertyController.approveVendor
);
router30.patch(
  "/:vendorId/block",
  protect,
  authorize("admin"),
  propertyController.blockVendor
);
router30.patch(
  "/:vendorId/unblock",
  protect,
  authorize("admin"),
  propertyController.unblockVendor
);
router30.delete(
  "/:vendorId",
  protect,
  authorize("admin"),
  propertyController.deleteProperty
);
var property_routes_default = router30;

// src/modules/admin/user/user.routes.ts
var import_express31 = require("express");

// src/modules/admin/user/user.service.ts
var import_mongoose46 = __toESM(require("mongoose"), 1);
var getAllUsers = async (query) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status
    } = query;
    const skip = (page - 1) * limit;
    const matchStage = {
      role: "user"
    };
    if (status === "active") {
      matchStage.isActive = true;
    }
    if (status === "blocked") {
      matchStage.isActive = false;
    }
    const pipeline = [
      {
        $match: matchStage
      },
      // SEARCH
      ...search ? [
        {
          $match: {
            $or: [
              {
                firstName: {
                  $regex: search,
                  $options: "i"
                }
              },
              {
                lastName: {
                  $regex: search,
                  $options: "i"
                }
              },
              {
                email: {
                  $regex: search,
                  $options: "i"
                }
              },
              {
                phoneNumber: {
                  $regex: search,
                  $options: "i"
                }
              }
            ]
          }
        }
      ] : [],
      // HOTEL BOOKINGS
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "userId",
          as: "hotelBookings"
        }
      },
      // GENERIC BOOKINGS
      {
        $lookup: {
          from: "genericbookings",
          localField: "_id",
          foreignField: "userId",
          as: "genericBookings"
        }
      },
      // TOTAL BOOKINGS
      {
        $addFields: {
          hotelBookingCount: {
            $size: "$hotelBookings"
          },
          genericBookingCount: {
            $size: "$genericBookings"
          }
        }
      },
      {
        $addFields: {
          totalBookings: {
            $add: ["$hotelBookingCount", "$genericBookingCount"]
          }
        }
      },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          phoneNumber: 1,
          avatar: 1,
          isActive: 1,
          createdAt: 1,
          totalBookings: 1
        }
      },
      // SORTING
      // 1. MOST BOOKINGS
      // 2. LATEST USERS
      {
        $sort: {
          totalBookings: -1,
          createdAt: -1
        }
      },
      {
        $facet: {
          data: [
            {
              $skip: skip
            },
            {
              $limit: Number(limit)
            }
          ],
          totalCount: [
            {
              $count: "count"
            }
          ]
        }
      }
    ];
    const result = await auth_model_default.aggregate(pipeline);
    const users = result[0].data;
    const total = result[0].totalCount[0]?.count || 0;
    return {
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total
      }
    };
  } catch (error) {
    throw error;
  }
};
var getUserBookings2 = async (userId, query) => {
  try {
    const {
      page = 1,
      limit = 10
    } = query;
    const skip = (page - 1) * limit;
    const hotelPipeline = [
      {
        $match: {
          userId: new import_mongoose46.default.Types.ObjectId(userId)
        }
      },
      // HOTEL
      {
        $lookup: {
          from: "hotels",
          localField: "hotelId",
          foreignField: "_id",
          as: "hotel"
        }
      },
      {
        $unwind: {
          path: "$hotel",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          bookingReference: 1,
          serviceType: {
            $literal: "hotel"
          },
          name: {
            $ifNull: ["$hotel.name", "N/A"]
          },
          city: {
            $ifNull: ["$hotel.city", "N/A"]
          },
          image: {
            $arrayElemAt: ["$hotel.images.url", 0]
          },
          bookingDate: "$checkIn",
          checkIn: 1,
          checkOut: 1,
          totalAmount: 1,
          status: 1,
          paymentStatus: 1,
          createdAt: 1
        }
      }
    ];
    const genericPipeline = [
      {
        $match: {
          userId: new import_mongoose46.default.Types.ObjectId(userId)
        }
      },
      {
        $project: {
          _id: 1,
          bookingReference: 1,
          serviceType: 1,
          name: "$serviceSnapshot.title",
          city: {
            $ifNull: ["$meta.city", "N/A"]
          },
          image: {
            $ifNull: [
              {
                $arrayElemAt: ["$serviceSnapshot.extra.images", 0]
              },
              null
            ]
          },
          bookingDate: 1,
          duration: 1,
          quantity: 1,
          totalAmount: "$pricing.totalAmount",
          status: 1,
          paymentStatus: 1,
          createdAt: 1
        }
      }
    ];
    const [hotelBookings, genericBookings] = await Promise.all([
      booking_model_default.aggregate(hotelPipeline),
      booking_model_default2.aggregate(genericPipeline)
    ]);
    const allBookings = [...hotelBookings, ...genericBookings].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    const paginatedBookings = allBookings.slice(
      skip,
      skip + Number(limit)
    );
    return {
      bookings: paginatedBookings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: allBookings.length
      }
    };
  } catch (error) {
    throw error;
  }
};
var getBookingDetail2 = async (userId, bookingId) => {
  try {
    const hotelPipeline = [
      {
        $match: {
          _id: new import_mongoose46.default.Types.ObjectId(bookingId),
          userId: new import_mongoose46.default.Types.ObjectId(userId)
        }
      },
      // HOTEL
      {
        $lookup: {
          from: "hotels",
          localField: "hotelId",
          foreignField: "_id",
          as: "hotel"
        }
      },
      {
        $unwind: {
          path: "$hotel",
          preserveNullAndEmptyArrays: true
        }
      },
      // VENDOR
      {
        $lookup: {
          from: "vendors",
          localField: "hotel.vendorId",
          foreignField: "_id",
          as: "vendor"
        }
      },
      {
        $unwind: {
          path: "$vendor",
          preserveNullAndEmptyArrays: true
        }
      },
      // PAYMENT
      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "bookingId",
          as: "payment"
        }
      },
      {
        $unwind: {
          path: "$payment",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          bookingType: {
            $literal: "hotel"
          },
          // BOOKING INFO
          bookingInfo: {
            bookingId: "$_id",
            bookingReference: "$bookingReference",
            status: "$status",
            paymentStatus: "$paymentStatus",
            checkIn: "$checkIn",
            checkOut: "$checkOut",
            nights: "$nights",
            createdAt: "$createdAt",
            guests: "$guests",
            primaryGuest: "$primaryGuest",
            additionalGuests: "$additionalGuests",
            specialRequest: "$specialRequest",
            roomNumber: "$roomNumber",
            cancellation: {
              cancelledAt: "$cancelledAt",
              cancellationReason: "$cancellationReason"
            },
            refund: {
              refundStatus: "$refundStatus",
              refundAmount: "$refundAmount",
              refundPercentage: "$refundPercentage",
              refundRequestedAt: "$refundRequestedAt",
              refundProcessedAt: "$refundProcessedAt"
            }
          },
          // SERVICE
          service: {
            type: "hotel",
            hotel: {
              _id: "$hotel._id",
              name: "$hotel.name",
              city: "$hotel.city",
              address: "$hotel.address",
              rating: "$hotel.rating",
              numReviews: "$hotel.numReviews",
              isActive: "$hotel.isActive",
              verificationStatus: "$hotel.verificationStatus",
              image: {
                $arrayElemAt: ["$hotel.images.url", 0]
              }
            },
            room: {
              roomTypeId: "$roomTypeId",
              pricePerNight: "$pricePerNight"
            }
          },
          // VENDOR
          vendor: {
            _id: "$vendor._id",
            propertyId: "$vendor.propertyId",
            businessName: "$vendor.businessName",
            businessEmail: "$vendor.businessEmail",
            businessPhone: "$vendor.businessPhone",
            city: "$vendor.city",
            status: "$vendor.status",
            isActive: "$vendor.isActive"
          },
          // PAYMENT
          payment: {
            _id: "$payment._id",
            razorpayOrderId: "$payment.razorpayOrderId",
            razorpayPaymentId: "$payment.razorpayPaymentId",
            amountPaid: "$payment.amountPaid",
            currency: "$payment.currency",
            paymentMethod: "$payment.paymentMethod",
            status: "$payment.status",
            isVerified: "$payment.isVerified",
            refund: {
              refundAmount: "$payment.refundAmount",
              refundStatus: "$payment.refundStatus",
              refundedAt: "$payment.refundedAt"
            }
          },
          // PRICING
          pricing: {
            pricePerNight: "$pricePerNight",
            nights: "$nights",
            roomsBooked: "$roomsBooked",
            taxAmount: "$taxAmount",
            cleaningFee: "$cleaningFee",
            discountAmount: "$discountAmount",
            totalAmount: "$totalAmount"
          }
        }
      }
    ];
    const genericPipeline = [
      {
        $match: {
          _id: new import_mongoose46.default.Types.ObjectId(bookingId),
          userId: new import_mongoose46.default.Types.ObjectId(userId)
        }
      },
      // VENDOR
      {
        $lookup: {
          from: "vendors",
          localField: "vendorId",
          foreignField: "_id",
          as: "vendor"
        }
      },
      {
        $unwind: {
          path: "$vendor",
          preserveNullAndEmptyArrays: true
        }
      },
      // PAYMENT
      {
        $lookup: {
          from: "payments",
          localField: "paymentId",
          foreignField: "_id",
          as: "payment"
        }
      },
      {
        $unwind: {
          path: "$payment",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          bookingType: {
            $literal: "generic"
          },
          // BOOKING INFO
          bookingInfo: {
            bookingId: "$_id",
            bookingReference: "$bookingReference",
            status: "$status",
            paymentStatus: "$paymentStatus",
            bookingDate: "$bookingDate",
            duration: "$duration",
            quantity: "$quantity",
            timeSlot: "$timeSlot",
            createdAt: "$createdAt",
            participants: "$participants",
            primaryCustomer: "$primaryCustomer",
            specialRequest: "$specialRequest",
            cancellation: {
              cancelledAt: "$cancelledAt",
              cancellationReason: "$cancellationReason"
            },
            refund: {
              refundStatus: "$refundStatus",
              refundAmount: "$refundAmount"
            }
          },
          // SERVICE
          service: {
            type: "$serviceType",
            serviceId: "$serviceId",
            title: "$serviceSnapshot.title",
            price: "$serviceSnapshot.price",
            extra: "$serviceSnapshot.extra",
            meta: "$meta",
            extraInfo: "$extraInfo"
          },
          // VENDOR
          vendor: {
            _id: "$vendor._id",
            propertyId: "$vendor.propertyId",
            businessName: "$vendor.businessName",
            businessEmail: "$vendor.businessEmail",
            businessPhone: "$vendor.businessPhone",
            city: "$vendor.city",
            status: "$vendor.status",
            isActive: "$vendor.isActive"
          },
          // PAYMENT
          payment: {
            _id: "$payment._id",
            razorpayOrderId: "$payment.razorpayOrderId",
            razorpayPaymentId: "$payment.razorpayPaymentId",
            amountPaid: "$payment.amountPaid",
            currency: "$payment.currency",
            paymentMethod: "$payment.paymentMethod",
            status: "$payment.status",
            isVerified: "$payment.isVerified",
            refund: {
              refundAmount: "$payment.refundAmount",
              refundStatus: "$payment.refundStatus",
              refundedAt: "$payment.refundedAt"
            }
          },
          // PRICING
          pricing: {
            baseAmount: "$pricing.baseAmount",
            taxAmount: "$pricing.taxAmount",
            taxPercentage: "$pricing.taxPercentage",
            discountAmount: "$pricing.discountAmount",
            totalAmount: "$pricing.totalAmount"
          }
        }
      }
    ];
    const [hotelBooking, genericBooking] = await Promise.all([
      booking_model_default.aggregate(hotelPipeline),
      booking_model_default2.aggregate(genericPipeline)
    ]);
    if (hotelBooking.length > 0) {
      return hotelBooking[0];
    }
    if (genericBooking.length > 0) {
      return genericBooking[0];
    }
    throw new Error("Booking not found");
  } catch (error) {
    throw error;
  }
};
var updateUserStatus = async (userId, body) => {
  try {
    const { isActive } = body;
    if (isActive === void 0 || isActive === null) {
      throw new Error("isActive field is required");
    }
    if (typeof isActive !== "boolean") {
      throw new Error("isActive must be true or false");
    }
    if (!import_mongoose46.default.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID format");
    }
    const existingUser = await auth_model_default.findOne({
      _id: userId,
      role: "user"
    }).select("_id");
    if (!existingUser) {
      throw new Error("User not found");
    }
    const user = await auth_model_default.findByIdAndUpdate(
      userId,
      {
        isActive,
        updatedAt: /* @__PURE__ */ new Date()
      },
      {
        new: true,
        runValidators: true
      }
    ).select("_id firstName lastName email isActive createdAt updatedAt");
    if (!user) {
      throw new Error("User not found");
    }
    const action = isActive ? "unblocked" : "blocked";
    const message = isActive ? "User unblocked successfully" : "User blocked successfully";
    return {
      success: true,
      message,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isActive: user.isActive,
        status: isActive ? "active" : "blocked",
        updatedAt: user.updatedAt
      }
    };
  } catch (error) {
    console.error("updateUserStatus error:", error);
    if (error.message === "Invalid user ID format") {
      throw new Error("Invalid user ID format");
    }
    if (error.message === "User not found") {
      throw new Error("User not found");
    }
    throw error;
  }
};
var UserService2 = class {
  getAllUsers = getAllUsers;
  getUserBookings = getUserBookings2;
  getBookingDetail = getBookingDetail2;
  updateUserStatus = updateUserStatus;
};
var userService2 = new UserService2();
var user_service = {
  getAllUsers,
  getUserBookings: getUserBookings2,
  getBookingDetail: getBookingDetail2,
  updateUserStatus
};
var user_service_default2 = user_service;

// src/modules/admin/user/user.controller.ts
var UserController2 = class {
  // Get all users
  async getAllUsers(req, res, next) {
    try {
      const result = await user_service_default2.getAllUsers(req.query);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger_default.error("Controller Error: getAllUsers", error);
      next(error);
    }
  }
  //Get user booking history list
  async getUserBookings(req, res, next) {
    try {
      const result = await user_service_default2.getUserBookings(
        req.params.userId,
        req.query
      );
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger_default.error("Controller Error: getUserBookings", error);
      next(error);
    }
  }
  // Get booking detail
  async getBookingDetail(req, res, next) {
    try {
      const result = await user_service_default2.getBookingDetail(
        req.params.userId,
        req.params.bookingId
      );
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger_default.error("Controller Error: getBookingDetail", error);
      next(error);
    }
  }
  // Block / Unblock user
  async updateUserStatus(req, res, next) {
    try {
      const result = await user_service_default2.updateUserStatus(
        req.params.userId,
        req.body
      );
      res.status(200).json({
        success: true,
        message: result.message,
        data: result.user
      });
    } catch (error) {
      logger_default.error("Controller Error: updateUserStatus", error);
      next(error);
    }
  }
};

// src/modules/admin/user/user.routes.ts
var router31 = (0, import_express31.Router)();
var userController2 = new UserController2();
router31.get("/", protect, authorize("admin"), userController2.getAllUsers);
router31.get(
  "/:userId/bookings",
  protect,
  authorize("admin"),
  userController2.getUserBookings
);
router31.get(
  "/:userId/bookings/:bookingId",
  protect,
  authorize("admin"),
  userController2.getBookingDetail
);
router31.patch(
  "/:userId/status",
  protect,
  authorize("admin"),
  userController2.updateUserStatus
);
var user_routes_default2 = router31;

// src/modules/admin/booking/booking.routes.ts
var import_express32 = require("express");

// src/modules/admin/booking/booking.service.ts
var import_mongoose47 = __toESM(require("mongoose"), 1);
var getBookingStats = async () => {
  try {
    const todayStart = /* @__PURE__ */ new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = /* @__PURE__ */ new Date();
    todayEnd.setHours(23, 59, 59, 999);
    const [
      hotelTotal,
      hotelToday,
      hotelPending,
      hotelCancelled,
      genericTotal,
      genericToday,
      genericPending,
      genericCancelled
    ] = await Promise.all([
      booking_model_default.countDocuments({}),
      booking_model_default.countDocuments({
        createdAt: { $gte: todayStart, $lte: todayEnd }
      }),
      booking_model_default.countDocuments({ paymentStatus: "pending" }),
      booking_model_default.countDocuments({ status: "cancelled" }),
      // GENERIC STATS
      booking_model_default2.countDocuments({}),
      booking_model_default2.countDocuments({
        createdAt: { $gte: todayStart, $lte: todayEnd }
      }),
      booking_model_default2.countDocuments({ paymentStatus: "pending" }),
      booking_model_default2.countDocuments({ status: "cancelled" })
    ]);
    return {
      totalBookings: hotelTotal + genericTotal,
      todaysBookings: hotelToday + genericToday,
      pendingPayments: hotelPending + genericPending,
      cancellations: hotelCancelled + genericCancelled
    };
  } catch (error) {
    console.error("getBookingStats error:", error);
    throw error;
  }
};
var getAllBookings = async (query) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      paymentStatus,
      serviceType,
      startDate,
      endDate
    } = query;
    const skip = (page - 1) * Number(limit);
    const take = Number(limit);
    const now = /* @__PURE__ */ new Date();
    let dateFilter = {};
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if (start && isNaN(start.getTime())) {
        throw new Error("Invalid startDate format. Use ISO date (YYYY-MM-DD)");
      }
      if (end && isNaN(end.getTime())) {
        throw new Error("Invalid endDate format. Use ISO date (YYYY-MM-DD)");
      }
      if (start) {
        start.setHours(0, 0, 0, 0);
      }
      if (end) {
        end.setHours(23, 59, 59, 999);
      }
      dateFilter = {
        createdAt: {
          ...start && { $gte: start },
          ...end && { $lte: end }
        }
      };
    }
    const hotelMatch = { ...dateFilter };
    if (paymentStatus) hotelMatch.paymentStatus = paymentStatus;
    if (status === "cancelled") hotelMatch.status = "cancelled";
    const genericMatch = { ...dateFilter };
    if (paymentStatus) genericMatch.paymentStatus = paymentStatus;
    if (serviceType && serviceType !== "hotel")
      genericMatch.serviceType = serviceType;
    if (status === "cancelled") genericMatch.status = "cancelled";
    else if (status === "upcoming") genericMatch.status = "confirmed";
    else if (status === "completed") genericMatch.status = "completed";
    const [hotelCount, genericCount] = await Promise.all([
      booking_model_default.countDocuments(hotelMatch),
      booking_model_default2.countDocuments(genericMatch)
    ]);
    const totalCount = hotelCount + genericCount;
    if (totalCount === 0) {
      return {
        bookings: [],
        pagination: { page: Number(page), limit: take, total: 0 },
        filters: { startDate, endDate, status, paymentStatus, serviceType }
      };
    }
    let hotelPipeline = [{ $match: hotelMatch }, { $sort: { createdAt: -1 } }];
    if (status === "upcoming") {
      hotelPipeline.push({
        $match: { checkIn: { $gt: now }, status: { $ne: "cancelled" } }
      });
    } else if (status === "ongoing") {
      hotelPipeline.push({
        $match: {
          checkIn: { $lte: now },
          checkOut: { $gte: now },
          status: { $ne: "cancelled" }
        }
      });
    } else if (status === "completed") {
      hotelPipeline.push({
        $match: { checkOut: { $lt: now }, status: { $ne: "cancelled" } }
      });
    }
    if (search) {
      hotelPipeline.push({
        $match: {
          $or: [
            { bookingReference: { $regex: search, $options: "i" } },
            { "user.firstName": { $regex: search, $options: "i" } },
            { "user.lastName": { $regex: search, $options: "i" } },
            { "hotel.name": { $regex: search, $options: "i" } }
          ]
        }
      });
    }
    hotelPipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "hotels",
          localField: "hotelId",
          foreignField: "_id",
          as: "hotel"
        }
      },
      { $unwind: { path: "$hotel", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          bookingReference: 1,
          userName: {
            $trim: {
              input: {
                $concat: [
                  { $ifNull: ["$user.firstName", ""] },
                  " ",
                  { $ifNull: ["$user.lastName", ""] }
                ]
              }
            }
          },
          serviceType: { $literal: "hotel" },
          serviceName: { $ifNull: ["$hotel.name", "N/A"] },
          city: { $ifNull: ["$hotel.city", "N/A"] },
          bookingDate: "$checkIn",
          createdAt: 1,
          totalAmount: 1,
          paymentStatus: 1,
          status: {
            $switch: {
              branches: [
                { case: { $eq: ["$status", "cancelled"] }, then: "cancelled" },
                { case: { $gt: ["$checkIn", now] }, then: "upcoming" },
                {
                  case: {
                    $and: [
                      { $lte: ["$checkIn", now] },
                      { $gte: ["$checkOut", now] }
                    ]
                  },
                  then: "ongoing"
                },
                { case: { $lt: ["$checkOut", now] }, then: "completed" }
              ],
              default: "pending"
            }
          }
        }
      }
    );
    let genericPipeline = [
      { $match: genericMatch },
      { $sort: { createdAt: -1 } }
    ];
    if (search) {
      genericPipeline.push({
        $match: {
          $or: [
            { bookingReference: { $regex: search, $options: "i" } },
            { "serviceSnapshot.title": { $regex: search, $options: "i" } },
            { "user.firstName": { $regex: search, $options: "i" } },
            { "user.lastName": { $regex: search, $options: "i" } }
          ]
        }
      });
    }
    genericPipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          bookingReference: 1,
          userName: {
            $trim: {
              input: {
                $concat: [
                  { $ifNull: ["$user.firstName", ""] },
                  " ",
                  { $ifNull: ["$user.lastName", ""] }
                ]
              }
            }
          },
          serviceType: 1,
          serviceName: "$serviceSnapshot.title",
          city: { $ifNull: ["$meta.city", "N/A"] },
          bookingDate: "$bookingDate",
          createdAt: 1,
          totalAmount: "$pricing.totalAmount",
          paymentStatus: 1,
          status: {
            $switch: {
              branches: [
                { case: { $eq: ["$status", "cancelled"] }, then: "cancelled" },
                { case: { $eq: ["$status", "confirmed"] }, then: "upcoming" },
                { case: { $eq: ["$status", "completed"] }, then: "completed" }
              ],
              default: "pending"
            }
          }
        }
      }
    );
    const extraBuffer = take;
    const hotelFetchLimit = Math.min(hotelCount, skip + take + extraBuffer);
    const genericFetchLimit = Math.min(genericCount, skip + take + extraBuffer);
    const hotelPipelineWithLimit = [...hotelPipeline];
    const genericPipelineWithLimit = [...genericPipeline];
    if (hotelFetchLimit > 0) {
      hotelPipelineWithLimit.push({ $limit: hotelFetchLimit });
    }
    if (genericFetchLimit > 0) {
      genericPipelineWithLimit.push({ $limit: genericFetchLimit });
    }
    const [hotelBookings, genericBookings] = await Promise.all([
      hotelFetchLimit > 0 ? booking_model_default.aggregate(hotelPipelineWithLimit) : Promise.resolve([]),
      genericFetchLimit > 0 ? booking_model_default2.aggregate(genericPipelineWithLimit) : Promise.resolve([])
    ]);
    const mergedBookings = [];
    let i = 0, j = 0;
    while (i < hotelBookings.length && j < genericBookings.length && mergedBookings.length < skip + take) {
      if (new Date(hotelBookings[i].createdAt) >= new Date(genericBookings[j].createdAt)) {
        mergedBookings.push(hotelBookings[i]);
        i++;
      } else {
        mergedBookings.push(genericBookings[j]);
        j++;
      }
    }
    while (i < hotelBookings.length && mergedBookings.length < skip + take) {
      mergedBookings.push(hotelBookings[i]);
      i++;
    }
    while (j < genericBookings.length && mergedBookings.length < skip + take) {
      mergedBookings.push(genericBookings[j]);
      j++;
    }
    const paginatedBookings = mergedBookings.slice(skip, skip + take);
    return {
      bookings: paginatedBookings,
      pagination: {
        page: Number(page),
        limit: take,
        total: totalCount,
        hotelCount,
        genericCount
      },
      filters: {
        startDate: startDate || null,
        endDate: endDate || null,
        status: status || null,
        paymentStatus: paymentStatus || null,
        serviceType: serviceType || null
      }
    };
  } catch (error) {
    console.error("getAllBookings error:", error);
    throw error;
  }
};
var getBookingDetail3 = async (bookingId) => {
  try {
    if (!import_mongoose47.default.Types.ObjectId.isValid(bookingId)) {
      throw new Error("Invalid booking ID");
    }
    const objectId = new import_mongoose47.default.Types.ObjectId(bookingId);
    const hotelBooking = await booking_model_default.aggregate([
      { $match: { _id: objectId } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "hotels",
          localField: "hotelId",
          foreignField: "_id",
          as: "hotel"
        }
      },
      { $unwind: { path: "$hotel", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "vendors",
          localField: "hotel.vendorId",
          foreignField: "_id",
          as: "vendor"
        }
      },
      { $unwind: { path: "$vendor", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "bookingId",
          as: "payment"
        }
      },
      { $unwind: { path: "$payment", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          bookingType: { $literal: "hotel" },
          bookingInfo: {
            bookingId: "$_id",
            bookingReference: "$bookingReference",
            status: "$status",
            paymentStatus: "$paymentStatus",
            checkIn: "$checkIn",
            checkOut: "$checkOut",
            nights: "$nights",
            createdAt: "$createdAt",
            guests: "$guests",
            primaryGuest: "$primaryGuest",
            additionalGuests: "$additionalGuests",
            specialRequest: "$specialRequest",
            roomNumber: "$roomNumber",
            cancellation: {
              cancelledAt: "$cancelledAt",
              cancellationReason: "$cancellationReason"
            },
            refund: {
              refundStatus: "$refundStatus",
              refundAmount: "$refundAmount",
              refundPercentage: "$refundPercentage",
              refundRequestedAt: "$refundRequestedAt",
              refundProcessedAt: "$refundProcessedAt"
            }
          },
          user: {
            _id: "$user._id",
            name: {
              $trim: {
                input: {
                  $concat: [
                    { $ifNull: ["$user.firstName", ""] },
                    " ",
                    { $ifNull: ["$user.lastName", ""] }
                  ]
                }
              }
            },
            email: "$user.email",
            phoneNumber: "$user.phoneNumber"
          },
          service: {
            type: "hotel",
            hotel: {
              _id: "$hotel._id",
              name: "$hotel.name",
              city: "$hotel.city",
              address: "$hotel.address",
              rating: "$hotel.rating",
              numReviews: "$hotel.numReviews",
              verificationStatus: "$hotel.verificationStatus",
              image: { $arrayElemAt: ["$hotel.images.url", 0] }
            },
            room: {
              roomTypeId: "$roomTypeId",
              pricePerNight: "$pricePerNight"
            }
          },
          vendor: {
            _id: "$vendor._id",
            propertyId: "$vendor.propertyId",
            businessName: "$vendor.businessName",
            businessEmail: "$vendor.businessEmail",
            businessPhone: "$vendor.businessPhone",
            city: "$vendor.city",
            status: "$vendor.status",
            isActive: "$vendor.isActive"
          },
          payment: {
            _id: "$payment._id",
            razorpayOrderId: "$payment.razorpayOrderId",
            razorpayPaymentId: "$payment.razorpayPaymentId",
            amountPaid: "$payment.amountPaid",
            currency: "$payment.currency",
            paymentMethod: "$payment.paymentMethod",
            status: "$payment.status",
            isVerified: "$payment.isVerified",
            refund: {
              refundAmount: "$payment.refundAmount",
              refundStatus: "$payment.refundStatus",
              refundedAt: "$payment.refundedAt"
            }
          },
          pricing: {
            pricePerNight: "$pricePerNight",
            nights: "$nights",
            roomsBooked: "$roomsBooked",
            taxAmount: "$taxAmount",
            cleaningFee: "$cleaningFee",
            discountAmount: "$discountAmount",
            totalAmount: "$totalAmount"
          }
        }
      }
    ]);
    if (hotelBooking.length > 0) {
      return hotelBooking[0];
    }
    const genericBooking = await booking_model_default2.aggregate([
      { $match: { _id: objectId } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "vendors",
          localField: "vendorId",
          foreignField: "_id",
          as: "vendor"
        }
      },
      { $unwind: { path: "$vendor", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "payments",
          localField: "paymentId",
          foreignField: "_id",
          as: "payment"
        }
      },
      { $unwind: { path: "$payment", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          bookingType: { $literal: "generic" },
          bookingInfo: {
            bookingId: "$_id",
            bookingReference: "$bookingReference",
            status: "$status",
            paymentStatus: "$paymentStatus",
            bookingDate: "$bookingDate",
            duration: "$duration",
            quantity: "$quantity",
            timeSlot: "$timeSlot",
            createdAt: "$createdAt",
            participants: "$participants",
            primaryCustomer: "$primaryCustomer",
            specialRequest: "$specialRequest",
            cancellation: {
              cancelledAt: "$cancelledAt",
              cancellationReason: "$cancellationReason"
            },
            refund: {
              refundStatus: "$refundStatus",
              refundAmount: "$refundAmount"
            }
          },
          user: {
            _id: "$user._id",
            name: {
              $trim: {
                input: {
                  $concat: [
                    { $ifNull: ["$user.firstName", ""] },
                    " ",
                    { $ifNull: ["$user.lastName", ""] }
                  ]
                }
              }
            },
            email: "$user.email",
            phoneNumber: "$user.phoneNumber"
          },
          service: {
            type: "$serviceType",
            serviceId: "$serviceId",
            title: "$serviceSnapshot.title",
            price: "$serviceSnapshot.price",
            extra: "$serviceSnapshot.extra",
            meta: "$meta",
            extraInfo: "$extraInfo"
          },
          vendor: {
            _id: "$vendor._id",
            propertyId: "$vendor.propertyId",
            businessName: "$vendor.businessName",
            businessEmail: "$vendor.businessEmail",
            businessPhone: "$vendor.businessPhone",
            city: "$vendor.city",
            status: "$vendor.status",
            isActive: "$vendor.isActive"
          },
          payment: {
            _id: "$payment._id",
            razorpayOrderId: "$payment.razorpayOrderId",
            razorpayPaymentId: "$payment.razorpayPaymentId",
            amountPaid: "$payment.amountPaid",
            currency: "$payment.currency",
            paymentMethod: "$payment.paymentMethod",
            status: "$payment.status",
            isVerified: "$payment.isVerified",
            refund: {
              refundAmount: "$payment.refundAmount",
              refundStatus: "$payment.refundStatus",
              refundedAt: "$payment.refundedAt"
            }
          },
          pricing: {
            baseAmount: "$pricing.baseAmount",
            taxAmount: "$pricing.taxAmount",
            taxPercentage: "$pricing.taxPercentage",
            discountAmount: "$pricing.discountAmount",
            totalAmount: "$pricing.totalAmount"
          }
        }
      }
    ]);
    if (genericBooking.length > 0) {
      return genericBooking[0];
    }
    throw new Error("Booking not found");
  } catch (error) {
    console.error("getBookingDetail error:", error);
    throw error;
  }
};
var BookingService = class {
  getBookingStats = getBookingStats;
  getAllBookings = getAllBookings;
  getBookingDetail = getBookingDetail3;
};
var bookingService = new BookingService();
var booking_service2 = {
  getBookingStats,
  getAllBookings,
  getBookingDetail: getBookingDetail3
};
var booking_service_default4 = booking_service2;

// src/modules/admin/booking/booking.controller.ts
var BookingController2 = class {
  // Get all bookings
  async getAllBookings(req, res, next) {
    try {
      const result = await booking_service_default4.getAllBookings(req.query);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger_default.error("Controller Error: getAllBookings", error);
      next(error);
    }
  }
  // Get booking detail
  async getBookingDetail(req, res, next) {
    try {
      const result = await booking_service_default4.getBookingDetail(req.params.bookingId);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger_default.error("Controller Error: getBookingDetail(Admin)", error);
      next(error);
    }
  }
  // Get booking stats
  async getBookingStats(req, res, next) {
    try {
      const result = await booking_service_default4.getBookingStats();
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger_default.error("Controller Error: getBookingStats", error);
      next(error);
    }
  }
};

// src/modules/admin/booking/booking.routes.ts
var router32 = (0, import_express32.Router)();
var bookingController5 = new BookingController2();
router32.get(
  "/stats",
  protect,
  authorize("admin"),
  bookingController5.getBookingStats
);
router32.get("/", protect, authorize("admin"), bookingController5.getAllBookings);
router32.get(
  "/:bookingId",
  protect,
  authorize("admin"),
  bookingController5.getBookingDetail
);
var booking_routes_default4 = router32;

// src/modules/admin/review/review.routes.ts
var import_express33 = require("express");

// src/modules/admin/review/review.service.ts
var getReviewStats = async () => {
  try {
    const result = await review_model_default.aggregate([
      {
        $facet: {
          totalReviews: [
            {
              $count: "count"
            }
          ],
          avgRating: [
            {
              $group: {
                _id: null,
                avg: {
                  $avg: "$rating"
                }
              }
            }
          ],
          lowRatings: [
            {
              $match: {
                rating: { $lte: 2 }
              }
            },
            {
              $count: "count"
            }
          ],
          noReply: [
            {
              $match: {
                $or: [
                  {
                    "vendorReply.message": null
                  },
                  {
                    "vendorReply.message": ""
                  }
                ]
              }
            },
            {
              $count: "count"
            }
          ],
          flaggedReviews: [
            {
              $match: {
                isFlagged: true
              }
            },
            {
              $count: "count"
            }
          ]
        }
      }
    ]);
    const stats = result[0];
    return {
      totalReviews: stats.totalReviews[0]?.count || 0,
      avgRating: Number(stats.avgRating[0]?.avg?.toFixed(1)) || 0,
      lowRatings: stats.lowRatings[0]?.count || 0,
      noReply: stats.noReply[0]?.count || 0,
      flaggedReviews: stats.flaggedReviews[0]?.count || 0
    };
  } catch (error) {
    logger_default.error("Service Error: getReviewStats", error);
    throw error;
  }
};
var getAllReviews = async (query) => {
  try {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const filter = {};
    if (query.companyType) {
      filter.companyType = query.companyType;
    }
    if (query.rating) {
      filter.rating = Number(query.rating);
    }
    if (query.isFlagged !== void 0) {
      filter.isFlagged = query.isFlagged === "true";
    }
    if (query.hasReply === "true") {
      filter["vendorReply.message"] = {
        $exists: true,
        $ne: ""
      };
    }
    if (query.hasReply === "false") {
      filter.$or = [
        { "vendorReply.message": { $exists: false } },
        { "vendorReply.message": "" }
      ];
    }
    let reviews = await review_model_default.find(filter).populate("userId", "firstName lastName email avatar").populate("vendorId", "businessName").sort({
      createdAt: -1
    }).lean();
    if (query.search?.trim()) {
      const search = query.search.trim().toLowerCase();
      reviews = reviews.filter((review) => {
        const companyName = review.companyName?.toLowerCase() || "";
        const vendorName = review.vendorId?.businessName?.toLowerCase() || "";
        const userName = `${review.userId?.firstName || ""} ${review.userId?.lastName || ""}`.toLowerCase();
        return companyName.includes(search) || vendorName.includes(search) || userName.includes(search);
      });
    }
    const total = reviews.length;
    const paginatedReviews = reviews.slice(skip, skip + limit);
    return {
      reviews: paginatedReviews.map((review) => ({
        reviewId: review._id,
        userName: `${review.userId?.firstName || ""} ${review.userId?.lastName || ""}`.trim(),
        companyName: review.companyName,
        companyType: review.companyType,
        vendorName: review.vendorId?.businessName || "",
        rating: review.rating,
        comment: review.comment?.length > 80 ? `${review.comment.substring(0, 80)}...` : review.comment,
        hasReply: Boolean(review.vendorReply?.message),
        isFlagged: review.isFlagged,
        createdAt: review.createdAt
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger_default.error("Service Error: getAllReviews", error);
    throw error;
  }
};
var getReviewDetail = async (reviewId) => {
  try {
    const review = await review_model_default.findById(reviewId).populate("userId", "firstName lastName email phoneNumber avatar").populate("vendorId", "businessName businessEmail businessPhone").lean();
    if (!review) {
      throw new Error("Review not found");
    }
    return {
      reviewId: review._id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      user: {
        id: review.userId?._id,
        firstName: review.userId?.firstName,
        lastName: review.userId?.lastName,
        email: review.userId?.email,
        phoneNumber: review.userId?.phoneNumber,
        avatar: review.userId?.avatar
      },
      company: {
        id: review.companyId,
        name: review.companyName,
        type: review.companyType
      },
      vendor: {
        id: review.vendorId?._id,
        businessName: review.vendorId?.businessName,
        businessEmail: review.vendorId?.businessEmail,
        businessPhone: review.vendorId?.businessPhone
      },
      vendorReply: {
        message: review.vendorReply?.message || "",
        repliedAt: review.vendorReply?.repliedAt || null
      },
      moderation: {
        isFlagged: review.isFlagged,
        flagReason: review.flagReason || ""
      }
    };
  } catch (error) {
    logger_default.error("Service Error: getReviewDetail", error);
    throw error;
  }
};
var flagReview = async (reviewId, body) => {
  try {
    const { isFlagged, flagReason } = body;
    if (typeof isFlagged !== "boolean") {
      throw new Error("isFlagged must be true or false");
    }
    const review = await review_model_default.findById(reviewId);
    if (!review) {
      throw new Error("Review not found");
    }
    review.isFlagged = isFlagged;
    if (isFlagged) {
      if (!flagReason?.trim()) {
        throw new Error("Flag reason is required");
      }
      review.flagReason = flagReason.trim();
    } else {
      review.flagReason = "";
    }
    await review.save();
    return {
      message: isFlagged ? "Review flagged successfully" : "Review unflagged successfully",
      review
    };
  } catch (error) {
    logger_default.error("Service Error: flagReview", error);
    throw error;
  }
};
var deleteReview = async (reviewId) => {
  try {
    const review = await review_model_default.findById(reviewId);
    if (!review) {
      throw new Error("Review not found");
    }
    const companyType = review.companyType;
    const companyId = review.companyId;
    await review.deleteOne();
    await updateCompanyRating(companyType, companyId);
    return {
      message: "Review deleted successfully"
    };
  } catch (error) {
    logger_default.error("Service Error: deleteReview", error);
    throw error;
  }
};
var ReviewService2 = class {
  getReviewStats = getReviewStats;
  getAllReviews = getAllReviews;
  getReviewDetail = getReviewDetail;
  flagReview = flagReview;
  deleteReview = deleteReview;
};
var reviewService2 = new ReviewService2();
var review_service = {
  getReviewStats,
  getAllReviews,
  getReviewDetail,
  flagReview,
  deleteReview
};
var review_service_default2 = review_service;

// src/modules/admin/review/review.controller.ts
var ReviewController2 = class {
  async getReviewStats(req, res, next) {
    try {
      const result = await review_service_default2.getReviewStats();
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger_default.error("Controller Error: getReviewStats", error);
      next(error);
    }
  }
  async getAllReviews(req, res, next) {
    try {
      const result = await review_service_default2.getAllReviews(req.query);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger_default.error("Controller Error: getAllReviews", error);
      next(error);
    }
  }
  async getReviewDetail(req, res, next) {
    try {
      const result = await review_service_default2.getReviewDetail(req.params.reviewId);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger_default.error("Controller Error: getReviewDetail", error);
      next(error);
    }
  }
  async deleteReview(req, res, next) {
    try {
      const result = await review_service_default2.deleteReview(req.params.reviewId);
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      logger_default.error("Controller Error: deleteReview", error);
      next(error);
    }
  }
  async flagReview(req, res, next) {
    try {
      const result = await review_service_default2.flagReview(
        req.params.reviewId,
        req.body
      );
      res.status(200).json({
        success: true,
        message: result.message,
        data: result.review
      });
    } catch (error) {
      logger_default.error("Controller Error: flagReview", error);
      next(error);
    }
  }
};

// src/modules/admin/review/review.routes.ts
var router33 = (0, import_express33.Router)();
var reviewController = new ReviewController2();
router33.get(
  "/stats",
  protect,
  authorize("admin"),
  reviewController.getReviewStats
);
router33.get("/", protect, authorize("admin"), reviewController.getAllReviews);
router33.get(
  "/:reviewId",
  protect,
  authorize("admin"),
  reviewController.getReviewDetail
);
router33.delete(
  "/:reviewId",
  protect,
  authorize("admin"),
  reviewController.deleteReview
);
router33.patch(
  "/:reviewId/flag",
  protect,
  authorize("admin"),
  reviewController.flagReview
);
var review_routes_default2 = router33;

// src/modules/admin/payment/payment.routes.ts
var import_express34 = require("express");

// src/modules/admin/payment/payment.service.ts
var import_mongoose48 = __toESM(require("mongoose"), 1);
init_availability_model();
var getAllPayments = async (query) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      paymentMethod,
      serviceType
    } = query;
    const skip = (page - 1) * limit;
    const matchStage = {};
    if (status) {
      matchStage.status = status;
    }
    if (paymentMethod) {
      matchStage.paymentMethod = paymentMethod;
    }
    const hotelPipeline = [
      {
        $match: matchStage
      },
      // BOOKING
      {
        $lookup: {
          from: "bookings",
          localField: "bookingId",
          foreignField: "_id",
          as: "booking"
        }
      },
      {
        $unwind: "$booking"
      },
      // USER
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      // HOTEL
      {
        $lookup: {
          from: "hotels",
          localField: "booking.hotelId",
          foreignField: "_id",
          as: "hotel"
        }
      },
      {
        $unwind: {
          path: "$hotel",
          preserveNullAndEmptyArrays: true
        }
      },
      // VENDOR
      {
        $lookup: {
          from: "vendors",
          localField: "hotel.vendorId",
          foreignField: "_id",
          as: "vendor"
        }
      },
      {
        $unwind: {
          path: "$vendor",
          preserveNullAndEmptyArrays: true
        }
      },
      // SEARCH
      ...search ? [
        {
          $match: {
            $or: [
              {
                razorpayPaymentId: {
                  $regex: search,
                  $options: "i"
                }
              },
              {
                "booking.bookingReference": {
                  $regex: search,
                  $options: "i"
                }
              },
              {
                "user.firstName": {
                  $regex: search,
                  $options: "i"
                }
              },
              {
                "user.lastName": {
                  $regex: search,
                  $options: "i"
                }
              },
              {
                "hotel.name": {
                  $regex: search,
                  $options: "i"
                }
              },
              {
                "vendor.propertyId": {
                  $regex: search,
                  $options: "i"
                }
              }
            ]
          }
        }
      ] : [],
      {
        $project: {
          _id: 1,
          paymentId: "$_id",
          bookingId: "$booking._id",
          bookingReference: "$booking.bookingReference",
          userName: {
            $trim: {
              input: {
                $concat: [
                  {
                    $ifNull: ["$user.firstName", ""]
                  },
                  " ",
                  {
                    $ifNull: ["$user.lastName", ""]
                  }
                ]
              }
            }
          },
          serviceType: {
            $literal: "hotel"
          },
          serviceName: {
            $ifNull: ["$hotel.name", "N/A"]
          },
          vendorName: {
            $ifNull: ["$vendor.businessName", "N/A"]
          },
          propertyId: {
            $ifNull: ["$vendor.propertyId", "N/A"]
          },
          amountPaid: "$amountPaid",
          paymentMethod: 1,
          paymentStatus: "$status",
          refundStatus: "$refundStatus",
          createdAt: 1
        }
      }
    ];
    const genericPipeline = [
      {
        $match: matchStage
      },
      // BOOKING
      {
        $lookup: {
          from: "genericbookings",
          localField: "bookingId",
          foreignField: "_id",
          as: "booking"
        }
      },
      {
        $unwind: "$booking"
      },
      // USER
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      // VENDOR
      {
        $lookup: {
          from: "vendors",
          localField: "booking.vendorId",
          foreignField: "_id",
          as: "vendor"
        }
      },
      {
        $unwind: {
          path: "$vendor",
          preserveNullAndEmptyArrays: true
        }
      },
      // SEARCH
      ...search ? [
        {
          $match: {
            $or: [
              {
                gatewayPaymentId: {
                  $regex: search,
                  $options: "i"
                }
              },
              {
                "booking.bookingReference": {
                  $regex: search,
                  $options: "i"
                }
              },
              {
                "user.firstName": {
                  $regex: search,
                  $options: "i"
                }
              },
              {
                "user.lastName": {
                  $regex: search,
                  $options: "i"
                }
              },
              {
                "booking.serviceSnapshot.title": {
                  $regex: search,
                  $options: "i"
                }
              },
              {
                "vendor.propertyId": {
                  $regex: search,
                  $options: "i"
                }
              }
            ]
          }
        }
      ] : [],
      {
        $project: {
          _id: 1,
          paymentId: "$_id",
          bookingId: "$booking._id",
          bookingReference: "$booking.bookingReference",
          userName: {
            $trim: {
              input: {
                $concat: [
                  {
                    $ifNull: ["$user.firstName", ""]
                  },
                  " ",
                  {
                    $ifNull: ["$user.lastName", ""]
                  }
                ]
              }
            }
          },
          serviceType: "$booking.serviceType",
          serviceName: {
            $ifNull: ["$booking.serviceSnapshot.title", "N/A"]
          },
          vendorName: {
            $ifNull: ["$vendor.businessName", "N/A"]
          },
          propertyId: {
            $ifNull: ["$vendor.propertyId", "N/A"]
          },
          amountPaid: "$amount",
          paymentMethod: 1,
          paymentStatus: "$status",
          refundStatus: "$refundStatus",
          createdAt: 1
        }
      }
    ];
    const [hotelPayments, genericPayments] = await Promise.all([
      serviceType !== "hotel" ? [] : payment_model_default.aggregate(hotelPipeline),
      serviceType === "hotel" ? [] : payment_model_default2.aggregate(genericPipeline)
    ]);
    let allPayments = [...hotelPayments, ...genericPayments];
    if (serviceType && serviceType !== "hotel") {
      allPayments = allPayments.filter((p) => p.serviceType === serviceType);
    }
    allPayments.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    const paginated = allPayments.slice(
      skip,
      skip + Number(limit)
    );
    return {
      payments: paginated,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: allPayments.length
      }
    };
  } catch (error) {
    throw error;
  }
};
var getPaymentDetail = async (paymentId) => {
  try {
    const hotelPipeline = [
      {
        $match: {
          _id: new import_mongoose48.default.Types.ObjectId(paymentId)
        }
      },
      // BOOKING
      {
        $lookup: {
          from: "bookings",
          localField: "bookingId",
          foreignField: "_id",
          as: "booking"
        }
      },
      {
        $unwind: "$booking"
      },
      // USER
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      // HOTEL
      {
        $lookup: {
          from: "hotels",
          localField: "booking.hotelId",
          foreignField: "_id",
          as: "hotel"
        }
      },
      {
        $unwind: {
          path: "$hotel",
          preserveNullAndEmptyArrays: true
        }
      },
      // VENDOR
      {
        $lookup: {
          from: "vendors",
          localField: "hotel.vendorId",
          foreignField: "_id",
          as: "vendor"
        }
      },
      {
        $unwind: {
          path: "$vendor",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          paymentType: {
            $literal: "hotel"
          },
          paymentInfo: {
            paymentId: "$_id",
            razorpayOrderId: "$razorpayOrderId",
            razorpayPaymentId: "$razorpayPaymentId",
            amountPaid: "$amountPaid",
            currency: "$currency",
            paymentMethod: "$paymentMethod",
            status: "$status",
            isVerified: "$isVerified",
            createdAt: "$createdAt"
          },
          bookingInfo: {
            bookingId: "$booking._id",
            bookingReference: "$booking.bookingReference",
            status: "$booking.status",
            checkIn: "$booking.checkIn",
            checkOut: "$booking.checkOut",
            guests: "$booking.guests",
            totalAmount: "$booking.totalAmount"
          },
          user: {
            _id: "$user._id",
            name: {
              $trim: {
                input: {
                  $concat: [
                    {
                      $ifNull: ["$user.firstName", ""]
                    },
                    " ",
                    {
                      $ifNull: ["$user.lastName", ""]
                    }
                  ]
                }
              }
            },
            email: "$user.email",
            phoneNumber: "$user.phoneNumber"
          },
          service: {
            type: "hotel",
            hotel: {
              _id: "$hotel._id",
              name: "$hotel.name",
              city: "$hotel.city",
              address: "$hotel.address",
              image: {
                $arrayElemAt: ["$hotel.images.url", 0]
              }
            }
          },
          vendor: {
            _id: "$vendor._id",
            propertyId: "$vendor.propertyId",
            businessName: "$vendor.businessName",
            businessEmail: "$vendor.businessEmail",
            businessPhone: "$vendor.businessPhone",
            city: "$vendor.city",
            status: "$vendor.status"
          },
          refund: {
            refundStatus: "$booking.refundStatus",
            refundAmount: "$booking.refundAmount",
            refundPercentage: "$booking.refundPercentage",
            cancellationReason: "$booking.cancellationReason",
            refundRequestedAt: "$booking.refundRequestedAt",
            refundedAt: "$refundedAt"
          }
        }
      }
    ];
    const genericPipeline = [
      {
        $match: {
          _id: new import_mongoose48.default.Types.ObjectId(paymentId)
        }
      },
      // BOOKING
      {
        $lookup: {
          from: "genericbookings",
          localField: "bookingId",
          foreignField: "_id",
          as: "booking"
        }
      },
      {
        $unwind: "$booking"
      },
      // USER
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      // VENDOR
      {
        $lookup: {
          from: "vendors",
          localField: "booking.vendorId",
          foreignField: "_id",
          as: "vendor"
        }
      },
      {
        $unwind: {
          path: "$vendor",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          paymentType: {
            $literal: "generic"
          },
          paymentInfo: {
            paymentId: "$_id",
            gatewayOrderId: "$gatewayOrderId",
            gatewayPaymentId: "$gatewayPaymentId",
            amountPaid: "$amount",
            currency: "$currency",
            paymentMethod: "$paymentMethod",
            status: "$status",
            isVerified: "$isVerified",
            createdAt: "$createdAt"
          },
          bookingInfo: {
            bookingId: "$booking._id",
            bookingReference: "$booking.bookingReference",
            status: "$booking.status",
            bookingDate: "$booking.bookingDate",
            duration: "$booking.duration",
            quantity: "$booking.quantity",
            totalAmount: "$booking.pricing.totalAmount"
          },
          user: {
            _id: "$user._id",
            name: {
              $trim: {
                input: {
                  $concat: [
                    {
                      $ifNull: ["$user.firstName", ""]
                    },
                    " ",
                    {
                      $ifNull: ["$user.lastName", ""]
                    }
                  ]
                }
              }
            },
            email: "$user.email",
            phoneNumber: "$user.phoneNumber"
          },
          service: {
            type: "$booking.serviceType",
            serviceId: "$booking.serviceId",
            title: "$booking.serviceSnapshot.title",
            extra: "$booking.serviceSnapshot.extra"
          },
          vendor: {
            _id: "$vendor._id",
            propertyId: "$vendor.propertyId",
            businessName: "$vendor.businessName",
            businessEmail: "$vendor.businessEmail",
            businessPhone: "$vendor.businessPhone",
            city: "$vendor.city",
            status: "$vendor.status"
          },
          refund: {
            refundStatus: "$refundStatus",
            refundAmount: "$refundAmount",
            refundedAt: "$refundedAt"
          }
        }
      }
    ];
    const [hotelPayment, genericPayment] = await Promise.all([
      payment_model_default.aggregate(hotelPipeline),
      payment_model_default2.aggregate(genericPipeline)
    ]);
    if (hotelPayment.length > 0) {
      return hotelPayment[0];
    }
    if (genericPayment.length > 0) {
      return genericPayment[0];
    }
    throw new Error("Payment not found");
  } catch (error) {
    throw error;
  }
};
var getPaymentStats = async () => {
  try {
    const todayStart = /* @__PURE__ */ new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = /* @__PURE__ */ new Date();
    todayEnd.setHours(23, 59, 59, 999);
    const hotelPipeline = [
      {
        $facet: {
          totalRevenue: [
            {
              $match: {
                status: "captured"
              }
            },
            {
              $group: {
                _id: null,
                total: {
                  $sum: "$amountPaid"
                }
              }
            }
          ],
          todaysRevenue: [
            {
              $match: {
                status: "captured",
                createdAt: {
                  $gte: todayStart,
                  $lte: todayEnd
                }
              }
            },
            {
              $group: {
                _id: null,
                total: {
                  $sum: "$amountPaid"
                }
              }
            }
          ],
          pendingPayments: [
            {
              $match: {
                status: "created"
              }
            },
            {
              $count: "count"
            }
          ],
          failedPayments: [
            {
              $match: {
                status: "failed"
              }
            },
            {
              $count: "count"
            }
          ],
          refundAmount: [
            {
              $match: {
                refundStatus: {
                  $in: ["processed", "partially_refunded"]
                }
              }
            },
            {
              $group: {
                _id: null,
                total: {
                  $sum: "$refundAmount"
                }
              }
            }
          ]
        }
      }
    ];
    const genericPipeline = [
      {
        $facet: {
          totalRevenue: [
            {
              $match: {
                status: "captured"
              }
            },
            {
              $group: {
                _id: null,
                total: {
                  $sum: "$amount"
                }
              }
            }
          ],
          todaysRevenue: [
            {
              $match: {
                status: "captured",
                createdAt: {
                  $gte: todayStart,
                  $lte: todayEnd
                }
              }
            },
            {
              $group: {
                _id: null,
                total: {
                  $sum: "$amount"
                }
              }
            }
          ],
          pendingPayments: [
            {
              $match: {
                status: "created"
              }
            },
            {
              $count: "count"
            }
          ],
          failedPayments: [
            {
              $match: {
                status: "failed"
              }
            },
            {
              $count: "count"
            }
          ],
          refundAmount: [
            {
              $match: {
                refundStatus: {
                  $in: ["processed"]
                }
              }
            },
            {
              $group: {
                _id: null,
                total: {
                  $sum: "$refundAmount"
                }
              }
            }
          ]
        }
      }
    ];
    const [hotelStats, genericStats] = await Promise.all([
      payment_model_default.aggregate(hotelPipeline),
      payment_model_default2.aggregate(genericPipeline)
    ]);
    const hotel = hotelStats[0];
    const generic = genericStats[0];
    return {
      totalRevenue: Math.floor(
        (hotel.totalRevenue[0]?.total || 0) + (generic.totalRevenue[0]?.total || 0)
      ),
      todaysRevenue: Math.floor(
        (hotel.todaysRevenue[0]?.total || 0) + (generic.todaysRevenue[0]?.total || 0)
      ),
      pendingPayments: (hotel.pendingPayments[0]?.count || 0) + (generic.pendingPayments[0]?.count || 0),
      failedPayments: (hotel.failedPayments[0]?.count || 0) + (generic.failedPayments[0]?.count || 0),
      refundAmount: Math.floor(
        (hotel.refundAmount[0]?.total || 0) + (generic.refundAmount[0]?.total || 0)
      )
    };
  } catch (error) {
    throw error;
  }
};
var getPaymentAnalytics = async (query) => {
  try {
    const { range = "7d" } = query;
    const now = /* @__PURE__ */ new Date();
    let startDate = /* @__PURE__ */ new Date();
    if (range === "7d") {
      startDate.setDate(now.getDate() - 7);
    } else if (range === "30d") {
      startDate.setDate(now.getDate() - 30);
    } else if (range === "12m") {
      startDate.setMonth(now.getMonth() - 12);
    }
    const hotelPipeline = [
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: now
          }
        }
      },
      {
        $facet: {
          // REVENUE TREND
          revenueTrend: [
            {
              $match: {
                status: "captured"
              }
            },
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$createdAt"
                  }
                },
                total: {
                  $sum: "$amountPaid"
                }
              }
            },
            {
              $sort: {
                _id: 1
              }
            }
          ],
          // PAYMENT METHODS
          paymentMethods: [
            {
              $group: {
                _id: "$paymentMethod",
                count: {
                  $sum: 1
                },
                total: {
                  $sum: "$amountPaid"
                }
              }
            }
          ],
          // STATUS DISTRIBUTION
          statusDistribution: [
            {
              $group: {
                _id: "$status",
                count: {
                  $sum: 1
                }
              }
            }
          ]
        }
      }
    ];
    const genericPipeline = [
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: now
          }
        }
      },
      {
        $facet: {
          revenueTrend: [
            {
              $match: {
                status: "captured"
              }
            },
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$createdAt"
                  }
                },
                total: {
                  $sum: "$amount"
                }
              }
            },
            {
              $sort: {
                _id: 1
              }
            }
          ],
          paymentMethods: [
            {
              $group: {
                _id: "$paymentMethod",
                count: {
                  $sum: 1
                },
                total: {
                  $sum: "$amount"
                }
              }
            }
          ],
          statusDistribution: [
            {
              $group: {
                _id: "$status",
                count: {
                  $sum: 1
                }
              }
            }
          ]
        }
      }
    ];
    const [hotelAnalytics, genericAnalytics] = await Promise.all([
      payment_model_default.aggregate(hotelPipeline),
      payment_model_default2.aggregate(genericPipeline)
    ]);
    const hotel = hotelAnalytics[0];
    const generic = genericAnalytics[0];
    const revenueMap = {};
    [...hotel.revenueTrend, ...generic.revenueTrend].forEach((item) => {
      if (!revenueMap[item._id]) {
        revenueMap[item._id] = 0;
      }
      revenueMap[item._id] += item.total;
    });
    const revenueTrend = Object.entries(revenueMap).map(([date, revenue]) => ({
      date,
      revenue
    }));
    const methodMap = {};
    [...hotel.paymentMethods, ...generic.paymentMethods].forEach(
      (item) => {
        if (!methodMap[item._id]) {
          methodMap[item._id] = {
            method: item._id,
            count: 0,
            total: 0
          };
        }
        methodMap[item._id].count += item.count;
        methodMap[item._id].total += item.total;
        methodMap[item._id].total = Math.floor(methodMap[item._id].total);
      }
    );
    const paymentMethods = Object.values(methodMap);
    const statusMap = {};
    [...hotel.statusDistribution, ...generic.statusDistribution].forEach(
      (item) => {
        if (!statusMap[item._id]) {
          statusMap[item._id] = 0;
        }
        statusMap[item._id] += item.count;
      }
    );
    const statusDistribution = Object.entries(statusMap).map(
      ([status, count]) => ({
        status,
        count
      })
    );
    return {
      revenueTrend,
      paymentMethods,
      statusDistribution
    };
  } catch (error) {
    throw error;
  }
};
var getRefundRequests = async (query) => {
  try {
    let {
      page = 1,
      limit = 10,
      search
    } = query;
    page = Number(page);
    limit = Number(limit);
    const skip = (page - 1) * limit;
    const hotelPipeline = [
      {
        $match: {
          status: "cancellation_requested",
          refundStatus: "pending"
        }
      },
      // USER
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true
        }
      },
      // HOTEL
      {
        $lookup: {
          from: "hotels",
          localField: "hotelId",
          foreignField: "_id",
          as: "hotel"
        }
      },
      {
        $unwind: {
          path: "$hotel",
          preserveNullAndEmptyArrays: true
        }
      },
      // VENDOR
      {
        $lookup: {
          from: "vendors",
          localField: "hotel.vendorId",
          foreignField: "_id",
          as: "vendor"
        }
      },
      {
        $unwind: {
          path: "$vendor",
          preserveNullAndEmptyArrays: true
        }
      },
      // PAYMENT
      {
        $lookup: {
          from: "payments",
          let: {
            bookingId: "$_id"
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$bookingId", "$$bookingId"]
                }
              }
            },
            {
              $sort: {
                createdAt: -1
              }
            },
            {
              $limit: 1
            }
          ],
          as: "payment"
        }
      },
      {
        $unwind: {
          path: "$payment",
          preserveNullAndEmptyArrays: true
        }
      },
      // SEARCH
      ...search ? [
        {
          $match: {
            $or: [
              {
                bookingReference: {
                  $regex: search,
                  $options: "i"
                }
              },
              {
                "user.firstName": {
                  $regex: search,
                  $options: "i"
                }
              },
              {
                "user.lastName": {
                  $regex: search,
                  $options: "i"
                }
              },
              {
                "user.email": {
                  $regex: search,
                  $options: "i"
                }
              },
              {
                "hotel.name": {
                  $regex: search,
                  $options: "i"
                }
              }
            ]
          }
        }
      ] : [],
      {
        $project: {
          _id: 0,
          refundType: {
            $literal: "hotel"
          },
          bookingId: "$_id",
          bookingReference: 1,
          serviceType: {
            $literal: "hotel"
          },
          userName: {
            $trim: {
              input: {
                $concat: [
                  {
                    $ifNull: ["$user.firstName", ""]
                  },
                  " ",
                  {
                    $ifNull: ["$user.lastName", ""]
                  }
                ]
              }
            }
          },
          userEmail: {
            $ifNull: ["$user.email", ""]
          },
          serviceName: {
            $ifNull: ["$hotel.name", "N/A"]
          },
          vendorName: {
            $ifNull: ["$vendor.businessName", "N/A"]
          },
          totalAmount: 1,
          refundAmount: 1,
          refundPercentage: 1,
          cancellationReason: 1,
          paymentId: "$payment._id",
          paymentMethod: "$payment.paymentMethod",
          createdAt: 1
        }
      }
    ];
    const genericPipeline = [
      {
        $match: {
          status: "cancelled",
          refundStatus: "pending"
        }
      },
      // USER
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true
        }
      },
      // VENDOR
      {
        $lookup: {
          from: "vendors",
          localField: "vendorId",
          foreignField: "_id",
          as: "vendor"
        }
      },
      {
        $unwind: {
          path: "$vendor",
          preserveNullAndEmptyArrays: true
        }
      },
      // PAYMENT
      {
        $lookup: {
          from: "genericpayments",
          let: {
            bookingId: "$_id"
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$bookingId", "$$bookingId"]
                }
              }
            },
            {
              $sort: {
                createdAt: -1
              }
            },
            {
              $limit: 1
            }
          ],
          as: "payment"
        }
      },
      {
        $unwind: {
          path: "$payment",
          preserveNullAndEmptyArrays: true
        }
      },
      // SEARCH
      ...search ? [
        {
          $match: {
            $or: [
              {
                bookingReference: {
                  $regex: search,
                  $options: "i"
                }
              },
              {
                "user.firstName": {
                  $regex: search,
                  $options: "i"
                }
              },
              {
                "user.lastName": {
                  $regex: search,
                  $options: "i"
                }
              },
              {
                "user.email": {
                  $regex: search,
                  $options: "i"
                }
              },
              {
                "serviceSnapshot.title": {
                  $regex: search,
                  $options: "i"
                }
              }
            ]
          }
        }
      ] : [],
      {
        $project: {
          _id: 0,
          refundType: {
            $literal: "generic"
          },
          bookingId: "$_id",
          bookingReference: 1,
          serviceType: 1,
          userName: {
            $trim: {
              input: {
                $concat: [
                  {
                    $ifNull: ["$user.firstName", ""]
                  },
                  " ",
                  {
                    $ifNull: ["$user.lastName", ""]
                  }
                ]
              }
            }
          },
          userEmail: {
            $ifNull: ["$user.email", ""]
          },
          serviceName: {
            $ifNull: ["$serviceSnapshot.title", "N/A"]
          },
          vendorName: {
            $ifNull: ["$vendor.businessName", "N/A"]
          },
          totalAmount: "$pricing.totalAmount",
          refundAmount: 1,
          cancellationReason: 1,
          paymentId: "$payment._id",
          paymentMethod: "$payment.paymentMethod",
          createdAt: 1
        }
      }
    ];
    const [hotelRefunds, genericRefunds] = await Promise.all([
      booking_model_default.aggregate(hotelPipeline),
      booking_model_default2.aggregate(genericPipeline)
    ]);
    const allRefunds = [...hotelRefunds, ...genericRefunds].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    const paginatedRefunds = allRefunds.slice(
      skip,
      skip + limit
    );
    return {
      refunds: paginatedRefunds,
      pagination: {
        page,
        limit,
        total: allRefunds.length,
        totalPages: Math.ceil(allRefunds.length / limit)
      }
    };
  } catch (error) {
    throw error;
  }
};
var handleRefund = async (paymentId, action) => {
  const session = await import_mongoose48.default.startSession();
  session.startTransaction();
  try {
    if (!["approve", "reject"].includes(action)) {
      throw new Error("Invalid action");
    }
    let payment = await payment_model_default.findById(paymentId).session(session);
    let booking = null;
    let isGeneric = false;
    if (!payment) {
      payment = await payment_model_default2.findById(paymentId).session(session);
      if (!payment) {
        throw new Error("Payment not found");
      }
      isGeneric = true;
    }
    if (isGeneric) {
      booking = await booking_model_default2.findById(payment.bookingId).session(
        session
      );
    } else {
      booking = await booking_model_default.findById(payment.bookingId).session(session);
    }
    if (!booking) {
      throw new Error("Booking not found");
    }
    const validHotelRefund = booking.status === "cancellation_requested" && booking.refundStatus === "pending";
    const validGenericRefund = booking.status === "cancelled" && booking.refundStatus === "pending";
    if (!validHotelRefund && !validGenericRefund) {
      throw new Error("No pending refund request");
    }
    const now = /* @__PURE__ */ new Date();
    let refundPercentage = 0;
    let refundAmount = 0;
    if (!isGeneric) {
      const daysBeforeCheckIn = Math.ceil(
        (new Date(booking.checkIn) - now) / (1e3 * 60 * 60 * 24)
      );
      const isWithin24Hours = now - new Date(booking.createdAt) <= 24 * 60 * 60 * 1e3;
      if (isWithin24Hours) {
        refundPercentage = 100;
      } else if (daysBeforeCheckIn >= 30) {
        refundPercentage = 100;
      } else if (daysBeforeCheckIn >= 15) {
        refundPercentage = 50;
      } else {
        refundPercentage = 0;
      }
      refundAmount = Math.round(booking.totalAmount * refundPercentage / 100);
    }
    if (isGeneric) {
      refundPercentage = 80;
      refundAmount = Math.round(
        booking.pricing?.totalAmount * refundPercentage / 100
      );
    }
    if (action === "approve") {
      if (payment.refundStatus === "processed") {
        throw new Error("Refund already processed");
      }
      if (!isGeneric) {
        if (!payment.razorpayPaymentId || payment.status !== "captured") {
          throw new Error("Payment not eligible for refund");
        }
      }
      if (isGeneric) {
        if (!payment.gatewayPaymentId || payment.status !== "captured") {
          throw new Error("Payment not eligible for refund");
        }
      }
      let refund = null;
      if (refundAmount > 0) {
        const paymentGatewayId = isGeneric ? payment.gatewayPaymentId : payment.razorpayPaymentId;
        refund = await razorpay_default.payments.refund(paymentGatewayId, {
          amount: refundAmount * 100
        });
      }
      if (!isGeneric) {
        for (let i = 0; i < booking.nights; i++) {
          const currentDate = new Date(
            booking.checkIn.getTime() + i * 864e5
          );
          currentDate.setHours(0, 0, 0, 0);
          await availability_model_default.findOneAndUpdate(
            {
              roomTypeId: booking.roomTypeId,
              date: currentDate
            },
            {
              $inc: {
                bookedRooms: -booking.roomsBooked
              }
            },
            {
              session
            }
          );
        }
      }
      booking.refundAmount = refundAmount;
      booking.refundStatus = refundAmount > 0 ? "processed" : "approved";
      booking.paymentStatus = refundAmount > 0 ? "refunded" : "paid";
      booking.refundProcessedAt = now;
      booking.cancelledAt = now;
      if (!isGeneric) {
        booking.status = "cancelled";
        booking.refundPercentage = refundPercentage;
      }
      if (isGeneric) {
        booking.status = "cancelled";
      }
      await booking.save({
        session
      });
      payment.refundAmount = refundAmount;
      payment.refundStatus = refundAmount > 0 ? "processed" : "none";
      if (!isGeneric) {
        if (refund) {
          payment.razorpayRefundId = refund.id;
        }
        if (refundAmount === booking.totalAmount) {
          payment.status = "refunded";
        } else if (refundAmount > 0) {
          payment.status = "partially_refunded";
        }
      }
      if (isGeneric) {
        if (refundAmount === booking.pricing?.totalAmount) {
          payment.status = "refunded";
        }
      }
      payment.refundedAt = refundAmount > 0 ? now : null;
      await payment.save({
        session
      });
      await session.commitTransaction();
      session.endSession();
      return {
        message: "Refund approved successfully",
        refundAmount,
        refundPercentage
      };
    }
    if (action === "reject") {
      if (!isGeneric) {
        booking.status = "confirmed";
      }
      if (isGeneric) {
        booking.status = "confirmed";
      }
      booking.refundStatus = "failed";
      await booking.save({
        session
      });
      await session.commitTransaction();
      session.endSession();
      return {
        message: "Refund request rejected"
      };
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
var PaymentService2 = class {
  getAllPayments = getAllPayments;
  getPaymentDetail = getPaymentDetail;
  getPaymentStats = getPaymentStats;
  getPaymentAnalytics = getPaymentAnalytics;
  getRefundRequests = getRefundRequests;
  handleRefund = handleRefund;
};
var paymentService2 = new PaymentService2();
var payment_service = {
  getAllPayments,
  getPaymentDetail,
  getPaymentStats,
  getPaymentAnalytics,
  getRefundRequests,
  handleRefund
};
var payment_service_default2 = payment_service;

// src/modules/admin/payment/payment.controller.ts
var PaymentController2 = class {
  // Get payment stats
  async getPaymentStats(req, res, next) {
    try {
      const result = await payment_service_default2.getPaymentStats();
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger_default.error("Controller Error: getPaymentStats", error);
      next(error);
    }
  }
  // Get all payments
  async getAllPayments(req, res, next) {
    try {
      const result = await payment_service_default2.getAllPayments(req.query);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger_default.error("Controller Error: getAllPayments", error);
      next(error);
    }
  }
  // Get payment detail
  async getPaymentDetail(req, res, next) {
    try {
      const result = await payment_service_default2.getPaymentDetail(req.params.paymentId);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger_default.error("Controller Error: getPaymentDetail", error);
      next(error);
    }
  }
  // Get payment analytics
  async getPaymentAnalytics(req, res, next) {
    try {
      const result = await payment_service_default2.getPaymentAnalytics(req.query);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger_default.error("Controller Error: getPaymentAnalytics", error);
      next(error);
    }
  }
  // Get refund requests
  async getRefundRequests(req, res, next) {
    try {
      const result = await payment_service_default2.getRefundRequests(req.query);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger_default.error("Controller Error: getRefundRequests", error);
      next(error);
    }
  }
  // Handle refund (approve / reject)
  async handleRefund(req, res, next) {
    try {
      const result = await payment_service_default2.handleRefund(
        req.params.paymentId,
        req.body.action
        // approve | reject
      );
      res.status(200).json({
        success: true,
        message: `Refund ${req.body.action} successfully`,
        data: result
      });
    } catch (error) {
      logger_default.error("Controller Error: handleRefund", error);
      next(error);
    }
  }
};

// src/modules/admin/payment/payment.routes.ts
var router34 = (0, import_express34.Router)();
var paymentController2 = new PaymentController2();
router34.get(
  "/stats",
  protect,
  authorize("admin"),
  paymentController2.getPaymentStats
);
router34.get(
  "/analytics",
  protect,
  authorize("admin"),
  paymentController2.getPaymentAnalytics
);
router34.get("/", protect, authorize("admin"), paymentController2.getAllPayments);
router34.get(
  "/refunds",
  protect,
  authorize("admin"),
  paymentController2.getRefundRequests
);
router34.patch(
  "/:paymentId/refund",
  protect,
  authorize("admin"),
  paymentController2.handleRefund
);
router34.get(
  "/:paymentId",
  protect,
  authorize("admin"),
  paymentController2.getPaymentDetail
);
var payment_routes_default2 = router34;

// src/modules/admin/support/support.routes.ts
var import_express35 = require("express");

// src/modules/admin/support/support.service.ts
var getAllTickets = async (query) => {
  try {
    const { page = 1, limit = 10, status, search, sort = "-createdAt" } = query;
    const skip = (page - 1) * limit;
    const matchStage = {};
    if (status) {
      matchStage.status = status;
    }
    const pipeline = [
      {
        $match: matchStage
      },
      //USER JOIN
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      //SEARCH
      ...search ? [
        {
          $match: {
            $or: [
              { subject: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
              { "user.firstName": { $regex: search, $options: "i" } }
            ]
          }
        }
      ] : [],
      {
        $project: {
          _id: 1,
          subject: 1,
          status: 1,
          bookingReference: 1,
          userName: {
            $trim: {
              input: {
                $concat: [
                  { $ifNull: ["$user.firstName", ""] },
                  " ",
                  { $ifNull: ["$user.lastName", ""] }
                ]
              }
            }
          },
          email: 1,
          phoneNumber: 1,
          lastMessageAt: 1,
          createdAt: 1
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: Number(limit) }],
          totalCount: [{ $count: "count" }]
        }
      }
    ];
    const result = await support_model_default.aggregate(pipeline);
    const tickets = result[0].data;
    const total = result[0].totalCount[0]?.count || 0;
    return {
      tickets,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total
      }
    };
  } catch (error) {
    throw error;
  }
};
var getTicketDetail2 = async (ticketId) => {
  try {
    const ticket = await support_model_default.findById(ticketId).populate("userId", "firstName lastName email phoneNumber").lean();
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    return {
      _id: ticket._id,
      subject: ticket.subject,
      status: ticket.status,
      bookingReference: ticket.bookingReference,
      createdAt: ticket.createdAt,
      //user info
      user: {
        _id: ticket.userId?._id,
        name: `${ticket.userId?.firstName || ""} ${ticket.userId?.lastName || ""}`.trim(),
        email: ticket.email,
        phoneNumber: ticket.phoneNumber
      },
      // full chat
      messages: (ticket.messages || []).map((msg) => ({
        sender: msg.sender,
        message: msg.message,
        createdAt: msg.createdAt
      }))
    };
  } catch (error) {
    throw error;
  }
};
var replyToTicket2 = async (ticketId, message) => {
  try {
    if (!message) {
      throw new Error("Message is required");
    }
    const ticket = await support_model_default.findById(ticketId);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    if (ticket.status === "closed") {
      throw new Error("Ticket is closed");
    }
    ticket.messages.push({
      sender: "admin",
      message
    });
    ticket.lastMessageAt = /* @__PURE__ */ new Date();
    if (ticket.status === "open") {
      ticket.status = "in_progress";
    }
    await ticket.save();
    return ticket;
  } catch (error) {
    throw error;
  }
};
var closeTicket = async (ticketId) => {
  try {
    const ticket = await support_model_default.findById(ticketId);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    if (ticket.status === "closed") {
      throw new Error("Ticket already closed");
    }
    ticket.status = "closed";
    ticket.closedAt = /* @__PURE__ */ new Date();
    await ticket.save();
    return ticket;
  } catch (error) {
    throw error;
  }
};
var getSupportStats = async () => {
  try {
    const stats = await support_model_default.aggregate([
      {
        $group: {
          _id: null,
          totalTickets: { $sum: 1 },
          activeTickets: {
            $sum: {
              $cond: [{ $in: ["$status", ["open", "in_progress"]] }, 1, 0]
            }
          },
          resolvedTickets: {
            $sum: {
              $cond: [{ $eq: ["$status", "resolved"] }, 1, 0]
            }
          },
          closedTickets: {
            $sum: {
              $cond: [{ $eq: ["$status", "closed"] }, 1, 0]
            }
          }
        }
      }
    ]);
    return stats[0] || {
      totalTickets: 0,
      activeTickets: 0,
      resolvedTickets: 0,
      closedTickets: 0
    };
  } catch (error) {
    throw error;
  }
};
var SupportService2 = class {
  getAllTickets = getAllTickets;
  getTicketDetail = getTicketDetail2;
  replyToTicket = replyToTicket2;
  closeTicket = closeTicket;
  getSupportStats = getSupportStats;
};
var supportService2 = new SupportService2();
var support_service = {
  getAllTickets,
  getTicketDetail: getTicketDetail2,
  replyToTicket: replyToTicket2,
  closeTicket,
  getSupportStats
};
var support_service_default2 = support_service;

// src/modules/admin/support/support.controller.ts
var SupportController2 = class {
  // Get all tickets
  async getAllTickets(req, res, next) {
    try {
      const result = await support_service_default2.getAllTickets(req.query);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger_default.error("Controller Error: getAllTickets", error);
      next(error);
    }
  }
  // Get ticket detail (admin)
  async getTicketDetail(req, res, next) {
    try {
      const ticket = await support_service_default2.getTicketDetail(req.params.ticketId);
      res.status(200).json({
        success: true,
        data: ticket
      });
    } catch (error) {
      logger_default.error("Controller Error: getTicketDetail (admin)", error);
      next(error);
    }
  }
  // Admin reply
  async replyToTicket(req, res, next) {
    try {
      const ticket = await support_service_default2.replyToTicket(
        req.params.ticketId,
        req.body.message
      );
      res.status(200).json({
        success: true,
        message: "Reply sent successfully",
        data: ticket
      });
    } catch (error) {
      logger_default.error("Controller Error: replyToTicket (admin)", error);
      next(error);
    }
  }
  // Close ticket
  async closeTicket(req, res, next) {
    try {
      const ticket = await support_service_default2.closeTicket(req.params.ticketId);
      res.status(200).json({
        success: true,
        message: "Ticket closed successfully",
        data: ticket
      });
    } catch (error) {
      logger_default.error("Controller Error: closeTicket", error);
      next(error);
    }
  }
  // Get support stats
  async getSupportStats(req, res, next) {
    try {
      const stats = await support_service_default2.getSupportStats();
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      logger_default.error("Controller Error: getSupportStats", error);
      next(error);
    }
  }
};

// src/modules/admin/support/support.routes.ts
var router35 = (0, import_express35.Router)();
var supportController2 = new SupportController2();
router35.get(
  "/stats",
  protect,
  authorize("admin"),
  supportController2.getSupportStats
);
router35.get("/", protect, authorize("admin"), supportController2.getAllTickets);
router35.get(
  "/:ticketId",
  protect,
  authorize("admin"),
  supportController2.getTicketDetail
);
router35.post(
  "/:ticketId/reply",
  protect,
  authorize("admin"),
  supportController2.replyToTicket
);
router35.patch(
  "/:ticketId/close",
  protect,
  authorize("admin"),
  supportController2.closeTicket
);
var support_routes_default2 = router35;

// src/modules/admin/dashboard/dashboard.routes.ts
var import_express36 = require("express");

// src/modules/admin/dashboard/dashboard.service.ts
var getDashboard = async ({
  bookingRange = 7,
  revenueRange = 6
} = {}) => {
  try {
    const totalUsersPromise = auth_model_default.countDocuments({
      role: "user"
    });
    const totalPropertiesPromise = Promise.all([
      hotel_model_default.countDocuments(),
      cab_model_default.countDocuments(),
      bike_model_default.countDocuments(),
      tour_model_default.countDocuments(),
      adventure_model_default.countDocuments()
    ]);
    const totalHotelBookingsPromise = booking_model_default.countDocuments();
    const totalGenericBookingsPromise = booking_model_default2.countDocuments();
    const [
      totalUsers,
      totalPropertiesRaw,
      totalHotelBookings,
      totalGenericBookings
    ] = await Promise.all([
      totalUsersPromise,
      totalPropertiesPromise,
      totalHotelBookingsPromise,
      totalGenericBookingsPromise
    ]);
    const totalProperties = totalPropertiesRaw.reduce(
      (acc, curr) => acc + curr,
      0
    );
    const totalBookings = totalHotelBookings + totalGenericBookings;
    const todayStart = /* @__PURE__ */ new Date();
    todayStart.setHours(0, 0, 0, 0);
    const [todayHotelBookings, todayGenericBookings] = await Promise.all([
      booking_model_default.countDocuments({
        createdAt: {
          $gte: todayStart
        }
      }),
      booking_model_default2.countDocuments({
        createdAt: {
          $gte: todayStart
        }
      })
    ]);
    const todayBookings = todayHotelBookings + todayGenericBookings;
    const [hotelRevenueAgg, genericRevenueAgg] = await Promise.all([
      booking_model_default.aggregate([
        {
          $match: {
            paymentStatus: "paid"
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$totalAmount"
            }
          }
        }
      ]),
      booking_model_default2.aggregate([
        {
          $match: {
            paymentStatus: "paid"
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$pricing.totalAmount"
            }
          }
        }
      ])
    ]);
    const hotelRevenue = hotelRevenueAgg[0]?.totalRevenue || 0;
    const genericRevenue = genericRevenueAgg[0]?.totalRevenue || 0;
    const totalRevenue = hotelRevenue + genericRevenue;
    const startDate = /* @__PURE__ */ new Date();
    startDate.setDate(startDate.getDate() - (bookingRange - 1));
    startDate.setHours(0, 0, 0, 0);
    const [hotelDailyRaw, genericDailyRaw] = await Promise.all([
      booking_model_default.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startDate
            }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt"
              }
            },
            count: {
              $sum: 1
            }
          }
        },
        {
          $sort: {
            _id: 1
          }
        }
      ]),
      booking_model_default2.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startDate
            }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt"
              }
            },
            count: {
              $sum: 1
            }
          }
        },
        {
          $sort: {
            _id: 1
          }
        }
      ])
    ]);
    const dailyBookings = [];
    for (let i = 0; i < bookingRange; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const formatted = date.toISOString().split("T")[0];
      const hotelFound = hotelDailyRaw.find((d) => d._id === formatted);
      const genericFound = genericDailyRaw.find((d) => d._id === formatted);
      dailyBookings.push({
        date: formatted,
        count: (hotelFound?.count || 0) + (genericFound?.count || 0)
      });
    }
    const startMonth = /* @__PURE__ */ new Date();
    startMonth.setMonth(startMonth.getMonth() - (revenueRange - 1));
    startMonth.setDate(1);
    startMonth.setHours(0, 0, 0, 0);
    const [hotelMonthlyRaw, genericMonthlyRaw] = await Promise.all([
      booking_model_default.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startMonth
            },
            paymentStatus: "paid"
          }
        },
        {
          $group: {
            _id: {
              year: {
                $year: "$createdAt"
              },
              month: {
                $month: "$createdAt"
              }
            },
            revenue: {
              $sum: "$totalAmount"
            }
          }
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1
          }
        }
      ]),
      booking_model_default2.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startMonth
            },
            paymentStatus: "paid"
          }
        },
        {
          $group: {
            _id: {
              year: {
                $year: "$createdAt"
              },
              month: {
                $month: "$createdAt"
              }
            },
            revenue: {
              $sum: "$pricing.totalAmount"
            }
          }
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1
          }
        }
      ])
    ]);
    const monthlyRevenue = [];
    for (let i = 0; i < revenueRange; i++) {
      const date = new Date(startMonth);
      date.setMonth(date.getMonth() + i);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const hotelFound = hotelMonthlyRaw.find(
        (m) => m._id.month === month && m._id.year === year
      );
      const genericFound = genericMonthlyRaw.find(
        (m) => m._id.month === month && m._id.year === year
      );
      monthlyRevenue.push({
        month: `${year}-${month.toString().padStart(2, "0")}`,
        revenue: (hotelFound?.revenue || 0) + (genericFound?.revenue || 0)
      });
    }
    const genericServiceStats = await booking_model_default2.aggregate([
      {
        $group: {
          _id: "$serviceType",
          totalBookings: {
            $sum: 1
          },
          revenue: {
            $sum: "$pricing.totalAmount"
          }
        }
      }
    ]);
    const hotelStats = await booking_model_default.aggregate([
      {
        $group: {
          _id: "hotel",
          totalBookings: {
            $sum: 1
          },
          revenue: {
            $sum: "$totalAmount"
          }
        }
      }
    ]);
    const serviceStats = [...hotelStats, ...genericServiceStats];
    return {
      stats: {
        totalUsers,
        totalProperties,
        totalBookings,
        todayBookings,
        totalRevenue
      },
      charts: {
        dailyBookings,
        monthlyRevenue
      },
      serviceStats
    };
  } catch (error) {
    throw error;
  }
};
var getRecentBookings2 = async () => {
  try {
    const hotelBookings = await booking_model_default.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $lookup: {
          from: "hotels",
          localField: "hotelId",
          foreignField: "_id",
          as: "hotel"
        }
      },
      {
        $unwind: {
          path: "$hotel",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          bookingReference: 1,
          userName: {
            $trim: {
              input: {
                $concat: [
                  {
                    $ifNull: ["$user.firstName", ""]
                  },
                  " ",
                  {
                    $ifNull: ["$user.lastName", ""]
                  }
                ]
              }
            }
          },
          propertyName: "$hotel.name",
          serviceType: {
            $literal: "hotel"
          },
          bookingDate: "$createdAt",
          amount: "$totalAmount",
          status: 1,
          createdAt: 1
        }
      }
    ]);
    const genericBookings = await booking_model_default2.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          _id: 1,
          bookingReference: 1,
          userName: {
            $trim: {
              input: {
                $concat: [
                  {
                    $ifNull: ["$user.firstName", ""]
                  },
                  " ",
                  {
                    $ifNull: ["$user.lastName", ""]
                  }
                ]
              }
            }
          },
          propertyName: "$serviceSnapshot.title",
          serviceType: 1,
          bookingDate: "$bookingDate",
          amount: "$pricing.totalAmount",
          status: 1,
          createdAt: 1
        }
      }
    ]);
    const combinedBookings = [...hotelBookings, ...genericBookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);
    return combinedBookings;
  } catch (error) {
    throw error;
  }
};
var DashboardService = class {
  getDashboard = getDashboard;
  getRecentBookings = getRecentBookings2;
};
var dashboardService = new DashboardService();
var dashboard_service = {
  getDashboard,
  getRecentBookings: getRecentBookings2
};
var dashboard_service_default2 = dashboard_service;

// src/modules/admin/dashboard/dashboard.controller.ts
var DashboardController = class {
  //dashboard card and charts with filter days
  async getDashboard(req, res, next) {
    try {
      let bookingRange = Number(req.query.bookingRange);
      let revenueRange = Number(req.query.revenueRange);
      const allowedBooking = [7, 15, 30];
      const allowedRevenue = [3, 6, 12];
      if (!allowedBooking.includes(bookingRange)) {
        bookingRange = 7;
      }
      if (!allowedRevenue.includes(revenueRange)) {
        revenueRange = 6;
      }
      const data = await dashboard_service_default2.getDashboard({
        bookingRange,
        revenueRange
      });
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      logger_default.error("Controller Error: getDashboard", error);
      next(error);
    }
  }
  //Get recent bookings
  async getRecentBookings(req, res, next) {
    try {
      const result = await dashboard_service_default2.getRecentBookings();
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger_default.error("Controller Error: getRecentBookings", error);
      next(error);
    }
  }
};

// src/modules/admin/dashboard/dashboard.routes.ts
var router36 = (0, import_express36.Router)();
var dashboardController2 = new DashboardController();
router36.get("/", protect, authorize("admin"), dashboardController2.getDashboard);
router36.get(
  "/recent-bookings",
  protect,
  authorize("admin"),
  dashboardController2.getRecentBookings
);
var dashboard_routes_default2 = router36;

// src/modules/admin/tax/tax.routes.ts
var import_express37 = require("express");

// src/modules/admin/tax/tax.service.ts
var setTax = async (userId, taxPercentage) => {
  if (taxPercentage < 0 || taxPercentage > 100) {
    throw new Error("Invalid tax percentage");
  }
  await tax_model_default.updateMany({ isActive: true }, { isActive: false });
  const tax = await tax_model_default.create({
    taxPercentage,
    isActive: true,
    createdBy: userId
  });
  return tax;
};
var getActiveTax = async () => {
  const tax = await tax_model_default.findOne({ isActive: true });
  if (!tax) {
    throw new Error("No active tax found");
  }
  return tax;
};
var TaxService = class {
  setTax = setTax;
  getActiveTax = getActiveTax;
};
var taxService = new TaxService();
var tax_service = {
  setTax,
  getActiveTax
};
var tax_service_default = tax_service;

// src/modules/admin/tax/tax.controller.ts
var TaxController = class {
  async setTax(req, res, next) {
    try {
      const userId = req.user._id;
      const { taxPercentage } = req.body;
      const tax = await tax_service_default.setTax(userId, taxPercentage);
      res.status(200).json({
        success: true,
        message: "Tax updated successfully",
        data: tax
      });
    } catch (error) {
      next(error);
    }
  }
  async getActiveTax(req, res, next) {
    try {
      const tax = await tax_service_default.getActiveTax();
      res.status(200).json({
        success: true,
        data: tax
      });
    } catch (error) {
      next(error);
    }
  }
};

// src/modules/admin/tax/tax.routes.ts
var router37 = (0, import_express37.Router)();
var taxController = new TaxController();
router37.post("/set-tax", protect, authorize("admin"), taxController.setTax);
router37.get("/active", taxController.getActiveTax);
var tax_routes_default = router37;

// src/modules/admin/account-deactivate/account.routes.ts
var import_express38 = require("express");

// src/modules/admin/account-deactivate/account.service.ts
var import_mongoose49 = __toESM(require("mongoose"), 1);
var getDeleteRequests = async (query) => {
  try {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;
    const matchStage = {
      role: "user",
      "deleteRequest.status": "pending"
    };
    const pipeline = [
      {
        $match: matchStage
      },
      ...search ? [
        {
          $match: {
            $or: [
              {
                firstName: {
                  $regex: search,
                  $options: "i"
                }
              },
              {
                lastName: {
                  $regex: search,
                  $options: "i"
                }
              },
              {
                email: {
                  $regex: search,
                  $options: "i"
                }
              },
              {
                phoneNumber: {
                  $regex: search,
                  $options: "i"
                }
              }
            ]
          }
        }
      ] : [],
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "userId",
          as: "hotelBookings"
        }
      },
      {
        $lookup: {
          from: "genericbookings",
          localField: "_id",
          foreignField: "userId",
          as: "genericBookings"
        }
      },
      {
        $addFields: {
          totalBookings: {
            $add: [{ $size: "$hotelBookings" }, { $size: "$genericBookings" }]
          }
        }
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
          phoneNumber: 1,
          avatar: 1,
          totalBookings: 1,
          deleteRequest: 1
        }
      },
      {
        $sort: {
          "deleteRequest.requestedAt": -1
        }
      },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: Number(limit) }],
          totalCount: [
            {
              $count: "count"
            }
          ]
        }
      }
    ];
    const result = await auth_model_default.aggregate(pipeline);
    return {
      requests: result[0].data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: result[0].totalCount[0]?.count || 0
      }
    };
  } catch (error) {
    logger_default.error("Service Error: getDeleteRequests", error);
    throw error;
  }
};
var approveDeleteRequest = async (userId) => {
  const session = await import_mongoose49.default.startSession();
  try {
    session.startTransaction();
    if (!import_mongoose49.default.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID format");
    }
    const user = await auth_model_default.findOne({
      _id: userId,
      role: "user",
      "deleteRequest.status": "pending"
    }).session(session);
    if (!user) {
      throw new Error("Pending account deletion request not found");
    }
    const email = user.email;
    const phone = user.phoneNumber;
    const firstName = user.firstName;
    await booking_model_default.updateMany(
      {
        userId: user._id
      },
      {
        $set: {
          userId: null
        }
      },
      {
        session
      }
    );
    await booking_model_default2.updateMany(
      {
        userId: user._id
      },
      {
        $set: {
          userId: null
        }
      },
      {
        session
      }
    );
    await auth_model_default.deleteOne(
      {
        _id: user._id
      },
      {
        session
      }
    );
    await session.commitTransaction();
    Promise.allSettled([
      sendAccountDeletionApprovedEmail(email || "", firstName || ""),
      sendAccountDeletionApprovedWhatsApp(phone || "", firstName || "")
    ]).catch((err) => {
      logger_default.error(
        "Failed to send account deletion approval notifications",
        err
      );
    });
    return {
      success: true,
      message: "User account deleted successfully"
    };
  } catch (error) {
    await session.abortTransaction();
    logger_default.error("Service Error: approveDeleteRequest", error);
    throw error;
  } finally {
    session.endSession();
  }
};
var rejectDeleteRequest = async (userId) => {
  try {
    if (!import_mongoose49.default.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID format");
    }
    const user = await auth_model_default.findOne({
      _id: userId,
      role: "user",
      "deleteRequest.status": "pending"
    });
    if (!user) {
      throw new Error("Pending account deletion request not found");
    }
    user.deleteRequest = {
      status: "none",
      requestedAt: void 0,
      reason: ""
    };
    await user.save();
    Promise.allSettled([
      sendAccountDeletionRejectedEmail(user.email || "", user.firstName || ""),
      sendAccountDeletionRejectedWhatsApp(user.phoneNumber || "", user.firstName || "")
    ]).catch((err) => {
      logger_default.error(
        "Failed to send account deletion rejection notifications",
        err
      );
    });
    return {
      success: true,
      message: "Account deletion request rejected successfully"
    };
  } catch (error) {
    logger_default.error("Service Error: rejectDeleteRequest", error);
    throw error;
  }
};
var AccountService = class {
  getDeleteRequests = getDeleteRequests;
  approveDeleteRequest = approveDeleteRequest;
  rejectDeleteRequest = rejectDeleteRequest;
};
var accountService = new AccountService();
var account_service = {
  getDeleteRequests,
  approveDeleteRequest,
  rejectDeleteRequest
};
var account_service_default = account_service;

// src/modules/admin/account-deactivate/account.controller.ts
var AccountController = class {
  async getDeleteRequests(req, res, next) {
    try {
      const result = await account_service_default.getDeleteRequests(req.query);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger_default.error("Controller Error: getDeleteRequests", error);
      next(error);
    }
  }
  async approveDeleteRequest(req, res, next) {
    try {
      const result = await account_service_default.approveDeleteRequest(
        req.params.userId
      );
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      logger_default.error("Controller Error: approveDeleteRequest", error);
      next(error);
    }
  }
  async rejectDeleteRequest(req, res, next) {
    try {
      const result = await account_service_default.rejectDeleteRequest(
        req.params.userId
      );
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      logger_default.error("Controller Error: rejectDeleteRequest", error);
      next(error);
    }
  }
};

// src/modules/admin/account-deactivate/account.routes.ts
var router38 = (0, import_express38.Router)();
var accountController = new AccountController();
router38.get(
  "/delete-requests",
  protect,
  authorize("admin"),
  accountController.getDeleteRequests
);
router38.patch(
  "/:userId/approve-delete",
  protect,
  authorize("admin"),
  accountController.approveDeleteRequest
);
router38.patch(
  "/:userId/reject-delete",
  protect,
  authorize("admin"),
  accountController.rejectDeleteRequest
);
var account_routes_default = router38;

// src/modules/admin/promotion/promotion.routes.ts
var import_express39 = require("express");

// src/modules/admin/promotion/promotion.service.ts
var SERVICE_MODELS4 = {
  hotel: hotel_model_default,
  cab: cab_model_default,
  bike: bike_model_default,
  tour: tour_model_default,
  adventure: adventure_model_default
};
var getAllPromotionRequests = async () => {
  try {
    const requests = await promotion_model_default.find().populate({
      path: "vendorId",
      populate: {
        path: "userId",
        select: "firstName lastName email"
      },
      select: "businessName businessEmail businessPhone businessAddress city state status userId propertyId"
    }).sort({ createdAt: -1 }).lean();
    const formatted = requests.map((req) => {
      const vendor = req.vendorId || {};
      const user = vendor.userId || {};
      return {
        id: req._id,
        vendorName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        vendorEmail: user.email || "",
        propertyId: vendor.propertyId || "",
        companyName: vendor.businessName || "",
        area: `${vendor.city || ""}, ${vendor.state || ""}`.trim().replace(/^,|,$/g, "") || vendor.businessAddress || "",
        phoneNumber: vendor.businessPhone || "",
        email: vendor.businessEmail || "",
        plan: req.plan,
        status: req.status,
        rankAssigned: req.rankAssigned,
        startDate: req.startDate || req.approvedAt || req.createdAt,
        endDate: req.endDate || null,
        serviceType: req.serviceType,
        serviceId: req.serviceId,
        vendorId: vendor._id || req.vendorId,
        createdAt: req.createdAt,
        approvedAt: req.approvedAt
      };
    });
    return formatted;
  } catch (error) {
    logger_default.error("Service Error: getAllPromotionRequests", error);
    throw error;
  }
};
var approvePromotion = async (promotionId, adminUserId, rank, startDate, endDate) => {
  try {
    const promotion = await promotion_model_default.findById(promotionId);
    if (!promotion) {
      throw new Error("Promotion request not found");
    }
    promotion.status = "approved";
    promotion.rankAssigned = rank;
    promotion.approvedBy = adminUserId;
    promotion.approvedAt = /* @__PURE__ */ new Date();
    if (startDate) promotion.startDate = new Date(startDate);
    if (endDate) promotion.endDate = new Date(endDate);
    await promotion.save();
    const ServiceModel = SERVICE_MODELS4[promotion.serviceType];
    if (ServiceModel) {
      await ServiceModel.findByIdAndUpdate(promotion.serviceId, { rank });
    }
    return promotion;
  } catch (error) {
    logger_default.error("Service Error: approvePromotion", error);
    throw error;
  }
};
var assignPropertyPromotion = async ({
  vendorId,
  serviceType,
  serviceId,
  rank,
  startDate,
  endDate,
  adminUserId
}) => {
  try {
    if (!["A", "B", "C"].includes(rank)) {
      throw new Error("Invalid rank. Must be A, B, or C");
    }
    let promotion = await promotion_model_default.findOne({
      serviceId,
      status: { $in: ["approved", "pending"] }
    });
    if (promotion) {
      promotion.status = "approved";
      promotion.rankAssigned = rank;
      promotion.plan = promotion.plan || "Admin";
      promotion.startDate = startDate ? new Date(startDate) : /* @__PURE__ */ new Date();
      promotion.endDate = endDate ? new Date(endDate) : null;
      promotion.approvedBy = adminUserId;
      promotion.approvedAt = /* @__PURE__ */ new Date();
      await promotion.save();
    } else {
      promotion = await promotion_model_default.create({
        vendorId,
        serviceType,
        serviceId,
        plan: "Admin",
        status: "approved",
        rankAssigned: rank,
        startDate: startDate ? new Date(startDate) : /* @__PURE__ */ new Date(),
        endDate: endDate ? new Date(endDate) : null,
        approvedBy: adminUserId,
        approvedAt: /* @__PURE__ */ new Date()
      });
    }
    const ServiceModel = SERVICE_MODELS4[serviceType];
    if (ServiceModel && serviceId) {
      await ServiceModel.findByIdAndUpdate(serviceId, { rank });
    }
    return promotion;
  } catch (error) {
    logger_default.error("Service Error: assignPropertyPromotion", error);
    throw error;
  }
};
var updatePromotionRank = async (promotionId, rank) => {
  try {
    if (!["A", "B", "C"].includes(rank)) {
      throw new Error("Invalid rank value. Must be A, B, or C");
    }
    const promotion = await promotion_model_default.findById(promotionId);
    if (!promotion) {
      throw new Error("Promotion not found");
    }
    promotion.rankAssigned = rank;
    promotion.status = "approved";
    await promotion.save();
    const ServiceModel = SERVICE_MODELS4[promotion.serviceType];
    if (ServiceModel && promotion.serviceId) {
      await ServiceModel.findByIdAndUpdate(promotion.serviceId, { rank });
    }
    return promotion;
  } catch (error) {
    logger_default.error("Service Error: updatePromotionRank", error);
    throw error;
  }
};
var updatePromotionDuration = async (promotionId, startDate, endDate) => {
  try {
    const promotion = await promotion_model_default.findById(promotionId);
    if (!promotion) {
      throw new Error("Promotion not found");
    }
    if (startDate) promotion.startDate = new Date(startDate);
    if (endDate !== void 0) {
      promotion.endDate = endDate ? new Date(endDate) : null;
    }
    await promotion.save();
    return promotion;
  } catch (error) {
    logger_default.error("Service Error: updatePromotionDuration", error);
    throw error;
  }
};
var removePromotion = async (promotionId) => {
  try {
    const promotion = await promotion_model_default.findById(promotionId);
    if (!promotion) {
      throw new Error("Promotion not found");
    }
    const oldServiceId = promotion.serviceId;
    const oldServiceType = promotion.serviceType;
    promotion.status = "rejected";
    promotion.rankAssigned = null;
    await promotion.save();
    const ServiceModel = SERVICE_MODELS4[oldServiceType];
    if (ServiceModel && oldServiceId) {
      await ServiceModel.findByIdAndUpdate(oldServiceId, { rank: "C" });
    }
    return promotion;
  } catch (error) {
    logger_default.error("Service Error: removePromotion", error);
    throw error;
  }
};
var PromotionService = class {
  getAllPromotionRequests = getAllPromotionRequests;
  approvePromotion = approvePromotion;
  assignPropertyPromotion = assignPropertyPromotion;
  updatePromotionRank = updatePromotionRank;
  updatePromotionDuration = updatePromotionDuration;
  removePromotion = removePromotion;
};
var promotionService = new PromotionService();
var promotion_service = {
  getAllPromotionRequests,
  approvePromotion,
  assignPropertyPromotion,
  updatePromotionRank,
  updatePromotionDuration,
  removePromotion
};
var promotion_service_default = promotion_service;

// src/modules/admin/promotion/promotion.controller.ts
var PromotionController = class {
  async getAllPromotionRequests(req, res, next) {
    try {
      const data = await promotion_service_default.getAllPromotionRequests();
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      logger_default.error("Controller Error: getAllPromotionRequests", error);
      next(error);
    }
  }
  async approvePromotion(req, res, next) {
    try {
      const { id } = req.params;
      const { rank, startDate, endDate } = req.body;
      const adminUserId = req.user._id;
      if (!rank) {
        res.status(400).json({
          success: false,
          message: "Rank is required"
        });
        return;
      }
      const validRanks = ["A", "B", "C"];
      if (!validRanks.includes(rank)) {
        res.status(400).json({
          success: false,
          message: "Invalid rank. Choose between A, B, or C"
        });
        return;
      }
      const data = await promotion_service_default.approvePromotion(
        id,
        adminUserId,
        rank,
        startDate,
        endDate
      );
      res.status(200).json({
        success: true,
        message: "Promotion approved and rank assigned successfully",
        data
      });
    } catch (error) {
      logger_default.error("Controller Error: approvePromotion", error);
      next(error);
    }
  }
  async assignPropertyPromotion(req, res, next) {
    try {
      const { vendorId, serviceType, serviceId, rank, startDate, endDate } = req.body;
      const adminUserId = req.user._id;
      if (!vendorId || !serviceType || !serviceId || !rank) {
        res.status(400).json({
          success: false,
          message: "vendorId, serviceType, serviceId, and rank are required"
        });
        return;
      }
      const data = await promotion_service_default.assignPropertyPromotion({
        vendorId,
        serviceType,
        serviceId,
        rank,
        startDate,
        endDate,
        adminUserId
      });
      res.status(200).json({
        success: true,
        message: `Property promoted with Rank ${rank} successfully`,
        data
      });
    } catch (error) {
      logger_default.error("Controller Error: assignPropertyPromotion", error);
      next(error);
    }
  }
  async updatePromotionRank(req, res, next) {
    try {
      const { id } = req.params;
      const { rank } = req.body;
      if (!rank || !["A", "B", "C"].includes(rank)) {
        res.status(400).json({
          success: false,
          message: "Valid rank (A, B, or C) is required"
        });
        return;
      }
      const data = await promotion_service_default.updatePromotionRank(id, rank);
      res.status(200).json({
        success: true,
        message: `Promotion rank updated to ${rank}`,
        data
      });
    } catch (error) {
      logger_default.error("Controller Error: updatePromotionRank", error);
      next(error);
    }
  }
  async updatePromotionDuration(req, res, next) {
    try {
      const { id } = req.params;
      const { startDate, endDate } = req.body;
      const data = await promotion_service_default.updatePromotionDuration(
        id,
        startDate,
        endDate
      );
      res.status(200).json({
        success: true,
        message: "Promotion duration updated successfully",
        data
      });
    } catch (error) {
      logger_default.error("Controller Error: updatePromotionDuration", error);
      next(error);
    }
  }
  async removePromotion(req, res, next) {
    try {
      const { id } = req.params;
      const data = await promotion_service_default.removePromotion(id);
      res.status(200).json({
        success: true,
        message: "Promotion and rank removed successfully",
        data
      });
    } catch (error) {
      logger_default.error("Controller Error: removePromotion", error);
      next(error);
    }
  }
};

// src/modules/admin/promotion/promotion.routes.ts
var router39 = (0, import_express39.Router)();
var promotionController = new PromotionController();
router39.get(
  "/",
  protect,
  authorize("admin"),
  promotionController.getAllPromotionRequests
);
router39.post(
  "/assign",
  protect,
  authorize("admin"),
  promotionController.assignPropertyPromotion
);
router39.patch(
  "/:id/approve",
  protect,
  authorize("admin"),
  promotionController.approvePromotion
);
router39.patch(
  "/:id/rank",
  protect,
  authorize("admin"),
  promotionController.updatePromotionRank
);
router39.patch(
  "/:id/duration",
  protect,
  authorize("admin"),
  promotionController.updatePromotionDuration
);
router39.patch(
  "/:id/remove",
  protect,
  authorize("admin"),
  promotionController.removePromotion
);
router39.delete(
  "/:id",
  protect,
  authorize("admin"),
  promotionController.removePromotion
);
var promotion_routes_default = router39;

// src/shared/middlewares/errorHandler.ts
var errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || err.error?.description || err.description || (typeof err === "string" ? err : null) || "Server Error";
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors || {}).map((val) => val.message).join(", ") || err.message;
  }
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ID format for ${err.path || "resource"}`;
  }
  logger_default.error(message, { stack: err.stack, error: err.error || err });
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack
  });
};

// src/app.ts
var app = (0, import_express40.default)();
var allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  process.env.FRONTEND_URL,
  process.env.VENDOR_URL,
  process.env.ADMIN_URL
].filter(Boolean);
app.use(
  (0, import_cors.default)({
    origin: function(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app") || origin.includes("trivllo.com") || origin.includes("localhost") || origin.includes("127.0.0.1")) {
        callback(null, true);
      } else if (process.env.NODE_ENV !== "production") {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "Cache-Control",
      "X-CSRF-Token"
    ],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 86400
    // Cache preflight response for 24 hours
  })
);
app.use(
  (0, import_helmet.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "unsafe-none" },
    crossOriginEmbedderPolicy: false
  })
);
var limiter = (0, import_express_rate_limit2.default)({
  windowMs: 15 * 60 * 1e3,
  max: 2e3,
  // Reasonable limit for busy single-page apps
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false
});
app.use("/api", limiter);
app.use(import_express40.default.json({ limit: "10kb" }));
app.use(import_passport3.default.initialize());
if (process.env.NODE_ENV === "development") {
  app.use((0, import_morgan.default)("dev"));
}
app.get(
  "/",
  (_req, res) => res.status(200).send("Backend is running...")
);
app.use("/api/v1/auth", auth_routes_default);
app.use("/api/v1/users", user_routes_default);
app.use("/api/v1/hotels", hotel_routes_default);
app.use("/api/v1/rooms", room_routes_default);
app.use("/api/v1/room-types", roomType_routes_default);
app.use("/api/v1/availability", availability_routes_default);
app.use("/api/v1/vendors", vendor_routes_default);
app.use("/api/v1/policies", policy_routes_default);
app.use("/api/v1/bookings", booking_routes_default);
app.use("/api/v1/payments", payment_routes_default);
app.use("/api/v1/reviews", review_routes_default);
app.use("/api/v1/uploads", upload_routes_default);
app.use("/api/v1/favorites", favorite_routes_default);
app.use("/api/v1/vendor-bank", bank_routes_default);
app.use("/api/v1/supports", support_routes_default);
app.use("/api/v1/adventures", adventure_routes_default);
app.use("/api/v1/services", service_routes_default);
app.use("/api/v1/cabs", cab_routes_default);
app.use("/api/v1/cab-services", cabService_routes_default);
app.use("/api/v1/bikes", bike_routes_default);
app.use("/api/v1/bike-services", bikeService_routes_default);
app.use("/api/v1/tours", tour_routes_default);
app.use("/api/v1/tour-services", tourService_routes_default);
app.use("/api/v1/service-bookings", booking_routes_default2);
app.use("/api/v1/multi-service-vendor", vendor_routes_default2);
app.use("/api/v1/vendor-accounts", accountGroup_routes_default);
app.use("/api/v1/admin/dashboard", dashboard_routes_default2);
app.use("/api/v1/admin/property", property_routes_default);
app.use("/api/v1/admin/users", user_routes_default2);
app.use("/api/v1/admin/bookings", booking_routes_default4);
app.use("/api/v1/admin/reviews", review_routes_default2);
app.use("/api/v1/admin/payments", payment_routes_default2);
app.use("/api/v1/admin/supports", support_routes_default2);
app.use("/api/v1/admin/tax", tax_routes_default);
app.use("/api/v1/admin/account-deactivate", account_routes_default);
app.use("/api/v1/admin/promotions", promotion_routes_default);
app.use(errorHandler);
var app_default = app;

// src/serverless.ts
var isDbConnected = false;
async function handler(req, res) {
  if (!isDbConnected) {
    await db_default();
    isDbConnected = true;
  }
  return app_default(req, res);
}
