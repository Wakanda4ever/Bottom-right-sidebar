#! /bin/bash
mysql -u root < sql/schema.sql
echo 'Dropped mysql database chompy_bottom_right'
echo 'Generating data...'
time node generateData.js
echo 'Generated data to .csv files'
echo 'Importing to database...'
time mysqlimport chompy_bottom_right restaurants.csv -u root --local
time mysqlimport chompy_bottom_right tips.csv -u root --local
time mysqlimport chompy_bottom_right photos.csv -u root --local