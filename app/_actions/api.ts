"use server";

import supabase from "@/app/_libs/supabase";
import { Marker } from "@/app/_types";

export const getMarkerList = async () => {
  const { data, error } = await supabase.from("Marker").select("*");
  if (error) throw error;
  return data;
};


export const addMarkerList = async (markerList: Marker[]) => {
    const { error } = await supabase.from("Marker").insert(markerList);
    if (error) throw error;
    return markerList;
  };
  