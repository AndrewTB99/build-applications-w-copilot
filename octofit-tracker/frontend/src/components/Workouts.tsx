import { useEffect, useState } from 'react';
import { CapabilityCard } from './CapabilityCard.js';
import { getJson } from '../api/client.js';

type Suggestion = {
  title: string;
  focus?: string;
  minutes?: number;
  difficulty?: string;
  reason?: string;
};

export default function Workouts() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    getJson<{ suggestions: Suggestion[] }>(
      `/api/workouts/suggestions/${encodeURIComponent('mona@example.com')}`,
    )
      .then(({ suggestions: result }) => {
        if (active) setSuggestions(result);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <CapabilityCard title="Workout suggestions" description="Recommend workouts from activity patterns.">
      {loading ? (
        <p role="status">Loading workout suggestions...</p>
      ) : error ? (
        <p role="alert">Unable to load workout suggestions.</p>
      ) : suggestions.length === 0 ? (
        <p>No workout suggestions yet.</p>
      ) : (
        <ul className="list-group list-group-flush">
          {suggestions.map((suggestion) => (
            <li className="list-group-item px-0" key={suggestion.title}>
              <h3 className="h6">{suggestion.title}</h3>
              {suggestion.focus && <p className="mb-1">Focus: {suggestion.focus}</p>}
              {suggestion.minutes !== undefined && (
                <p className="mb-1">Duration: {suggestion.minutes} minutes</p>
              )}
              {suggestion.difficulty && <p className="mb-1">Difficulty: {suggestion.difficulty}</p>}
              {suggestion.reason && <p className="mb-0">{suggestion.reason}</p>}
            </li>
          ))}
        </ul>
      )}
    </CapabilityCard>
  );
}
