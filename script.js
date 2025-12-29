// TON CONNECT
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: "https://LEON1KING1.github.io/NFT-TON_APP/tonconnect-manifest.json",
  buttonRootId: "walletBtn"
});

let walletAddress = null;

// Wallet status
tonConnectUI.onStatusChange(wallet => {
  if (!wallet) return;
  walletAddress = wallet.account.address;
  document.getElementById("owner").value = walletAddress;
  loadNFTs();
});

// Open NFT page
document.getElementById("myNftsBtn").onclick = () => {
  document.getElementById("nftPage").classList.remove("hidden");
};

// Close NFT page
document.getElementById("closeNfts").onclick = () => {
  document.getElementById("nftPage").classList.add("hidden");
};

// Load NFTs (real)
async function loadNFTs() {
  const list = document.getElementById("nftList");
  list.innerHTML = "Loading...";

  const res = await fetch(`https://tonapi.io/v2/accounts/${walletAddress}/nfts`);
  const data = await res.json();

  list.innerHTML = "";
  data.nfts.forEach(nft => {
    const img =
      nft.previews?.find(p => p.resolution === "500x500")?.url ||
      nft.metadata?.image ||
      "";

    list.innerHTML += `
      <div class="nft-item">
        <img src="${img}">
        <p>${nft.metadata?.name || "NFT"}</p>
      </div>
    `;
  });
}

// REAL MINT (simple transfer demo)
document.getElementById("mintBtn").onclick = async () => {
  if (!walletAddress) {
    alert("Connect wallet first");
    return;
  }

  await tonConnectUI.sendTransaction({
    validUntil: Math.floor(Date.now() / 1000) + 300,
    messages: [{
      address: walletAddress,
      amount: "10000000" // 0.01 TON demo
    }]
  });
};
