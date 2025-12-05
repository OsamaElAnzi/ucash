import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NavigationBar() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  return (
    <View style={[styles.navContainer, { paddingBottom: insets.bottom || 10 }]}>
      {/* Links: Transacties */}
      <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
        <Icon name="swap-horizontal" type="material-community" size={28} color="#333" />
      </TouchableOpacity>

      {/* Midden: Home */}
      <TouchableOpacity style={styles.middleButton} onPress={() => navigation.navigate('Home')}>
        <Icon name="home" type="material" size={32} color="#333" />
      </TouchableOpacity>

      {/* Rechts: Settings */}
      <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
        <Icon name="settings" type="material" size={28} color="#333" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    position: 'absolute',
    bottom: 0, // verander van bottom:0 naar top:0
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1, // verander borderTop naar borderBottom
    borderColor: '#ddd',
    elevation: 5,
  },
  middleButton: {
    transform: [{ translateY: 0 }], // optioneel, je hoeft hem niet omhoog te zetten
  },
});

