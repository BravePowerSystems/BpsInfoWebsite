import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";

dotenv.config();

const products = [
    {
        title: "Gas Flow Pulse Transmitter",
        modelNumber: "GFT21",
        category: "Transmitters",
        description: "Advanced gas flow pulse transmitter for accurate monitoring",
        specifications: [
            { name: "Brand", value: "BRAVE" },
            { name: "Model Number", value: "GFT21" },
            { name: "Measurement Type", value: "Flow Pulse" },
            { name: "Usage/Application", value: "LPG, Universal Gas, CNG" },
            { name: "Precision", value: "± 0.01%" },
            { name: "Operating Temperature", value: "-10~85%RH" },
            { name: "Communication Port", value: "Modbus RS485" },
            { name: "Transmission", value: "4-20mA" },
            { name: "Operating Voltage", value: "12VDC" },
            { name: "Number of Channel", value: "1 Channel" },
            { name: "Dimension", value: "L:110mm X W:45mm X H:30mm" },
            { name: "Weight", value: "100grams" },
            { name: "IP Rating", value: "IP66" },
            { name: "Country of Origin", value: "Make In India" },
        ],
        applications: [
            "Gas flow monitoring in industrial processes",
            "LPG distribution systems",
            "CNG stations",
            "Chemical processing plants",
        ],
        downloads: [
            {
                name: "GFT21 Installation Manual",
                type: "PDF",
                url: "/downloads/GFT21_manual.pdf",
            },
        ],
        imageUrl: "/gasFlowPulseTransmitter.png",
    },
    {
        title: "Water Flow Transmitter",
        modelNumber: "GFT24",
        category: "Transmitters",
        description: "High-precision water flow monitoring transmitter",
        specifications: [
            { name: "Brand", value: "BRAVE" },
            { name: "Model Number", value: "GFT24" },
            { name: "Measurement", value: "Water" },
            { name: "Usage/Application", value: "Commercial and industrial" },
            { name: "Precision", value: "± 0.5-1%" },
            { name: "Operating Temperature", value: "-10~85%RH" },
            { name: "Communication Port", value: "Modbus RS485" },
            { name: "Transmission", value: "4-20mA" },
            { name: "Operating Voltage", value: "12-24VDC" },
            { name: "Number of Channel", value: "1 Channel" },
            { name: "Dimension", value: "L:110mm X W:45mm X H:30mm" },
            { name: "Weight", value: "100grams" },
            { name: "IP Rating", value: "IP66" },
            { name: "Country of Origin", value: "Make In India" },
        ],
        applications: [
            "Commercial water distribution",
            "Industrial process monitoring",
            "Water treatment plants",
            "Irrigation systems",
            "Building management systems",
        ],
        downloads: [
            {
                name: "Water Flow Transmitter Installation Manual",
                type: "PDF",
                url: "/downloads/water_flow_manual.pdf",
            },
        ],
        imageUrl: "/25-WFT25.jpg",
    },
    {
        title: "CO2 Transmitter",
        modelNumber: "CO224",
        category: "Transmitters",
        description: "Advanced CO2 monitoring transmitter for various applications",
        specifications: [
            { name: "Brand", value: "BRAVE" },
            { name: "Model Number", value: "CO224" },
            { name: "Measurement Unit", value: "PPM" },
            {
                name: "Usage/Application",
                value: "HVAC, Green House, Landfill Gas, Mushroom farms, and Industrial",
            },
            { name: "Precision", value: "± 0.5-1%" },
            { name: "Operating Temperature", value: "-10~50%RH" },
            { name: "Communication Port", value: "Modbus RS485" },
            { name: "Transmission", value: "4-20mA" },
            { name: "Operating Voltage", value: "12-24VDC" },
            { name: "Number of Channel", value: "1 Channel" },
            { name: "Dimension", value: "L:110mm X W:45mm X H:30mm" },
            { name: "Weight", value: "100grams" },
            { name: "IP Rating", value: "IP66" },
            { name: "Country of Origin", value: "Make In India" },
        ],
        applications: [
            "HVAC systems",
            "Greenhouse monitoring",
            "Indoor air quality control",
            "Mushroom farming",
            "Industrial ventilation systems",
        ],
        downloads: [
            {
                name: "CO224 Installation Manual",
                type: "PDF",
                url: "/downloads/CO224_manual.pdf",
            },
        ],
        imageUrl: "/34-CO234.jpg",
    },
    {
        title: "Water pH Transmitter",
        modelNumber: "WPH24",
        category: "Transmitters",
        description: "Precise pH monitoring transmitter for water applications",
        specifications: [
            { name: "Brand", value: "BRAVE" },
            { name: "Model Number", value: "WPH24" },
            { name: "Measurement Unit", value: "pH 0-14" },
            { name: "Usage/Application", value: "Home, Hotel, and Industrial" },
            { name: "Precision", value: "± 0.01 %" },
            { name: "Operating Temperature", value: "-10~50%RH" },
            { name: "Communication Port", value: "Modbus RS485" },
            { name: "Transmission", value: "4-20mA" },
            { name: "Operating Voltage", value: "12-24VDC" },
            { name: "Number of Channel", value: "1 Channel" },
            { name: "Dimension", value: "L:110mm X W:45mm X H:30mm" },
            { name: "Weight", value: "100grams" },
            { name: "IP Rating", value: "IP66" },
            { name: "Country of Origin", value: "Make In India" },
        ],
        applications: [
            "Water treatment plants",
            "Swimming pools",
            "Industrial process control",
            "Aquaculture",
            "Laboratory monitoring",
        ],
        downloads: [
            {
                name: "WPH24 Installation Manual",
                type: "PDF",
                url: "/downloads/WPH24_manual.pdf",
            },
        ],
        imageUrl: "/21-WPH21.jpg",
    },
    {
        title: "IR HVAC Air Conditioner Transmitter",
        modelNumber: "IRAC24",
        category: "Transmitters",
        description: "Temperature and humidity transmitter for HVAC applications",
        specifications: [
            { name: "Brand", value: "BRAVE" },
            { name: "Model Number", value: "IRAC24" },
            { name: "Measurement Unit", value: "Temperature and Humidity" },
            { name: "Usage/Application", value: "Home, Hotel, and Industrial" },
            { name: "Precision", value: "± 0.01 %" },
            { name: "Operating Temperature", value: "-10~50%RH" },
            { name: "Communication Port", value: "Modbus RS485" },
            { name: "Transmission", value: "4-20mA" },
            { name: "Operating Voltage", value: "12-24VDC" },
            { name: "Number of Channel", value: "1 Channel" },
            { name: "Dimension", value: "L:110mm X W:45mm X H:30mm" },
            { name: "Weight", value: "100grams" },
            { name: "Country of Origin", value: "Make In India" },
        ],
        applications: [
            "Commercial HVAC systems",
            "Building automation",
            "Climate control systems",
            "Server room monitoring",
            "Clean room environments",
        ],
        downloads: [
            {
                name: "IRAC24 Installation Manual",
                type: "PDF",
                url: "/downloads/IRAC24_manual.pdf",
            },
        ],
        imageUrl: "/transmitters/hvac.jpg",
    },
    {
        title: "Humidity & Temperature Transmitter",
        modelNumber: "HT24",
        category: "Transmitters",
        description: "Combined humidity and temperature transmitter for various apps",
        specifications: [
            { name: "Brand", value: "BRAVE" },
            { name: "Model Number", value: "HT24" },
            { name: "Measurement Unit", value: "Temperature and Humidity" },
            {
                name: "Usage/Application",
                value: "For HVAC, Home, Hotel, Hospital, Green House and Industrial",
            },
            { name: "Temperature Range", value: "-40-100 °" },
            { name: "Humidity Range", value: "0~100%RH" },
            { name: "Precision", value: "± 0.01 %" },
            { name: "Operating Temperature", value: "-10~50%RH" },
            { name: "Communication Port", value: "Modbus RS485" },
            { name: "Transmission", value: "4-20mA" },
            { name: "Operating Voltage", value: "12-24VDC" },
            { name: "Number of Channel", value: "1 Channel" },
            { name: "Dimension", value: "L:110mm X W:45mm X H:30mm" },
            { name: "Weight", value: "100grams" },
            { name: "IP Rating", value: "IP66" },
            { name: "Country of Origin", value: "Make In India" },
        ],
        applications: [
            "HVAC systems",
            "Greenhouses",
            "Storage facilities",
            "Manufacturing environments",
            "Weather monitoring stations",
        ],
        downloads: [
            {
                name: "HT24 Installation Manual",
                type: "PDF",
                url: "/downloads/HT24_manual.pdf",
            },
        ],
        imageUrl: "/controllers/humidity_temp.jpg",
    },
    {
        title: "Humidity Controller",
        modelNumber: "HMC24",
        category: "Controllers",
        description: "Advanced humidity control system",
        specifications: [
            { name: "Brand", value: "BRAVE" },
            { name: "Model Number", value: "HMC24" },
            { name: "Measurement Unit", value: "Temperature and Humidity" },
            {
                name: "Usage/Application",
                value: "For HVAC, Home, Hotel, Hospital, Green House and Industrial",
            },
            { name: "Humidity Range", value: "0~100%RH" },
            { name: "Precision", value: "± 0.01 %" },
            { name: "Operating Temperature", value: "-10~50%RH" },
            { name: "Communication Port", value: "Modbus RS485" },
            { name: "Transmission", value: "4-20mA" },
            { name: "Operating Voltage", value: "12-24VDC" },
            { name: "Number of Channel", value: "1 Channel" },
            { name: "Dimension", value: "L:110mm X W:45mm X H:30mm" },
            { name: "Weight", value: "100grams" },
            { name: "IP Rating", value: "IP66" },
            { name: "Country of Origin", value: "Make In India" },
        ],
        applications: [
            "Industrial humidity control",
            "Clean rooms",
            "Storage facilities",
            "Pharmaceutical manufacturing",
            "Textile industry",
        ],
        downloads: [
            {
                name: "HMC24 Installation Manual",
                type: "PDF",
                url: "/downloads/HMC24_manual.pdf",
            },
        ],
        imageUrl: "/controllers/humidity.jpg",
    },
    {
        title: "Temperature Controller",
        modelNumber: "HTC24",
        category: "Controllers",
        description: "Precise temperature control system",
        specifications: [
            { name: "Brand", value: "BRAVE" },
            { name: "Model Number", value: "HTC24" },
            { name: "Measurement Unit", value: "Temperature and Humidity" },
            {
                name: "Usage/Application",
                value: "For HVAC, Home, Hotel, Hospital, Green House and Industrial",
            },
            { name: "Temperature Range", value: "-40-100 °" },
            { name: "Precision", value: "± 0.01 %" },
            { name: "Operating Temperature", value: "-10~50%RH" },
            { name: "Communication Port", value: "Modbus RS485" },
            { name: "Transmission", value: "4-20mA" },
            { name: "Operating Voltage", value: "12-24VDC" },
            { name: "Number of Channel", value: "1 Channel" },
            { name: "Dimension", value: "L:110mm X W:45mm X H:30mm" },
            { name: "Weight", value: "100grams" },
            { name: "IP Rating", value: "IP66" },
            { name: "Country of Origin", value: "Make In India" },
        ],
        applications: [
            "Industrial process control",
            "HVAC systems",
            "Food processing",
            "Laboratory equipment",
            "Manufacturing processes",
        ],
        downloads: [
            {
                name: "HTC24 Installation Manual",
                type: "PDF",
                url: "/downloads/HTC24_manual.pdf",
            },
        ],
        imageUrl: "/controllers/temperature.jpg",
    },
    {
        title: "Water Level Controller",
        modelNumber: "WLC24",
        category: "Controllers",
        description: "Automated water level control system",
        specifications: [
            { name: "Brand", value: "BRAVE" },
            { name: "Model Number", value: "WLC24" },
            { name: "Control Unit", value: "Water Level" },
            {
                name: "Usage/Application",
                value: "For HVAC, Home, Hotel, Hospital, Green House and Industrial",
            },
            { name: "Sensor type", value: "Support SS, Level Switch" },
            { name: "Precision", value: "± 0.01 %" },
            { name: "Operating Temperature", value: "-10~50%RH" },
            { name: "Communication Port", value: "Modbus RS485" },
            { name: "Transmission", value: "4-20mA" },
            { name: "Operating Voltage", value: "12-24VDC" },
            { name: "Number of Channel", value: "1 Channel" },
            { name: "Dimension", value: "L:110mm X W:45mm X H:30mm" },
            { name: "Weight", value: "100grams" },
            { name: "IP Rating", value: "IP66" },
            { name: "Country of Origin", value: "Make In India" },
        ],
        applications: [
            "Water storage tanks",
            "Industrial water management",
            "Building water systems",
            "Irrigation control",
            "Pump control systems",
        ],
        downloads: [
            {
                name: "WLC24 Installation Manual",
                type: "PDF",
                url: "/downloads/WLC24_manual.pdf",
            },
        ],
        imageUrl: "/controllers/water_level.jpg",
    },
    {
        title: "Hot Water Level Controller",
        modelNumber: "HWC24",
        category: "Controllers",
        description: "Specialized controller for hot water systems",
        specifications: [
            { name: "Brand", value: "BRAVE" },
            { name: "Model Number", value: "HWC24" },
            { name: "Control Unit", value: "Water Level" },
            {
                name: "Usage/Application",
                value: "For HVAC, Home, Hotel, Hospital, Green House and Industrial",
            },
            { name: "Sensor type", value: "Support Level Switch" },
            { name: "Precision", value: "± 0.01 %" },
            { name: "Operating Temperature", value: "-10~50%RH" },
            { name: "Communication Port", value: "Modbus RS485" },
            { name: "Transmission", value: "4-20mA" },
            { name: "Operating Voltage", value: "12-24VDC" },
            { name: "Number of Channel", value: "1 Channel" },
            { name: "Dimension", value: "L:110mm X W:45mm X H:30mm" },
            { name: "Weight", value: "100grams" },
            { name: "IP Rating", value: "IP66" },
            { name: "Country of Origin", value: "Make In India" },
        ],
        applications: [
            "Hot water storage systems",
            "Industrial heating processes",
            "Solar water heating",
            "Boiler systems",
            "Heat exchangers",
        ],
        downloads: [
            {
                name: "HWC24 Installation Manual",
                type: "PDF",
                url: "/downloads/HWC24_manual.pdf",
            },
        ],
        imageUrl: "/controllers/hot_water.jpg",
    },
    {
        title: "RTD PT100 Modbus Module MA24",
        modelNumber: "MA24",
        category: "IOT-and-PLC-Modules",
        description: "High-precision RTD temperature measurement module",
        specifications: [
            { name: "Brand", value: "BRAVE" },
            { name: "Model Number", value: "MA24" },
            { name: "RTD Sensor Type", value: "PT100 2Wire and 3Wire" },
            { name: "Temp Range in degree", value: "-200° to 850° Celsius" },
            { name: "Precision", value: "± 0.5-1%" },
            { name: "Operating Temperature", value: "-10~85%RH" },
            { name: "Communication Port", value: "Modbus RS485" },
            { name: "Transmission", value: "4-20mA" },
            { name: "Operating Voltage", value: "12-24VDC" },
            { name: "Number of Channel", value: "1 Channel" },
            { name: "Dimension", value: "L:110mm X W:45mm X H:30mm" },
            { name: "Weight", value: "100grams" },
            { name: "Country of Origin", value: "Make In India" },
        ],
        applications: [
            "Temperature monitoring",
            "Industrial process control",
            "Laboratory equipment",
            "HVAC systems",
            "Food processing",
        ],
        downloads: [
            {
                name: "MA24 Installation Manual",
                type: "PDF",
                url: "/downloads/MA24_manual.pdf",
            },
        ],
        imageUrl: "/iot_plc/rtd_pt100.jpg",
    },
];

async function seedProducts() {
    try {
        // Connect to MongoDB
        console.log(process.env.MONGO_URI);
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log(
            `MongoDB connected: ${connect.connection.host}, ${connect.connection.name}`
        );
        // Delete existing products
        await Product.deleteMany({});
        console.log("Deleted existing products");

        // Insert new products
        await Product.insertMany(products);
        console.log("Successfully seeded products");

        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    } catch (error) {
        console.error("Error seeding products:", error);
        process.exit(1);
    }
}

// Run the seeding function
seedProducts();
