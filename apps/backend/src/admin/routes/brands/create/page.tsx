import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Input, Textarea, Label, Container } from "@medusajs/ui"

type BrandFormState = {
  name: string
  slug: string
  description: string
  logo_url: string
}

const initialState: BrandFormState = {
  name: "",
  slug: "",
  description: "",
  logo_url: "",
}

const CreateBrandPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialState)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (field: keyof BrandFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      const response = await fetch("/admin/brands", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.message || "Failed to create brand")
      }

      navigate("/brands")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create brand")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Container className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Create Brand</h1>
          <p className="text-sm text-ui-fg-subtle">Create a new brand for your catalog.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={form.name} onChange={(e) => handleChange("name", e.target.value)} required />
        </div>

        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" value={form.slug} onChange={(e) => handleChange("slug", e.target.value)} required />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={form.description} onChange={(e) => handleChange("description", e.target.value)} rows={4} />
        </div>

        <div>
          <Label htmlFor="logo_url">Logo URL</Label>
          <Input id="logo_url" value={form.logo_url} onChange={(e) => handleChange("logo_url", e.target.value)} />
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <div className="flex gap-3">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Create Brand"}
          </Button>
          <Button variant="secondary" type="button" onClick={() => navigate("/brands")}>
            Cancel
          </Button>
        </div>
      </form>
    </Container>
  )
}

export default CreateBrandPage
