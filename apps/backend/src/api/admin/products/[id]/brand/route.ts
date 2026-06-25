import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import assignBrandToProductWorkflow from "../../../../../workflows/assign-brand-to-product"

export const config = {
  methods: ["POST"],
  auth: true,
}

export async function POST(
  req: MedusaRequest<{ brand_id?: string }>,
  res: MedusaResponse
) {
  const productId = req.params?.id
  const { brand_id } = req.body ?? {}

  if (!productId) {
    res.status(400).json({
      message: "Product id is required",
    })
    return
  }

  if (typeof brand_id !== "string" || brand_id.trim() === "") {
    res.status(400).json({
      message: "brand_id must be a non-empty string",
    })
    return
  }

  const { result } = await assignBrandToProductWorkflow(req.scope).run({
    input: {
      product_id: productId,
      brand_id,
    },
  })

  res.status(200).json(result)
}
