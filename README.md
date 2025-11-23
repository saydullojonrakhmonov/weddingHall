# weddingHall
2 degree 2 semester final exam programming Full stack project.
Here is database create table queries:

CREATE TABLE "user" (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  user_name VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(10) CHECK (role IN ('admin', 'owner', 'user')) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE district (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);


CREATE TABLE wedding_hall (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  seat_price NUMERIC(10, 2) NOT NULL,
  capacity INTEGER NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('pending', 'approved')) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  owner_id INTEGER REFERENCES user(id) ON DELETE SET NULL,
  district_id INTEGER REFERENCES district(id) ON DELETE SET NULL
);

CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  image_path TEXT NOT NULL,
  venue_id INTEGER REFERENCES wedding_hall(id) ON DELETE CASCADE
);


CREATE TABLE booking (
  id SERIAL PRIMARY KEY,
  guest_amount INTEGER NOT NULL,
  reservation_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) CHECK (status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending',
  venue_id INTEGER REFERENCES wedding_hall(id) ON DELETE CASCADE,
  phone_number VARCHAR(20) NOT NULL,
  user_id INTEGER REFERENCES user(id) ON DELETE SET NULL
);


Notes:
- The status columns in wedding_hall and booking use CHECK constraints for allowed values.
- ON DELETE rules are chosen to avoid orphan records: SET NULL for owner_id, and CASCADE for child records like images and booking.
- You can tweak types (e.g., VARCHAR length or NUMERIC precision) based on your application's requirements.

