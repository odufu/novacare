import React, { useState, useEffect } from 'react';
import { Plus, Edit, Archive, Download, X } from 'lucide-react';
import { dbService } from '../services/dbService';
import { NIGERIAN_STATES } from '../data/initialData';

export default function AdminDashboard({ 
  onClose, 
  addToast, 
  products, 
  setProducts,
  orders,
  setOrders
}) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'products'
  const [stateFilter, setStateFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Product Form State
  const [editingProduct, setEditingProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formTagline, setFormTagline] = useState('');
  const [formNafdac, setFormNafdac] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formImage, setFormImage] = useState('assets/products/novavital.png');
  const [formDescription, setFormDescription] = useState('');
  const [formBenefits, setFormBenefits] = useState('');
  const [formDirections, setFormDirections] = useState('');
  const [formWarnings, setFormWarnings] = useState('');
  
  // New Funnel fields
  const [formTestimonialVideos, setFormTestimonialVideos] = useState(['']);
  const [formGalleryImages, setFormGalleryImages] = useState(['']);
  const [formLeadMagnetTitle, setFormLeadMagnetTitle] = useState('');
  const [formLeadMagnetDesc, setFormLeadMagnetDesc] = useState('');

  // Ingredients dynamic fields
  const [formIngredients, setFormIngredients] = useState([{ name: '', purpose: '' }]);

  // Refresh data on mount
  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const prodList = await dbService.getProducts();
      setProducts(prodList);
      const ordList = await dbService.getOrders();
      setOrders(ordList);
    } catch (e) {
      console.error(e);
    }
  };

  // --------------------------------------------------------------------------
  // ORDER ACTIONS
  // --------------------------------------------------------------------------
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await dbService.updateOrderStatus(orderId, newStatus);
      addToast(`Order ${orderId} updated to ${newStatus}`);
      fetchAdminData();
    } catch (e) {
      addToast("Failed to update status", "error");
    }
  };

  const exportCSV = () => {
    if (orders.length === 0) {
      addToast("No orders available to export", "error");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Order ID,Customer Name,Phone,Alt Phone,Address,LGA,State,Items,Total Amount,Order Status,Date Created\n";

    orders.forEach(order => {
      const itemsString = order.items.map(i => `${i.name} (x${i.quantity})`).join('; ');
      const safeAddress = order.address.replace(/"/g, '""');
      const safeName = order.customerName.replace(/"/g, '""');
      
      csvContent += `"${order.id}","${safeName}","${order.phone}","${order.altPhone}","${safeAddress}","${order.lga}","${order.state}","${itemsString}","${order.total}","${order.status}","${order.createdAt}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `novacare_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast("CSV file exported successfully!");
  };

  // --------------------------------------------------------------------------
  // PRODUCT CRUD FORM ACTIONS
  // --------------------------------------------------------------------------
  const openAddForm = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('');
    setFormTagline('');
    setFormNafdac('');
    setFormPrice('');
    setFormImage('assets/products/novavital.png');
    setFormDescription('');
    setFormBenefits('');
    setFormDirections('');
    setFormWarnings('');
    setFormTestimonialVideos(['']);
    setFormGalleryImages(['']);
    setFormLeadMagnetTitle('');
    setFormLeadMagnetDesc('');
    setFormIngredients([{ name: '', purpose: '' }]);
    setIsFormOpen(true);
  };

  const openEditForm = (prod) => {
    setEditingProduct(prod);
    setFormName(prod.name || '');
    setFormCategory(prod.category || '');
    setFormTagline(prod.tagline || '');
    setFormNafdac(prod.nafdac || '');
    setFormPrice(prod.price || '');
    setFormImage(prod.image || 'assets/products/novavital.png');
    setFormDescription(prod.description || '');
    setFormBenefits(prod.benefits ? prod.benefits.join(', ') : '');
    setFormDirections(prod.directions || '');
    setFormWarnings(prod.warnings || '');
    
    // Media & Funnel
    setFormTestimonialVideos(prod.testimonial_videos?.length ? prod.testimonial_videos : ['']);
    setFormGalleryImages(prod.gallery_images?.length ? prod.gallery_images : ['']);
    setFormLeadMagnetTitle(prod.lead_magnet?.title || '');
    setFormLeadMagnetDesc(prod.lead_magnet?.description || '');
    
    // Ingredients load
    if (prod.ingredients && prod.ingredients.length > 0) {
      setFormIngredients(prod.ingredients);
    } else {
      setFormIngredients([{ name: '', purpose: '' }]);
    }
    
    setIsFormOpen(true);
  };

  const addIngredientField = () => {
    setFormIngredients([...formIngredients, { name: '', purpose: '' }]);
  };

  const removeIngredientField = (index) => {
    const list = [...formIngredients];
    list.splice(index, 1);
    setFormIngredients(list);
  };

  const handleArrayChange = (setter, list, index, value) => {
    const newList = [...list];
    newList[index] = value;
    setter(newList);
  };
  const addArrayField = (setter, list) => setter([...list, '']);
  const removeArrayField = (setter, list, index) => {
    const newList = [...list];
    newList.splice(index, 1);
    setter(newList);
  };

  const handleIngredientChange = (index, field, value) => {
    const list = [...formIngredients];
    list[index][field] = value;
    setFormIngredients(list);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!formName || !formPrice) {
      addToast("Name and Price are required", "error");
      return;
    }

    // Auto generate ID if new
    const prodId = editingProduct 
      ? editingProduct.id 
      : formName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const benefitsArray = formBenefits
      ? formBenefits.split(',').map(b => b.trim()).filter(b => b.length > 0)
      : [];

    const cleanIngredients = formIngredients.filter(ing => ing.name.trim().length > 0);

    const cleanVideos = formTestimonialVideos.filter(v => v.trim().length > 0);
    const cleanImages = formGalleryImages.filter(i => i.trim().length > 0);

    const payload = {
      id: prodId,
      name: formName,
      category: formCategory,
      tagline: formTagline,
      nafdac: formNafdac,
      price: parseFloat(formPrice),
      image: formImage,
      benefits: benefitsArray,
      description: formDescription,
      ingredients: cleanIngredients,
      directions: formDirections,
      warnings: formWarnings,
      testimonial_videos: cleanVideos,
      gallery_images: cleanImages,
      lead_magnet: (formLeadMagnetTitle || formLeadMagnetDesc) ? {
        title: formLeadMagnetTitle,
        description: formLeadMagnetDesc
      } : null
    };

    try {
      await dbService.saveProduct(payload);
      addToast(editingProduct ? "Product updated successfully!" : "Product created successfully!", "success");
      setIsFormOpen(false);
      fetchAdminData();
    } catch (e) {
      addToast(e.message || "Failed to save product", "error");
    }
  };

  const handleArchiveProduct = async (id, name) => {
    if (window.confirm(`Archive "${name}"? It will be hidden from the store but all data is preserved.`)) {
      try {
        await dbService.archiveProduct(id);
        addToast("Product archived successfully!", "success");
        fetchAdminData();
      } catch (e) {
        addToast(e.message || "Failed to archive product", "error");
      }
    }
  };

  const handleArchiveOrder = async (id) => {
    if (window.confirm(`Archive order ${id}? It will be hidden from the board but all data is preserved.`)) {
      try {
        await dbService.archiveOrder(id);
        addToast(`Order ${id} archived!`, "success");
        fetchAdminData();
      } catch (e) {
        addToast(e.message || "Failed to archive order", "error");
      }
    }
  };

  // --------------------------------------------------------------------------
  // ORDER FILTERS & TOTALS
  // --------------------------------------------------------------------------
  const filteredOrders = orders.filter(order => {
    const matchesState = stateFilter === 'all' || order.state === stateFilter;
    const matchesSearch = searchQuery === '' || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.includes(searchQuery);
    return matchesState && matchesSearch;
  });

  const totalSales = filteredOrders.reduce((sum, order) => 
    order.status !== 'Cancelled' ? sum + parseFloat(order.total) : sum, 0
  );

  return (
    <section className="admin-section container animate-fade-in-up" style={{ display: 'block', minHeight: '80vh' }}>
      <div className="admin-header">
        <div>
          <span className="badge badge-primary">Admin Panel</span>
          <h2 style={{ fontSize: '2rem', marginTop: '6px' }}>Novacare Core Board</h2>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => { setActiveTab('orders'); setIsFormOpen(false); }}
            style={{ padding: '10px 20px' }}
          >
            Manage Orders
          </button>
          <button 
            className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => { setActiveTab('products'); setIsFormOpen(false); }}
            style={{ padding: '10px 20px' }}
          >
            Manage Products
          </button>
          <button className="btn btn-text" onClick={onClose} style={{ marginLeft: '12px' }}>
            <X size={20} />
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          ORDERS BOARD TAB
          ---------------------------------------------------------------------- */}
      {activeTab === 'orders' && (
        <div className="animate-fade-in">
          {/* Analytics Stats Row */}
          <div className="pillars-grid" style={{ marginBottom: '24px', gap: '20px' }}>
            <div style={{ backgroundColor: 'var(--primary-glow)', borderRadius: '12px', padding: '20px', border: '1px solid var(--panel-border)' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--primary)' }}>
                Total Dispatch Value
              </span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginTop: '4px', color: 'var(--text-main)' }}>
                ₦{totalSales.toLocaleString()}
              </h3>
            </div>
            <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.02)', borderRadius: '12px', padding: '20px', border: '1px solid var(--panel-border)' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>
                Total Placed Orders
              </span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginTop: '4px', color: 'var(--text-main)' }}>
                {filteredOrders.length}
              </h3>
            </div>
          </div>

          {/* Filters bar */}
          <div className="admin-filters" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <select 
                value={stateFilter} 
                onChange={(e) => setStateFilter(e.target.value)} 
                className="filter-input"
              >
                <option value="all">All States</option>
                {NIGERIAN_STATES.map(s => <option value={s} key={s}>{s}</option>)}
              </select>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="filter-input" 
                placeholder="Search Client ID, Name..." 
              />
            </div>
            <button className="btn btn-outline" onClick={exportCSV} style={{ padding: '10px 20px' }}>
              <Download size={16} /> Export CSV
            </button>
          </div>

          {/* Orders Table */}
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Client</th>
                  <th>Destination</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px' }}>
                      No client orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(order => (
                    <tr key={order.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>
                        {order.id}
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{order.customerName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {order.phone} / {order.altPhone}
                        </div>
                      </td>
                      <td>
                        <div style={{ maxWidth: '200px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={order.address}>
                          {order.address}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                          {order.lga}, {order.state} State
                        </div>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>
                        {order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                      </td>
                      <td style={{ fontWeight: 800 }}>₦{parseFloat(order.total).toLocaleString()}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-NG', {
                          day: 'numeric',
                          month: 'short',
                          year: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <select 
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`status-select ${order.status.toLowerCase()}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          <button
                            onClick={() => handleArchiveOrder(order.id)}
                            title="Archive order"
                            style={{ padding: '6px 8px', background: 'transparent', border: '1px solid var(--panel-border)', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-muted)' }}
                          >
                            <Archive size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------
          PRODUCTS MANAGEMENT TAB
          ---------------------------------------------------------------------- */}
      {activeTab === 'products' && (
        <div className="animate-fade-in">
          {/* Add product action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <button className="btn btn-secondary" onClick={openAddForm} style={{ padding: '10px 20px' }}>
              <Plus size={16} /> Add New Product
            </button>
          </div>

          {/* Create/Edit Product Form */}
          {isFormOpen && (
            <div className="admin-form animate-fade-in">
              <h3>{editingProduct ? `Edit Product: ${editingProduct.name}` : 'Create Brand New Product'}</h3>
              <form onSubmit={handleProductSubmit}>
                <div className="admin-form-grid">
                  <div className="form-group">
                    <label className="form-label">Product Name *</label>
                    <input 
                      type="text" 
                      value={formName} 
                      onChange={(e) => setFormName(e.target.value)} 
                      className="form-input" 
                      placeholder="e.g. Grazer Herbal Detox Tea" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <input 
                      type="text" 
                      value={formCategory} 
                      onChange={(e) => setFormCategory(e.target.value)} 
                      className="form-input" 
                      placeholder="e.g. Digestive & Liver Detox" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price (₦) *</label>
                    <input 
                      type="number" 
                      value={formPrice} 
                      onChange={(e) => setFormPrice(e.target.value)} 
                      className="form-input" 
                      placeholder="e.g. 20000" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">NAFDAC Code</label>
                    <input 
                      type="text" 
                      value={formNafdac} 
                      onChange={(e) => setFormNafdac(e.target.value)} 
                      className="form-input" 
                      placeholder="e.g. A7-1025L" 
                    />
                  </div>
                </div>

                <div className="admin-form-grid">
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Tagline (Catchphrase) *</label>
                    <input 
                      type="text" 
                      value={formTagline} 
                      onChange={(e) => setFormTagline(e.target.value)} 
                      className="form-input" 
                      placeholder="e.g. Flush Belly Fat & Cleanse Your Liver in 14 Days" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Image Path / Link</label>
                    <input 
                      type="text" 
                      value={formImage} 
                      onChange={(e) => setFormImage(e.target.value)} 
                      className="form-input" 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Product Description</label>
                  <textarea 
                    value={formDescription} 
                    onChange={(e) => setFormDescription(e.target.value)} 
                    className="form-input" 
                    rows="3" 
                    placeholder="Describe product health applications and composition details..."
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Key Benefits (Comma separated)</label>
                  <textarea 
                    value={formBenefits} 
                    onChange={(e) => setFormBenefits(e.target.value)} 
                    className="form-input" 
                    rows="2" 
                    placeholder="Benefit 1, Benefit 2, Benefit 3"
                  ></textarea>
                </div>

                {/* Dynamic Ingredients Section */}
                <div style={{ marginBottom: '24px', borderTop: '1px solid var(--panel-border)', paddingTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '1rem', color: 'var(--text-main)' }}>Ingredients & Composition</h4>
                    <button type="button" className="btn btn-outline" onClick={addIngredientField} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                      + Add Ingredient
                    </button>
                  </div>
                  {formIngredients.map((ing, index) => (
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '10px', alignItems: 'center' }} key={index}>
                      <input 
                        type="text" 
                        value={ing.name} 
                        onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                        placeholder="Ingredient Name (e.g. Garlic (10%))"
                        className="form-input"
                        style={{ flex: 1, padding: '10px 14px' }}
                      />
                      <input 
                        type="text" 
                        value={ing.purpose} 
                        onChange={(e) => handleIngredientChange(index, 'purpose', e.target.value)}
                        placeholder="Purpose (e.g. Detoxification)"
                        className="form-input"
                        style={{ flex: 1, padding: '10px 14px' }}
                      />
                      {formIngredients.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeIngredientField(index)}
                          style={{ color: 'var(--danger)', padding: '6px' }}
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {/* Dynamic Funnel Media Section */}
                <div style={{ marginBottom: '24px', borderTop: '1px solid var(--panel-border)', paddingTop: '20px' }}>
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '12px' }}>Funnel Media (Videos & Gallery)</h4>
                  
                  {/* Videos */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label className="form-label" style={{ marginBottom: 0 }}>Testimonial Video Links (YouTube/Vimeo/MP4)</label>
                      <button type="button" className="btn btn-outline btn-text" onClick={() => addArrayField(setFormTestimonialVideos, formTestimonialVideos)} style={{ padding: '4px 8px', fontSize: '0.8rem' }}>+ Add Video</button>
                    </div>
                    {formTestimonialVideos.map((url, index) => (
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }} key={`vid-${index}`}>
                        <input type="text" value={url} onChange={(e) => handleArrayChange(setFormTestimonialVideos, formTestimonialVideos, index, e.target.value)} placeholder="https://..." className="form-input" />
                        {formTestimonialVideos.length > 1 && (
                          <button type="button" onClick={() => removeArrayField(setFormTestimonialVideos, formTestimonialVideos, index)} style={{ color: 'var(--danger)', padding: '6px' }}><Trash2 size={18} /></button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Gallery */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label className="form-label" style={{ marginBottom: 0 }}>Pinterest Gallery Image Links</label>
                      <button type="button" className="btn btn-outline btn-text" onClick={() => addArrayField(setFormGalleryImages, formGalleryImages)} style={{ padding: '4px 8px', fontSize: '0.8rem' }}>+ Add Image</button>
                    </div>
                    {formGalleryImages.map((url, index) => (
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }} key={`img-${index}`}>
                        <input type="text" value={url} onChange={(e) => handleArrayChange(setFormGalleryImages, formGalleryImages, index, e.target.value)} placeholder="https://..." className="form-input" />
                        {formGalleryImages.length > 1 && (
                          <button type="button" onClick={() => removeArrayField(setFormGalleryImages, formGalleryImages, index)} style={{ color: 'var(--danger)', padding: '6px' }}><Trash2 size={18} /></button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lead Magnet Section */}
                <div style={{ marginBottom: '24px', borderTop: '1px solid var(--panel-border)', paddingTop: '20px' }}>
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '12px' }}>Lead Magnet / Bonus Offer (Optional)</h4>
                  <div className="form-group">
                    <label className="form-label">Bonus Title</label>
                    <input type="text" value={formLeadMagnetTitle} onChange={(e) => setFormLeadMagnetTitle(e.target.value)} className="form-input" placeholder="e.g. FREE 7-Day Diet Plan PDF" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bonus Description</label>
                    <textarea value={formLeadMagnetDesc} onChange={(e) => setFormLeadMagnetDesc(e.target.value)} className="form-input" rows="2" placeholder="Describe the bonus value..."></textarea>
                  </div>
                </div>

                <div className="admin-form-grid">
                  <div className="form-group">
                    <label className="form-label">Usage Directions</label>
                    <textarea 
                      value={formDirections} 
                      onChange={(e) => setFormDirections(e.target.value)} 
                      className="form-input" 
                      rows="2" 
                      placeholder="e.g. Steep one teabag into hot water first thing in the morning."
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Warnings & Dietary Guidelines</label>
                    <textarea 
                      value={formWarnings} 
                      onChange={(e) => setFormWarnings(e.target.value)} 
                      className="form-input" 
                      rows="2" 
                      placeholder="e.g. Limit late-night eating and alcohol."
                    ></textarea>
                  </div>
                </div>

                <div className="btn-group">
                  <button type="button" className="btn btn-outline" onClick={() => setIsFormOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingProduct ? 'Save Product Changes' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Products List Grid */}
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>NAFDAC</th>
                  <th>Price</th>
                  <th>Ingredients Count</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(prod => (
                  <tr key={prod.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={prod.image} 
                          alt={prod.name} 
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} 
                        />
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{prod.name}</div>
                      </div>
                    </td>
                    <td>{prod.category}</td>
                    <td style={{ fontFamily: 'monospace' }}>{prod.nafdac || 'N/A'}</td>
                    <td style={{ fontWeight: 800 }}>₦{prod.price.toLocaleString()}</td>
                    <td>{prod.ingredients ? prod.ingredients.length : 0} items</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button 
                          className="btn btn-outline btn-text" 
                          onClick={() => openEditForm(prod)}
                          style={{ padding: '6px 12px' }}
                        >
                          <Edit size={16} /> Edit
                        </button>
                        <button 
                          className="btn btn-outline" 
                          onClick={() => handleArchiveProduct(prod.id, prod.name)}
                          title="Archive product"
                          style={{ padding: '6px 12px', color: 'var(--text-muted)', borderColor: 'var(--panel-border)' }}
                        >
                          <Archive size={16} /> Archive
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
