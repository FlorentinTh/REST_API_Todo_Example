import express from 'express';
import validation from './task.validation';
import controller from './task.controller';

const router = express.Router();

router.route('/').get(controller.getTasks);

router.route('/').post(validation.add, controller.addTask);

router
  .route('/:id')
  .get(controller.getTask)
  .put(validation.update, controller.updateTask)
  .delete(controller.deleteTask);

export default router;
