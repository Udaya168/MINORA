import { useState, useEffect } from "react";
import { X, Loader2, MapPin, Building, Phone, User, CheckSquare, Square } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface AddressData {
  id?: string;
  user_id?: string;
  label: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string | null;
  landmark?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  addressToEdit?: AddressData | null;
  userId: string;
  onSaved: () => Promise<any> | void;
}

export function AddressFormModal({
  isOpen,
  onClose,
  addressToEdit,
  userId,
  onSaved,
}: AddressFormModalProps) {
  const [label, setLabel] = useState("Home");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [house, setHouse] = useState("");
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India");
  const [isDefault, setIsDefault] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (addressToEdit) {
        setLabel(addressToEdit.label || "Home");
        setFullName(addressToEdit.full_name || "");
        setPhone(addressToEdit.phone || "");
        setHouse(addressToEdit.address_line1 || "");
        setStreet(addressToEdit.address_line2 || "");
        setLandmark(addressToEdit.landmark || "");
        setCity(addressToEdit.city || "");
        setState(addressToEdit.state || "");
        setPostalCode(addressToEdit.postal_code || "");
        setCountry(addressToEdit.country || "India");
        setIsDefault(!!addressToEdit.is_default);
      } else {
        setLabel("Home");
        setFullName("");
        setPhone("");
        setHouse("");
        setStreet("");
        setLandmark("");
        setCity("");
        setState("");
        setPostalCode("");
        setCountry("India");
        setIsDefault(false);
      }
    }
  }, [isOpen, addressToEdit]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim() || !house.trim() || !street.trim() || !city.trim() || !state.trim() || !postalCode.trim() || !country.trim()) {
      toast.error("Please fill in all required fields marked with *.");
      return;
    }

    setIsSaving(true);

    try {
      // If marking as default, unset previous defaults for this user
      if (isDefault) {
        await supabase
          .from("addresses")
          .update({ is_default: false, updated_at: new Date().toISOString() })
          .eq("user_id", userId);
      }

      const addressPayload = {
        user_id: userId,
        label: label.trim() || "Home",
        full_name: fullName.trim(),
        phone: phone.trim(),
        address_line1: house.trim(),
        address_line2: street.trim(),
        landmark: landmark.trim() || null,
        city: city.trim(),
        state: state.trim(),
        postal_code: postalCode.trim(),
        country: country.trim() || "India",
        is_default: isDefault,
        updated_at: new Date().toISOString(),
      };

      if (addressToEdit?.id) {
        const { error } = await supabase
          .from("addresses")
          .update(addressPayload)
          .eq("id", addressToEdit.id)
          .eq("user_id", userId);

        if (error) throw error;
        toast.success("Address updated successfully!");
      } else {
        const { error } = await supabase
          .from("addresses")
          .insert({
            ...addressPayload,
            created_at: new Date().toISOString(),
          });

        if (error) throw error;
        toast.success("New address added successfully!");
      }

      await onSaved();
      onClose();
    } catch (err: any) {
      console.error("Error saving address:", err);
      toast.error(err.message || "Failed to save address. Please verify your details.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="address-form-title"
      >
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 id="address-form-title" className="font-display text-lg font-semibold text-foreground">
              {addressToEdit ? "Edit Delivery Address" : "Add New Delivery Address"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Label selector */}
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Address Tag / Label
            </label>
            <div className="flex gap-2">
              {["Home", "Work", "Other"].map((lbl) => (
                <button
                  key={lbl}
                  type="button"
                  onClick={() => setLabel(lbl)}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all border ${
                    label === lbl
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-background text-muted-foreground border-border hover:bg-secondary"
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Full Name */}
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Full Name <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 pl-9 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/70" />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Phone Number <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 pl-9 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/70" />
              </div>
            </div>
          </div>

          {/* House / Flat / Building */}
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              House / Flat / Building No. <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={house}
                onChange={(e) => setHouse(e.target.value)}
                placeholder="Flat 402, Sunrise Towers"
                className="w-full rounded-md border border-border bg-background px-3 py-2 pl-9 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
              <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/70" />
            </div>
          </div>

          {/* Street / Area */}
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Street / Area / Locality <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="SV Road, Bandra West"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          {/* Landmark */}
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Landmark (Optional)
            </label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="Near HDFC Bank"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* City */}
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                City <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Mumbai"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            {/* State */}
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                State <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Maharashtra"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            {/* Postal / PIN Code */}
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                PIN Code <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="400050"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>

          {/* Country */}
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Country <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          {/* Set as Default Address checkbox */}
          <div className="pt-2">
            <label
              className="inline-flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer select-none"
              onClick={() => setIsDefault(!isDefault)}
            >
              {isDefault ? (
                <CheckSquare className="h-4 w-4 text-primary" />
              ) : (
                <Square className="h-4 w-4 text-muted-foreground" />
              )}
              Set as Default Address
            </label>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/95 transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : addressToEdit ? (
                "Update Address"
              ) : (
                "Save Address"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
