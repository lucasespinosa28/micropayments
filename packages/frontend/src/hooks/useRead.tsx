"use client";
import { useEffect, useState } from "react";
import { FetchState, Data } from "../app/historic/types";

  export function useRead(): FetchState {
    const [state, setState] = useState<FetchState>({
      data: null,
      loading: true,
      error: null,
      fetchData: null
    });
    async function fetchData(id: string) {
      setState({ data:null, loading: false, error: null,fetchData: null })
        const response = await fetch(`http://localhost:8800/read/${id}`);
        if (response.ok) {
          const data: Data = await response.json();
          let total = 0;
          if (Array.isArray(data.message.payments)) {
            data.message.payments.forEach((item) => {
              if(parseFloat(item.amount) > 0){
                total += item.quantity * parseFloat(item.amount);
              }
            
            });
            data.total = total;
          }

          setState({ data, loading: false, error: null,fetchData: null });
        } else {
          const error = new Error("Error fetching data");
          setState({ data: null, loading: false, error,fetchData:null });
        }
    }
    const result = state;
    result.fetchData = fetchData;
    return  result;
  }