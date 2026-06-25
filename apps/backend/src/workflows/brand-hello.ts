import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

const brandGreetingStep = createStep(
  "brand-greeting-step",
  async (input: { brandName: string }) => {
    return new StepResponse(
      `Hello from ${input.brandName} brand`
    )
  }
)

const brandDescriptionStep = createStep(
  "brand-description-step",
  async (input: { brandName: string }) => {
    return new StepResponse(
      `${input.brandName} workflow executed successfully`
    )
  }
)

const brandHelloWorkflow = createWorkflow(
  "brand-hello-workflow",
  (input: { brandName: string }) => {
    const greeting = brandGreetingStep(input)
    const description = brandDescriptionStep(input)

    return new WorkflowResponse({
      greeting,
      description,
    })
  }
)

export default brandHelloWorkflow