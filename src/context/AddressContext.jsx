import { createContext, useContext, useReducer, useEffect } from "react";
import { useAuth } from "./AuthContext";

import {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} from "../services/addressService";

const AddressContext = createContext(null);

const addressReducer = (state, action) => {
  switch (action.type) {
    case "LOAD_ADDRESSES":
      return {
        ...state,
        addresses: action.payload,
      };

    case "ADD_ADDRESS":
      return {
        ...state,
        addresses: [...state.addresses, action.payload],
      };

    case "UPDATE_ADDRESS":
      return {
        ...state,
        addresses: state.addresses.map((address) =>
          address.id === action.payload.id
            ? action.payload
            : address
        ),
      };

    case "DELETE_ADDRESS":
      return {
        ...state,
        addresses: state.addresses.filter(
          (address) => address.id !== action.payload
        ),
      };

    case "CLEAR_ADDRESSES":
      return {
        ...state,
        addresses: [],
      };

    default:
      return state;
  }
};

export function AddressProvider({ children }) {
  const { user } = useAuth();

  const [state, dispatch] = useReducer(addressReducer, {
    addresses: [],
  });

  // Load addresses after login
  useEffect(() => {
    const loadAddresses = async () => {
      if (!user?.uid) {
        dispatch({ type: "CLEAR_ADDRESSES" });
        return;
      }

      try {
        const addresses = await getAddresses(user.uid);

        dispatch({
          type: "LOAD_ADDRESSES",
          payload: addresses,
        });
      } catch (error) {
        console.error("Error loading addresses:", error);
      }
    };

    loadAddresses();
  }, [user?.uid]);

  // Add Address
  const saveAddress = async (address) => {
    if (!user?.uid) return null;

    await addAddress(user.uid, address);

    const updatedAddresses = await getAddresses(user.uid);

    dispatch({
      type: "LOAD_ADDRESSES",
      payload: updatedAddresses,
    });

    return updatedAddresses[updatedAddresses.length - 1];
  };


  // Update Address
  const editAddress = async (addressId, updatedData) => {
    if (!user?.uid) return;

    await updateAddress(user.uid, addressId, updatedData);

    const updatedAddresses = await getAddresses(user.uid);

    dispatch({
      type: "LOAD_ADDRESSES",
      payload: updatedAddresses,
    });
  };

  // Delete Address
  const removeAddress = async (addressId) => {
    if (!user?.uid) return;

    await deleteAddress(user.uid, addressId);

    dispatch({
      type: "DELETE_ADDRESS",
      payload: addressId,
    });
  };

  return (
    <AddressContext.Provider
      value={{
        addresses: state.addresses,
        saveAddress,
        editAddress,
        removeAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
}

export function useAddress() {
  const context = useContext(AddressContext);

  if (!context) {
    throw new Error("useAddress must be used inside AddressProvider");
  }

  return context;
}