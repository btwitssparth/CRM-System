import dotenv from "dotenv";
import connectDB from './src/db/index.js';
import { app } from './src/app.js'; // <- This is the crucial fix

dotenv.config({
    path: './.env'
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
      app.listen(PORT, () => {
          console.log(`Server is running at port : ${PORT}`);
      });
  })
  .catch((err) => {
      console.log("MongoDB connection failed !!! ", err);
  });