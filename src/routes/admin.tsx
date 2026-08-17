import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";
import { AdminPortal } from "@/components/admin/AdminPortal";
import { Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminRouteComponent,
});

function AdminRouteComponent() {
  const { isLoggedIn, profile, fetchProfile, session, loadingAuth } = useStore();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function checkAdminAccess() {
      if (loadingAuth) return; // Wait for initial session restore to complete

      const { data: { session: currentSession } } = await supabase.auth.getSession();
      const userId = currentSession?.user?.id || session?.user?.id;

      console.log("[Auth] User ID:", userId || "No session");

      if (!userId) {
        console.log("[Auth] Redirect: /login");
        if (isMounted) {
          toast.error("Please sign in to access the Admin Portal.");
          navigate({ to: "/login" });
        }
        return;
      }

      // Query profiles directly from Supabase using authenticated session
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("id, full_name, role")
        .eq("id", userId)
        .maybeSingle();

      const userRole = userProfile?.role || profile?.role || null;
      console.log("[Auth] Profile role:", userRole);

      if (userRole === "admin") {
        console.log("[Auth] Redirect: /admin");
        if (isMounted) setChecking(false);
      } else {
        console.log("[Auth] Redirect: /");
        if (isMounted) {
          toast.error("Access denied: You do not have administrator privileges.");
          navigate({ to: "/" });
        }
      }
    }

    checkAdminAccess();

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn, session, profile, loadingAuth, fetchProfile, navigate]);

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-3">
        <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          <Loader2 size={24} className="animate-spin" />
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Verifying Administrator Privileges...
        </p>
      </div>
    );
  }

  return <AdminPortal />;
}
