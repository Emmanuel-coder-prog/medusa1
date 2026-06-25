import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getBrandByHandle } from "@lib/data/brands"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import BrandTemplate from "@modules/brands/templates"

export async function generateMetadata({ params }: { params: Promise<{ countryCode: string; handle: string }> }): Promise<Metadata> {
  const { countryCode, handle } = await params
  const brand = await getBrandByHandle(handle)

  return {
    title: `${brand.brand?.name || handle} | Medusa Store`,
    description: `Products from ${brand.brand?.name || handle}`,
  }
}

export default async function BrandPage({ params }: { params: Promise<{ countryCode: string; handle: string }> }) {
  const { countryCode, handle } = await params
  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  const brandResponse = await getBrandByHandle(handle)
  const brand = brandResponse.brand

  if (!brand) {
    notFound()
  }

  const { response } = await listProducts({
    countryCode,
    queryParams: {
      limit: 12,
      fields: "handle,title,thumbnail,description,variants.calculated_price,brand.*",
    },
  })

  const products = response.products.filter((product) => product.brand?.id === brand.id)

  return <BrandTemplate brand={brand} products={products} countryCode={countryCode} />
}
