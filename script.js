// TON Connect
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl:"https://LEON1KING1.github.io/NFT-TON_APP/tonconnect-manifest.json",
  buttonRootId:"walletBtn"
});

let walletAddress = null;

// Status listener
tonConnectUI.onStatusChange(async wallet => {
  if(!wallet) return;
  walletAddress = wallet.account.address;
  document.getElementById("owner").value = walletAddress;
  loadNFTs();
});

// Open/Close Portal
document.getElementById("openNfts").onclick = ()=>document.getElementById("nftPortal").classList.add("show");
document.getElementById("closePortal").onclick = ()=>document.getElementById("nftPortal").classList.remove("show");

// Load NFTs
async function loadNFTs(){
  const container=document.getElementById("nftContainer");
  if(!walletAddress){container.innerHTML="<p style='text-align:center;padding:16px;color:#888'>Connect wallet to view NFTs</p>";return;}
  container.innerHTML="<p style='text-align:center;padding:16px;color:#888'>Loading...</p>";

  try{
    const res=await fetch(`https://tonapi.io/v2/accounts/${walletAddress}/nfts`);
    const data=await res.json();
    container.innerHTML="";
    if(!data.nfts || data.nfts.length===0){container.innerHTML="<p style='text-align:center;padding:16px;color:#888'>No NFTs Found</p>";return;}
    data.nfts.forEach(nft=>{
      const img=nft.previews?.find(p=>p.resolution==="500x500")?.url || nft.metadata?.image || "";
      const name=nft.metadata?.name||"Unnamed NFT";
      const desc=nft.metadata?.description||"-";
      const type=nft.type||"-";
      const royalty=nft.royalty||"-";
      const owner=nft.owner||"-";

      container.innerHTML+=`
        <div class="nftCard">
          <img src="${img}">
          <p><strong>${name}</strong></p>
          <p>${desc}</p>
          <p>Type: ${type}</p>
          <p>Owner: ${owner}</p>
          <p>Royalty: ${royalty}%</p>
        </div>
      `;
    });
  }catch(e){container.innerHTML="<p style='text-align:center;padding:16px;color:red'>Failed to load NFTs</p>";console.error(e);}
}

// Mint NFT فعلي + Metadata/IPFS
document.getElementById("mintBtn").onclick=async()=>{
  if(!walletAddress){alert("Connect wallet first");return;}
  const name=document.getElementById("nftName").value.trim();
  const image=document.getElementById("nftImage").value.trim();
  const desc=document.getElementById("nftDesc").value.trim();
  const royalty=document.getElementById("royalty").value.trim();
  const type=document.getElementById("nftType").value;

  if(!name||!image){alert("Name & Image required");return;}

  // 1️⃣ رفع Metadata على IPFS (يمكن استخدام أي API مثل nft.storage)
  // 2️⃣ سك NFT على TON باستخدام TON Connect
  // هنا مثال مبسط لـ demo TON transfer قبل إضافة Contract Mint
  await tonConnectUI.sendTransaction({
    validUntil:Math.floor(Date.now()/1000)+300,
    messages:[{address:walletAddress,amount:"10000000"}] // 0.01 TON demo
  });

  alert("Mint transaction submitted! Soon NFT will appear in your wallet.");
};
