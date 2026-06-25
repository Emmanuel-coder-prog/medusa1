import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import type BrandModuleService from "../../../modules/brand/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const brandModuleService = req.scope.resolve("brand") as BrandModuleService

  const limit = Number(req.query.limit) || 20
  const offset = Number(req.query.offset) || 0

  try {
    const [brands, count] = await brandModuleService.listAndCount(
      {},
      { take: limit, skip: offset }
    )

    res.json({
      brands,
      count,
      offset,
      limit,
    })
  } catch (error) {
    console.error("Failed to list brands", error)
    res.status(500).json({ message: "Failed to list brands" })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const brandModuleService = req.scope.resolve("brand") as BrandModuleService
  const { name, slug, description, logo_url } = req.body as {
    name?: string
    slug?: string
    description?: string
    logo_url?: string
  }

  if (!name?.trim() || !slug?.trim()) {
    res.status(400).json({
      message: "name and slug are required",
    })
    return
  }

  try {
    const brand = await brandModuleService.create({
      name: name.trim(),
      slug: slug.trim(),
      description: description?.trim() || null,
      logo_url: logo_url?.trim() || null,
    })

    res.status(201).json({ brand })
  } catch (error) {
    console.error("Failed to create brand", error)
    res.status(500).json({ message: "Failed to create brand" })
  }
}
