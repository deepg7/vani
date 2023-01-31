//IMPORTING THE DOCUMENT TYPE OF USER ENTITY

//EXTENDING EXPRESS REQUEST TO CONTAIN USER AND TOKEN PROPERTIES
declare namespace Express {
  interface Request {
    phone: string;
  }
}
