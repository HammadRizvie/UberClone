import * as React from 'react';
import { View, Text , StyleSheet , Dimensions , Platform, ActivityIndicator} from 'react-native';
import AppWeb from '../../components/Webview';
import MapView , {Marker} from 'react-native-maps';
import { useState , useEffect } from 'react';
import * as Location from 'expo-location';
import { Button } from 'react-native-paper';
import { storeLoction } from '../../config/firebase';
import db, { storeLocation, getNearestDrivers, requestDriver } from '../../config/firebase';
import { geohashForLocation, geohashQueryBounds, distanceBetween} from 'geofire-common';

export default function Dashboard({navigation}){
    const [region,setRegion] = useState({
            latitude: 24.91213242,
            longitude:  67.054324234,
            latitudeDelta: 0.0022,
            longitudeDelta: 0.0021,
        })

        const [location, setLocation] = useState(null);
        const [errorMsg, setErrorMsg] = useState(null);
        const [currentLocName,setCurrentLocName] = useState('');
        const [moveToDropOff,setMoveToDropOff] = useState(false)
        const [isLoading, setIsLoading] = useState(false);
        const [loadingText,setLoadingText] = useState('');
        const [currentIndex, setCurrentIndex] = useState(0);
        const center = [region.latitude, region.longitude];
        const radiusInM = 4000; 

          
          useEffect(() => {
            (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
           console.log("status==>",status)
            if (status !== 'granted'){
              setErrorMsg('Permission to access location was denied');
              return;
            }
            
           
            console.log("hi")
            try{
              let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.Highest});
            }
            catch(e){
              console.log("error text",e)
            }
            const {coords:{latitude,longitude}} = location
            console.log('location======>',location)
            setRegion({...region,latitude,longitude})
           
            fetch(`https://api.foursquare.com/v2/venues/search?client_id=QEJ3YKKOS5HOCE4ANKTO4UWF1ERT4SJBNIXPWZGBE0VY02UI&client_secret=QD2I1K00RYVZ5A4TGQFUK3FVZOY44CPZX2NNA25KDQP5NVLI&ll=${latitude},${longitude}&v=20180323`)
            .then(res => res.json())
            .then(res => setCurrentLocName(res.response.venues[0].name))
                   
          })();
          }, []);

        useEffect(()=>{

          fetch(`https://api.foursquare.com/v2/venues/search?client_id=QEJ3YKKOS5HOCE4ANKTO4UWF1ERT4SJBNIXPWZGBE0VY02UI&client_secret=QD2I1K00RYVZ5A4TGQFUK3FVZOY44CPZX2NNA25KDQP5NVLI&ll=${region.latitude},${region.longitude}&v=20180323`)
          .then(res => res.json())
          .then(res => setCurrentLocName(res.response.venues[0].name)) 
          // console.log("reg lat==>",region.latitude)
          
        // })();
        },[region])

        let text = 'Waiting..';
        if (errorMsg) {
          text = errorMsg;
        } else if (location) {
          text = JSON.stringify(location);
        }

    return(
        <>    
            <View>
          
           <Button
           style={{height:40,width:300,alignSelf:'center',marginTop:5}}
           mode="contained"
           color="#0a3338"
           onPress={()=>navigation.navigate('DropOffs',{
            locName:currentLocName,
            regions:region
           })}
           >
             SELECT YOUR DROP OFF
           </Button>


            
        <MapView style={styles.map} region={region}>
            <Marker 
            icon={require('../../../assets/marker1.jpg')}
            title={currentLocName}
            coordinate={region}
            draggable={true}
            onDragStart={(e)=>console.log('drag start',region)}
            onDragEnd={(e)=>
              setRegion({
                ...region,
                latitude:e.nativeEvent.coordinate.latitude,
                longitude:e.nativeEvent.coordinate.longitude
              })
            }
            />
        </MapView>

       
            </View>
</>
)
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
      },
  });