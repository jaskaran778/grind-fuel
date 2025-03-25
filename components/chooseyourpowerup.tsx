import Image from "next/image";
import Link from "next/link";

export default function ChooseYourPowerup() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start bg-black py-16 mt-6">
      {/* Header */}
      <div className="container mx-auto px-4 w-full mb-14">
        <div className="flex items-center justify-center w-full">
          <h1 className="text-6xl md:text-7xl tracking-tighter leading-none text-[#16db65] font-heading">
            Choose Your Powerup
          </h1>
        </div>
      </div>

      {/* Cards Container */}
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1 - Hydration Boost */}
        <div className="border-2 border-[#16db65] rounded-xl p-6 flex flex-col items-center hover:bg-[#16db65]/10 transition-all duration-300">
          <div className="overflow-hidden rounded-lg mb-4 w-full">
            <Link href="/products">
              <Image
                width={1000}
                height={1000}
                src="/image (13)-Photoroom.png"
                alt="Hydration Boost"
                className="w-full h-64 object-cover transform hover:scale-110 transition-transform duration-700 cursor-pointer  "
              />
            </Link>
          </div>
          <h2 className="text-2xl text-white font-heading mb-2">
            🥤 Hydration Boost
          </h2>
          <p className="text-gray-300 text-center">
            Premium energy drinks to keep you in the game
          </p>
        </div>

        {/* Card 2 - Game Fuel Snacks */}
        <div className="border-2 border-[#16db65] rounded-xl p-6 flex flex-col items-center hover:bg-[#16db65]/10 transition-all duration-300">
          <div className="overflow-hidden rounded-lg mb-4 w-full">
            <Link href="/products">
              <Image
                width={1000}
                height={1000}
                src="/image (17)-Photoroom.png"
                alt="Game Fuel Snacks"
                className="w-full h-64 object-cover transform hover:scale-110 transition-transform duration-700 cursor-pointer"
              />
            </Link>
          </div>
          <h2 className="text-2xl text-white font-heading mb-2">
            🍪 Game Fuel Snacks
          </h2>
          <p className="text-gray-300 text-center">
            Nutritious snack bites for sustained energy
          </p>
        </div>

        {/* Card 3 - Quick-Boost Gum */}
        <div className="border-2 border-[#16db65] rounded-xl p-6 flex flex-col items-center hover:bg-[#16db65]/10 transition-all duration-300">
          <div className="overflow-hidden rounded-lg mb-4 w-full">
            <Link href="/products">
              <Image
                width={1000}
                height={1000}
                src="/image (26)-Photoroom.png"
                alt="Quick-Boost Gum"
                className="w-full h-64 object-cover transform hover:scale-110 transition-transform duration-700 cursor-pointer"
              />
            </Link>
          </div>
          <h2 className="text-2xl text-white font-heading mb-2">
            🟢 Quick-Boost Gum
          </h2>
          <p className="text-gray-300 text-center">
            Fast-acting chewing gum for instant focus
          </p>
        </div>
      </div>
    </div>
  );
}
