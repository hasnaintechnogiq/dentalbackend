const mongoose = require('mongoose')

const documentPDFSchema = new mongoose.Schema({
    name: String,
    type: String,
    size: Number,
    uri: String,
  });


  module.exports = mongoose.model('DocumentPDF', documentPDFSchema);