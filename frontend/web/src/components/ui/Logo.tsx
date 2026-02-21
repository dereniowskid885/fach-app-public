export default function Logo() {
  return (
    <div className="flex flex-col items-center gap-4 lg:flex-row">
      <div className="flex rounded-xl bg-gradient-to-br from-chart-2 to-chart-6 px-3 py-2">
        <span className="text-2xl font-black italic tracking-widest text-black">F</span>
        <span className="-ml-[8px] text-2xl font-black italic tracking-widest text-muted-constant">
          A
        </span>
      </div>
    </div>
  );
}
