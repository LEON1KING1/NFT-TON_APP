import { NFTStorage, File } from 'https://unpkg.com/nft.storage/dist/bundle.esm.min.js';

const NFT_STORAGE_KEY = "YOUR_NFT_STORAGE_API_KEY"; // ضع مفتاح nft.storage هنا

// TON Connect
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl:"https://LEON1KING1.github.io/NFT-TON_APP/tonconnect-manifest.json",
  buttonRootId:"walletBtn"
});

let walletAddress = null;

// Status listener
tonConnectUI.onStatusChange(async wallet=>{
  if(!wallet) return;
  walletAddress=wallet.account.address;
  document.getElementById("owner").value=walletAddress;
  loadNFTs();
});

// Open/Close Portal
document.getElementById("openNfts").onclick=()=>document.getElementById("nftPortal").classList.add("show");
document.getElementById("closePortal").onclick=()=>document.getElementById("nftPortal").classList.remove("show");

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

// Upload metadata to IPFS
async function uploadMetadataToIPFS(name, description, imageUrl, royalty, type){
  const client = new NFTStorage({ token: NFT_STORAGE_KEY });
  const metadata = await client.store({
    name,
    description,
    image: new File([await fetch(imageUrl).then(r=>r.blob())], "nft.png",{type:"image/png"}),
    properties:{royalty,type,owner:walletAddress}
  });
  return metadata.url;
}

// Mint NFT
document.getElementById("mintBtn").onclick=async()=>{
  if(!walletAddress){alert("Connect wallet first");return;}
  const name=document.getElementById("nftName").value.trim();
  const image=document.getElementById("nftImage").value.trim();
  const desc=document.getElementById("nftDesc").value.trim();
  const royalty=document.getElementById("royalty").value.trim();
  const type=document.getElementById("nftType").value;
  if(!name||!image){alert("Name & Image required");return;}

  const metadataURL = await uploadMetadataToIPFS(name, desc, image, royalty, type);

  await tonConnectUI.sendTransaction({
    validUntil: Math.floor(Date.now()/1000)+300,
    messages:[{
      address:"TON_NFT_CONTRACT_ADDRESS",
      amount:"10000000",
      payload: JSON.stringify({name, metadata:metadataURL, royalty, type, owner:walletAddress})
    }]
  });

  // فتح Portal تلقائي وعرض NFT الجديد
  document.getElementById("nftPortal").classList.add("show");
  loadNFTs();
};
