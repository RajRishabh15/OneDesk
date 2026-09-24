import { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
  query,
  orderBy,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

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

    // Real-time multi-device listeners (pure clean sync, zero sample pre-seeding)
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
