const express = require('express');
const router = express.Router();
const Record = require('../models/Record');
const { validateRequest } = require('../middleware/auth');
const axios = require('axios');

// Get all records for a patient
router.get('/', validateRequest, async (req, res) => {
  try {
    const records = await Record.find({ patientId: req.user.publicKey })
      .sort({ date: -1 })
      .limit(50);
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Upload new record
router.post('/', validateRequest, async (req, res) => {
  const { recordType, title, description, date, provider, file } = req.body;
  
  try {
    // First upload to IPFS (this would be your IPFS service integration)
    const ipfsResponse = await axios.post('https://ipfs.infura.io:5001/api/v0/add', file, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    const ipfsHash = ipfsResponse.data.Hash;
    
    // Create new record
    const newRecord = new Record({
      patientId: req.user.publicKey,
      recordType,
      title,
      description,
      date,
      provider,
      ipfsHash,
      encryptedKey: req.body.encryptedKey // Key encrypted with patient's public key
    });
    
    await newRecord.save();
    
    res.json(newRecord);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Share record with provider
router.post('/:id/share', validateRequest, async (req, res) => {
  try {
    const record = await Record.findOne({
      _id: req.params.id,
      patientId: req.user.publicKey
    });
    
    if (!record) {
      return res.status(404).json({ msg: 'Record not found' });
    }
    
    // Add to access list
    record.accessList.push({
      entityId: req.body.providerId,
      entityType: req.body.providerType,
      accessDate: new Date()
    });
    
    await record.save();
    
    res.json(record);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Revoke access
router.post('/:id/revoke', validateRequest, async (req, res) => {
  try {
    const record = await Record.findOne({
      _id: req.params.id,
      patientId: req.user.publicKey
    });
    
    if (!record) {
      return res.status(404).json({ msg: 'Record not found' });
    }
    
    // Find and update the access entry
    const accessEntry = record.accessList.id(req.body.accessId);
    if (accessEntry) {
      accessEntry.revoked = true;
      accessEntry.revokedDate = new Date();
      await record.save();
    }
    
    res.json(record);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;