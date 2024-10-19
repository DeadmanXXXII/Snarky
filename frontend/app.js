async function deposit() { 
    const fromAddress = document.getElementById('fromAddress').value;
    const amount = document.getElementById('depositAmount').value;

    // Validate user input
    if (!fromAddress || !amount || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid wallet address and amount to deposit.');
        return;
    }

    const response = await fetch('/deposit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fromAddress, amount }),
    });

    const data = await response.json();
    alert(data.success ? 'Deposit Successful!' : `Error: ${data.error}`);
}

async function withdraw() {
    const toAddress = document.getElementById('toAddress').value;
    const amount = document.getElementById('withdrawAmount').value;

    // Validate user input
    if (!toAddress || !amount || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid wallet address and amount to withdraw.');
        return;
    }

    const response = await fetch('/withdraw', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ toAddress, amount }),
    });

    const data = await response.json();
    alert(data.success ? 'Withdrawal Successful!' : `Error: ${data.error}`);
}
