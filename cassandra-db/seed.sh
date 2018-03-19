#! /bin/bash
echo "drop keyspace chompy_bottom_right;" > seed.cql
echo "create keyspace chompy_bottom_right with replication = {'class':'SimpleStrategy','replication_factor':1};" >> seed.cql
echo "use chompy_bottom_right;" >> seed.cql

echo "create table restaurants (id int primary key, restaurant_id int, name varchar, avgScore int, reviewCount int, cuisine1 varchar, cuisine2 varchar, cuisine3 varchar, alsoViewed1 int, alsoViewed2 int, alsoViewed3 int);" >> seed.cql
echo "create table tips (id int primary key, restaurant_id int, text varchar);" >> seed.cql
echo "create table photos (id int primary key, restaurant_id int, thumbnailUrl varchar);" >> seed.cql

echo "copy restaurants (restaurant_id, alsoviewed1, alsoviewed2, alsoviewed3, avgscore, cuisine1, cuisine2, cuisine3, name, reviewcount) from '../database/restaurants.csv' with delimiter='\t';" >> seed.cql
echo "copy tips (restaurant_id, text) from '../database/tips.csv' with delimiter='\t';" >> seed.cql
echo "copy photos (restaurant_id, thumbnailUrl) from '../database/photos.csv' with delimiter='\t';" >> seed.cql

cqlsh -f 'seed.cql'

rm seed.cql