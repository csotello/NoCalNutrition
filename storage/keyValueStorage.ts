import EncryptedStorage from 'react-native-encrypted-storage';

export async function store(key: string, value: string): Promise<void> {
  await EncryptedStorage.setItem(key, value);
}

export async function retrieve(key: string): Promise<string | null> {
  return EncryptedStorage.getItem(key);
}
