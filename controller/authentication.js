const {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} = require("firebase/auth");
const { getDoc, doc, setDoc, collection } = require("firebase/firestore");
const { db } = require("../firebase");

const { auth } = require("../firebase");

// 1. Register user
async function registerUser(email, password, type) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const userRef = doc(collection(db, "users"), user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      type: type,
      createdAt: new Date(),
    });

    console.log("User registered successfully:", user.uid);
    return user;
  } catch (error) {
    console.error("Error registering user:", error.message);
    throw error;
  }
}

// 1. Register user
async function registerUserByGoogle(email, googleId, type) {
  try {
    const userRef = doc(collection(db, "users"), googleId);
    const existingDoc = await getDoc(userRef);

    if (!existingDoc.exists()) {
      await setDoc(userRef, {
        uid: googleId,
        email: email,
        type: type,
        googleId: googleId,
        createdAt: new Date(),
      });

      console.log("User registered successfully:", googleId);
    } else {
      console.log("User already exists:", googleId);
    }

    return {
      uid: googleId,
      email: email,
    };
  } catch (error) {
    console.error("Error registering user:", error.message);
    throw error;
  }
}

async function getUserByGoogleId(googleId) {
  try {
    const userRef = doc(db, "users", googleId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data(); // data user
    } else {
      console.log("User not found:", googleId);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user:", error.message);
    throw error;
  }
}

// 2. Login user
async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    console.log("User logged in successfully:", user.uid);
    return user;
  } catch (error) {
    console.error("Error logging in:", error.message);
    throw error;
  }
}

// 3. Logout user
async function logoutUser() {
  try {
    await signOut(auth);
    console.log("User logged out successfully");
  } catch (error) {
    console.error("Error logging out:", error.message);
    throw error;
  }
}

// 4. Reset password
async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent");
  } catch (error) {
    console.error("Error sending password reset email:", error.message);
    throw error;
  }
}

// 5. Monitor auth state
function onAuthStateChange(callback) {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is signed in:", user.uid);
      callback(user);
    } else {
      console.log("User is signed out");
      callback(null);
    }
  });
}

// 6. Get current user
function getCurrentUser() {
  return auth.currentUser;
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  resetPassword,
  onAuthStateChange,
  getCurrentUser,
  registerUserByGoogle,
  getUserByGoogleId
};
