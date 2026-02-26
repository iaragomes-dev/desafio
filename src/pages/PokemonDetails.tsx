import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPokemonByName } from "../api/pokemon.service";
import { PokemonDetails } from "../types/pokemon";
import { useTeam } from "../context/TeamContext";

export default function PokemonDetailsPage() {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [error, setError] = useState(false);

  const { team, addToTeam, removeFromTeam } = useTeam();

  useEffect(() => {
    if (!name) return;

    const fetchData = async () => {
      try {
        const data = await getPokemonByName(name);
        setPokemon(data);
      } catch {
        setError(true);
      }
    };

    fetchData();
  }, [name]);

  if (error) return <p>Erro ao carregar detalhes.</p>;
  if (!pokemon) return <p>Loading...</p>;

  const isInTeam = team.includes(pokemon.name);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1 style={{ textTransform: "capitalize" }}>
        {pokemon.name}
      </h1>

      <img
        src={pokemon.sprites.other["official-artwork"].front_default}
        style={{ height: "200px" }}
      />

      <p>Height: {pokemon.height}</p>
      <p>Weight: {pokemon.weight}</p>
      <p>
        Types: {pokemon.types.map((t) => t.type.name).join(", ")}
      </p>

      <button
        style={{
          padding: "8px 16px",
          marginTop: "10px",
          cursor: "pointer"
        }}
        onClick={() =>
          isInTeam
            ? removeFromTeam(pokemon.name)
            : addToTeam(pokemon.name)
        }
      >
        {isInTeam ? "Remover do Time" : "Adicionar ao Time"}
      </button>

      <br /><br />
      <Link to="/">Voltar</Link>
    </div>
  );
}