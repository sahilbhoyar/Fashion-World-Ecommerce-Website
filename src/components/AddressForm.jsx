import { useState } from "react";
import { useAddress } from "../context/AddressContext";

export default function AddressForm({ onClose }) {
  const { saveAddress } = useAddress();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    house: "",
    area: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    addressType: "Home",
    isDefault: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await saveAddress(formData);

    alert("Address saved successfully!");

    onClose();
  };

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-semibold">
        Add New Address
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <input
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
          required
        />

        <input
          name="phone"
          placeholder="Mobile Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
          required
        />

        <input
          name="house"
          placeholder="House No / Flat / Building"
          value={formData.house}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
          required
        />

        <input
          name="area"
          placeholder="Area / Street"
          value={formData.area}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
          required
        />

        <input
          name="landmark"
          placeholder="Landmark"
          value={formData.landmark}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="rounded-lg border p-3"
            required
          />

          <input
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            className="rounded-lg border p-3"
            required
          />
        </div>

        <input
          name="pincode"
          placeholder="Pincode"
          value={formData.pincode}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
          required
        />

        <select
          name="addressType"
          value={formData.addressType}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
        >
          <option>Home</option>
          <option>Office</option>
          <option>Other</option>
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleChange}
          />
          Set as Default Address
        </label>

        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            className="rounded-lg bg-brand-950 px-6 py-3 text-white"
          >
            Save Address
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-6 py-3"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}