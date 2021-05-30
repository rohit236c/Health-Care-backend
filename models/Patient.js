const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const PatientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    doctors: {
        type: [Schema.Types.ObjectId],
        ref: 'Doctors'
    },
    date: {
        type: Date,
        default: Date.now()
    },
    documents: {
        type: Array,
        default: [],
        ref: "Documents"
    }
});
module.exports  = mongoose.model("Patients", PatientSchema);
