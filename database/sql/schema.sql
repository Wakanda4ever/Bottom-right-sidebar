DROP DATABASE IF EXISTS chompy_bottom_right;

CREATE DATABASE chompy_bottom_right;

USE chompy_bottom_right;

CREATE TABLE restaurants (
  id INT NOT NULL AUTO_INCREMENT,
  restaurant_id INT NOT NULL,
  -- thumbnailUrl VARCHAR(200),
  name VARCHAR(80),
  city VARCHAR(80),
  avgscore INT NOT NULL,
  reviewcount INT NOT NULL,
  -- tip VARCHAR(200),
  cuisine1 VARCHAR(21),
  cuisine2 VARCHAR(21),
  cuisine3 VARCHAR(21),
  alsoviewed1 INT NOT NULL,
  alsoviewed2 INT NOT NULL,
  alsoviewed3 INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE photos (
  id INT NOT NULL AUTO_INCREMENT,
  restaurant_id INT NOT NULL,
  thumbnailurl VARCHAR(200),
  PRIMARY KEY (id),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
);

CREATE TABLE tips (
  id INT NOT NULL AUTO_INCREMENT,
  restaurant_id INT NOT NULL,
  text VARCHAR(200),
  PRIMARY KEY (id),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
);