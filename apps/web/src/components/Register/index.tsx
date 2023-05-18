import CreateProfile from "./CreateProfile";
import { useEffect, useState } from "react";
import { Contract } from "ethers";
import { Roles } from "@root/core";
import { ComplaintRegistry } from "@root/core/typechain-types";
import { api } from "@app/utils/api";
import { useSigner } from "wagmi";
import { useAuth } from "@app/hooks/useAuth";
import { ViewProfile } from "./ViewProfile";

export default function Register() {
  const { role, address, fetchJwt, registry_data } = useAuth();

  const [allowedToFetch, setAllowedToFetch] = useState(true);

  const { data: signer } = useSigner({});

  const [showProcessing, setShowProcessing] = useState(false);

  const { data } = api.user.getProfile.useQuery(address, {
    enabled: role !== undefined && allowedToFetch,
  });

  useEffect(() => {
    if (data && signer && registry_data) {
      // check if indexer updated the role
      const Registry = new Contract(
        registry_data.address,
        registry_data.abi,
        signer
      ) as ComplaintRegistry;

      const run = async () => {
        const address = await signer.getAddress();
        const role = await Registry.roles(address);
        if (data.verified) {
          return;
        }
        if (role !== Roles.None && data.verified === false) {
          alert("Wait for indexer");
        } else {
          setShowProcessing(true);
          setAllowedToFetch(false);
          const tx = await Registry.create_profile({
            user_hash: data.id.toString(),
          });
          await tx.wait();
          setAllowedToFetch(true);
        }
      };

      fetchJwt();

      void run();
    }
  }, [data, signer]);
  return (
    <div className="@container my-4 flex min-w-[600px] flex-col gap-4">
      <h1 className="text-center text-4xl font-bold">{"Profile"}</h1>
      <p className="text-center">
        {!data || role === Roles.None
          ? "Create a profile to lodge complaints."
          : "Profile created. You can now lodge complaints"}
      </p>
      {!data || role === Roles.None ? (
        showProcessing ? (
          <>Awaiting Transaction</>
        ) : (
          <CreateProfile />
        )
      ) : (
        <ViewProfile user={data} />
      )}
    </div>
  );
}
