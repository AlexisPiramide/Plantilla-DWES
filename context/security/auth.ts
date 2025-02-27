import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import Usuario from "../../src/usuarios/domain/Usuario"
const SECRET_KEY: Secret = "miclave";

const decode = (token: string) => {
  return jwt.decode(token);
};

const createToken = (user: Usuario): string => {
  const payload = {
    correo: user.correo,
  };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1 days" });
};

const isAuth = (req: Request, response: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    const token: string | undefined = authHeader && authHeader.split(" ")[1];
    if (token) {
      const decoded: any = jwt.verify(token, SECRET_KEY);

      const id = decoded.correo.split("@")[0];

      if(isNaN(Number(id))){
        throw response.status(401).json({ mensaje: "No autorizado" });
      }
      req.body.correo = decoded.correo;
      next();
     
     
    } else {
      response.status(401).json({ mensaje: "No autorizado" });
    }
  } catch (err) {
    response.status(401).json({ mensaje: "No autorizado" });
  }
};

const isConserje = (req: Request, response: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    const token: string | undefined = authHeader && authHeader.split(" ")[1];
    if (token) {
      const decoded: any = jwt.verify(token, SECRET_KEY);
     

      const id = decoded.correo.split("@")[0];

      if(isNaN(Number(id))){
        req.body.correo = decoded.correo;
        next();
      }else{
        throw response.status(401).json({ mensaje: "No autorizado" });
      }
   
     
    } else {
      response.status(401).json({ mensaje: "No autorizado" });
    }
  } catch (err) {
    response.status(401).json({ mensaje: "No autorizado" });
  }
};



export { decode, createToken, isAuth,isConserje };