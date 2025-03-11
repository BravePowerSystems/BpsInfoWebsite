import React from "react";
import { Link } from "react-router-dom";
import "../scss/components/ProductsDropDown.scss";
function ProductsDropDown({ onHoverStart, onHoverEnd }) {
    return (
        <div
            class="ProductsDropDown"
            onMouseEnter={onHoverStart}
            onMouseLeave={onHoverEnd}
        >
            <ul class="transmitter">
                <Link to="/Products/Transmitters">Transmitters</Link>
                <li>
                    <Link to="/Products/Transmitters/gasFlowPulseTransmitter">
                        Gas Flow Pulse Transmitter
                    </Link>
                </li>
                <li>
                    <Link to="/Products/Transmitters/gasLeakTransmitter">
                        Gas Leak Transmitter
                    </Link>
                </li>
                <li>
                    <Link to="/Products/Transmitters/waterFlowTransmitter">
                        Water Flow Transmitter
                    </Link>
                </li>
                <li>
                    <Link to="/Products/Transmitters/CO2Transmitter">
                        CO2 Transmitter
                    </Link>
                </li>
                <li>
                    <Link to="/Products/Transmitters/waterPH">Water PH</Link>
                </li>
                <li>
                    <Link to="/Products/Transmitters/IR_HVAC">IR HVAC</Link>
                </li>
                <li>
                    <Link to="/Products/Transmitters/humidityAndTemperature">
                        Humidity and Temperature
                    </Link>
                </li>
                <li>
                    <Link to="/Products/Transmitters/waterLevelTransmitter">
                        Water Level Transmitter
                    </Link>
                </li>
                <li>
                    <Link to="/Products/Transmitters/fuelLevelTransmitter">
                        Fuel Level Transmitter
                    </Link>
                </li>
                <li>
                    <Link to="/Products/Transmitters/soilAndMoistureTransmitter">
                        Soil and Moisture Transmitter
                    </Link>
                </li>
                <li>
                    <Link to="/Products/Transmitters/TDS_Transmitter">
                        TDS Transmitter
                    </Link>
                </li>
            </ul>
            <ul class="powerMonitor">
                <Link to="/Products/powerMonitors">Power Monitors</Link>
                <li>
                    <Link to="/Products/powerMonitors/IOTEnergyMeter">
                        IOT Energy Meter
                    </Link>
                </li>
                <li>
                    <Link to="/Products/powerMonitors/DCEnergyMeter">
                        DC Energy Meter
                    </Link>
                </li>
                <li>
                    <Link to="/Products/powerMonitors/ACEnergyMeter">
                        AC Energy Meter
                    </Link>
                </li>
                <li>
                    <Link to="/Products/powerMonitors/InverterMonitor">
                        Inverter Monitor
                    </Link>
                </li>
                <li>
                    <Link to="/Products/powerMonitors/UPSMonitor">
                        UPS Monitor
                    </Link>
                </li>
                <li>
                    <Link to="/Products/powerMonitors/BatteryMonitor">
                        Battery Monitor
                    </Link>
                </li>
                <li>
                    <Link to="/Products/powerMonitors/IrrigationPump">
                        Irrigation Pump
                    </Link>
                </li>
            </ul>
            <ul class="controllers">
                <Link to="/Products/Controllers">Controllers</Link>
                <li>
                    <Link to="/Products/Controllers/ServoVoltageStabilizer">
                        Servo Voltage Stabilizer
                    </Link>
                </li>
                <li>
                    <Link to="/Products/Controllers/TemperatureController">
                        Temperature Controller
                    </Link>
                </li>
                <li>
                    <Link to="/Products/Controllers/HumidityController">
                        Humidity Controller
                    </Link>
                </li>
                <li>
                    <Link to="/Products/Controllers/AMFController">
                        AMF Controller
                    </Link>
                </li>
            </ul>
            <ul class="modules">
                <Link to="/Products/Modules/IOTAndPLCModule">
                    IOT and PLC Module
                </Link>

                <li>
                    <Link to="/Products/Modules/PT100AndPT100RTD">
                        PT100 & PT100 RTD
                    </Link>
                </li>
                <li>
                    <Link to="/Products/Modules/Thermocouple">
                        Thermocouple
                    </Link>
                </li>
                <li>
                    <Link to="/Products/Modules/IORelayModule">
                        IO Relay Module
                    </Link>
                </li>
                <li>
                    <Link to="/Products/Modules/EVCharger">EV Charger</Link>
                </li>
                <li>
                    <Link to="/Products/Modules/ACDimmer">AC Dimmer</Link>
                </li>
                <li>
                    <Link to="/Products/Modules/IrrigationPump">
                        Irrigation Pump
                    </Link>
                </li>
                <li>
                    <Link to="/Products/Modules/PumpController">
                        Pump Controller
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export default ProductsDropDown;
