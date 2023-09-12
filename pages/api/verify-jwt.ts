import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { GenerateJwtPayload } from "../../types";

const secretKey = process.env.JWT_SECRET_KEY as string;

const verifyJwt = (req: NextApiRequest, res: NextApiResponse) => {
  const { context, accessKey } = req.body;
  const { requirement } = context;

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(accessKey, secretKey) as GenerateJwtPayload;

    // Check if the decoded payload matches the provided and requirement
    if (decoded.requirement === requirement) {
      res.status(200).json({ valid: true });
    } else {
      res.status(200).json({ valid: false });
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};

export default verifyJwt;
