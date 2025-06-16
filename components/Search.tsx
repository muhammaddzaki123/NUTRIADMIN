import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useDebouncedCallback } from "use-debounce";
import icons from "@/constants/icons";

const Search = () => {
  const params = useLocalSearchParams<{ query?: string }>();
  const [search, setSearch] = useState(params.query || '');

  const debouncedSearch = useDebouncedCallback((text: string) => {
    if (text) {
      router.setParams({ query: text });
    } else {
      router.setParams({});
    }
  }, 500);

  const handleSearch = (text: string) => {
    setSearch(text);
    debouncedSearch(text);
  };

  const handleClear = () => {
    setSearch('');
    router.setParams({});
  };

  return (
    <View className="flex flex-row items-center justify-between w-full px-4 rounded-lg bg-accent-100 border border-primary-100 mt-5 py-2">
      <View className="flex-1 flex flex-row items-center justify-start z-50">
        <Image source={icons.search} className="size-5" />
        <TextInput
          value={search}
          onChangeText={handleSearch}
          placeholder="Cari artikel..."
          className="text-sm font-rubik text-black-300 ml-2 flex-1"
          placeholderTextColor="#666"
        />
      </View>

      {search ? (
        <TouchableOpacity 
          onPress={handleClear}
          className="ml-2"
        >
          <Text className="text-primary-500 text-lg">×</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default Search;
