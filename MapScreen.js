import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { fetchPlaces } from '../api/apiService';

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão negada para acessar a localização');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // Aqui você pode chamar sua API para buscar dados de lugares próximos
      const nearbyPlaces = await fetchPlaces(location.coords.latitude, location.coords.longitude);
      setPlaces(nearbyPlaces);
    })();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {location ? (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Sua Localização"
            description="Você está aqui"
          />
          {places.map((place, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: place.latitude,
                longitude: place.longitude,
              }}
              title={place.name}
              description={place.description}
            />
          ))}
        </MapView>
      ) : (
        <Text>{errorMsg ? errorMsg : 'Carregando mapa...'}</Text>
      )}
    </View>
  );
};

export default MapScreen;
