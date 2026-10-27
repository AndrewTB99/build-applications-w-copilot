import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';

type Activity = {
  type: string;
  minutes: number;
  points: number;
  occurredAt?: string;
};

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    getJson<{ activities: Activity[] }>('/api/activities')
      .then(({ activities: result }) => {
        if (active) setActivities(result);
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
    <section className="card h-100">
      <div className="card-body">
        <h2 className="h4">Activities</h2>
        <p>Track student activity minutes and points.</p>
        {loading ? (
          <p role="status">Loading activities...</p>
        ) : error ? (
          <p role="alert">Unable to load activities.</p>
        ) : activities.length === 0 ? (
          <p>No activities yet.</p>
        ) : (
          <ul className="list-group list-group-flush">
            {activities.map((activity, index) => (
              <li className="list-group-item px-0" key={`${activity.type}-${activity.occurredAt ?? index}`}>
                <strong className="text-capitalize">{activity.type}</strong>
                <span className="ms-2">{activity.minutes} min</span>
                <span className="ms-2">{activity.points} points</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
