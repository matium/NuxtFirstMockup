import express from "express";
export const router = express.Router();

router.get('/', (req, res, next) => {
  console.log('Render Express');
  res.render('index', { title: 'Express API Server' });
});
