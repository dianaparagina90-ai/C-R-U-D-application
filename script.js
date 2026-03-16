
async function getData() {
    const data = await fetch("http://localhost:3000/games")
    const databas = await data.json()
    return databas 
}

