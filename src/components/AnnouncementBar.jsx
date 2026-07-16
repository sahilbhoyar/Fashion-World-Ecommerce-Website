export default function AnnouncementBar() {
  return (
    <div className="bg-brand-950 text-white overflow-hidden whitespace-nowrap">
      <div className="announcement-track py-2">
        <span className="mx-10">
          🚚 FREE Shipping on 2 or more products
        </span>

        <span className="mx-10">
          🎉 New Collection Available
        </span>

        <span className="mx-10">
          💳 Cash on Delivery Available
        </span>

        <span className="mx-10">
          🔄 Easy 7-Day Returns
        </span>

        <span className="mx-10">
          ⭐ Premium Quality Fashion
        </span>

        {/* Duplicate for seamless scrolling */}

        <span className="mx-10">
          🚚 FREE Shipping on 2 or more products
        </span>

        <span className="mx-10">
          🎉 New Collection Available
        </span>

        <span className="mx-10">
          💳 Cash on Delivery Available
        </span>

        <span className="mx-10">
          🔄 Easy 7-Day Returns
        </span>

        <span className="mx-10">
          ⭐ Premium Quality Fashion
        </span>
      </div>
    </div>
  );
}