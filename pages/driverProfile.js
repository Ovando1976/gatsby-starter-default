import React from 'react';
import useSWR from 'swr';
import DriverProfile from '../src/components/DriverProfile';

const fetcher = (url) => fetch(url).then((res) => {
  if (!res.ok) throw new Error('Failed to fetch driver data');
  return res.json();
});

function DriverProfilePage() {
  const { data, error, isLoading } = useSWR('/api/driver', fetcher);

  if (error) return <p>Error: {error.message}</p>;
  if (isLoading) return <p>Loading driver data...</p>;

  return <DriverProfile data={data} />;
}

export default DriverProfilePage;