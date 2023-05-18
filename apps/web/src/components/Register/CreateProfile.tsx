import Input from "../common/Input";
import ReactSelect from "react-select";
import { dropdownStyles } from "../common/styles";
import { ChangeEvent, useEffect, useState } from "react";
import Button from "../common/Button";
import { useAuth } from "@app/hooks/useAuth";
import { z } from "zod";
import { api } from "@app/utils/api";
import { useSigner } from "wagmi";
import { ethers } from "ethers";

// z.object({
//   name: z.string(),
//   serial_number: z.string(),
//   quantity: z.coerce.string(),
//   description: z.string().optional(),
//   order_from: z.string().refine((value) => utils.isAddress(value), {
//     message: "Provided address is invalid.",
//   }),
// });
const defaultFormState = {
  first_name: "",
  last_name: "",
  address: "",
  phone_number: 0,
  email: "",
};

const formDetails = [
  {
    name: "first_name",
    label: "First Name",
    placeholder: "Enter First Name",
  },
  {
    name: "last_name",
    label: "Last Name",
    placeholder: "Enter Last Name",
  },
  {
    name: "address",
    label: "Address",
    placeholder: "Enter Address",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter Email",
    type: "email",
  },
  {
    name: "phone_number",
    label: "Phone Number",
    placeholder: "Enter Phone Number",
    type: "number",
  },
];

const base_schema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  address: z.string(),
  phone_number: z.coerce.number(),
  email: z.string().email(),
});

export default function CreateProfile() {
  useAuth();
  const { data: signer } = useSigner();
  const [formState, setFormState] =
    useState<typeof defaultFormState>(defaultFormState);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  const { mutateAsync, error, isError, isLoading } =
    api.user.createProfile.useMutation();
  const handleSubmit = async () => {
    try {
      if (window.ethereum && signer) {
        const address = await signer.getAddress();
        const data = JSON.stringify(base_schema.parse(formState));
        const hash = ethers.utils.keccak256(
          ethers.utils.toUtf8Bytes(JSON.stringify(data))
        );
        const hashBuffer = ethers.utils.arrayify(hash);
        const sign = await signer.signMessage(hashBuffer);
        await mutateAsync({ formState, address: address, sign });
      } else {
        alert("Please install metamask");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="@container my-4 flex flex-col gap-8 rounded-lg border p-8">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-xl font-semibold">Enter User Details</h1>
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
                type={e.type ?? "text"}
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
  );
}
