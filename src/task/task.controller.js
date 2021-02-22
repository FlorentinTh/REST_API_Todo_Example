import httpStatus from 'http-status';
import { validationResult } from 'express-validator';

import Task from './task.model';
import ApiError from '../utils/api.error';

class TaskController {
  async getTasks(req, res, next) {
    try {
      const tasks = await Task.find().exec();

      if (!tasks) {
        return next(new ApiError('Failed to get tasks', httpStatus.NOT_FOUND));
      }

      const data = {
        total: tasks.length,
        tasks: tasks
      };

      res.status(httpStatus.OK).json({
        data: data,
        message: 'success'
      });
    } catch (error) {
      next(new ApiError(error.message, httpStatus.INTERNAL_SERVER_ERROR));
    }
  }

  async getTask(req, res, next) {
    const id = req.params.id;

    try {
      const task = await Task.findOne({ _id: id }).exec();

      if (!task) {
        return next(new ApiError('Task not found', httpStatus.NOT_FOUND));
      }

      res.status(httpStatus.OK).json({
        data: {
          task: task
        },
        message: 'success'
      });
    } catch (error) {
      next(new ApiError(error.message, httpStatus.INTERNAL_SERVER_ERROR));
    }
  }

  async addTask(req, res, next) {
    const bodyErrors = validationResult(req);

    if (!bodyErrors.isEmpty()) {
      return next(
        new ApiError('Some form inputs are not valid', httpStatus.UNPROCESSABLE_ENTITY)
      );
    }

    const task = new Task();
    task.name = req.body.name.toLowerCase();

    try {
      await task.save();
    } catch (error) {
      return next(
        new ApiError('Failed to create new task', httpStatus.INTERNAL_SERVER_ERROR)
      );
    }

    res.status(httpStatus.OK).json({
      data: {
        task: task
      },
      message: 'Task successfully created'
    });
  }

  async updateTask(req, res, next) {
    const bodyErrors = validationResult(req);

    if (!bodyErrors.isEmpty()) {
      return next(
        new ApiError('Some form inputs are not valid', httpStatus.UNPROCESSABLE_ENTITY)
      );
    }

    const id = req.params.id;

    const data = {
      name: req.body.name.toLowerCase(),
      state: req.body.state.toLowerCase()
    };

    try {
      const task = await Task.findOneAndUpdate({ _id: id }, data, {
        new: true
      }).exec();

      if (!task) {
        return next(
          new ApiError('Task is not found and cannot be updated', httpStatus.NOT_FOUND)
        );
      }

      res.status(httpStatus.OK).json({
        data: {
          task: task
        },
        message: `Task successfully updated`
      });
    } catch (error) {
      return next(new ApiError(error.message, httpStatus.INTERNAL_SERVER_ERROR));
    }
  }

  async deleteTask(req, res, next) {
    const id = req.params.id;

    try {
      const task = await Task.remove({ _id: id }).exec();

      if (!task) {
        return next(
          new ApiError('Task is not found and cannot be deleted', httpStatus.NOT_FOUND)
        );
      }

      res.status(httpStatus.OK).json({
        data: task,
        message: 'Task successfully deleted'
      });
    } catch (error) {
      return next(new ApiError(error.message, httpStatus.INTERNAL_SERVER_ERROR));
    }
  }
}

export default new TaskController();
