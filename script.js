// TON Connect init
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: "https://LEON1KING1.github.io/NFT-TON_APP/tonconnect-manifest.json"
});

// Select NFT type
document.querySelectorAll(".option").forEach(opt => {
  opt.onclick = () => {
    document.querySelectorAll(".option").forEach(o => o.classList.remove("active"));
    opt.classList.add("active");
  };
});

// Connect wallet
document.getElementById("walletBtn").onclick = async () => {
  await tonConnectUI.connectWallet();
};

// Wallet state
tonConnectUI.onStatusChange(wallet => {
  if (wallet) {
    const address = wallet.account.address;
    document.getElementById("walletBtn").innerText = "✅ Connected";
    document.getElementById("owner").value = address;
  }
});

// Open NFTs panel (placeholder for now)
document.getElementById("myNftsBtn").onclick = () => {
  document.getElementById("nftPanel").classList.toggle("hidden");
  document.getElementById("nftList").innerHTML =
    "<p>NFT loading will be added next step.</p>";
};
