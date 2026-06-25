import { model } from "@medusajs/framework/utils"

const Brand = model.define("brand", {
  id: model.id().primaryKey(),

  name: model.text(),

  slug: model.text(),

  description: model.text().nullable(),

  logo_url: model.text().nullable(),
})

export default Brand