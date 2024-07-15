import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PokemonDetail = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${id}`
        );
        const speciesResponse = await axios.get(
          `https://pokeapi.co/api/v2/pokemon-species/${id}`
        );

        const koreanName = speciesResponse.data.names.find(
          (name) => name.language.name === "ko"
        );

        const abilities = await Promise.all(
          response.data.abilities.map(async (ability) => {
            const abilityResponse = await axios.get(ability.ability.url);
            const koreanAbilityName = abilityResponse.data.names.find(
              (name) => name.language.name === "ko"
            );
            return koreanAbilityName
              ? koreanAbilityName.name
              : ability.ability.name;
          })
        );

        const moves = await Promise.all(
          response.data.moves.map(async (move) => {
            const moveResponse = await axios.get(move.move.url);
            const koreanMoveName = moveResponse.data.names.find(
              (name) => name.language.name === "ko"
            );
            return koreanMoveName ? koreanMoveName.name : move.move.name;
          })
        );

        const types = await Promise.all(
          response.data.types.map(async (type) => {
            const typeResponse = await axios.get(type.type.url);
            const koreanTypeName = typeResponse.data.names.find(
              (name) => name.language.name === "ko"
            );
            return koreanTypeName ? koreanTypeName.name : type.type.name;
          })
        );

        setPokemon({
          ...response.data,
          korean_name: koreanName.name,
          abilities,
          moves,
          types,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!pokemon) {
    return <div>Pokemon not found</div>;
  }

  return (
    <>
      <div className="detail-container">
        <div className="h2">
          NO. {pokemon.id}-{pokemon.korean_name}
        </div>
        <img
          className="pokemon-img"
          src={pokemon.sprites.front_default}
          alt={pokemon.korean_name}
        />
        <div className="detail-sub-container">
          <p className="big-p">몸무게</p>
          <p>{pokemon.weight}</p>
          <p className="big-p">키</p>
          <p>0.{pokemon.height}m</p>
          <p className="big-p">속성</p>
          <p>
            {" "}
            {pokemon.types.map((type, index) => (
              <li key={index}>{type}</li>
            ))}
          </p>
          <p className="big-p">특성 </p>
          <p>
            {pokemon.abilities.map((ability, index) => (
              <li key={index}>{ability}</li>
            ))}
          </p>
          <p className="big-p">기술</p>
          <ul>
            {pokemon.moves.map((move, index) => (
              <li key={index}>{move}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="monster-ball">
        <img
          className="monster-ball-img"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Pokebola-pokeball-png-0.png/800px-Pokebola-pokeball-png-0.png"
        ></img>
      </div>
    </>
  );
};

export default PokemonDetail;
