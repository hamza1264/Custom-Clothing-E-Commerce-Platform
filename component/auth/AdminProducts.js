  "use client";

import {
  ChevronRight,
  House,
  Image as ImageIcon,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import AdminRefreshButton from "@/component/auth/AdminRefreshButton";
import AdminSidebar from "@/component/auth/AdminSidebar";
import dashboardStyles from "./AdminDashboard.module.css";
import styles from "./AdminProducts.module.css";

const EMPTY_DRAFT = {
  id: "",
  name: "",
  category: "",
  price: "",
  originalPrice: "",
  image: "",
  fabric: "",
  sizes: "",
  colors: "",
  features: "",
  description: "",
  fabricCare: "",
};

function toDraft(product) {
  return {
    name: product.name ?? product.title ?? "",
    category: product.category ?? "",
    price: String(product.price ?? ""),
    originalPrice: String(product.originalPrice ?? ""),
    image: product.image ?? product.images?.[0] ?? "",
    fabric: product.fabric ?? "",
    sizes: (product.sizes ?? []).join(", "),
    colors: (product.colors ?? [])
      .map((color) =>
        typeof color === "string"
          ? color
          : color.hex
            ? `${color.name}:${color.hex}`
            : color.name
      )
      .join(", "),
    features: (product.features ?? []).join("\n"),
    description: product.description ?? "",
    fabricCare: product.fabricCare ?? "",
  };
}

function splitList(value) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function parseColors(value) {
  return splitList(value).map((color) => {
    const separator = color.lastIndexOf(":");
    if (separator < 1) return color;

    const name = color.slice(0, separator).trim();
    const hex = color.slice(separator + 1).trim();
    return /^#[\da-f]{6}$/i.test(hex) ? { name, hex } : color;
  });
}

async function requestJson(url, options) {
  const response = await fetch(url, { cache: "no-store", ...options });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Could not complete the product request.");
  }
  return result;
}

export default function AdminProducts({ name, email }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [requestError, setRequestError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [visibility, setVisibility] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [draft, setDraft] = useState(null);
  const [editingId, setEditingId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      setIsLoading(true);
      setLoadError("");
      try {
        const result = await requestJson("/api/products?includeInactive=true");
        if (active) setProducts(result.products);
      } catch (error) {
        if (active) setLoadError(error.message);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadProducts();
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const categories = useMemo(
    () =>
      [...new Set(products.map((product) => product.category).filter(Boolean))]
        .sort((first, second) => first.localeCompare(second)),
    [products]
  );

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch =
        !query ||
        String(product.title ?? product.name ?? "")
          .toLowerCase()
          .includes(query) ||
        String(product.id ?? "").toLowerCase().includes(query) ||
        String(product.category ?? "").toLowerCase().includes(query);
      const matchesCategory =
        category === "all" || product.category === category;
      const matchesVisibility =
        visibility === "all" ||
        (visibility === "active" ? product.active : !product.active);
      const price = Number(product.price);
      const matchesPrice =
        priceRange === "all" ||
        (priceRange === "under-3000" && price < 3000) ||
        (priceRange === "3000-5999" && price >= 3000 && price < 6000) ||
        (priceRange === "6000-plus" && price >= 6000);
      return (
        matchesSearch &&
        matchesCategory &&
        matchesVisibility &&
        matchesPrice
      );
    });
  }, [products, search, category, visibility, priceRange]);

  function startCreate() {
    setEditingId("");
    setDraft({ ...EMPTY_DRAFT });
    setRequestError("");
    setNotice("");
  }

  function startEdit(product) {
    setEditingId(product.id);
    setDraft(toDraft(product));
    setRequestError("");
    setNotice("");
  }

  function closeForm() {
    setDraft(null);
    setEditingId("");
    setRequestError("");
  }

  function updateDraft(event) {
    const { name, value } = event.target;
    setDraft((current) => ({ ...current, [name]: value }));
  }

  async function saveProduct(event) {
    event.preventDefault();
    setIsSaving(true);
    setRequestError("");
    setNotice("");

    const price = Number(draft.price);
    const originalPrice = draft.originalPrice.trim()
      ? Number(draft.originalPrice)
      : price;
    const sizes = splitList(draft.sizes);
    const colors = splitList(draft.colors);

    if (!sizes.length || !colors.length) {
      setRequestError("Add at least one size and one color.");
      setIsSaving(false);
      return;
    }

    const productInput = {
      id: draft.id.trim(),
      title: draft.name.trim(),
      category: draft.category.trim(),
      price,
      originalPrice,
      images: [draft.image.trim()],
      fabric: draft.fabric.trim(),
      sizes,
      colors: parseColors(draft.colors),
      features: draft.features.split("\n").map((item) => item.trim()).filter(Boolean),
      description: draft.description.trim(),
      fabricCare: draft.fabricCare.trim(),
    };

    try {
      const result = await requestJson(
        editingId
          ? `/api/products/${encodeURIComponent(editingId)}`
          : "/api/products",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productInput),
        }
      );
      setProducts((current) =>
        editingId
          ? current.map((product) =>
              product.id === editingId ? result.product : product
            )
          : [result.product, ...current]
      );
      setNotice(editingId ? "Product updated." : "Product added to the catalog.");
      setDraft(null);
      setEditingId("");
    } catch (error) {
      setRequestError(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleProduct(product) {
    setUpdatingId(product.id);
    setRequestError("");
    setNotice("");
    try {
      const result = await requestJson(
        `/api/products/${encodeURIComponent(product.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ active: !product.active }),
        }
      );
      setProducts((current) =>
        current.map((item) => (item.id === product.id ? result.product : item))
      );
      setNotice(result.product.active ? "Product restored." : "Product archived.");
    } catch (error) {
      setRequestError(error.message);
    } finally {
      setUpdatingId("");
    }
  }

  async function deleteProduct(product) {
    const title = product.title ?? product.name ?? product.id;
    if (
      !window.confirm(
        `Permanently delete "${title}"? This cannot be undone.`
      )
    ) {
      return;
    }

    setUpdatingId(product.id);
    setRequestError("");
    setNotice("");
    try {
      await requestJson(`/api/products/${encodeURIComponent(product.id)}`, {
        method: "DELETE",
      });
      setProducts((current) =>
        current.filter((item) => item.id !== product.id)
      );
      setNotice("Product deleted.");
    } catch (error) {
      setRequestError(error.message);
    } finally {
      setUpdatingId("");
    }
  }

  return (
    <main className={`${dashboardStyles.page} ${dashboardStyles.ordersPage}`}>
      <AdminSidebar name={name} email={email} activeItem="products" />
      <div className={dashboardStyles.content}>
        <div className={styles.page}>
          <header className={styles.header}>
            <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
              <Link href="/admin" aria-label="Admin dashboard">
                <House aria-hidden="true" />
              </Link>
              <ChevronRight aria-hidden="true" />
              <span>Admin Dashboard</span>
              <ChevronRight aria-hidden="true" />
              <span aria-current="page">Products Management</span>
            </nav>
            <div className={styles.pageHeaderRow}>
              <div className={styles.heading}>
                <h1>Products Management</h1>
                <p className={styles.description}>
                  Manage your catalog, pricing, and storefront visibility.
                </p>
              </div>
              <div className={styles.headerActions}>
                <AdminRefreshButton disabled={isLoading} />
                <button className={styles.primaryButton} onClick={startCreate} type="button">
                  <Plus aria-hidden="true" />
                  Add new product
                </button>
              </div>
            </div>
          </header>

          {requestError && <p className={styles.error} role="alert">{requestError}</p>}
          {notice && <p className={styles.notice} role="status">{notice}</p>}

          <section className={styles.filterBar} aria-label="Product filters">
            <label className={styles.searchBox}>
              <Search aria-hidden="true" />
              <span className={styles.visuallyHidden}>Search products</span>
              <input
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <label className={styles.filter}>
              <span className={styles.visuallyHidden}>Filter by category</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="all">All categories</option>
                {categories.map((item) => (
                  <option value={item} key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className={styles.filter}>
              <span className={styles.visuallyHidden}>Filter product visibility</span>
              <select value={visibility} onChange={(event) => setVisibility(event.target.value)}>
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Archived</option>
              </select>
            </label>
            <label className={styles.filter}>
              <span className={styles.visuallyHidden}>Filter by price range</span>
              <select value={priceRange} onChange={(event) => setPriceRange(event.target.value)}>
                <option value="all">All prices</option>
                <option value="under-3000">Under Rs. 3,000</option>
                <option value="3000-5999">Rs. 3,000 – 5,999</option>
                <option value="6000-plus">Rs. 6,000 and above</option>
              </select>
            </label>
            <button
              className={styles.resetButton}
              onClick={() => {
                setSearch("");
                setCategory("all");
                setVisibility("all");
                setPriceRange("all");
              }}
              type="button"
            >
              Reset filters
            </button>
          </section>

          {draft && (
            <section className={styles.formPanel} aria-labelledby="product-form-title">
              <div className={styles.formHeading}>
                <div>
                  <p className={styles.eyebrow}>{editingId ? "EDIT PRODUCT" : "NEW PRODUCT"}</p>
                  <h2 id="product-form-title">{editingId ? "Update product details" : "Add a product"}</h2>
                </div>
                <button
                  className={styles.iconButton}
                  onClick={closeForm}
                  type="button"
                  aria-label="Close product form"
                >
                  <X aria-hidden="true" />
                </button>
              </div>
              <form className={styles.form} onSubmit={saveProduct}>
                {!editingId && (
                  <label>
                    Product ID
                    <input
                      name="id"
                      value={draft.id}
                      onChange={updateDraft}
                      placeholder="e.g. suit-001"
                      pattern="[a-zA-Z0-9_-]+"
                      title="Use only letters, numbers, hyphens, or underscores."
                      required
                      maxLength={80}
                    />
                  </label>
                )}
                <label>
                  Product name
                  <input name="name" value={draft.name} onChange={updateDraft} required maxLength={120} />
                </label>
                <label>
                  Category
                  <input name="category" value={draft.category} onChange={updateDraft} required maxLength={80} />
                </label>
                <label>
                  Price (Rs.)
                  <input name="price" type="number" min="0" max="10000000" step="1" value={draft.price} onChange={updateDraft} required />
                </label>
                <label>
                  Original price (Rs.)
                  <input name="originalPrice" type="number" min="0" max="10000000" step="1" value={draft.originalPrice} onChange={updateDraft} />
                </label>
                <label className={styles.wideField}>
                  Product image URL
                  <input
                    name="image"
                    value={draft.image}
                    onChange={updateDraft}
                    placeholder="/category/product.jpg or https://..."
                    required
                    maxLength={500}
                  />
                </label>
                <label>
                  Fabric
                  <input name="fabric" value={draft.fabric} onChange={updateDraft} maxLength={100} />
                </label>
                <label>
                  Sizes (comma-separated)
                  <input name="sizes" value={draft.sizes} onChange={updateDraft} placeholder="S, M, L" required />
                </label>
                <label>
                  Colors (comma-separated)
                  <input name="colors" value={draft.colors} onChange={updateDraft} placeholder="Navy:#1c2d42, Cream" required />
                </label>
                <label className={styles.wideField}>
                  Product description
                  <textarea name="description" value={draft.description} onChange={updateDraft} rows={3} maxLength={4000} />
                </label>
                <label>
                  Features (one per line)
                  <textarea name="features" value={draft.features} onChange={updateDraft} rows={3} />
                </label>
                <label>
                  Fabric care
                  <textarea name="fabricCare" value={draft.fabricCare} onChange={updateDraft} rows={3} maxLength={1000} />
                </label>
                <div className={`${styles.formActions} ${styles.wideField}`}>
                  <button className={styles.secondaryButton} onClick={closeForm} type="button">
                    Cancel
                  </button>
                  <button className={styles.primaryButton} disabled={isSaving} type="submit">
                    {isSaving ? "Saving..." : editingId ? "Save changes" : "Create product"}
                  </button>
                </div>
              </form>
            </section>
          )}

          <section className={styles.catalog} aria-labelledby="catalog-title">
            <div className={styles.catalogHeading}>
              <div>
                <h2 id="catalog-title">All products</h2>
                <p>{isLoading ? "Loading catalog..." : `${visibleProducts.length} of ${products.length} products`}</p>
              </div>
            </div>

            {loadError && (
              <div className={styles.loadError}>
                <p className={styles.error} role="alert">{loadError}</p>
                <button className={styles.secondaryButton} onClick={() => setReloadKey((key) => key + 1)} type="button">
                  Try again
                </button>
              </div>
            )}
            {isLoading && <p className={styles.emptyState} role="status">Loading products...</p>}
            {!isLoading && !loadError && visibleProducts.length === 0 && (
              <div className={styles.emptyState}>
                <ImageIcon aria-hidden="true" />
                <p>{products.length ? "No products match these filters." : "Your catalog is empty. Add your first product to get started."}</p>
              </div>
            )}
            {!isLoading && !loadError && visibleProducts.length > 0 && (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Visibility</th>
                      <th><span className={styles.visuallyHidden}>Actions</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleProducts.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <div className={styles.productCell}>
                        <Image src={product.image} alt="" width={42} height={50} unoptimized />
                        <div>
                          <strong>{product.title ?? product.name}</strong>
                          <small className={styles.productId}>ID: {product.id}</small>
                          <small>{product.fabric || "Fabric not specified"}</small>
                        </div>
                          </div>
                        </td>
                        <td>{product.category}</td>
                        <td className={styles.price}>Rs. {Number(product.price).toLocaleString()}</td>
                        <td>
                          <span className={`${styles.badge} ${product.active ? styles.active : styles.archived}`}>
                            {product.active ? "Active" : "Archived"}
                          </span>
                        </td>
                        <td>
                          <div className={styles.rowActions}>
                            <button className={styles.textButton} onClick={() => startEdit(product)} disabled={updatingId === product.id} type="button">
                              Edit
                            </button>
                            <button
                              className={styles.textButton}
                              onClick={() => toggleProduct(product)}
                              disabled={updatingId === product.id}
                              type="button"
                            >
                              {updatingId === product.id
                                ? "Saving..."
                                : product.active
                                  ? "Archive"
                                  : "Restore"}
                            </button>
                            <button
                              className={`${styles.textButton} ${styles.deleteButton}`}
                              onClick={() => deleteProduct(product)}
                              disabled={updatingId === product.id}
                              type="button"
                            >
                              {updatingId === product.id ? (
                                "Deleting..."
                              ) : (
                                <>
                                  <Trash2 aria-hidden="true" />
                                  Delete
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
          <footer className={styles.footer}>
            <Link href="/admin">Back to dashboard</Link>
            <Link href="/shop">View storefront</Link>
          </footer>
        </div>
      </div>
    </main>
  );
}
