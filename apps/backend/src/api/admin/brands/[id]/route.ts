import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import type BrandModuleService from "../../../../modules/brand/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const brandModuleService = req.scope.resolve("brand") as BrandModuleService
  const { id } = req.params

  try {
    const brand = await brandModuleService.retrieve(id)
    res.json({ brand })
  } catch (error) {
    console.error("Failed to retrieve brand", error)
    res.status(404).json({ message: "Brand not found" })
  }
}

export async function PATCH(req: MedusaRequest, res: MedusaResponse) {
  const brandModuleService = req.scope.resolve("brand") as BrandModuleService
  const { id } = req.params
  const { name, slug, description, logo_url } = req.body as {
    name?: string
    slug?: string
    description?: string
    logo_url?: string
  }

  const payload: Record<string, unknown> = {}

  if (name !== undefined) payload.name = name.trim()
  if (slug !== undefined) payload.slug = slug.trim()
  if (description !== undefined) payload.description = description?.trim() || null
  if (logo_url !== undefined) payload.logo_url = logo_url?.trim() || null

  try {
    const brand = await brandModuleService.update(id, payload)
    res.json({ brand })
  } catch (error) {
    console.error("Failed to update brand", error)
    res.status(500).json({ message: "Failed to update brand" })
  }
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const brandModuleService = req.scope.resolve("brand") as BrandModuleService
  const { id } = req.params

  try {
    await brandModuleService.delete(id)

    res.status(200).json({ id, deleted: true })
  } catch (error) {
    console.error("Failed to delete brand", error)
    res.status(500).json({ message: "Failed to delete brand" })
  }
}
