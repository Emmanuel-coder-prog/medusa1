import { Heading, Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"
import { HttpTypes } from "@medusajs/types"

type BrandTemplateProps = {
  brand: any
  products: HttpTypes.StoreProduct[]
  countryCode: string
}

const BrandTemplate = ({ brand, products, countryCode }: BrandTemplateProps) => {
  return (
    <div className="content-container py-6">
      <div className="mb-8">
        <Heading level="h1">{brand.name}</Heading>
        {brand.description ? <Text className="mt-2">{brand.description}</Text> : null}
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 small:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <LocalizedClientLink key={product.id} href={`/products/${product.handle}`}>
              <ProductPreview product={product} region={{} as any} />
            </LocalizedClientLink>
          ))}
        </div>
      ) : (
        <Text>No products found for this brand.</Text>
      )}
    </div>
  )
}

export default BrandTemplate
