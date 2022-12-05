// Eu prefiro usar o const do que simplesmente colocar vírgulas para separar as constantes.
// Acho que fica mais simples de entender o que foi feito.
const wrapper = document.querySelector(".wrapper");
const musicImg = wrapper.querySelector(".img-area img");
const musicName = wrapper.querySelector(".song-details .name");
const musicArtist = wrapper.querySelector(".song-details .artist");
const mainAudio = wrapper.querySelector("#main-audio");
const playPauseBTN = wrapper.querySelector(".play-pause");
const nextBTN = wrapper.querySelector("#next");
const prevBTN = wrapper.querySelector("#prev");
const progressArea = wrapper.querySelector(".progress-area");
const progressBar = wrapper.querySelector(".progress-bar");
const musicList = wrapper.querySelector(".music-list");
const showMoreBTN = wrapper.querySelector("#more-music");
const hideMusicBTN = musicList.querySelector("#close");

// This was used so each time we refresh the browser, starts in a different song.
let musicIndex = randomIndex = Math.floor((Math.random() * allMusic.length) + 1);

// *****************
// *** FUNCTIONS ***
// *****************

// Load Music Function
// Here, we'll manipulate the selected song's data
function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `./src/images/${allMusic[indexNumb - 1].img}`;
    mainAudio.src = `./src/music/${allMusic[indexNumb - 1].src}`;
};

// Play music function
function playMusic() {
    wrapper.classList.add("paused");
    playPauseBTN.querySelector("i").innerText = "pause";
    mainAudio.play();
};

// Pause music function
function pauseMusic() {
    wrapper.classList.remove("paused");
    playPauseBTN.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
};

// A música que será tocada é indicada pelo índice (musicIndex), 
// então, as funções de Próxima e Anterior basicamente incrementam 
// e decrementam esse índice.

// Next music function
function nextMusic(){
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
        // Aqui, quando o musicIndex for maior que o tamanho do vetor de músicas, 
        // o índice recebe 1 para voltar para a primeira música.
        // do contrário, ele é recebe o índice já atribuído anteriormente.
    loadMusic(musicIndex);
    playMusic();
    playingNow();
};

// Previous music function
function prevMusic(){
    musicIndex--;
    musicIndex == 0 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
};

// **************
// *** EVENTS ***
// **************

// Calling the load music function once window it's loaded
window.addEventListener("load", () => {
    loadMusic(musicIndex);
    playingNow();
});

// Play-Pause event
playPauseBTN.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused");
    // se isMusicPaused for verdade, é o mesmo que dizer que o 
    // botão de pause está clicado, então dar o comando de pausar a música

    // se isMusicPaused for falso, é o mesmo que dizer que 
    // a música está tocando, então chamar o play.
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();
});

// Next music btn event
nextBTN.addEventListener("click", () => {
    nextMusic();
});

// Previous music btn event
prevBTN.addEventListener("click", () => {
    prevMusic();
});

// Update progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;   // getting the current time of song
    const duration = e.target.duration;         // getting the total duration of song
    let progressWidth = (currentTime / duration ) * 100; 
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current");
    let musicDuration = wrapper.querySelector(".duration");
    
    // updating song duration
    mainAudio.addEventListener("loadeddata", () => {
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor( audioDuration / 60 );
        let totalSec= Math.floor( audioDuration % 60 );
        if ( totalSec < 10 ){ // Adding 0 in left of the second if sec is less than 10
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });

    // updating playing song current time
    let currentMin = Math.floor( currentTime / 60 );
    let currentSec= Math.floor( currentTime % 60 );

    if ( currentSec < 10 ){ // Adding 0 in left of the second if sec is less than 10
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// Updating the playing song current time according to the progress bar width
progressArea.addEventListener("click", (e) => {
    let progressWidthval = progressArea.clientWidth; // getting width of progress bar
    let clickedOffSetX = e.offsetX; // getting offset X value
    let songDuration = mainAudio.duration; // getting song total duration

    mainAudio.currentTime = ( clickedOffSetX / progressWidthval) * songDuration;
    playMusic();
}); 

// BTN Repeat and Shuffle song
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
    // first we get the innerText of the icon we'll change accordingly
    let getText = repeatBtn.innerText; // getting the innerText of icon
    // let's do different changes on different icon click using switch
    switch(getText){
        case "repeat": // If this icon is repeat, let's change it to repeat_one
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song looped");
            break
        case "repeat_one": // if the icon is repeat_one, let's change it to shuffle
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playlist shuffle");
            break
        case "shuffle": // if the icon is shuffle, let's change it to repeat
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "PLaylist looped");
            break
    };
});

mainAudio.addEventListener("ended", () => {
    // Here, we'll do according to the icon means.
    // If the user has set icon to:
    // -> repeat the playlist, then we'll just go to the next song
    // -> loop song (repeat_one), then we'll repeat the current song
    // -> shuffle, we'll generate a random index to the next song

    let getText = repeatBtn.innerText; // getting the innerText of icon
    switch(getText){
        case "repeat": 
            // Just call the nextMusic function, so the next song will be played
            nextMusic();
            break;
        case "repeat_one": 
            // Let's load the same musicIndex and play the current playing song from begining
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle":
            // Let's generate random index between the max range of array length
            let randomIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do{
                randomIndex = Math.floor((Math.random() * allMusic.length) + 1);
            } while(musicIndex == randomIndex);
                // this loop will run until next random number won't be the same as the current music index.
            musicIndex = randomIndex; // passing the randomIndex to musicIndex so the random song will play
            loadMusic(musicIndex);
            playMusic();
            playingNow();
            break;
    };
});

// ************************
// *** SHOW MORE MUSICS ***
// ************************

showMoreBTN.addEventListener("click", () => {
    musicList.classList.toggle("show");
});

hideMusicBTN.addEventListener("click", () => {
    showMoreBTN.click();
    // Como a função showMoreBTN executa um toggle na classe show,
    // Para fechar a janela com a lista de múscas, basta chamar a função showMoreBTN.
});

const ulTag = wrapper.querySelector("ul");
// Let's create li according to the array length
for ( let i = 0; i < allMusic.length; i++ ){
    let liTag = `
        <li li-index="${i + 1}">
            <div class="row">
                <span>${allMusic[i].name}</span>
                <p>${allMusic[i].artist}</p>
            </div>
            <span  id="${allMusic[i].id_src}" class="audio-duration">${allMusic[i].music_duration}</span>
            <audio class="${allMusic[i].id_src}" src="./src/music/${allMusic[i].src}"></audio>
        </li>
    `; 
    ulTag.insertAdjacentHTML("beforeend", liTag);   //inserting the li inside ul tag
};

// Let's work on play particular song on click
const allLiTags = ulTag.querySelectorAll("li");
function playingNow(){
    for( let j = 0; j < allLiTags.length; j++ ){
        let audioTag = allLiTags[j].querySelector(".audio-duration");
        // let's remove playing class from all other li expect the last one which is called
        if(allLiTags[j].classList.contains("playing") ){
            allLiTags[j].classList.remove("playing");
            audioTag.innerText = allMusic[j].music_duration;
        }
        // if there is an li tag which li-index is equal to music index
        // then this music is playing now and we'll style it
        if(allLiTags[j].getAttribute("li-index") == musicIndex ){
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "Playing";
        };
    
        // adding onclick attribute in all li tags
        allLiTags[j].setAttribute("onclick", "clicked(this)");
    };
}

// let's play song on li click
function clicked(element){
    // getting li index of particular clicked li tag
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex; // Passing that LiIndex to MusicIndex
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}