"use client";
import { useEffect, useState } from "react";
import { Data, FetchState, UploadData } from "./types";

export const useSave = ({ payload }: { payload: UploadData }): FetchState => {
  const [state, setState] = useState<FetchState>({
    data: null,
    loading: true,
    error: null,
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8800/save/${payload.name}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload.body),
          }
        );
        if (response.ok) {
          const data: Data = await response.json();
          setState({ data, loading: false, error: null });
        } else {
          const error = new Error("Error fetching data");
          setState({ data: null, loading: false, error });
        }
      } catch (error) {}
    };

    fetchData();
  }, [payload]);

  return state;
};
