import mongoose from 'mongoose';
import { Database, Resource } from '@adminjs/mongoose';
import AdminJS from 'adminjs';

AdminJS.registerAdapter({ Database, Resource });

let isConnected = false;

const initialize = async () => {
  if (isConnected) {
    console.log('Database already connected, reusing connection');
    return { db: mongoose.connection };
  }

  console.log('Connecting to database...');
  
  try {
    const db = await mongoose.connect(process.env.DATABASE_URL as string);
    isConnected = true;
    console.log('Database connected successfully');
    
    // Handle connection events
    mongoose.connection.on('disconnected', () => {
      console.log('Database disconnected');
      isConnected = false;
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('Database connection error:', err);
      isConnected = false;
    });
    
    return { db };
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw error;
  }
};

export default initialize;
