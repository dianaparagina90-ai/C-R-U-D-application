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

//Länka kategorier i navbaren mot ordnade spel per kategori
categoryNavigation.addEventListener("click", categoryData)

async function categoryData() {
    allGames.innerHTML=""
    
    try {    
    const gameResponse = await fetch("http://localhost:3000/games")
     if(!gameResponse.ok){
            throw new Error("Kunde inte hämta spel");
        }
    const gamesDataBas = await gameResponse.json()

    const categoryResponse = await fetch("http://localhost:3000/category")
     if(!categoryResponse.ok){
            throw new Error("Kunde inte hämta kategorier");
        }
    const categoryDataBas = await categoryResponse.json()

    
    categoryDataBas.forEach(category => {
        
        const categoryTitle = document.createElement("h3")
        categoryTitle.textContent = `Kategori: ${category.name}`;

        const ul = document.createElement("ul")

        const gamesInCategory = gamesDataBas.filter(game => game.categoryId == category.id)

        gamesInCategory.forEach(game => {
            const li = document.createElement("li")
            li.textContent = game.title
            ul.appendChild(li)
        })
         
         allGames.appendChild(categoryTitle)
         allGames.appendChild(ul)
        
      
    })
    } catch (error) {
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "⚠️ Något gick fel när spelen skulle laddas. Försök igen senare.";
        errorMessage.style.color = "red";

        allGames.appendChild(errorMessage);

        console.error(error);
    }

}
//Hämta specifik spel i ett fönster med läs mer knappen
async function getOneGame(id){

        try {
        const categoryResponse = await fetch("http://localhost:3000/category");
        if(!categoryResponse.ok){
            throw new Error("Kunde inte hämta kategorier");
        }
        
        const categories = await categoryResponse.json()
   
        const specificGame = await fetch(`http://localhost:3000/games/${id}`)

         if(!specificGame.ok){
            throw new Error("Kunde inte hämta spelet");
        }
       
        const game = await specificGame.json()

        modal.style.display ="block"

        modalBody.innerHTML=""
        //Skapa HTML element för varje nyckelvärde
        const titleLabel = document.createElement("label")
        titleLabel.textContent = "Spel"
        const titleInput = document.createElement("input")
        titleInput.value = game.title;
        titleLabel.appendChild(titleInput)
        modalBody.appendChild(titleLabel)

        const img = document.createElement("img")
        img.src = game.image;
        img.alt = game.title;
        modalBody.appendChild(img)

        const descriptionLabel = document.createElement("label")
        descriptionLabel.textContent = "Beskrivning"
        const descriptionInput = document.createElement("textarea")
        descriptionInput.value = game.description;
        descriptionInput.rows = "4"

        descriptionLabel.appendChild(descriptionInput)
        modalBody.appendChild(descriptionLabel)

        const categoryLabel= document.createElement("label");
        categoryLabel.textContent= "Kategori:"

        const categorySelect = document.createElement("select");

        categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.id;
            option.textContent = cat.name;

            if (cat.id == game.categoryId) {
                option.selected = true
            }

            categorySelect.appendChild(option)
        })

        categoryLabel.appendChild(categorySelect)
        modalBody.appendChild(categoryLabel)

        const ageLabel = document.createElement("label")
        ageLabel.textContent = "Ålder"
        const ageInput = document.createElement("input")
        ageInput.value = game.ageGroup
        ageLabel.appendChild(ageInput)
        modalBody.appendChild(ageLabel);

        const difficultyLabel = document.createElement("label")
        difficultyLabel.textContent = "Svårighet";
        const difficultyInput = document.createElement("input")
        difficultyInput.value = game.difficulty
        difficultyLabel.appendChild(difficultyInput)
        modalBody.appendChild(difficultyLabel)

        const indoorLabel = document.createElement("label")
        indoorLabel.textContent = "Inomhus: "

        const indoorCheckbox = document.createElement("input")
        indoorCheckbox.type ="checkbox"
        indoorCheckbox.checked = game.indoor

        indoorLabel.appendChild(indoorCheckbox)
        modalBody.appendChild(indoorLabel)

        //Skapa ändra och ta bort knappar för att redigera spelen
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
            categoryId : Number(categorySelect.value),
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
        
    } catch (error) {
             alert("⚠️ Kunde inte visa spelet");
             console.error(error);
        }
}

//Länka submit knappen mot funktionen
newGameSubmitBtn.addEventListener("click", ()=>addNewGame())

//Lägga ett nytt spel
async function addNewGame() {

    try {
        
    
    const response = await fetch("http://localhost:3000/games", {
        method: "POST",
        headers :{
            "Content-type" : "application/json"
        },
        body :JSON.stringify(
            {
                title :newGameTitle.value,
                ageGroup :newGameAgeGroup.value,
                categoryId : Number(newGameCategory.value),
                difficulty : newGameDifficulty.value,
                indoor : newGameIndoor.value === "true",
                description : newGameDescription.value,
                image: "./images/newgame.png"
            }
        )

    })

     if(!response.ok){
            throw new Error("Kunde inte skapa spel");
        }

    await response.json()
    getData()

    } catch (error) {
        alert("⚠️ Kunde inte spara spelet");
        console.error(error);
    }
}

//Updatera spel
async function updateGame(id, updatedGame) {
    try {
        
   
    const response = await fetch(`http://localhost:3000/games/${id}`, 
        {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedGame)
  });

   if(!response.ok){
            throw new Error("Kunde inte uppdatera spel");
        }

  await response.json();
  modal.style.display ="none"
  getData();
   } catch (error) {
        alert("⚠️ Kunde inte uppdatera spelet");
        console.error(error);
    }
}

//Ta bort spel
async function deleteGame(id) {
    try {
        
    
    const response = await fetch(`http://localhost:3000/games/${id}`, {
        method : "DELETE",
})

      if(!response.ok){
            throw new Error("Kunde inte ta bort spel");
        }

    await response.json()
    getData()
    } catch (error) {
        alert("⚠️ Kunde inte ta bort spelet");
        console.error(error);

    }
}