// const invoiceService = require("./invoice.service");
// const Vendor = require("../../vendors/vendor.model");
// const logger = require("../../../shared/utils/logger");

// exports.getVendorInvoiceList = async (req, res, next) => {
//   try {
//     const vendorId = req.user._id;

//     const result = await invoiceService.getVendorInvoiceList(
//       req.query,
//       vendorId
//     );

//     res.status(200).json({
//       success: true,
//       ...result,
//     });
//   } catch (error) {
//     logger.error("Controller Error: getVendorInvoices", error);
//     next(error);
//   }
// };

// exports.downloadInvoicePdf = async (req, res, next) => {
//   try {
//     const vendor = await Vendor.findOne({ userId: req.user._id });

//     if (!vendor || vendor.status !== "approved") {
//       return res.status(403).json({
//         success: false,
//         message: "Vendor not authorized",
//       });
//     }

//     await invoiceService.generateInvoicePdf(
//       req.params.bookingId,
//       vendor._id,
//       res
//     );
//   } catch (error) {
//     logger.error("Download Invoice Error:", error);
//     next(error);
//   }
// };

const invoiceService = require("./invoice.service");
const Vendor = require("../../vendors/vendor.model");
const logger = require("../../../shared/utils/logger");

exports.getVendorInvoiceList = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });

    if (!vendor) {
      throw new Error("Vendor not found");
    }

    const result = await invoiceService.getVendorInvoiceList(req.query, vendor);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    logger.error("Controller Error: getVendorInvoices", error);
    next(error);
  }
};

exports.downloadInvoicePdf = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });

    if (!vendor || vendor.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Vendor not authorized",
      });
    }

    await invoiceService.generateInvoicePdf(req.params.bookingId, vendor, res);
  } catch (error) {
    logger.error("Download Invoice Error:", error);
    next(error);
  }
};
