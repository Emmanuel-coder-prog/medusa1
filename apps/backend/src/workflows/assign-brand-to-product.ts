import ProductModule from "@medusajs/medusa/product"
import BrandModule from "../modules/brand"
import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

type AssignBrandToProductInput = {
  product_id: string
  brand_id: string
}

type AssignBrandToProductOutput = {
  success: boolean
  product_id: string
  brand_id: string
}

const assignBrandToProductStep = createStep(
  "assign-brand-to-product-step",
  async (
    input: AssignBrandToProductInput,
    { container }: { container: any }
  ) => {
    const { product_id, brand_id } = input

    if (!product_id || !brand_id) {
      throw new Error("Both product_id and brand_id are required")
    }

    const linkService = container.resolve("link") || container.resolve("linkService")

    if (!linkService) {
      throw new Error("Link service is not available")
    }

    const createLink = linkService.createLink || linkService.create || linkService.register

    if (typeof createLink !== "function") {
      throw new Error("Link service does not expose a supported create method")
    }

    await createLink.call(linkService, {
      [ProductModule.linkable.product]: { product_id },
      [BrandModule.linkable.brand]: { brand_id },
    })

    return new StepResponse<AssignBrandToProductOutput>({
      success: true,
      product_id,
      brand_id,
    })
  }
)

const assignBrandToProductWorkflow = createWorkflow(
  "assign-brand-to-product",
  (input: AssignBrandToProductInput) => {
    const result = assignBrandToProductStep(input)

    return new WorkflowResponse(result)
  }
)

export default assignBrandToProductWorkflow
