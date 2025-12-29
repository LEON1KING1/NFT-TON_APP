// ===== TON Connect Init =====
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: "https://LEON1KING1.github.io/NFT-TON_APP/tonconnect-manifest.json",
  buttonRootId: "walletBtn"
});

let walletAddress = null;

// Status listener
tonConnectUI.onStatusChange(async wallet => {
  if (!wallet) return;
  walletAddress = wallet.account.address;
  document.getElementById("owner").value = walletAddress;
  loadNFTs();
});

// Open Portal
document.getElementById("openNfts").onclick = () => {
  document.getElementById("nftPortal").classList.add("show");
};

// Close Portal
document.getElementById("closePortal").onclick = () => {
  document.getElementById("nftPortal").classList.remove("show");
};

// Load NFTs from TON API
async function loadNFTs() {
  const container = document.getElementById("nftContainer");
  if (!walletAddress) {
    container.innerHTML = `<p style="text-align:center;color:#888;padding:16px;">Connect wallet to view NFTs</p>`;
    return;
  }

  container.innerHTML = `<p style="text-align:center;color:#888;padding:16px;">Loading NFTs...</p>`;

  try {
    const res = await fetch(`https://tonapi.io/v2/accounts/${walletAddress}/nfts`);
    const data = await res.json();

    container.innerHTML = "";
    if (!data.nfts || data.nfts.length === 0) {
      container.innerHTML = `<p style="text-align:center;color:#888;padding:16px;">No NFTs Found</p>`;
      return;
    }

    data.nfts.forEach(nft => {
      const img =
        nft.previews?.find(p => p.resolution === "500x500")?.url ||
        nft.metadata?.image ||
        "";

      container.innerHTML += `
        <div class="nftCard">
          <img src="${img}">
          <p>${nft.metadata?.name || "Unnamed NFT"}</p>
        </div>
      `;
    });

  } catch (error) {
    container.innerHTML = `<p style="text-align:center;color:#f00;padding:16px;">Failed to load NFTs</p>`;
    console.error(error);
  }
}

// Mint demo (demo TON transfer)
document.getElementById("mintBtn").onclick = async () => {
  if (!walletAddress) {
    alert("Connect wallet first");
    return;
  }

  const name = document.getElementById("nftName").value.trim();
  const image = document.getElementById("nftImage").value.trim();
  if (!name || !image) {
    alert("Name & Image required");
    return;
  }

  // You can later insert TON NFT mint transaction here
  await tonConnectUI.sendTransaction({
    validUntil: Math.floor(Date.now() / 1000) + 300,
    messages: [
      { address: walletAddress, amount: "10000000" }
    ]
  });
};
