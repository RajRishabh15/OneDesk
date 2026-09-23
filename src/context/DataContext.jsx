import { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  setDoc,
  getDocs,
  doc,
  query,
  orderBy,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { makeSampleNotes, makeSampleTasks, makeSampleEvents } from '../utils/sampleData';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { user } = useAuth();
  const uid = user?.id;

  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Collection refs helpers
  const col = (name) => collection(db, 'users', uid, name);
  const docRef = (name, id) => doc(db, 'users', uid, name, id);

  useEffect(() => {
    if (!uid) {
      setNotes([]);
      setTasks([]);
      setEvents([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    let resolved = 0;
    const tryDone = () => {
      resolved++;
      if (resolved === 3) setLoading(false);
    };

    // 1. One-time check for first-time account initialization
    async function checkAndSeedInitialData() {
      try {
        const userDocRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userDocRef);
        const userData = userSnap.data();

        // If user document already exists and has been seeded, do nothing!
        if (userSnap.exists() && userData?.seeded === true) {
          return;
        }

        // Check if user already has any items across collections
        const [notesSnap, tasksSnap, eventsSnap] = await Promise.all([
          getDocs(query(col('notes'))),
          getDocs(query(col('tasks'))),
          getDocs(query(col('events'))),
        ]);

        const hasAnyData = !notesSnap.empty || !tasksSnap.empty || !eventsSnap.empty;

        if (!hasAnyData) {
          // Brand new account: seed sample data in a single atomic batch
          const batch = writeBatch(db);

          makeSampleNotes().forEach((item) => {
            const { id: _id, ...rest } = item;
            const ref = doc(collection(db, 'users', uid, 'notes'));
            batch.set(ref, { ...rest, createdAt: serverTimestamp() });
          });

          makeSampleTasks().forEach((item) => {
            const { id: _id, ...rest } = item;
            const ref = doc(collection(db, 'users', uid, 'tasks'));
            batch.set(ref, { ...rest, createdAt: serverTimestamp() });
          });

          makeSampleEvents().forEach((item) => {
            const { id: _id, ...rest } = item;
            const ref = doc(collection(db, 'users', uid, 'events'));
            batch.set(ref, { ...rest, createdAt: serverTimestamp() });
          });

          // Mark user as seeded in Firestore permanently
          batch.set(userDocRef, { seeded: true, initializedAt: serverTimestamp() }, { merge: true });
          await batch.commit();
        } else {
          // User already has data from before, mark as seeded so we never overwrite
          await setDoc(userDocRef, { seeded: true }, { merge: true });
        }
      } catch (err) {
        console.error('Error during initial data check:', err);
      }
    }

    checkAndSeedInitialData();

    // 2. Real-time multi-device listeners (pure sync, zero auto-re-seeding)
    const unsubNotes = onSnapshot(
      query(col('notes'), orderBy('createdAt', 'desc')),
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setNotes(docs);
        tryDone();
      }
    );

    const unsubTasks = onSnapshot(
      query(col('tasks'), orderBy('createdAt', 'desc')),
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setTasks(docs);
        tryDone();
      }
    );

    const unsubEvents = onSnapshot(
      query(col('events'), orderBy('createdAt', 'desc')),
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setEvents(docs);
        tryDone();
      }
    );

    return () => {
      unsubNotes();
      unsubTasks();
      unsubEvents();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  // ---- Notes ----
  async function addNote(note) {
    const { id: _id, ...rest } = note;
    await addDoc(col('notes'), { ...rest, pinned: false, createdAt: serverTimestamp() });
  }
  async function updateNote(id, patch) {
    await updateDoc(docRef('notes', id), patch);
  }
  async function deleteNote(id) {
    await deleteDoc(docRef('notes', id));
  }
  async function togglePinNote(id) {
    const note = notes.find((n) => n.id === id);
    if (note) await updateDoc(docRef('notes', id), { pinned: !note.pinned });
  }

  // ---- Tasks ----
  async function addTask(task) {
    const { id: _id, ...rest } = task;
    await addDoc(col('tasks'), { ...rest, status: rest.status || 'Todo', createdAt: serverTimestamp() });
  }
  async function updateTask(id, patch) {
    await updateDoc(docRef('tasks', id), patch);
  }
  async function deleteTask(id) {
    await deleteDoc(docRef('tasks', id));
  }
  async function setTaskStatus(id, status) {
    await updateDoc(docRef('tasks', id), { status });
  }

  // ---- Events ----
  async function addEvent(event) {
    const { id: _id, ...rest } = event;
    await addDoc(col('events'), { ...rest, reminder: rest.reminder ?? false, createdAt: serverTimestamp() });
  }
  async function updateEvent(id, patch) {
    await updateDoc(docRef('events', id), patch);
  }
  async function deleteEvent(id) {
    await deleteDoc(docRef('events', id));
  }

  // ---- Bulk ----
  async function clearAll() {
    if (!uid) return;
    const deleteCollection = async (colName) => {
      const batch = writeBatch(db);
      const snap = await getDocs(col(colName));
      snap.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();
    };
    await Promise.all([
      deleteCollection('notes'),
      deleteCollection('tasks'),
      deleteCollection('events'),
      deleteDoc(doc(db, 'users', uid)).catch(() => {}),
    ]);
  }

  const value = {
    notes,
    tasks,
    events,
    loading,
    addNote, updateNote, deleteNote, togglePinNote,
    addTask, updateTask, deleteTask, setTaskStatus,
    addEvent, updateEvent, deleteEvent,
    clearAll,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
