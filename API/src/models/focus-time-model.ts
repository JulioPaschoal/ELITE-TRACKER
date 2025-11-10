import { model, Schema } from 'mongoose';

const FocusTimeSchema = new Schema(
  {
    timeFrom: { type: Date, required: true },
    timeTo: { type: Date, required: true },
    userId: { type: String, required: true },
  },

  {
    versionKey: false,
    timestamps: true,
  },
);
export const focusTimeModel = model('FocusTime', FocusTimeSchema);
