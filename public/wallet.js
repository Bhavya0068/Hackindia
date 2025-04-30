document.addEventListener('DOMContentLoaded', function() {
    const connectWalletBtn = document.getElementById('connectWalletBtn');
    
    // Check if Phantom wallet is installed
    if (window.solana && window.solana.isPhantom) {
      console.log('Phantom wallet is installed!');
      
      // Connect wallet button click handler
      connectWalletBtn.addEventListener('click', async () => {
        try {
          // Connect to wallet
          const response = await window.solana.connect();
          const publicKey = response.publicKey.toString();
          
          // Shorten public key for display
          const shortenedKey = `${publicKey.substring(0, 4)}...${publicKey.substring(publicKey.length - 4)}`;
          
          // Update button text
          connectWalletBtn.textContent = shortenedKey;
          connectWalletBtn.style.backgroundColor = '#28a745'; // Green to indicate connected
          
          // Store public key in session
          sessionStorage.setItem('walletPublicKey', publicKey);
          
          console.log('Connected with Public Key:', publicKey);
          
          // You would typically send this public key to your backend here
          // to associate it with the user's account
          
        } catch (err) {
          console.error('Error connecting wallet:', err);
          alert('Failed to connect wallet. Please try again.');
        }
      });
      
      // Check if already connected
      window.solana.connect({ onlyIfTrusted: true })
        .then(({ publicKey }) => {
          const shortenedKey = `${publicKey.toString().substring(0, 4)}...${publicKey.toString().substring(publicKey.toString().length - 4)}`;
          connectWalletBtn.textContent = shortenedKey;
          connectWalletBtn.style.backgroundColor = '#28a745';
          sessionStorage.setItem('walletPublicKey', publicKey.toString());
        })
        .catch(() => {
          // Not connected, do nothing
        });
      
    } else {
      // Phantom not installed
      connectWalletBtn.textContent = 'Install Phantom';
      connectWalletBtn.addEventListener('click', () => {
        window.open('https://phantom.app/', '_blank');
      });
    }
    
    // Handle wallet disconnect
    window.solana?.on('disconnect', () => {
      connectWalletBtn.textContent = 'Connect Wallet';
      connectWalletBtn.style.backgroundColor = '';
      sessionStorage.removeItem('walletPublicKey');
    });
  });