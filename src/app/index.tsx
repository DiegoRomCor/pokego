import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { colorsByType } from "../constants/colorsByType";

const pokeAPI = "https://pokeapi.co/api/v2/pokemon?limit=20";

type PokemonSummary = {
  name: string;
  url: string;
};

type PokemonType = {
  type: {
    name: string;
  };
};

type Pokemon = {
  name: string;
  image: string | null;
  imageBack: string | null;
  type: PokemonType[];
};

type PokemonDetails = {
  sprites: {
    front_default: string | null;
    back_default: string | null;
  };
  types: PokemonType[];
};

async function fetchPokemons(): Promise<Pokemon[]> {
  const response = await fetch(pokeAPI);
  const data: { results: PokemonSummary[] } = await response.json();

  return Promise.all(
    data.results.map(async (pokemon) => {
      const res = await fetch(pokemon.url);
      const details: PokemonDetails = await res.json();

      return {
        name: pokemon.name,
        image: details.sprites.front_default,
        imageBack: details.sprites.back_default,
        type: details.types.length
          ? details.types
          : [{ type: { name: "unknown" } }],
      };
    }),
  );
}

export default function Index() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const { width } = useWindowDimensions();
  const spriteSize = Math.min(150, Math.max(0, (width * 0.9 - 40) / 2));
  const spriteStyle = { width: spriteSize, height: spriteSize };

  useEffect(() => {
    fetchPokemons()
      .then(setPokemons)
      .catch((e) => console.log(e));
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.list}>
        {pokemons.map((pokemon: Pokemon) => (
          <Link
            href={{
              pathname: "/details",
              params: {
                name: pokemon.name,
                type: pokemon.type[0].type.name,
                image: pokemon.image ?? undefined,
              },
            }}
            key={pokemon.name}
            style={{
              backgroundColor: colorsByType[pokemon.type[0].type.name] + 50,
              padding: 20,
              borderRadius: 20,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{pokemon.name}</Text>
              <Text style={styles.tag}>{pokemon.type[0].type.name}</Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                }}
              >
                <Image
                  source={pokemon.image ? { uri: pokemon.image } : undefined}
                  style={spriteStyle}
                />
                <Image
                  source={pokemon.imageBack ? { uri: pokemon.imageBack } : undefined}
                  style={spriteStyle}
                />
              </View>
            </View>
          </Link>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
  },
  name: {
    color: "#1A1A1A",
    fontWeight: "700",
  },
  tag: {
    color: "#414141",
  },
});
