import mongoose from 'mongoose';
import { Database, Resource } from '@adminjs/mongoose';
import AdminJS from 'adminjs';

AdminJS.registerAdapter({ Database, Resource });

const initialize = async () => {
  console.log('db is start connetionsss')
  const db = await mongoose.connect(process.env.DATABASE_URL as string);
console.log('db is connected123')
  return { db };
};

export default initialize;
