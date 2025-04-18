import React from "react";
import Layout from "./Layout/Layout";
import Products from "./Pages/Products";
import Home from "./Pages/Home";
import Blog from "./Pages/Blog";
import CaseStudy from "./Pages/CaseStudy";
import Product from "./Pages/Product";
import Wishlist from "./Pages/Wishlist";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./scss/main.scss"; //importing the main.scss file to apply the styles to the app.js file.
import CategoryPage from "./Pages/CategoryPage";

function App() {
    return (
        <Router>
            <Layout>
                <div className="App">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/Products" element={<Products />} />
                        <Route
                            path="/Products/:categoryName"
                            element={<CategoryPage />}
                        />
                        <Route
                            path="/Products/:categoryName/:productName"
                            element={<Product />}
                        />
                        <Route path="/Blog" element={<Blog />} />
                        <Route
                            path="/case-studies"
                            element={<CaseStudy />}
                        />
                        <Route path="/Wishlist" element={<Wishlist />} />
                    </Routes>
                </div>
            </Layout>
        </Router>
    );
}

export default App;
