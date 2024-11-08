async function checkRPCs() {
  const button = document.getElementById('checkButton');
  const buttonContent = button.querySelector('.button-content');
  const spinner = button.querySelector('.spinner');
  const resultsContainer = document.getElementById('results');
  const rpcUrls = document
    .getElementById('rpcUrls')
    .value.split('\n')
    .map((url) => url.trim())
    .filter((url) => url);

  // Reset and show loading state
  button.disabled = true;
  buttonContent.textContent = 'Checking...';
  spinner.classList.remove('hidden');
  resultsContainer.innerHTML = '';

  const results = [];

  for (const url of rpcUrls) {
    try {
      const startTime = performance.now();
      const provider = new ethers.providers.JsonRpcProvider(url);
      const blockNumber = await provider.getBlockNumber();
      const endTime = performance.now();

      results.push({
        url,
        blockNumber,
        responseTime: Math.round(endTime - startTime),
        success: true,
      });
    } catch (error) {
      results.push({
        url,
        error: error.message,
        success: false,
      });
    }
  }

  // Sort results by response time (successful ones first)
  results.sort((a, b) => {
    if (a.success && !b.success) return -1;
    if (!a.success && b.success) return 1;
    if (!a.success && !b.success) return 0;
    return a.responseTime - b.responseTime;
  });

  // Display results
  results.forEach((result, index) => {
    const card = document.createElement('div');
    card.className = 'result-card';

    const rankClass =
      index === 0 ? 'rank-1' :index === 1 ? 'rank-2' :'rank-other';

    card.innerHTML = `
            <div class="result-header">
                <span class="rank ${rankClass}">#${index + 1}</span>
                <span class="url">${result.url}</span>
            </div>
            <div class="metrics">
                ${
                  result.success
                    ? `
                    <span class="metric">📦 Block: ${result.blockNumber}</span>
                    <span class="metric">⚡ Response: ${result.responseTime}ms</span>
                `
                    : `
                    <span class="metric error">❌ Error: ${result.error}</span>
                `
                }
            </div>
        `;

    resultsContainer.appendChild(card);
  });

  // Reset button state
  button.disabled = false;
  buttonContent.textContent = 'Check Response Times';
  spinner.classList.add('hidden');
}

// Initialize with some example URLs
document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('rpcUrls');
  if (!textarea.value) {
    textarea.value = `https://eth.llamarpc.com\nhttps://rpc.ankr.com/eth\nhttps://ethereum.publicnode.com`;
  }
});
