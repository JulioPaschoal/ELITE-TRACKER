import { model, Schema } from 'mongoose';

const FocusTimeSchema = new Schema(
  {
    timeFrom: { Date },
    timeTo: { Date },
  },

  {
    versionKey: false,
    timestamps: true,
  },
);
export const FocusTimeModel = model('FocusTime', FocusTimeSchema);
