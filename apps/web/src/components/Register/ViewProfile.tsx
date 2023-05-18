import { FCC } from "@app/utils/types";
import { User } from "@prisma/client";
import Input from "@app/components/common/Input";
import Button from "@app/components/common/Button";
import { complaint_schema } from "@app/utils/zod";
import { z } from "zod";
import { ChangeEvent, useState } from "react";
import { api } from "@app/utils/api";
import { useSigner } from "wagmi";
import { useAuth } from "@app/hooks/useAuth";
import { Contract } from "ethers";
import { ComplaintRegistry } from "@root/core/typechain-types";

type FormState = z.infer<typeof complaint_schema>;

const formDetails = [
  {
    name: "title",
    label: "Title",
    placeholder: "Enter Title",
  },
  {
    name: "description",
    label: "Description",
    placeholder: "Enter Description",
  },
  {
    name: "affected",
    label: "Affected",
    placeholder: "Enter Affected",
  },
  {
    name: "concerned_department",
    label: "Concerned Department",
    placeholder: "Enter Concerned Department",
  },
  {
    name: "source_of_complaint",
    label: "Source of Complaint",
    placeholder: "Enter Source of Complaint",
  },
];

export const ViewProfile: FCC<{ user: User }> = ({ user }) => {
  const { data: signer } = useSigner();

  const { registry_data } = useAuth();
  const [formState, setFormState] = useState<FormState>({
    title: "",
    description: "",
  });

  const { isError, isLoading, error, mutateAsync } =
    api.complaint.store_file.useMutation({});
  const handleSubmit = async () => {
    try {
      if (window.ethereum && signer && registry_data) {
        const hash = await mutateAsync({
          complaint: formState,
        });

        const Registry = new Contract(
          registry_data.address,
          registry_data.abi,
          signer
        ) as ComplaintRegistry;

        const run = async () => {
          const tx = await Registry.register_complaint(hash);
          await tx.wait();
          alert("Complaint Registered");
        };

        run();
      }
    } catch (err) {
      console.error(err);
    }
  };

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  return (
    <>
      <div className="@container my-4 gap-8 rounded-lg border p-8">
        <h1 className="text-md">UserId: {user.id}</h1>
        <h1 className="text-md">First: {user.first_name}</h1>
        <h1 className="text-md">Last: {user.last_name}</h1>
        <h1 className="text-md">Email: {user.email}</h1>
        <h1 className="text-md">Phone Number: {user.phone_number}</h1>
        <h1 className="text-md ">Wallet: {user.wallet_address}</h1>
        <h1 className="text-md">
          Verified: {user.verified ? "true" : "false"}
        </h1>
      </div>

      <div className="@container my-4 flex flex-col gap-8 rounded-lg border p-8">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-xl font-semibold">File Complaint</h1>
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="@md:grid-cols-2 grid grid-cols-1 gap-x-8 gap-y-4"
        >
          {formDetails.map((e, idx) => {
            return (
              <span key={idx}>
                <Input
                  name={e.name}
                  label={e.label}
                  placeholder={e.placeholder}
                  required
                  type={"text"}
                  onChange={handleChange}
                />
              </span>
            );
          })}

          <br />

          {isError && !isLoading && (
            <>
              <div className="text-red-500">
                {error?.message ? error?.message : ""}
              </div>
            </>
          )}
          <div className={`flex flex-col gap-2`}>
            Execute two transactions in your wallet to create your profile.
            <Button type="submit" label="Create Profile" />
          </div>
        </form>
      </div>
    </>
  );
};
