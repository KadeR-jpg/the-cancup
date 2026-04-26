CREATE TABLE IF NOT EXISTS drinks (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  name  TEXT NOT NULL UNIQUE,
  slug  TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS ratings (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id  TEXT    NOT NULL,
  drink_id INTEGER NOT NULL REFERENCES drinks(id) ON DELETE CASCADE,
  stars    INTEGER NOT NULL CHECK(stars BETWEEN 1 AND 5),
  rated_at TEXT    NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, drink_id)
);

CREATE INDEX IF NOT EXISTS idx_ratings_drink ON ratings(drink_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user  ON ratings(user_id);

INSERT OR IGNORE INTO drinks (name, slug) VALUES
  ('Hawaiian Shaved Ice',   'hawaiian-shaved-ice'),
  ('Mimosa',                'mimosa'),
  ('Breezeberry',           'breezeberry'),
  ('Cherry Slush',          'cherry-slush'),
  ('Galaxy Lemonade',       'galaxy-lemonade'),
  ('Tropsicle',             'tropsicle'),
  ('Blue Slush',            'blue-slush'),
  ('Cosmic Stardust',       'cosmic-stardust'),
  ('Watermelon Wave',       'watermelon-wave'),
  ('Arctic White',          'arctic-white'),
  ('Birthday Cake',         'birthday-cake'),
  ('Kiwi Guava',            'kiwi-guava'),
  ('Sour Peach Rings',      'sour-peach-rings'),
  ('Dragon Fruit Lemonade', 'dragon-fruit-lemonade'),
  ('Citrus Dew',            'citrus-dew');
