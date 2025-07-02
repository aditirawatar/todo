
import React, { useEffect, useState } from 'react';
import { db } from '@/firebase/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const TestFirestore = () => {
  const [data, setData] = useState([]);

  const handleAddData = async () => {
    try {
      await addDoc(collection(db, "test"), {
        name: "Aditi",
        timestamp: new Date()
      });
      alert("Data added!");
      fetchData();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "test"));
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    setData(items);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded">
      <button onClick={handleAddData} className="bg-blue-500 text-white px-4 py-2 rounded">Add Test Data</button>
      <ul className="mt-4">
        {data.map((item) => (
          <li key={item.id}>{item.name} - {item.timestamp.toDate?.().toLocaleString() || 'No date'}</li>
        ))}
      </ul>
    </div>
  );
};

export default TestFirestore;
