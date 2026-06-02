-- ============================================================
--  Celeste — Database Schema
-- ============================================================

-- Users
CREATE TABLE IF NOT EXISTS users (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255)  UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name          VARCHAR(255)  NOT NULL,
  role          VARCHAR(20)   NOT NULL DEFAULT 'customer',  -- customer | vendor | admin
  shop_id       VARCHAR(50),  -- populated for vendor role
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ   DEFAULT NOW()
);

-- Shops
CREATE TABLE IF NOT EXISTS shops (
  id          VARCHAR(50)   PRIMARY KEY,
  vendor_id   UUID          REFERENCES users(id),
  name        VARCHAR(255)  NOT NULL,
  verified    BOOLEAN       DEFAULT false,
  rating      DECIMAL(3,2)  DEFAULT 0,
  sales_count INTEGER       DEFAULT 0,
  category    VARCHAR(100),
  logo_url    TEXT,
  description TEXT,
  since_year  INTEGER,
  created_at  TIMESTAMPTZ   DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id            VARCHAR(20)   PRIMARY KEY,
  shop_id       VARCHAR(50)   NOT NULL REFERENCES shops(id),
  name          VARCHAR(255)  NOT NULL,
  price         DECIMAL(10,2) NOT NULL,
  old_price     DECIMAL(10,2),
  rating        DECIMAL(3,2)  DEFAULT 4.7,
  reviews_count INTEGER       DEFAULT 0,
  tag           VARCHAR(50),
  category      VARCHAR(100),
  image_ratio   VARCHAR(10)   DEFAULT '1/1',
  ai_enabled    BOOLEAN       DEFAULT false,
  stock         INTEGER       DEFAULT 100,
  created_at    TIMESTAMPTZ   DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_fts ON products
  USING GIN(to_tsvector('english', name || ' ' || COALESCE(category, '')));

CREATE INDEX IF NOT EXISTS idx_products_shop   ON products(shop_id);
CREATE INDEX IF NOT EXISTS idx_products_cat    ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_tag    ON products(tag);
CREATE INDEX IF NOT EXISTS idx_products_price  ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating DESC);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    VARCHAR(20)   NOT NULL REFERENCES products(id),
  user_id       UUID          REFERENCES users(id),
  reviewer_name VARCHAR(100)  NOT NULL,
  rating        INTEGER       NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body          TEXT,
  created_at    TIMESTAMPTZ   DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);

-- Cart items (supports guests via session_id)
CREATE TABLE IF NOT EXISTS cart_items (
  id         UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID          REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(36),
  product_id VARCHAR(20)   NOT NULL REFERENCES products(id),
  qty        INTEGER       NOT NULL DEFAULT 1 CHECK (qty > 0),
  added_at   TIMESTAMPTZ   DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cart_user    ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_session ON cart_items(session_id);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id                VARCHAR(20)   PRIMARY KEY,
  user_id           UUID          REFERENCES users(id),
  status            VARCHAR(20)   DEFAULT 'new',  -- new | packed | shipped | delivered | refund
  subtotal          DECIMAL(10,2) NOT NULL,
  shipping          DECIMAL(10,2) DEFAULT 0,
  tax               DECIMAL(10,2) DEFAULT 0,
  total             DECIMAL(10,2) NOT NULL,
  shipping_name     VARCHAR(255),
  shipping_line1    TEXT,
  shipping_line2    TEXT,
  shipping_city     VARCHAR(100),
  shipping_postcode VARCHAR(20),
  shipping_country  VARCHAR(100),
  payment_last4     VARCHAR(4),
  payment_brand     VARCHAR(20),
  created_at        TIMESTAMPTZ   DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user   ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_date   ON orders(created_at DESC);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     VARCHAR(20)   NOT NULL REFERENCES orders(id),
  product_id   VARCHAR(20)   REFERENCES products(id),
  shop_id      VARCHAR(50)   REFERENCES shops(id),
  product_name VARCHAR(255)  NOT NULL,
  qty          INTEGER       NOT NULL,
  price        DECIMAL(10,2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_oi_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_oi_shop  ON order_items(shop_id);

-- Saved sets (wishlists)
CREATE TABLE IF NOT EXISTS saved_sets (
  id         UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name       VARCHAR(255)  NOT NULL,
  created_at TIMESTAMPTZ   DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS saved_set_items (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  set_id     UUID        NOT NULL REFERENCES saved_sets(id) ON DELETE CASCADE,
  product_id VARCHAR(20) NOT NULL REFERENCES products(id),
  added_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(set_id, product_id)
);

-- Contact submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id         UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(255)  NOT NULL,
  email      VARCHAR(255)  NOT NULL,
  subject    VARCHAR(255),
  message    TEXT          NOT NULL,
  created_at TIMESTAMPTZ   DEFAULT NOW()
);

-- ── Views ─────────────────────────────────────────────────

CREATE OR REPLACE VIEW v_order_summary AS
  SELECT
    o.id,
    o.user_id,
    o.status,
    o.total,
    o.created_at,
    COUNT(oi.id)::INT       AS item_count,
    STRING_AGG(DISTINCT s.name, ', ' ORDER BY s.name) AS shops
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.id
  JOIN shops       s  ON s.id = oi.shop_id
  GROUP BY o.id;

CREATE OR REPLACE VIEW v_vendor_stats AS
  SELECT
    s.id        AS shop_id,
    s.name      AS shop_name,
    s.rating,
    COUNT(DISTINCT o.id)::INT                   AS orders_count,
    COALESCE(SUM(oi.price * oi.qty), 0)::FLOAT  AS gmv,
    COUNT(DISTINCT CASE WHEN o.status IN ('new','packed') THEN o.id END)::INT AS pending_orders
  FROM shops s
  LEFT JOIN order_items oi ON oi.shop_id = s.id
  LEFT JOIN orders      o  ON o.id = oi.order_id
  GROUP BY s.id, s.name, s.rating;
