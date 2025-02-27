CREATE TABLE Usuario(
    correo VARCHAR(255) PRIMARY KEY,
    contraseña VARCHAR(255) NOT NULL,
    saldo NUMERIC(4,2) NOT NULL
);

CREATE TABLE Transaccion (
    id SERIAL PRIMARY KEY,
    concepto  VARCHAR(255) NOT NULL,
    usuario VARCHAR(255) NOT NULL,
    conserje VARCHAR(255) NOT NULL,
    importe  NUMERIC(8,2) NOT NULL,
    fecha DATE NOT NULL,
    FOREIGN KEY (usuario) REFERENCES Usuario(correo)  ON DELETE CASCADE,
    FOREIGN KEY (conserje) REFERENCES Usuario(correo)  ON DELETE CASCADE
);  



 INSERT INTO usuario (correo,contraseña,saldo) VALUES ('pepe@gmail.com','$2b$10$DNJzW34hPxDV1ZVbZxVDh.CBdS3mQHiWCGwtiA3qbhLPt4gCMETdS',0) RETURNING *;
 INSERT INTO usuario (correo,contraseña,saldo) VALUES ('1234@gmail.com','$2b$10$T2wRngsc3ZyrI7DLXt3j0.EY5YJ1AvlS4mdmxghchvRmqTpaYP0em',0) RETURNING *;
 INSERT INTO transaccion(usuario,concepto,conserje,importe,fecha) VALUES ('1234@gmail.com','Recarga de saldo','pepe@gmail.com','10',NOW()) RETURNING *;
