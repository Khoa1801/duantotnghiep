import { useState } from "react";

const Products = () => {
  const [products, setProducts] = useState([
    { id: 1, name: "Nike Air Max", price: 120, stock: 10 },
    { id: 2, name: "Adidas UltraBoost", price: 150, stock: 5 },
    { id: 3, name: "Puma RS-X", price: 110, stock: 8 },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);

  // Mở modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewProduct({ name: "", price: "", stock: "" });
  };

  // Thêm sản phẩm mới
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const newId = products.length + 1;
    setProducts([...products, { id: newId, ...newProduct }]);
    closeModal();
  };

  // Cập nhật sản phẩm đang chỉnh sửa
  const handleEditChange = (id, field, value) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, [field]: value } : product
      )
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Danh sách sản phẩm</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          onClick={openModal}
        >
          + Thêm sản phẩm
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Tên sản phẩm</th>
            <th className="border border-gray-300 p-2">Giá</th>
            <th className="border border-gray-300 p-2">Kho</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="text-center">
              <td className="border border-gray-300 p-2">{product.id}</td>
              <td className="border border-gray-300 p-2">
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) =>
                    handleEditChange(product.id, "name", e.target.value)
                  }
                  className="border px-2 py-1 w-full"
                />
              </td>
              <td className="border border-gray-300 p-2">
                <input
                  type="number"
                  value={product.price}
                  onChange={(e) =>
                    handleEditChange(product.id, "price", e.target.value)
                  }
                  className="border px-2 py-1 w-full"
                />
              </td>
              <td className="border border-gray-300 p-2">
                <input
                  type="number"
                  value={product.stock}
                  onChange={(e) =>
                    handleEditChange(product.id, "stock", e.target.value)
                  }
                  className="border px-2 py-1 w-full"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Thêm Sản Phẩm */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 text-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Thêm sản phẩm</h2>
            <input
              type="text"
              placeholder="Tên sản phẩm"
              className="border w-full p-2 mb-2"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Giá"
              className="border w-full p-2 mb-2"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Số lượng tồn kho"
              className="border w-full p-2 mb-4"
              value={newProduct.stock}
              onChange={(e) =>
                setNewProduct({ ...newProduct, stock: e.target.value })
              }
            />
            <div className="flex justify-end">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
                onClick={closeModal}
              >
                Hủy
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleAddProduct}
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
