
    const owner = "mario-game-fun";
    const repo = "apkgosu";
    const branch = "main";
    const path_git = "https://mario-game-fun.github.io/apkgosu/";

    function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.style.opacity = "1";

    setTimeout(() => {
        toast.style.opacity = "0";
    }, 1500);
}

async function loadFolders(path, containerId) {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
    const res = await fetch(url);
    const items = await res.json();

    if (!Array.isArray(items)) return;

    const container = document.getElementById(containerId);

    for (const item of items) {
        if (item.type === "dir") {
            const card = document.createElement("div");
            card.className = "folder-card";
            
            // Link ảnh logo
            const imgUrl = path_git + item.path + "/logo.webp";
            // Link folder
            const fullPath = path_git + item.path;

            card.innerHTML = `
                <img class="folder-thumb" src="${imgUrl}" alt="${item.name}">
                <div class="folder-name"><b>${item.name}</b></div>
                <div class="folder-actions">
                    <button class="btn-copy-name">Tên</button>
                    <button class="btn-copy-img">Ảnh</button>
                    <button class="btn-copy-path">Path</button>
                </div>
            `;

            // Nút 1: Copy tên (item.name)
            card.querySelector(".btn-copy-name").onclick = (e) => {
                e.stopPropagation(); // Ngăn sự kiện nổi bọt nếu có
                navigator.clipboard.writeText(item.name);
                showToast("Đã copy tên: " + item.name);
            };

            // Nút 2: Copy link ảnh (logo.webp)
            card.querySelector(".btn-copy-img").onclick = (e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(imgUrl);
                showToast("Đã copy link ảnh!");
            };

            // Nút 3: Copy path_git + item.path
            card.querySelector(".btn-copy-path").onclick = (e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(fullPath);
                showToast("Đã copy đường dẫn folder!");
            };

            container.appendChild(card);
        }
    }
}

async function loadFiles(path, containerId, type) {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;

    const res = await fetch(url);
    const files = await res.json();

    if (!Array.isArray(files)) {
        console.error("API error:", files);
        return;
    }

    const container = document.getElementById(containerId);

    files.forEach(file => {
        if (file.type === "file") {
            if (type === "image" && file.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
                const img = document.createElement("img");
                img.src = file.download_url;

                img.onclick = () => {
                    navigator.clipboard.writeText(file.download_url);
                    showToast("Đã copy link ảnh!");
                };

                container.appendChild(img);
            }
            if (type === "video" && file.name.endsWith(".mp4")) {
                const video = document.createElement("video");
                video.src = file.download_url;
                video.controls = true;

                video.onclick = () => {
                    navigator.clipboard.writeText(file.download_url);
                    showToast("Đã copy link video!");
                };

                container.appendChild(video);
            }
        }
    });
} 