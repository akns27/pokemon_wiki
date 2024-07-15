import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import hangul from "hangul-js";
import debounce from "lodash.debounce";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function PokemonList() {
  const [pokemonData, setPokemonData] = useState([]);
  const [filterPokemon, setFilterPokemon] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const DATA_SIZE = 16;
  const navigate = useNavigate();

  const decomposeHangul = (str) => {
    return hangul.disassemble(str).join("");
  };

  const fetchPokemon = async (page) => {
    setLoading(true);
    const newPokemonData = [];
    const startIndex = (page - 1) * DATA_SIZE + 1;
    const endIndex = page * DATA_SIZE;

    for (let i = startIndex; i <= endIndex; i++) {
      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${i}`
        );
        const speciesResponse = await axios.get(
          `https://pokeapi.co/api/v2/pokemon-species/${i}`
        );
        const koreanName = speciesResponse.data.names.find(
          (name) => name.language.name === "ko"
        );
        newPokemonData.push({ ...response.data, korean_name: koreanName.name });
      } catch (error) {
        console.error(`Error fetching Pokemon ${i}:`, error);
      }
    }

    setPokemonData((prevData) => [...prevData, ...newPokemonData]);
    setFilterPokemon((prevData) => [...prevData, ...newPokemonData]);
    setLoading(false);
  };

  useEffect(() => {
    fetchPokemon(page);
  }, [page]);

  const handlePokemonClick = (id) => {
    navigate(`/pokemon/${id}`);
  };

  const renderPokemonList = useMemo(() => {
    return filterPokemon.map((pokemon) => (
      <div
        key={pokemon.id}
        className="pokemon-card"
        onClick={() => handlePokemonClick(pokemon.id)}
      >
        <div className="image-container">
          <img src={pokemon.sprites.front_default} alt={pokemon.korean_name} />
        </div>
        <p className="pokemon-name">{pokemon.korean_name}</p>
        <p className="pokemon-id">ID : {pokemon.id}</p>
      </div>
    ));
  }, [filterPokemon]);

  const filtering = useCallback(
    debounce(() => {
      if (keyword.length === 0) {
        setFilterPokemon(pokemonData);
      } else {
        const decomposedKeyword = decomposeHangul(keyword);
        const filterList = pokemonData.filter((pokemon) => {
          const decomposedName = decomposeHangul(pokemon.korean_name);
          return decomposedName.includes(decomposedKeyword);
        });
        setFilterPokemon(filterList);
      }
    }, 300),
    [pokemonData, keyword]
  );

  useEffect(() => {
    filtering();
  }, [keyword, filtering]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const ListContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
  `;

  const H = styled.p`
    text-align: center;
    color: #ffffff;
    text-shadow: 2px 4px 8px rgba(22, 22, 22, 0.5);
    font-size: ${(props) => props.fontSize};
  `;

  return (
    <ListContainer>
      <H fontSize={"80px"}>Pokemon Wiki</H>
      <input
        value={keyword}
        className="searchBox"
        placeholder="포켓몬 이름을 입력해주세요"
        onChange={(e) => setKeyword(e.target.value)}
      />
      <div className="container">
        <div className="pokemon-list">{renderPokemonList}</div>
      </div>
      {loading && <H fontSize="64px">Loading...</H>}
    </ListContainer>
  );
}

export default PokemonList;
