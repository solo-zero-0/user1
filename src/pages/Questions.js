import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import './Questions.css';

const Questions = () => {
  const { testId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [testName, setTestName] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Fetch questions subcollection for the test
        const questionsCol = collection(db, 'tests', testId, 'questions');
        const questionsSnapshot = await getDocs(questionsCol);
        const questionsList = questionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setQuestions(questionsList);

        // Fetch test document to get testName
        const testDocRef = doc(db, 'tests', testId);
        const testDocSnap = await getDoc(testDocRef);
        if (testDocSnap.exists()) {
          setTestName(testDocSnap.data().testName || '');
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    fetchQuestions();
  }, [testId]);

  const handleAnswerChange = (questionId, choiceIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: choiceIndex,
    }));
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleNext = () => {
    setShowResults(false);
    setCurrentQuestionIndex(prev => prev + 1);
  };

  const currentQuestion = questions[currentQuestionIndex];

  const calculateScore = () => {
    let score = 0;
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswerIndex) {
        score += 10;
      }
    });
    return score;
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="questions-container">
      <h1>Questions for Test: {testName}</h1>
      <Link to="/">Back to Home</Link>
      {questions.length === 0 ? (
        <p>No questions available for this test.</p>
      ) : showResults && isLastQuestion ? (
        <div>
          <h2>Your Score: {calculateScore()} / {questions.length * 10}</h2>
        </div>
      ) : (
        <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
          <ul>
            <li key={currentQuestion.id}>
              <p><strong>Question:</strong> {currentQuestion.questionText}</p>
              <p><strong>Choices:</strong></p>
              <ul>
                {currentQuestion.choices && currentQuestion.choices.map((choice, index) => (
                  <li key={index}>
                    <label>
                      <input
                        type="radio"
                        name={currentQuestion.id}
                        value={index}
                        checked={selectedAnswers[currentQuestion.id] === index}
                        onChange={() => handleAnswerChange(currentQuestion.id, index)}
                        disabled={showResults}
                      />
                      {choice}
                    </label>
                  </li>
                ))}
              </ul>
              {showResults && (
                <p>
                  {selectedAnswers[currentQuestion.id] === currentQuestion.correctAnswerIndex
                    ? <span style={{ color: 'green' }}>Correct</span>
                    : <span style={{ color: 'red' }}>Wrong</span>}
                </p>
              )}
            </li>
          </ul>
          {!showResults && <button type="submit">Submit</button>}
          {!showResults && !isLastQuestion && (
            <button type="button" onClick={handleNext} style={{ marginLeft: '10px' }}>
              Next
            </button>
          )}
        </form>
      )}
    </div>
  );
};

export default Questions;
