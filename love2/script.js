let packageData = {
    pass: "123",
    date: "",
    msg1: "",
    msg2: "",
    images: [],
    music: ""
};

let tempImages = [];
let tempMusic = "";

window.onload = function() {
    const saved = localStorage.getItem('romance_package_v5');
    if (saved) {
        try {
            packageData = JSON.parse(saved);
            showOnly('stepPassword');
            return;
        } catch(e) {}
    }
    showOnly('generatorCard');
};

function handleImagesSelect(input) {
    const files = Array.from(input.files).slice(0, 12);
    tempImages = [];
    let loaded = 0;

    if(files.length === 0) return;

    document.getElementById('imagesCountStatus').innerText = "جاري ضغط وتجهيز الصور... ⏳";

    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            compressImg(e.target.result, 400, 0.5, function(compressed) {
                tempImages.push(compressed);
                loaded++;
                document.getElementById('imagesCountStatus').innerText = `تم اختيار وتجهيز ${loaded} صورة بنجاح ✅`;
            });
        };
        reader.readAsDataURL(file);
    });
}

function compressImg(base64, maxW, qual, cb) {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
        const cvs = document.createElement('canvas');
        let w = img.width, h = img.height;
        if (w > maxW) { h = Math.round((h * maxW) / w); w = maxW; }
        cvs.width = w; cvs.height = h;
        const ctx = cvs.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        cb(cvs.toDataURL('image/jpeg', qual));
    };
}

function handleMusicSelect(input) {
    const file = input.files[0];
    if (file) {
        document.getElementById('musicStatus').innerText = "جاري تجهيز الأغنية... ⏳";
        const reader = new FileReader();
        reader.onload = function(e) {
            tempMusic = e.target.result;
            document.getElementById('musicStatus').innerText = "تم اختيار الأغنية بنجاح 🎵";
        };
        reader.readAsDataURL(file);
    }
}

function saveAndStart() {
    packageData = {
        pass: document.getElementById('cfgPass').value.trim() || "123",
        date: document.getElementById('cfgDate').value.trim() || "تاريخ ارتباطنا",
        msg1: document.getElementById('cfgMsg1').value.trim() || "بحبك جداً يا روحي",
        msg2: document.getElementById('cfgMsg2').value.trim() || "أنتي كل حاجة في حياتي",
        images: tempImages.length > 0 ? tempImages : ["https://picsum.photos/300/400"],
        music: tempMusic
    };

    try {
        localStorage.setItem('romance_package_v5', JSON.stringify(packageData));
        const fullURL = window.location.origin + window.location.pathname;
        
        document.getElementById('siteUrlInput').value = fullURL;
        document.getElementById('linkOutput').style.display = 'block';

        // توليد الـ QR Code تلقائياً
        const qrContainer = document.getElementById('qrcode');
        qrContainer.innerHTML = "";
        new QRCode(qrContainer, {
            text: fullURL,
            width: 160,
            height: 160,
            colorDark: "#0f051d",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

    } catch(e) {
        alert("الملفات كبيرة جداً، يرجى اختيار عدد صور أقل أو ملف صوتي بحجم أصغر.");
    }
}

function copySiteUrl() {
    const copyText = document.getElementById("siteUrlInput");
    copyText.select();
    document.execCommand("copy");
    alert("تم نسخ الرابط! ابعتهولها دلوقتي على الواتساب ❤️");
}

function resetSettings() {
    localStorage.removeItem('romance_package_v5');
    location.reload();
}

function showOnly(id) {
    document.querySelectorAll('.container .card').forEach(c => c.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

function checkPassword() {
    const val = document.getElementById('passInput').value;
    if (val === packageData.pass) {
        document.getElementById('errorArea').classList.add('hidden');
        
        if (packageData.music) {
            const audio = document.getElementById('bgMusic');
            audio.src = packageData.music;
            audio.play().catch(()=>{});
        }

        showOnly('stepCinematic');
        startCinematicSequence();
    } else {
        document.getElementById('errorArea').classList.remove('hidden');
    }
}

function startCinematicSequence() {
    const canvas = document.getElementById('matrixCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;

    const chars = "01 I LOVE YOU ❤️ CODE LOVE 💖";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    let matrixInterval = setInterval(() => {
        ctx.fillStyle = 'rgba(15, 5, 29, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00ff66';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            let text = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }, 50);

    setTimeout(() => {
        clearInterval(matrixInterval);
        canvas.style.display = 'none';
        document.getElementById('heartShapeContainer').classList.add('show');

        setTimeout(() => {
            document.getElementById('hugContainer').classList.add('show');
            document.getElementById('btnAfterCinematic').classList.remove('hidden');
        }, 1500);

    }, 7000);
}

function goToStep(stepId) {
    showOnly(stepId);
    if (stepId === 'stepMsg1Container') {
        typeEffect('typingMsg1', packageData.msg1, () => {
            document.getElementById('btnAfterMsg1').classList.remove('hidden');
        });
    } else if (stepId === 'stepAlbum') {
        setupAlbum();
    } else if (stepId === 'stepMsg2Container') {
        typeEffect('typingMsg2', packageData.msg2, () => {
            document.getElementById('btnAfterMsg2').classList.remove('hidden');
        });
    }
}

function typeEffect(elementId, text, callback) {
    const el = document.getElementById(elementId);
    el.innerHTML = "";
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            el.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
            if (callback) callback();
        }
    }, 50);
}

function setupAlbum() {
    document.getElementById('displayDate').innerText = "تاريخ ارتباطنا: " + (packageData.date || "أجمل تاريخ");
    const container = document.getElementById('albumContainer');
    container.innerHTML = "";
    let imgs = packageData.images && packageData.images.length > 0 ? packageData.images : ["https://picsum.photos/300/400"];

    imgs.forEach((url, idx) => {
        let card = document.createElement('div');
        card.className = 'album-card';
        card.style.zIndex = imgs.length - idx;
        card.innerHTML = `<img src="${url}">`;
        card.onclick = function() {
            this.style.transform = 'translateX(-150%) rotate(-20deg)';
            this.style.opacity = '0';
            setTimeout(() => { container.appendChild(this); this.style.transform = ''; this.style.opacity = '1'; }, 600);
        };
        container.appendChild(card);
    });
}

function startFinalShowcase() {
    showOnly('stepFinalShowcase');
    const showcase = document.getElementById('stackShowcase');
    showcase.innerHTML = "";
    let imgs = packageData.images && packageData.images.length > 0 ? packageData.images : ["https://picsum.photos/300/400"];

    imgs.forEach((url) => {
        let img = document.createElement('img');
        img.src = url;
        img.className = 'stack-img';
        showcase.appendChild(img);
    });

    const stackImages = document.querySelectorAll('.stack-img');
    let current = 0;
    function showNextImage() {
        if(current < stackImages.length) {
            stackImages[current].classList.add('active');
            current++;
            setTimeout(showNextImage, 2500);
        }
    }
    showNextImage();
}