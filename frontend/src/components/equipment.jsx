import React from "react";

const equipment = () => {
  const Equipments = [
    "Tractor",
    "Plough",
    "Cultivator",
    "Rotavator",
    "Seeder",
    "Harvester",
    "Sprayer",
    "Trolley",
    "Water Pump",
    "Power Weeder",
    "Thresher",
    "Baler",
    "Reaper",
    "Land Leveler",
    "Sub Soiler",
    "Fertilizer Spreader",
    "Boom Sprayer",
    "Disc Harrow",
    "Hole Digger",
    "Paddy Transplanter",
    "Post Hole Digger",
    "Shredder",
    "Mulcher",
    "Laser Land Leveler",
    "Combine Harvester",
    "Manure Spreader",
    "Seed Drill",
    "Mini Tractor",
    "Dumper",
    "Fodder Cutter",
    "Grain Cleaner",
    "Chaff Cutter"
  ];

  return (
    <header className="w-full bg-green-700 text-white py-4 shadow-lg overflow-x-auto">
      <div className="container mx-auto flex items-center justify-between px-4">

        {/* Logo */}
        <h1 className="text-2xl font-bold whitespace-nowrap">
          Farming Equipments
        </h1>

        {/* Equipment List */}
        <nav className="ml-6">
          <ul className="flex gap-6 text-lg font-medium whitespace-nowrap">
            {Equipments.map((item, index) => (
              <li key={index} className="hover:text-yellow-300 cursor-pointer">
                {item}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default equipment;
