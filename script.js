document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audio');
    const playBtn = document.getElementById('play');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const shuffleBtn = document.getElementById('shuffle');
    const fileInput = document.getElementById('fileInput');
    const coverInput = document.getElementById('coverInput');
    const cover = document.getElementById('cover');
    const volumeControl = document.getElementById('volume');
    const title = document.getElementById('title');
    const album = document.getElementById('album');
    const author = document.getElementById('author');
    
    let isPlaying = false;
    let isShuffling = false;
    let songIndex = 0;
    let songs = [];

    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            playBtn.textContent = '▶️';
        } else {
            audio.play();
            playBtn.textContent = '⏸️';
        }
        isPlaying = !isPlaying;
    });

    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);

    shuffleBtn.addEventListener('click', () => {
        isShuffling = !isShuffling;
        shuffleBtn.style.color = isShuffling ? 'green' : 'white';
    });

    fileInput.addEventListener('change', (e) => {
        songs = Array.from(e.target.files);
        loadSong(songs[songIndex]);
    });

    audio.addEventListener('ended', () => {
        if (isShuffling) {
            songIndex = Math.floor(Math.random() * songs.length);
        } else {
            songIndex = (songIndex + 1) % songs.length;
        }
        loadSong(songs[songIndex]);
        audio.play();
    });

    coverInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                cover.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    function loadSong(song) {
        const url = URL.createObjectURL(song);
        audio.src = url;
        title.textContent = song.name;
        album.textContent = 'Album: Unknown';
        author.textContent = 'Author: Unknown';
        playBtn.textContent = '▶️';
        isPlaying = false;
        
        jsmediatags.read(song, {
            onSuccess: function(tag) {
                const tags = tag.tags;
                if (tags.title) title.textContent = tags.title;
                if (tags.album) album.textContent = 'Album: ' + tags.album;
                if (tags.artist) author.textContent = 'Author: ' + tags.artist;
                if (tags.picture) {
                    const picture = tags.picture;
                    let base64String = "";
                    for (let i = 0; i < picture.data.length; i++) {
                        base64String += String.fromCharCode(picture.data[i]);
                    }
                    cover.src = `data:${picture.format};base64,${window.btoa(base64String)}`;
                }
            },
            onError: function(error) {
                console.log(error);
            }
        });
    }

    function prevSong() {
        songIndex = (songIndex - 1 + songs.length) % songs.length;
        loadSong(songs[songIndex]);
        if (isPlaying) audio.play();
    }

    function nextSong() {
        songIndex = (songIndex + 1) % songs.length;
        loadSong(songs[songIndex]);
        if (isPlaying) audio.play();
    }

    volumeControl.addEventListener('input', (e) => {
        audio.volume = e.target.value;
    });

    // Starfield Animation by 07ker
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let stars = [];
    const numStars = 200;

    function initStars() {
        stars = [];
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5,
                dx: (Math.random() - 0.5) * 0.5,
                dy: (Math.random() - 0.5) * 0.5,
            });
        }
    }

    function drawStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function updateStars() {
        stars.forEach(star => {
            star.x += star.dx;
            star.y += star.dy;

            if (star.x < 0 || star.x > canvas.width) star.dx = -star.dx;
            if (star.y < 0 || star.y > canvas.height) star.dy = -star.dy;
        });
    }

    function animateStars() {
        updateStars();
        drawStars();
        requestAnimationFrame(animateStars);
    }

    initStars();
    animateStars();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initStars();
    });
});