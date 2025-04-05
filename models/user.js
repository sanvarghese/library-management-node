import mongoose from "mongoose";

// import mongooseUniqueValidator from "mongoose-unique-validator";
// import { timeConverterForMongoose } from "../helpers/dbHelpers.js";

import pkg from 'validator';
const { isEmail, escape, normalizeEmail } = pkg;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      set: (input) => escape(input),
      default: null
    },
    email: {
      type: String,
      required: true,
      validator: (value)=> isEmail(value),
      set:(input) => normalizeEmail(input, {
        all_lowercase: true,
        gmail_remove_dots: true,
        gmail_remove_subaddress: true,
        gmail_convert_googlemaildotcom: true,
        outlookdotcom_lowercase: true,
        outlookdotcom_remove_subaddress: true,
        yahoo_lowercase: true,
        yahoo_remove_subaddress: true,
        icloud_lowercase: true,
        icloud_remove_subaddress: true
      }),
      unique: true,
    },
    password: {
      type: String,
      default: null
    },
  
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin']
    },
   
  },
  {
    timestamps: true,
  }
);


const User = mongoose.model("User", userSchema);

export default User;