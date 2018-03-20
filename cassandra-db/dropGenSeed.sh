#! /bin/bash
echo "Generating data..."
grep 'const QUANTITY' generateDataCassandra.js
node generateDataCassandra.js

echo "drop keyspace if exists chompy_bottom_right;" > seed.cql
echo "create keyspace chompy_bottom_right with replication = {'class':'SimpleStrategy','replication_factor':1};" >> seed.cql
echo "use chompy_bottom_right;" >> seed.cql

echo "create table restaurants (id UUID, restaurant_id int, name varchar, city varchar, avgScore int, reviewCount int, cuisine1 varchar, cuisine2 varchar, cuisine3 varchar, alsoViewed1 int, alsoViewed2 int, alsoViewed3 int, PRIMARY KEY ((id), restaurant_id));" >> seed.cql
echo "create table tips (id UUID, restaurant_id int, text varchar, PRIMARY KEY ((id), restaurant_id));" >> seed.cql
echo "create table photos (id UUID, restaurant_id int, thumbnailUrl varchar, PRIMARY KEY ((id), restaurant_id));" >> seed.cql

echo "create index on restaurants (restaurant_id);" >> seed.cql
echo "create index on photos (restaurant_id);" >> seed.cql
echo "create index on tips (restaurant_id);" >> seed.cql

echo "copy restaurants (id, restaurant_id, name, city, avgScore, reviewCount, cuisine1, cuisine2, cuisine3, alsoViewed1, alsoViewed2, alsoViewed3) from 'restaurants.csv' with delimiter='\t';" >> seed.cql
echo "copy tips (id, restaurant_id, text) from 'tips.csv' with delimiter='\t';" >> seed.cql
echo "copy photos (id, restaurant_id, thumbnailUrl) from 'photos.csv' with delimiter='\t';" >> seed.cql

cqlsh -f 'seed.cql'

rm seed.cql