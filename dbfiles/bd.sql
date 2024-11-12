CREATE DATABASE db_itsme;

USE db_itsme;

CREATE TABLE usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre TEXT NOT NULL,
    username TEXT NOT NULL,
    edad int NOT NULL, 
    email Text NOT NULL,
    contraseña Text NOT NULL,
    descripcion TEXT,
    foto Text
);

CREATE TABLE red (
	id INT PRIMARY KEY auto_increment,
    id_usuario INT,
    nombre_red TEXT NOT NULL,
    link TEXT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id)
);

CREATE TABLE plantilla (
	id INT PRIMARY KEY AUTO_INCREMENT,
    nombre TEXT
);


CREATE TABLE categoria (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT,
    titulo TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_pub DATE NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id)
);

CREATE TABLE contenido (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_cat INT,
    id_plantilla INT,
    titulo TEXT NOT NULL,
    body TEXT,
    fecha_pub DATE NOT NULL,
    FOREIGN KEY (id_cat) REFERENCES categoria(id),
    FOREIGN KEY (id_plantilla) REFERENCES plantilla(id)
);

ALTER TABLE usuario MODIFY COLUMN foto LONGTEXT;
ALTER TABLE contenido  MODIFY COLUMN body LONGTEXT;
ALTER TABLE plantilla ADD COLUMN identificador Text;

INSERT INTO plantilla (nombre, identificador)
VALUES
  ('Lista', 'app-lista'),
  ('Lista Comparativa', 'app-listacomparativa'),
  ('Publicación', 'app-imagen');