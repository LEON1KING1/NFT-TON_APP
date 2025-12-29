document.getElementById("generateBtn").addEventListener("click", function() {
    const prompt = document.getElementById("prompt").value.trim();
    const resultDiv = document.getElementById("result");

    if (!prompt) {
        resultDiv.innerHTML = "<p class='error'>Please enter a prompt!</p>";
        return;
    }

    resultDiv.innerHTML = "<p class='loading'>⏳ Generating NFT...</p>";

    // Demo image (replace later with AI API)
    const randomNum = Math.floor(Math.random() * 1000);
    const imageUrl = `https://picsum.photos/512?random=${randomNum}`;

    resultDiv.innerHTML = `
        <div class="nft-card">
            <img src="${imageUrl}" alt="NFT Art">
            <p class="prompt-text">${prompt}</p>
        </div>
    `;
});
