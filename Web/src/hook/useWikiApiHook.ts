import { useState } from "react";
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";

const useApiHook = <T>(url: string, params?: AxiosRequestConfig) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response: AxiosResponse<T> = await axios.get(url, {
        ...params,
        headers: {
          ...params?.headers,
          'Access-Control-Allow-Origin': '*',
        },
      });
      setData(response.data);
      setLoading(false);

      console.log("DATAAAA: ");
      console.log(response.data);
      setError(null);

    } catch (error) {
      console.log(error);
      setError("Error getting the data");
      setLoading(false);
    }
  };

  return { data, loading, error, fetchData };
};

export default useApiHook;
