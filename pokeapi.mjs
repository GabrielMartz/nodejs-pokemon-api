import http from "node:http"
import fs from "node:fs"

const Pokemons = JSON.parse(fs.readFileSync("./pokemons/pokemons.json","utf-8"))
const PORT = process.env.PORT || 3000;
const pokeapi = http.createServer((req,res)=>{
    const { url , method } = req
    switch (method){
        case "GET":{
            
             switch (url){
                case "/":{
                    res.writeHead(200,{"Content-Type":"application/json"})
                    res.end(JSON.stringify({message:"Welcome to the PokeAPI"}))
                    break

                }
                case "/pokemons":{
                    res.writeHead(200,{"Content-Type":"application/json"})
                    res.end(JSON.stringify(Pokemons))
                    break
                }
                default:{
                    const queryUrl = new URL(url,`http://${req.headers.host}`)
                    if(!queryUrl.search){
                        res.writeHead(404,{"Content-Type":"text/plain"})
                        res.end("Not Found 404 - method get")
                        break
                    }
                    if(queryUrl.searchParams.has("name")){
                        const pokemon = Pokemons.find(p => p.nombre === queryUrl.searchParams.get("name"))
                        if(pokemon){
                            res.writeHead(200,{"Content-Type":"application/json"})
                            res.end(JSON.stringify(pokemon))
                            break
                        }else{
                           res.writeHead(400,{"Content-Type":"text/plain"})
                            res.end("Not Found 400 - pokemon not found - bad request")
                            break 
                        }
                    }
                    if(queryUrl.searchParams.has("type")){
                        const pokemons = Pokemons.filter(p => p.tipo.includes(queryUrl.searchParams.get("type")))
                        res.writeHead(200,{"Content-Type":"application/json"})
                        res.end(JSON.stringify(pokemons))
                        break
                    }else{
                            res.writeHead(400,{"Content-Type":"text/plain"})
                            res.end("Not Found 400 - pokemon not found - bad request")
                            break 
                    }
                    
                }
                    break

            }
                    break
            
        }
         case "POST":{
            switch (url){
                    case "/pokemons":{
                        let body = ""
                        req.on("data",chunk=>{
                            body += chunk.toString()
                        })
                        req.on("end",()=>{
                            try{
                                const newPokemon = JSON.parse(body)
                                if (!newPokemon.nombre || !newPokemon.tipo || !newPokemon.nivel || !newPokemon.hp) {
                                    res.writeHead(400,{"Content-Type":"application/json"})
                                    res.end(JSON.stringify({error:"Bad Request 400 - Missing required fields"}))
                                    return
                                }
                                const existingPokemon = Pokemons.find(p => p.nombre === newPokemon.nombre)
                                if (existingPokemon) {
                                    res.writeHead(400,{"Content-Type":"application/json"})
                                    res.end(JSON.stringify({error:"Bad Request 400 - Pokemon already exists"}))
                                    return
                                }
                                Pokemons.push(newPokemon)
                                
                                try {
                                fs.writeFileSync(
                                    "./pokemons/pokemons.json",
                                    JSON.stringify(Pokemons, null, 2)
                                );

                                console.log("Archivo guardado");
                                } catch (err) {
                                    console.error(err);
                                }
                                res.writeHead(201,{"Content-Type":"application/json"})
                                res.end(JSON.stringify({message:"Pokemon created successfully", pokemon:newPokemon}))

                            } catch (error) {
                                res.writeHead(400,{"Content-Type":"application/json"})
                                res.end(JSON.stringify({error:"Bad Request 400 - Invalid JSON", details:error.message}))
                            }
                        })
                        break
                    }
                    default:{
                        res.writeHead(404,{"Content-Type":"application/json"})
                        res.end(JSON.stringify({error:"Not Found 404"}))
                        break
                            }
                        }  
                    break

                    }
            case "PUT":{
                if(url === "/pokemons/update"){
                    
                let body = ""
                req.on("data",chunk=>{
                    body += chunk.toString()
                })
                req.on("end",()=>{
                    try{
                        const updatedPokemon = JSON.parse(body)
                        const index = Pokemons.findIndex(p => p.nombre === updatedPokemon.nombre)
                        if (index === -1) {
                            res.writeHead(404,{"Content-Type":"application/json"})
                            res.end(JSON.stringify({error:"Not Found 404 - Pokemon not found"}))
                            return
                        }
                        Pokemons[index] = updatedPokemon
                        try {
                                fs.writeFileSync(
                                    "./pokemons/pokemons.json",
                                    JSON.stringify(Pokemons, null, 2)
                                );

                                console.log("Archivo guardado");
                                } catch (err) {
                                    res.writeHead(500,{"Content-Type":"application/json"})
                                    res.end(JSON.stringify({error:"Internal Server Error 500 - Could not save file", details:err.message}))
                                    return
                                }
                        res.writeHead(200,{"Content-Type":"application/json"})
                        res.end(JSON.stringify({message:"Pokemon updated successfully", pokemon:updatedPokemon}))
                        } catch (error) {
                            res.writeHead(400,{"Content-Type":"application/json"})
                            res.end(JSON.stringify({error:"Bad Request 400 - Invalid JSON", details:error.message}))
                        }
                    }
                )
            }
            else{
                res.writeHead(404,{"Content-Type":"application/json"})
                res.end(JSON.stringify({error:"Not Found 404 - Invalid URL"}))
                
            }
            break
        }
            case "DELETE":{
                const queryUrl = new URL(url,`http://${req.headers.host}`)
                if(!queryUrl.search){
                    res.writeHead(404,{"Content-Type":"text/plain"})
                    res.end("Not Found 404 - method delete")
                    break
                }
                if(queryUrl.searchParams.has("id")){
                    const id = parseInt(queryUrl.searchParams.get("id"))
                    const index = Pokemons.findIndex(p => {
                        return p.id === id;

                    })
                    if (index === -1) {
                        res.writeHead(404,{"Content-Type":"application/json"})
                        res.end(JSON.stringify({error:"Not Found 404 - Pokemon not found"}))
                        return
                    }
                    Pokemons.splice(index, 1)
                    try {
                        fs.writeFileSync(
                            "./pokemons/pokemons.json",
                            JSON.stringify(Pokemons, null, 2)
                        );

                        console.log("Archivo guardado");
                    } catch (err) {
                        res.writeHead(500,{"Content-Type":"application/json"})
                        res.end(JSON.stringify({error:"Internal Server Error 500 - Could not save file", details:err.message}))
                        return
                    }
                    res.writeHead(200,{"Content-Type":"application/json"})
                    res.end(JSON.stringify({message:"Pokemon deleted successfully"}))
                }
                if(queryUrl.searchParams.has("name")){
                    const name = queryUrl.searchParams.get("name")
                    const index = Pokemons.findIndex(p => p.nombre === name)
                    if (index === -1) {
                        res.writeHead(404,{"Content-Type":"application/json"})
                        res.end(JSON.stringify({error:"Not Found 404 - Pokemon not found"}))
                        return
                    }
                    Pokemons.splice(index, 1)
                    try {
                        fs.writeFileSync(
                            "./pokemons/pokemons.json",
                            JSON.stringify(Pokemons, null, 2)
                        );

                        console.log("Archivo guardado");
                    } catch (err) {
                        res.writeHead(500,{"Content-Type":"application/json"})
                        res.end(JSON.stringify({error:"Internal Server Error 500 - Could not save file", details:err.message}))
                        return
                    }
                    res.writeHead(200,{"Content-Type":"application/json"})
                    res.end(JSON.stringify({message:"Pokemon deleted successfully"}))
                }
            break
}}
}
)
pokeapi.listen(PORT,()=>console.log(`Server running on port ${PORT}`))