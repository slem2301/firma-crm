const extensions = [
    "png",
    // "ico"
];

export const loadImage = (
    url: string,
    callback: (path: string) => void,
    i: number = 0
) => {
    try {
        if (!extensions[i]) return;
        const img = document.createElement("img");
        img.src = "https://" + url + "/favicon." + extensions[i];
        img.onload = () => callback(img.src);
        img.onerror = () => loadImage(url, callback, i + 1);
    } catch (e) {}
};
