import json
import urllib.request

API_TOKEN = 'ضع_هنا_توكن_البوت_من_BotFather'
BASE_URL = f"https://api.telegram.org/bot{API_TOKEN}/"

# قائمة NFT وهمية جاهزة
NFT_COLLECTION = [
    {"id": 1, "name": "NFT 1", "image": "https://ipfs.io/ipfs/QmYkExample1/image1.webp", "price": 0.05},
    {"id": 2, "name": "NFT 2", "image": "https://ipfs.io/ipfs/QmYkExample2/image2.webp", "price": 0.05},
    {"id": 3, "name": "NFT 3", "image": "https://ipfs.io/ipfs/QmYkExample3/image3.webp", "price": 0.05},
]

offset = 0  # لتتبع آخر رسالة

def send_message(chat_id, text):
    url = BASE_URL + "sendMessage"
    data = json.dumps({"chat_id": chat_id, "text": text}).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    urllib.request.urlopen(req)

def send_photo(chat_id, photo_url, caption=""):
    url = BASE_URL + "sendPhoto"
    data = json.dumps({"chat_id": chat_id, "photo": photo_url, "caption": caption}).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    urllib.request.urlopen(req)

while True:
    updates_url = BASE_URL + f"getUpdates?offset={offset}&timeout=10"
    response = urllib.request.urlopen(updates_url)
    data = json.loads(response.read())

    for result in data["result"]:
        offset = result["update_id"] + 1
        message = result.get("message")
        if not message:
            continue
        chat_id = message["chat"]["id"]
        text = message.get("text", "")

        if text == "/start":
            send_message(chat_id, "مرحباً! هذه مجموعة NFT التجريبية. اكتب /collection لعرض العناصر.")

        elif text == "/collection":
            for nft in NFT_COLLECTION:
                send_photo(chat_id, nft["image"], f"{nft['name']}\nالسعر: {nft['price']} TON\nاكتب /buy_{nft['id']} للشراء")

        elif text.startswith("/buy_"):
            nft_id = int(text.split("_")[1])
            nft = next((x for x in NFT_COLLECTION if x["id"] == nft_id), None)
            if nft:
                send_message(chat_id, f"لشراء {nft['name']}, أرسل {nft['price']} TON إلى Collection Address الخاص بالعقد NFT.")
            else:
                send_message(chat_id, "NFT غير موجودة!")
