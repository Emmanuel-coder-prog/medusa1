import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import type BrandModuleService from "../../../../../modules/brand/service"

type ProductModuleService = {
  retrieve: (id: string, config?: Record<string, unknown>) => Promise<Record<string, unknown>>
  update: (id: string, data: Record<string, unknown>) => Promise<Record<string, unknown>>
}

type BrandRecord = Record<string, unknown>

export const config = {
  methods: ["GET", "POST"],
  auth: true,
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const productId = req.params?.id

  if (!productId) {
    res.status(400).json({ message: "Product id is required" })
    return
  }

  try {
    const productModuleService = req.scope.resolve("product") as unknown as ProductModuleService
    const brandModuleService = req.scope.resolve("brand") as BrandModuleService
    const product = await productModuleService.retrieve(productId)
    const brandId = typeof product?.metadata === "object" && product.metadata !== null
      ? (product.metadata as Record<string, unknown>).brand_id
      : undefined

    let brand: BrandRecord | null = null
    if (typeof brandId === "string" && brandId.trim() !== "") {
      try {
        brand = await brandModuleService.retrieve(brandId)
      } catch {
        brand = null
      }
    }

    res.json({ product, brand })
  } catch (error) {
    console.error("Failed to retrieve product brand", error)
    res.status(404).json({ message: "Product not found" })
  }
}

export async function POST(req: MedusaRequest<{ brand_id?: string | null }>, res: MedusaResponse) {
  const productId = req.params?.id
  const { brand_id } = req.body ?? {}

  if (!productId) {
    res.status(400).json({ message: "Product id is required" })
    return
  }

  if (brand_id !== null && (typeof brand_id !== "string" || brand_id.trim() === "")) {
    res.status(400).json({ message: "brand_id must be a non-empty string or null" })
    return
  }

  try {
    const productModuleService = req.scope.resolve("product") as unknown as ProductModuleService
    const brandModuleService = req.scope.resolve("brand") as BrandModuleService

    const product = await productModuleService.retrieve(productId)

    if (brand_id !== null) {
      await brandModuleService.retrieve(brand_id)
    }

    const metadata = { ...((product.metadata as Record<string, unknown> | undefined) ?? {}) }
    if (brand_id === null) {
      delete metadata.brand_id
    } else {
      metadata.brand_id = brand_id
    }

    const updatedProduct = await productModuleService.update(productId, {
      metadata,
    })

    let brand: BrandRecord | null = null
    if (typeof brand_id === "string" && brand_id.trim() !== "") {
      brand = await brandModuleService.retrieve(brand_id)
    }

    res.status(200).json({ product: updatedProduct, brand })
  } catch (error) {
    console.error("Failed to assign brand to product", error)
    res.status(404).json({ message: "Product or brand not found" })
  }
}
