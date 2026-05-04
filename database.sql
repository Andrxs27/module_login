-- ENUMS
CREATE TYPE document_type_enum AS ENUM ('CC', 'TI', 'PS', 'PPT', 'DNI');
CREATE TYPE sexo_enum AS ENUM ('M', 'F');

-- TABLA CHANGE PASSWORD
CREATE TABLE change_pass (
id VARCHAR(50) PRIMARY KEY,
password VARCHAR(255) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLA USERS
CREATE TABLE users (
id VARCHAR(50) PRIMARY KEY,
name VARCHAR(100) NOT NULL,
lastname VARCHAR(100) NOT NULL,
password VARCHAR(255) NOT NULL,
email VARCHAR(150) UNIQUE NOT NULL,

data_users_id INT,
change_pass_id VARCHAR(50),

rol VARCHAR(50),
document VARCHAR(50),
type_document document_type_enum,

phone VARCHAR(20),
address VARCHAR(255),
age INT CHECK (age <= 110),

departamento VARCHAR(100),
ciudad VARCHAR(100),

sexo sexo_enum,
active BOOLEAN DEFAULT TRUE,

born DATE,

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

CONSTRAINT fk_change_pass
    FOREIGN KEY (change_pass_id)
    REFERENCES change_pass(id)

);

-- TABLA PERMISSIONS
CREATE TABLE permissions (
id VARCHAR(50) PRIMARY KEY,
permiso VARCHAR(100) NOT NULL,
description TEXT,
rol VARCHAR(50)
);
