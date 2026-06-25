import { MedusaService } from "@medusajs/framework/utils"
import Brand from "./models/brand"

type BrandRecord = Record<string, unknown>

type BrandModuleServiceShape = {
  retrieve: (
    id: string,
    config?: Record<string, unknown>,
    sharedContext?: unknown
  ) => Promise<BrandRecord>
  list: (
    filters?: Record<string, unknown>,
    config?: Record<string, unknown>,
    sharedContext?: unknown
  ) => Promise<BrandRecord[]>
  listAndCount: (
    filters?: Record<string, unknown>,
    config?: Record<string, unknown>,
    sharedContext?: unknown
  ) => Promise<[BrandRecord[], number]>
  create: (data: Record<string, unknown>, sharedContext?: unknown) => Promise<BrandRecord>
  update: (
    idOrData: string | Record<string, unknown>,
    dataOrConfig?: Record<string, unknown>,
    sharedContext?: unknown
  ) => Promise<BrandRecord>
  delete: (id: string, sharedContext?: unknown) => Promise<void>
}

class BrandModuleService
  extends MedusaService({
    Brand,
  })
  implements BrandModuleServiceShape
{
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

  async retrieve(
    id: string,
    config?: Record<string, unknown>,
    sharedContext?: unknown
  ): Promise<BrandRecord> {
    const method = this.getMethod("retrieveBrand", "retrieve")
    return method(id, config, sharedContext) as Promise<BrandRecord>
  }

  async list(
    filters?: Record<string, unknown>,
    config?: Record<string, unknown>,
    sharedContext?: unknown
  ): Promise<BrandRecord[]> {
    const method = this.getMethod("listBrands", "list")
    return method(filters, config, sharedContext) as Promise<BrandRecord[]>
  }

  async listAndCount(
    filters?: Record<string, unknown>,
    config?: Record<string, unknown>,
    sharedContext?: unknown
  ): Promise<[BrandRecord[], number]> {
    const method = this.getMethod("listAndCountBrands", "listAndCount")
    return method(filters, config, sharedContext) as Promise<[BrandRecord[], number]>
  }

  async create(data: Record<string, unknown>, sharedContext?: unknown): Promise<BrandRecord> {
    const method = this.getMethod("createBrands", "create")
    return method(data, sharedContext) as Promise<BrandRecord>
  }

  async update(
    idOrData: string | Record<string, unknown>,
    dataOrConfig?: Record<string, unknown>,
    sharedContext?: unknown
  ): Promise<BrandRecord> {
    const method = this.getMethod("updateBrands", "update")
    return method(idOrData, dataOrConfig, sharedContext) as Promise<BrandRecord>
  }

  async delete(id: string, sharedContext?: unknown): Promise<void> {
    const method = this.getMethod("deleteBrands", "delete")
    return method(id, sharedContext) as Promise<void>
  }
}

export default BrandModuleService