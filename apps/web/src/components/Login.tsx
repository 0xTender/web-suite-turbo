import { useRouter } from "next/router";
import { useEffect } from "react";

const address = "some-address";

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    if (address) {
      void router.push("/");
    }
  }, [address]);

  return (
    <div className="grid h-full w-full place-items-center">
      <div className="flex flex-col items-center gap-2 rounded-lg border p-8">
        <h1 className="text-4xl font-bold">Welcome Back!</h1>
        <p className="mb-3 text-center text-gray-500">
          Please login via wallet.
        </p>
        <form className="w-full max-w-sm">
          <div className="-mx-3 flex flex-wrap">
            <div className="w-full px-3">
              <button
                className="focus:shadow-outline w-full rounded-full bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
                type="button"
                onClick={() => {}}
              >
                Log In
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
