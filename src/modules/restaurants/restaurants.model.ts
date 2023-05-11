import mongoose, { ObjectId } from 'mongoose';
import { IRestaurantDoc, IRestaurantModel } from './restaurants.interfaces';
import paginate from '../paginate/paginate';
import { toJSON } from '../toJSON';

const restaurantsSchema = new mongoose.Schema<IRestaurantDoc, IRestaurantModel>(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    contact: {
      type: Number,
      required: true,
      unique: true,
    },
    pinCode: {
      type: Number,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
restaurantsSchema.plugin(toJSON);
restaurantsSchema.plugin(paginate);

/**
 * Check if restaurant is active
 * @param {mongoose.Types.ObjectId} id - The Restaurants's id
 * @returns {Promise<boolean>}
 */
restaurantsSchema.static('isContactTaken', async function (id: ObjectId): Promise<boolean> {
  const restaurant = await this.findOne({ _id: id });
  return !!restaurant;
});

restaurantsSchema.static(
  'isContactTaken',
  async function (contact: number, excludeUserId: mongoose.ObjectId): Promise<boolean> {
    const user = await this.findOne({ contact, _id: { $ne: excludeUserId } });
    return !!user;
  }
);

restaurantsSchema.pre('save', async function (next) {
  next();
});
const Restaurants = mongoose.model<IRestaurantDoc, IRestaurantModel>('Restaurants', restaurantsSchema);

export default Restaurants;
