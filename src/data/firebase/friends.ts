import { db, collection, doc, getDoc, getDocs, setDoc, deleteDoc, query, where } from './index';
import { Friend, FriendStatus } from '@utils/types';
import { err, log, success, warn } from '@utils/trace';

// Collection names
const USERS_COLLECTION = 'users';
const FRIENDS_COLLECTION = 'friends';

// Helper to create user-specific collection path
const getUserFriendsCollection = (userId: string) => {
  return `${USERS_COLLECTION}/${userId}/${FRIENDS_COLLECTION}`;
};

// Helper to create a deterministic friend document ID from two user IDs
const createFriendDocId = (userId1: string, userId2: string): string => {
  // Sort IDs alphabetically to ensure consistency
  return [userId1, userId2].sort().join('_');
};

// ==================== USER LOOKUP ====================

/**
 * Find a user by their email address
 */
export const findUserByEmail = async (email: string): Promise<{ uid: string; email: string; name?: string } | null> => {
  try {
    // Query the users collection for a user with this email
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      warn('[friends]', `No user found with email: ${email}`);
      return null;
    }

    // Get the first matching user
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    return {
      uid: userDoc.id,
      email: userData.email,
      name: userData.name
    };
  } catch (e) {
    err('[friends]', 'findUserByEmail()');
    log(e);
    return null;
  }
};

// ==================== FRIEND REQUESTS ====================

/**
 * Send a friend request to another user by their email
 */
export const sendFriendRequest = async (
  currentUserId: string,
  currentUserEmail: string,
  friendEmail: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    // Don't allow sending friend request to yourself
    if (currentUserEmail.toLowerCase() === friendEmail.toLowerCase()) {
      return { success: false, message: 'You cannot add yourself as a friend' };
    }

    // Find the user by email
    const friendUser = await findUserByEmail(friendEmail);

    if (!friendUser) {
      return { success: false, message: 'No user found with that email address' };
    }

    const friendUserId = friendUser.uid;
    const friendDocId = createFriendDocId(currentUserId, friendUserId);

    // Check if friendship already exists
    const currentUserFriendRef = doc(db, getUserFriendsCollection(currentUserId), friendDocId);
    const existingFriendship = await getDoc(currentUserFriendRef);

    if (existingFriendship.exists()) {
      const status = existingFriendship.data().status;
      if (status === FriendStatus.ACCEPTED) {
        return { success: false, message: 'You are already friends with this user' };
      } else if (status === FriendStatus.PENDING) {
        return { success: false, message: 'Friend request already pending' };
      }
    }

    const now = new Date().toISOString();

    // Create friend document for current user
    const currentUserFriend: any = {
      id: friendDocId,
      userId: friendUserId,
      email: friendUser.email,
      status: FriendStatus.PENDING,
      requestedBy: currentUserId,
      createdAt: now,
      updatedAt: now
    };
    // Only add name if it exists (Firestore doesn't support undefined)
    if (friendUser.name) {
      currentUserFriend.name = friendUser.name;
    }

    // Create friend document for friend user (they will see it as a pending request)
    const friendUserFriend: any = {
      id: friendDocId,
      userId: currentUserId,
      email: currentUserEmail,
      status: FriendStatus.PENDING,
      requestedBy: currentUserId,
      createdAt: now,
      updatedAt: now
    };
    // Don't add name field if undefined - Firestore doesn't support undefined values

    // Add to both users' friends collections
    await setDoc(currentUserFriendRef, currentUserFriend);
    await setDoc(doc(db, getUserFriendsCollection(friendUserId), friendDocId), friendUserFriend);

    success('[friends]', `Friend request sent to ${friendEmail}`);
    return { success: true, message: 'Friend request sent successfully' };
  } catch (e) {
    err('[friends]', 'sendFriendRequest()');
    log(e);
    return { success: false, message: 'Failed to send friend request' };
  }
};

/**
 * Accept a friend request
 */
export const acceptFriendRequest = async (
  currentUserId: string,
  friendUserId: string
): Promise<boolean> => {
  try {
    const friendDocId = createFriendDocId(currentUserId, friendUserId);
    const now = new Date().toISOString();

    // Update both users' friend documents to accepted status
    const currentUserFriendRef = doc(db, getUserFriendsCollection(currentUserId), friendDocId);
    const friendUserFriendRef = doc(db, getUserFriendsCollection(friendUserId), friendDocId);

    // Get both documents to preserve the data
    const [currentUserDoc, friendUserDoc] = await Promise.all([
      getDoc(currentUserFriendRef),
      getDoc(friendUserFriendRef)
    ]);

    if (!currentUserDoc.exists() || !friendUserDoc.exists()) {
      err('[friends]', 'Friend request not found');
      return false;
    }

    // Update status to accepted
    await Promise.all([
      setDoc(currentUserFriendRef, {
        ...currentUserDoc.data(),
        status: FriendStatus.ACCEPTED,
        updatedAt: now
      }),
      setDoc(friendUserFriendRef, {
        ...friendUserDoc.data(),
        status: FriendStatus.ACCEPTED,
        updatedAt: now
      })
    ]);

    success('[friends]', `Friend request accepted`);
    return true;
  } catch (e) {
    err('[friends]', 'acceptFriendRequest()');
    log(e);
    return false;
  }
};

/**
 * Reject a friend request
 */
export const rejectFriendRequest = async (
  currentUserId: string,
  friendUserId: string
): Promise<boolean> => {
  try {
    const friendDocId = createFriendDocId(currentUserId, friendUserId);
    const now = new Date().toISOString();

    // Update both users' friend documents to rejected status
    const currentUserFriendRef = doc(db, getUserFriendsCollection(currentUserId), friendDocId);
    const friendUserFriendRef = doc(db, getUserFriendsCollection(friendUserId), friendDocId);

    // Get both documents to preserve the data
    const [currentUserDoc, friendUserDoc] = await Promise.all([
      getDoc(currentUserFriendRef),
      getDoc(friendUserFriendRef)
    ]);

    if (!currentUserDoc.exists() || !friendUserDoc.exists()) {
      err('[friends]', 'Friend request not found');
      return false;
    }

    // Update status to rejected
    await Promise.all([
      setDoc(currentUserFriendRef, {
        ...currentUserDoc.data(),
        status: FriendStatus.REJECTED,
        updatedAt: now
      }),
      setDoc(friendUserFriendRef, {
        ...friendUserDoc.data(),
        status: FriendStatus.REJECTED,
        updatedAt: now
      })
    ]);

    warn('[friends]', `Friend request rejected`);
    return true;
  } catch (e) {
    err('[friends]', 'rejectFriendRequest()');
    log(e);
    return false;
  }
};

// ==================== REMOVE FRIEND ====================

/**
 * Remove a friend (or cancel a friend request)
 */
export const removeFriend = async (
  currentUserId: string,
  friendUserId: string
): Promise<boolean> => {
  try {
    const friendDocId = createFriendDocId(currentUserId, friendUserId);

    // Delete from both users' friends collections
    const currentUserFriendRef = doc(db, getUserFriendsCollection(currentUserId), friendDocId);
    const friendUserFriendRef = doc(db, getUserFriendsCollection(friendUserId), friendDocId);

    await Promise.all([
      deleteDoc(currentUserFriendRef),
      deleteDoc(friendUserFriendRef)
    ]);

    warn('[friends]', `Friend removed: ${friendUserId}`);
    return true;
  } catch (e) {
    err('[friends]', 'removeFriend()');
    log(e);
    return false;
  }
};

// ==================== LIST FRIENDS ====================

/**
 * Get all friends for a user (only accepted friendships)
 */
export const getFriends = async (userId: string): Promise<Friend[]> => {
  try {
    const friendsRef = collection(db, getUserFriendsCollection(userId));
    const q = query(friendsRef, where('status', '==', FriendStatus.ACCEPTED));
    const querySnapshot = await getDocs(q);

    const friends: Friend[] = [];
    querySnapshot.forEach((doc) => {
      friends.push(doc.data() as Friend);
    });

    success('[friends]', `Retrieved ${friends.length} friends`);
    return friends;
  } catch (e) {
    err('[friends]', 'getFriends()');
    log(e);
    return [];
  }
};

/**
 * Get all pending friend requests (incoming requests where current user needs to respond)
 */
export const getPendingFriendRequests = async (userId: string): Promise<Friend[]> => {
  try {
    const friendsRef = collection(db, getUserFriendsCollection(userId));
    const q = query(friendsRef, where('status', '==', FriendStatus.PENDING));
    const querySnapshot = await getDocs(q);

    const pendingRequests: Friend[] = [];
    querySnapshot.forEach((doc) => {
      const friendData = doc.data() as Friend;
      // Only include requests where the current user is NOT the one who requested
      // (these are incoming requests)
      if (friendData.requestedBy !== userId) {
        pendingRequests.push(friendData);
      }
    });

    success('[friends]', `Retrieved ${pendingRequests.length} pending requests`);
    return pendingRequests;
  } catch (e) {
    err('[friends]', 'getPendingFriendRequests()');
    log(e);
    return [];
  }
};

/**
 * Get all sent friend requests (outgoing requests waiting for response)
 */
export const getSentFriendRequests = async (userId: string): Promise<Friend[]> => {
  try {
    const friendsRef = collection(db, getUserFriendsCollection(userId));
    const q = query(friendsRef, where('status', '==', FriendStatus.PENDING));
    const querySnapshot = await getDocs(q);

    const sentRequests: Friend[] = [];
    querySnapshot.forEach((doc) => {
      const friendData = doc.data() as Friend;
      // Only include requests where the current user IS the one who requested
      // (these are outgoing requests)
      if (friendData.requestedBy === userId) {
        sentRequests.push(friendData);
      }
    });

    success('[friends]', `Retrieved ${sentRequests.length} sent requests`);
    return sentRequests;
  } catch (e) {
    err('[friends]', 'getSentFriendRequests()');
    log(e);
    return [];
  }
};

/**
 * Get all friends and requests (for overview)
 */
export const getAllFriendsData = async (userId: string): Promise<{
  friends: Friend[];
  pendingRequests: Friend[];
  sentRequests: Friend[];
}> => {
  try {
    const [friends, pendingRequests, sentRequests] = await Promise.all([
      getFriends(userId),
      getPendingFriendRequests(userId),
      getSentFriendRequests(userId)
    ]);

    return {
      friends,
      pendingRequests,
      sentRequests
    };
  } catch (e) {
    err('[friends]', 'getAllFriendsData()');
    log(e);
    return {
      friends: [],
      pendingRequests: [],
      sentRequests: []
    };
  }
};

// ==================== USER INITIALIZATION ====================

/**
 * Initialize or update user document in Firestore
 * - Called when a new user registers
 * - Can also be used to update user information like display name
 */
export const initializeUserDocument = async (
  userId: string,
  email: string,
  name?: string
): Promise<boolean> => {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, userId);

    // Check if user document already exists
    const existingDoc = await getDoc(userDocRef);

    if (existingDoc.exists()) {
      // Update existing document (merge to preserve other fields)
      const updateData: any = { email };
      if (name !== undefined) {
        updateData.name = name || null;
      }
      updateData.updatedAt = new Date().toISOString();

      await setDoc(userDocRef, updateData, { merge: true });
      success('[friends]', `User document updated for ${email}`);
      return true;
    }

    // Create new user document
    await setDoc(userDocRef, {
      email,
      name: name || null,
      createdAt: new Date().toISOString()
    });

    success('[friends]', `User document created for ${email}`);
    return true;
  } catch (e) {
    err('[friends]', 'initializeUserDocument()');
    log(e);
    return false;
  }
};

/**
 * Update user's display name in all friend relationships
 * This ensures that all friends see the updated name
 */
export const updateUserNameInFriendships = async (
  userId: string,
  newName: string
): Promise<boolean> => {
  try {
    // Get all of the user's friends (both pending and accepted)
    const userFriendsRef = collection(db, getUserFriendsCollection(userId));
    const querySnapshot = await getDocs(userFriendsRef);

    const updatePromises: Promise<void>[] = [];

    querySnapshot.forEach((friendDoc) => {
      const friendData = friendDoc.data() as Friend;
      const friendUserId = friendData.userId;
      const friendDocId = friendData.id;

      // Update the document in the friend's collection
      // This is where the current user appears as a friend to the other user
      const friendFriendDocRef = doc(db, getUserFriendsCollection(friendUserId), friendDocId);

      // Update the name field in the friend's version of the friendship
      const updatePromise = setDoc(
        friendFriendDocRef,
        { name: newName || null, updatedAt: new Date().toISOString() },
        { merge: true }
      );

      updatePromises.push(updatePromise);
    });

    // Wait for all updates to complete
    await Promise.all(updatePromises);

    success('[friends]', `Updated name in ${updatePromises.length} friend relationships`);
    return true;
  } catch (e) {
    err('[friends]', 'updateUserNameInFriendships()');
    log(e);
    return false;
  }
};
