import React from "react";
import Layout from "./Layout/Layout";
import Products from "./Pages/Products";
import Home from "./Pages/Home";
import Blog from "./Pages/Blog";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
    return (
        <Router>
            <Layout>
                <div className="App">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/Products" element={<Products />} />
                        <Route path="/Blog" element={<Blog />} /> 
                    </Routes>
                </div>
            </Layout>
        </Router>
    );
}

export default App;
