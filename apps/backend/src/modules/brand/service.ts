import { MedusaService } from "@medusajs/framework/utils"
import Brand from "./models/brand"

class BrandModuleService extends MedusaService({
  Brand,
}) {
  private getMethod(methodName: string, fallback?: string) {
    const method = (this as Record<string, unknown>)[methodName]
    if (typeof method === "function") {
      return method.bind(this) as (...args: any[]) => Promise<unknown>
    }

    if (fallback) {
      const fallbackMethod = (this as Record<string, unknown>)[fallback]
      if (typeof fallbackMethod === "function") {
        return fallbackMethod.bind(this) as (...args: any[]) => Promise<unknown>
      }
    }

    throw new Error(`Brand module service is missing method ${methodName}`)
  }

  async retrieve(id: string, config?: Record<string, unknown>, sharedContext?: unknown) {
    const method = this.getMethod("retrieveBrand", "retrieve")
    return method(id, config, sharedContext)
  }

  async list(filters?: Record<string, unknown>, config?: Record<string, unknown>, sharedContext?: unknown) {
    const method = this.getMethod("listBrands", "list")
    return method(filters, config, sharedContext)
  }

  async listAndCount(filters?: Record<string, unknown>, config?: Record<string, unknown>, sharedContext?: unknown) {
    const method = this.getMethod("listAndCountBrands", "listAndCount")
    return method(filters, config, sharedContext)
  }

  async create(data: Record<string, unknown>, sharedContext?: unknown) {
    const method = this.getMethod("createBrands", "create")
    return method(data, sharedContext)
  }

  async update(idOrData: string | Record<string, unknown>, dataOrConfig?: Record<string, unknown>, sharedContext?: unknown) {
    const method = this.getMethod("updateBrands", "update")
    return method(idOrData, dataOrConfig, sharedContext)
  }

  async delete(id: string, sharedContext?: unknown) {
    const method = this.getMethod("deleteBrands", "delete")
    return method(id, sharedContext)
  }
}

export default BrandModuleService