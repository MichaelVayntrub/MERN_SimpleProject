import '../newProduct.css';

const DeleteProductModal = ({ openDeleteProductModal, handleClose, handleDelete, deleteId, setDeleteId }) => {
    return (
      openDeleteProductModal && (
        <div className="product-modal-overlay" onClick={handleClose}>
          <div className="product-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="product-modal-title">הסרת מוצר</h2>
            <button className="product-close-btn" onClick={handleClose}>✖</button>
            
            <div className="product-modal-row">
              <label>ברקוד:</label>
              <input
                type="number"
                onChange={(e) => setDeleteId(e.target.value )}
              />
            </div>
  
            <div className="product-modal-footer">
              <button className="save-btn" onClick={handleDelete}>מחיקת מוצר</button>
            </div>
          </div>
        </div>
      )
    );
};

export default DeleteProductModal;