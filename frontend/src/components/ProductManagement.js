{showAddForm && (
    <div className="modal-overlay">
        <ProductForm 
            product={editingProduct}
            categories={categories.filter(cat => cat !== 'All')}
            onSave={handleSaveProduct}
            onCancel={() => {
                setShowAddForm(false);
                setEditingProduct(null);
            }}
        />
    </div>
)}