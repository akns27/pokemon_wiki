import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

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
    return <div className="h2">Loading...</div>;
  }

  if (!pokemon) {
    return <div>Pokemon not found</div>;
  }

  const MonsterBall = styled.div`
    position: fixed;
    bottom: 2%;
    right: 2%;
  `;

  const MonsterBallImg = styled.img`
    width: 80px;
    height: 80px;
  `;

  const BigP = styled.p`
    font-size: 24px;
  `;

  const P = styled.p`
    font-size: 18px;
  `;

  return (
    <>
      <div className="detail-container">
        <div className="h2" >
          NO. {pokemon.id}-{pokemon.korean_name}
        </div>
        <img
          className="pokemon-img"
          src={pokemon.sprites.front_default}
          alt={pokemon.korean_name}
        />
        <div className="detail-sub-container">
          <BigP>몸무게</BigP>
          <P>{pokemon.weight}</P>
          <BigP>키</BigP>
          <P>0.{pokemon.height}m</P>
          <BigP>속성</BigP>
          <P>
            {pokemon.types.map((type, index) => (
              <li key={index}>{type}</li>
            ))}
          </P>
          <BigP>특성 </BigP>
          <P>
            {pokemon.abilities.map((ability, index) => (
              <li key={index}>{ability}</li>
            ))}
          </P>
          <BigP>기술</BigP>
          <ul style={{ display: "flex", justifyContent: "center" }}>
            <div className="pokemon-skill-container">
              {pokemon.moves.map((move, index) => (
                <li className="pokemon-skill" key={index}>
                  {move}
                </li>
              ))}
            </div>
          </ul>
        </div>
      </div>

      <MonsterBall>
        <MonsterBallImg
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Pokebola-pokeball-png-0.png/800px-Pokebola-pokeball-png-0.png"
          alt="Monster Ball"
        />
      </MonsterBall>
    </>
  );
};

export default PokemonDetail;
