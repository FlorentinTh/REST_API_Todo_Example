import { check } from 'express-validator';

const validation = {
  add: [check('name').notEmpty().isString()],
  update: [
    check('name').notEmpty().isString(),
    check('state').notEmpty().isString().isIn(['pending', 'ongoing', 'completed'])
  ]
};

export default validation;
