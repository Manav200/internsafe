import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  setDoc,
  deleteDoc,
  onSnapshot,
  type Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import type { ApplicationRecord, ListingReport } from './types/internship.ts';
import type { StudentProfile } from './components/StudentProfileModal.tsx';

// 1. Initialize Firebase App
const app = initializeApp(firebaseConfig);

// 2. Initialize Firestore with specific database ID (CRITICAL: Required for multi-database)
export const db: Firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// 3. Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Error logging conforming to FirestoreErrorInfo standard
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.warn('Firestore Error Handled:', JSON.stringify(errInfo));
}

// 4. Test Firestore Connection
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore client is currently offline or unconfigured.');
      return false;
    }
    // Expected permission-denied on test doc means connection is alive!
    return true;
  }
}

// 5. Auth Helpers
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

export async function logOut(): Promise<void> {
  await firebaseSignOut(auth);
}

// 6. Realtime Sync Helpers for Application Tracker
export async function syncApplicationToFirestore(
  userId: string,
  appRecord: ApplicationRecord
): Promise<void> {
  const path = `users/${userId}/applications/${appRecord.id}`;
  try {
    await setDoc(doc(db, 'users', userId, 'applications', appRecord.id), {
      userId,
      internshipId: appRecord.internshipId,
      status: appRecord.status,
      appliedDate: appRecord.appliedDate || null,
      deadline: appRecord.deadline,
      notes: appRecord.notes || '',
      updatedAt: appRecord.updatedAt,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteApplicationFromFirestore(
  userId: string,
  appRecordId: string
): Promise<void> {
  const path = `users/${userId}/applications/${appRecordId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'applications', appRecordId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeUserApplications(
  userId: string,
  onUpdate: (apps: ApplicationRecord[]) => void
): () => void {
  const path = `users/${userId}/applications`;
  return onSnapshot(
    collection(db, 'users', userId, 'applications'),
    (snapshot) => {
      const records: ApplicationRecord[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        records.push({
          id: d.id,
          internshipId: data.internshipId,
          status: data.status,
          appliedDate: data.appliedDate || undefined,
          deadline: data.deadline,
          notes: data.notes || undefined,
          updatedAt: data.updatedAt,
        });
      });
      onUpdate(records);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

// 7. Student Profile Firestore Sync
export async function syncProfileToFirestore(
  userId: string,
  profile: StudentProfile
): Promise<void> {
  const path = `users/${userId}/profile`;
  try {
    await setDoc(doc(db, 'users', userId, 'profile', 'info'), {
      uid: userId,
      name: profile.name,
      college: profile.college,
      skills: profile.skills,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeUserProfile(
  userId: string,
  onUpdate: (profile: StudentProfile) => void
): () => void {
  const path = `users/${userId}/profile/info`;
  return onSnapshot(
    doc(db, 'users', userId, 'profile', 'info'),
    (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        onUpdate({
          name: data.name || 'Student',
          college: data.college || 'State University',
          skills: data.skills || [],
        });
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

// 8. Report Sync
export async function syncReportToFirestore(report: ListingReport): Promise<void> {
  const path = `reports/${report.id}`;
  try {
    await setDoc(doc(db, 'reports', report.id), {
      internshipId: report.internshipId,
      internshipTitle: report.internshipTitle,
      company: report.company,
      reason: report.reason,
      details: report.details || '',
      reporterEmail: report.reporterEmail || '',
      reportedAt: report.reportedAt,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
