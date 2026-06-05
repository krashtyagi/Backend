const Vendor = require("../vendors/vendor.model");
const taskService = require("../task/task.service");

exports.getTasks = async (req, res, next) => {
  const vendor = await Vendor.findOne({ userId: req.user._id });
  const result = await taskService.getTasks(vendor._id, req.query);

  res.status(200).json({ success: true, ...result });
};

exports.createTask = async (req, res) => {
  const vendor = await Vendor.findOne({ userId: req.user._id });
  const task = await taskService.createTask(vendor._id, req.body);

  res.status(201).json({ success: true, data: task });
};

exports.updateTask = async (req, res) => {
  const vendor = await Vendor.findOne({ userId: req.user._id });
  const task = await taskService.updateTask(
    req.params.id,
    vendor._id,
    req.body,
  );

  res.status(200).json({ success: true, data: task });
};

exports.deleteTask = async (req, res) => {
  const vendor = await Vendor.findOne({ userId: req.user._id });
  await taskService.deleteTask(req.params.id, vendor._id);

  res.status(200).json({ success: true, message: "Task deleted" });
};
