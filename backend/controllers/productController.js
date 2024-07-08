const axios = require('axios');
const Product = require('../models/Product');

// Fetch and save products
const fetchProducts = async (req, res) => {
    try {
        const response = await axios.get('http://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const products = response.data;

        await Product.insertMany(products, { ordered: false });

        res.status(200).json({ message: 'Products fetched and saved successfully' });
    } catch (error) {
        console.error('Error fetching or saving products:', error);
        res.status(500).json({ message: 'Error fetching or saving products', error });
    }
};

// List transactions with search and pagination
const listTransactions = async (req, res) => {
    try {
        const { search, page = 1, perPage = 10 } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { title: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
                { price: parseFloat(search) || 0 }
            ];
        }

        const transactions = await Product.find(query)
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage));

        const totalRecords = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalRecords / perPage);

        res.status(200).json({
            page: parseInt(page),
            perPage: parseInt(perPage),
            totalRecords,
            totalPages,
            transactions
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Error fetching transactions', error });
    }
};

// Helper functions for statistics
const calculateTotalSaleAmount = async (monthNum) => {
    const totalSaleAmount = await Product.aggregate([
        { 
            $match: { 
                sold: true, 
                $expr: { $eq: [{ $month: '$dateOfSale' }, monthNum] } 
            } 
        },
        { $group: { _id: null, total: { $sum: '$price' } } }
    ]);

    return totalSaleAmount[0] ? totalSaleAmount[0].total : 0;
};

const calculateTotalSoldItems = async (monthNum) => {
    return await Product.countDocuments({
        sold: true,
        $expr: { $eq: [{ $month: '$dateOfSale' }, monthNum] }
    });
};

const calculateTotalNotSoldItems = async (monthNum) => {
    return await Product.countDocuments({
        sold: false,
        $expr: { $eq: [{ $month: '$dateOfSale' }, monthNum] }
    });
};

const calculateBarChartData = async (monthNum) => {
    const priceRanges = [
        { range: '0-100', min: 0, max: 100 },
        { range: '101-200', min: 101, max: 200 },
        { range: '201-300', min: 201, max: 300 },
        { range: '301-400', min: 301, max: 400 },
        { range: '401-500', min: 401, max: 500 },
        { range: '501-600', min: 501, max: 600 },
        { range: '601-700', min: 601, max: 700 },
        { range: '701-800', min: 701, max: 800 },
        { range: '801-900', min: 801, max: 900 },
        { range: '901-above', min: 901, max: Infinity }
    ];

    const barChartData = await Promise.all(priceRanges.map(async ({ range, min, max }) => {
        const count = await Product.countDocuments({
            price: { $gte: min, $lt: max },
            $expr: { $eq: [{ $month: '$dateOfSale' }, monthNum] }
        });
        return { range, count };
    }));

    return barChartData;
};

const calculatePieChartData = async (monthNum) => {
    return await Product.aggregate([
        { $match: { $expr: { $eq: [{ $month: '$dateOfSale' }, monthNum] } } },
        { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
};

// Statistics for a selected month
const getStatistics = async (req, res) => {
    try {
        const { month } = req.query;
        const monthNum = parseInt(month, 10);

        const totalSaleAmount = await calculateTotalSaleAmount(monthNum);
        const totalSoldItems = await calculateTotalSoldItems(monthNum);
        const totalNotSoldItems = await calculateTotalNotSoldItems(monthNum);

        res.status(200).json({
            totalSaleAmount,
            totalSoldItems,
            totalNotSoldItems
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ message: 'Error fetching statistics', error });
    }
};

// Bar chart data for a selected month
const getBarChartData = async (req, res) => {
    try {
        const { month } = req.query;
        const monthNum = parseInt(month, 10);

        const barChartData = await calculateBarChartData(monthNum);

        res.status(200).json(barChartData);
    } catch (error) {
        console.error('Error fetching bar chart data:', error);
        res.status(500).json({ message: 'Error fetching bar chart data', error });
    }
};

// Pie chart data for a selected month
const getPieChartData = async (req, res) => {
    try {
        const { month } = req.query;
        const monthNum = parseInt(month, 10);

        const pieChartData = await calculatePieChartData(monthNum);

        res.status(200).json(pieChartData);
    } catch (error) {
        console.error('Error fetching pie chart data:', error);
        res.status(500).json({ message: 'Error fetching pie chart data', error });
    }
};

// Combined data from all statistics APIs
const getCombinedStatistics = async (req, res) => {
    try {
        const { month } = req.query;
        const monthNum = parseInt(month, 10);

        const statistics = await Promise.all([
            calculateTotalSaleAmount(monthNum),
            calculateTotalSoldItems(monthNum),
            calculateTotalNotSoldItems(monthNum),
            calculateBarChartData(monthNum),
            calculatePieChartData(monthNum)
        ]);

        res.status(200).json({
            totalSaleAmount: statistics[0],
            totalSoldItems: statistics[1],
            totalNotSoldItems: statistics[2],
            barChartData: statistics[3],
            pieChartData: statistics[4]
        });
    } catch (error) {
        console.error('Error fetching combined statistics:', error);
        res.status(500).json({ message: 'Error fetching combined statistics', error });
    }
};

module.exports = {
    fetchProducts,
    listTransactions,
    getStatistics,
    getBarChartData,
    getPieChartData,
    getCombinedStatistics
};
