import { model, Schema } from 'mongoose';

const HabitSchema = new Schema(
  {
    name: { type: String, required: true },
    completedDates: { type: [Date] },
    userId: { type: String, required: true },
  },

  {
    versionKey: false,
    timestamps: true,
  },
);
export const habitModel = model('Habit', HabitSchema);
