import { useState, useEffect } from "react";
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";

const useApiHook = <T>(url: string, params?: AxiosRequestConfig) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response: AxiosResponse<T> = await axios.get(url, params);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error getting the data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default useApiHook;