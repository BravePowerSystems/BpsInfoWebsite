{showAddForm && (
    <div className="modal-overlay">
        <ProductForm 
            product={editingProduct}
            onSave={handleSaveProduct}
            onCancel={() => {
                setShowAddForm(false);
                setEditingProduct(null);
            }}
        />
    </div>
)}