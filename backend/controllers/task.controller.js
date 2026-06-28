import mongoose from 'mongoose';
import { z } from 'zod';
import Task from '../models/task.model.js';

// Zod schemas for validation
const taskCreateSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(1, { message: 'Title cannot be empty' })
    .max(100, { message: 'Title must be less than 100 characters' }),
  description: z
    .string({ required_error: 'Description is required' })
    .trim()
    .min(1, { message: 'Description cannot be empty' })
    .max(1000, { message: 'Description must be less than 1000 characters' }),
  status: z
    .enum(['Pending', 'In Progress', 'Completed'], {
      errorMap: () => ({ message: 'Status must be one of: Pending, In Progress, Completed' }),
    })
    .default('Pending'),
});

const taskUpdateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: 'Title cannot be empty' })
    .max(100, { message: 'Title must be less than 100 characters' })
    .optional(),
  description: z
    .string()
    .trim()
    .min(1, { message: 'Description cannot be empty' })
    .max(1000, { message: 'Description must be less than 1000 characters' })
    .optional(),
  status: z
    .enum(['Pending', 'In Progress', 'Completed'], {
      errorMap: () => ({ message: 'Status must be one of: Pending, In Progress, Completed' }),
    })
    .optional(),
});

// Helper for validating MongoDB Object IDs
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * @desc Get all tasks
 * @route GET /api/tasks
 */
export const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Create a new task
 * @route POST /api/tasks
 */
export const createTask = async (req, res, next) => {
  try {
    const validatedBody = taskCreateSchema.safeParse(req.body);

    if (!validatedBody.success) {
      const errorMessages = validatedBody.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorMessages,
      });
    }

    const newTask = new Task(validatedBody.data);
    const savedTask = await newTask.save();

    res.status(201).json({ success: true, data: savedTask });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update a task
 * @route PUT /api/tasks/:id
 */
export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Task ID format' });
    }

    const validatedBody = taskUpdateSchema.safeParse(req.body);

    if (!validatedBody.success) {
      const errorMessages = validatedBody.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorMessages,
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Merge changes
    Object.assign(task, validatedBody.data);
    const updatedTask = await task.save();

    res.status(200).json({ success: true, data: updatedTask });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete a task
 * @route DELETE /api/tasks/:id
 */
export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Task ID format' });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    await task.deleteOne();

    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};
