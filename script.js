const allGames = document.querySelector(".all-games");

async function getData() {

    try {
        const data = await fetch("http://localhost:3000/games")

        if(!data.ok) {
            throw new Error("Kunde inte hämta spel från servern.")
        }

        const games = await data.json()

        games.forEach(game => {
        const card = document.createElement("div")
        card.classList.add("games")
        const title = document.createElement("h3")
        title.textContent = game.title
        const img = document.createElement("img")
        img.src = game.image

        const button = document.createElement("button")
        button.textContent = "Läs mer"

        card.appendChild(title)
        card.appendChild(img)
        card.appendChild(button)
        allGames.appendChild(card)

        });
        
    } catch (error) {
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "⚠️ Något gick fel när spelen skulle laddas. Försök igen senare.";
        errorMessage.style.color = "red";

        allGames.appendChild(errorMessage);

        console.error(error);
    } 
}

getData()
