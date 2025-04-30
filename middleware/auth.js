// middleware/auth.js
const jwt = require('jsonwebtoken');
const { solana } = require('@solana/web3.js');

// Validate request middleware
const validateRequest = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user from payload to request object
    req.user = decoded.user;
    
    // For Solana wallet verification (alternative approach)
    if (req.headers['x-wallet-address']) {
      const walletAddress = req.headers['x-wallet-address'];
      const signature = req.headers['x-signature'];
      
      // In a real app, you would verify the signature here
      // This is a simplified version
      req.user = { 
        publicKey: walletAddress,
        verified: true
      };
    }

    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Simple wallet verification middleware
const verifyWallet = async (req, res, next) => {
  try {
    const { publicKey, signature } = req.body;
    
    if (!publicKey || !signature) {
      return res.status(400).json({ msg: 'Wallet credentials missing' });
    }

    // In a production app, you would verify the signature here
    // This is just a placeholder for the demo
    
    req.user = {
      publicKey,
      verified: true
    };
    
    next();
  } catch (err) {
    console.error('Wallet verification error:', err);
    res.status(401).json({ msg: 'Wallet verification failed' });
  }
};

module.exports = {
  validateRequest,
  verifyWallet
};