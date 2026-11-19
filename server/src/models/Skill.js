import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  proficiencyLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Expert'], default: 'Intermediate' },
  locationType: { type: String, enum: ['Online', 'In-Person', 'Both'], default: 'Online' },
  images: [String],
  rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
}, { timestamps: true });

export default mongoose.model('Skill', skillSchema);