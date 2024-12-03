import mongoose from 'mongoose';
const { Schema } = mongoose;

const SuportedLanguageSchema = new Schema({
  language: { type: String, unique: true }, 
  image: {type: String,required:true} 
})
export const SuportedLanguagesModel = mongoose.model('SuportedLanguage', SuportedLanguageSchema);
