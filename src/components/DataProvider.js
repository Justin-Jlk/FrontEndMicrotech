import { useState, useEffect, createContext, useContext } from 'react';
import { message } from 'antd';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    stages: null,
    processes: null,
    status: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const responses = await Promise.all([
          fetch('https://microtechbackend-zdib.onrender.com/all_stages/'),
          fetch('https://microtechbackend-zdib.onrender.com/master/'),
          fetch('https://microtechbackend-zdib.onrender.com/get_stage_status/'),
        ]);

        if (responses.some((res) => !res.ok)) {
          throw new Error('Failed to fetch one or more APIs');
        }

        const [stages, processes, status] = await Promise.all(
          responses.map((res) => res.json())
        );

        setData({ stages, processes, status });
      } catch (err) {
        setError(err.message);
        message.error(`Error loading data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ data, loading, error }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
