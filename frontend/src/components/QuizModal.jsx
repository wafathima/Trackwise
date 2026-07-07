// src/components/QuizModal.jsx
import { useState, useEffect } from 'react';
import { X, Loader } from 'lucide-react';
import quizService from '../services/quizService';

const QuizModal = ({ quiz, onClose, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  // Mock questions for demo - in real app, these come from backend
  const questions = quiz?.questions || [
    { id: 1, question: 'What is 2 + 2?', options: ['3', '4', '5', '6'], correctAnswer: 1 },
    { id: 2, question: 'What is the capital of France?', options: ['London', 'Paris', 'Berlin', 'Madrid'], correctAnswer: 1 },
    { id: 3, question: 'What is the chemical symbol for water?', options: ['H2O', 'CO2', 'NaCl', 'HCl'], correctAnswer: 0 },
  ];

  useEffect(() => {
    if (quiz) {
      startQuiz();
    }
  }, [quiz]);

  const startQuiz = async () => {
    setLoading(true);
    try {
      await quizService.startQuiz(quiz.id);
    } catch (error) {
      setError(error.message || 'Failed to start quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    setAnswers([...answers, selectedAnswer]);
    setSelectedAnswer(null);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    setLoading(true);
    try {
      // Submit each answer
      for (let i = 0; i < answers.length; i++) {
        await quizService.submitAnswer(quiz.id, questions[i].id, answers[i]);
      }
      
      // Get results
      const result = await quizService.getQuizResults(quiz.id);
      setResults(result);
      setShowResults(true);
      onComplete(result);
    } catch (error) {
      setError(error.message || 'Failed to submit quiz');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#3F6B52';
    if (score >= 60) return '#B8892B';
    return '#A63D40';
  };

  if (loading && !showResults) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="rounded-sm p-8 text-center" style={{ backgroundColor: '#FBF8EF' }}>
          <Loader className="w-12 h-12 animate-spin mx-auto" style={{ color: '#3F6B52' }} />
          <p className="mt-4" style={{ color: '#1C2B3980' }}>Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (showResults && results) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="rounded-sm max-w-md w-full p-6 border" style={{ backgroundColor: '#FBF8EF', borderColor: '#1C2B3922' }}>
          <div className="text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ 
              backgroundColor: `${getScoreColor(results.percentage)}15`,
              border: `2px solid ${getScoreColor(results.percentage)}`
            }}>
              <span className="text-3xl font-bold" style={{ color: getScoreColor(results.percentage) }}>
                {results.percentage}%
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Fraunces', serif", color: '#1C2B39' }}>
              {results.percentage >= 80 ? '🎉 Excellent!' :
               results.percentage >= 60 ? '👍 Good Job!' :
               '📚 Keep Learning!'}
            </h3>
            <p className="text-sm" style={{ color: '#1C2B3980' }}>
              You got {results.correctAnswers} out of {results.totalQuestions} correct
            </p>
            <div className="mt-4 p-3 rounded-sm" style={{ backgroundColor: '#F1EBDA' }}>
              <div className="flex justify-between text-sm">
                <span style={{ color: '#1C2B3960' }}>Points Earned</span>
                <span className="font-bold" style={{ color: '#3F6B52' }}>
                  {results.percentage >= 80 ? '+50' : results.percentage >= 60 ? '+30' : '+10'} points
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setShowResults(false);
                onClose();
              }}
              className="mt-6 px-6 py-2 rounded-sm text-sm font-medium text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: '#3F6B52' }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="rounded-sm max-w-lg w-full p-6 border" style={{ backgroundColor: '#FBF8EF', borderColor: '#1C2B3922' }}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold" style={{ fontFamily: "'Fraunces', serif", color: '#1C2B39' }}>
              {quiz?.title || 'Quiz'}
            </h3>
            <p className="text-xs" style={{ color: '#1C2B3960' }}>
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
          <button onClick={onClose} className="transition-opacity hover:opacity-70" style={{ color: '#1C2B3960' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-sm mb-4" style={{ backgroundColor: '#A63D4010', border: '1px solid #A63D4033' }}>
            <p className="text-sm" style={{ color: '#A63D40' }}>{error}</p>
          </div>
        )}

        <div className="mb-6">
          <p className="text-sm font-medium mb-4" style={{ color: '#1C2B39' }}>
            {question?.question}
          </p>
          <div className="space-y-2">
            {question?.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-3 rounded-sm text-sm text-left transition-all ${
                  selectedAnswer === index
                    ? 'border-2'
                    : 'border hover:border-opacity-50'
                }`}
                style={{
                  backgroundColor: selectedAnswer === index ? '#3F6B5215' : 'transparent',
                  borderColor: selectedAnswer === index ? '#3F6B52' : '#1C2B3922',
                  color: selectedAnswer === index ? '#1C2B39' : '#1C2B3980'
                }}
              >
                {String.fromCharCode(65 + index)}. {option}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#1C2B391A' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                backgroundColor: '#3F6B52'
              }}
            />
          </div>
          <button
            onClick={handleNext}
            disabled={selectedAnswer === null || loading}
            className="ml-4 px-6 py-2 rounded-sm text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#3F6B52' }}
          >
            {currentQuestion + 1 === questions.length ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizModal;