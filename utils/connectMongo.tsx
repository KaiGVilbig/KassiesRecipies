import mongoose from 'mongoose';

export const connectMongoRecipies = async () => mongoose.connect("mongodb://localhost:27017/recipies", {family: 4}) 