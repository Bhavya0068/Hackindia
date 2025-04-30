const Patient = require('../models/patientModel');

exports.uploadRecord = async (req, res) => {
  const { walletAddress, fileHash, fileName } = req.body;

  let patient = await Patient.findOne({ walletAddress });

  if (!patient) {
    patient = new Patient({ walletAddress, ipfsHashes: [], permissions: [] });
  }

  patient.ipfsHashes.push({ fileHash, fileName });
  await patient.save();

  res.status(200).json({ message: 'Record uploaded successfully' });
};

exports.grantAccess = async (req, res) => {
  const { walletAddress, doctorWallet } = req.body;

  const patient = await Patient.findOne({ walletAddress });
  if (!patient) return res.status(404).json({ message: 'Patient not found' });

  patient.permissions.push({ doctorWallet });
  await patient.save();

  res.status(200).json({ message: 'Access granted successfully' });
};

exports.getRecords = async (req, res) => {
  const { patientWallet, doctorWallet } = req.query;

  const patient = await Patient.findOne({ walletAddress: patientWallet });

  const isAuthorized = patient.permissions.some(p => p.doctorWallet === doctorWallet);
  if (!isAuthorized) return res.status(403).json({ message: 'Access Denied' });

  res.status(200).json({ records: patient.ipfsHashes });
};
