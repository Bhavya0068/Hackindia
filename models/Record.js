const mongoose = require('mongoose');
const { Schema } = mongoose;

const recordSchema = new Schema({
  patientId: { 
    type: String, 
    required: true,
    index: true 
  },
  recordType: { 
    type: String, 
    required: true,
    enum: ['lab_result', 'doctor_notes', 'imaging', 'prescription', 'vaccination', 'other']
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  date: { 
    type: Date, 
    required: true 
  },
  provider: {
    name: String,
    id: String
  },
  ipfsHash: { 
    type: String, 
    required: true 
  },
  encryptedKey: { 
    type: String, 
    required: true 
  },
  accessList: [{
    entityId: String,
    entityType: String, // 'doctor', 'hospital', 'lab'
    accessDate: Date,
    revoked: Boolean
  }],
  metadata: Schema.Types.Mixed
}, { timestamps: true });

// Add text index for search
recordSchema.index({
  title: 'text',
  description: 'text',
  'provider.name': 'text'
});



const Record = mongoose.model('Record', recordSchema);

module.exports = Record;