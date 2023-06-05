import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { GenerateJwtPayload } from "../../types";

const secretKey = process.env.JWT_SECRET_KEY;

const generateJwt = (req: NextApiRequest, res: NextApiResponse) => {
  const { requirement, userAddress }: GenerateJwtPayload = req.body;

  const payload = {
    requirement,
    userAddress,
  };

  const token = jwt.sign(payload, secretKey);

  res.status(200).json({ token });
};

export default generateJwt;
