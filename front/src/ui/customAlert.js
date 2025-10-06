export function showCustomAlert(message = "") {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.backgroundColor = "rgba(0,0,0,0.7)";
    overlay.style.zIndex = 10000; 

    const box = document.createElement("div");
    box.style.position = "absolute";
    box.style.top = "20px";
    box.style.left = "50%";
    box.style.transform = "translateX(-50%)";
    box.style.backgroundColor = "#fff";
    box.style.padding = "15px 20px";
    box.style.borderRadius = "10px";
    box.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
    box.style.textAlign = "center";
    box.style.maxWidth = "90%";
    box.style.fontSize = "1rem";
    box.style.wordBreak = "break-word";
    box.style.display = "flex";
    box.style.alignItems = "center";
    box.style.justifyContent = "center";

    const icon = document.createElement("span");
    icon.textContent = "ⓘ";
    icon.style.color = "#007BFF";
    icon.style.marginRight = "8px";
    icon.style.fontSize = "1.2rem";

    const text = document.createElement("span");
    text.textContent = message;

    const closeBtn = document.createElement("span");
    closeBtn.textContent = "✖";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.fontSize = "1rem";
    closeBtn.style.fontWeight = "bold";
    closeBtn.style.color = "#333";
    closeBtn.style.marginLeft = "12px";

    closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        document.body.removeChild(overlay);
    });

    overlay.addEventListener("click", () => {
        document.body.removeChild(overlay);
    });

    box.appendChild(icon);
    box.appendChild(text);
    box.appendChild(closeBtn);
    overlay.appendChild(box);

    document.body.appendChild(overlay);
}
