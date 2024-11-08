document.getElementById('checkButton').addEventListener('click', async () => {
  const rpcUrl = document.getElementById('rpcUrlInput').value;
  if (!rpcUrl) {
    alert('Please enter an RPC URL');
    return;
  }

  const resultsList = document.getElementById('resultsList');
  resultsList.innerHTML = '';

  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

  const start = performance.now();
  try {
    const blockNumber = await provider.getBlockNumber();
    const end = performance.now();
    const responseTime = (end - start).toFixed(2);

    const resultItem = document.createElement('li');
    resultItem.classList.add('result-item');
    resultItem.innerHTML = `
      <span>Block Number: ${blockNumber}</span><br>
      <span class="result-time">Response Time: ${responseTime} ms</span>
    `;
    resultsList.appendChild(resultItem);
  } catch (error) {
    const errorItem = document.createElement('li');
    errorItem.classList.add('result-item');
    errorItem.style.color = 'red';
    errorItem.textContent = `Error: ${error.message}`;
    resultsList.appendChild(errorItem);
  }
});
