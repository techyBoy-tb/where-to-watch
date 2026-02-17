// Export Firebase app, auth, and firestore instances
export { app, auth, db } from './config';

// Export commonly used Firebase Auth functions for convenience
export {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';

// Export commonly used Firestore functions for convenience
export {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';

// Export friend-related functions
export {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  getFriends,
  getPendingFriendRequests,
  getSentFriendRequests,
  getAllFriendsData,
  findUserByEmail,
  initializeUserDocument,
  updateUserNameInFriendships
} from './friends';
