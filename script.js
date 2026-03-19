const allGames = document.querySelector(".all-games");
const gamesCategory = document.getElementById("games"); 
const categoryNavigation = document.getElementById("category")
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeBtn = document.getElementById("close");
const newGameTitle =  document.getElementById("title");
const newGameAgeGroup = document.getElementById("ageGroup");
const newGameDifficulty = document.getElementById("difficulty");
const newGameIndoor = document.getElementById("indoor");
const newGameCategory = document.getElementById("categories");
const newGameDescription = document.getElementById("description");
const newGameSubmitBtn = document.getElementById("submit");

//Hämta data med fetch och lägga fram alla spel i HTML
async function getData() {
    allGames.innerHTML=""
    allGames.classList.remove("column-layout")

    try {
        const data = await fetch("http://localhost:3000/games")

        if(!data.ok) {
            throw new Error("Kunde inte hämta spel.")
        }

        const games = await data.json()

        games.forEach(game => {
        const card = document.createElement("div")
        card.classList.add("games")
        const title = document.createElement("h3")
        title.textContent = game.title
        const img = document.createElement("img")
        img.src = game.image

        const readBtn = document.createElement("button")
        readBtn.textContent = "Läs mer"
        readBtn.addEventListener("click", ()=>getOneGame(game.id))

        card.appendChild(title)
        card.appendChild(img)
        card.appendChild(readBtn)
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

//Länka navbaren mot alla spel listan

gamesCategory.addEventListener("click", ()=>{
    allGames.innerHTML=""
    getData()
})

//Länka kategorier i navbaren mot ordnade spel per kategorier
categoryNavigation.addEventListener("click", categoryData)

async function categoryData() {
    allGames.innerHTML=""
    const gameResponse = await fetch("http://localhost:3000/games")
    const gamesDataBas = await gameResponse.json()

    const categoryResponse = await fetch("http://localhost:3000/category")
    const categoryDataBas = await categoryResponse.json()

    categoryDataBas.forEach(category => {
        const categoryTitle = document.createElement("h3")
        categoryTitle.textContent = category.name

        const ul = document.createElement("ul")

        const gamesInCategory = gamesDataBas.filter(game => game.categoryId == category.id)

        gamesInCategory.forEach(game => {
            const li = document.createElement("li")
            li.textContent = game.title
            ul.appendChild(li)
        })

         allGames.appendChild(categoryTitle)
         allGames.appendChild(ul)
         allGames.classList.add("column-layout")
      
    })

}
//Hämta specifik spel i ett fönster
async function getOneGame(id){
   
        const specificGame = await fetch(`http://localhost:3000/games/${id}`)

       
        const game = await specificGame.json()

        modal.style.display ="block"

        modalBody.innerHTML=""

        const titleInput = document.createElement("input")
        titleInput.value = game.title;
        modalBody.appendChild(titleInput)

        const img = document.createElement("img")
        img.src = game.image;
        img.alt = game.title;
        modalBody.appendChild(img)

        const descriptionInput = document.createElement("input")
        descriptionInput.value = game.description
        modalBody.appendChild(descriptionInput)

         const ageInput = document.createElement("input")
        ageInput.value = game.ageGroup
        modalBody.appendChild(ageInput);

        const difficultyInput = document.createElement("input")
        difficultyInput.value = game.difficulty
        modalBody.appendChild(difficultyInput)

        const indoorLabel = document.createElement("label")
        indoorLabel.textContent = "Inomhus: "

        const indoorCheckbox = document.createElement("input")
        indoorCheckbox.type ="checkbox"
        indoorCheckbox.checked = game.indoor

        indoorLabel.appendChild(indoorCheckbox)
        modalBody.appendChild(indoorLabel)

        const saveBtn = document.createElement("button")
        saveBtn.textContent = "Spara ändringar"
        modalBody.appendChild(saveBtn)
        saveBtn.addEventListener("click", () => {
        updateGame(game.id, {
            title : titleInput.value,
            description : descriptionInput.value,
            ageGroup : ageInput.value,
            difficulty : difficultyInput.value,
            indoor: indoorCheckbox.checked,
            categoryId : game.categoryId,
            image : game.image
        });
});

        const deleteBtn = document.createElement("button")
        deleteBtn.textContent = "Ta bort"
        modalBody.appendChild(deleteBtn)
        deleteBtn.addEventListener("click", ()=>{
            deleteGame(game.id);
            modal.style.display ="none";
        })

        closeBtn.onclick =()=> {
            modal.style.display ="none"
        }
        
   
}

//Lägga en ny spel
newGameSubmitBtn.addEventListener("click", ()=>addNewGame())

async function addNewGame() {

    const response = await fetch("http://localhost:3000/games", {
        method: "POST",
        headers :{
            "Content-type" : "application/json"
        },
        body :JSON.stringify(
            {
                title :newGameTitle.value,
                ageGroup :newGameAgeGroup.value,
                categoryId : newGameCategory.value,
                difficulty : newGameDifficulty.value,
                indoor : newGameIndoor.value,
                description : newGameDescription.value,
                image: "./images/newgame.png"
            }
        )

    })
    await response.json()
    getData()
    
}

//Updatera spel
async function updateGame(id, updatedGame) {
    const response = await fetch(`http://localhost:3000/games/${id}`, 
        {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedGame)
  });
  await response.json();
  modal.style.display ="none"
  getData();
}

//Ta bort spel
async function deleteGame(id) {
    const response = await fetch(`http://localhost:3000/games/${id}`, {
        method : "DELETE",
})
    const data = response.json()
    getData()
}