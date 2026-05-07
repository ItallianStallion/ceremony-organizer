import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';


// ── Реєстрація ───────────────────────────────────────────────
export const signUp = async (email, password, firstName = '', lastName = '') => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, 'users', user.uid), {
    email: user.email,
    firstName,
    lastName,
    isAdmin: false,
    createdAt: new Date().toISOString(),
  });

  return { user: { uid: user.uid, email: user.email, firstName, lastName } };
};


// ── Вхід ─────────────────────────────────────────────────────
export const signIn = async (email, password) => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return { user: { uid: user.uid, email: user.email } };
};


// ── Вихід ────────────────────────────────────────────────────
export const signOut = () => firebaseSignOut(auth);


// ── Підписка на зміни сесії ───────────────────────────────────
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) return callback(null);

    const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
    const data = snap.data() ?? {};

    callback({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      firstName: data.firstName ?? '',
      lastName: data.lastName ?? '',
      isAdmin: data.isAdmin === true,
    });
  });
};