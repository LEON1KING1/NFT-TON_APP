import { NFTStorage, File } from 'https://unpkg.com/nft.storage/dist/bundle.esm.min.js';

// ضع مفتاحك هنا من nft.storage
const NFT_STORAGE_KEY = "ba8e5ed0.c5daf8b936ce49f3a0509d5138222a19";

const client = new NFTStorage({ token: NFT_STORAGE_KEY });

const nftContainer = document.getElementById("nftContainer");
const mintBtn = document.getElementById("mintBtn");

mintBtn.onclick = async () => {
  const name = document.getElementById("nftName").value.trim();
  const imageUrl = document.getElementById("nftImage").value.trim();
  const desc = document.getElementById("nftDesc").value.trim();

  if(!name || !imageUrl){
    alert("Name and Image URL required");
    return;
  }

  try{
    // رفع الصورة على IPFS
    const metadata = await client.store({
      name,
      description: desc,
      image: new File([await fetch(imageUrl).then(r=>r.blob())], "nft.png",{type:"image/png"})
    });

    // عرض NFT في الصفحة
    const card = document.createElement("div");
    card.className = "nftCard";
    card.innerHTML = `
      <img src="${imageUrl}">
      <p><strong>${name}</strong></p>
      <p>${desc}</p>
      <p>IPFS: <a href="${metadata.url}" target="_blank">View</a></p>
    `;
    nftContainer.prepend(card);

    // مسح الحقول بعد Mint
    document.getElementById("nftName").value = "";
    document.getElementById("nftImage").value = "";
    document.getElementById("nftDesc").value = "";

  } catch(e){
    console.error(e);
    alert("Failed to store NFT on IPFS");
  }
};
