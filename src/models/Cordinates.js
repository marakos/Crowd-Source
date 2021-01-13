const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const CordinatesSchema = new mongoose.Schema({
    user_id: String,
    createdAt: {type: Date, default: Date.now},
    locations:[{
       heading: Number,
        activity: [{
            timestampMs: Number,
            activity: [{
                type: {type: String},
                confidence: Number,
            }]
        }],
       verticalAccuracy: Number,
       velocity: Number,
       accuracy: Number,
       longitudeE7: Number,
       latitudeE7: Number,
       altitude: Number,
       timestampMs: Number
   }]

});

const Cordinates = mongoose.model('Cordinates', CordinatesSchema);

module.exports = Cordinates;
