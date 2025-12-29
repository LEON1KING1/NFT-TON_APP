const tonConnectUI=new TON_CONNECT_UI.TonConnectUI({manifestUrl:"https://LEON1KING1.github.io/NFT-TON_APP/tonconnect-manifest.json",buttonRootId:"walletBtn"});
let walletAddress=null;

// Wallet
tonConnectUI.onStatusChange(wallet=>{
  if(!wallet) return;
  walletAddress=wallet.account.address;
  document.getElementById("owner").value=walletAddress;
  loadNFTs();
});

// Overlay open/close
document.getElementById("myNftsBtn").onclick=()=>document.getElementById("nftOverlay").classList.add("show");
document.getElementById("closeOverlay").onclick=()=>document.getElementById("nftOverlay").classList.remove("show");

// Load NFTs
async function loadNFTs(){
  const grid=document.getElementById("nftGrid");
  if(!walletAddress){grid.innerHTML="<p>Connect wallet first</p>";return;}
  grid.innerHTML="Loading...";
  try{
    const res=await fetch(`https://tonapi.io/v2/accounts/${walletAddress}/nfts`);
    const data=await res.json();
    grid.innerHTML="";
    if(!data.nfts||data.nfts.length===0){grid.innerHTML="<p>No NFTs found</p>";return;}
    data.nfts.forEach(nft=>{
      const img=nft.previews?.find(p=>p.resolution==="500x500")?.url||nft.metadata?.image||"";
      grid.innerHTML+=`<div class="nft-item"><img src="${img}"><p>${nft.metadata?.name||"NFT"}</p></div>`;
    });
  }catch(e){grid.innerHTML="<p>Failed to load NFTs</p>";console.error(e);}
}

// Mint demo
document.getElementById("mintBtn").onclick=async()=>{
  if(!walletAddress){alert("Connect wallet first");return;}
  const name=document.getElementById("nftName").value;
  const image=document.getElementById("nftImage").value;
  if(!name||!image){alert("Name & Image required");return;}
  await tonConnectUI.sendTransaction({validUntil:Math.floor(Date.now()/1000)+300,messages:[{address:walletAddress,amount:"10000000"}]});
};
