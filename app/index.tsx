import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';

export default function Index() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email && password) {
      Alert.alert('Signed in', `Logged in as ${email}`);
    } else {
      Alert.alert('Error', 'try again');
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f4f4f4',
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 30 }}>Login</Text>

      <TextInput
        style={{
          width: '100%',
          height: 50,
          backgroundColor: '#fff',
          borderRadius: 10,
          paddingHorizontal: 15,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: '#ccc',
        }}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
      />

      <TextInput
        style={{
          width: '100%',
          height: 50,
          backgroundColor: '#fff',
          borderRadius: 10,
          paddingHorizontal: 15,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: '#ccc',
        }}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <TouchableOpacity
        onPress={handleLogin}
        style={{
          backgroundColor: '#007AFF',
          paddingVertical: 15,
          paddingHorizontal: 50,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
}
