"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  Package,
  Plus,
  Search,
  X,
} from "lucide-react";
import { catalogApi } from "@/lib/api";

type Product = {
  id: number;
  title: string;
  category?: { name: string };
  category_id: number;
  is_active: boolean;
  images?: { image: { url: string } }[];
  variants?: { price?: number; stock?: number }[];
};
type Category = { id: number; name: string };

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({
    title: "",
    ingredients: "",
    details: "",
    category_id: "",
    price: "",
    stock: "",
    image: null as File | null,
  });

  async function load() {
    try {
      const [productResponse, categoryResponse] = await Promise.all([
        catalogApi.products({ limit: 100 }),
        catalogApi.categories({ limit: 100 }),
      ]);
      setProducts(
        productResponse.data?.data?.items ?? productResponse.data?.data ?? [],
      );
      setCategories(
        categoryResponse.data?.data?.items ?? categoryResponse.data?.data ?? [],
      );
    } catch {
      setNotice("Could not load catalog. Check your API connection.");
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      if (!form.image) throw new Error("Product image is required");
      const upload = new FormData();
      upload.append("files", form.image);
      const uploaded = await catalogApi.uploadImages(upload);
      const imageId = uploaded.data?.data?.[0]?.id;
      await catalogApi.createProduct({
        title: form.title,
        ingredients: form.ingredients,
        details: form.details,
        category_id: Number(form.category_id),
        is_active: true,
        variants: [{ price: Number(form.price), stock: Number(form.stock) }],
        images: [{ image_id: imageId, is_primary: true }],
      });
      setOpen(false);
      setForm({
        title: "",
        ingredients: "",
        details: "",
        category_id: "",
        price: "",
        stock: "",
        image: null,
      });
      await load();
      setNotice("Product added successfully");
    } catch {
      setNotice(
        "Product could not be saved. Check required fields and API response.",
      );
    } finally {
      setSaving(false);
    }
  }

  const filtered = products.filter((product) =>
    product.title.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <main className="min-h-screen bg-[#f7f6f2] text-[#20221f]">
      <header className="border-b border-[#e5e3dc] bg-[#fbfaf7] px-5 py-5 md:px-10">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between">
          <div>
            <Link
              href="/"
              className="mb-3 flex items-center gap-2 text-xs text-[#8d8e87]"
            >
              <ArrowLeft size={14} /> Back to overview
            </Link>
            <h1 className="font-serif text-4xl">Products</h1>
            <p className="mt-1 text-sm text-[#85867f]">
              Manage your perfumes, attars and fragrance variants.
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-[#20221f] px-4 py-3 text-xs font-medium text-white"
          >
            <Plus size={16} /> Add product
          </button>
        </div>
      </header>
      <section className="mx-auto max-w-[1380px] px-5 py-8 md:px-10">
        <div className="mb-5 flex max-w-sm items-center gap-2 rounded-xl border border-[#e5e3dc] bg-[#fbfaf7] px-3 py-3">
          <Search size={15} className="text-[#aaa9a2]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
        <div className="overflow-x-auto rounded-2xl border border-[#e5e3dc] bg-[#fbfaf7]">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="border-b border-[#ebe9e2] text-[10px] uppercase tracking-[0.12em] text-[#a0a19b]">
                <th className="p-5">Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-[#f0eee8] last:border-0"
                >
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0].image.url}
                          alt=""
                          className="h-11 w-11 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#eee9df]">
                          <Package size={17} />
                        </div>
                      )}
                      <span className="text-sm font-medium">
                        {product.title}
                      </span>
                    </div>
                  </td>
                  <td className="text-sm text-[#777971]">
                    {product.category?.name ??
                      categories.find(
                        (category) => category.id === product.category_id,
                      )?.name ??
                      "—"}
                  </td>
                  <td className="text-sm">
                    ₹{product.variants?.[0]?.price ?? "—"}
                  </td>
                  <td className="text-sm text-[#777971]">
                    {product.variants?.[0]?.stock ?? "—"}
                  </td>
                  <td>
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] ${product.is_active ? "bg-[#e5ede5] text-[#55715a]" : "bg-[#eee9e4] text-[#8c7568]"}`}
                    >
                      {product.is_active ? "Active" : "Draft"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && (
            <div className="p-12 text-center text-sm text-[#92938c]">
              No products found.
            </div>
          )}
        </div>
      </section>
      {notice && (
        <div className="fixed bottom-5 right-5 rounded-xl bg-[#20221f] px-4 py-3 text-xs text-white">
          {notice}
        </div>
      )}
      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#20221f]/35 p-4">
          <form
            onSubmit={submit}
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-[#fbfaf7] p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl">Add product</h2>
                <p className="mt-1 text-xs text-[#92938c]">
                  Create the catalog entry and its first variant.
                </p>
              </div>
              <button type="button" onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-medium sm:col-span-2">
                Product title
                <input
                  required
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-[#e2e0d8] bg-white px-3 py-3 text-sm"
                />
              </label>
              <label className="text-xs font-medium">
                Category
                <select
                  required
                  value={form.category_id}
                  onChange={(event) =>
                    setForm({ ...form, category_id: event.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-[#e2e0d8] bg-white px-3 py-3 text-sm"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-medium">
                Price
                <input
                  required
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(event) =>
                    setForm({ ...form, price: event.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-[#e2e0d8] bg-white px-3 py-3 text-sm"
                />
              </label>
              <label className="text-xs font-medium">
                Opening stock
                <input
                  required
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(event) =>
                    setForm({ ...form, stock: event.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-[#e2e0d8] bg-white px-3 py-3 text-sm"
                />
              </label>
              <label className="text-xs font-medium sm:col-span-2">
                Ingredients
                <textarea
                  required
                  value={form.ingredients}
                  onChange={(event) =>
                    setForm({ ...form, ingredients: event.target.value })
                  }
                  className="mt-2 min-h-20 w-full rounded-xl border border-[#e2e0d8] bg-white px-3 py-3 text-sm"
                />
              </label>
              <label className="text-xs font-medium sm:col-span-2">
                Details
                <textarea
                  required
                  value={form.details}
                  onChange={(event) =>
                    setForm({ ...form, details: event.target.value })
                  }
                  className="mt-2 min-h-20 w-full rounded-xl border border-[#e2e0d8] bg-white px-3 py-3 text-sm"
                />
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[#d5d1c6] bg-[#f7f5ef] p-4 text-xs text-[#888980] sm:col-span-2">
                <ImagePlus size={17} />
                {form.image?.name ?? "Choose product image"}
                <input
                  required
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) =>
                    setForm({ ...form, image: event.target.files?.[0] ?? null })
                  }
                />
              </label>
            </div>
            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-2.5 text-xs"
              >
                Cancel
              </button>
              <button
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-[#20221f] px-5 py-2.5 text-xs font-medium text-white"
              >
                {saving && <Loader2 size={14} className="animate-spin" />} Save
                product
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
