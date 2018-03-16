DROP DATABASE IF EXISTS chompy_bottom_right;

CREATE DATABASE chompy_bottom_right;

USE chompy_bottom_right;

CREATE TABLE restaurants (
  _id INT NOT NULL,
  -- thumbnailUrl VARCHAR(200),
  name VARCHAR(200),
  avgScore INT NOT NULL,
  reviewCount INT NOT NULL,
  -- tip VARCHAR(200),
  cuisine1 VARCHAR(200),
  cuisine2 VARCHAR(200),
  cuisine3 VARCHAR(200),
  alsoViewed1 INT NOT NULL,
  alsoViewed2 INT NOT NULL,
  alsoViewed3 INT NOT NULL,
  PRIMARY KEY (_id)
);

CREATE TABLE photos (
  id INT NOT NULL AUTO_INCREMENT,
  restaurant_id INT NOT NULL,
  thumbnailUrl VARCHAR(200),
  PRIMARY KEY (id),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants (_id)
);

CREATE TABLE tips (
  id INT NOT NULL AUTO_INCREMENT,
  restaurant_id INT NOT NULL,
  text VARCHAR(200),
  PRIMARY KEY (id),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants (_id)
);