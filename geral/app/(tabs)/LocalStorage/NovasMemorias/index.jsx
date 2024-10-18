import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function AddMemoryScreen() {
  const [titulo, setTitulo] = useState('');
  const [quando, setQuando] = useState('');
  const [onde, setOnde] = useState('');
  const [descricao, setDescricao] = useState('');
  const [foto, setFoto] = useState(null);
  const router = useRouter();

  const escolherFoto = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setFoto(result.assets[0].uri);
      } else {
        Alert.alert('Erro', 'Seleção de imagem cancelada ou falhou.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao selecionar a imagem.');
      console.error(error);
    }
  };

  const adicionarMemoria = async () => {
    if (!titulo || !quando || !onde || !descricao || !foto) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios!');
      return;
    }

    const novaMemoria = {
      id: Date.now().toString(),
      titulo,
      quando,
      onde,
      descricao,
      foto,
    };

    try {
      const jsonMemorias = await AsyncStorage.getItem('@memorias');
      const memorias = jsonMemorias ? JSON.parse(jsonMemorias) : [];
      const memoriasAtualizadas = [novaMemoria, ...memorias];

      await AsyncStorage.setItem('@memorias', JSON.stringify(memoriasAtualizadas));
      router.back();
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar a memória.');
    }
  };

  return (
    <LinearGradient colors={['#FFB6C1', '#FF69B4']} style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
      />
      <TextInput
        style={styles.input}
        placeholder="Quando"
        value={quando}
        onChangeText={setQuando}
      />
      <TextInput
        style={styles.input}
        placeholder="Onde"
        value={onde}
        onChangeText={setOnde}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />

      {foto ? (
        <Image source={{ uri: foto }} style={styles.image} />
      ) : (
        <Text style={styles.placeholderText}>Nenhuma foto selecionada</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={escolherFoto}>
        <Text style={styles.buttonText}>Escolher Foto</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={adicionarMemoria}>
        <Text style={styles.buttonText}>Adicionar</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
  },
  input: {
    height: 55,
    borderColor: '#FF69B4',
    borderWidth: 2,
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 18,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  button: {
    backgroundColor: '#FF6347',
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical: 12,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#FF6347',
  },
  placeholderText: {
    textAlign: 'center',
    color: '#555',
    marginBottom: 15,
    fontSize: 16,
  },
});
