import { Schema, model } from 'mongoose';
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
