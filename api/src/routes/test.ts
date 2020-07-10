import express from "express";
export const router = express.Router();

router.get('/', (req, res, next) => {
  console.log('Test Path');
  res.status(200).send({
    result: 'Success API Server Request'
  });
});
