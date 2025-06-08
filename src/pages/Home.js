import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import './Home.css';

const Home = () => {
  const [tests, setTests] = useState([]);
  const [showMessage, setShowMessage] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setShowMessage(false);
        const fetchTests = async () => {
          try {
            const testsCol = collection(db, 'tests');
            const testsSnapshot = await getDocs(testsCol);
            if (testsSnapshot.empty) {
              console.warn('No documents found in tests collection.');
            }
            const testsList = testsSnapshot.docs.map(doc => {
              const data = doc.data();
              console.log('Fetched test doc:', doc.id, data);
              return { id: doc.id, ...data };
            });
            console.log('Tests list:', testsList);
            setTests(testsList);
          } catch (error) {
            console.error('Error fetching tests:', error);
          }
        };
        fetchTests();
      } else {
        setShowMessage(true);
        setTests([]);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (showMessage) {
    return (
      <div className="home-container">
        <h2 style={{ color: 'red' }}>If you want to see the page please login or signup</h2>
      </div>
    );
  }

  return (
    <div className="home-container">
      <h1>Home Page</h1>
      <div className="tests-grid">
        {tests.length === 0 ? (
          <p>No tests available.</p>
        ) : (
          tests.map(test => (
            <div key={test.id} className="test-card">
              {(test.testName) ? (
                <>
                  <h2>
                    <a href={`/questions/${test.id}`} style={{ cursor: 'pointer', color: '#004080', textDecoration: 'underline' }}>
                      {test.testName}
                    </a>
                  </h2>
                </>
              ) : (
                <p>No test name available.</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
