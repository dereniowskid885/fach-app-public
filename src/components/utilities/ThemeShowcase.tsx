import React from 'react';

const ThemeShowcase: React.FC = () => {
  const palette = [
    { name: 'primary', shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] },
    { name: 'secondary', shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] },
    { name: 'accent', shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] },
    { name: 'neutral', shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] },
    { name: 'warning', shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] },
    { name: 'error', shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] },
    { name: 'success', shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] },
    { name: 'info', shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] }
  ];

  const ColorSection = ({ name, shades }: { name: string; shades: number[] }) => {
    return (
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold capitalize">{name} Color Palette</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {shades.map(shade => {
            // Determine text color based on shade
            const textColorClass =
              shade <= 300 ? 'text-black' : shade >= 600 ? 'text-white' : 'text-black';

            return (
              <div
                key={shade}
                className={`flex flex-col rounded-lg p-4 shadow-md bg-${name}-${shade} ${textColorClass}`}
              >
                <span className="font-semibold">
                  {name} {shade}
                </span>
                <span className="text-sm opacity-75">
                  bg-{name}-{shade}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-8 text-center text-3xl font-bold">Color Palette Showcase</h1>
      {palette.map(item => (
        <ColorSection key={item.name} name={item.name} shades={item.shades} />
      ))}
    </div>
  );
};

export default ThemeShowcase;
