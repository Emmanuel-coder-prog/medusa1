import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { useEffect, useMemo, useState } from "react"
import { Select, Label, Container, Text } from "@medusajs/ui"
import { useParams } from "react-router-dom"

import { useQuery } from "@tanstack/react-query"

type Brand = {
  id: string
  name: string
  slug: string
}

type BrandsResponse = {
  brands: Brand[]
}

async function fetchBrands(): Promise<BrandsResponse> {
  const response = await fetch("/admin/brands", {
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  })

  if (!response.ok) {
    throw new Error("Failed to load brands")
  }

  return response.json()
}

async function fetchProductBrand(productId: string): Promise<string | null> {
  const response = await fetch(`/admin/products/${productId}`, {
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  })

  if (!response.ok) {
    return null
  }

  const payload = await response.json()
  const links = payload.product?.links || []
  const brandLink = links.find((link: any) => link?.id === "brand")
  return brandLink?.brand?.id || null
}

async function saveProductBrand(productId: string, brandId: string | null) {
  const response = await fetch(`/admin/products/${productId}/brand`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ brand_id: brandId }),
  })

  if (!response.ok) {
    throw new Error("Failed to save brand")
  }
}

const ProductBrandWidget = () => {
  const { id } = useParams()
  const productId = id

  const [selectedBrandId, setSelectedBrandId] = useState<string>("none")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "brands"],
    queryFn: fetchBrands,
  })

  useEffect(() => {
    if (!productId) {
      return
    }

    fetchProductBrand(productId)
      .then((brandId) => setSelectedBrandId(brandId || "none"))
      .catch(() => setSelectedBrandId("none"))
  }, [productId])

  const options = useMemo(() => {
    const brands = data?.brands ?? []
    return brands.map((brand) => ({ value: brand.id, label: brand.name }))
  }, [data])

  const handleChange = async (value: string) => {
    if (!productId) {
      return
    }

    const normalizedValue = value === "none" ? null : value

    setSelectedBrandId(value)
    setSaving(true)
    setError(null)

    try {
      await saveProductBrand(productId, normalizedValue)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save brand")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Container className="p-0">
      <div className="flex flex-col gap-2 p-4">
        <Text weight="plus">Brand</Text>
        <Label htmlFor="product-brand">Assign a brand to this product</Label>
        <Select
          id="product-brand"
          value={selectedBrandId}
          onValueChange={handleChange}
          disabled={isLoading || saving}
        >
          <Select.Trigger>
            <Select.Value placeholder="No brand" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="none">No brand</Select.Item>
            {options.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                {option.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
        {error ? <Text className="text-red-600">{error}</Text> : null}
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.before",
})

export default ProductBrandWidget
