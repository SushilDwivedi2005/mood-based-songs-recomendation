// JavaScript File - app.js

const clientId = "c7c586b5bc89471f9cff230ea92af2ba"; // Replace with your client ID
const clientSecret = "518d8fe7c7554945af1029cc2471d370"; // Replace with your client secret

// Function to get Spotify Access Token
async function getToken() {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + btoa(clientId + ":" + clientSecret)
        },
        body: "grant_type=client_credentials"
    });

    const data = await response.json();
    return data.access_token;
}

// Function to search for songs based on mood
async function searchSongs(mood) {
    const token = await getToken();
    const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=${mood}&type=playlist&limit=5`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    const data = await searchResponse.json();
    const playlists = data.playlists?.items || [];
    return playlists;
}

// Function to display the songs (playlists) based on the search results
async function displaySongs(mood) {
    const playlists = await searchSongs(mood);
    const songListContainer = document.getElementById("song-list");

    if (!playlists || playlists.length === 0) {
        songListContainer.innerHTML = "No songs found";
        return;
    }

    songListContainer.innerHTML = ""; // Clear the container

    playlists.forEach(playlist => {
        if (!playlist || !playlist.name) {
            console.error("Invalid playlist data:", playlist); // Debugging
            return; // Skip invalid data
        }

        const songElement = document.createElement("div");
        songElement.classList.add("song-item");

        songElement.innerHTML = `
            <h3>${playlist.name}</h3>
            <img src="${playlist.images?.[0]?.url || 'default.jpg'}" alt="${playlist.name}" />
            <a href="https://open.spotify.com/playlist/${playlist.id}" target="_blank">Open on Spotify</a>
        `;

        songListContainer.appendChild(songElement);
    });
}

// Event listener for the search button
document.getElementById("search-btn").addEventListener("click", () => {
    const selectedMood = document.getElementById("mood-selector").value;
    displaySongs(selectedMood); // Fetch songs based on selected mood
});

