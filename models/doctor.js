const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const DoctorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    patients: {
        type: [Schema.Types.ObjectId],
        ref: "Patients"
    },
    license_number: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now()
    },
    description: {
        type: String
    },
    rating: {
        type: Number,
        default: 5
    }
});
module.exports  = mongoose.model("Doctors", DoctorSchema);