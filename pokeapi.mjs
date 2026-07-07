import http from "node:http"
import fs from "node:fs"
import Pokemons from "./pokemons/pokemons.json" with {type:"json"}

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
}
}
)
pokeapi.listen(3000,()=>console.log("Server running on port 3000"))