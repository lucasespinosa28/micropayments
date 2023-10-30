"use client";
import { useEffect, useState } from "react";
import { FetchState, Data } from "./types";

export const useRead = ({ id }: { id: string; }): FetchState => {
  const [state, setState] = useState<FetchState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8800/read/${id}`);
        if (response.ok) {
          const data: Data = await response.json();
          let total = 0;
          data.message.forEach((item) => {
            total += item.qty * parseFloat(item.amount);
          });
          data.total = total;
          setState({ data, loading: false, error: null });
        } else {
          const error = new Error("Error fetching data");
          setState({ data: null, loading: false, error });
        }
      } catch (error) { }
    };

    fetchData();
  }, [id]);

  return state;
};
