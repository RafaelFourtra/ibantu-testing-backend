const { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} = require('firebase/firestore');

const { db } = require('../firebase');

async function addUser(userData) {
  try {
    const docRef = await addDoc(collection(db, 'users'), {
      ...userData,
      createdAt: serverTimestamp()
    });
    console.log('User added with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding user: ', error);
    throw error;
  }
}

async function getAllUsers() {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const users = [];
    
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return users;
  } catch (error) {
    console.error('Error getting users: ', error);
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error getting user: ', error);
    throw error;
  }
}

async function updateUser(userId, updateData) {
  try {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
    console.log('User updated successfully');
  } catch (error) {
    console.error('Error updating user: ', error);
    throw error;
  }
}

async function deleteUser(userId) {
  try {
    const docRef = doc(db, 'users', userId);
    await deleteDoc(docRef);
    console.log('User deleted successfully');
  } catch (error) {
    console.error('Error deleting user: ', error);
    throw error;
  }
}

async function getUsersByRole(role) {
  try {
    const q = query(
      collection(db, 'users'),
      where('role', '==', role),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
    
    const querySnapshot = await getDocs(q);
    const users = [];
    
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return users;
  } catch (error) {
    console.error('Error querying users: ', error);
    throw error;
  }
}

// Export functions
module.exports = {
  addUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUsersByRole
};