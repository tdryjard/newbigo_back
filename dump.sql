DROP DATABASE newbigo IF EXISTS;

CREATE DATABASE newbigo;

use newbigo

CREATE TABLE command (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    phone_vonage VARCHAR(255) NULL,
    phone_client VARCHAR(255) NULL,
    service VARCHAR(255) NULL,
    customer_id VARCHAR(255) NULL
);

CREATE TABLE credit (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    stock VARCHAR(255) NULL
);