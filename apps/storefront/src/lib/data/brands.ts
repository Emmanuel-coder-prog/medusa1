"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders, getCacheOptions } from "./cookies"

export const listBrands = async () => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("brands")),
  }

  return sdk.client.fetch<{ brands: HttpTypes.StoreProduct[]; count: number }>(
    "/store/brands",
    {
      method: "GET",
      headers,
      next,
      cache: "force-cache",
    }
  )
}

export const getBrandByHandle = async (handle: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("brands")),
  }

  return sdk.client.fetch<{ brand: HttpTypes.StoreProduct }>(
    `/store/brands/${handle}`,
    {
      method: "GET",
      headers,
      next,
      cache: "force-cache",
    }
  )
}
