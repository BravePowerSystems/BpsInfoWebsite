import React from "react";
import Layout from "./Layout/Layout";
import Home from "./Pages/Home";
import Products from "./Pages/Products";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
    return (
        <Router>
            <Layout>
                <div className="App">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/Products" element={<Products />} />
                    </Routes>
                </div>
            </Layout>
        </Router>
    );
}

export default App;
