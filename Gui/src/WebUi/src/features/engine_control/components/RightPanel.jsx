// src/features/dashboard/components/RightPanel.jsx
import React from "react";

export default function RightPanel({ connected, EngineFields }) {
  const {
    N2OTank = null,
    ETHTank = null,
    N2OPropellant = null,
    ETHPropellant =  null,
    N2OInjector = null,
    ETHInjector = null,
    N2OInjectorTemp = null,
    ETHInjectorTemp = null,
    Pressure = null,
    Temperature = null,
    M1Temp = null,
    M2Temp = null,
    M1Curr = null,
    M2Curr = null,
    M1Pos = null,
    M2Pos = null,
    N2ODen = null,
    ETHDen = null,
    N20FF = null,
    ETHFF = null,

  } = EngineFields || {};

  return (
    <aside className="flex-none w-1/4 bg-white dark:bg-gray-800
                      border-l border-gray-300 dark:border-gray-600
                      p-3 flex flex-col gap-4 overflow-y-auto">
      {/* Connection */}
      <div className="flex justify-between text-sm text-gray-800 dark:text-gray-200">
        <span className="font-medium">Connection:</span>
        <span className={connected ? "text-green-600" : "text-red-600"}>
          {connected ? "Connected" : "Disconnected"}
        </span>
      </div>

      {/*Pressure Tank N2O/ETH*/}
      <div className="flex justify-between text-sm text-gray-800 dark:text-gray-200">
        <span className="font-medium">Pressure Tank N2O/ETH:</span>
        <span>
         {N2OTank != null ? `${N2OTank.toFixed(2)} bar` : "-"} /{" "}
         {ETHTank != null ? `${ETHTank.toFixed(2)} bar` : "-"}
        </span>
      </div>

      {/*Temperature Propellant N2O/ETH*/}
      <div className="flex justify-between text-sm text-gray-800 dark:text-gray-200">
        <span className="font-medium">Temperature Propellant N2O/ETH:</span>
        <span>
         {N2OPropellant != null ? `${N2OPropellant.toFixed(2)} °C` : "-"} /{" "}
         {ETHPropellant != null ? `${ETHPropellant.toFixed(2)} °C` : "-"}
        </span>
      </div>

      {/*Pressure Injector N2O/ETH*/}
      <div className="flex justify-between text-sm text-gray-800 dark:text-gray-200">
        <span className="font-medium">Pressure Injector N2O/ETH:</span>
        <span>
         {N2OInjector != null ? `${N2OInjector.toFixed(2)} bar` : "-"} /{" "}
         {ETHInjector != null ? `${ETHInjector.toFixed(2)} bar` : "-"}
        </span>
      </div>

      {/*Temperature Injector N2O/ETH*/}
      <div className="flex justify-between text-sm text-gray-800 dark:text-gray-200">
        <span className="font-medium">Temperature Injector N2O/ETH:</span>
        <span>
         {N2OInjectorTemp != null ? `${N2OInjectorTemp.toFixed(2)} °C` : "-"} /{" "}
         {ETHInjectorTemp != null ? `${ETHInjectorTemp.toFixed(2)} °C` : "-"}
        </span>
      </div>
      {/*CC Temp/Pressure*/}
      <div className="flex justify-between text-sm text-gray-800 dark:text-gray-200">
        <span className="font-medium">CC Temp/Pressure:</span>
        <span>
         {Temperature != null ? `${Temperature.toFixed(2)} °C` : "-"} /{" "}
         {Pressure != null ? `${Pressure.toFixed(2)} bar` : "-"}
        </span>
      </div>
      {/*Servomotor Temp N2O/ETH*/}
      <div className="flex justify-between text-sm text-gray-800 dark:text-gray-200">
        <span className="font-medium">Servomotor Temp M1/M2:</span>
        <span>
         {M1Temp != null ? `${M1Temp.toFixed(2)} °C` : "-"} /{" "}
         {M2Temp != null ? `${M2Temp.toFixed(2)} °C` : "-"}
        </span>
      </div>
      {/*Servomotor Current N2O/ETH*/}
      <div className="flex justify-between text-sm text-gray-800 dark:text-gray-200">
        <span className="font-medium">Curr M1/M2:</span>
        <span>
         {M1Curr != null ? `${M1Curr.toFixed(2)} A` : "-"} /{" "}
         {M2Curr != null ? `${M2Curr.toFixed(2)} A` : "-"}
        </span>
      </div>
      {/*Valve Pos*/}
      <div className="flex justify-between text-sm text-gray-800 dark:text-gray-200">
        <span className="font-medium">Pos M1/M2:</span>
        <span>
         {M1Pos != null ? `${M1Pos.toFixed(2)} %` : "-"} /{" "}
         {M2Pos != null ? `${M2.toFixed(2)} %` : "-"}
        </span>
      </div>
      {/*Propellant Density*/}
      <div className="flex justify-between text-sm text-gray-800 dark:text-gray-200">
        <span className="font-medium">Propellant Density N2O/ETH:</span>
        <span>
         {N2ODen != null ? `${N2ODen.toFixed(2)} kg/m^3` : "-"} /{" "}
        </span>
      </div>  
    </aside>
  );
}
