export default function Footer() {
  return (
    <footer className="bg-black text-white py-24 px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10">

        <div>
          <h2 className="text-4xl tracking-[8px] font-light mb-4">
            STUDIO
          </h2>

          <p className="text-gray-400 max-w-sm">
            We create contemporary architecture with a timeless vision,
            balancing simplicity, light and material.
          </p>
        </div>

        <div className="space-y-2">
          <p>hello@studio.com</p>
          <p>+20 100 000 0000</p>
          <p>Cairo, Egypt</p>
        </div>

      </div>

      <div className="border-t border-white/10 mt-16 pt-8 text-sm text-gray-500">
        © 2026 Studio. All rights reserved.
      </div>
    </footer>
  );
}