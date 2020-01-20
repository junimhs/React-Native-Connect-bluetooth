import React, {useState, useEffect} from 'react';
import './config/ReactotronConfig';
import {BleManager} from 'react-native-ble-plx';
import {
  View,
  Alert,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';

// import { Container } from './styles';

export default function App() {
  const [manager, setManager] = useState(new BleManager());
  const [dados, setDados] = useState(null);

  useEffect(() => {
    const subscription = manager.onStateChange(state => {
      if (state === 'PoweredOn') {
        // manager.scanAndConnect();
        console.tron.log('Ativado');
        subscription.remove();
      } else {
        Alert.alert('Error', 'Ative seu blueth');
      }
    }, true);
  }, []);

  async function handleScanner() {
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        // Handle error (scanning will be stopped automatically)
        console.tron.log('Error:', error);
        return;
      }
      let i = 1;
      if (
        device.localName !== null &&
        device.localName !== '[TV] Samsung 7 Series (65)'
      ) {
        console.tron.log(device);
        setDados(device);

        manager.stopDeviceScan();
      }
      // Check if it is a device you are looking for based on advertisement data
      // or other criteria.
      if (device.name === 'TI BLE Sensor Tag' || device.name === 'SensorTag') {
        // Stop scanning as it's not necessary if you are scanning for one device
        console.tron.log('Entrou aqui');
        manager.stopDeviceScan();

        // Proceed with connection.
      }
    });
  }

  async function handlerConnect(dev) {
    dev
      .connect()
      .then(devices => {
        console.tron.log('Conectado: ', devices);
        Alert.alert('Sucesso', 'Conectado com sucesso');
        return dev.discoverAllServicesAndCharacteristics();
      })
      .catch(error => {
        console.tron.log('Error: ', error);
        Alert.alert('Error', error.message);
        // Handle errors
      });
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleScanner}>
        <Text>Scannear dispositivos</Text>
      </TouchableOpacity>
      {dados && (
        <TouchableOpacity onPress={() => handlerConnect(dados)}>
          <Text>{dados.name}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
