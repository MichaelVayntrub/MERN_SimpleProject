import '../newProduct.css';

const NewProductModal = ({ openNewProductModal, handleClose, handleSave, newProduct, setNewProduct }) => {
    return (
      openNewProductModal && (
        <div className="product-modal-overlay" onClick={handleClose}>
          <div className="product-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="product-modal-title">הוספת מוצר חדש</h2>
            <button className="product-close-btn" onClick={handleClose}>✖</button>
            
            <div className="product-modal-row">
              <label>ברקוד:</label>
              <input
                type="number"
                value={newProduct._id}
                onChange={(e) => setNewProduct(prev => ({ ...prev, _id: e.target.value }))}
              />
            </div>

            <div className="product-modal-row">
              <label>שם המוצר:</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
  
            <div className="product-modal-row">
              <label>מחיר:</label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct(prev => ({ ...prev, price: Number(e.target.value) }))}
              />
            </div>
  
            <div className="product-modal-row">
              <label>קישור לתמונה:</label>
              <input
                type="text"
                value={newProduct.image}
                onChange={(e) => setNewProduct(prev => ({ ...prev, image: e.target.value }))}
              />
            </div>
  
            <div className="product-modal-row">
              <label>ספק:</label>
              <input
                type="text"
                value={newProduct.supplier}
                onChange={(e) => setNewProduct(prev => ({ ...prev, supplier: e.target.value }))}
              />
            </div>
  
            <div className="product-modal-row">
              <label>ניתן לעריכה:</label>
              <select
                value={newProduct.editable}
                onChange={(e) => setNewProduct(prev => ({ ...prev, editable: e.target.value }))}
              >
                <option value="yes">כן</option>
                <option value="no">לא</option>
              </select>
            </div>
  
            <div className="product-modal-footer">
              <button className="save-btn" onClick={handleSave}>שמירת מוצר</button>
            </div>
          </div>
        </div>
      )
    );
};

export default NewProductModal;