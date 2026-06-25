import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260625120000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`ALTER TABLE IF EXISTS "brand" ADD COLUMN IF NOT EXISTS "logo_url" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`ALTER TABLE IF EXISTS "brand" DROP COLUMN IF EXISTS "logo_url";`);
  }
}
