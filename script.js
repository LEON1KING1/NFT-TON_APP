document.getElementById("generateBtn").addEventListener("click", function() {
    const prompt = document.getElementById("prompt").value.trim();
    const resultDiv = document.getElementById("result");

    if (!prompt) {
        resultDiv.innerHTML = "<p style='color:red;'>Please enter a prompt!</p>";
        return;
    }

    resultDiv.innerHTML = "<p>⏳ Generating NFT...</p>";

    // Demo image from picsum.photos
    const randomNum = Math.floor(Math.random() * 1000);
    const imageUrl = `https://picsum.photos/512?random=${randomNum}`;

    // Display the result
    resultDiv.innerHTML = `
        <img src="${imageUrl}" width="300" alt="NFT Art">
        <p>Prompt: ${prompt}</p>
    `;
});
