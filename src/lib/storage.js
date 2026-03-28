import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const storage = {
  async get(key) {
    try {
      const docRef = doc(db, 'app_data', key);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data().value : null;
    } catch (error) {
      console.error(`Erro ao buscar ${key}:`, error);
      return null;
    }
  },

  async set(key, value) {
    try {
      const docRef = doc(db, 'app_data', key);
      await setDoc(docRef, { value });
      return true;
    } catch (error) {
      console.error(`Erro ao salvar ${key}:`, error);
      return false;
    }
  },

  async del(key) {
    try {
      const docRef = doc(db, 'app_data', key);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error(`Erro ao deletar ${key}:`, error);
      return false;
    }
  }
};