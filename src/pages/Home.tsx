import { useEffect, useState } from "react";
import { getPokemonList } from "../api/pokemon.service";
import { PokemonListItem } from "../types/pokemon";
import { Link } from "react-router-dom";
import { useTeam } from "../context/TeamContext";
import { extractIdFromUrl } from "../utils/extractId";

export default function Home() {
  const [pokemons, setPokemons] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");

  const { team } = useTeam();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cache = localStorage.getItem("pokemonList");

        if (cache) {
          setPokemons(JSON.parse(cache));
        } else {
          const data = await getPokemonList();
          setPokemons(data.results);
          localStorage.setItem("pokemonList", JSON.stringify(data.results));
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Erro ao carregar Pokémons.</p>;

  const filtered = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Pokédex</h1>

      <div style={{ marginBottom: "20px" }}>
        <strong>Time Pokémon:</strong>{" "}
        {team.length > 0 ? team.join(", ") : "Nenhum selecionado"}
      </div>

      <input
        type="text"
        placeholder="Buscar Pokémon..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          display: "block",
          margin: "20px auto",
          padding: "8px",
          width: "300px"
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "20px"
        }}
      >
        {filtered.map((pokemon) => {
          const id = extractIdFromUrl(pokemon.url);
          const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

          return (
            <Link
              key={pokemon.name}
              to={`/pokemon/${pokemon.name}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <div
                style={{
                  border: "1px solid #ddd",
                  padding: "10px",
                  textAlign: "center"
                }}
              >
                <img src={image} style={{ height: "100px" }} />
                <p style={{ textTransform: "capitalize" }}>
                  {pokemon.name}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}