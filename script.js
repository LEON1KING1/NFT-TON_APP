function generate() {
    const prompt = document.getElementById("prompt").value;
    const resultDiv = document.getElementById("result");

    resultDiv.innerHTML = "⏳ Generating NFT...";

    // Demo image (replace later with AI API if needed)
    const imageUrl = "https://picsum.photos/512?random=" + Math.floor(Math.random() * 1000);
    resultDiv.innerHTML = `<img src="${imageUrl}" width="300"><p>Prompt: ${prompt}</p>`;
}
