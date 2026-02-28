export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white py-8">
      <div className="mx-auto max-w-4xl px-6 text-center text-sm text-muted">
        &copy; {new Date().getFullYear()} Jeryl. All rights reserved.
      </div>
    </footer>
  );
}
