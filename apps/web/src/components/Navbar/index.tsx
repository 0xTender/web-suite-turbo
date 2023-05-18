const loggedIn = true;
export default function Navbar() {
  return (
    <nav className="w-full border-b bg-white px-8 py-6 pl-12 md:pl-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-between">
          <div className="flex space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-black">
                Complaints Registry
              </h1>
            </div>
          </div>
          <div className="flex space-x-8">
            {loggedIn ? (
              <>
                <div className="cursor-pointer select-none text-2xl font-bold text-black hover:text-blue-500">
                  Logout
                </div>
              </>
            ) : (
              <div className="cursor-pointer select-none text-2xl font-bold text-black hover:text-blue-500">
                Login
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
