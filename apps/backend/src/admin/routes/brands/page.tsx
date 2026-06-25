import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Button, Container } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"

type Brand = {
  id: string
  name: string
  slug: string
  created_at?: string
  createdAt?: string
}

type BrandsResponse = {
  brands: Brand[]
  count: number
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

const BrandsPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "brands"],
    queryFn: fetchBrands,
  })

  const brands = data?.brands ?? []

  return (
    <Container className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Brands</h1>
          <p className="text-sm text-ui-fg-subtle">Manage your product brands.</p>
        </div>
        <Link to="/brands/create">
          <Button>Create Brand</Button>
        </Link>
      </div>

      {isLoading ? (
        <p>Loading brands...</p>
      ) : error ? (
        <p style={{ color: "#b42318" }}>Unable to load brands.</p>
      ) : brands.length === 0 ? (
        <p>No brands found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e5e7eb", textAlign: "left" }}>
              <th style={{ padding: "12px 8px" }}>Name</th>
              <th style={{ padding: "12px 8px" }}>Slug</th>
              <th style={{ padding: "12px 8px" }}>Created At</th>
              <th style={{ padding: "12px 8px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "12px 8px" }}>{brand.name}</td>
                <td style={{ padding: "12px 8px" }}>{brand.slug}</td>
                <td style={{ padding: "12px 8px" }}>
                  {brand.created_at || brand.createdAt || "-"}
                </td>
                <td style={{ padding: "12px 8px" }}>
                  <Link to={`/brands/${brand.id}`}>
                    <Button variant="secondary">Edit</Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Brands",
})

export default BrandsPage
