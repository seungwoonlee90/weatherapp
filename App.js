import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Fontisto } from '@expo/vector-icons'; 
import axios from "axios"
import { SafeAreaView, StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from 'react-native';

const {height, width} = Dimensions.get("screen");
const API_KEY = "개인용 API KEY";
const icons = {
  "Clear": "day-sunny",
  "Rain" : "rain",
  "Clouds" : "cloudy"
}

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(false);
  const getWeather = async() =>  {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if(!status) {
      setOk(false);
    }
    let {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync({});
    let location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false});
    setCity(location[0].city);

      const result = await axios.get(
        `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      ).then(setOk(true));
    setDays(result.data.list)
  }

  useEffect(()=>{
    getWeather();
  },[])
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator="false" contentContainerStyle={styles.weather}>
        {!ok
        ? <View style={styles.day}>
            <ActivityIndicator color="white"/>
          </View>
        : days.map((day, index) => 
          <View key={index} style={styles.day}>
            <Text style={styles.date}>{day.dt_txt.split(' ')[0]} {day.dt_txt.split(' ')[1].split(':')[0]}시</Text>
            <Text style={styles.temp}>{Math.round(day.main.temp,1)}</Text>
            <Text style={styles.desc}>{day.weather[0].main}</Text>
            <Fontisto name={icons[day.weather[0].main]} size={48} color="black" />
          </View>)}
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbc531'
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 38,
    fontWeight: "500"
  },
  weather: {
  },
  day: {
    width: width,
    alignItems: "center"
  },
  date: {
    fontSize: 25,
  },
  temp: {
    marginTop: 5,
    fontSize: 150,
    fontWeight: "600"
  },
  desc: {
    marginTop: -20,
    fontSize: 45
  }
});
