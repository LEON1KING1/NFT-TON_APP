// ===== TON CONNECT =====
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: "https://LEON1KING1.github.io/NFT-TON_APP/tonconnect-manifest.json"
});

let walletAddress = null;

// Connect wallet
document.getElementById("walletBtn").onclick = async () => {
  await tonConnectUI.connectWallet();
};

// Wallet status
tonConnectUI.onStatusChange(async wallet => {
  if (!wallet) return;

  walletAddress = wallet.account.address;
  document.getElementById("walletBtn").innerText = "✅ Connected";
  document.getElementById("owner").value = walletAddress;

  loadNFTs(); // auto load NFTs
});

// ===== LOAD REAL NFTs =====
async function loadNFTs() {
  if (!walletAddress) return;

  const nftList = document.getElementById("nftList");
  nftList.innerHTML = "Loading NFTs...";

  try {
    const res = await fetch(
      `https://tonapi.io/v2/accounts/${walletAddress}/nfts`
    );
    const data = await res.json();

    if (!data.nfts || data.nfts.length === 0) {
      nftList.innerHTML = "<p>No NFTs found</p>";
      return;
    }

    nftList.innerHTML = "";

    data.nfts.forEach(nft => {
      const image =
        nft.previews?.find(p => p.resolution === "500x500")?.url ||
        nft.metadata?.image ||
        "";

      nftList.innerHTML += `
        <div class="nft-item">
          <img src="${image}" />
          <p>${nft.metadata?.name || "Unnamed NFT"}</p>
        </div>
      `;
    });

  } catch (err) {
    nftList.innerHTML = "Failed to load NFTs";
    console.error(err);
  }
}

// Toggle NFT panel
document.getElementById("myNftsBtn").onclick = () => {
  document.getElementById("nftPanel").classList.toggle("hidden");
};
