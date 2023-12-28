import { View, Text, ScrollView, LogBox, Image } from "react-native";
import React, { useEffect, useState } from "react";
import sanityClient, { urlFor } from "../sanity";
import RestaurantCard from "./RestaurantCard";

const FeaturedRow = ({ id, title, description }) => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    sanityClient
      .fetch(
        `
      *[_type == "featured" && _id == $id]{
        ...,
        restaurants[]->{
          ...,
          dishes[]->,
          type-> {
            name
          }
        },
      }[0]
      `,
        { id }
      )
      .then((data) => {
        setRestaurants(data?.restaurants);
        console.log(" 💯👍" + restaurants[0].image.asset._ref);
      });
  }, []);

  return (
    <View>
      <View className="mt-4 flex-row items-center justify-between px-4">
        <Text className="font-bold text-lg">{title}</Text>
      </View>
      <Text className="text-xs text-gray-500 px-4">{description}</Text>
      <ScrollView
        horizontal
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
        showsHorizontalScrollIndicator={false}
        className="pt-4"
      >
        {/* //! RestaurantCards */}
        {restaurants?.map((restaurant) => {
          return (
            // <Text>eeee</Text>
            // <Image
            //   source={{
            //     uri: urlFor(restaurant.image.asset._ref).url(),
            //   }}
            //   className="h-36 w-64 rounded-sm"
            // />
            <RestaurantCard
              key={restaurant._id}
              id={restaurant._id}
              imgUrl={restaurant.image.asset._ref}
              title={restaurant.name}
              rating={restaurant.rating}
              genre={restaurant.type?.name}
              address={restaurant.address}
              short_description={restaurant.short_description}
              dishes={restaurant.dishes}
              long={restaurant.long}
              lat={restaurant.lon}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default FeaturedRow;
