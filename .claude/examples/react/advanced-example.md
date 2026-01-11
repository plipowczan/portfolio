# Advanced React Component

## Overview
A user profile component fetching data with `useEffect` and handling loading/error states.

## Implementation

### UserProfile.jsx
```jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        if (mounted) setUser(data);
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchUser();

    return () => {
      mounted = false;
    };
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return null;

  return (
    <div className="profile">
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
};

UserProfile.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default UserProfile;
```
