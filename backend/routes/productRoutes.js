const express = require('express');
const {
    fetchProducts,
    listTransactions,
    getStatistics,
    getBarChartData,
    getPieChartData,
    getCombinedStatistics
} = require('../controllers/productController');

const router = express.Router();

router.get('/fetch-products', fetchProducts);
router.get('/transactions', listTransactions);
router.get('/statistics', getStatistics);
router.get('/bar-chart', getBarChartData);
router.get('/pie-chart', getPieChartData);
router.get('/combined-statistics', getCombinedStatistics);

module.exports = router;
