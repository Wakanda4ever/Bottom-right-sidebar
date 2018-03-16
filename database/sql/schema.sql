CREATE DATABASE chompy_bottom_right;

USE chompy_bottom_right;

CREATE TABLE restaurants (
  _id int NOT NULL,
  thumbnailUrl varchar(200),
  name varchar(200),
  avgScore int NOT NULL,
  reviewCount int NOT NULL,
  tip varchar(200),
  cuisine1 varchar(200),
  cuisine2 varchar(200),
  cuisine3 varchar(200),
  alsoViewed1 int NOT NULL,
  alsoViewed2 int NOT NULL,
  alsoViewed3 int NOT NULL,
  PRIMARY KEY (_id)
);