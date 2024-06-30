let selectedFiles = [];

document.getElementById('fileInput').addEventListener('change', (event) => {
    selectedFiles = Array.from(event.target.files).slice(0, 100);
    document.getElementById('options').style.display = 'block';
});

async function resizeImages(scale) {
    const zip = new JSZip();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    for (let file of selectedFiles) {
        const img = await createImageBitmap(file);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const resizedBlob = await new Promise(resolve => {
            canvas.toBlob(resolve, 'image/jpeg', 0.9);
        });

        zip.file(file.name, resizedBlob);
    }

    const zipBlob = await zip.generateAsync({type: 'blob'});
    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'İndir';
    downloadButton.className = 'btn btn-success';
    downloadButton.onclick = () => saveAs(zipBlob, 'resized_images.zip');
    
    const downloadArea = document.getElementById('downloadArea');
    downloadArea.innerHTML = '';
    downloadArea.appendChild(downloadButton);
}

function clearPage() {
    location.reload();
}