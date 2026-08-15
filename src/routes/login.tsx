import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login or Sign Up — MINORA" },
      { name: "description", content: "Sign in to MINORA to track orders, save addresses and sync your wishlist across devices." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { openLoginModal } = useStore();

  useEffect(() => {
    // Instantly redirect to homepage and trigger the login modal
    navigate({ to: "/", replace: true }).then(() => {
      openLoginModal();
    });
  }, [navigate, openLoginModal]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}