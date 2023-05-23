import mongoose from 'mongoose';
import { IMenuModel, IMenuDoc } from './menus.interfaces';
import paginate from '../paginate/paginate';
import { toJSON } from '../toJSON';

const menuSchema = new mongoose.Schema<IMenuDoc, IMenuModel>(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
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
menuSchema.plugin(toJSON);
menuSchema.plugin(paginate);

menuSchema.pre('save', async function (next) {
  next();
});
const Menus = mongoose.model<IMenuDoc, IMenuModel>('Menus', menuSchema);

export default Menus;
