let walletConnected = false;
let walletAddress = "";

// fake NFTs (placeholder)
const myNFTs = [
  { name: "Cyber Lion", image: "https://picsum.photos/300?random=1" },
  { name: "Neon Skull", image: "https://picsum.photos/300?random=2" },
  { name: "Pixel Ghost", image: "https://picsum.photos/300?random=3" }
];

// select NFT type
document.querySelectorAll(".option").forEach(opt => {
  opt.onclick = () => {
    document.querySelectorAll(".option").forEach(o => o.classList.remove("active"));
    opt.classList.add("active");
  };
});

// connect wallet
document.getElementById("walletBtn").onclick = () => {
  walletConnected = true;
  walletAddress = "EQC8...DEMO";

  document.getElementById("walletBtn").innerText = "✅ Connected";
  document.getElementById("owner").value = walletAddress;
};

// open NFTs panel
document.getElementById("myNftsBtn").onclick = () => {
  if (!walletConnected) {
    alert("Please connect wallet first");
    return;
  }

  document.getElementById("nftPanel").classList.toggle("hidden");
  loadNFTs();
};

function loadNFTs() {
  const list = document.getElementById("nftList");
  list.innerHTML = "";

  myNFTs.forEach(nft => {
    list.innerHTML += `
      <div class="nft-item">
        <img src="${nft.image}">
        <p>${nft.name}</p>
      </div>
    `;
  });
}
