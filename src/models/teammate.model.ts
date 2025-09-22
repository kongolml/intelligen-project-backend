import mongoose, { model, Schema } from 'mongoose';

export interface ITeammate {
  name: string;
  title: string;
  image: mongoose.Schema.Types.ObjectId[];
}

export const TeammateSchema = new Schema<ITeammate>(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    image: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MediaFile' }],
  },
  {
    timestamps: true,
    collection: 'teammates',
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  },
);

export const Teammate = model<ITeammate>('Teammate', TeammateSchema);