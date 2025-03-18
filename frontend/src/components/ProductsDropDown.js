import React from "react";
import { Link } from "react-router-dom";
import "../scss/components/ProductsDropDown.scss";
function ProductsDropDown() {
    return (
        <div
            class="ProductsDropDown"
        >
            <ul class="transmitter">
                <Link to="/Products/Transmitters">Transmitters</Link>
                <li>
                    <Link to="/Products/Transmitters/Gas-Flow-Pulse-Transmitter">
                        Gas Flow Pulse Transmitter
                    </Link>
                </li>
                <li>
                    <Link to="/Products/Transmitters/Gas-Leak-Transmitter">
                        Gas Leak Transmitter
                    </Link>
                </li>
                <li>
                    <Link to="/Products/Transmitters/Water-Flow-Transmitter">
                        Water Flow Transmitter
                    </Link>
                </li>
                <li>
                    <Link to="/Products/Transmitters/CO2-Transmitter">
                        CO2 Transmitter
                    </Link>
                </li>
                <li>
                    <Link to="/Products/Transmitters/Water-PH">Water PH</Link>
                </li>
                <li>
                    <Link to="/Products/Transmitters/IR-HVAC">IR HVAC</Link>
                </li>
                <li>
                    <Link to="/Products/Transmitters/Humidity-And-Temperature">
                        Humidity and Temperature
                    </Link>
                </li>
                <li>
                    <Link to="/Products/Transmitters/water-Level-Transmitter">
                        Water Level Transmitter
                    </Link>
                </li>
                <li>
                    <Link to="/Products/Transmitters/fuel-Level-Transmitter">
                        Fuel Level Transmitter
                    </Link>
                </li>
                <li>
                    <Link to="/Products/Transmitters/Soil-and-Moisture-Transmitter">
                        Soil and Moisture Transmitter
                    </Link>
                </li>
                <li>
                    <Link to="/Products/Transmitters/TDS-Transmitter">
                        TDS Transmitter
                    </Link>
                </li>
            </ul>
            <ul class="powerMonitor">
                <Link to="/Products/Power-Monitors">Power Monitors</Link>
                <li>
                    <Link to="/Products/Power-Monitors/IOT-Energy-Meter">
                        IOT Energy Meter
                    </Link>
                </li>
                <li>
                    <Link to="/Products/Power-Monitors/DC-Energy-Meter">
                        DC Energy Meter
                    </Link>
                </li>
                <li>
                    <Link to="/Products/Power-Monitors/AC-Energy-Meter">
                        AC Energy Meter
                    </Link>
                </li>
                <li>
                    <Link to="/Products/Power-Monitors/Inverter-Monitor">
                        Inverter Monitor
                    </Link>
                </li>
                <li>
                    <Link to="/Products/Power-Monitors/UPS-Monitor">
                        UPS Monitor
                    </Link>
                </li>
                <li>
                    <Link to="/Products/Power-Monitors/Battery-Monitor">
                        Battery Monitor
                    </Link>
                </li>
                <li>
                    <Link to="/Products/Power-Monitors/Irrigation-Pump">
                        Irrigation Pump
                    </Link>
                </li>
            </ul>
            <ul class="controllers">
                <Link to="/Products/Controllers">Controllers</Link>
                <li>
                    <Link to="/Products/Controllers/Servo-Voltage-Stabilizer">
                        Servo Voltage Stabilizer
                    </Link>
                </li>
                <li>
                    <Link to="/Products/Controllers/Temperature-Controller">
                        Temperature Controller
                    </Link>
                </li>
                <li>
                    <Link to="/Products/Controllers/Humidity-Controller">
                        Humidity Controller
                    </Link>
                </li>
                <li>
                    <Link to="/Products/Controllers/AMF-Controller">
                        AMF Controller
                    </Link>
                </li>
            </ul>
            <ul class="modules">
                <Link to="/Products/IOT-and-PLC-Modules">
                    IOT and PLC Module
                </Link>

                <li>
                    <Link to="/Products/IOT-and-PLC-Modules/PT100-and-PT100-RTD">
                        PT100 and PT100 RTD
                    </Link>
                </li>
                <li>
                    <Link to="/Products/IOT-and-PLC-Modules/Thermocouple">
                        Thermocouple
                    </Link>
                </li>
                <li>
                    <Link to="/Products/IOT-and-PLC-Modules/IO-Relay-Module">
                        IO Relay Module
                    </Link>
                </li>
                <li>
                    <Link to="/Products/IOT-and-PLC-Modules/EV-Charger">EV Charger</Link>
                </li>
                <li>
                    <Link to="/Products/IOT-and-PLC-Modules/AC-Dimmer">AC Dimmer</Link>
                </li>
                <li>
                    <Link to="/Products/IOT-and-PLC-Modules/Irrigation-Pump">
                        Irrigation Pump
                    </Link>
                </li>
                <li>
                    <Link to="/Products/IOT-and-PLC-Modules/Pump-Controller">
                        Pump Controller
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export default ProductsDropDown;
