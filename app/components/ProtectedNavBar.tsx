import Navbar from "./Navbar";

/**
 * ProtectedNavBar
 *
 * Kept for backwards compatibility with existing layouts.
 * It simply renders the unified Navbar, which now handles
 * both logged-in and logged-out states responsively.
 */
export default function ProtectedNavBar() {
  return <Navbar />;
}
