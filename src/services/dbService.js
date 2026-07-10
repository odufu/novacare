import { createClient } from '@supabase/supabase-js';


// Initialize Supabase Client if keys are present
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Determine if we should use Supabase or fallback LocalStorage
const isSupabaseEnabled = () => supabase !== null;

// --------------------------------------------------------------------------
// LOCAL DATABASE HELPER (FALLBACK)
// --------------------------------------------------------------------------
class LocalStorageDb {
  constructor() {
    this.initDatabase();
  }

  initDatabase() {
    if (!localStorage.getItem('novacare_products')) {
      localStorage.setItem('novacare_products', JSON.stringify([]));
    }
    if (!localStorage.getItem('novacare_orders')) {
      localStorage.setItem('novacare_orders', JSON.stringify([]));
    }
    if (!localStorage.getItem('novacare_reviews')) {
      localStorage.setItem('novacare_reviews', JSON.stringify([]));
    }
  }

  // Products CRUD
  getProducts() {
    const all = JSON.parse(localStorage.getItem('novacare_products')) || [];
    return all.filter(p => !p.is_archived);
  }

  getAllProducts() {
    return JSON.parse(localStorage.getItem('novacare_products')) || [];
  }

  saveProduct(product) {
    const products = this.getAllProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index > -1) {
      products[index] = { ...products[index], ...product };
    } else {
      products.push({ ...product, is_archived: false });
    }
    localStorage.setItem('novacare_products', JSON.stringify(products));
    return product;
  }

  archiveProduct(id) {
    const products = this.getAllProducts();
    const index = products.findIndex(p => p.id === id);
    if (index > -1) {
      products[index].is_archived = true;
      localStorage.setItem('novacare_products', JSON.stringify(products));
    }
    return id;
  }

  // Orders CRUD
  getOrders() {
    const all = JSON.parse(localStorage.getItem('novacare_orders')) || [];
    return all.filter(o => !o.is_archived);
  }

  saveOrder(order) {
    const orders = JSON.parse(localStorage.getItem('novacare_orders')) || [];
    orders.push({ ...order, is_archived: false });
    localStorage.setItem('novacare_orders', JSON.stringify(orders));
    return order;
  }

  updateOrderStatus(id, status) {
    const orders = JSON.parse(localStorage.getItem('novacare_orders')) || [];
    const index = orders.findIndex(o => o.id === id);
    if (index > -1) {
      orders[index].status = status;
      localStorage.setItem('novacare_orders', JSON.stringify(orders));
      return orders[index];
    }
    return null;
  }

  archiveOrder(id) {
    const orders = JSON.parse(localStorage.getItem('novacare_orders')) || [];
    const index = orders.findIndex(o => o.id === id);
    if (index > -1) {
      orders[index].is_archived = true;
      localStorage.setItem('novacare_orders', JSON.stringify(orders));
    }
    return id;
  }

  // Reviews CRUD
  getReviews(productId) {
    const reviews = JSON.parse(localStorage.getItem('novacare_reviews')) || [];
    return reviews.filter(r => r.product_id === productId);
  }

  saveReview(review) {
    const reviews = JSON.parse(localStorage.getItem('novacare_reviews')) || [];
    reviews.push(review);
    localStorage.setItem('novacare_reviews', JSON.stringify(reviews));
    return review;
  }
}

const localDb = new LocalStorageDb();

// --------------------------------------------------------------------------
// HELPER: normalize a supabase product row for the app
// --------------------------------------------------------------------------
const normalizeProduct = (row) => ({
  id: row.id,
  name: row.name,
  category: row.category,
  tagline: row.tagline,
  nafdac: row.nafdac,
  price: parseFloat(row.price),
  image: row.image,
  benefits: row.benefits || [],
  description: row.description,
  ingredients: row.ingredients || [],
  directions: row.directions,
  warnings: row.warnings,
  testimonial_videos: row.testimonial_videos || [],
  gallery_images: row.gallery_images || [],
  lead_magnet: row.lead_magnet || null,
  is_archived: row.is_archived || false,
  created_at: row.created_at,
});

// --------------------------------------------------------------------------
// HELPER: normalize a supabase order row for the app
// --------------------------------------------------------------------------
const normalizeOrder = (row) => ({
  id: row.id,
  customerName: row.customer_name,
  phone: row.phone,
  altPhone: row.alt_phone,
  state: row.state,
  lga: row.lga,
  address: row.address,
  items: row.items,
  total: row.total,
  status: row.status,
  createdAt: row.created_at,
  is_archived: row.is_archived || false,
});

// --------------------------------------------------------------------------
// EXPORTED UNIFIED DB SERVICE
// --------------------------------------------------------------------------
export const dbService = {
  // PRODUCTS CRUD
  async getProducts() {
    if (isSupabaseEnabled()) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_archived', false)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Supabase getProducts error, falling back to LocalStorage:', error);
        return localDb.getProducts();
      }

      return data.map(normalizeProduct);
    }
    return localDb.getProducts();
  },

  async saveProduct(product) {
    if (isSupabaseEnabled()) {
      // Build the full DB payload (map JS fields → DB columns)
      const dbPayload = {
        id: product.id,
        name: product.name,
        category: product.category,
        tagline: product.tagline,
        nafdac: product.nafdac,
        price: product.price,
        image: product.image,
        benefits: product.benefits,
        description: product.description,
        ingredients: product.ingredients,
        directions: product.directions,
        warnings: product.warnings,
        testimonial_videos: product.testimonial_videos || [],
        gallery_images: product.gallery_images || [],
        lead_magnet: product.lead_magnet || null,
        is_archived: false,
      };

      const { data, error } = await supabase
        .from('products')
        .upsert(dbPayload, { onConflict: 'id' })
        .select();

      if (error) {
        console.error('Supabase saveProduct error:', error);
        throw new Error(`Failed to save product: ${error.message}`);
      }
      // Sync local cache
      localDb.saveProduct(product);
      return normalizeProduct(data[0]);
    }
    return localDb.saveProduct(product);
  },

  async archiveProduct(id) {
    if (isSupabaseEnabled()) {
      const { error } = await supabase
        .from('products')
        .update({ is_archived: true })
        .eq('id', id);
      if (error) {
        console.error('Supabase archiveProduct error:', error);
        throw new Error(`Failed to archive product: ${error.message}`);
      }
      return id;
    }
    return localDb.archiveProduct(id);
  },

  // ORDERS CRUD
  async getOrders() {
    if (isSupabaseEnabled()) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('is_archived', false)
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Supabase getOrders error, falling back to LocalStorage:', error);
        return localDb.getOrders();
      }
      return data.map(normalizeOrder);
    }
    return localDb.getOrders();
  },

  async saveOrder(order) {
    if (isSupabaseEnabled()) {
      const dbPayload = {
        id: order.id,
        customer_name: order.customer_name,
        phone: order.phone,
        alt_phone: order.alt_phone,
        address: order.address,
        state: order.state,
        lga: order.lga,
        items: order.items,
        total: order.total,
        status: order.status || 'Pending',
        is_archived: false,
      };

      const { data, error } = await supabase
        .from('orders')
        .insert([dbPayload])
        .select();

      if (error) {
        console.error('Supabase saveOrder error:', error);
        throw new Error(`Failed to place order: ${error.message}`);
      }
      return normalizeOrder(data[0]);
    }
    return localDb.saveOrder(order);
  },

  async updateOrderStatus(id, status) {
    if (isSupabaseEnabled()) {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select();
      if (error) {
        console.error('Supabase updateOrderStatus error:', error);
        throw new Error(`Failed to update order: ${error.message}`);
      }
      return normalizeOrder(data[0]);
    }
    return localDb.updateOrderStatus(id, status);
  },

  async archiveOrder(id) {
    if (isSupabaseEnabled()) {
      const { error } = await supabase
        .from('orders')
        .update({ is_archived: true })
        .eq('id', id);
      if (error) {
        console.error('Supabase archiveOrder error:', error);
        throw new Error(`Failed to archive order: ${error.message}`);
      }
      return id;
    }
    return localDb.archiveOrder(id);
  },

  // REVIEWS CRUD
  async getReviews(productId) {
    if (isSupabaseEnabled()) {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Supabase getReviews error, falling back to LocalStorage:', error);
        return localDb.getReviews(productId);
      }
      return data;
    }
    return localDb.getReviews(productId);
  },

  async saveReview(review) {
    if (isSupabaseEnabled()) {
      const { data, error } = await supabase
        .from('reviews')
        .insert([review])
        .select();
      if (error) {
        console.error('Supabase saveReview error:', error);
        return localDb.saveReview(review);
      }
      return data[0];
    }
    return localDb.saveReview(review);
  },

  // SITE SETTINGS (hero content, etc.)
  async getSiteSettings() {
    const defaults = {
      hero_headline: "Nigeria's Most Trusted Herbal Supplement Brand.",
      hero_subheadline: "Every product is NAFDAC-registered and laboratory verified — what is on the label is exactly what is inside the bottle. Order now and pay only when it arrives at your door.",
      hero_cta_text: "Shop Now",
      hero_badge1: "✓ NAFDAC Certified",
      hero_badge2: "🚚 Free Doorstep Delivery",
      hero_stat1_value: "1M+",
      hero_stat1_label: "Sales Per Month",
      hero_stat2_value: "36",
      hero_stat2_label: "States Covered",
      hero_stat3_value: "7",
      hero_stat3_label: "Premium Products",
      hero_stat4_value: "4.9",
      hero_stat4_label: "Avg. Rating",
      hero_card1_icon: "🧬",
      hero_card1_title: "NAFDAC Certified",
      hero_card1_desc: "Govt. approved & verified",
      hero_card2_icon: "🌿",
      hero_card2_title: "Label = Bottle",
      hero_card2_desc: "100% purity guaranteed",
      hero_card3_icon: "🚚",
      hero_card3_title: "Pay on Delivery",
      hero_card3_desc: "Inspect before you pay",
    };

    if (isSupabaseEnabled()) {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value');
      if (error) {
        console.warn('site_settings fetch failed, using defaults:', error.message);
        return defaults;
      }
      // Merge DB values over defaults
      const merged = { ...defaults };
      (data || []).forEach(row => {
        merged[row.key] = row.value;
      });
      return merged;
    }

    // LocalStorage fallback
    const stored = localStorage.getItem('novacare_site_settings');
    return stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
  },

  async saveSiteSettings(settings) {
    if (isSupabaseEnabled()) {
      // Upsert each key-value pair
      const rows = Object.entries(settings).map(([key, value]) => ({ key, value }));
      const { error } = await supabase
        .from('site_settings')
        .upsert(rows, { onConflict: 'key' });
      if (error) {
        console.error('Supabase saveSiteSettings error:', error);
        throw new Error(`Failed to save settings: ${error.message}`);
      }
      return settings;
    }
    // LocalStorage fallback
    const stored = localStorage.getItem('novacare_site_settings');
    const existing = stored ? JSON.parse(stored) : {};
    const merged = { ...existing, ...settings };
    localStorage.setItem('novacare_site_settings', JSON.stringify(merged));
    return merged;
  }
};
