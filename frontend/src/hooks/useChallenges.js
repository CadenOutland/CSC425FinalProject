import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const useChallenges = () => {
  const [challenges, setChallenges] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchChallenges = async () => {
      if (!token) return;

      try {
        const response = await fetch('/api/challenges', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch challenges');
        }

        const data = await response.json();
        setChallenges(data);
        setError(null);
      } catch (err) {
        setError(err);
        setChallenges(null);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [token]);

  return { challenges, loading, error };
};

export default useChallenges;
