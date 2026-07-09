import { createClient } from '@supabase/supabase-js';
import { INITIAL_PRODUCTS_DATA } from '../data/initialData';

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
    // 1. Seed Products if not exists
    if (!localStorage.getItem('novacare_products')) {
      localStorage.setItem('novacare_products', JSON.stringify(INITIAL_PRODUCTS_DATA));
    }
    // 2. Init Orders if not exists
    if (!localStorage.getItem('novacare_orders')) {
      localStorage.setItem('novacare_orders', JSON.stringify([]));
    }
    // 3. Init Reviews if not exists
    if (!localStorage.getItem('novacare_reviews')) {
      // Collect reviews from initial products
      const initialReviews = [];
      INITIAL_PRODUCTS_DATA.forEach(p => {
        if (p.reviews) {
          p.reviews.forEach(r => {
            initialReviews.push({
              product_id: p.id,
              author: r.author,
              location: r.location,
              rating: r.rating,
              comment: r.comment,
              date: r.date
            });
          });
        }
      });
      localStorage.setItem('novacare_reviews', JSON.stringify(initialReviews));
    }
  }

  // Products CRUD
  getProducts() {
    return JSON.parse(localStorage.getItem('novacare_products')) || [];
  }

  saveProduct(product) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    
    if (index > -1) {
      products[index] = { ...products[index], ...product };
    } else {
      products.push(product);
    }
    
    localStorage.setItem('novacare_products', JSON.stringify(products));
    return product;
  }

  deleteProduct(id) {
    let products = this.getProducts();
    products = products.filter(p => p.id !== id);
    localStorage.setItem('novacare_products', JSON.stringify(products));
    return id;
  }

  // Orders CRUD
  getOrders() {
    return JSON.parse(localStorage.getItem('novacare_orders')) || [];
  }

  saveOrder(order) {
    const orders = this.getOrders();
    orders.push(order);
    localStorage.setItem('novacare_orders', JSON.stringify(orders));
    return order;
  }

  updateOrderStatus(id, status) {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index > -1) {
      orders[index].status = status;
      localStorage.setItem('novacare_orders', JSON.stringify(orders));
      return orders[index];
    }
    return null;
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
// EXPORTED UNIFIED DB SERVICE
// --------------------------------------------------------------------------
export const dbService = {
  // PRODUCTS CRUD
  async getProducts() {
    if (isSupabaseEnabled()) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) {
        console.error('Supabase getProducts error, falling back to LocalStorage:', error);
        return localDb.getProducts();
      }
      
      // Auto Seed Products into Supabase if empty
      if (data.length === 0) {
        console.log('Supabase products table is empty. Seeding initial products...');
        const productsToSeed = INITIAL_PRODUCTS_DATA.map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          tagline: p.tagline,
          nafdac: p.nafdac,
          price: p.price,
          image: p.image,
          benefits: p.benefits,
          description: p.description,
          ingredients: p.ingredients,
          directions: p.directions,
          warnings: p.warnings
        }));
        
        const { error: seedError } = await supabase
          .from('products')
          .insert(productsToSeed);
          
        if (seedError) {
          console.error('Failed to seed products into Supabase:', seedError);
        } else {
          // Re-fetch
          const { data: refetched } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: true });
          return refetched || productsToSeed;
        }
      }
      
      return data;
    }
    return localDb.getProducts();
  },

  async saveProduct(product) {
    if (isSupabaseEnabled()) {
      const { data, error } = await supabase
        .from('products')
        .upsert(product)
        .select();
      if (error) {
        console.error('Supabase saveProduct error:', error);
        throw new Error(`Failed to save to Supabase: ${error.message}`);
      }
      // Also update local cache for immediate UI sync
      localDb.saveProduct(product);
      return data[0];
    }
    return localDb.saveProduct(product);
  },

  async deleteProduct(id) {
    if (isSupabaseEnabled()) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (error) {
        console.error('Supabase deleteProduct error, falling back to LocalStorage:', error);
        return localDb.deleteProduct(id);
      }
      return id;
    }
    return localDb.deleteProduct(id);
  },

  // ORDERS CRUD
  async getOrders() {
    if (isSupabaseEnabled()) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Supabase getOrders error, falling back to LocalStorage:', error);
        return localDb.getOrders();
      }
      return data.map(ord => ({
        id: ord.id,
        customerName: ord.customer_name,
        phone: ord.phone,
        altPhone: ord.alt_phone,
        state: ord.state,
        lga: ord.lga,
        address: ord.address,
        items: ord.items,
        total: ord.total,
        status: ord.status,
        createdAt: ord.created_at
      }));
    }
    return localDb.getOrders().map(ord => ({
      id: ord.id,
      customerName: ord.customer_name,
      phone: ord.phone,
      altPhone: ord.alt_phone,
      state: ord.state,
      lga: ord.lga,
      address: ord.address,
      items: ord.items,
      total: ord.total,
      status: ord.status,
      createdAt: ord.createdAt
    }));
  },

  async saveOrder(order) {
    if (isSupabaseEnabled()) {
      const { data, error } = await supabase
        .from('orders')
        .insert([order])
        .select();
      if (error) {
        console.error('Supabase saveOrder error, falling back to LocalStorage:', error);
        return localDb.saveOrder(order);
      }
      return data[0];
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
        console.error('Supabase updateOrderStatus error, falling back to LocalStorage:', error);
        return localDb.updateOrderStatus(id, status);
      }
      return data[0];
    }
    return localDb.updateOrderStatus(id, status);
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
      
      // Auto Seed Reviews into Supabase if empty
      if (data.length === 0) {
        const initialProd = INITIAL_PRODUCTS_DATA.find(p => p.id === productId);
        if (initialProd && initialProd.reviews && initialProd.reviews.length > 0) {
          console.log(`Seeding initial reviews for ${productId} to Supabase...`);
          const reviewsToSeed = initialProd.reviews.map(r => ({
            product_id: productId,
            author: r.author,
            location: r.location,
            rating: r.rating,
            comment: r.comment,
            date: r.date
          }));
          const { error: reviewSeedError } = await supabase
            .from('reviews')
            .insert(reviewsToSeed);
          if (!reviewSeedError) {
            const { data: refetchedReviews } = await supabase
              .from('reviews')
              .select('*')
              .eq('product_id', productId)
              .order('created_at', { ascending: false });
            return refetchedReviews || reviewsToSeed;
          }
        }
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
        console.error('Supabase saveReview error, falling back to LocalStorage:', error);
        return localDb.saveReview(review);
      }
      return data[0];
    }
    return localDb.saveReview(review);
  }
};
