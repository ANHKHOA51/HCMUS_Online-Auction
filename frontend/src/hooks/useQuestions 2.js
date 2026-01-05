import { useState, useEffect } from 'react';
import questionService from '../services/question.js';

export const useQuestions = (productId) => {
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAnswering, setIsAnswering] = useState(false);

    // Fetch questions
    const fetchQuestions = async () => {
        if (!productId) return;
        
        setIsLoading(true);
        try {
            const res = await questionService.getQuestions(productId);
            if (res.ok) {
                setQuestions(res.data || []);
            }
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching questions:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Ask new question
    const askQuestion = async (content) => {
        try {
            const res = await questionService.askQuestion(productId, content);
            if (res.ok) {
                // Refresh questions list
                await fetchQuestions();
                return { ok: true };
            } else {
                return { ok: false, message: res.message };
            }
        } catch (err) {
            console.error('Error asking question:', err);
            return { ok: false, message: err.message };
        }
    };

    // Answer question
    const answerQuestion = async (questionId, answer) => {
        setIsAnswering(true);
        try {
            const res = await questionService.answerQuestion(questionId, answer);
            if (res.ok) {
                // Refresh questions list
                await fetchQuestions();
                return { ok: true };
            } else {
                return { ok: false, message: res.message };
            }
        } catch (err) {
            console.error('Error answering question:', err);
            return { ok: false, message: err.message };
        } finally {
            setIsAnswering(false);
        }
    };

    // Fetch on mount or when productId changes
    useEffect(() => {
        fetchQuestions();
    }, [productId]);

    return {
        questions,
        isLoading,
        error,
        isAnswering,
        askQuestion,
        answerQuestion,
        refetchQuestions: fetchQuestions
    };
};

export default useQuestions;
