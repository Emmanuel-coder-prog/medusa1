import { POST as createBrand } from "../route"
import { PATCH as updateBrand } from "../[id]/route"

describe("admin brand routes", () => {
  it("passes logo_url when creating a brand", async () => {
    const create = jest.fn().mockResolvedValue({ id: "brand_1" })
    const req = {
      scope: {
        resolve: jest.fn().mockReturnValue({ create }),
      },
      body: {
        name: "Acme",
        slug: "acme",
        description: "A brand",
        logo_url: "https://example.com/logo.png",
      },
    } as any
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as any

    await createBrand(req, res)

    expect(create).toHaveBeenCalledWith({
      name: "Acme",
      slug: "acme",
      description: "A brand",
      logo_url: "https://example.com/logo.png",
    })
  })

  it("passes logo_url when updating a brand", async () => {
    const update = jest.fn().mockResolvedValue({ id: "brand_1" })
    const req = {
      scope: {
        resolve: jest.fn().mockReturnValue({ update }),
      },
      params: { id: "brand_1" },
      body: {
        logo_url: "https://example.com/new-logo.png",
      },
    } as any
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as any

    await updateBrand(req, res)

    expect(update).toHaveBeenCalledWith("brand_1", {
      logo_url: "https://example.com/new-logo.png",
    })
  })
})
