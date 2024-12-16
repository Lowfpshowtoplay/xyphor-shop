import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import Papa from "papaparse"; // CSV parsing library

const Admin = () => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", stock: "", price: "", category: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("name");
  const [notification, setNotification] = useState("");
  const [editProductId, setEditProductId] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setPrevLocation(location.state?.data || "Dashboard");

    // Load products from local storage
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(storedProducts);
  }, [location]);

  useEffect(() => {
    // Store products in local storage whenever it changes
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.stock && newProduct.price) {
      const newProductData = {
        id: products.length + 1,
        ...newProduct,
        stock: +newProduct.stock,
        price: +newProduct.price,
      };
      setProducts([...products, newProductData]);
      setNewProduct({ name: "", stock: "", price: "", category: "" });
      setNotification("Product added successfully!");
    }
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
    setNotification("Product deleted successfully!");
  };

  const handleEditProduct = (id) => {
    const productToEdit = products.find((product) => product.id === id);
    setNewProduct({
      name: productToEdit.name,
      stock: productToEdit.stock,
      price: productToEdit.price,
      category: productToEdit.category,
    });
    setEditProductId(id);
  };

  const handleSaveEdit = () => {
    if (newProduct.name && newProduct.stock && newProduct.price) {
      setProducts(
        products.map((product) =>
          product.id === editProductId
            ? { ...product, ...newProduct, stock: +newProduct.stock, price: +newProduct.price }
            : product
        )
      );
      setNewProduct({ name: "", stock: "", price: "", category: "" });
      setEditProductId(null);
      setNotification("Product updated successfully!");
    }
  };

  const handleBulkUpload = (event) => {
    setUploading(true);
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const newProducts = result.data.map((row) => ({
            id: products.length + 1,
            name: row[0],
            stock: row[1],
            price: row[2],
            category: row[3],
          }));
          setProducts([...products, ...newProducts]);
          setUploading(false);
          setNotification(`${newProducts.length} products added from CSV.`);
        },
        header: false,
      });
    }
  };

  const filteredProducts = products
    .filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortOption === "stock") return b.stock - a.stock;
      if (sortOption === "price") return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

  const lowStockProducts = products.filter((product) => product.stock < 10);

  const totalInventoryValue = products.reduce((acc, product) => acc + product.stock * product.price, 0);

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Inventory Management" prevLocation={prevLocation} />
      <div className="py-10">
        <h1 className="text-2xl font-semibold mb-6">Inventory Dashboard</h1>

        {/* Notification */}
        {notification && (
          <div className="bg-green-100 text-green-700 p-4 rounded mb-6">
            <p className="font-semibold">{notification}</p>
          </div>
        )}

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <div className="bg-yellow-100 text-yellow-700 p-4 rounded mb-6">
            <p className="font-semibold">Low Stock Alert: {lowStockProducts.length} products are low in stock!</p>
          </div>
        )}

        {/* Search and Sorting */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 w-full sm:w-1/2 lg:w-1/3"
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 w-full sm:w-1/4 lg:w-1/6"
          >
            <option value="name">Sort by Name</option>
            <option value="stock">Sort by Stock</option>
            <option value="price">Sort by Price</option>
          </select>
        </div>

        {/* Total Inventory Value */}
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded">
          <p className="text-lg font-semibold">
            Total Inventory Value: <span className="font-bold">Rs.{totalInventoryValue.toFixed(2)}</span>
          </p>
        </div>

        {/* Product Upload (CSV) */}
        <div className="mb-6">
          <input
            type="file"
            accept=".csv"
            onChange={handleBulkUpload}
            className="border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500"
          />
          {uploading && <span className="ml-4 text-sm text-gray-500">Uploading...</span>}
        </div>

        {/* Products Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <table className="min-w-full border-collapse table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Category</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Stock</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Price</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className={`border-b ${product.stock < 10 ? "bg-red-100" : "bg-white"}`}
                >
                  <td className="px-6 py-4 text-sm text-gray-800">{product.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{product.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{product.stock}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">Rs.{product.price}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-500 hover:text-red-700 mr-4"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleEditProduct(product.id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add or Edit Product */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">{editProductId ? "Edit Product" : "Add New Product"}</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editProductId) {
                handleSaveEdit();
              } else {
                handleAddProduct();
              }
            }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600">Product Name</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="border rounded px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product name"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600">Category</label>
              <input
                type="text"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="border rounded px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product category"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600">Stock</label>
              <input
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                className="border rounded px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter stock quantity"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600">Price</label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="border rounded px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter price per unit"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 duration-300"
            >
              {editProductId ? "Save Changes" : "Add Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Admin;
