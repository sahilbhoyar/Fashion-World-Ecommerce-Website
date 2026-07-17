import { addAddress } from "../firebase/addressService";
import { useAuth } from "../context/AuthContext";


const handleDeliverAddress = async () => {


  if(!user){
    alert("Please login first");
    return;
  }


  try {


    await addAddress(
      user.uid,
      addressForm
    );


    alert(
      "Address saved successfully"
    );


    closePopup();


  } catch(error){

    console.log(
      "Address Error:",
      error
    );


    alert(
      "Failed to save address"
    );

  }

};

export default function AddressModal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="text-xl font-semibold">
            Add New Address
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-black"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[80vh] overflow-y-auto p-6">
          {children}
        </div>

      </div>
    </div>
  );
}