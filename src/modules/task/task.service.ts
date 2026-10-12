import Task from "./task.model.js";
import mongoose from "mongoose";

// get tasks
export const getTasks = async (vendorId: any, query: any = {}) => {
  const { page = 1, limit = 10, status } = query;

  const filter: any = { vendorId };
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);

  const tasks = await Task.find(filter)
    .sort("-createdAt")
    .skip(skip)
    .limit(Number(limit))
    .lean();

  const total = await Task.countDocuments(filter);

  return {
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    data: tasks,
  };
};

// create task
export const createTask = async (vendorId: any, data: any) => {
  return await Task.create({ ...data, vendorId });
};

// update task
export const updateTask = async (taskId: any, vendorId: any, data: any) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new Error("Invalid task id");
  }

  const task = await Task.findOneAndUpdate({ _id: taskId, vendorId }, data, {
    new: true,
  });

  if (!task) throw new Error("Task not found");

  return task;
};

// delete task
export const deleteTask = async (taskId: any, vendorId: any) => {
  const task = await Task.findOneAndDelete({ _id: taskId, vendorId });
  if (!task) throw new Error("Task not found");
  return task;
};

export class TaskService {
  async getTasks(vendorId: any, query: any = {}) {
    return getTasks(vendorId, query);
  }

  async createTask(vendorId: any, data: any) {
    return createTask(vendorId, data);
  }

  async updateTask(taskId: any, vendorId: any, data: any) {
    return updateTask(taskId, vendorId, data);
  }

  async deleteTask(taskId: any, vendorId: any) {
    return deleteTask(taskId, vendorId);
  }
}

export const taskService = new TaskService();

export default taskService;

