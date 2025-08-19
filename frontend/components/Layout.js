import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900 dark:bg-neutral-900 dark:text-neutral-100">
      <aside className="w-64 border-r border-gray-200 dark:border-neutral-800 p-4 space-y-2">
        <h1 className="text-xl font-semibold">Mari ERP</h1>
        <nav className="mt-4 flex flex-col gap-2">
          <Link href="/">Inventory</Link>
          <Link href="/pos">POS</Link>
          <Link href="/customers">Customers</Link>
          <Link href="/crm">CRM</Link>
          <Link href="/suppliers">Suppliers</Link>
          <Link href="/purchase-orders">Purchase Orders</Link>
          <Link href="/settings">Settings</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
