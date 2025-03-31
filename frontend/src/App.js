import React, { useState, useEffect } from 'react';
import './App.css';
import { TbArrowBigUpLines, TbArrowBigDownLines } from "react-icons/tb";
import NewProductModal from "./scripts/newProduct";
import DeleteProductModal from "./scripts/deleteProduct"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {

  // NewProduct Modal //
  const [newProduct, setNewProduct] = useState({
    _id: 0,
    name: "",
    price: 0,
    image: "",
    supplier: "",
    editable: "",
  }); 
  const [openNewProductModal, setOpenNewProductModal] = useState(false);
  const handleCloseNewProductModal = () => {
    setOpenNewProductModal(false);
  };
  const handleNewProductClick = () => {
    setOpenNewProductModal(true);
    setNewProduct({
      _id: 0,
      name: "",
      price: 0,
      image: "",
      supplier: "",
      editable: "",
    });
  };
  const handleSaveClick = async () => {
    try {
      const response = await fetch("http://localhost:5000/products/addProduct", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProduct),
      });
      const data = await response.json();
      console.log("Server response:", data);

      if (data.success) {
        toast.success("המוצר נוסף בהצלחה");
        if (!suppliers.has(newProduct.supplier)) {
          setSuppliers(new Set([...suppliers, newProduct.supplier]));
        }
        setProducts(prev => [...prev, newProduct]);
        setOpenNewProductModal(false);
      } else {
          toast.error(data.message);
          console.error("Error in response:", data.message);
      }
    } catch (error) {
        toast.error("ההוספה נכשלה");
        console.error("Error:", error);
    }
  };
 
  // Reset products //
  const handleResetClick = async () => {
    try {
      const res = await fetch("http://localhost:5000/products/reset");
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      if (data.success) {
        toast.success("האתחול בוצע בהצלחה")
        setProducts(data.data);
        setSuppliers(new Set(data.data.map(product => product.supplier)));
      } else {
        toast.error("האתחול נכשל")
      }
    } catch (error) {
        toast.error("תקלה בזמן האתחול")
        console.error("Error reseting products:", error);
    }
  };

  // Delete product //
  const [deleteId, setDeleteId] = useState(0);
  const [openDeleteProductModal, setOpenDeleteProductModal] = useState(false);
  const handleCloseDeleteProductModal = () => {
    setOpenDeleteProductModal(false);
  };
  const handleDeleteClick = async () => {
    setOpenDeleteProductModal(false);
    try {
      const response = await fetch(`http://localhost:5000/products/${deleteId}`, {
          method: "DELETE"
      });
      const data = await response.json();
      console.log("Server response:", data);
      if (data.success == true) {
        toast.success("המוצר נמחק בהצלחה");
        setProducts(data.data);
        setSuppliers(new Set(data.data.map(product => product.supplier)));
      } else { 
        toast.error(data.message);
      }
    } catch (error) {
        toast.error("המחיקה נכשלה");
    }
  };
  const handleDeleteProductClick = () => {
    setDeleteId(0);
    setOpenDeleteProductModal(true);
  };

  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState(new Set());

  const [searchTerms, setSearchTerms] = useState({
    searchByBarcode: "",
    searchByName: "",
    searchBySupplier: "",
  });
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerms);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    console.log(`Typing: ${name} = ${value}`); // Log input changes
    setSearchTerms((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Debounce logic (Waits 300ms after user stops typing before making request)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      console.log("Debounced search terms:", searchTerms);
      setDebouncedSearch(searchTerms);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerms]);

  useEffect(() => {
    const sendDataToServer = async () => {
      console.log("Sending to server:", searchTerms);
      try {
          const response = await fetch("http://localhost:5000/products", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ searchTerms }),
          });
          const data = await response.json();
          console.log("Server response:", data);

        if (data.success) {
            setProducts(data.data);
        } else {
            console.error("Error in response:", data.message);
        }
      } catch (error) {
          console.error("Error:", error);
      }
  };
  sendDataToServer();
  }, [debouncedSearch]);

  useEffect(() => {
    const fetchProducts = async () => {
        try {
            const res = await fetch("http://localhost:5000/products");
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            const data = await res.json();
            setProducts(data.data);
            setSuppliers(new Set(data.data.map(product => product.supplier)));
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };
    fetchProducts();
  }, []);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [changeType, setChangeType] = useState(1); // "increase = 1" or "decrease = -1"
  const discountMap = { "up": 1, "down": -1 };

  const [updateData, setUpdateData] = useState({
    type: "",
    value: "",
  });

  const handlePriceClick = (product) => {
    setOpenModal(true);
    setSelectedProduct(product);
    setPercentage(0);
    setChangeType(1);
    setUpdateData(prevState => ({
      ...prevState, 
      type: "single",
      value: product._id,
    }));
  };

  const handlePriceAllClick = () => {
    setOpenModal(true);
    setPercentage(0);
    setChangeType(1);
    setUpdateData(prevState => ({
      ...prevState, 
      type: "all",
    }));
  };

  const [selectedSupplier, setSelectedSupplier] = useState("");
  const handleSelectChange = (event) => {
    setSelectedSupplier(event.target.value);
  };

  const handlePriceSupplierClick = () => {
    if (selectedSupplier != "")
    {
      setOpenModal(true);
      setPercentage(0);
      setChangeType(1);
      setUpdateData(prevState => ({
        ...prevState, 
        type: "supplier",
        value: selectedSupplier,
      }));
    } else {
      toast.error("לא נבחר ספק");
    }
  };

  const handleUpdateClick = async () => {
    const requestData = {
      type: updateData.type,
      value: updateData.value,
      newPrice: percentage,
      discount: changeType === 1 ? "up" : "down",
    };
    
    setProducts(prevProducts => 
      prevProducts.map(product => 
          (updateData.type === "single" && product._id === updateData.value) ||
          (updateData.type === "supplier" && product.supplier === updateData.value) ||
          (updateData.type === "all")
          ? { ...product, newPrice: requestData.newPrice, discount: requestData.discount }
          : product
      )
    );

    try {
      const response = await fetch("http://localhost:5000/products", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      if (response.ok) {
        toast.success("המחיר עודכן בהצלחה");
        const responseData = await response.json();
        console.log('Price updated successfully:', responseData);
      } else {
        setProducts(prevProducts => [...prevProducts]); 
        console.error('Error updating price:', response.statusText);
        toast.error("העדכון נכשל");
      }
    } catch (error) {
      toast.error("תקלה בזמן העדכון");
      console.error('Error in fetch request:', error);
    }
    setPercentage(0);
    setChangeType(1);
    setOpenModal(false);
  }

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProduct(null);
    setChangeType(1);
  };

  const handlePercentageChange = (e) => {
    setPercentage(Number(e.target.value));
  };

  const calculateNewPrice = () => {
    return (Math.ceil((selectedProduct.price * (1 + changeType * percentage / 100)) * 10) / 10).toFixed(2);
  };

  return (
    <><ToastContainer />
    <div className="app-container">
      <div className="price-form">
        <div className="supplier-row">
          <select id="supplierDropdown" value={selectedSupplier} onChange={handleSelectChange}>
            <option value="">-- בחר ספק --</option>
            {[...suppliers].map((supplier, index) => (
              <option key={index} value={supplier}>{supplier}</option>
            ))}
          </select>
          <button onClick={() => handlePriceSupplierClick()}>עדכן מחירים לפי ספק</button>
          <button onClick={() => handlePriceAllClick()}>עדכן מחירים לכל המוצרים</button>
        </div>

        <div className="update-buttons-row">
          <>
          <button onClick={() => handleNewProductClick()}>הוסף מוצר</button>
          <button onClick={() => handleDeleteProductClick()}>הסר מוצר</button>
          <button onClick={() => handleResetClick()}>אתחול מוצרים</button>
          </>
        </div>
      </div>
      <br />

      <div className="search-form">
        <div className="search-form-header">
          <span>חיפוש לפי</span>
        </div>
        <div className="search-fields">
          <div>
            <label className="search-form-label" htmlFor="searchBySupplier">ספק</label>
            <input className="search-form-input"
              type="text"
              id="searchBySupplier"
              name="searchBySupplier"
              placeholder="הקלד ספק..."
              value={searchTerms.searchBySupplier}
              onChange={handleSearchChange}
            />
          </div>
          <div>
            <label className="search-form-label" htmlFor="searchByName">שם</label>
            <input className="search-form-input"
              type="text"
              id="searchByName"
              name="searchByName"
              placeholder="הקלד שם..."
              value={searchTerms.searchByName}
              onChange={handleSearchChange}
            />
          </div>
          <div>
            <label className="search-form-label" htmlFor="searchByBarcode">ברקוד</label>
            <input className="search-form-input"
              type="text"
              id="searchByBarcode"
              name="searchByBarcode"
              placeholder="הקלד ברקוד..."
              value={searchTerms.searchByBarcode}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>
      <br />

      <table>
        <thead>
          <tr>
            <th>תמונה</th>
            <th>ספק</th>
            <th>מחיר חדש</th>
            <th>מחיר</th>
            <th>שם מוצר</th>
            <th>ברקוד</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            let displayImage = product.image ? (
              <img src={product.image} />
            ) : (
              <img src={"https://www.freeiconspng.com/img/23485"} />
            );

            return (
              <tr key={product._id}>
                <td>{displayImage}</td>
                <td>{product.supplier}</td>
                <td>
                  {product.newPrice === 0 || !product.newPrice ? "" : (
                    <>
                      {`${(
                        Math.ceil(
                          Number(product.price) *
                          (discountMap[product.discount] ? (1 + discountMap[product.discount] * (Number(product.newPrice) / 100)) : 0)
                          * 10) / 10
                      ).toFixed(2)}`}₪
                      <br />
                      {
                        product.discount === "up"
                          ? <span className="up">{product.discount}({product.newPrice}%)</span>  // Red for positive (up)
                          : <span className="down">{product.discount}({product.newPrice}%)</span>  // Green for negative (down)
                      }
                    </>
                  )}
                </td>
                <td className="priceClick" onClick={(event) => event.stopPropagation()}>
                  <span className="clickable-price" onClick={() => handlePriceClick(product)}>
                    {product.price}₪
                  </span>
                </td>
                <td>{product.name}</td>
                <td>{product._id}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {openModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={handleCloseModal}>✖</button>
            
            {selectedProduct ? (
              <div className="modal-row">
                {selectedProduct.price.toFixed(2)}₪<strong>:מחיר נוכחי</strong>
              </div> ) : updateData.type === "supplier" ? ( 
                <>
                <div className="modal-row">
                  <strong>עדכן מחירים עבור</strong>
              </div>
              <div className="modal-row">
                <strong>{updateData.value}</strong>
              </div>
              </>
              ) : ( 
                <div className="modal-row">
                  <strong>עדכן מחירים לכל המוצרים </strong>
                </div>
            )}
            
            <div className="modal-row">
              <button 
                className={changeType === 1 ? "selected" : ""} 
                onClick={() => setChangeType(1)}>
                <TbArrowBigUpLines />
              </button>
              <input
                type="number"
                value={percentage}
                onChange={handlePercentageChange}
              />
              <span>%</span>
              <button 
                className={changeType === -1 ? "selected" : ""} 
                onClick={() => setChangeType(-1)}>
                <TbArrowBigDownLines />
              </button>
            </div>

            {selectedProduct && (
              <div className="modal-row">
                {calculateNewPrice()}₪<strong>:מחיר חדש</strong>
              </div>
            )}

            <div className="modal-footer">
              <button className="update-btn" onClick={handleUpdateClick}>עדכן</button>
            </div>
          </div>
        </div>
      )}
      <NewProductModal 
        openNewProductModal={openNewProductModal}
        handleClose={handleCloseNewProductModal}
        handleSave={handleSaveClick}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
      />
      <DeleteProductModal
        openDeleteProductModal={openDeleteProductModal}
        handleClose={handleCloseDeleteProductModal} 
        handleDelete={handleDeleteClick} 
        deleteId={deleteId} 
        setDeleteId={setDeleteId}
      />
    </div>
    </>
  );
}

export default App;