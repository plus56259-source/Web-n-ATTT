import { db, auth } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  addDoc,
  query,
  limit,
  orderBy,
} from 'firebase/firestore';
import { StudyParticipant } from '../types';

export const PRESENCE_COLLECTION = 'study_room_presence';
export const CHEERS_COLLECTION = 'study_room_cheers';

// Get or create persistent session ID for guest or user
export function getSessionPresenceId(): string {
  if (auth.currentUser) {
    return auth.currentUser.uid;
  }
  let guestId = sessionStorage.getItem('unilevelup_study_guest_id');
  if (!guestId) {
    guestId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    sessionStorage.setItem('unilevelup_study_guest_id', guestId);
  }
  return guestId;
}

// Publish/update my presence to Firestore
export async function updateMyPresence(data: Partial<StudyParticipant>) {
  try {
    const presenceId = getSessionPresenceId();
    const docRef = doc(db, PRESENCE_COLLECTION, presenceId);

    const payload = {
      id: presenceId,
      name: data.name || 'Sinh viên UniLevelUp',
      avatar: data.avatar || '🧑‍🎓',
      photoURL: data.photoURL || auth.currentUser?.photoURL || '',
      status: data.status || 'Đang tập trung học bài 🎯',
      goal: data.goal || 'Tập trung học tập',
      goalCompleted: !!data.goalCompleted,
      isCamOn: !!data.isCamOn,
      camMode: data.camMode || 'webcam',
      virtualTheme: data.virtualTheme || 'lofi-girl',
      isMicOn: !!data.isMicOn,
      isSpeaking: !!data.isSpeaking,
      minutesStudied: data.minutesStudied || 0,
      streakDays: data.streakDays || 1,
      isRealUser: true,
      lastSeen: Date.now(),
    };

    await setDoc(docRef, payload, { merge: true });
  } catch (err) {
    console.warn('Unable to sync presence to Firestore:', err);
  }
}

// Remove presence when leaving room
export async function removeMyPresence() {
  try {
    const presenceId = getSessionPresenceId();
    const docRef = doc(db, PRESENCE_COLLECTION, presenceId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Error removing presence:', err);
  }
}

// Subscribe to real users in the room
export function subscribeToRealUsers(
  currentUserId: string,
  onUpdate: (users: StudyParticipant[]) => void
) {
  try {
    const q = collection(db, PRESENCE_COLLECTION);
    return onSnapshot(
      q,
      (snapshot) => {
        const now = Date.now();
        const users: StudyParticipant[] = [];

        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as any;
          // Filter out users inactive for more than 2 minutes and exclude current user
          if (docSnap.id !== currentUserId && (!data.lastSeen || now - data.lastSeen < 120000)) {
            users.push({
              id: docSnap.id,
              name: data.name || 'Bạn học',
              avatar: data.avatar || '🎓',
              photoURL: data.photoURL,
              status: data.status || 'Đang cùng học bài 🎯',
              goal: data.goal || 'Tập trung học bài',
              goalCompleted: !!data.goalCompleted,
              isCamOn: !!data.isCamOn,
              camMode: data.camMode,
              virtualTheme: data.virtualTheme,
              isMicOn: !!data.isMicOn,
              isSpeaking: !!data.isSpeaking,
              minutesStudied: data.minutesStudied || 0,
              streakDays: data.streakDays || 1,
              isRealUser: true,
              cheersReceived: data.cheersReceived || 0,
              lastSeen: data.lastSeen,
            });
          }
        });

        onUpdate(users);
      },
      (err) => {
        console.warn('Presence subscription error:', err);
        onUpdate([]);
      }
    );
  } catch (e) {
    console.warn('Failed to listen to presence:', e);
    return () => {};
  }
}

// Send interactive cheer to another user
export async function sendCheerToUser(
  toUserId: string,
  toUserName: string,
  fromName: string,
  emoji: string,
  message: string
) {
  try {
    await addDoc(collection(db, CHEERS_COLLECTION), {
      toUserId,
      toUserName,
      fromName,
      emoji,
      message,
      timestamp: Date.now(),
    });
  } catch (err) {
    console.warn('Failed to send cheer:', err);
  }
}

// Subscribe to incoming cheers for me
export function subscribeToMyCheers(
  myUserId: string,
  onCheer: (cheer: { fromName: string; emoji: string; message: string }) => void
) {
  try {
    const q = query(
      collection(db, CHEERS_COLLECTION),
      orderBy('timestamp', 'desc'),
      limit(5)
    );

    let lastKnownTimestamp = Date.now();

    return onSnapshot(
      q,
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const data = change.doc.data();
            if (data.toUserId === myUserId && data.timestamp > lastKnownTimestamp) {
              lastKnownTimestamp = data.timestamp;
              onCheer({
                fromName: data.fromName || 'Một bạn học',
                emoji: data.emoji || '💖',
                message: data.message || 'vừa gửi lời cổ vũ bạn!',
              });
            }
          }
        });
      },
      (err) => {
        console.warn('Cheers subscription error:', err);
      }
    );
  } catch (e) {
    console.warn('Failed to listen to cheers:', e);
    return () => {};
  }
}
