let walletAddress = '';

async function connectWallet() {
  if (window.solana) {
    const res = await window.solana.connect();
    walletAddress = res.publicKey.toString();
    alert('Connected: ' + walletAddress);
  } else {
    alert('Solana Wallet not found!');
  }
}

async function uploadRecord() {
  const file = document.getElementById('fileInput').files[0];
  if (!file) return alert('Please select a file');

  // Simulate uploading to IPFS (later replace with actual upload code)
  const fakeHash = 'Qm...' + Math.random().toString(36).substring(7);
  
  await fetch('http://localhost:5000/api/records/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ walletAddress, fileHash: fakeHash, fileName: file.name })
  });

  alert('File uploaded to IPFS!');
}

// Chart Example (Random Data for Now)
const ctx = document.getElementById('healthChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
            label: 'Heart Rate (bpm)',
            data: [80, 82, 78, 85, 90],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    }
});
