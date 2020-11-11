import { Schema, model } from 'mongoose';
import appConf from '../utils/app.conf';

const conf = appConf.getConf();

class Task extends Schema {
  constructor() {
    super(
      {
        name: {
          type: String,
          required: true
        },
        dateCreated: {
          type: Date,
          default: Date.now
        },
        state: {
          type: String,
          enum: ['pending', 'ongoing', 'completed'],
          default: 'pending'
        }
      },
      { versionKey: false }
    );
  }
}

export default model('Task', new Task());
