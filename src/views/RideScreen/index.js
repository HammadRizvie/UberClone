import * as React from 'react';
import { View, Text, StyleSheet, Dimensions, Alert } from 'react-native';
import MapView , {Marker} from 'react-native-maps';
import { useState , useEffect } from 'react';
import * as Location from 'expo-location';
import db, { storeLocation, getNearestDrivers, requestDriver } from '../../config/firebase';
import { Button } from 'react-native-paper';

export default function RideScreen(){
    const [driverReg,setDriverReg] = useState()
    const [userReg,setUserReg] = useState()
    const [dropOffReg,setDropOffReg] = useState()
    const [rideStatus,setRideStatus] = useState(false)

    useEffect(()=>{

        db.collection('users').doc('PQRTGpIElkUmPuNCnNbn3Oj0EDC3').onSnapshot((doc)=>{
            const data = doc.data()
            console.log("driver drop off",data.dropOffLoc.dropOffRegions.latitude)
            setDriverReg({
                latitude:data.acceptedRequest.lat,
                longitude:data.acceptedRequest.lng,
                latitudeDelta:0.0922,
                longitudeDelta:0.0921
            })
            setUserReg({
                latitude:data.lat,
                longitude:data.lng,
                latitudeDelta:0.0922,
                longitudeDelta:0.0921
            })
            setDropOffReg({
                latitude:data.dropOffLoc.dropOffRegions.latitude,
                longitude:data.dropOffLoc.dropOffRegions.longitude,
                latitudeDelta:0.0922,
                longitudeDelta:0.0921
            })
            if(driverReg === driverReg){
                Alert.alert('driver arrived')
                setRideStatus(true)
            }
        })
    },[])
    console.log(driverReg)
    console.log(userReg)

    return(
        <>
        {/* <Button title="hellloo"/> */}
        <MapView style={styles.map} region={driverReg}>
        {driverReg && <Marker coordinate={driverReg}
        icon={require('../../../assets/marker1.jpg')}
        />}
            {userReg && <Marker coordinate={userReg} 
            icon={require('../../../assets/Black.jpg')}
            />}
            {rideStatus &&  <Marker coordinate={dropOffReg} title='drop Off'
            icon={require('../../../assets/marker1.jpg')}
            /> }
        </MapView>
    
        </>
    )
}

const styles = StyleSheet.create({
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
        },
    });