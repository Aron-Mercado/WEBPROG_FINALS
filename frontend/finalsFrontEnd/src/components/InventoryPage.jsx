/**
 * InventoryPage — manager CRUD: add product, edit, archive (hide from menu), delete.
 * isProductArchived: DB may send archived as "0" string; Number() fixes Active/Archived UI.
 */
import React, { useMemo, useState } from 'react';

export function isProductArchived(product) {
  return Number(product?.archived) === 1;
}

/** Build body for PUT /api/products/:id including archive flag */
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
    <section className="py-8 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Inventory Management</h2>
      <p className="text-gray-600 mb-8">
        Archived items are hidden from the customer menu but stay editable here.
        <span className="ml-2 font-medium">
          {activeCount} active · {archivedCount} archived
        </span>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Add New Product</h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Pizza"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.archived}
                onChange={(e) => setFormData({ ...formData, archived: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Create as archived</span>
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : '+ Create Product'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Products</h3>
          {availableProducts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No products yet. Create one to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableProducts.map((product) => {
                const archived = isProductArchived(product);
                const isEditing = editingId === product.id;

                return (
                  <div
                    key={product.id}
                    className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${
                      archived ? 'border-l-gray-400' : 'border-l-green-500'
                    } ${archived ? 'bg-gray-50' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-bold text-gray-800">{product.name}</h4>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded shrink-0 ml-2 ${
                          archived
                            ? 'bg-gray-200 text-gray-700'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {archived ? 'Archived' : 'Active'}
                      </span>
                    </div>

                    {isEditing ? (
                      <div className="space-y-3 mb-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                          <input
                            type="text"
                            value={editDraft.name}
                            onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })}
                            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Price ($)</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editDraft.price}
                            onChange={(e) => setEditDraft({ ...editDraft, price: e.target.value })}
                            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Stock</label>
                          <input
                            type="number"
                            min="0"
                            value={editDraft.stock}
                            onChange={(e) => setEditDraft({ ...editDraft, stock: e.target.value })}
                            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => saveEditing(product)}
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
                          >
                            Save Changes
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditing}
                            disabled={loading}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-4">
                        <p className="text-2xl font-bold text-blue-600 mb-1">
                          ${Number(product.price).toFixed(2)}
                        </p>
                        <p className="text-gray-600">
                          Stock: <span className="font-bold text-lg">{product.stock}</span>
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {!isEditing && (
                        <button
                          type="button"
                          onClick={() => startEditing(product)}
                          disabled={loading || editingId !== null}
                          className="flex-1 min-w-[5rem] bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded font-medium transition disabled:opacity-50"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => toggleArchive(product)}
                        disabled={loading || (editingId !== null && editingId !== product.id)}
                        className={`flex-1 min-w-[5rem] px-3 py-2 rounded font-medium transition disabled:opacity-50 ${
                          archived
                            ? 'bg-green-100 hover:bg-green-200 text-green-800'
                            : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800'
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
                        className="flex-1 min-w-[5rem] bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded font-medium transition disabled:opacity-50"
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
