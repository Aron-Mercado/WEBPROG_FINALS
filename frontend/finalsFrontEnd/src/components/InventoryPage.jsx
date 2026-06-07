/**
 * InventoryPage — manager CRUD: add product, edit, archive (hide from menu), delete.
 */
import React, { useMemo, useState } from 'react';

export function isProductArchived(product) {
  return Number(product?.archived) === 1;
}

function toUpdatePayload(product, archivedOverride) {
  const archived =
    archivedOverride !== undefined
      ? archivedOverride
      : isProductArchived(product)
        ? 1
        : 0;
  return {
    id: product.id,
    name: String(product.name).trim(),
    price: Number(product.price),
    stock: parseInt(product.stock, 10),
    archived,
  };
}

export default function InventoryPage({
  products,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
  loading,
}) {
  const [formData, setFormData] = useState({ name: '', price: '', stock: '', archived: false });
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({ name: '', price: '', stock: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateProduct({
      name: formData.name,
      price: Number(formData.price),
      stock: Number(formData.stock),
      archived: formData.archived ? 1 : 0,
    });
    setFormData({ name: '', price: '', stock: '', archived: false });
  };

  const startEditing = (product) => {
    setEditingId(product.id);
    setEditDraft({
      name: product.name,
      price: String(product.price),
      stock: String(product.stock),
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditDraft({ name: '', price: '', stock: '' });
  };

  const saveEditing = (product) => {
    const name = editDraft.name.trim();
    const price = Number(editDraft.price);
    const stock = parseInt(editDraft.stock, 10);

    if (!name || Number.isNaN(price) || price < 0 || Number.isNaN(stock) || stock < 0) {
      return;
    }

    onUpdateProduct({
      id: product.id,
      name,
      price,
      stock,
      archived: isProductArchived(product) ? 1 : 0,
    });
    cancelEditing();
  };

  const toggleArchive = (product) => {
    const nextArchived = isProductArchived(product) ? 0 : 1;
    onUpdateProduct(toUpdatePayload(product, nextArchived));
    if (editingId === product.id) {
      cancelEditing();
    }
  };

  const availableProducts = useMemo(() => products?.filter(Boolean) || [], [products]);
  const activeCount = availableProducts.filter((p) => !isProductArchived(p)).length;
  const archivedCount = availableProducts.length - activeCount;

  return (
    <section className="page-wrap">
      <div className="mb-8">
        <h2 className="page-title">Inventory</h2>
        <p className="page-subtitle">
          Archived items stay off the customer menu
          <span className="ml-2 font-medium text-teal-700">
            {activeCount} active · {archivedCount} archived
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card-padded lg:col-span-1">
          <h3 className="text-lg font-bold text-slate-800 mb-5">Add product</h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="label">Product name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="input-field"
                placeholder="e.g. Cheese Pizza"
              />
            </div>
            <div>
              <label className="label">Price</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="input-field"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="label">Stock</label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
                className="input-field"
                placeholder="0"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600">
              <input
                type="checkbox"
                checked={formData.archived}
                onChange={(e) => setFormData({ ...formData, archived: e.target.checked })}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              Create as archived
            </label>
            <button type="submit" disabled={loading} className="btn-primary-full">
              {loading ? 'Saving...' : 'Add product'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 mb-5">All products</h3>
          {availableProducts.length === 0 ? (
            <div className="empty-state">
              <p>No products yet. Add one to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableProducts.map((product) => {
                const archived = isProductArchived(product);
                const isEditing = editingId === product.id;

                return (
                  <div
                    key={product.id}
                    className={`card-padded border-l-4 ${
                      archived ? 'border-l-slate-300 bg-slate-50/50' : 'border-l-teal-500'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <h4 className="font-bold text-slate-800">{product.name}</h4>
                      <span className={archived ? 'badge-muted' : 'badge-success'}>
                        {archived ? 'Archived' : 'Active'}
                      </span>
                    </div>

                    {isEditing ? (
                      <div className="space-y-3 mb-4">
                        <div>
                          <label className="label text-xs">Name</label>
                          <input
                            type="text"
                            value={editDraft.name}
                            onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })}
                            className="input-field py-2"
                          />
                        </div>
                        <div>
                          <label className="label text-xs">Price ($)</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editDraft.price}
                            onChange={(e) => setEditDraft({ ...editDraft, price: e.target.value })}
                            className="input-field py-2"
                          />
                        </div>
                        <div>
                          <label className="label text-xs">Stock</label>
                          <input
                            type="number"
                            min="0"
                            value={editDraft.stock}
                            onChange={(e) => setEditDraft({ ...editDraft, stock: e.target.value })}
                            className="input-field py-2"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => saveEditing(product)}
                            disabled={loading}
                            className="btn-primary flex-1 py-2"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditing}
                            disabled={loading}
                            className="btn-secondary flex-1 py-2"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-4">
                        <p className="text-2xl font-bold text-teal-700">
                          ${Number(product.price).toFixed(2)}
                        </p>
                        <p className="text-sm text-slate-500">
                          Stock: <span className="font-bold text-slate-700">{product.stock}</span>
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {!isEditing && (
                        <button
                          type="button"
                          onClick={() => startEditing(product)}
                          disabled={loading || editingId !== null}
                          className="btn-soft flex-1 min-w-[4.5rem]"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => toggleArchive(product)}
                        disabled={loading || (editingId !== null && editingId !== product.id)}
                        className={`flex-1 min-w-[4.5rem] ${
                          archived ? 'btn-soft' : 'btn-warn-soft'
                        }`}
                      >
                        {archived ? 'Restore' : 'Archive'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (editingId === product.id) cancelEditing();
                          onDeleteProduct(product.id);
                        }}
                        disabled={loading || editingId !== null}
                        className="btn-danger-soft flex-1 min-w-[4.5rem]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
