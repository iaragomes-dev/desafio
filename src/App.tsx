import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"

interface Pokemon {
  name: string
  url: string
}

function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get("https://pokeapi.co/api/v2/pokemon?limit=151")
      .then(res => {
        setPokemons(res.data.results)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"20px", padding:"20px"}}>
      {pokemons.map((pokemon) => {
        const id = pokemon.url.split("/").filter(Boolean).pop()
        const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`

        return (
          <Link key={pokemon.name} to={`/pokemon/${pokemon.name}`} style={{textDecoration:"none", color:"black"}}>
            <div style={{border:"1px solid #ddd", padding:"10px", textAlign:"center"}}>
              <img src={image} style={{height:"100px"}} />
              <p style={{textTransform:"capitalize"}}>{pokemon.name}</p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

function Details() {
  const { name } = useParams()
  const [pokemon, setPokemon] = useState<any>(null)

  useEffect(() => {
    if (!name) return
    axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then(res => setPokemon(res.data))
  }, [name])

  if (!pokemon) return <p>Loading...</p>

  return (
    <div style={{textAlign:"center", padding:"20px"}}>
      <h1 style={{textTransform:"capitalize"}}>{pokemon.name}</h1>
      <img src={pokemon.sprites.other["official-artwork"].front_default} style={{height:"200px"}} />
      <p>Height: {pokemon.height}</p>
      <p>Weight: {pokemon.weight}</p>
      <p>Types: {pokemon.types.map((t:any) => t.type.name).join(", ")}</p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokemon/:name" element={<Details />} />
      </Routes>
    </BrowserRouter>
  )
}