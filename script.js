const options = document.querySelectorAll(".option");

options.forEach(opt => {
  opt.addEventListener("click", () => {
    options.forEach(o => o.classList.remove("active"));
    opt.classList.add("active");
  });
});

document.getElementById("connect").onclick = () => {
  alert("Wallet connection will be added later (TON / Telegram)");
};
