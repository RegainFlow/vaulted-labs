import { supabase } from "./supabase";
import type {
  ProvablyFairRollRequest,
  ProvablyFairRollResponse,
  ProvablyFairSessionResponse,
} from "../types/provably-fair";

interface ProvablyFairSessionRequest {
  walletId: string;
  clientSeed: string;
}

export async function invokeProvablyFairSession(
  payload: ProvablyFairSessionRequest
): Promise<ProvablyFairSessionResponse> {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase.functions.invoke(
    "provably-fair-session",
    {
      body: payload,
    }
  );

  if (error) {
    throw error;
  }

  return data as ProvablyFairSessionResponse;
}

export async function invokeProvablyFairRoll(
  payload: ProvablyFairRollRequest
): Promise<ProvablyFairRollResponse> {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase.functions.invoke("provably-fair-roll", {
    body: payload,
  });

  if (error) {
    throw error;
  }

  return data as ProvablyFairRollResponse;
}

export async function invokeProvablyFairRotate(
  payload: ProvablyFairSessionRequest
): Promise<ProvablyFairSessionResponse> {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase.functions.invoke(
    "provably-fair-rotate",
    {
      body: payload,
    }
  );

  if (error) {
    throw error;
  }

  return data as ProvablyFairSessionResponse;
}
