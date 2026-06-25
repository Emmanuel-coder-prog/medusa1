import { Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type ProductBrandBadgeProps = {
  product: HttpTypes.StoreProduct
}

const ProductBrandBadge = ({ product }: ProductBrandBadgeProps) => {
  if (!product.brand?.slug) {
    return null
  }

  return (
    <LocalizedClientLink href={`/brands/${product.brand.slug}`} className="text-ui-fg-muted hover:text-ui-fg-subtle text-sm">
      {product.brand.name}
    </LocalizedClientLink>
  )
}

export default ProductBrandBadge
