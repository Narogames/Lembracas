import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const [memorias, setMemorias] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const carregarMemorias = async () => {
      try {
        const jsonMemorias = await AsyncStorage.getItem('@memorias');
        if (jsonMemorias !== null) {
          setMemorias(JSON.parse(jsonMemorias));
        }
      } catch (e) {
        Alert.alert('Erro', 'Não foi possível carregar as memórias.');
      }
    };
    carregarMemorias();
  }, []);

  return (
    <LinearGradient colors={['#FFB6C1', '#FF69B4']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Memórias</Text>
      </View>

      <FlatList
        data={memorias}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.memoriaItem}>
            {item.foto ? (
              <Image source={{ uri: item.foto }} style={styles.memoriaFoto} />
            ) : (
              <Text style={styles.emptyImageText}>Sem imagem</Text>
            )}
            <Text style={styles.memoriaTitulo}>{item.titulo}</Text>
            <Text style={styles.memoriaDescricao}>{item.descricao}</Text>
            <Text style={styles.memoriaQuando}>Quando: {item.quando}</Text>
            <Text style={styles.memoriaOnde}>Onde: {item.onde}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma memória adicionada.</Text>}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('./NovasMemorias/')}
      >
        <Text style={styles.buttonText}>Adicionar Memória</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 1,
  },
  header: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  button: {
    backgroundColor: '#FF69B4',
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  memoriaItem: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginVertical: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  memoriaFoto: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 10,
  },
  emptyImageText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#999',
    marginBottom: 10,
  },
  memoriaTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  memoriaDescricao: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  memoriaQuando: {
    fontSize: 14,
    color: '#999',
    marginBottom: 2,
  },
  memoriaOnde: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#999',
  },
});
