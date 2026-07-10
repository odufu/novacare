import React, { useState, useEffect } from 'react';
import { Plus, Edit, Archive, Download, X, Save, Menu, LayoutDashboard, ShoppingBag, Home } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'orders', 'products', 'hero'
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

  // Hero Settings state
  const [heroSettings, setHeroSettings] = useState(null);
  const [heroSaving, setHeroSaving] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const NAV_ITEMS = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'orders',    icon: '📦', label: 'Orders' },
    { id: 'products',  icon: '🛍️', label: 'Products' },
    { id: 'hero',      icon: '🏠', label: 'Hero Settings' },
  ];

  const sideW = sidebarCollapsed ? '64px' : '220px';



  // Refresh data on mount
  useEffect(() => {
    fetchAdminData();
    dbService.getSiteSettings().then(setHeroSettings).catch(console.error);
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

  const handleHeroChange = (key, value) => {
    setHeroSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleHeroSave = async () => {
    setHeroSaving(true);
    try {
      await dbService.saveSiteSettings(heroSettings);
      addToast('Hero settings saved successfully!', 'success');
    } catch (e) {
      addToast(e.message || 'Failed to save hero settings', 'error');
    }
    setHeroSaving(false);
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
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999,
      background: 'var(--bg)',
      color: 'var(--text-main)',
      overflow: 'hidden',
    }}>
      {/* ======================================================================
          SIDEBAR NAV PANEL (MINIMIZABLE)
          ====================================================================== */}
      <aside style={{
        width: sideW,
        background: 'var(--panel-bg)',
        borderRight: '1px solid var(--panel-border)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        height: '100%',
        boxShadow: 'var(--shadow-md)',
      }}>
        {/* Brand Header */}
        <div style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          padding: sidebarCollapsed ? '0' : '0 20px',
          justifyContent: sidebarCollapsed ? 'center' : 'space-between',
          borderBottom: '1px solid var(--panel-border)',
          flexShrink: 0,
        }}>
          {!sidebarCollapsed ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src="assets/logo.png" alt="Novacare Logo" style={{ height: '32px' }} />
              <div>
                <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary)', letterSpacing: '0.05em' }}>NOVACARE</span>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.1em', marginTop: '-2px' }}>CORE CRM</div>
              </div>
            </div>
          ) : (
            <img src="assets/logo.png" alt="Logo" style={{ height: '32px' }} />
          )}
        </div>

        {/* Menu Items */}
        <div style={{ flex: 1, padding: '16px 8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {NAV_ITEMS.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsFormOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: sidebarCollapsed ? '0' : '12px',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive ? 'var(--primary-glow)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease',
                  width: '100%',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-subtle, rgba(0,0,0,0.02))'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.id === 'dashboard' && <LayoutDashboard size={20} />}
                  {item.id === 'orders' && <ShoppingBag size={20} />}
                  {item.id === 'products' && <Plus size={20} />}
                  {item.id === 'hero' && <Home size={20} />}
                </span>
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer / Minimizer */}
        <div style={{
          padding: '12px 8px',
          borderTop: '1px solid var(--panel-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid var(--panel-border)',
              background: 'transparent',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
              gap: '8px',
              width: '100%',
            }}
          >
            {sidebarCollapsed ? '▶' : '◀ Collapse'}
          </button>
        </div>
      </aside>

      {/* ======================================================================
          MAIN WORKSPACE
          ====================================================================== */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100%',
      }}>
        {/* Workspace Top Header */}
        <div style={{
          height: '64px',
          background: 'var(--panel-bg)',
          borderBottom: '1px solid var(--panel-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          flexShrink: 0,
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'orders' && 'Orders Board'}
              {activeTab === 'products' && 'Products Management'}
              {activeTab === 'hero' && 'Homepage Hero Customizer'}
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {activeTab === 'orders' && (
              <button className="btn btn-outline" onClick={exportCSV} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                <Download size={14} /> Export CSV
              </button>
            )}
            {activeTab === 'products' && !isFormOpen && (
              <button className="btn btn-secondary" onClick={openAddForm} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                <Plus size={14} /> Add Product
              </button>
            )}
            {activeTab === 'hero' && (
              <button className="btn btn-primary" onClick={handleHeroSave} disabled={heroSaving} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                <Save size={14} /> {heroSaving ? 'Saving...' : 'Save Settings'}
              </button>
            )}
            <button
              onClick={onClose}
              className="btn btn-outline"
              style={{
                padding: '8px 14px',
                borderColor: 'var(--panel-border)',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <X size={14} /> Close Board
            </button>
          </div>
        </div>

        {/* Scrollable Work View */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          background: 'var(--bg)',
        }}>

          {/* ==================================================================
              CRM DASHBOARD VIEW
              ================================================================== */}
          {activeTab === 'dashboard' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Analytics Summary Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
              }}>
                {[
                  { title: 'Total Revenue', val: `₦${totalSales.toLocaleString()}`, sub: 'Completed and Dispatched orders', icon: '💰', color: '#10b981' },
                  { title: 'Total Orders', val: orders.length, sub: 'Active lifetime orders', icon: '📦', color: 'var(--primary)' },
                  { title: 'Pending Orders', val: orders.filter(o => o.status === 'Pending').length, sub: 'Requires dispatch attention', icon: '⏳', color: '#f59e0b' },
                  { title: 'Delivered Packages', val: orders.filter(o => o.status === 'Delivered').length, sub: 'Successful doorstep arrivals', icon: '✅', color: '#16a34a' }
                ].map((card, i) => (
                  <div key={i} style={{
                    background: 'var(--panel-bg)',
                    border: '1px solid var(--panel-border)',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '12px',
                      background: 'var(--bg-subtle, rgba(0,0,0,0.02))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.5rem',
                    }}>{card.icon}</div>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.title}</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 900, color: card.color, fontFamily: 'var(--font-heading)', marginTop: '2px' }}>{card.val}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>{card.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CRM Activity Section */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: '20px',
                alignItems: 'start',
              }}>
                {/* Recent Orders log */}
                <div style={{
                  background: 'var(--panel-bg)',
                  border: '1px solid var(--panel-border)',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 800 }}>Recent Order Requests</h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Customer</th>
                          <th>Destination</th>
                          <th>Total</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map(o => (
                          <tr key={o.id}>
                            <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>{o.id}</td>
                            <td style={{ fontWeight: 600 }}>{o.customerName}</td>
                            <td>{o.lga}, {o.state}</td>
                            <td style={{ fontWeight: 800 }}>₦{parseFloat(o.total).toLocaleString()}</td>
                            <td>
                              <span className={`status-select ${o.status.toLowerCase()}`} style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                                {o.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {orders.length === 0 && (
                          <tr>
                            <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>No orders yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* State performance */}
                <div style={{
                  background: 'var(--panel-bg)',
                  border: '1px solid var(--panel-border)',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 800 }}>Geographic Distribution</h3>
                  {(() => {
                    const states = {};
                    orders.forEach(o => { states[o.state] = (states[o.state] || 0) + 1; });
                    const sorted = Object.entries(states).sort((a, b) => b[1] - a[1]).slice(0, 5);
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {sorted.map(([name, val]) => (
                          <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{name} State</span>
                            <span style={{ fontSize: '0.8rem', background: 'var(--primary-glow)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                              {val} {val === 1 ? 'order' : 'orders'}
                            </span>
                          </div>
                        ))}
                        {sorted.length === 0 && (
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>No states data yet.</div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* ==================================================================
              CRM ORDERS BOARD VIEW
              ================================================================== */}
          {activeTab === 'orders' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Analytics Mini-Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px',
              }}>
                {[
                  { label: 'Board Value', value: `₦${totalSales.toLocaleString()}`, color: 'var(--primary)' },
                  { label: 'Active Items', value: filteredOrders.length, color: 'var(--text-main)' },
                  { label: 'Pending', value: filteredOrders.filter(o => o.status === 'Pending').length, color: '#f59e0b' },
                  { label: 'Dispatched', value: filteredOrders.filter(o => o.status === 'Dispatched').length, color: '#3b82f6' },
                  { label: 'Delivered', value: filteredOrders.filter(o => o.status === 'Delivered').length, color: '#10b981' }
                ].map((s, i) => (
                  <div key={i} style={{ background: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderRadius: '12px', padding: '14px 16px' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Filters Bar */}
              <div className="admin-filters" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', background: 'var(--panel-bg)', padding: '14px', borderRadius: '12px', border: '1px solid var(--panel-border)' }}>
                <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="filter-input" style={{ minWidth: '160px' }}>
                  <option value="all">All States</option>
                  {NIGERIAN_STATES.map(s => <option value={s} key={s}>{s}</option>)}
                </select>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="filter-input"
                  placeholder="Search client ID, Name, Phone..."
                  style={{ flex: 1, minWidth: '200px' }}
                />
              </div>

              {/* Table wrapper */}
              <div className="admin-table-wrapper" style={{ background: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderRadius: '12px' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Client</th>
                      <th>Destination</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Date</th>
                      <th>Status Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                          No orders matched your search filters.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map(order => (
                        <tr key={order.id}>
                          <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>{order.id}</td>
                          <td>
                            <div style={{ fontWeight: 700 }}>{order.customerName}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{order.phone} {order.altPhone && `/ ${order.altPhone}`}</div>
                          </td>
                          <td>
                            <div style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={order.address}>{order.address}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600 }}>{order.lga}, {order.state}</div>
                          </td>
                          <td style={{ fontSize: '0.82rem' }}>{order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}</td>
                          <td style={{ fontWeight: 800 }}>₦{parseFloat(order.total).toLocaleString()}</td>
                          <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {new Date(order.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
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
                                title="Archive"
                                style={{ padding: '6px 8px', background: 'transparent', border: '1px solid var(--panel-border)', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-muted)' }}
                              >
                                <Archive size={13} />
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

          {/* ==================================================================
              CRM PRODUCTS VIEW
              ================================================================== */}
          {activeTab === 'products' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Product Form Expansion */}
              {isFormOpen && (
                <div className="admin-form animate-fade-in" style={{ border: '1px solid var(--panel-border)', background: 'var(--panel-bg)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
                      {editingProduct ? `✏️ Edit Product details: ${editingProduct.name}` : '➕ Add Brand New Product'}
                    </h3>
                    <button className="btn btn-outline" onClick={() => setIsFormOpen(false)} style={{ padding: '6px 12px' }}>
                      <X size={14} /> Cancel
                    </button>
                  </div>

                  <form onSubmit={handleProductSubmit}>
                    <div className="admin-form-grid">
                      <div className="form-group">
                        <label className="form-label">Product Name *</label>
                        <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} className="form-input" placeholder="e.g. Grazer Herbal Detox Tea" required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Category *</label>
                        <input type="text" value={formCategory} onChange={(e) => setFormCategory(e.target.value)} className="form-input" placeholder="e.g. Digestive & Liver Detox" required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Price (₦) *</label>
                        <input type="number" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} className="form-input" placeholder="e.g. 20000" required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">NAFDAC Reg. Code</label>
                        <input type="text" value={formNafdac} onChange={(e) => setFormNafdac(e.target.value)} className="form-input" placeholder="e.g. A7-1025L" />
                      </div>
                    </div>

                    <div className="admin-form-grid">
                      <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label">Product Tagline *</label>
                        <input type="text" value={formTagline} onChange={(e) => setFormTagline(e.target.value)} className="form-input" placeholder="e.g. Flush Belly Fat & Cleanse Your Liver in 14 Days" required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Image Path / Link</label>
                        <input type="text" value={formImage} onChange={(e) => setFormImage(e.target.value)} className="form-input" />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Complete Description</label>
                      <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} className="form-input" rows="3" placeholder="Explain the applications, health benefits, and dosage context..." />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Core Benefits (Comma separated)</label>
                      <textarea value={formBenefits} onChange={(e) => setFormBenefits(e.target.value)} className="form-input" rows="2" placeholder="Flushes viseral fat, Reduces bloating, Filters toxins" />
                    </div>

                    {/* Ingredients */}
                    <div style={{ borderTop: '1px solid var(--panel-border)', paddingTop: '20px', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h4 style={{ margin: 0, fontSize: '0.9rem' }}>Composition & Ingredients</h4>
                        <button type="button" className="btn btn-outline" onClick={addIngredientField} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                          + Add Ingredient
                        </button>
                      </div>
                      {formIngredients.map((ing, index) => (
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'center' }} key={index}>
                          <input type="text" value={ing.name} onChange={(e) => handleIngredientChange(index, 'name', e.target.value)} placeholder="Ingredient Name (e.g. Garlic 10%)" className="form-input" style={{ flex: 1 }} />
                          <input type="text" value={ing.purpose} onChange={(e) => handleIngredientChange(index, 'purpose', e.target.value)} placeholder="Action/Purpose" className="form-input" style={{ flex: 1 }} />
                          {formIngredients.length > 1 && (
                            <button type="button" onClick={() => removeIngredientField(index)} style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer' }}>
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Dynamic Funnel Elements */}
                    <div style={{ borderTop: '1px solid var(--panel-border)', paddingTop: '20px', marginBottom: '20px' }}>
                      <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem' }}>Funnel Landing Media & Reviews</h4>
                      
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <label className="form-label" style={{ marginBottom: 0 }}>Testimonial Videos (YouTube/Vimeo/Direct Links)</label>
                          <button type="button" className="btn btn-outline" onClick={() => addArrayField(setFormTestimonialVideos, formTestimonialVideos)} style={{ padding: '4px 8px', fontSize: '0.75rem' }}>+ Add Link</button>
                        </div>
                        {formTestimonialVideos.map((url, index) => (
                          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }} key={index}>
                            <input type="text" value={url} onChange={(e) => handleArrayChange(setFormTestimonialVideos, formTestimonialVideos, index, e.target.value)} placeholder="https://youtube.com/..." className="form-input" />
                            {formTestimonialVideos.length > 1 && (
                              <button type="button" onClick={() => removeArrayField(setFormTestimonialVideos, formTestimonialVideos, index)} style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
                            )}
                          </div>
                        ))}
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <label className="form-label" style={{ marginBottom: 0 }}>Pinterest Masonry Image Gallery URLs</label>
                          <button type="button" className="btn btn-outline" onClick={() => addArrayField(setFormGalleryImages, formGalleryImages)} style={{ padding: '4px 8px', fontSize: '0.75rem' }}>+ Add Link</button>
                        </div>
                        {formGalleryImages.map((url, index) => (
                          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }} key={index}>
                            <input type="text" value={url} onChange={(e) => handleArrayChange(setFormGalleryImages, formGalleryImages, index, e.target.value)} placeholder="https://pinterest.com/..." className="form-input" />
                            {formGalleryImages.length > 1 && (
                              <button type="button" onClick={() => removeArrayField(setFormGalleryImages, formGalleryImages, index)} style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Lead Magnet bonus */}
                    <div style={{ borderTop: '1px solid var(--panel-border)', paddingTop: '20px', marginBottom: '20px' }}>
                      <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem' }}>Lead Magnet Bonus Attachment</h4>
                      <div className="admin-form-grid">
                        <div className="form-group">
                          <label className="form-label">Bonus Offer Title</label>
                          <input type="text" value={formLeadMagnetTitle} onChange={(e) => setFormLeadMagnetTitle(e.target.value)} className="form-input" placeholder="e.g. FREE 7-Day Complete Dietary Cleansing Guide" />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Bonus Offer Details</label>
                          <textarea value={formLeadMagnetDesc} onChange={(e) => setFormLeadMagnetDesc(e.target.value)} className="form-input" rows="2" placeholder="Explain how the user gains access or value from this attached document..." />
                        </div>
                      </div>
                    </div>

                    <div className="admin-form-grid" style={{ borderTop: '1px solid var(--panel-border)', paddingTop: '20px' }}>
                      <div className="form-group">
                        <label className="form-label">Usage Instructions</label>
                        <textarea value={formDirections} onChange={(e) => setFormDirections(e.target.value)} className="form-input" rows="2" placeholder="How to consume the product..." />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Product Warnings / Precautions</label>
                        <textarea value={formWarnings} onChange={(e) => setFormWarnings(e.target.value)} className="form-input" rows="2" placeholder="Side effects, dosage warnings, etc..." />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                      <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px' }}>
                        {editingProduct ? 'Save Changes' : 'Create Product'}
                      </button>
                      <button type="button" className="btn btn-outline" onClick={() => setIsFormOpen(false)} style={{ padding: '10px 24px' }}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Products Table List */}
              <div className="admin-table-wrapper" style={{ background: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderRadius: '12px' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product Info</th>
                      <th>Category</th>
                      <th>NAFDAC Seal</th>
                      <th>Price</th>
                      <th>Formula Count</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                          No products exist. Use the '+ Add Product' action above to define one.
                        </td>
                      </tr>
                    ) : (
                      products.map(prod => (
                        <tr key={prod.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <img
                                src={prod.image}
                                alt={prod.name}
                                style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--panel-border)' }}
                                onError={e => { e.target.style.display = 'none'; }}
                              />
                              <div style={{ fontWeight: 700 }}>{prod.name}</div>
                            </div>
                          </td>
                          <td>{prod.category}</td>
                          <td style={{ fontFamily: 'monospace' }}>{prod.nafdac || '—'}</td>
                          <td style={{ fontWeight: 800 }}>₦{prod.price.toLocaleString()}</td>
                          <td>{prod.ingredients ? prod.ingredients.length : 0} items</td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '8px' }}>
                              <button className="btn btn-outline btn-text" onClick={() => openEditForm(prod)} style={{ padding: '6px 12px', fontSize: '0.82rem' }}>
                                <Edit size={14} /> Edit
                              </button>
                              <button className="btn btn-outline" onClick={() => handleArchiveProduct(prod.id, prod.name)} title="Archive" style={{ padding: '6px 12px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                <Archive size={14} /> Archive
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

          {/* ==================================================================
              CRM HERO SETTINGS VIEW
              ================================================================== */}
          {activeTab === 'hero' && heroSettings && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="admin-form" style={{ maxWidth: '100%', background: 'var(--panel-bg)', border: '1px solid var(--panel-border)' }}>
                {/* Headline / Copy */}
                <h4 style={{ color: 'var(--primary)', borderBottom: '1px solid var(--panel-border)', paddingBottom: '8px', marginBottom: '16px', fontSize: '0.95rem' }}>Hero Text Copy</h4>
                <div className="admin-form-grid">
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Headline</label>
                    <input type="text" className="form-input" value={heroSettings.hero_headline} onChange={e => handleHeroChange('hero_headline', e.target.value)} />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Subheadline Description</label>
                    <textarea className="form-input" rows={3} value={heroSettings.hero_subheadline} onChange={e => handleHeroChange('hero_subheadline', e.target.value)} style={{ resize: 'vertical' }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CTA Button text</label>
                    <input type="text" className="form-input" value={heroSettings.hero_cta_text} onChange={e => handleHeroChange('hero_cta_text', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Badge Left</label>
                    <input type="text" className="form-input" value={heroSettings.hero_badge1} onChange={e => handleHeroChange('hero_badge1', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Badge Right</label>
                    <input type="text" className="form-input" value={heroSettings.hero_badge2} onChange={e => handleHeroChange('hero_badge2', e.target.value)} />
                  </div>
                </div>

                {/* Statistics Row */}
                <h4 style={{ color: 'var(--primary)', borderBottom: '1px solid var(--panel-border)', paddingBottom: '8px', margin: '24px 0 16px', fontSize: '0.95rem' }}>Core Metrics/Stats Row</h4>
                <div className="admin-form-grid">
                  {[1, 2, 3, 4].map(n => (
                    <div key={n} style={{ display: 'flex', gap: '8px' }}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Stat {n} Value</label>
                        <input type="text" className="form-input" value={heroSettings[`hero_stat${n}_value`]} onChange={e => handleHeroChange(`hero_stat${n}_value`, e.target.value)} />
                      </div>
                      <div className="form-group" style={{ flex: 2 }}>
                        <label className="form-label">Stat {n} Label</label>
                        <input type="text" className="form-input" value={heroSettings[`hero_stat${n}_label`]} onChange={e => handleHeroChange(`hero_stat${n}_label`, e.target.value)} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Features Cards */}
                <h4 style={{ color: 'var(--primary)', borderBottom: '1px solid var(--panel-border)', paddingBottom: '8px', margin: '24px 0 16px', fontSize: '0.95rem' }}>Hero Product Features (Cards)</h4>
                <div className="admin-form-grid">
                  {[1, 2, 3].map(n => (
                    <div key={n} style={{ background: 'var(--bg-subtle, rgba(0,0,0,0.02))', borderRadius: '12px', padding: '16px', border: '1px solid var(--panel-border)' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '10px' }}>Card {n}</p>
                      <div className="form-group">
                        <label className="form-label">Emoji / Icon</label>
                        <input type="text" className="form-input" value={heroSettings[`hero_card${n}_icon`]} onChange={e => handleHeroChange(`hero_card${n}_icon`, e.target.value)} style={{ fontSize: '1.3rem', textAlign: 'center' }} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Title</label>
                        <input type="text" className="form-input" value={heroSettings[`hero_card${n}_title`]} onChange={e => handleHeroChange(`hero_card${n}_title`, e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Description</label>
                        <input type="text" className="form-input" value={heroSettings[`hero_card${n}_desc`]} onChange={e => handleHeroChange(`hero_card${n}_desc`, e.target.value)} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Slide Images */}
                <h4 style={{ color: 'var(--primary)', borderBottom: '1px solid var(--panel-border)', paddingBottom: '8px', margin: '24px 0 16px', fontSize: '0.95rem' }}>Hero Rotating Slideshow Images</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Provide direct URLs of PNG/JPG assets that slide beside the hero content.</p>
                {(() => {
                  let images = [];
                  try { images = JSON.parse(heroSettings.hero_images || '[]'); } catch {}
                  if (!Array.isArray(images)) images = [];
                  const updateImages = (newImages) => handleHeroChange('hero_images', JSON.stringify(newImages));
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {images.map((url, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', minWidth: '24px', textAlign: 'center', fontWeight: 700 }}>{idx + 1}</span>
                          <img src={url} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--panel-border)', flexShrink: 0 }} onError={e => { e.target.style.display = 'none'; }} />
                          <input type="url" className="form-input" placeholder="https://..." value={url} onChange={e => { const u = [...images]; u[idx] = e.target.value; updateImages(u); }} style={{ flex: 1 }} />
                          <button type="button" onClick={() => updateImages(images.filter((_, i) => i !== idx))} style={{ padding: '8px 10px', background: 'transparent', border: '1px solid var(--panel-border)', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={14} /></button>
                        </div>
                      ))}
                      <button type="button" className="btn btn-outline" onClick={() => updateImages([...images, ''])} style={{ alignSelf: 'flex-start', padding: '8px 16px', marginTop: '4px' }}>+ Add Image URL</button>
                    </div>
                  );
                })()}

                <button className="btn btn-primary" onClick={handleHeroSave} disabled={heroSaving} style={{ marginTop: '24px', padding: '12px 32px', width: '100%' }}>
                  <Save size={16} /> {heroSaving ? 'Saving...' : 'Save All Settings'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
