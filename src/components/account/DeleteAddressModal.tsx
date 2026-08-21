import { useState } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { AddressData } from "./AddressFormModal";

interface DeleteAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  addressToDelete: AddressData | null;
  allAddresses: AddressData[];
  userId: string;
  onDeleted: () => Promise<any> | void;
}

export function DeleteAddressModal({
  isOpen,
  onClose,
  addressToDelete,
  allAddresses,
  userId,
  onDeleted,
}: DeleteAddressModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !addressToDelete) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // 1. Delete address
      const { error } = await supabase
        .from("addresses")
        .delete()
        .eq("id", addressToDelete.id)
        .eq("user_id", userId);

      if (error) throw error;

      // 2. If it was the default address, check if remaining addresses exist
      if (addressToDelete.is_default) {
        const remaining = allAddresses.filter((a) => a.id !== addressToDelete.id);
        if (remaining.length > 0) {
          const newDefault = remaining[0];
          if (newDefault && newDefault.id) {
            await supabase
              .from("addresses")
              .update({ is_default: true, updated_at: new Date().toISOString() })
              .eq("id", newDefault.id)
              .eq("user_id", userId);
          }
        }
      }

      toast.success("Address deleted successfully.");
      await onDeleted();
      onClose();
    } catch (err: any) {
      console.error("Error deleting address:", err);
      toast.error(err.message || "Failed to delete address.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-address-title"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors disabled:opacity-50"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 text-destructive">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h2 id="delete-address-title" className="font-display text-base font-semibold text-foreground">
              Delete Address
            </h2>
            <p className="text-xs text-muted-foreground">This action cannot be undone.</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Are you sure you want to delete the delivery address saved as{" "}
          <strong className="text-foreground">{addressToDelete.label} ({addressToDelete.full_name})</strong>?
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 rounded-lg bg-destructive px-5 py-2 text-xs font-bold uppercase tracking-wider text-destructive-foreground hover:bg-destructive/90 transition-all disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Address"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
