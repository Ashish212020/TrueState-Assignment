import { useState, useEffect, useRef } from 'react';
import { fetchTransactions } from './services/api';
import { 
  Search, LayoutDashboard, FileText, Users, 
  ChevronDown, ChevronLeft, ChevronRight, Copy, Info 
} from 'lucide-react';
import './App.css'; 

function App() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  
  const [stats, setStats] = useState({ totalUnits: 0, totalRevenue: 0, totalDiscount: 0 });

 
  const [sort, setSort] = useState('name-asc');
  const [sortLabel, setSortLabel] = useState('Customer Name (A-Z)');
  const [showSortMenu, setShowSortMenu] = useState(false);

  
  const [filters, setFilters] = useState({
    region: 'All',
    gender: 'All',
    age: 'All',
    category: 'All',
    tags: 'All',
    paymentMethod: 'All',
    date: 'All'
  });
  const [search, setSearch] = useState('');

  
  const sortRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setShowSortMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sortRef]);

  useEffect(() => {
    const timer = setTimeout(() => loadData(), 500);
    return () => clearTimeout(timer);
  }, [search, filters, page, sort]); 

  const loadData = async () => {
    setLoading(true);
    try {
      
      const cleanFilters = {
        region: filters.region === 'All' ? '' : filters.region,
        gender: filters.gender === 'All' ? '' : filters.gender,
        age: filters.age === 'All' ? '' : filters.age,         
        category: filters.category === 'All' ? '' : filters.category,
        tags: filters.tags === 'All' ? '' : filters.tags,      
        paymentMethod: filters.paymentMethod === 'All' ? '' : filters.paymentMethod,
        date: filters.date === 'All' ? '' : filters.date      
      };

      const params = {
        page,
        limit: 10,
        search,
        sort, 
        ...cleanFilters
      };

      const data = await fetchTransactions(params);
      
      setTransactions(data.data);
      setTotalPages(data.totalPages);
      setTotalCount(data.count);
      if (data.stats) setStats(data.stats);
      
    } catch (err) {
      console.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleSortSelect = (value, label) => {
    setSort(value);
    setSortLabel(label);
    setShowSortMenu(false); 
    setPage(1);
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="app-container">
      {/* 1. SIDEBAR */}
      <aside className="sidebar">
        <div className="logo-area">
          <div className="logo-icon">A</div>
          <div className="logo-text"><strong>Vault</strong><span>Ashish Tiwari</span></div>
        </div>
        <nav className="nav-menu">
          <div className="nav-item active"><LayoutDashboard size={18} /> Dashboard</div>
          <div className="nav-item"><Users size={18} /> Nexus</div>
          <div className="nav-item"><FileText size={18} /> Intake</div>
          <div className="nav-section">Services</div>
          <div className="nav-item">Pre-active</div>
          <div className="nav-item">Active</div>
          <div className="nav-item">Blocked</div>
          <div className="nav-item">Closed</div>
          <div className="nav-section">Invoices</div>
          <div className="nav-item">Proforma Invoices</div>
        </nav>
      </aside>

      
      <main className="main-content">
        <header className="top-header">
          <h1>Sales Management System</h1>
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Name, Phone..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        
        <div className="filter-row">
          <select value={filters.region} onChange={(e) => handleFilterChange('region', e.target.value)}>
            <option value="All">Customer Region</option>
            <option value="North">North</option>
            <option value="South">South</option>
            <option value="East">East</option>
            <option value="West">West</option>
          </select>

          <select value={filters.gender} onChange={(e) => handleFilterChange('gender', e.target.value)}>
            <option value="All">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <select value={filters.age} onChange={(e) => handleFilterChange('age', e.target.value)}>
            <option value="All">Age Range</option>
            <option value="0-18">0-18</option>
            <option value="19-35">19-35</option>
            <option value="36-50">36-50</option>
            <option value="50+">50+</option>
          </select>

          <select value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)}>
            <option value="All">Product Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Beauty">Beauty</option>
            <option value="Home">Home</option>
          </select>
          
          <select value={filters.tags} onChange={(e) => handleFilterChange('tags', e.target.value)}>
            <option value="All">Tags</option>
            <option value="organic">Organic</option>
            <option value="skincare">Skincare</option>
            <option value="fashion">Fashion</option>
            <option value="wireless">Wireless</option>
            <option value="gadgets">Gadgets</option>
            <option value="portable">Portable</option>
            <option value="casual">Casual</option>
            <option value="unisex">Unisex</option>
            <option value="cotton">Cotton</option>
            <option value="smart">Smart</option>
            <option value="accessories">Accessories</option>
            <option value="beauty">Beauty</option>
            <option value="formal">Formal</option>
          </select>

           <select value={filters.paymentMethod} onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}>
            <option value="All">Payment Method</option>
            <option value="Credit Card">Credit Card</option>
            <option value="PayPal">PayPal</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Net Banking">Net Banking</option>
          </select>

          <select value={filters.date} onChange={(e) => handleFilterChange('date', e.target.value)}>
            <option value="All">Date</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last Month">Last Month</option>
            <option value="Last 1 Year">Last 1 Year</option>
            <option value="Last 2 Years">Last 2 Years</option>
            <option value="Last 3 Years">Last 3 Years</option>
          </select>

           
           <div className="sort-container" ref={sortRef}>
             <div className="sort-trigger" onClick={() => setShowSortMenu(!showSortMenu)}>
               Sort by: {sortLabel} <ChevronDown size={14} />
             </div>
             
             {showSortMenu && (
               <div className="sort-menu">
                 <div onClick={() => handleSortSelect('name-asc', 'Customer Name (A-Z)')}>Customer Name (A-Z)</div>
                 <div onClick={() => handleSortSelect('date-desc', 'Newest First')}>Newest First</div>
                 <div onClick={() => handleSortSelect('date-asc', 'Oldest First')}>Oldest First</div>
                 <div onClick={() => handleSortSelect('quantity-desc', 'Highest Quantity')}>Highest Quantity</div>
               </div>
             )}
           </div>
        </div>

        
        <div className="metrics-row">
          <div className="metric-card">
            <h3>Total units sold <Info size={14} /></h3>
            <p>{stats.totalUnits}</p>
          </div>
          <div className="metric-card">
            <h3>Total Amount <Info size={14} /></h3>
            <p>{formatCurrency(stats.totalRevenue)} <span className="sub">({totalCount} SRs)</span></p>
          </div>
          <div className="metric-card">
            <h3>Total Discount <Info size={14} /></h3>
            <p>{formatCurrency(stats.totalDiscount)} <span className="sub">({stats.totalUnits} SRs)</span></p>
          </div>
        </div>

        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Customer ID</th>
                <th>Customer Name</th>
                <th>Phone Number</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Payment Method</th>
                <th>Category</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="10" className="loading-cell">Loading Data...</td></tr>
              ) : (
                transactions.length > 0 ? (
                  transactions.map((t) => (
                    <tr key={t._id}>
                      <td>1234567</td>
                      <td>{new Date(t.date).toISOString().split('T')[0]}</td>
                      <td>{t.customerID}</td>
                      <td>{t.customerName}</td>
                      <td><div className="phone-cell">{t.phoneNumber} <Copy size={12} className="copy-icon" /></div></td>
                      <td>{t.gender}</td>
                      <td>{t.age}</td>
                      <td>{t.paymentMethod}</td> 
                      <td><strong>{t.productCategory}</strong></td>
                      <td>{t.quantity.toString().padStart(2, '0')}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="10" className="loading-cell">No transactions found.</td></tr>
                )
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
           
           <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
             <ChevronLeft size={18} />
           </button>
           
           
           {(() => {
            
             let start = Math.max(1, page - 2);
             let end = Math.min(totalPages, start + 4);
             
             
             if (end - start < 4) {
               start = Math.max(1, end - 4);
             }

             return Array.from({ length: end - start + 1 }, (_, i) => start + i).map(pNum => (
               <button 
                 key={pNum} 
                 className={page === pNum ? 'active' : ''}
                 onClick={() => setPage(pNum)}
               >
                 {pNum}
               </button>
             ));
           })()}
           
           <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
             <ChevronRight size={18} />
           </button>
        </div>

      </main>
    </div>
  );
}

export default App;