const Task = require("./task.model");
const mongoose = require("mongoose");

//get tasks
exports.getTasks = async (vendorId, query) => {
  const { page = 1, limit = 10, status } = query;

  const filter = { vendorId };
  if (status) filter.status = status;

  const skip = (page - 1) * limit;

  const tasks = await Task.find(filter)
    .sort("-createdAt")
    .skip(skip)
    .limit(Number(limit))
    .lean();

  const total = await Task.countDocuments(filter);

  return {
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    data: tasks,
  };
};

//create task
exports.createTask = async (vendorId, data) => {
  return await Task.create({ ...data, vendorId });
};

//update task
exports.updateTask = async (taskId, vendorId, data) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new Error("Invalid task id");
  }

  const task = await Task.findOneAndUpdate({ _id: taskId, vendorId }, data, {
    new: true,
  });

  if (!task) throw new Error("Task not found");

  return task;
};

//delete task
exports.deleteTask = async (taskId, vendorId) => {
  const task = await Task.findOneAndDelete({ _id: taskId, vendorId });
  if (!task) throw new Error("Task not found");
};
