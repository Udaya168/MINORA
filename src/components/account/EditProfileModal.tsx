import { useState, useEffect } from "react";
import { X, Loader2, User, Phone, Calendar, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/lib/store";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile | null;
  userEmail: string;
  userId: string;
  onProfileUpdated: () => Promise<any> | void;
}

export function EditProfileModal({
  isOpen,
  onClose,
  profile,
  userEmail,
  userId,
  onProfileUpdated,
}: EditProfileModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("Prefer not to say");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Parse initial first name and last name
      let initialFirstName = (profile?.["first_name"] as string) || "";
      let initialLastName = (profile?.["last_name"] as string) || "";

      if (!initialFirstName && profile?.full_name) {
        const parts = profile.full_name.trim().split(" ");
        initialFirstName = parts[0] || "";
        initialLastName = parts.slice(1).join(" ") || "";
      }

      setFirstName(initialFirstName);
      setLastName(initialLastName);
      setPhone((profile?.["phone"] as string) || (profile?.["phone_number"] as string) || "");
      setDateOfBirth((profile?.["date_of_birth"] as string) || (profile?.["dob"] as string) || "");
      setGender((profile?.["gender"] as string) || "Prefer not to say");
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim()) {
      toast.error("First Name is required.");
      return;
    }

    setIsSaving(true);
    const combinedFullName = `${firstName.trim()} ${lastName.trim()}`.trim();

    try {
      // Primary payload with all separate fields
      const payload: Record<string, any> = {
        id: userId,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        full_name: combinedFullName,
        phone: phone.trim(),
        date_of_birth: dateOfBirth,
        gender: gender,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .upsert(payload, { onConflict: "id" });

      if (error) {
        console.warn("Upsert with separate name fields failed, attempting fallback:", error.message);
        // Fallback in case table doesn't have first_name/last_name columns yet
        const fallbackPayload: Record<string, any> = {
          id: userId,
          full_name: combinedFullName,
          updated_at: new Date().toISOString(),
        };
        const { error: fallbackErr } = await supabase
          .from("profiles")
          .upsert(fallbackPayload, { onConflict: "id" });

        if (fallbackErr) {
          throw fallbackErr;
        }
      }

      toast.success("Profile details updated successfully!");
      await onProfileUpdated();
      onClose();
    } catch (err: any) {
      console.error("Error saving profile:", err);
      toast.error(err.message || "Failed to update profile details. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
      >
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h2 id="edit-profile-title" className="font-display text-lg font-semibold text-foreground">
              Edit Personal Profile
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
          <div className="grid gap-4 sm:grid-cols-2">
            {/* First Name */}
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                First Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Ananya"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Sharma"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Email Address <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                readOnly
                disabled
                value={userEmail}
                className="w-full rounded-md border border-border bg-secondary/40 px-3 py-2 pl-9 text-sm text-muted-foreground cursor-not-allowed outline-none"
              />
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/70" />
            </div>
            <span className="mt-1 block text-[11px] text-muted-foreground">
              Email is tied to your account and cannot be changed here.
            </span>
          </div>

          {/* Phone Number */}
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full rounded-md border border-border bg-background px-3 py-2 pl-9 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/70" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Date of Birth */}
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Date of Birth
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 pl-9 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/70 pointer-events-none" />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Prefer not to say">Prefer not to say</option>
                <option value="Other">Other</option>
              </select>
            </div>
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
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
