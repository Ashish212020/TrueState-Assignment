const Transaction = require('../models/Transaction');

exports.getTransactions = async (req, res) => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search : '';
    const page = Math.max(1, parseInt(req.query.page) || 1); 
    const { 
      
      limit = 10, 
      sort = 'date-desc',
      region, 
      gender, 
      category, 
      paymentMethod,
      age, 
      tags,
      date
    } = req.query;

    const query = {};

    
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } }
      ];
    }

    if (region) query.customerRegion = { $in: region.split(',') };
    if (gender) query.gender = { $in: gender.split(',') };
    if (category) query.productCategory = { $in: category.split(',') };
    if (paymentMethod) query.paymentMethod = { $in: paymentMethod.split(',') };
    if (tags && tags !== 'All') {
      
      const tagList = tags.split(',');
      query.tags = { 
        $in: tagList.map(tag => new RegExp(tag.trim(), 'i')) 
      };
    }

    if (age && age !== 'All') {
      if (age === '0-18') {
        query.age = { $lte: 18 };
      } else if (age === '19-35') {
        query.age = { $gte: 19, $lte: 35 };
      } else if (age === '36-50') {
        query.age = { $gte: 36, $lte: 50 };
      } else if (age === '50+') {
        query.age = { $gte: 51 };
      }
    }

   if (date && date !== 'All') {
      const today = new Date();
      const targetDate = new Date();

      if (date === 'Last 7 Days') {
        targetDate.setDate(today.getDate() - 7);
      } else if (date === 'Last Month') {
        targetDate.setMonth(today.getMonth() - 1);
      } else if (date === 'Last 1 Year') {
        targetDate.setFullYear(today.getFullYear() - 1);
      } else if (date === 'Last 2 Years') {
        targetDate.setFullYear(today.getFullYear() - 2);
      } else if (date === 'Last 3 Years') {
        targetDate.setFullYear(today.getFullYear() - 3);
      }
      query.date = { $gte: targetDate };
    }

    let sortOptions = {};
    switch (sort) {
      case 'date-desc': sortOptions = { date: -1 }; break;
      case 'date-asc': sortOptions = { date: 1 }; break;
      case 'quantity-desc': sortOptions = { quantity: -1 }; break;
      case 'name-asc': sortOptions = { customerName: 1 }; break;
      default: sortOptions = { date: -1 };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    const statsPromise = Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalUnits: { $sum: "$quantity" },
          totalRevenue: { $sum: "$finalAmount" },
          totalOriginalPrice: { $sum: "$totalAmount" } 
        }
      }
    ]);

    const [transactions, totalCount, statsResult] = await Promise.all([
      Transaction.find(query).sort(sortOptions).skip(skip).limit(limitNum),
      Transaction.countDocuments(query),
      statsPromise
    ]);

    const stats = statsResult[0] || { totalUnits: 0, totalRevenue: 0, totalOriginalPrice: 0 };
    const totalDiscount = stats.totalOriginalPrice - stats.totalRevenue;

    res.json({
      success: true,
      count: totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      data: transactions,
      stats: {
        totalUnits: stats.totalUnits,
        totalRevenue: stats.totalRevenue,
        totalDiscount: totalDiscount
      }
    });

  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};